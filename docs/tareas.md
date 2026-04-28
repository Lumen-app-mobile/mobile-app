# Tareas pendientes

## Adri

- [ ] Implementar login con JWT.
      Configurar el flujo de autenticación para que la app reciba, guarde y use un token JWT válido en las llamadas protegidas.

- [ ] Arreglar persistencia del auth de Firebase.
      Mantener la sesión del usuario entre reinicios de la app y evitar que tenga que volver a iniciar sesión si el token sigue siendo válido.

- [ ] Implementar logout.
      Añadir la acción de cerrar sesión, limpiar credenciales locales y devolver al usuario a la pantalla de login.

- [ ] Implementar las pantallas que todavía no están diseñadas.
      Completar las vistas pendientes manteniendo el sistema visual actual y los patrones de navegación existentes.

- [ ] Arreglar el botón de notificaciones en el header.
      Definir y conectar la acción del botón para que abra la pantalla, sheet o modal de notificaciones.

- [ ] Definir las pautas de notificaciones.
      Establecer qué eventos generan notificaciones, cómo se priorizan y qué formato visual tendrán.

- [ ] Añadir icono de Lumen.
      Incorporar el icono final de la app en los assets y revisar que se usa correctamente en la configuración de Expo.

## Jhonny

- [ ] Definir DTOs, parsers y modelos internos de la app.
      Separar los datos que llegan del backend de los modelos que usa la interfaz, validando y transformando la información en un punto controlado.

- [ ] Añadir el campo de salario al modelo de usuario/perfil.
      Definir cómo se guarda y se muestra el salario para poder usarlo en configuración y futuras estadísticas.

- [ ] Implementar la lógica real de configuración.
      Conectar las opciones de configuración con estado persistente, servicios o navegación según corresponda.

- [ ] Añadir el campo de salario en `config/perfil`.
      Incorporar el salario en el formulario de perfil, con edición, validación básica y guardado. Seguir la regla de 50, 30, 20.

- [ ] Eliminar datos hardcodeados de la pantalla de inicio.
      Sustituir los valores estáticos por datos reales, mocks centralizados o una capa de carga preparada para backend.

- [ ] Hacer interactuable el botón “Ver stats”.
      Conectar el botón con la navegación, modal o sección correspondiente para que deje de ser solo visual.

- [ ] Exportar datos a CSV.
      Añadir una opción para generar y descargar/exportar los datos de la app en formato CSV.

- [ ] Migrar los modals del login a bottom sheet.
      Reemplazar el modal/sheet manual de login por el componente estándar de bottom sheet usado en la app.

- [ ] Concretar la pantalla de Scan.
      Definir el flujo, estados y acciones principales de la pantalla de escaneo antes de implementar la lógica final.

## Sin asignar

_No hay tareas sin asignar._
