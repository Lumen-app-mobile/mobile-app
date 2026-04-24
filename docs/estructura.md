# Guia de estructura y calidad del codigo

## Objetivo

Este documento define como debe organizarse el codigo del proyecto para que sea facil de leer, mantener y reutilizar.

El criterio principal es: el codigo debe entenderse rapido por una persona que no lo haya escrito.

## Rutas importantes del proyecto

- `app/`: pantallas y rutas de Expo Router.
- `components/ui/`: componentes base de interfaz.
- `components/layout/`: componentes estructurales compartidos, como headers o contenedores.
- `components/navigation/`: componentes relacionados con navegacion.
- `constants/colors.js`: colores del sistema de diseno.
- `services/`: conexiones externas y servicios, como Firebase.
- `assets/data/dataFigma.json`: referencia de tokens, medidas y valores extraidos de Figma.

## Documentacion de estructura

- `docs/ESTRUCTURA_PROYECTO.md` es la fuente de verdad para saber donde va cada cosa.
- Cuando se cree una carpeta nueva, se mueva una carpeta existente o se anada un nuevo tipo de archivo, se debe actualizar `docs/ESTRUCTURA_PROYECTO.md`.
- La actualizacion debe explicar:
  - Para que sirve la carpeta o archivo.
  - Que tipo de codigo o documentacion debe contener.
  - Un ejemplo de ruta real.
  - Que se debe rellenar cuando se cree algo nuevo dentro de esa carpeta.
- Si se crea un componente reutilizable nuevo, tambien debe quedar reflejado el patron en `docs/ESTRUCTURA_PROYECTO.md` si cambia o amplia la estructura actual.

## Estructura general del codigo

- El codigo debe estar agrupado por secciones siempre que sea posible.
- Orden recomendado en componentes:
    1. Imports.
    2. Tipos e interfaces.
    3. Constantes de estilos, variantes o configuracion.
    4. Funciones auxiliares.
    5. Componente principal.
- Las variables y constantes externas al `return` deben agruparse por responsabilidad.
- Los nombres de variables, funciones, props y componentes deben ser autodescriptivos.
- Se evitaran abreviaturas poco claras.
- Se priorizara codigo explicito y facil de leer.
- Si una condicion compleja se entiende mejor con `if`, se usara `if` antes que ternarias encadenadas.
- No se mezclaran responsabilidades visuales, logica de negocio y navegacion si pueden separarse.

## TypeScript

- Todas las props de componentes deben tener tipo explicito.
- Se usara `interface` o `type` para documentar las props.
- Las variantes visuales deben limitarse con unions, por ejemplo: `variant?: "primary" | "secondary" | "danger"`.
- Se evitara `any` salvo caso justificado.
- Los tipos compartidos deben moverse a una ubicacion comun si se reutilizan.

## Estilos

- La libreria principal de estilos es NativeWind.
- Los estilos visuales deben usar `className` siempre que sea posible.
- Los estilos inline se reservan para valores dinamicos o propiedades no cubiertas comodamente por NativeWind.
- Los colores deben salir de `constants/colors.js`.
- Los tokens de diseno estan disponibles en `assets/data/dataFigma.json`.
- No se deben escribir colores hexadecimales directamente en componentes salvo excepcion justificada.
- Los tamanos, paddings, gaps, bordes y line-heights deben respetar el diseno de Figma cuando exista referencia.
- Las variantes visuales deben definirse mediante mapas de estilos, no mediante logica repetida dentro del JSX.

## Componentes

- Se priorizara la reutilizacion de componentes existentes.
- Antes de crear un componente nuevo, revisar `components/` y `components/ui/`.
- Un componente nuevo debe crearse cuando:
  - Se repite una misma UI en mas de un sitio.
  - Tiene variantes claras.
  - Encapsula una interaccion o estado reutilizable.
  - Mejora la legibilidad de una pantalla.
- No se debe crear un componente si solo oculta una linea de JSX sin aportar claridad.
- Los componentes UI base deben vivir en `components/ui`.
- Los componentes de layout compartido deben vivir en `components/layout`.
- Los componentes de navegacion deben vivir en `components/navigation`.
- Los componentes reutilizables importantes deben tener carpeta propia con `Componente.tsx` y `Componente.md`.
- Cuando se cree un componente reutilizable nuevo, se debe crear tambien su documentacion `.md` en la misma carpeta.
- Ejemplo de estructura obligatoria para componentes reutilizables:

```bash
components/ui/Button/
  Button.tsx
  Button.md
```

- Los componentes especificos de una pantalla deben vivir cerca de la pantalla o en una carpeta mas concreta si el proyecto la define.
- Siempre se priorizara la reutilizacion de componentes.

## Expo y React Native

- Se priorizaran APIs de Expo cuando aporten mejor integracion, rendimiento o mantenimiento.
- Se evitaran librerias externas si Expo ya cubre correctamente el caso de uso.
- Los componentes deben funcionar correctamente en mobile y, si aplica, en web.
- Se deben respetar `SafeArea`, navegacion de Expo Router y patrones existentes del proyecto.

## Documentacion de componentes

Cada componente reutilizable debe tener un `.md` explicando como funciona y como esta estructurado en Figma cuando exista referencia de diseno.

La documentacion debe vivir junto al componente, siguiendo el mismo patron que `components/ui/Button/Button.md`.

Plantilla recomendada:

````md
# NombreDelComponente

## Descripcion

Que problema resuelve el componente y cuando debe usarse.

## Props

| Prop | Tipo | Requerida | Descripcion |
| ---- | ---- | --------- | ----------- |
| variant | `"primary" | "secondary"` | No | Define el estilo visual |

## Ejemplo

```tsx
<Button variant="primary" size="md" onPress={handlePress}>
  Guardar
</Button>
```

## Variantes

- `primary`: accion principal.
- `secondary`: accion secundaria.
- `danger`: accion destructiva.

## Notas de diseno

Referencia a colores, tamanos o tokens usados desde Figma.
````

## Comentarios

- Los comentarios deben explicar decisiones, no repetir lo que el codigo ya dice.
- Se permiten comentarios breves en bloques complejos.
- No se deben dejar comentarios obvios si el nombre de la variable, funcion o componente ya lo explica.

## Criterios antes de terminar una tarea

Antes de dar una tarea por finalizada:

- El codigo compila.
- No hay errores de TypeScript.
- No hay errores de lint.
- El componente o pantalla respeta los colores y tokens del diseno.
- No se ha duplicado logica o UI ya existente.
- Los nombres son claros.
- Las props estan tipadas.
- Si se creo un componente reutilizable, tiene documentacion `.md`.
