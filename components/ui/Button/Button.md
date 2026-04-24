# Button

## Descripcion

Componente reutilizable para acciones pulsables.

Se usa cuando una pantalla necesita ejecutar una accion clara: guardar, cancelar, eliminar, entrar o continuar.

## Referencia Figma

Nombre esperado en Figma: `Button`.

Ruta sugerida en Figma:

- `Design System / Components / Button`

Variants esperadas:

- `variant`: `primario`, `secundario`, `danger`, `outline`
- `size`: `sm`, `md`, `lg`
- `state`: `default`, `pressed`, `disabled`

## Estructura en Figma

```txt
Button
├── Container
│   ├── background
│   ├── border
│   ├── padding horizontal
│   ├── padding vertical
│   └── radius
└── Label
    ├── font
    ├── font size
    ├── line height
    └── color
```

## Relacion codigo-Figma

| Figma | Codigo |
| --- | --- |
| Variant `Primary` | `variant="primario"` |
| Variant `Secondary` | `variant="secundario"` |
| Variant `Danger` | `variant="danger"` |
| Variant `Outline` | `variant="outline"` |
| Size `Small` | `size="sm"` |
| Size `Medium` | `size="md"` |
| Size `Large` | `size="lg"` |
| State `Disabled` | `disabled={true}` |

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `variant` | `"primario" | "secundario" | "danger" | "outline"` | `"primario"` | Define el estilo visual |
| `size` | `"sm" | "md" | "lg"` | `"md"` | Define el tamano |
| `onPress` | `() => void` | - | Funcion que se ejecuta al pulsar |
| `disabled` | `boolean` | `false` | Desactiva el boton |
| `children` | `React.ReactNode` | - | Contenido visible del boton |

## Medidas actuales

| Size | Container | Texto |
| --- | --- | --- |
| `sm` | `px-3 py-1.5 rounded-md` | `text-sm` |
| `md` | `px-5 py-2.5 rounded-lg` | `text-base` |
| `lg` | `px-7 py-3.5 rounded-xl` | `text-lg` |

## Tokens de color actuales

| Variant | Fondo | Texto |
| --- | --- | --- |
| `primario` | `primary-v1` | `white` |
| `secundario` | `secondary-v1` | `white` |
| `danger` | `feedback-danger-v1` | `white` |
| `outline` | `transparent` | `primary-v1` |

## Ejemplo

```tsx
import Button from "@/components/ui/Button/Button";

<Button variant="danger" size="lg" onPress={handleDelete}>
  Eliminar
</Button>;
```

## Notas

- Las variantes se definen con mapas de clases para evitar logica repetida dentro del JSX.
- Si el diseno de Figma cambia, actualizar primero los mapas de estilos y despues esta documentacion.
