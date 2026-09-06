import { crearElemento } from "./tu-red.js";


function EncabezadoFormulario() {
    return (
        <h1>
            Formulario con TU-RED
        </h1>
    );
}


function CampoNombre({ valor, cambiar }) {
    return (
        <div>
            <p>Nombre</p>

            <input
                type="text"
                value={valor}
                oninput={cambiar}
            />
        </div>
    );
}


function CampoEmail({ valor, cambiar }) {
    return (
        <div>
            <p>Email</p>

            <input
                type="email"
                value={valor}
                oninput={cambiar}
            />
        </div>
    );
}


function CampoMensaje({ valor, cambiar }) {
    return (
        <div>
            <p>Mensaje</p>

            <textarea
                value={valor}
                oninput={cambiar}
            ></textarea>
        </div>
    );
}


function BotonEnviar() {
    return (
        <button type="submit">
            Enviar
        </button>
    );
}


function EstadoActual({ estado }) {
    return (
        <div>
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
        </div>
    );
}


function FormularioEnviado({ estado }) {
    return (
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
    );
}


export function Formulario({ estado, enviarAccion }) {

    function cambiarNombre(evento) {
        enviarAccion({
            tipo: "CAMBIAR_NOMBRE",
            valor: evento.target.value
        });
    }


    function cambiarEmail(evento) {
        enviarAccion({
            tipo: "CAMBIAR_EMAIL",
            valor: evento.target.value
        });
    }


    function cambiarMensaje(evento) {
        enviarAccion({
            tipo: "CAMBIAR_MENSAJE",
            valor: evento.target.value
        });
    }


    function enviarFormulario(evento) {

        evento.preventDefault();

        enviarAccion({
            tipo: "ENVIAR"
        });
    }


    return (
        <main>

            <EncabezadoFormulario />

            <form onsubmit={enviarFormulario}>

                <CampoNombre
                    valor={estado.nombre}
                    cambiar={cambiarNombre}
                />

                <CampoEmail
                    valor={estado.email}
                    cambiar={cambiarEmail}
                />

                <CampoMensaje
                    valor={estado.mensaje}
                    cambiar={cambiarMensaje}
                />

                <br />

                <BotonEnviar />

            </form>

            <EstadoActual estado={estado} />

            {estado.enviado && (
                <FormularioEnviado estado={estado} />
            )}

        </main>
    );
}
