# Cambiar PNG a SVG

Reemplazar los assets PNG del proyecto por versiones SVG para mejor calidad en todas las densidades de pantalla.

## Archivos afectados

- `assets/images/icon.png`
- `assets/images/favicon.png`
- `assets/images/splash-icon.png`
- `assets/images/android-icon-background.png`
- `assets/images/android-icon-foreground.png`
- `assets/images/android-icon-monochrome.png`

## Pasos

- [ ] Obtener/exportar versiones SVG de cada asset desde Figma
- [ ] Añadir los `.svg` a `assets/images/`
- [ ] Actualizar referencias en `app.json` (icon, splash, etc.)
- [ ] Verificar que Metro los transforma correctamente (ya configurado con `react-native-svg-transformer`)
- [ ] Eliminar los PNG que ya no se usen
