# TODO Lumen

Plan de desarrollo para construir Lumen paso a paso.

Lumen es una app móvil de gestión financiera personal orientada a escanear tickets, revisar productos comprados y entender gastos por categoría, supermercado y fecha.

## Estado actual

### Ya existe

- [x] Proyecto Expo con Expo Router.
- [x] NativeWind configurado.
- [x] Colores del diseño en `constants/colors.js`.
- [x] Tokens y datos de referencia en `assets/data/dataFigma.json`.
- [x] Importación de SVG configurada en `declarations.d.ts`.
- [x] Tipos de NativeWind en `nativewind-env.d.ts`.
- [x] Pantalla inicial que redirige a login.
- [x] Pantalla `login.tsx` con bottom sheet animado.
- [x] Login conectado a Firebase Auth.
- [x] Navegación por tabs en `app/(tabs)/_layout.tsx`.
- [x] Barra inferior personalizada `components/navigation/BottomNavBar/BottomNavBar.tsx`.
- [x] Header reutilizable `components/layout/Header/Header.tsx`.
- [x] Configuración Firebase en `services/firebase.ts`.
- [x] Botón base `components/ui/Button/Button.tsx`.
- [x] Input base `components/ui/FormInput/FormInput.tsx`.
- [x] Pantallas base: Home, Productos, Scan y Config.
- [x] Guía de estructura en `docs/estructura.md`.
- [x] Guía de aprendizaje en `docs/conceptosReactNAtive.md`.
- [x] Mapa de carpetas en `docs/ESTRUCTURA_PROYECTO.md`.

### Pendiente principal

- [ ] Consolidar sistema visual.
- [ ] Refactorizar pantallas para usar componentes reutilizables.
- [ ] Definir modelo de datos financiero.
- [ ] Crear flujo real de tickets/productos/gastos.
- [ ] Añadir estados de carga, error y vacío.
- [ ] Añadir persistencia y lectura de datos.

---

## Fase 1: Limpieza y base técnica

Objetivo: dejar el proyecto consistente antes de seguir creando pantallas.

### 1.1. Consistencia de estilos

- [ ] Revisar componentes que usan muchos estilos inline.
- [ ] Pasar a `className` los estilos simples: layout, padding, colores, texto y bordes.
- [ ] Mantener `style` solo para sombras, valores dinámicos o propiedades difíciles de expresar con NativeWind.
- [ ] Evitar hexadecimales directos en pantallas y componentes.
- [ ] Usar `constants/colors.js` cuando haga falta acceder a colores desde JavaScript.
- [ ] Revisar que las clases de color coincidan con `tailwind.config.js`.

### 1.2. Fuentes

- [ ] Confirmar qué fuentes definitivas usa el diseño.
- [ ] Cargar en `app/_layout.tsx` todas las fuentes usadas por `tailwind.config.js`.
- [ ] Verificar si Inter se usa realmente; si se usa, cargarla con `@expo-google-fonts/inter`.
- [ ] Revisar clases `font-sans`, `font-sans-bold`, `font-mono` y `font-mono-bold`.

### 1.3. Nombres y estructura

- [x] Separar componentes de layout en `components/layout`.
- [x] Separar componentes de navegación en `components/navigation`.
- [x] Mover Firebase a `services/firebase.ts`.
- [x] Crear documentación `.md` para componentes reutilizables actuales.
- [ ] Alinear el código con `docs/estructura.md`.

### 1.4. Verificación

- [ ] Ejecutar `npm run lint`.
- [ ] Ejecutar la app con `npm run start`.
- [ ] Probar navegación Login -> Tabs.
- [ ] Probar en al menos un dispositivo/emulador.

---

## Fase 2: Sistema de componentes

Objetivo: tener piezas pequeñas y reutilizables antes de construir pantallas completas.

### 2.1. Componentes UI existentes

- [x] `Button`.
- [x] `FormInput`.
- [x] Documentar `Button` en `components/ui/Button/Button.md`.
- [x] Documentar `FormInput` en `components/ui/FormInput/FormInput.md`.
- [ ] Revisar si `Button` necesita estado `loading`.
- [ ] Revisar si `Button` necesita icono izquierdo/derecho.
- [ ] Revisar si `FormInput` necesita estado `error`.
- [ ] Revisar si `FormInput` necesita texto de ayuda.

### 2.2. Componentes UI nuevos

- [ ] `ScreenContainer`: contenedor base con safe area, padding y fondo.
- [ ] `Card`: contenedor con borde, sombra y padding.
- [ ] `StatCard`: tarjeta para métricas financieras.
- [ ] `EmptyState`: mensaje cuando no hay datos.
- [ ] `ErrorState`: mensaje cuando falla una acción.
- [ ] `LoadingState`: estado de carga reutilizable.
- [ ] `IconButton`: botón solo con icono.
- [ ] `SectionHeader`: título y acción opcional para secciones.

