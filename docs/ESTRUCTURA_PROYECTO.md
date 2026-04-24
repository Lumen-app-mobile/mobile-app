# Estructura del proyecto

Este documento explica para que sirve cada carpeta principal del proyecto y donde deberia colocarse cada tipo de codigo o documentacion.

## Regla principal

`app/` se reserva para Expo Router. No debe usarse como carpeta general de componentes, servicios o utilidades.

Todo lo reutilizable debe vivir fuera de `app/`.

## Mapa de carpetas

```bash
app/
  _layout.tsx
  index.tsx
  login.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    productos.tsx
    scan.tsx
    config.tsx

components/
  layout/
    Header/
  navigation/
    BottomNavBar/
  ui/
    Button/
    FormInput/
    ItemLista/

constants/

services/

assets/
  data/
  images/

docs/
```

## `app/`

Contiene rutas, layouts y pantallas gestionadas por Expo Router.

Ejemplos:

- `app/_layout.tsx`: layout raiz de la app.
- `app/index.tsx`: entrada inicial.
- `app/login.tsx`: pantalla de login.
- `app/(tabs)/_layout.tsx`: configuracion de tabs.
- `app/(tabs)/index.tsx`: pantalla Home.
- `app/(tabs)/productos.tsx`: pantalla Productos.
- `app/(tabs)/scan.tsx`: pantalla Scan.
- `app/(tabs)/config.tsx`: pantalla Config.

Reglas:

- No meter componentes reutilizables aqui.
- No meter servicios aqui.
- No meter helpers generales aqui.
- Una pantalla puede componer componentes, pero no deberia contener demasiada logica reutilizable.

## `components/`

Contiene componentes reutilizables.

### `components/ui/`

Componentes base de interfaz.

Ejemplos:

- `Button/Button.tsx`
- `FormInput/FormInput.tsx`
- `ItemLista/ItemLista.tsx`
- futuros componentes como `Card.tsx`, `IconButton.tsx`, `EmptyState.tsx`

Usar esta carpeta para piezas pequenas, reutilizables y sin conocimiento fuerte de una pantalla concreta.

Estructura recomendada por componente:

```bash
components/ui/Button/
  Button.tsx
  Button.md
```

### `components/layout/`

Componentes de estructura visual compartida.

Ejemplos:

- `Header/Header.tsx`
- futuros componentes como `ScreenContainer.tsx`, `SectionHeader.tsx`

Usar esta carpeta para componentes que ordenan zonas de pantalla o layout comun.

Estructura recomendada:

```bash
components/layout/Header/
  Header.tsx
  Header.md
```

### `components/navigation/`

Componentes relacionados con navegacion.

Ejemplos:

- `BottomNavBar/BottomNavBar.tsx`

Usar esta carpeta para barras de tabs, menus, items de navegacion o wrappers relacionados con rutas.

Estructura recomendada:

```bash
components/navigation/BottomNavBar/
  BottomNavBar.tsx
  BottomNavBar.md
```

## `constants/`

Contiene valores fijos compartidos.

Ejemplos:

- `colors.js`: colores del sistema de diseno.

Reglas:

- Los colores deben salir de aqui cuando se usen desde JavaScript.
- Las clases de NativeWind usan estos colores a traves de `tailwind.config.js`.

## `services/`

Contiene conexiones con servicios externos.

Ejemplos:

- `firebase.ts`: inicializacion de Firebase y export de `auth`.

Reglas:

- No importar Firebase directamente desde pantallas si se puede encapsular en servicios o hooks.
- A futuro, las funciones de lectura/escritura de Firestore pueden vivir aqui o en subcarpetas como `services/receipts.ts`.

## `assets/`

Contiene recursos estaticos.

### `assets/images/`

Imagenes, logos, iconos y fondos.

### `assets/data/`

Datos estaticos o exportados desde herramientas externas.

Ejemplo:

- `dataFigma.json`: referencia de tokens, medidas y valores del diseno.

## `docs/`

Contiene documentacion del proyecto.

Archivos actuales:

- `conceptosReactNAtive.md`: guia de aprendizaje y conceptos basicos.
- `TODO_LUMEN.md`: hoja de ruta y tareas pendientes.
- `estructura.md`: guia de estructura y calidad del codigo.
- `cambiar-png-a-svg.md`: tarea o notas sobre conversion de imagenes.
- `ESTRUCTURA_PROYECTO.md`: este documento.

Reglas:

- La documentacion larga debe ir aqui.
- El `README.md` puede quedarse en la raiz como entrada rapida del repositorio.

## Imports recomendados

Usar imports con `@/` para evitar rutas largas:

```tsx
import Button from "@/components/ui/Button/Button";
import Header from "@/components/layout/Header/Header";
import BottomNavBar from "@/components/navigation/BottomNavBar/BottomNavBar";
import { auth } from "@/services/firebase";
```

Evitar imports relativos largos:

```tsx
import Button from "../../components/ui/Button";
```

## Donde poner cada cosa

