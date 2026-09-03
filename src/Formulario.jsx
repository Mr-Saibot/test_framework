import { crearElemento } from "./tu-red.js";

export function Formulario({ estado, enviarAccion }) {

    function cambiarNombre(evento) {
        enviarAccion({
            tipo: "CAMBIAR_NOMBRE",
            valor: evento.target.value
        });
    }

    function cambiarEmail(evento) {//evento
        enviarAccion({
            tipo: "CAMBIAR_EMAIL",//tipo de evento
            valor: evento.target.value//valor del evento
        });
    }

    function cambiarMensaje(evento) {
        enviarAccion({
            tipo: "CAMBIAR_MENSAJE",
            valor: evento.target.value
        });
    }

    function enviarFormulario(evento) {

        evento.preventDefault();//previene recarga

        enviarAccion({
            tipo: "ENVIAR"
        });
    }

    return (
        <main>

            <h1>
                Formulario con TU-RED
            </h1>

            <form onsubmit={enviarFormulario}>

                <p>Nombre</p>

                <input type="text" value={estado.nombre} oninput={cambiarNombre}
/>

                <p>Email</p>

                <input type="email" value={estado.email} oninput={cambiarEmail}
/>

                <p>Mensaje</p>

                <textarea value={estado.mensaje} oninput={cambiarMensaje} ></textarea>

                <br />

                <button type="submit">
                    Enviar
                </button>

            </form>

            <hr />

            <h2>
                Estado actual
            </h2>

            <p>
                Nombre: {estado.nombre}
            </p>

            <p>
                Email: {estado.email}
            </p>

            <p>
                Mensaje: {estado.mensaje}
            </p>

            {estado.enviado && (

    <section>

        <h2>
            Formulario enviado
        </h2>

        <p>
            Nombre: {estado.resultado.nombre}
        </p>

        <p>
            Email: {estado.resultado.email}
        </p>

        <p>
            Mensaje: {estado.resultado.mensaje}
        </p>

    </section>

)}

        </main>
    );
}