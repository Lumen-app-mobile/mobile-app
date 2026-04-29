Sí. Lo normal sería que **la ruta de stats/info de usuario esté protegida por Firebase Auth**, y que el backend saque el usuario real del token, no solo del `id` que venga en la URL.

Mejor patrón:

```http
GET /api/user/me
GET /api/user/me/stats
GET /api/user/me/products
```

En vez de:

```http
GET /api/user/:id
GET /api/user/:id/stats
```

Porque si usas `:id`, alguien podría intentar pedir datos de otro usuario cambiando la URL. Aunque lo valides, es más fácil equivocarse.

Flujo recomendado:

1. El front inicia sesión con Firebase.
2. Firebase devuelve un `idToken`.
3. El front llama al backend con:

```http
Authorization: Bearer <firebase_id_token>
```

4. El backend verifica el token con Firebase Admin.
5. El backend obtiene el `uid` real desde el token.
6. Con ese `uid`, busca los datos del usuario y calcula stats.

Ejemplo de rutas:

```http
GET /api/user/me
GET /api/user/me/stats
GET /api/user/me/notifications
```

Y en backend:

```ts
const decodedToken = await admin.auth().verifyIdToken(token);
const firebaseUid = decodedToken.uid;
```

Luego usas `firebaseUid` para buscar en base de datos:

```ts
const user = await db.user.findUnique({
  where: { firebaseUid },
});
```

Mi recomendación: **no hagas `/api/user/:id/stats` para datos privados del usuario actual**. Haz `/api/user/me/stats` y deja que el backend resuelva quién es el usuario desde Firebase Auth.