# Guia de estructura y calidad del codigo

## Objetivo

Este documento define como debe organizarse el codigo del proyecto para que sea facil de leer, mantener y reutilizar.

El criterio principal es: el codigo debe entenderse rapido por una persona que no lo haya escrito.

---

## Rutas importantes del proyecto

- `app/`: pantallas y rutas de Expo Router.
- `components/ui/`: componentes base de interfaz.
- `components/layout/`: componentes estructurales compartidos, como headers o contenedores.
- `components/navigation/`: componentes relacionados con navegacion.
- `constants/colors.js`: colores del sistema de diseno.
- `services/`: conexiones externas y servicios, como Firebase.
- `assets/data/dataFigma.json`: referencia de tokens, medidas y valores extraidos de Figma.

---

## Cuándo preguntar antes de actuar

Antes de escribir codigo o documentacion, hay que preguntar si falta alguno de estos elementos:

- El nodo de Figma al que se hace referencia no existe, esta desactualizado o es ambiguo.
- El componente que hay que crear o modificar no esta claro en cuanto a su alcance.
- Existe un componente similar ya en `components/` y no esta claro si reutilizar o crear uno nuevo.
- La pantalla o flujo en el que encaja el componente no se ha especificado.

No se debe preguntar sobre convenciones de codigo, estructura de carpetas o estilos: eso ya esta definido en este documento.

Si el nodo de Figma existe pero tiene informacion incompleta o contradictoria, se documenta la ambiguedad en el `.md` del componente y se toma la decision mas conservadora posible, anotando que requiere validacion.

---

## Implementacion desde Figma

Esta es la seccion mas operativa del documento. Se aplica cada vez que se implementa un componente nuevo a partir de un nodo de Figma.

### Proceso obligatorio

1. Leer el nodo principal de Figma.
2. Identificar variantes, estados y nodos hijos relevantes.
3. Leer cada variante individual si existe — no implementar solo desde el wrapper.
4. Extraer tokens y medidas antes de crear el componente: `width`, `padding`, `gap`, `border`, `shadow`, `fontFamily`, `fontSize`, `lineHeight`.
5. Crear `Componente.tsx`.
6. Crear `Componente.md` con referencias a todos los nodos usados.
7. Mostrar el componente en una pantalla de prueba si el usuario lo pide o si hace falta validar visualmente.
8. Validar TypeScript, lint y comparacion visual contra Figma.

El componente no se da por terminado solo porque TypeScript y lint pasen. La comparacion visual contra Figma es parte del criterio de finalizado.

### Cuando Figma es ambiguo o incompleto

Si un nodo de Figma esta incompleto, desactualizado o en conflicto con el codigo existente:

- No bloquear la implementacion. Tomar la decision mas conservadora.
- Anotar la ambiguedad en el `.md` del componente, en una seccion `## Pendiente de validacion`.
- Preguntar al usuario solo si la ambiguedad afecta al comportamiento funcional del componente, no a detalles visuales menores.

### Criterio NativeWind vs estilos inline

- Usar `className` de NativeWind para estilos de layout, espaciado y colores cuando la clase reproduce fielmente el diseno.
- Usar `style` con valores exactos cuando:
  - La clase de NativeWind no existe o no reproduce el valor exacto de Figma.
  - El valor es dinamico y depende de props o estado.
  - Se trata de medidas criticas en componentes visuales pequenos: `width`, `height`, `borderRadius`, `fontSize`, `lineHeight`, `letterSpacing`.
- Nunca mezclar ambos enfoques para la misma propiedad en el mismo componente.

### Variantes

- Cada variante de Figma debe mapearse contra una prop del componente, normalmente `variant`, `state` o `size`.
- Las variantes visuales deben definirse mediante mapas de estilos, no mediante logica repetida dentro del JSX.
- Ejemplo:

```tsx
const variantStyles = {
  primary: "bg-blue-600 text-white",
  secondary: "bg-transparent border border-blue-600 text-blue-600",
  danger: "bg-red-600 text-white",
};
```

