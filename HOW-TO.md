# HOW-TO — Guía Completa de TU-RED

## 🎯 ¿Qué es TU-RED?

TU-RED es un framework JavaScript minimalista **construido desde cero** que te permite entender cómo funcionan internamente los frameworks modernos como React. 

El objetivo es educativo: demostrar conceptos fundamentales sin la complejidad de librerías grandes.

### Características principales:
- ✨ Componentes funcionales con JSX
- 🔄 Virtual DOM para renderizado eficiente
- 📦 Gestión de estado con arquitectura FLUX
- ⚡ Renderizado automático reactivo
- 📄 Implementado en un único archivo (`tu-red.js`)
- 🎨 Sin dependencias de frameworks externos

---

## 📦 Instalación y Configuración

### 1. Copiar el framework

Copia `tu-red.js` a tu proyecto:

```bash
cp tu-red.js src/tu-red.js
```

### 2. Configurar Vite para JSX

En `vite.config.js`, configura el transpilador JSX para usar `crearElemento`:

```javascript
import { defineConfig } from "vite";

export default defineConfig({
    oxc: {
        jsx: {
            runtime: "classic",
            pragma: "crearElemento",      // Función que transpila JSX
            pragmaFrag: "Fragmento"       // Para Fragmentos <>...</>
        }
    }
});
```

### 3. Importar en tu aplicación

```javascript
import { 
    crearElemento, 
    crearAlmacen, 
    crearAplicacion 
} from "./tu-red.js";
```

---

## 🧩 Conceptos Fundamentales

### 1. **Elementos (Nodos virtuales)**

Un elemento es la representación de un nodo DOM:

```javascript
// Usando la función crearElemento() directamente
crearElemento("div", { className: "contenedor" }, "Hola Mundo");

// O usando JSX (más legible)
<div className="contenedor">
    Hola Mundo
</div>
```

**¿Qué hace `crearElemento()`?**
- `tipo`: nombre del elemento HTML o un componente
- `propiedades`: atributos, clases, estilos, eventos
- `...hijos`: contenido dentro del elemento

### 2. **Componentes**

Un componente es una función que retorna elementos JSX:

```javascript
function Saludo({ nombre, edad }) {
    return (
        <div>
            <h1>Hola, {nombre}!</h1>
            <p>Tienes {edad} años</p>
        </div>
    );
}

// Usarlo en JSX
<Saludo nombre="Juan" edad={25} />
```

**Características:**
- Reciben `props` (propiedades)
- Pueden acceder a `props.hijos` para contenido anidado
- Retornan JSX (que se transpila a `crearElemento()`)

### 3. **Virtual DOM**

El Virtual DOM es una representación en memoria del DOM real. TU-RED:
1. Crea el DOM virtual (el árbol de elementos)
2. Lo convierte en nodos DOM reales
3. Cuando el estado cambia, compara el Virtual DOM anterior con el nuevo
4. Actualiza **solo** los nodos que cambiaron

**Beneficio:** No renderiza todo el DOM de nuevo. Es más rápido.

### 4. **Arquitectura FLUX**

FLUX es un patrón para gestionar estado:

```
┌─────────────────────────────────┐
│  Usuario interactúa con la UI   │
└──────────────────┬──────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Acción: {            │
        │   tipo: "INCREMENTAR"│
        │   valor: 5           │
        │ }                    │
        └──────────────┬───────┘
                       │
                       ▼
              ┌────────────────┐
              │ Reducer        │
              │ (previo estado)│
              │ + acción →     │
              │ nuevo estado   │
              └────────┬───────┘
                       │
                       ▼
              ┌────────────────┐
              │ Almacén        │
              │ (guarda estado)│
              │ + notifica     │
              └────────┬───────┘
                       │
                       ▼
           ┌──────────────────────┐
           │ Renderizar con       │
           │ nuevo estado         │
           │ (auto-actualiza UI)  │
           └──────────────────────┘
```

---

## 🛠️ Cómo Crear una Aplicación

### Paso 1: Definir el estado inicial

```javascript
const almacen = crearAlmacen({
    contador: 0,
    mensaje: ""
});
```

### Paso 2: Crear un reductor (reducer)