| Necesidad | Carpeta recomendada |
| --- | --- |
| Pantalla o ruta | `app/` |
| Boton, input, card, estado vacio | `components/ui/` |
| Header o contenedor de pantalla | `components/layout/` |
| Barra de tabs o menu | `components/navigation/` |
| Firebase, APIs externas | `services/` |
| Colores y constantes compartidas | `constants/` |
| Imagenes y recursos | `assets/` |
| Guias, planes y notas | `docs/` |

## Criterio antes de crear una carpeta nueva

Crear una carpeta nueva solo si:

- Hay al menos dos o tres archivos que comparten responsabilidad.
- El nombre de la carpeta ayuda a encontrar el codigo.
- No duplica una carpeta existente.

Si hay duda, empezar con la carpeta existente mas cercana y reorganizar cuando el patron se repita.

## Documentacion de componentes

Cada componente reutilizable importante debe tener un `.md` junto al `.tsx`.

El `.md` debe explicar:

- Para que sirve el componente.
- Como se usa.
- Que props recibe.
- Como esta estructurado en Figma.
- Que tokens de diseno usa.
- Como se relacionan las variants de Figma con las props del codigo.

Plantilla minima:

````md
# NombreDelComponente

## Descripcion

Para que sirve y cuando debe usarse.

## Referencia Figma

- Nombre en Figma:
- Ruta/seccion:
- Node/link si existe:

## Estructura en Figma

```txt
NombreDelComponente
├── Container
└── ...
```

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| prop | `tipo` | `valor` | Explicacion |

## Variantes

| Figma | Codigo |
| --- | --- |
| Variant name | `prop="value"` |

## Tokens de diseno

| Elemento | Token / valor | Uso |
| --- | --- | --- |
| Fondo | `primary.v1` | Container |

## Ejemplo

```tsx
<NombreDelComponente />
```

## Notas

Decisiones importantes o limitaciones conocidas.
````

## Que rellenar al crear algo nuevo

### Nueva pantalla en `app/`

Al crear una pantalla nueva hay que definir:

- Ruta exacta dentro de `app/`.
- Nombre de la pantalla.
- Que componentes reutiliza.
- De donde vienen sus datos.
- Estados necesarios: carga, error, vacio y contenido.
- Acciones principales del usuario.

Ejemplo:

```bash
app/(tabs)/productos.tsx
```

Debe contener solo la composicion de pantalla. Si aparece logica reutilizable, moverla a componentes, hooks o servicios.

### Nuevo componente en `components/ui/`

Al crear un componente UI hay que crear:

```bash
components/ui/NombreComponente/
  NombreComponente.tsx
  NombreComponente.md
```

El `.tsx` debe incluir:

- Tipos o interfaces de props.
- Constantes de variantes o estilos si aplica.
- Componente principal.
- Comentarios solo cuando expliquen una decision no obvia.

El `.md` debe incluir:

- Descripcion.
- Referencia Figma.
- Estructura Figma.
- Props.
- Variantes.
- Tokens de diseno.
- Ejemplo de uso.

### Nuevo componente en `components/layout/`

Al crear un componente de layout hay que crear:

```bash
components/layout/NombreComponente/
  NombreComponente.tsx
  NombreComponente.md
```

Debe explicar que zona de pantalla resuelve: header, contenedor, seccion, wrapper con safe area, etc.

### Nuevo componente en `components/navigation/`

Al crear un componente de navegacion hay que crear:

```bash
components/navigation/NombreComponente/
  NombreComponente.tsx
  NombreComponente.md
```

Debe documentar:

- Que rutas controla.
- Que props recibe de Expo Router o React Navigation.
- Como se marca el estado activo.
- Que pasa al pulsar cada item.

### Nuevo servicio en `services/`

Al crear un servicio hay que definir:

- Que sistema externo usa.
- Que funciones exporta.
- Que errores puede devolver.
- Que pantalla o feature lo consume.

Ejemplos futuros:

```bash
services/firebase.ts
services/receipts.ts
services/products.ts
```

### Nueva constante en `constants/`

Al crear o ampliar constantes hay que definir:

- Nombre claro.
- Fuente del valor: Figma, Firebase, Expo, negocio o decision tecnica.
- Si se usa desde Tailwind/NativeWind o desde JavaScript.

### Nuevo asset en `assets/`

Al anadir un asset hay que revisar:

- Si es imagen, icono, fondo o dato estatico.
- Si tiene version optimizada.
- Si se importa desde codigo.
- Si debe documentarse en el componente que lo usa.

### Nueva documentacion en `docs/`

Al crear un documento nuevo hay que definir:

- Objetivo del documento.
- A quien va dirigido.
- Cuando debe actualizarse.
- Que archivos del proyecto menciona.

Si el documento describe una norma de codigo, tambien debe reflejarse en `docs/estructura.md`.

## Checklist de estructura antes de cerrar un cambio

- La pantalla nueva esta en `app/`.
- El componente reutilizable esta fuera de `app/`.
- El componente tiene carpeta propia si es reutilizable importante.
- El componente tiene `.md` junto al `.tsx`.
- El `.md` incluye referencia y estructura Figma si existe.
- Los imports usan `@/` cuando apuntan a carpetas del proyecto.
- No hay rutas antiguas en la documentacion.
- No hay carpetas vacias o duplicadas.
