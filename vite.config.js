import { defineConfig } from "vite";

export default defineConfig({
    oxc: {//oxc tranforma jsx en js q el navegador puede ejecutar
        jsx: {
            runtime: "classic",//modo clasico de transformacion
            pragma: "crearElemento",//si encuentra jsx usar crearElemento
            pragmaFrag: "Fragmento"// para usar <> </> pero no lo hago
        }
    }
});