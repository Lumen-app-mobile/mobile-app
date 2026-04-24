# Guía para dummies: Expo + React Native + NativeWind + TypeScript

Esta guía explica las piezas básicas del proyecto con ejemplos simples y usando los nombres reales que hay ahora en el repo.

La idea principal: una pantalla está hecha de componentes, los componentes reciben props, TypeScript comprueba que esas props sean correctas y NativeWind ayuda a escribir estilos con clases.

---

## 1. Cómo se organiza este proyecto

```bash
app/
  _layout.tsx          # Configuración principal de rutas y fuentes
  index.tsx            # Pantalla inicial
  login.tsx            # Pantalla de login
  (tabs)/              # Pantallas dentro de la navegación por tabs

components/
  layout/
    Header/
      Header.tsx       # Header reutilizable
      Header.md        # Documentación del componente
  navigation/
    BottomNavBar/
      BottomNavBar.tsx # Barra inferior de navegación
      BottomNavBar.md
  ui/
    Button/
      Button.tsx       # Botón reutilizable
      Button.md
    FormInput/
      FormInput.tsx    # Input reutilizable
      FormInput.md

constants/
  colors.js            # Colores del sistema de diseño

services/
  firebase.ts          # Configuración y exports de Firebase

assets/
  data/dataFigma.json  # Medidas, tokens y referencias de Figma
  images/logo.svg      # Logo en SVG

tailwind.config.js     # Configura NativeWind: colores, fuentes y rutas
nativewind-env.d.ts    # Tipos de NativeWind para className
declarations.d.ts      # Permite importar archivos .svg
```

Regla práctica de carpetas:

- `app/`: solo rutas, layouts y pantallas de Expo Router.
- `components/ui/`: piezas visuales pequeñas y reutilizables.
- `components/layout/`: estructura visual compartida, como headers o contenedores de pantalla.
- `components/navigation/`: componentes relacionados con navegación.
- Cada componente reutilizable importante tiene carpeta propia con `.tsx` y `.md`.
- `services/`: conexiones externas como Firebase.
- `constants/`: valores fijos del diseño o configuración compartida.
- `assets/`: imágenes, iconos, datos estáticos y recursos.

---

## 2. Qué es un componente

Un componente es una pieza reutilizable de interfaz.

Ejemplos:

- Un botón.
- Un input.
- Un header.
- Una tarjeta.
- Una barra de navegación.

En React Native, los componentes suelen devolver etiquetas como `View`, `Text`, `Pressable` o `TextInput`.

```tsx
import { Text, View } from "react-native";

export default function Saludo() {
  return (
    <View>
      <Text>Hola</Text>
    </View>
  );
}
```

Regla importante: en React Native, cualquier texto visible debe ir dentro de `<Text>`.

---

## 3. Qué son las props

Las props son datos que le pasas a un componente desde fuera para controlar cómo se ve o cómo se comporta.

Piensa en un componente como una receta. Las props son los ingredientes.

```tsx
<Button
  variant="danger"
  size="lg"
  onPress={() => console.log("pulsado")}>
  Eliminar
</Button>
```

En ese ejemplo:

- `variant="danger"` dice qué estilo visual usa el botón.
- `size="lg"` dice qué tamaño tiene.
- `onPress={...}` dice qué pasa al pulsarlo.
- `Eliminar` es el contenido del botón. En React se recibe como `children`.

El componente lo recibe así:

```tsx
function Button({ variant, size, onPress, children }) {
  // variant = "danger"
  // size = "lg"
  // children = "Eliminar"
}
```

---

## 4. Qué es una interface en TypeScript

Una `interface` define qué props puede recibir un componente y de qué tipo es cada una.

Es como un contrato.

```tsx
interface ButtonProps {
  variant?: "primario" | "secundario" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  onPress?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}
```

Qué significa:

- `variant?`: el `?` significa que es opcional.
- `"sm" | "md" | "lg"`: solo se aceptan esos valores.
- `onPress?: () => void`: si existe, debe ser una función.
- `children: React.ReactNode`: contenido que va dentro del componente.

Si escribes una prop mal, TypeScript avisa antes de ejecutar la app.

```tsx
// Error: "gigante" no existe en size
<Button size="gigante">Guardar</Button>
```

---

## 5. Cómo se usan las clases de NativeWind

NativeWind permite usar clases tipo Tailwind dentro de React Native.

Sin NativeWind:

```tsx
<View style={{ backgroundColor: "#4ECDC4", padding: 20 }} />
```

Con NativeWind:

```tsx
<View className="bg-primary-v1 p-5" />
```

En este proyecto, los colores salen de `constants/colors.js` y se registran en `tailwind.config.js`.

Ejemplos reales de clases disponibles:

```tsx
<View className="bg-primary-v1" />
<View className="bg-secondary-v1" />
<View className="bg-feedback-danger-v1" />
<View className="bg-feedback-success-v1" />
<View className="bg-base-white" />
<View className="border-base-black" />

<Text className="text-primary-v1">Texto</Text>
<Text className="text-secondary-v1">Texto</Text>
<Text className="text-base-black">Texto</Text>
<Text className="text-base-white">Texto</Text>
```

También puedes usar tamaños y espaciados:

```tsx
<View className="p-4 mt-2 gap-3 rounded-lg" />

<Text className="text-sm">Pequeño</Text>
<Text className="text-base">Normal</Text>
<Text className="text-lg">Grande</Text>
<Text className="text-xl">Más grande</Text>
```

---

## 6. Cuándo usar `className` y cuándo usar `style`

