# ItemLista

## Descripcion

Componente reutilizable para representar una fila compacta de lista.

Se usa para mostrar un item con titulo, descripcion, precio e indicador visual de categoria. Tambien tiene una variante `listHeader` para cabeceras de lista.

## Referencia Figma

- Archivo: `Manager-Finance`
- Nombre en Figma: `itemLista`

Versiones del componente:

| Version Figma | Node | URL | Codigo |
| --- | --- | --- | --- |
| `Default` | `75:2889` | https://www.figma.com/design/JbBnf8LdpmtQavzNqcRlmu/Manager-Finance?node-id=75-2889&m=dev | `variant="default"` |
| `listHeader` | `218:1628` | https://www.figma.com/design/JbBnf8LdpmtQavzNqcRlmu/Manager-Finance?node-id=218-1628&m=dev | `variant="listHeader"` |

## Estructura en Figma

```txt
ItemLista
├── Container
│   ├── Description Container
│   │   └── Description
│   ├── Header
│   │   ├── Item Info
│   │   │   └── Title
│   │   └── Price Container
│   │       └── Price
│   └── Indicador
│       └── Vector
└── Variant listHeader
    └── Header
        └── Item Info
            └── Title
```

## Props

| Prop | Tipo | Default | Descripcion |
| --- | --- | --- | --- |
| `variant` | `"default" | "listHeader"` | `"default"` | Define si es item normal o cabecera |
| `title` | `string` | `"listaItem"` | Texto principal |
| `description` | `string` | `"listaItem"` | Texto superior en variante `default` |
| `price` | `string` | `"???€"` | Precio mostrado junto al titulo |
| `showIndicator` | `boolean` | `true` | Muestra el indicador de categoria en `default` |
| `onPress` | `() => void` | - | Accion opcional al pulsar |

## Variantes

| Figma | Codigo |
| --- | --- |
| `Default` | `variant="default"` |
| `listHeader` | `variant="listHeader"` |

### `Default`

La version `Default` corresponde al nodo `75:2889`.

Estructura visual:

- Fondo blanco.
- Borde izquierdo e inferior brutal de `3px`.
- Sombra negra `4,4,1`.
- Descripcion superior en `secondary.v2`.
- Titulo principal en negro.
- Precio en `secondary.v2`.
- Indicador triangular de categoria `obligacion`.

### `listHeader`

La version `listHeader` corresponde al nodo `218:1628`.

Estructura visual:

- Fondo `primary.v1`.
- Borde izquierdo, derecho e inferior brutal de `3px`.
- Sombra negra `4,4,1`.
- Titulo en blanco.
- Sin descripcion.
- Sin precio.
- Sin indicador.

## Tokens de diseno

| Elemento | Token Figma | Codigo |
| --- | --- | --- |
| Fondo default | `global/color/base/white` | `colors.base.white` / `bg-base-white` |
| Fondo header | `global/color/primary/v1` | `colors.primary.v1` / `bg-primary-v1` |
| Texto secundario | `global/color/secondary/v2` | `colors.secondary.v2` / `text-secondary-v2` |
| Texto principal | `global/color/base/black` | `colors.base.black` / `text-base-black` |
| Texto header | `global/color/base/white` | `colors.base.white` / `text-base-white` |
| Indicador | `global/color/category_obligacion/v1` | `colors.category.obligacion.v1` |
| Borde brutal | `movil/border_brutal` | `3` |
| Sombra | `DROP_SHADOW 4,4,1` | `shadowOffset`, `shadowRadius`, `elevation` |

## Medidas

| Elemento | Valor |
| --- | --- |
| Width | `216` |
| Min width | `160` |
| Padding X | `8` |
| Padding Y | `12` |
| Gap | `8` |
| Borde | `3` |
| Indicador | `30 x 26` |
| Texto xs | `12` |
| Texto body | `16` |

## Ejemplo

```tsx
import ItemLista from "@/components/ui/ItemLista/ItemLista";

<ItemLista
  title="Alquiler"
  description="Obligacion"
  price="850€"
  onPress={handlePress}
/>;

<ItemLista variant="listHeader" title="Gastos fijos" />;
```

## Notas

- El indicador se ha implementado como triangulo con bordes en React Native para evitar depender de un asset remoto temporal de Figma.
- El componente usa `Pressable` aunque `onPress` sea opcional para mantener una unica raiz interactiva.
- Si se anaden nuevas categorias, el indicador deberia aceptar una prop de categoria y mapearla contra `colors.category`.
