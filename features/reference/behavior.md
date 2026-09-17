# Behavior & Rules Reference

**Living snapshot** of product rules currently in force after Feature 1.

These files answer: *"What rules does the app enforce right now?"*  
They do **not** authorize new scope — implement only from `features/feature-*.md`.

| File | Role |
|------|------|
| [api.md](./api.md) | Routes / payloads |
| [data-model.md](./data-model.md) | Tables / columns |
| **This file** | Ownership, sort, validation, UI rules |

## UI rules

| Rule | Enforcement | Introduced |
|------|-------------|------------|
| Menu bar shows Recipes, Ingredients, OC logo, and current page title — not a Login control | `MenuBar` nav buttons; no Login link | Feature 1 |
| Selecting the current page's menu option must not error | Vue Router navigation to the active named route | Feature 1 |
| Menu bar shows the OC logo and the current page title | Logo image + `route.meta.title` | Feature 1 |
| Profile button shows initials in the top right; placeholder **JD** until a signed-in user exists | `MenuBar` avatar; `localStorage` `user` replaces placeholder | Feature 1 |
| Profile card shows that user's full name, email, and **Logout** | Same local `user` object | Feature 1 |
| App opens on Recipes with the menu bar; no login screen | `/` redirects to `/recipes`; login route not registered | Feature 1 |
| **Logout** ends the local session on success, keeps the menu bar, and does not open a login screen | `POST /recipeapi/logout`; clear `user` only after success; stay on current page | Feature 1 |
| Success/failure notifications appear at the bottom of the screen, green for success and red for failure, with **Close** | `useNotification` + `AppNotification` | Feature 1 |
| Notifications are reusable across pages (Create, Update, Delete, Logout) | Shared composable; one component in `App.vue` | Feature 1 |
| Closing a notification does not undo the operation | `closeNotification` only removes the message | Feature 1 |
| Multiple notifications must not block the menu bar or page content | Stacked bottom tray; pointer-events only on alerts | Feature 1 |
| Users cannot open another user's profile from the menu bar | Profile reads only the signed-in `user` in `localStorage` | Feature 1 |
