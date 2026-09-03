import { crearEL } from "./framework";
 export function Form({estado, enviarAccion}){
    function cambiarName(evento){
        enviarAccion({tipo: 'CAMBIAR_NAME', valor: evento.target.value});
    }

    function cambiarEmail(evento){
        enviarAccion({tipo:'CAMBIAR_EMAIL', valor: evento.target.value});
    }

    function cambiarMensaje(evento){
        enviarAccion({tipo: 'CAMBIAR_MENSAJE', valor: evento.target.value});
    }

    function enviarForm(evento){
        evento.preventDefault();

        enviarAccion({tipo:'ENVIAR'});
    }

    return(
        <main> 
            
        </main>
    )
 }