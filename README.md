# ATOM Todo — Backend

API REST para el Challenge Técnico de ATOM. Construida con **Express + TypeScript**, desplegada en **Firebase Cloud Functions** y con **Firestore** como base de datos.

---

## Arquitectura

El proyecto sigue los principios de **Clean Architecture** combinados con **Domain-Driven Design (DDD)**. Cada capa tiene una responsabilidad única y las dependencias apuntan siempre hacia adentro:

```
presentation → application → domain ← infrastructure
```

```
functions/src/
├── domain/           # Entidades, interfaces de repositorios, errores de dominio, tipos de paginación
├── application/      # Casos de uso — una clase por caso de uso (SRP)
├── infrastructure/   # Implementaciones Firestore, singleton Firebase, factories, JWT, logger
└── presentation/     # Controladores Express, rutas, middlewares, DTOs con Zod
```

---

## Decisiones de diseño

| Patrón | Implementación |
|--------|---------------|
| **Repository Pattern** | `ITaskRepository` / `IUserRepository` son contratos del dominio. Las implementaciones con Firestore viven en infraestructura — intercambiables sin tocar la lógica de negocio. |
| **Singleton** | `FirebaseAdmin` inicializa el SDK una sola vez, reutilizando la conexión entre requests. Crítico para los cold starts de Cloud Functions. |
| **Factory** | `TaskRepositoryFactory` / `UserRepositoryFactory` abstraen la instanciación de repositorios y los retornan como singletons. |
| **Zod Validation** | El body y los query params se validan en la capa de presentación con middlewares `validateBody` / `validateQuery`. Datos inválidos nunca llegan a los casos de uso. |
| **Manejo centralizado de errores** | Las subclases de `DomainError` (`NotFoundError`, `ConflictError`, `UnauthorizedError`, etc.) mapean a códigos HTTP. Un único error handler de Express formatea todas las respuestas. |
| **Autenticación JWT** | Al hacer login o registro, el API devuelve un JWT firmado (`userId` + `email`, expiración 7 días). Todos los endpoints de tareas requieren `Authorization: Bearer <token>`. El `userId` siempre se toma del token — nunca del body o query string. |
| **Soft Delete** | Las tareas eliminadas se marcan con `isDeleted: true` + timestamp `deletedAt` en lugar de borrarse físicamente. Se filtran en todas las consultas. |
| **Paginación por cursor** | `GET /tasks` soporta paginación eficiente con `limit` y `cursor` (fecha ISO del último `createdAt`). Por defecto: 20 items, máximo: 100. |

---

## Endpoints

### Autenticación

Los endpoints de tareas requieren el header:
```
Authorization: Bearer <token>
```

El token se obtiene al buscar o crear un usuario.

### Usuarios

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/users/:email` | Busca un usuario por email. Devuelve token si existe. | No |
| `POST` | `/users` | Crea un usuario nuevo. Devuelve token. | No |

### Tareas

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `GET` | `/health` | Health check del servidor | No |
| `GET` | `/tasks` | Lista tareas del usuario autenticado (paginadas, orden `createdAt` asc) | Sí |
| `POST` | `/tasks` | Crea una tarea para el usuario autenticado | Sí |
| `PUT` | `/tasks/:id` | Actualiza título, descripción y/o estado de una tarea | Sí |
| `DELETE` | `/tasks/:id` | Elimina una tarea (soft delete) | Sí |

---

## Ejemplos de request / response

**POST `/users`** — Login o registro
```json
// Request
{ "email": "usuario@ejemplo.com" }

