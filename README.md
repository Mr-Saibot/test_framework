# Formulario con TU-RED

Aplicacion de ejemplo construida con **TU-RED**, un framework de JavaScript minimalista creado desde cero para explorar como funcionan el JSX, el Virtual DOM y la gestion de estado con una arquitectura inspirada en FLUX.

El proyecto implementa un formulario con campos para nombre, email y mensaje. Cada cambio se guarda en el estado de la aplicacion y, al enviarlo, los datos se muestran como resultado sin recargar la pagina.

## Caracteristicas

- Componentes funcionales escritos con JSX.
- Virtual DOM y actualizacion de los nodos que cambian.
- Gestion de estado mediante almacen, acciones y reducer.
- Manejo de eventos del navegador (`oninput` y `onsubmit`).
- Renderizado condicional del resultado enviado.
- Sin React, Vue, Angular ni otras librerias de interfaz.

## Requisitos

- Node.js 18 o una version posterior.
- npm, incluido normalmente con Node.js.

## Instalacion y uso

Clona o descarga el repositorio y ejecuta:

```bash
npm install
npm run dev
```

Vite mostrara en la terminal la URL local de la aplicacion, normalmente `http://localhost:5173`.

Para generar una compilacion de produccion:

```bash
npm run build
```

## Como funciona

El formulario sigue este flujo:

```text
Interaccion del usuario
        |
        v
      Accion
        |
        v
     Reducer
        |
        v
   Nuevo estado
        |
        v
  Renderizado del UI
```

1. El usuario escribe en un campo o envia el formulario.
2. `Formulario.jsx` envia una accion al almacen.
3. El reducer de `main.jsx` calcula el siguiente estado.
4. TU-RED vuelve a resolver el Virtual DOM y actualiza la interfaz.

Al enviar el formulario, la accion `ENVIAR` copia los datos a `resultado`, limpia los campos y cambia `enviado` a `true`.

## Estructura del proyecto

```text
formulario/
|- index.html        # Punto de entrada HTML
|- package.json      # Scripts y dependencias de desarrollo
|- vite.config.js    # Configuracion de JSX para Vite
|- src/
   |- main.jsx       # Estado inicial, reducer e inicio de la app
   |- Formulario.jsx # Componentes y vista del formulario
   |- tu-red.js      # Implementacion del framework TU-RED
```

## TU-RED

El nucleo del framework se encuentra en `src/tu-red.js` y expone estas funciones:

| Funcion | Responsabilidad |
| --- | --- |
| `crearElemento()` | Crea nodos del Virtual DOM y permite usar JSX. |
| `renderizar()` | Compara el Virtual DOM y actualiza el DOM real. |
| `crearAlmacen()` | Crea un almacen con estado, suscripciones y acciones. |
| `crearAplicacion()` | Conecta el componente principal con el contenedor y el almacen. |

La configuracion de Vite usa el modo JSX clasico y transforma los elementos JSX mediante `crearElemento`.

## Acciones del formulario

| Accion | Efecto |
| --- | --- |
| `CAMBIAR_NOMBRE` | Actualiza el nombre en el estado. |
| `CAMBIAR_EMAIL` | Actualiza el email en el estado. |
| `CAMBIAR_MENSAJE` | Actualiza el mensaje en el estado. |
| `ENVIAR` | Guarda el resultado, limpia el formulario y muestra la confirmacion. |

## Scripts disponibles

| Comando | Descripcion |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo de Vite. |
| `npm run build` | Genera la compilacion de produccion. |

## Proposito educativo

Este proyecto prioriza la claridad del codigo sobre la cobertura de todas las capacidades de un framework de produccion. Es un punto de partida para experimentar con componentes, eventos, Virtual DOM y flujo unidireccional de datos.