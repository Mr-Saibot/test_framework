function crearEL(tipo, propiedades = {}, ...hijos){
    return{
        tipo, propiedades, hijos: hijos.flat()
    };
}

function resolverComp(elemento){
    if(elemento === null || elemento === undefined || elemento === false){
        return null;
    }
    if(typeof elemento === 'string' || typeof elemento === 'number'){
        return elemento;
    }

    if(typeof elemento.tipo === 'function' ){
        return resolverComp(elemento.tipo({...elemento.propiedades, hijos: elemento.hijos}));
    }
    return{...elemento, hijos: elemento.hijos.map(resolverComp).filter(hijo => hijo !== null)};

}

function actualizarPropie(nodo, anteriores = {}, nuevas ={}){
    for (const nombre in anteriores){
        if(!(nombre in nuevas)){
            if(nombre.startsWith('on')){
                const evento = nombre.slice(2).toLowerCase();

                nodo.removeEventListener(evento, anteriores[nombre]);
            }else {nodo[nombre] = '';}
        }
    }


    for(const nombre in nuevas){
        const valor = nuevas[nombre];

        if(nombre.startsWith('on')){
           const evento = nombre.slice(2).toLowerCase();

           if(anteriores[nombre]){
             nodo.removeEventListener(evento, anteriores[nombre]);
           }

           if (typeof valor === 'function'){
            nodo.addEventListener(evento, valor);
           }
           continue;
        }

        if(nombre === 'className'){
            nodo.className = valor;
            continue;
        }

        if(nombre === 'style' && typeof valor === 'object'){
            Object.assign(nodo.style, valor);
            continue;
        }
        nodo[nombre] = valor;
    }
}

    function crearNodoReal(elemento){
        if(typeof elemento === 'string' || typeof elemento === 'number'){
            return document.createTextNode(elemento);
        }
        const nodo = document.createElement(elemento.tipo);

        actualizarPropie(nodo, {}, elemento.propiedades);

        elemento.hijos.forEach(hijo =>{
            if(hijo !== null && hijo !== undefined && hijo !== false ){
                nodo.appendeChild(crearNodoReal(hijo));
            }
        });

        return nodo;
    }

    function sonDiferentes(anterior, nuevo){
        if(anterior === undefined || nuevo === undefined){
            return true;
        }

        if(typeof anterior !== typeof nuevo){
            return true;
        }

        if(typeof anterior === 'string' || typeof anterior === 'number'){
            return anterior !== nuevo;
        }

        return anterior.tipo !== nuevo.tipo;
    }

    function actNodo(contenedor, anterior, nuevo, indice = 0){
        const nodoActual = contenedor.childNodes[indice];

        if(anterior === undefined){
            contenedor.appendeChild(crearNodoReal(nuevo));
            return;
        }

        if(nuevo === undefined){
            if(nodoActual){
                contenedor.removeChild(nodoActual);
            }
            return;
        }

        if(typeof nuevo === 'string' || typeof nuevo === 'number'){
            if(anterior !== nuevo){
                nodoActual.textContent = nuevo;
            }
            return;
        }

        actualizarPropie(nodoActual, anterior.propiedades, nuevo.propiedades);

        const hijosAnteriores = anterior.hijos || [];
        const hijosNuevos = nuevo.hijos || [];

        const cantidad = Math.max(hijosAnteriores, hijosNuevos);

        for(let i = 0; i < cantidad; i++){
            actNodo(nodoActual, hijosAnteriores[i], hijosNuevos[i], i);
        }
    }

    function renderizar(elemento, contenedor){
        const nuevoElemento = resolverComp(elemento);
        const anterior = contenedor.__tuRedElemento;

        actNodo(contenedor, anterior, nuevoElemento);
        contenedor.__tuRedElemento = nuevoElemento;
    }

    function crearAlmacen(estadoInicial){
        let estado = estadoInicial;
        const suscriptores = [];

        function obtenerEstado(){
            return estado;
        }
        function suscribirse(funcion){
            suscriptores.push(funcion);
        }

        function enviarAccion(accion, reductor){
            estado =  reductor(estado, accion);

            suscriptores.forEach(funcion =>{
                funcion(estado);
            });
        }

        return{obtenerEstado, suscribirse, enviarAccion};
    }

    function crearApp(componente, contenedor, almacen){
        let estado = almacen
        ? almacen.obtenerEstado()
        : undefined;

        function actualizar(){
            renderizar(componente(estado), contenedor);
        }

        if(almacen){
            almacen.suscribirse(nuevoEstado =>{
                estado = nuevoEstado;
                actualizar();
            });
        }
        actualizar()
    }

    export{crearEL, renderizar, crearAlmacen, crearApp};
