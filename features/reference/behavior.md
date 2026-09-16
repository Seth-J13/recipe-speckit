# Behavior & Rules Reference

**Living snapshot** of product rules currently in force.

These files answer: *"What rules does the app enforce right now?"*  
They do **not** authorize new scope — implement only from `features/feature-*.md`.

| File | Role |
|------|------|
| [api.md](./api.md) | Routes / payloads |
| [data-model.md](./data-model.md) | Tables / columns |
| **This file** | Ownership, sort, validation, UI rules |

## Auth & session

| Rule | Enforcement | Introduced |
|------|-------------|------------|
| Login is **email + password** (Basic auth) | `POST /recipeapi/login` | Feature 2 |
| Unknown email → `"User not found!"` | HTTP 401 | Feature 2 |
| Wrong password → `"Invalid password!"` | HTTP 401 | Feature 2 |
| Login creates a 24-hour server session and returns a token | `sessions` row + encrypted session id | Feature 2 |
| Session payload is stored in `localStorage` key `user` | Login view | Feature 2 |
| Successful login navigates to Recipes | Vue router `recipes` | Feature 2 |
| Session survives Recipes navigation and refresh | Do not clear `user` except on logout / 401 | Feature 2 |
| Logout invalidates the server session, clears `user`, goes to Login | `POST /recipeapi/logout` + MenuBar | Feature 2 |
| Missing/expired token on protected APIs → 401; frontend clears session and redirects to Login | Authenticate middleware + axios interceptor (not the login URL) | Feature 2 |
| Login/logout return only the caller’s profile/token | Auth controller | Feature 2 |

Create Account remains Feature 1 and is not authorized by this snapshot’s Feature 2 rules.
