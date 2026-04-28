# FormInput

## Descripcion

Componente reutilizable para campos de texto.

Se usa en formularios como login, registro, busquedas, filtros o carga manual de datos.

## Referencia Figma

Nombre esperado en Figma: `Input` o `Text Field`.

Ruta sugerida en Figma:

- `Design System / Components / FormInput`

Variants esperadas:

- `size`: `sm`, `md`, `lg`
- `state`: `default`, `disabled`, `withIcon`

## Estructura en Figma

```txt
FormInput
├── Label
└── Field
    ├── Icon optional
    └── TextInput
        ├── placeholder
        ├── value
        └── cursor
```

## Relacion codigo-Figma

| Figma | Codigo |
| --- | --- |
| Size `Small` | `size="sm"` |
| Size `Medium` | `size="md"` |
| Size `Large` | `size="lg"` |
| State `Default` | `state="default"` |
| State `Disabled` | `state="disabled"` |
| State `With icon` | `state="withIcon"` + `icon` |

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `label` | `string` | - | Texto superior del campo |
| `state` | `"default" | "disabled" | "withIcon"` | `"default"` | Estado visual y comportamiento |
| `size` | `"sm" | "md" | "lg"` | `"sm"` | Tamano del campo |
| `icon` | `React.ReactNode` | - | Icono mostrado si `state="withIcon"` |
| props de `TextInput` | `TextInputProps` | - | Props nativas como `value`, `onChangeText`, `secureTextEntry` |

## Medidas actuales

| Size | Texto | Padding X | Padding Y | Border | Icono |
| --- | --- | --- | --- | --- | --- |
| `sm` | `text-sm` | `12` | `8` | `3` | `16` |
| `md` | `text-base` | `12` | `8` | `4` | `18` |
| `lg` | `text-lg` | `12` | `8` | `4` | `24` |

## Tokens de color actuales

| Estado | Borde | Texto | Label |
| --- | --- | --- | --- |
| `default` | `base-black` | `base-black` | `base-black` |
| `disabled` | `secondary-v3` | `secondary-v3` | `secondary-v3` |
| `withIcon` | `base-black` | `base-black` | `base-black` |

## Ejemplo

```tsx
import TextField from "@/components/ui/FormInput/FormInput";

<TextField
  label="Email"
  placeholder="tu@email.com"
  value={email}
  onChangeText={setEmail}
/>;
```

## Notas

- El estado controla apariencia y comportamiento.
- El tamano controla geometria.
- El padding nativo de `TextInput` se resetea para que el contenedor controle el espaciado.
