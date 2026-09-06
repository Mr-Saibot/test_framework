function crearElemento(tipo, propiedades = {}, ...hijos) {//tipo=elemento html, prop=id,classname,evento, hijo=el contenido
    return {
        tipo,
        propiedades,
        hijos: hijos.flat()//flat pasa todo a una unica lista
    };
}

function resolverComponente(elemento) {
    if (elemento === null || elemento === undefined ||elemento === false){//Esto permite ignorar elementos que no deben aparecer
        return null;
    }

    if (typeof elemento === "string" || typeof elemento === "number") {//esto detecta texto/numero y lo devuleve
        return elemento;
    }

    if (typeof elemento.tipo === "function") {//si es una funcion la volvemos a resolver
        return resolverComponente(
            elemento.tipo({...elemento.propiedades, hijos: elemento.hijos})
        );
    }

    return {...elemento, hijos: elemento.hijos.map(resolverComponente).filter(hijo => hijo !== null)};//se mapea y se filtra cada hijo
}

function actualizarPropiedades(nodo, anteriores = {}, nuevas = {}) {
    for (const nombre in anteriores) {//recorremos las propiedades antiguas
        if (!(nombre in nuevas)) {
            if (nombre.startsWith("on")) {//detecta si hay algun evento y quita el 'on'
                const evento = nombre.slice(2).toLowerCase();

                nodo.removeEventListener(// eliminamos el listener del evento anterior
                    evento,
                    anteriores[nombre]
                );
            } else {nodo[nombre] = "";}//si no era un evento se limpia nms
        }
    }

    for (const nombre in nuevas) {//recorremos las nuevas propiedades
        const valor = nuevas[nombre];//obtenemos su valor

        if (nombre.startsWith("on")) {
            const evento = nombre.slice(2).toLowerCase();//obtenemos el evento

            if (anteriores[nombre]) {//si existía un evento anterior se elimina
                nodo.removeEventListener(
                    evento,
                    anteriores[nombre]
                );
            }

            if (typeof valor === "function") {// si el valor es una función, la usamos como listener del evento
                nodo.addEventListener(evento, valor);
            }

            continue;
        }

        if (nombre === "className") {
            nodo.className = valor;//se agrega el valor
            continue;
        }

        if (nombre === "style" && typeof valor === "object") {
            Object.assign(nodo.style, valor);//si tiene alguna propiedad css se la asigna
            continue;
        }

        nodo[nombre] = valor;
    }
}

function crearNodoReal(elemento) {
    if (typeof elemento === "string" || typeof elemento === "number") {//si es str o int se crea
        return document.createTextNode(elemento);//Esto sí crea un nodo real del navegador.
    }

    const nodo = document.createElement(elemento.tipo);//si no es texto, ejm=h1

    actualizarPropiedades(//mandamos el nodo creado
        nodo,
        {},
        elemento.propiedades
    );

    elemento.hijos.forEach(hijo => {
        if (hijo !== null && hijo !== undefined && hijo !== false) {//comprobamos que sea valido
            nodo.appendChild(crearNodoReal(hijo));//creamos y agregamos al dom real
        }
    });

    return nodo;
}



function sonDiferentes(anterior, nuevo) {
    if (anterior === undefined || nuevo === undefined) {//si uno de los dos no esta definido
        return true;
    }

    if (typeof anterior !== typeof nuevo) {
        return true;
    }

    if (typeof anterior === "string" || typeof anterior === "number") {
        return anterior !== nuevo;
    }

    return anterior.tipo !== nuevo.tipo;// si ambos son elementos, comprobamos si tienen diferente tipo de etiqueta
}

function actualizarNodo(contenedor, anterior, nuevo, indice = 0) {
    const nodoActual = contenedor.childNodes[indice];// buscamos el nodo real que corresponde a esta posición

    if (anterior === undefined) {// si antes no existía este nodo, creamos el nuevo nodo y lo agregamos
        contenedor.appendChild(crearNodoReal(nuevo));
        return;
    }

    if (nuevo === undefined) {//si no hay nodo nuevo
        if (nodoActual) {
            contenedor.removeChild(nodoActual);//removemos ese nodo
        }
        return;
    }

    if (sonDiferentes(anterior, nuevo)) {//si son diferentes entonces lo reemplazamos
        contenedor.replaceChild(crearNodoReal(nuevo), nodoActual);
        return;
    }

    if (typeof nuevo === "string" || typeof nuevo === "number") {
        if (anterior !== nuevo) {// si el nodo es texto o número, comprobamos si cambió su contenido
            nodoActual.textContent = nuevo;
        }
        return;
    }
    //actualizamos las propiedades
    actualizarPropiedades(nodoActual, anterior.propiedades, nuevo.propiedades);

    const hijosAnteriores = anterior.hijos || [];//obtenemos el contenido de cada elemento
    const hijosNuevos = nuevo.hijos || [];

    const cantidad = Math.max(hijosAnteriores.length, hijosNuevos.length);//Se obtiene la mayor cantidad de hijos entre el árbol anterior y el nuevo

    for (let i = 0; i < cantidad; i++) {// recorremos todas las posiciones de hijos para compararlas
        actualizarNodo(nodoActual, hijosAnteriores[i], hijosNuevos[i], i);
    }
}

function renderizar(elemento, contenedor) {
    const nuevoElemento = resolverComponente(elemento);// resolvemos componentes y obtenemos el nuevo VDOM
    const anterior = contenedor.__tuRedElemento;// recuperamos el VDOM anterior guardado en el contenedor

    actualizarNodo(contenedor, anterior, nuevoElemento);//actualizamos

    contenedor.__tuRedElemento = nuevoElemento;//se guardan los cambios
}

// FLUX: Acción → Reducer → Estado → Renderizado
function crearAlmacen(estadoInicial) {
    let estado = estadoInicial;
    const suscriptores = [];// guardamos las funciones que deben avisarse cuando cambia el estado

    function obtenerEstado() {// permite consultar el estado actual
        return estado;
    }

    function suscribirse(funcion) {// registramos una función que será ejecutada cuando cambie el estado
        suscriptores.push(funcion);
    }

    //'dispacher'
    function enviarAccion(accion, reductor) {
        estado = reductor(estado, accion);// enviamos una acción al reducer para obtener el nuevo estado

        suscriptores.forEach(funcion => {// avisamos a todos los suscriptores que el estado cambió
            funcion(estado);//ejecuta esta funcion y pasa el nuevo estado
        });
    }

    return {obtenerEstado, suscribirse, enviarAccion};//devolvemos los cambios
}

function crearAplicacion(componente, contenedor, almacen) {// recibe el componente principal, el contenedor del DOM y el almacén de estado
    let estado = almacen
        ? almacen.obtenerEstado()//si hay almacen obtener estado
        : undefined;//sino es no esta definido

    function actualizar() {
        renderizar(componente(estado), contenedor);// ejecutamos el componente con el estado actual y renderizamos su resultado
    }

    if (almacen) {// si hay cambios en el store los actualizamos
        almacen.suscribirse(nuevoEstado => { // recibimos el nuevo estado
            estado = nuevoEstado;
            actualizar();// volvemos a renderizar la aplicación
        });
    }

    actualizar();
}

export {
    crearElemento,
    renderizar,
    crearAlmacen,
    crearAplicacion
};