### 2.3. Componentes de dominio financiero

- [ ] `ExpenseCard`: gasto individual.
- [ ] `ProductCard`: producto comprado.
- [ ] `ReceiptCard`: ticket/factura subida.
- [ ] `CategoryBadge`: etiqueta de categoría.
- [ ] `StoreBadge`: etiqueta de supermercado.
- [ ] `AmountText`: formato visual de importes.
- [ ] `DateText`: formato visual de fechas.

---

## Fase 3: Modelo de datos

Objetivo: definir qué datos maneja Lumen antes de montar features grandes.

### 3.1. Entidades principales

- [ ] Definir tipo `UserProfile`.
- [ ] Definir tipo `Receipt`.
- [ ] Definir tipo `Product`.
- [ ] Definir tipo `Expense`.
- [ ] Definir tipo `Category`.
- [ ] Definir tipo `Store`.

Ejemplo inicial:

```ts
type Receipt = {
  id: string;
  userId: string;
  storeName: string;
  totalAmount: number;
  purchasedAt: string;
  imageUrl?: string;
  createdAt: string;
};
```

### 3.2. Datos mock

- [ ] Crear datos fake para productos, tickets y gastos.
- [ ] Usar los mocks para construir pantallas sin depender todavía de backend.
- [ ] Separar mocks en una carpeta clara, por ejemplo `assets/data` o `mocks`.

### 3.3. Formateadores

- [ ] Crear helper para formatear dinero.
- [ ] Crear helper para formatear fechas.
- [ ] Crear helper para agrupar gastos por categoría.
- [ ] Crear helper para agrupar gastos por supermercado.

---

## Fase 4: Pantallas principales

Objetivo: convertir las pantallas placeholder en pantallas útiles.

### 4.1. Login

- [x] Pantalla de login creada.
- [x] Firebase Auth conectado.
- [ ] Validar campos antes de llamar a Firebase.
- [ ] Mostrar errores específicos: email vacío, password vacío, credenciales incorrectas.
- [ ] Añadir estado `loading` usando componente reutilizable.
- [ ] Evitar `any` en el `catch`.
- [ ] Decidir si habrá registro o solo login.
- [ ] Añadir logout desde Config.

### 4.2. Home

- [x] Ruta Home creada.
- [x] Header añadido.
- [ ] Crear layout completo con `ScreenContainer`.
- [ ] Mostrar resumen mensual: gastado, tickets, productos y media por compra.
- [ ] Añadir tarjetas de estadísticas.
- [ ] Añadir últimos tickets.
- [ ] Añadir top categorías.
- [ ] Añadir empty state cuando no haya datos.

### 4.3. Productos

- [x] Ruta Productos creada.
- [ ] Mostrar lista de productos comprados.
- [ ] Añadir buscador.
- [ ] Añadir filtros por categoría.
- [ ] Añadir filtros por supermercado.
- [ ] Añadir orden por precio, fecha o frecuencia.
- [ ] Mostrar detalle de producto.
- [ ] Añadir empty state.

### 4.4. Scan

- [x] Ruta Scan creada.
- [ ] Crear pantalla con acciones: hacer foto, subir imagen, carga manual.
- [ ] Añadir preview del ticket.
- [ ] Crear formulario manual de ticket.
- [ ] Crear historial de tickets.
- [ ] Preparar integración futura con OCR.
- [ ] Gestionar permisos de cámara.

### 4.5. Config

- [x] Ruta Config creada.
- [ ] Mostrar datos básicos del usuario.
- [ ] Añadir botón de cerrar sesión.
- [ ] Añadir sección de preferencias.
- [ ] Añadir sección de información de la app.
- [ ] Añadir opción de borrar datos locales.

---

## Fase 5: Estado, datos y persistencia

Objetivo: dejar de depender solo de estado local dentro de cada pantalla.

### 5.1. Estado local

- [ ] Usar `useState` para formularios simples.
- [ ] Usar `useMemo` para cálculos derivados de listas.
- [ ] Usar `useCallback` solo cuando aporte claridad o rendimiento real.

### 5.2. Estado compartido

- [ ] Crear `AuthContext` o hook equivalente.
- [ ] Guardar usuario autenticado.
- [ ] Crear estado compartido para tickets/productos mientras no haya backend completo.
- [ ] Definir dónde viven los hooks: por ejemplo `hooks/`.

### 5.3. Persistencia

