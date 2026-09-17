# API Reference

**Status:** Feature 2 sign-in / sign-out is implemented.

API mount path: `/recipeapi` (`backend/server.js`).

## Endpoints

| Method | Endpoint | Auth | Purpose | Introduced |
|--------|----------|------|---------|------------|
| `POST` | `/recipeapi/login` | No (Basic) | Authenticate email + password; create session; return user + token | Feature 2 |
| `POST` | `/recipeapi/logout` | Yes (Bearer) | Delete the current session | Feature 2 |

### `POST /recipeapi/login`

**Request:** `Authorization: Basic <base64(email:password)>`

**Success `200`:**

```json
{
  "id": 1,
  "email": "DDevito@example.com",
  "firstName": "Danny",
  "lastName": "Devito",
  "token": "<encrypted-session-id>"
}
```

Never includes `password` or `salt`.

**Errors:** `{ "message": "…" }`

| Situation | Status | `message` |
|-----------|--------|-----------|
| Unknown email | 401 | `User not found!` |
| Wrong password | 401 | `Invalid password!` |

### `POST /recipeapi/logout`

**Request:** `Authorization: Bearer <token>`

**Success `200`:** `{ "message": "Logged out successfully." }`

**Missing/invalid token:** `401` `{ "message": "…" }`

## Conventions

- Flat JSON responses (no `{ success, data }` envelope).
- Errors: `{ "message": "..." }`.
- Authenticated routes: `Authorization: Bearer <token>`.
- Login uses HTTP Basic with **email:password**, not username.
