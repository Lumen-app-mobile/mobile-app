# Header

## Descripcion

Componente de cabecera reutilizable.

Muestra el logo de Lumen y un boton de notificaciones.

## Referencia Figma

Nombre esperado en Figma: `Header`.

Ruta sugerida en Figma:

- `App / Layout / Header`

## Estructura en Figma

```txt
Header
├── Logo
└── NotificationButton
    ├── Container
    └── BellIcon
```

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `onNotificationsPress` | `() => void` | - | Accion al pulsar el boton de notificaciones |

## Tokens de diseno actuales

| Elemento | Valor |
| --- | --- |
| Fondo boton | `primary.v1` |
| Borde boton | `base.black` |
| Icono | `base.black` |
| Sombra | Offset `4,4`, opacity `1`, radius `1` |

## Ejemplo

```tsx
import Header from "@/components/layout/Header/Header";

<Header onNotificationsPress={handleNotificationsPress} />;
```

## Notas

- Este componente pertenece a `components/layout` porque define una zona comun de pantalla.
- Si el header gana navegacion, avatar o menu, documentar aqui las nuevas partes de Figma.
