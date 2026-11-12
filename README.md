# Lumen · App móvil

App móvil del proyecto **Lumen** para controlar tus gastos a partir de los tickets de compra. Le haces una foto al ticket, la [API](https://github.com/Lumen-app-mobile/api-main) lo procesa con OCR + IA, y la app te muestra la tienda, la fecha, los productos y en qué categorías gastas.

## Funcionalidades

- **Login** con Firebase Authentication
- **Escaneo de tickets** con la cámara, subida de imagen o archivo, o entrada manual
- **Revisión** de los datos extraídos por OCR antes de guardarlos
- **Inicio** con balance y últimos movimientos
- **Facturas / recibos**: listado y detalle con la imagen del ticket
- **Productos**: histórico de productos comprados y precios
- **Estadísticas** de gasto
- **Configuración**: perfil, categorías, etiquetas, sueldo, preferencias y datos
- Notificaciones e internacionalización (i18n)

## Stack

- [Expo SDK 55](https://expo.dev) + React Native 0.83
- [Expo Router](https://docs.expo.dev/router/introduction/) (rutas basadas en archivos)
- [NativeWind](https://www.nativewind.dev/) (Tailwind CSS para React Native)
- Firebase Auth
- `expo-camera`, `expo-document-picker`, `expo-secure-store`
- TypeScript

## Estructura

```
mobile-app/
├── app/                    # Pantallas (Expo Router)
│   ├── login.tsx
│   ├── stats.tsx
│   ├── facturas/[id].tsx
│   └── (tabs)/
│       ├── index/          # Inicio y detalle de recibos
│       ├── scan/           # Escaneo de tickets
│       ├── productos/      # Productos
│       └── config/         # Perfil, categorías, sueldo, preferencias…
├── src/
│   ├── services/           # Cliente de la API (transactions, tags, balance, categories…)
│   ├── lib/                # Auth, i18n, notificaciones
│   ├── hooks/              # useScanCamera, useFacturaManagement
│   ├── mappers/
│   ├── constants/
│   └── assets/
├── docs/                   # Notas técnicas
├── app.json
└── eas.json                # Configuración de builds con EAS
```

## Puesta en marcha

Requisitos: Node.js LTS y la [API](https://github.com/Lumen-app-mobile/api-main) en marcha.

```bash
npm install
cp .env.sample .env
```

En `.env`, apunta la app a tu API:

```env
EXPO_PUBLIC_API_BASE_URL=http://<tu-ip-local>:8080/
```

> Si pruebas en un móvil físico, usa la IP local de tu ordenador (no `localhost`) o un túnel como ngrok.

```bash
npx expo start      # servidor de desarrollo (Expo Go / emulador)
npm run android     # build nativa Android
npm run ios         # build nativa iOS
npm run web         # versión web
npm run lint
```

### Builds con EAS

```bash
npx eas build -p android --profile preview
```

## Proyecto Lumen

| Repo | Descripción |
|---|---|
| [api-main](https://github.com/Lumen-app-mobile/api-main) | API principal (Go) |
| [ocr-processor](https://github.com/Lumen-app-mobile/ocr-processor) | Extracción de datos de tickets con OCR + LLM |
| **mobile-app** | App móvil (este repo) |
| [landing-page](https://github.com/Lumen-app-mobile/landing-page) | Web del proyecto (Astro) |
| [docs](https://github.com/Lumen-app-mobile/docs) | Memoria y documentación |
