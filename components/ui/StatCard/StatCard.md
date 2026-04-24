# StatCard

## Descripcion

Componente reutilizable para mostrar una metrica destacada del dashboard.

Se usa en Home para las cards de resumen financiero.

## Referencia Figma

- Archivo: `Manager-Finance`
- Pantalla: `Final/Home Dashboard`
- Node principal de pantalla: `36:488`
- Cards usadas:
  - `36:736`
  - `36:554`
  - `36:722`

## Estructura en Figma

```txt
card
├── icon+referente
│   ├── icons
│   └── CategoriaRefernte
├── titulo
└── canitdad
```

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `icon` | `keyof MaterialIcons.glyphMap` | - | Icono mostrado en la zona superior |
| `reference` | `string` | - | Texto de referencia superior derecho |
| `label` | `string` | - | Etiqueta de la metrica |
| `value` | `string` | - | Valor principal |

## Tokens de diseno

| Elemento | Token / valor |
| --- | --- |
| Fondo card | `base.white` |
| Borde | `3px base.black` |
| Sombra | `4,4,0 #111111` |
| Franja superior | `primary.v1` |
| Padding card | `30 x 17` |
| Gap card | `16` |
| Icon box | Fondo blanco, borde negro `2px`, padding `10` |
| Label | RedHatMono Medium `12` |
| Valor | RedHatMono Bold `48` |

## Ejemplo

```tsx
import StatCard from "@/components/ui/StatCard/StatCard";

<StatCard
  icon="receipt-long"
  reference="Seguro coche"
  label="Último recibo"
  value="$300.00"
/>;
```