---

## Componentes

- Se priorizara la reutilizacion de componentes existentes.
- Antes de crear un componente nuevo, revisar `components/` y `components/ui/`.
- Un componente nuevo debe crearse cuando:
  - Se repite una misma UI en mas de un sitio.
  - Tiene variantes claras.
  - Encapsula una interaccion o estado reutilizable.
  - Mejora la legibilidad de una pantalla.
- No se debe crear un componente si solo oculta una linea de JSX sin aportar claridad.

### Ubicacion

- Componentes UI base → `components/ui/`
- Componentes de layout compartido → `components/layout/`
- Componentes de navegacion → `components/navigation/`
- Componentes especificos de una pantalla → junto a la pantalla, o en una carpeta mas concreta si el proyecto la define.

### Estructura obligatoria para componentes reutilizables

```bash
components/ui/Button/
  Button.tsx
  Button.md
```

Cuando se crea un componente reutilizable nuevo, se crea tambien su `.md` en la misma carpeta.

---

## Documentacion de componentes

Cada componente reutilizable debe tener un `.md` que explique como funciona y como esta estructurado en Figma.

Plantilla:

````md
# NombreDelComponente

## Descripcion

Que problema resuelve el componente y cuando debe usarse.

## Props

| Prop    | Tipo                          | Requerida | Descripcion           |
| ------- | ----------------------------- | --------- | --------------------- |
| variant | `"primary" \| "secondary"`   | No        | Define el estilo visual |

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

## Nodos de Figma

Lista de nodos usados durante la implementacion, con su ID o ruta en el archivo.

## Pendiente de validacion

Ambiguedades o decisiones que requieren confirmacion del diseñador o del usuario.

## Notas de diseno

Colores, tamanos o tokens usados desde `constants/colors.js` o `assets/data/dataFigma.json`.
````

---

## Estructura general del codigo

- El codigo debe estar agrupado por secciones siempre que sea posible.
- Orden en componentes:
  1. Imports.
  2. Tipos e interfaces.
  3. Constantes de estilos, variantes o configuracion.
  4. Funciones auxiliares.
  5. Componente principal.
- Las variables y constantes externas al `return` deben agruparse por responsabilidad.
- Los nombres de variables, funciones, props y componentes deben ser autodescriptivos. Se evitaran abreviaturas poco claras.
- Si una condicion compleja se entiende mejor con `if`, se usara `if` antes que ternarias encadenadas.
- No se mezclaran responsabilidades visuales, logica de negocio y navegacion si pueden separarse.

---

## TypeScript

- Todas las props de componentes deben tener tipo explicito.
- Se usara `interface` o `type` para documentar las props.
- Las variantes visuales deben limitarse con unions: `variant?: "primary" | "secondary" | "danger"`.
- Se evitara `any` salvo caso justificado y comentado.
- Los tipos compartidos deben moverse a una ubicacion comun si se reutilizan en mas de un componente.

---

## Estilos

- La libreria principal de estilos es NativeWind.
- Los colores deben salir de `constants/colors.js`.
- Los tokens de diseno estan disponibles en `assets/data/dataFigma.json`.
- No se deben escribir colores hexadecimales directamente en componentes salvo excepcion justificada y comentada.
- Los tamanos, paddings, gaps, bordes y line-heights deben respetar el diseno de Figma cuando exista referencia.
- El criterio para elegir entre NativeWind y estilos inline esta definido en la seccion **Implementacion desde Figma**.

---

## Expo y React Native

- Se priorizaran APIs de Expo cuando aporten mejor integracion, rendimiento o mantenimiento.
- Se evitaran librerias externas si Expo ya cubre correctamente el caso de uso.
- Los componentes deben funcionar correctamente en mobile y, si aplica, en web.
- Se deben respetar `SafeArea`, navegacion de Expo Router y patrones existentes del proyecto.

---

## Comentarios

