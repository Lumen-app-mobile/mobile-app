# Guía para dummies — React Native + NativeWind + TypeScript

---

## 1. ¿Qué son los props?

Los **props** son parámetros que le pasas a un componente desde fuera para controlar cómo se ve o cómo se comporta.

Piénsalo como los ingredientes de una receta: tú decides qué poner, y el componente los usa.

```tsx
// Tú usas el botón así (le pasas ingredientes)
<Button
  variant="danger"
  size="lg"
  onPress={() => alert("pulsado")}>
  Eliminar
</Button>;

// El componente recibe esos ingredientes
function Button({ variant, size, onPress, children }) {
  // variant = "danger"
  // size    = "lg"
  // children = "Eliminar" (el texto de dentro)
}
```

---

## 2. ¿Qué es una interface en TypeScript?

Una `interface` es como un contrato: define qué props puede recibir un componente y de qué tipo son.

```ts
interface ButtonProps {
  variant?: "primario" | "danger";
  size?: "sm" | "md" | "lg";
  onPress?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}
```

Si pasas un prop que no existe en la interface, TypeScript te avisa con un error antes de ejecutar nada. Es tu red de seguridad.

---

## 3. ¿Cómo se usan las clases de NativeWind (Tailwind)?

En lugar de escribir estilos en objetos de JavaScript, escribes **nombres de clases** como en HTML/CSS web.

```tsx
// Sin NativeWind (estilo tradicional React Native)
<View style={{ backgroundColor: "#4ECDC4", padding: 20, borderRadius: 8 }} />

// Con NativeWind
<View className="bg-brand-primario-v1 p-5 rounded-lg" />
```

### Las clases que tienes disponibles en este proyecto

**Colores de marca** (definidos en `tailwind.config.js`):

```ts
bg-brand-primario-v1    → fondo turquesa oscuro
bg-brand-primario-v4    → fondo turquesa muy claro
bg-brand-secundario-v1  → fondo naranja
bg-info-danger-v1       → fondo rojo
bg-info-success-v1      → fondo verde
```

**Texto del mismo color:**

```ts
text - brand - primario - v1;
text - info - danger - v1;
text - white;
```

**Tamaños de texto:**

```ts
text-sm   → pequeño
text-base → normal
text-lg   → grande
text-xl   → más grande
```

---

## 4. ¿Cómo se usan las fuentes?

Las fuentes Inter y Red Hat Mono están registradas en `constants/theme.ts` y configuradas en `tailwind.config.js`.

Se usan con la clase `font-{nombre}`:

```tsx
<Text className="font-sans">        Texto normal (Inter)</Text>
<Text className="font-sans-bold">   Texto en negrita (Inter Bold)</Text>
<Text className="font-mono">        Texto monoespaciado (Red Hat Mono)</Text>
<Text className="font-mono-bold">   Monoespaciado en negrita</Text>
```

> ⚠️ En React Native el texto **siempre** va dentro de `<Text>`. No puedes poner `className` con fuente en un `<View>` o `<Pressable>`.

---

## 5. ¿Cómo funciona el botón que hemos creado?

El truco para evitar `if/else` es usar **objetos como mapas de estilos**. Usas el valor del prop como clave del objeto y obtienes las clases directamente.

```tsx
const variantStyles = {
  primario:   "bg-brand-primario-v1",
  secundario: "bg-brand-secundario-v1",
  danger:     "bg-info-danger-v1",
  outline:    "border-2 border-brand-primario-v1 bg-transparent",
};

<Pressable className={variantStyles[variant]}>
```

### El componente completo explicado línea a línea

```ts
export default function Button({
 variant = "primario",
 size = "md",
 onPress,
 disabled = false,
 children,
}: ButtonProps) {
 return (
  <Pressable
   onPress={onPress}
   disabled={disabled}
   className={`
        items-center justify-center
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? "opacity-50" : ""}
      `}>
   <Text
    className={`font-sans-bold ${variantTextStyles[variant]} ${sizeTextStyles[size]}`}>
    {children}
   </Text>
  </Pressable>
 );
}
```

### Cómo usarlo en una pantalla

```tsx
import Button from "@/components/Button";

<Button onPress={() => console.log("guardado")}>
  Guardar
</Button>

<Button variant="danger" size="lg" onPress={() => eliminar()}>
  Eliminar cuenta
</Button>

<Button disabled>
  No disponible
</Button>

<Button variant="outline" onPress={() => cancelar()}>
  Cancelar
</Button>
```

---

## 6. ¿Por qué necesitamos `expo-env.d.ts`?

NativeWind v4 añade la propiedad `className` a todos los componentes de React Native, pero TypeScript no lo sabe por defecto. El archivo `expo-env.d.ts` sirve para decirle a TypeScript que cargue los tipos de Expo.

```ts
/// <reference types="expo/types" />
/// <reference types="nativewind/types" />
```

---

## 7. Estructura de archivos importantes

```bash
constants/
  theme.ts          → Colores y fuentes del proyecto

tailwind.config.js  → Registra los colores y fuentes para poder usarlos como clases

components/
  Button.tsx        → Componente botón reutilizable

expo-env.d.ts       → Activa los tipos de Expo y NativeWind
```
