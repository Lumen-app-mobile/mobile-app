# BottomNavBar

## Descripcion

Barra inferior personalizada para las tabs principales de la app.

Se conecta con `expo-router` mediante la prop `tabBar` del layout de tabs.

## Referencia Figma

Referencia actual indicada en codigo: node `28:367`.

Nombre esperado en Figma: `BottomNavBar` o `TabBar`.

Ruta sugerida en Figma:

- `App / Navigation / BottomNavBar`

## Estructura en Figma

```txt
BottomNavBar
├── SafeAreaWrapper
└── TabBarContainer
    ├── TabItem Home
    │   ├── Icon
    │   └── Label
    ├── TabItem Productos
    │   ├── Icon
    │   └── Label
    ├── TabItem Scan
    │   ├── Icon
    │   └── Label
    └── TabItem Config
        ├── Icon
        └── Label
```

## Tabs actuales

| Ruta | Label | Icono |
| --- | --- | --- |
| `index` | `HOME` | `home` |
| `productos` | `PRODUCTOS` | `list-alt` |
| `scan` | `SCAN` | `qr-code` |
| `config` | `CONFIG` | `settings` |

## Props

| Prop | Tipo | Descripcion |
| --- | --- | --- |
| `state` | Estado de tabs de React Navigation | Indica ruta activa y rutas disponibles |
| `navigation` | Navegacion de React Navigation | Permite navegar al pulsar cada tab |

## Tokens de diseno actuales

| Elemento | Valor |
| --- | --- |
| Fondo wrapper | `#FFFFFF` |
| Borde principal | `3px #000000` |
| Sombra | Offset `4,4`, opacity `1`, radius `1` |
| Tab activo | Fondo `#4ECDC4`, texto/icono blanco |
| Tab inactivo | Fondo blanco, borde/texto/icono `#4ECDC4` |
| Tipografia | `RedHatMono_700Bold`, `12px`, uppercase |
| Gap icono/texto | `4px` |
| Padding vertical tab | `12px` |

## Ejemplo

```tsx
import BottomNavBar from "@/components/navigation/BottomNavBar/BottomNavBar";

<Tabs tabBar={(props) => <BottomNavBar {...props} />} />;
```

## Notas

- Este componente vive en `components/navigation` porque depende del estado de navegacion.
- Si se cambian rutas en `app/(tabs)/_layout.tsx`, actualizar tambien `TABS` y esta documentacion.
