import {crearElemento, crearAplicacion, crearAlmacen} from "./tu-red.js";

import { Formulario } from "./Formulario.jsx";


const almacen = crearAlmacen({
    nombre: "",
    email: "",
    mensaje: "",
    enviado: false,
    resultado: {
        nombre: "",
        email: "",
        mensaje: ""
    }
});


function reductor(estado, accion) {

    if (accion.tipo === "CAMBIAR_NOMBRE") {
        return {
            ...estado,//copia lo q ya haya en estado y simplemente agrega lo que le llego
            nombre: accion.valor
        };
    }

    if (accion.tipo === "CAMBIAR_EMAIL") {
        return {...estado,email: accion.valor};
    }

    if (accion.tipo === "CAMBIAR_MENSAJE") {
        return {...estado,mensaje: accion.valor};
    }

    if (accion.tipo === "ENVIAR") {// si la accion es enviar se limpia el form y creamos resultados

    return {
        ...estado,
        nombre: "",
        email: "",
        mensaje: "",

        enviado: true,

        resultado: {
            nombre: estado.nombre,
            email: estado.email,
            mensaje: estado.mensaje
        }
    };
}

    return estado;
}


function App(estado) {

    return (
        <Formulario
            estado={estado}
            enviarAccion={(accion) =>
                almacen.enviarAccion(accion, reductor)
            }
        />
    );
}


crearAplicacion(
    App,//componente principal
    document.getElementById("app"),//raiz html
    almacen//almacen de estados
);