# Behavior & Rules Reference

**Living snapshot** of product rules currently in force after Feature 1.

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
## UI rules

| Rule | Enforcement | Introduced |
|------|-------------|------------|
| Menu bar shows Recipes, Ingredients, OC logo, and current page title — not a Login control | `MenuBar` nav buttons; no Login link | Feature 1 |
| Selecting the current page's menu option must not error | Vue Router navigation to the active named route | Feature 1 |
| Menu bar shows the OC logo and the current page title | Logo image + `route.meta.title` | Feature 1 |
| Profile button shows initials in the top right; placeholder **JD** until a signed-in user exists | `MenuBar` avatar; `localStorage` `user` replaces placeholder | Feature 1 |
| Profile card shows that user's full name, email, and **Logout** | Same local `user` object | Feature 1 |
| Signed-in users hitting `/` are sent to Recipes; signed-out users see Login | `Login.vue` redirects when `localStorage` `user` exists | Feature 2 |
| **Logout** invalidates the server session, clears `user`, and navigates to Login | `POST /recipeapi/logout`; clear `user` only after success; `router.push({ name: "login" })` | Feature 2 |
| Success/failure notifications appear at the bottom of the screen, green for success and red for failure, with **Close** | `useNotification` + `AppNotification` | Feature 1 |
| Notifications are reusable across pages (Create, Update, Delete, Logout) | Shared composable; one component in `App.vue` | Feature 1 |
| Closing a notification does not undo the operation | `closeNotification` only removes the message | Feature 1 |
| Multiple notifications must not block the menu bar or page content | Stacked bottom tray; pointer-events only on alerts | Feature 1 |
| Users cannot open another user's profile from the menu bar | Profile reads only the signed-in `user` in `localStorage` | Feature 1 |