- [ ] Decidir si los datos viven en Firebase, almacenamiento local o ambos.
- [ ] Si se usa local, instalar y configurar almacenamiento persistente.
- [ ] Guardar sesión o depender de Firebase Auth persistence.
- [ ] Definir estrategia para sincronización futura.

---

## Fase 6: Firebase y backend

Objetivo: conectar la app a datos reales de forma ordenada.

### 6.1. Auth

- [x] Login con email/password.
- [ ] Manejar sesión persistente.
- [ ] Proteger rutas privadas.
- [ ] Redirigir automáticamente si ya hay usuario.
- [ ] Crear logout.
- [ ] Añadir recuperación de contraseña si aplica.

### 6.2. Base de datos

- [ ] Decidir estructura en Firestore.
- [ ] Crear colección de usuarios.
- [ ] Crear colección de tickets.
- [ ] Crear colección de productos/gastos.
- [ ] Añadir reglas de seguridad.
- [ ] Crear funciones de lectura.
- [ ] Crear funciones de escritura.
- [ ] Crear funciones de borrado.

### 6.3. Storage

- [ ] Decidir si las imágenes de tickets se guardan en Firebase Storage.
- [ ] Subir imagen de ticket.
- [ ] Guardar URL en el documento del ticket.
- [ ] Borrar imagen cuando se borra el ticket.

---

## Fase 7: Cámara, imágenes y OCR

Objetivo: capturar tickets y preparar extracción de datos.

### 7.1. Cámara y galería

- [ ] Instalar dependencia necesaria de Expo para cámara o image picker.
- [ ] Pedir permisos.
- [ ] Capturar foto.
- [ ] Seleccionar imagen desde galería.
- [ ] Mostrar preview.
- [ ] Confirmar o descartar imagen.

### 7.2. OCR

- [ ] Decidir proveedor o estrategia de OCR.
- [ ] Extraer texto del ticket.
- [ ] Detectar supermercado.
- [ ] Detectar fecha.
- [ ] Detectar total.
- [ ] Detectar líneas de productos si es viable.
- [ ] Permitir corrección manual antes de guardar.

---

## Fase 8: Calidad de UX

Objetivo: que la app sea cómoda de usar y no parezca un prototipo roto.

### 8.1. Estados

- [ ] Loading states en login, listas y subida de tickets.
- [ ] Empty states en listas vacías.
- [ ] Error states con mensajes claros.
- [ ] Success feedback cuando se guarda algo.

### 8.2. Accesibilidad

- [ ] Añadir `accessibilityLabel` en botones con iconos.
- [ ] Revisar contraste de textos.
- [ ] Aumentar áreas pulsables pequeñas.
- [ ] Evitar depender solo del color para transmitir estado.

### 8.3. Responsive

- [ ] Probar en móvil pequeño.
- [ ] Probar en móvil grande.
- [ ] Revisar comportamiento web si se mantiene soporte web.
- [ ] Evitar textos cortados.

---

## Fase 9: Testing y revisión

Objetivo: evitar romper lo que ya funciona.

- [ ] Ejecutar lint antes de cerrar cambios.
- [ ] Añadir pruebas a helpers puros cuando existan.
- [ ] Probar flujo Login -> Home -> Tabs.
- [ ] Probar logout cuando exista.
- [ ] Probar creación manual de ticket cuando exista.
- [ ] Probar subida de imagen cuando exista.
- [ ] Revisar que no haya imports rotos.

---

## Orden recomendado de implementación

1. Limpiar estilos y fuentes.
2. Documentar `Button` y `FormInput`.
3. Crear `ScreenContainer`, `Card`, `StatCard` y estados reutilizables.
4. Definir tipos de datos financieros.
5. Crear mocks.
6. Construir Home con datos mock.
7. Construir Productos con datos mock.
8. Construir Scan manual sin OCR.
9. Añadir logout y protección de sesión.
10. Conectar persistencia real.
11. Añadir cámara.
12. Añadir OCR.

---

## Criterio para cerrar una tarea

Una tarea se considera terminada cuando:

- El código está alineado con `docs/estructura.md`.
- La app arranca sin errores.
- `npm run lint` no reporta errores nuevos.
- La pantalla funciona en el flujo real de navegación.
- Los estilos respetan `constants/colors.js` y `assets/data/dataFigma.json`.
- No se duplican componentes existentes.
- Si se creó un componente reutilizable, tiene documentación.

---

## Recursos útiles

- Expo: https://docs.expo.dev/
- React Native: https://reactnative.dev/docs/getting-started
- Expo Router: https://docs.expo.dev/router/introduction/
- NativeWind: https://www.nativewind.dev/
- Firebase Auth: https://firebase.google.com/docs/auth