La función `reductor` procesa acciones y actualiza el estado:

```javascript
function reductor(estado, accion) {
    if (accion.tipo === "INCREMENTAR") {
        return {
            ...estado,
            contador: estado.contador + accion.valor
        };
    }
    
    if (accion.tipo === "DECREMENTAR") {
        return {
            ...estado,
            contador: estado.contador - accion.valor
        };
    }
    
    if (accion.tipo === "ESTABLECER_MENSAJE") {
        return {
            ...estado,
            mensaje: accion.valor
        };
    }
    
    return estado; // Si no reconoce la acción, devuelve el estado igual
}
```

### Paso 3: Crear un componente

```javascript
function Contador({ estado, enviarAccion }) {
    return (
        <div>
            <h1>Contador: {estado.contador}</h1>
            
            <button onclick={() => enviarAccion(
                { tipo: "INCREMENTAR", valor: 1 }, 
                reductor
            )}>
                + Incrementar
            </button>
            
            <button onclick={() => enviarAccion(
                { tipo: "DECREMENTAR", valor: 1 }, 
                reductor
            )}>
                - Decrementar
            </button>
        </div>
    );
}
```

### Paso 4: Inicializar la aplicación

```javascript
function App(estado) {
    return (
        <Contador 
            estado={estado} 
            enviarAccion={(accion) => almacen.enviarAccion(accion, reductor)}
        />
    );
}

crearAplicacion(
    App,
    document.getElementById("app"),
    almacen
);
```

---

## 📝 Manejo de Eventos

TU-RED soporta eventos HTML estándar usando la convención `on` + nombre del evento:

```javascript
// Clic
<button onclick={miFuncion}>Click</button>

// Entrada de texto
<input oninput={miFuncion} />
<input onchange={miFuncion} />

// Formulario
<form onsubmit={miFuncion}>...</form>

// Enfoque
<input onfocus={miFuncion} />
<input onblur={miFuncion} />

// Deslizar ratón
<div onmouseover={miFuncion}>Hover</div>
<div onmouseout={miFuncion}>Salir</div>
```

### Ejemplo completo:

```javascript
function Formulario({ estado, enviarAccion }) {
    function cambiarNombre(evento) {
        enviarAccion({
            tipo: "CAMBIAR_NOMBRE",
            valor: evento.target.value
        });
    }
    
    function enviar(evento) {
        evento.preventDefault(); // Prevenir recarga de página
        enviarAccion({ tipo: "ENVIAR" });
    }
    
    return (
        <form onsubmit={enviar}>
            <input 
                type="text" 
                oninput={cambiarNombre}
                value={estado.nombre}
            />
            <button type="submit">Enviar</button>
        </form>
    );
}
```

---

## 🎨 Estilos y Atributos HTML

### Clases CSS

```javascript
<div className="contenedor activo">Contenido</div>
```

### Estilos inline (objeto)

```javascript
<div style={{ 
    color: "red", 
    backgroundColor: "blue",
    fontSize: "16px"
}}>
    Texto rojo
</div>
```

### Atributos HTML

```javascript
<input 
    type="email" 
    placeholder="Ingresa tu email"
    disabled={false}
    required={true}
/>

<img src="foto.jpg" alt="Descripción" />
```

---

## 🔄 Renderizado Condicional

### If ternario

```javascript
<div>
    {estado.conectado ? (
        <p>Bienvenido!</p>
    ) : (
        <p>Por favor, inicia sesión</p>
    )}
</div>
```

### If corto (&&)

```javascript
<div>
    {estado.mostrarMensaje && (
        <p>{estado.mensaje}</p>
    )}
</div>
```

### Null o false (no se renderiza)

```javascript
{estado.error ? <div className="error">{estado.error}</div> : null}
```

---

## 📋 Listas (map)

```javascript
function ListaTareas({ tareas }) {
    return (
        <ul>
            {tareas.map((tarea, indice) => (
                <li key={indice}>{tarea.nombre}</li>
            ))}
        </ul>
    );
}

// Uso
<ListaTareas tareas={[
    { nombre: "Estudiar" },
    { nombre: "Programar" },
    { nombre: "Dormir" }
]} />
```

