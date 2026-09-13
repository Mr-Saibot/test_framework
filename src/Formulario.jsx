import { crearElemento } from "./tu-red";


function EncabezadoFormulario(){
    return(
        <h1>Formulario usando Tu-Red</h1>
    );
}

function CampoNombre({valor, cambiar}){
    return(
        <div>
            <p>Nombre</p>
            <input type="text" value={valor} oninput={cambiar} />
        </div>
    );
}

function CampoEmail({valor, cambiar}){
    return(
        <div>
            <p>Email</p>
            <input type="email" value={valor} oninput={cambiar}/>
        </div>
    );
}

function CampoMendaje({valor, cambiar}){
    return(
        <div>
            <p>Mensaje</p>
            <textarea value={valor} oninput={cambiar}> </textarea>
        </div>
    );
}

function BotonEnviar(){
    return(
        <button type="submit">
            Enviar
        </button>
    );
}

function EstadoActual({estado}){
    return(
        <div>
            <hr />

            <h2> Estado Actual</h2>

            <p>Nombre: {estado.nombre}</p>

            <p>Email: {estado.email}</p>

            <p>Mensaje: {estado.mensaje}</p>
        </div>
    );
}
function FormularioEnviado({ estado }) {
    // Si aún no se ha enviado ningún formulario, no mostramos nada
    if (estado.resultado.length === 0) {
        return <p>No hay formularios enviados todavía.</p>;
    }

    return (
        <section>
            <h2>Formularios Enviados ({estado.resultado.length})</h2>

            {/* Recorremos el arreglo de resultados */}
            {estado.resultado.map((formulario, index) => (
                <div>
                    <h3>Envío #{index + 1}</h3>
                    <p>Nombre: {formulario.nombre}</p>
                    <p>Email: {formulario.email}</p>
                    <p>Mensaje: {formulario.mensaje}</p>
                </div>
            ))}
        </section>
    );
}


export function Formulario ({estado, enviarAccion}){

    function cambiarNombre(evento){
        enviarAccion({tipo: 'CAMBIAR_NOMBRE', valor: evento.target.value});
    }

    function cambiarEmail(evento){
        enviarAccion({tipo: 'CAMBIAR_EMAIL', valor: evento.target.value});
    }

    function cambiarMensaje(evento){
        enviarAccion({tipo: 'CAMBIAR_MENSAJE', valor: evento.target.value});
    }

    function enviarFormulario(evento){
        evento.preventDefault();

        enviarAccion({tipo: 'ENVIAR'});
    }

    return(
        <main>
            <EncabezadoFormulario />

            <form onsubmit={enviarFormulario}>

                <CampoNombre valor={estado.nombre} cambiar={cambiarNombre} />

                <CampoEmail valor={estado.email} cambiar={cambiarEmail}/>

                <CampoMendaje valor={estado.mensaje} cambiar={cambiarMensaje}/>

                <br />

                <BotonEnviar />
            </form>

        

            {estado.enviado && (
                <FormularioEnviado estado={estado}/>
                
            )}
        </main>
    )
}