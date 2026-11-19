# Sign routes

A road-sign catalog with React Router, Firebase Authentication, TanStack Query, and a Progressive Web App shell. The list, each sign, the dashboard, about, login, signup, profile, and offline page are separate addresses.

Public sign records are served as JSON from `public/api/`. The service worker caches them at runtime. Personal progress (learned flags and signs you add) stays in `localStorage` under `sign-routes-deck` and is never written into the shared caches.

## Run

```bash
cp .env.example .env.local
npm install
npm run dev
npm run build
npm run preview
```

Fill `.env.local` with the Firebase web app config when you want email or Google sign-in. `.env.local` stays off git. The names are in `.env.example`.

The production build registers the service worker. Use `npm run build` and `npm run preview` (or the deployed site) to try install and offline.

Deployed app: https://magamariott.github.io/React/routes/

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
| `/offline` | Offline message and a retry button |
| anything else | Not found |

## PWA

`public/manifest.json` names the app, sets `display: "standalone"`, and points at 192 and 512 icons. `index.html` links the manifest and the theme color.

`public/sw.js` is written by the Vite build with a build id and the list of shell files. On `install` it precaches the shell: `index.html`, built JS and CSS, icons, the manifest, the photo, and `offline.html`. On `activate` it deletes caches from older builds and claims open clients. A waiting update is activated only when the page sends `SKIP_WAITING` from the Update button.

Runtime strategies:

- **Cache-first** for images and fonts (`sign-routes-static-v1`). At most 40 entries, kept for 30 days.
- **Network-first** for `api/signs.json` and `api/signs/<id>.json` (`sign-routes-api-v1`). A saved copy answers when the network fails. At most 60 entries, kept for 7 days. The response carries `X-SW-Cached-At` so the UI can show that a saved copy is on screen.
- **Navigation** always serves the precached shell so React Router can open any in-app address offline. If the shell is missing, `offline.html` is returned.

Firebase and Google requests are cross-origin and are never handled by this worker. Tokens and private auth data are not stored in the runtime caches. The connectivity probe (`api/ping.json`) always goes to the network.

The header shows Online or Offline. When the network is gone, a strip offers Retry connection. When a newer build is waiting, a strip offers Update. When the browser fires `beforeinstallprompt`, a strip offers Install.

## Caching (TanStack Query)

The list, the open sign, and the dashboard stats also go through TanStack Query in `src/hooks/useSignQueries.js`.

Query keys:

- `['signs', 'list', { search, category, progress, sort, page }]`
- `['signs', 'detail', id]`
- `['signs', 'stats', category]`

A result is fresh for 60 seconds. Creating a sign or changing the learned flag invalidates the list and the stats, and writes the detail entry.

## GitHub Pages

There is no rewrite rule for client routes. `github-pages/404.html` is published at the site root. A direct visit to `/React/routes/signs/1` is sent back into this app, and the index page restores that address before React Router reads it.
