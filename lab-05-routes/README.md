# Sign routes

A road-sign catalog with React Router, Firebase Authentication, and a cached sign service. The list, each sign, the dashboard, about, login, signup, and profile are separate addresses. Records come from `src/services/service.js`: Promises, a short delay, occasional errors, and `localStorage` under `sign-routes-data`. The first load seeds 101 signs. React components do not read storage or call the service themselves.

## Run

```bash
cp .env.example .env.local
npm install
npm run dev
npm run build
```

Fill `.env.local` with the Firebase web app config. `.env.local` stays off git. The names are in `.env.example`.

In the Firebase console, enable Email/Password and Google, then add `localhost` and `magamariott.github.io` as authorized domains.

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
| `/login` | Email/password login and Google sign-in |
| `/signup` | Email, password, and confirmation |
| `/profile` | Email and UID. Redirects to `/login` when signed out |
| anything else | Not found |

`App.jsx` only declares routes. `RootLayout` renders the navigation and an `Outlet`. The sign screens sit in a second nested layout. About, dashboard, login, signup, profile, the sign form, the sign page, and the 404 page are loaded with `React.lazy`.

The navigation shows Login and Signup when nobody is signed in, and Profile and Logout when someone is. `AuthProvider` follows `onAuthStateChanged`. Sessions use the browser's local persistence, so a refresh keeps the same user.

GitHub Pages has no rewrite rule for client routes. `github-pages/404.html` is published at the site root. A direct visit to `/React/routes/signs/1` is sent back into this app, and the index page restores that address before React Router reads it.

## Caching

The list, the open sign, and the dashboard stats go through TanStack Query in `src/hooks/useSignQueries.js`. The service stays in `src/services/service.js`.

Query keys:

- `['signs', 'list', { search, category, progress, sort, page }]`
- `['signs', 'detail', id]`
- `['signs', 'stats', category]`

A result is fresh for 60 seconds (`staleTime`). Opening the same list, sign, or dashboard filter again during that minute reads the cache and does not call the service. After 60 seconds the entry is stale. The next visit refetches it, and focusing the window refetches a stale entry too. An unused entry is dropped after 5 minutes (`gcTime`).

The cache is cleared when the deck changes:

- Creating a sign invalidates every list query and every stats query, and stores the new sign under its detail key.
- Changing the learned flag writes that sign into the detail cache and invalidates the list and the stats, so the cards and the counts match the write.

An older response cannot replace a newer one. Each filter and each id is its own key, and a query that is aborted (a fast filter change, or a switch to another sign) is ignored.
