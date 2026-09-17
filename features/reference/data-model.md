# Data Model Reference

**Status:** Feature 2 session schema is implemented. `users` is read for login (owned by Feature 1 / Create account).

## Tables

### `users` (used by Feature 2 login; not created here)

| Field | Type | Rules |
|-------|------|-------|
| `id` | INTEGER PK | Auto-increment |
| `firstName` | STRING | Required |
| `lastName` | STRING | Required |
| `email` | STRING | Required; login identifier |
| `password` | BLOB | Required; salted hash only |
| `salt` | BLOB | Required |

### `sessions` (Feature 2)

| Field | Type | Rules |
|-------|------|-------|
| `id` | INTEGER PK | Auto-increment |
| `email` | STRING | Required |
| `expirationDate` | DATE | Required; 24 hours from login |
| `userId` | INTEGER FK | Required; references `users.id` |

The client `token` is the encrypted session `id`. It is not a column.

Sequelize also stores `createdAt` / `updatedAt` on these tables.

## Associations

- `User` hasMany `Session`
- `Session` belongsTo `User`
