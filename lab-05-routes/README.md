# Sign routes

A road-sign catalog with React Router. The list, each sign, the dashboard, about, and login are separate addresses. Records come from `src/services/service.js`: Promises, a short delay, occasional errors, and `localStorage` under `sign-routes-data`. The first load seeds 101 signs.

## Run

```bash
npm install
npm run dev
npm run build
```

The dev server uses the `/React/routes/` base path. Deployed app: https://magamariott.github.io/React/routes/

## Routes

| Address | Screen |
| --- | --- |
| `/` | Home |
| `/about` | About |
| `/signs` | Sign list. Search, kind, progress, sort, and page are query parameters |
| `/signs/new` | Controlled form that adds a sign |
| `/signs/:id` | One sign, loaded by id |
| `/dashboard` | Counts and breakdowns from the service |
| `/login` | Placeholder for a later sign-in |
| anything else | Not found |

`App.jsx` only declares routes. `RootLayout` renders the navigation and an `Outlet`. The sign screens sit in a second nested layout. About, dashboard, login, the sign form, the sign page, and the 404 page are loaded with `React.lazy`.

GitHub Pages has no rewrite rule for client routes. `github-pages/404.html` is published at the site root. A direct visit to `/React/routes/signs/1` is sent back into this app, and the index page restores that address before React Router reads it.
