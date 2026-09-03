import { crearEL, crearAlmacen, crearApp} from "./framework";

import { Form } from "./form";


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

function reductor(estado, accion){
    if(accion.tipo === 'CAMBIAR_NAME'){
        return{...estado, nombre: accion.valor};
    }
}