---

## 💾 API Completa de TU-RED

### `crearElemento(tipo, propiedades, ...hijos)`
Crea un nodo virtual.

```javascript
crearElemento("button", { className: "btn" }, "Click aquí")
```

### `crearAlmacen(estadoInicial)`
Crea el almacén de estado.

```javascript
const almacen = crearAlmacen({ contador: 0 });
```

**Métodos:**
- `obtenerEstado()` - Obtiene el estado actual
- `suscribirse(funcion)` - Se suscribe a cambios
- `enviarAccion(accion, reductor)` - Envía una acción

### `crearAplicacion(componente, contenedor, almacen)`
Inicializa la aplicación.

```javascript
crearAplicacion(App, document.getElementById("app"), almacen);
```

### `renderizar(elemento, contenedor)`
Renderiza manualmente un elemento (menos común).

```javascript
renderizar(
    <div>Contenido</div>,
    document.getElementById("app")
);
```

---

## 🔧 Ejemplo Completo: Aplicación de Todo

```javascript
import { 
    crearElemento, 
    crearAlmacen, 
    crearAplicacion 
} from "./tu-red.js";

// 1. Estado inicial
const almacen = crearAlmacen({
    tareas: [],
    inputValor: ""
});

// 2. Reductor
function reductor(estado, accion) {
    if (accion.tipo === "CAMBIAR_INPUT") {
        return { ...estado, inputValor: accion.valor };
    }
    
    if (accion.tipo === "AGREGAR_TAREA") {
        return {
            ...estado,
            tareas: [...estado.tareas, accion.tarea],
            inputValor: ""
        };
    }
    
    if (accion.tipo === "ELIMINAR_TAREA") {
        return {
            ...estado,
            tareas: estado.tareas.filter((_, i) => i !== accion.indice)
        };
    }
    
    return estado;
}

// 3. Componente
function App(estado) {
    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h1>📝 Mis Tareas</h1>
            
            <input
                type="text"
                placeholder="Nueva tarea..."
                value={estado.inputValor}
                oninput={(e) => almacen.enviarAccion(
                    { tipo: "CAMBIAR_INPUT", valor: e.target.value },
                    reductor
                )}
            />
            
            <button onclick={() => {
                if (estado.inputValor.trim()) {
                    almacen.enviarAccion(
                        { tipo: "AGREGAR_TAREA", tarea: estado.inputValor },
                        reductor
                    );
                }
            }}>
                ➕ Agregar
            </button>
            
            <ul>
                {estado.tareas.map((tarea, i) => (
                    <li key={i}>
                        {tarea}
                        <button onclick={() => almacen.enviarAccion(
                            { tipo: "ELIMINAR_TAREA", indice: i },
                            reductor
                        )}>
                            ❌
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// 4. Inicializar
crearAplicacion(
    App,
    document.getElementById("app"),
    almacen
);
```

---

## ❓ Preguntas Frecuentes

### ¿Por qué mi componente no se actualiza?
- Asegúrate de que estés usando `enviarAccion()` del almacén
- Verifica que el reductor esté retornando un nuevo objeto de estado
- No mutés directamente el estado: usa spread operator `{ ...estado }`

### ¿Cómo paso props a componentes?
```javascript
<MiComponente nombre="Juan" edad={25} />

function MiComponente({ nombre, edad }) {
    return <p>{nombre} tiene {edad} años</p>;
}
```

### ¿Puedo usar múltiples almacenes?
Sí, aunque no es recomendable. Lo ideal es un almacén central:

```javascript
const almacen1 = crearAlmacen({ contador: 0 });
const almacen2 = crearAlmacen({ mensaje: "" });
```

### ¿Cómo optimizo el rendimiento?
- El Virtual DOM ya optimiza automáticamente
- Evita renderizaciones innecesarias moviendo la lógica al reductor
- Para listas grandes, usa keys únicas

---

## 🎓 Recursos Educativos

- Estudia `tu-red.js` para entender cómo funciona el Virtual DOM
- Compara con la documentación de React
- Experimenta modificando el código
- Crea tus propias aplicaciones

**¡Felicidades! Ya eres un "framework master"! 🎉**