// Response 201
{
  "data": { "id": "abc123", "email": "usuario@ejemplo.com", "createdAt": "2024-01-15T10:00:00.000Z" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**GET `/users/:email`** — Buscar usuario existente
```json
// Response 200
{
  "data": { "id": "abc123", "email": "usuario@ejemplo.com", "createdAt": "2024-01-15T10:00:00.000Z" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**POST `/tasks`** — Crear tarea
```json
// Request (el userId se toma del JWT, no del body)
{ "title": "Comprar leche", "description": "En el supermercado" }

// Response 201
{
  "data": {
    "id": "xyz789",
    "userId": "abc123",
    "title": "Comprar leche",
    "description": "En el supermercado",
    "status": "pending",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**GET `/tasks?limit=20&cursor=2024-01-15T10:00:00.000Z`** — Listar tareas con paginación
```json
// Response 200
{
  "data": [
    { "id": "xyz789", "title": "Comprar leche", "status": "pending", ... }
  ],
  "nextCursor": "2024-01-16T08:30:00.000Z",
  "hasMore": true
}
```

**PUT `/tasks/:id`** — Actualizar tarea (todos los campos son opcionales)
```json
// Request
{ "title": "Nuevo título", "description": "Nueva descripción", "status": "completed" }

// Response 200
{ "data": { ...tareaActualizada } }
```

**DELETE `/tasks/:id`** — Eliminar tarea (soft delete)
```
// Response 204 No Content
```

---

## Errores

| Status | Tipo | Descripción |
|--------|------|-------------|
| `400` | `BadRequest` | Parámetro requerido faltante |
| `401` | `UnauthorizedError` | Token ausente, inválido o expirado |
| `404` | `NotFoundError` | Recurso no encontrado |
| `409` | `ConflictError` | El email ya está registrado |
| `422` | `ValidationError` | Body o query params inválidos |
| `500` | `InternalServerError` | Error inesperado del servidor |

---

## Configuración local

### Requisitos previos

- Node.js 18+
- Java 21+ (requerido por el emulador de Firebase)
- Firebase CLI: `npm install -g firebase-tools`

### Pasos

```bash
# 1. Instalar dependencias
cd functions && npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env y completar JWT_SECRET y ALLOWED_ORIGINS

# 3. Iniciar sesión en Firebase
firebase login

# 4. Seleccionar proyecto
firebase use backend-atom-eeffc

# 5. Levantar el emulador
firebase emulators:start
# API disponible en: http://127.0.0.1:5001/backend-atom-eeffc/us-central1/api
```

### Variables de entorno

Crear `functions/.env` basándose en `functions/.env.example`:

```env
JWT_SECRET=tu-secreto-muy-seguro-aqui
ALLOWED_ORIGINS=http://localhost:4200,https://tu-app.web.app
LOG_LEVEL=info
```

> **Importante:** Nunca subas el archivo `.env` al repositorio. Está incluido en `.gitignore`.

---

## Tests

```bash
cd functions

npm test                    # Ejecutar todos los tests
npm test -- --coverage      # Con reporte de cobertura
```

Cobertura actual: **100%** en statements, branches, funciones y líneas.

Los tests unitarios cubren los 6 casos de uso y los errores de dominio usando repositorios mock — no requieren conexión a Firebase.

---

## Despliegue

### Configuración inicial (una sola vez)

```bash
# Login en Firebase
firebase login

# Seleccionar proyecto (requiere plan Blaze)
firebase use backend-atom-eeffc

# Configurar el JWT secret en producción
firebase functions:secrets:set JWT_SECRET

# (Opcional) Obtener token CI para GitHub Actions
firebase login:ci
```

### Deploy manual

```bash
cd functions && npm run deploy
# Equivalente a: npm run build && firebase deploy --only functions
```

### CI/CD con GitHub Actions

Cada push a `main` ejecuta automáticamente:
1. Tests unitarios
2. Build de TypeScript
3. Deploy a Firebase

Agregar `FIREBASE_TOKEN` (obtenido con `firebase login:ci`) en los secrets del repositorio de GitHub.

---

## Esquema Firestore

### Colección `users`

```
{
  id:        string     // ID del documento (auto-generado)
  email:     string     // único, indexado
  createdAt: Timestamp
}
```

### Colección `tasks`

```
{
  id:          string              // ID del documento (auto-generado)
  userId:      string              // referencia al usuario propietario
  title:       string
  description: string
  status:      "pending" | "completed"
  createdAt:   Timestamp
  updatedAt:   Timestamp
  isDeleted:   boolean             // soft delete
  deletedAt:   Timestamp | null
}
```

Índices compuestos definidos en `firestore.indexes.json`:
- `(userId ASC, isDeleted ASC, createdAt ASC)` — usado en consultas paginadas

---

## Stack tecnológico

| Tecnología | Uso |
|-----------|-----|
| Node.js 20 | Runtime en Firebase Cloud Functions |
| Express.js | Framework HTTP |
| TypeScript (strict) | Lenguaje principal |
| Firebase Firestore | Base de datos |
| Zod | Validación de body y query params |
| jsonwebtoken | Autenticación JWT |
| pino + pino-http | Logger estructurado |
| Jest + ts-jest | Tests unitarios |
| GitHub Actions | CI/CD |