- Los comentarios deben explicar decisiones, no repetir lo que el codigo ya dice.
- Se permiten comentarios breves en bloques complejos o en decisiones no evidentes.
- No se deben dejar comentarios obvios si el nombre de la variable, funcion o componente ya lo explica.
- Las excepciones a las reglas de este documento (uso de `any`, colores hexadecimales inline, etc.) deben ir acompanadas de un comentario que explique el motivo.

---

## Criterios antes de terminar una tarea

### Bloqueantes — la tarea no puede darse por terminada si alguno falla

- [ ] El codigo compila sin errores.
- [ ] No hay errores de TypeScript.
- [ ] No hay errores de lint.
- [ ] Las props estan tipadas.
- [ ] Si se creo un componente reutilizable, tiene su `.md` con todos los nodos de Figma referenciados.

### Recomendados — se deben cumplir salvo razon justificada

- [ ] El componente o pantalla respeta los colores y tokens del diseno.
- [ ] No se ha duplicado logica o UI ya existente en `components/`.
- [ ] Los nombres de variables, funciones y componentes son claros sin necesidad de comentario.
- [ ] Si habia ambiguedades de Figma, estan documentadas en la seccion `## Pendiente de validacion` del `.md`.

---

## Documentacion del proyecto

- `docs/ESTRUCTURA_PROYECTO.md` es la fuente de verdad para saber donde va cada cosa.
- Cuando se cree una carpeta nueva, se mueva una carpeta existente o se anada un nuevo tipo de archivo, se debe actualizar `docs/ESTRUCTURA_PROYECTO.md`.
- La actualizacion debe explicar:
  - Para que sirve la carpeta o archivo.
  - Que tipo de codigo o documentacion debe contener.
  - Un ejemplo de ruta real.
  - Que se debe rellenar cuando se cree algo nuevo dentro de esa carpeta.
- Si se crea un componente reutilizable nuevo, tambien debe quedar reflejado en `docs/ESTRUCTURA_PROYECTO.md` si cambia o amplia la estructura actual.

### Flujo para crear o modificar documentacion

Cuando se cree o modifique documentacion importante, se seguira este flujo:

1. **Contexto**: identificar que problema real resuelve el documento o la regla. Si falta contexto, preguntar antes de escribir.
2. **Estructura**: trabajar por secciones, no como un bloque. No reescribir un documento entero si basta con actualizar una seccion.
3. **Redaccion**: escribir solo lo necesario. Eliminar relleno generico. Evitar repetir informacion ya clara en otro documento.
4. **Prueba de lectura**: revisar como si la leyera alguien sin contexto. Comprobar que no hay supuestos no explicados ni contradicciones con otros documentos.

### Principios de documentacion

- Cada frase debe aportar contexto, criterio o accion.
- Priorizar claridad sobre longitud.
- Evitar frases decorativas o genericamente correctas que no ayuden a trabajar en este repo.
- Cuando se documente un cambio de codigo, incluir rutas reales y ejemplos reales.
- Cuando una documentacion dependa de otra, enlazarla o mencionarla explicitamente.
- Respetar el estilo y estructura que el usuario prefiera salvo que rompa la utilidad del documento.

### Como modificar este documento

Antes de cambiar este archivo, aplicar el mismo flujo:

1. Identificar que problema real resuelve la regla nueva o modificada.
2. Colocarla en la seccion correcta.
3. Escribirla como una accion verificable.
4. Comprobar que no contradice `docs/ESTRUCTURA_PROYECTO.md`.
5. Leerla como alguien sin contexto y confirmar que se entiende que hacer.

Una regla nueva debe responder: cuando se aplica, que hay que hacer, donde hay que hacerlo y como se comprueba que se ha cumplido.

Evitar reglas genericas:

```md
- Revisar bien Figma.
```

Preferir reglas verificables:

```md
- Si existen variantes en Figma, se deben inspeccionar los nodos individuales de cada variante antes de implementar.
```