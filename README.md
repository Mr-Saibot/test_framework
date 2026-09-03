# TU-RED

TU-RED es un framework de JavaScript minimalista construido desde cero como parte del desafío de crear un framework propio sin utilizar React, Angular, Vue ni otros frameworks existentes.

El objetivo de TU-RED es demostrar cómo funcionan internamente conceptos utilizados por frameworks modernos: JSX, componentes, Virtual DOM, renderizado, eventos y gestión de estado mediante una arquitectura inspirada en FLUX.

## Características

TU-RED implementa:

- Creación de elementos mediante JSX.
- Componentes funcionales.
- Virtual DOM.
- Conversión del Virtual DOM al DOM real.
- Comparación entre versiones del Virtual DOM.
- Actualización eficiente de elementos.
- Manejo de propiedades y eventos.
- Gestión de estado.
- Arquitectura FLUX.
- Renderizado automático cuando cambia el estado.
- Un único archivo como núcleo del framework.

TU-RED no utiliza React, Angular, Vue ni ninguna otra librería de interfaz.

---

# Estructura del framework

El framework está compuesto por las siguientes funciones:

```text
crearElemento()
        ↓
resolverComponente()
        ↓
crearNodoReal()
        ↓
actualizarPropiedades()

Virtual DOM
        ↓
sonDiferentes()
        ↓
actualizarNodo()
        ↓
renderizar()

Estado
        ↓
crearAlmacen()
        ↓
enviarAccion()
        ↓
crearAplicacion()
        ↓
renderizar()