Usa `className` para estilos normales:

```tsx
<View className="items-center justify-center bg-primary-v1 p-4" />
```

Usa `style` cuando el valor sea dinámico o NativeWind no cubra bien esa propiedad:

```tsx
<Pressable
  className="border-[3px] border-base-black bg-primary-v1"
  style={{
    shadowColor: colors.base.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 4,
  }}
/>
```

Regla práctica:

- Color, padding, margin, flex, texto y bordes simples: `className`.
- Sombras, valores calculados, medidas que vienen de una variable o comportamiento muy específico: `style`.

---

## 7. Cómo se usan las fuentes

Las fuentes se configuran en `tailwind.config.js`:

```js
fontFamily: {
  sans: ["Inter"],
  "sans-italic": ["Inter-Italic"],
  "sans-bold": ["Inter-Bold"],
  mono: ["RedHatMono"],
  "mono-italic": ["RedHatMono-Italic"],
  "mono-bold": ["RedHatMono-Bold"],
}
```

Se usan así:

```tsx
<Text className="font-sans">Texto normal</Text>
<Text className="font-sans-bold">Texto en negrita</Text>
<Text className="font-mono">Texto monoespaciado</Text>
<Text className="font-mono-bold">Texto monoespaciado en negrita</Text>
```

Importante: las fuentes también deben cargarse en `app/_layout.tsx`. Ahora mismo ahí se cargan fuentes Red Hat Mono. Si se quiere usar Inter en pantallas reales, también hay que cargar Inter en ese archivo.

---

## 8. Cómo funciona el botón reutilizable

El botón está en:

```bash
components/ui/Button/Button.tsx
```

El patrón importante es usar mapas de estilos. En vez de muchos `if`, se crean objetos y se accede por clave.

```tsx
const variantStyles = {
  primario: "bg-primary-v1 active:bg-primary-v2",
  secundario: "bg-secondary-v1 active:bg-secondary-v2",
  danger: "bg-feedback-danger-v1 active:bg-feedback-danger-v2",
  outline: "border-2 border-primary-v1 bg-transparent",
};
```

Si `variant` vale `"danger"`, entonces:

```tsx
variantStyles[variant]
```

devuelve:

```tsx
"bg-feedback-danger-v1 active:bg-feedback-danger-v2"
```

Uso básico:

```tsx
import Button from "@/components/ui/Button/Button";

export default function Pantalla() {
  return (
    <>
      <Button onPress={() => console.log("guardar")}>
        Guardar
      </Button>

      <Button variant="danger" size="lg" onPress={() => console.log("eliminar")}>
        Eliminar cuenta
      </Button>

      <Button variant="outline" onPress={() => console.log("cancelar")}>
        Cancelar
      </Button>

      <Button disabled>
        No disponible
      </Button>
    </>
  );
}
```

---

## 9. Cómo funciona el input reutilizable

El input está en:

```bash
components/ui/FormInput/FormInput.tsx
```

Tiene dos ideas principales:

- `size`: controla tamaño, padding, border y fuente.
- `state`: controla si está activo, desactivado o con icono.

Ejemplo:

```tsx
import TextField from "@/components/ui/FormInput/FormInput";

export default function Login() {
  return (
    <>
      <TextField label="Email" placeholder="email@dominio.com" />

      <TextField
        label="Password"
        placeholder="Contraseña"
        secureTextEntry
      />

      <TextField
        label="Campo desactivado"
        state="disabled"
        value="No editable"
      />
    </>
  );
}
```

El componente usa `TextInputProps`, así que acepta props normales de `TextInput`, como:

- `placeholder`
- `value`
- `onChangeText`
- `secureTextEntry`
- `keyboardType`

---

## 10. Archivos de tipos importantes

### `nativewind-env.d.ts`

Permite que TypeScript entienda `className` en componentes de React Native.

```ts
/// <reference types="nativewind/types" />
```

Normalmente no se toca.

### `declarations.d.ts`

Permite importar archivos SVG como componentes.

```ts
declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}
```

Sin este archivo, TypeScript puede quejarse al importar `.svg`.

---

## 11. Importaciones con `@/`

El proyecto permite importar desde la raíz usando `@/`.

En vez de esto:

```tsx
import Button from "../../components/ui/Button";
```

Usa esto:

```tsx
import Button from "@/components/ui/Button/Button";
```

Es más legible y evita rutas largas con muchos `../`.

---

## 12. Reglas rápidas para no liarse

- Si vas a mostrar texto, usa `<Text>`.
- Si algo se puede pulsar, usa `<Pressable>`.
- Si necesitas una caja o layout, usa `<View>`.
- Si el estilo es visual y simple, usa `className`.
- Si el estilo depende de una variable o es una sombra compleja, usa `style`.
- Si una UI se repite, crea o reutiliza un componente.
- Antes de crear un componente nuevo, revisa `components/` y `components/ui/`.
- Los colores deben venir de `constants/colors.js`.
- Las medidas de diseño deben revisarse en `assets/data/dataFigma.json`.
- Evita `any` en TypeScript.
- Pon nombres claros aunque sean más largos.

---

## 13. Checklist antes de terminar

Antes de dar una tarea por terminada:

- La app arranca.
- No hay errores de TypeScript.
- No hay errores de lint.
- Los imports apuntan a rutas reales.
- Los colores usan clases existentes de NativeWind o `constants/colors.js`.
- El código se entiende sin tener que adivinar.
- No has duplicado un componente que ya existía.
- Si creaste un componente reutilizable, documenta cómo se usa.
