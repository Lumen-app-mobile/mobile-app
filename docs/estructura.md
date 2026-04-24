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

## Flujo para crear o modificar documentacion

Cuando se cree o modifique documentacion importante, se seguira un flujo de coautoria en tres fases:

1. Contexto.
2. Estructura y refinamiento.
3. Prueba de lectura.

### 1. Contexto

Antes de escribir o cambiar un documento, hay que entender:

- Que tipo de documento es: guia, decision tecnica, especificacion, README, documentacion de componente, etc.
- Quien lo va a leer.
- Que debe poder hacer o entender esa persona despues de leerlo.
- Que archivos, Figma nodes, decisiones o restricciones influyen en el documento.
- Si existe una plantilla que haya que respetar.

Si falta contexto importante, se pregunta antes de escribir.

### 2. Estructura y refinamiento

La documentacion se trabaja por secciones, no como un bloque gigante.

Para cada seccion:

- Definir que debe cubrir.
- Detectar si falta informacion.
- Escribir solo lo necesario.
- Eliminar relleno generico.
- Evitar repetir informacion que ya esta clara en otro documento.
- Hacer cambios quirurgicos sobre el texto existente cuando sea posible.

No se debe reescribir un documento entero si basta con actualizar una seccion concreta.

### 3. Prueba de lectura

Antes de dar por buena una documentacion importante, se debe revisar como si la leyera alguien sin contexto previo.

Comprobar:

- Si se entiende el objetivo del documento.
- Si se puede encontrar rapido la informacion importante.
- Si hay supuestos no explicados.
- Si hay contradicciones con otros documentos.
- Si faltan ejemplos reales.
- Si las rutas de archivos siguen existiendo.

### Principios de documentacion

- Una pregunta o decision a la vez: no mezclar varios problemas en una misma seccion.
- Priorizar claridad sobre longitud.
- Mantener la agencia del usuario: si el usuario prefiere un estilo o estructura, respetarlo salvo que rompa la utilidad del documento.
- Cada frase debe aportar contexto, criterio o accion.
- Evitar frases decorativas o genericamente correctas que no ayuden a trabajar en este repo.
- Cuando se documente un cambio de codigo, incluir rutas reales y ejemplos reales.
- Cuando una documentacion dependa de otra, enlazarla o mencionarla explicitamente.

## Como modificar este documento

Antes de cambiar `docs/estructura.md`, se debe aplicar el mismo flujo de documentacion:

1. Contexto: identificar que problema real resuelve la regla.
2. Ubicacion: colocar la regla en la seccion correcta.
3. Redaccion: escribir la regla como una accion verificable.
4. Consistencia: comprobar que no contradice `docs/ESTRUCTURA_PROYECTO.md`.
5. Prueba de lectura: leer la regla como alguien sin contexto y confirmar que se entiende que hacer.

Una regla nueva debe responder:

- Cuando se aplica.
- Que hay que hacer.
- Donde hay que hacerlo.
- Como se comprueba que se ha cumplido.

Evitar reglas genericas como:

```md
- Revisar bien Figma.
```

Preferir reglas verificables como:

```md
- Si existen variantes en Figma, se deben inspeccionar los nodos individuales de cada variante antes de implementar.
```

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

## Implementacion desde Figma

Cuando se implemente un componente a partir de Figma:

- El nodo que se recibe se considera el nodo principal, no necesariamente la unica fuente de verdad.
- Antes de escribir codigo, se debe revisar si el nodo principal contiene variantes, componentes hijos o estados.
- Si existen variantes, se deben inspeccionar los nodos individuales de cada variante.
- La implementacion debe basarse en las variantes individuales, no solo en el wrapper que las agrupa.
- El `.md` del componente debe listar todos los nodos Figma usados.
- Cada variante de Figma debe mapearse contra una prop del componente, normalmente `variant`, `state` o `size`.
- No se debe marcar el componente como terminado solo porque TypeScript y lint pasen.
- En componentes visuales pequenos o muy precisos, se deben usar estilos explicitos para medidas criticas: width, padding, gap, border, shadow, fontFamily, fontSize y lineHeight.
- NativeWind se usara para estilos simples, pero si una clase no reproduce fielmente Figma, se usara `style` con valores exactos.

Proceso obligatorio:

1. Leer el nodo principal de Figma.
2. Identificar variantes, estados y nodos hijos relevantes.
3. Leer cada variante individual si existe.
4. Extraer tokens y medidas antes de crear el componente.
5. Crear `Componente.tsx`.
6. Crear `Componente.md` con referencias a todos los nodos usados.
7. Mostrar el componente en una pantalla de prueba si el usuario lo pide o si hace falta validar visualmente.
8. Validar TypeScript, lint y comparacion visual contra Figma.

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
