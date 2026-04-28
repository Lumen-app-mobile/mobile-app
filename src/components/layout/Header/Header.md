# Header

## Descripcion

Componente de cabecera reutilizable.

Muestra el logo de Lumen y un boton de notificaciones.

## Referencia Figma

- Archivo: `Manager-Finance`
- Nombre en Figma: `Header`
- Node principal: `36:489`
- URL: https://www.figma.com/design/JbBnf8LdpmtQavzNqcRlmu/Manager-Finance?node-id=36-489&m=dev

Ruta sugerida:

- `App / Layout / Header`

## Estructura en Figma

```txt
Header
├── Container
│   ├── Logo
│   │   ├── Vector
│   │   └── Heading 2
│   │       └── lumen
│   └── Icon Buttons
│       └── NotificationButton
│           └── BellIcon
```

## Relacion codigo-Figma

| Figma | Codigo |
| --- | --- |
| `Header` node `36:489` | `Header` |
| `Vector + Heading 2` | `Logo` desde `assets/images/logo.svg` |
| `button` | `Pressable` |
| `notifications` | `BELL_SVG` |

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `onNotificationsPress` | `() => void` | - | Accion al pulsar el boton de notificaciones |

## Tokens de diseno actuales

| Elemento | Valor |
| --- | --- |
| Fondo header | `base.white` |
| Borde inferior | `3px base.black` |
| Padding X | `16` |
| Padding top | `16` |
| Padding bottom | `19` |
| Logo | `173 x 50.42` |
| Fondo boton | `primary.v1` |
| Borde boton | `3px base.black` |
| Tamano boton | `46 x 46` |
| Padding boton | `11` |
| Icono | `base.white` |
| Sombra | Offset `4,4`, opacity `1`, radius `1` |

## Ejemplo

```tsx
import Header from "@/components/layout/Header/Header";

<Header onNotificationsPress={handleNotificationsPress} />;
```

## Notas

- Este componente pertenece a `components/layout` porque define una zona comun de pantalla.
- El header usa una fila con boton fijo a la derecha para evitar que el boton de notificaciones salte debajo del logo.
- Si el header gana navegacion, avatar o menu, documentar aqui las nuevas partes de Figma.
