# mash-folio

A modern, single-page-style portfolio for **Mash**, a full-stack developer in Nairobi —
built with **React + Vite + Tailwind CSS** on top of the dark/cyan design template
(Poppins, `#1f242d` ink, `#0ef` neon accent, 10px rem scale), with a **Node + Express**
backend for the owner dashboard.

Public routes: `/`, `/about`, `/projects`, `/contact` (plus a styled 404).
Owner routes: `/admin` (server-verified sign-in).

## What's inside

**Landing page** — a complete portfolio narrative:

1. **Hero** — animated typing role, tilted code-editor card, floating tech badges.
2. **About** — orbit-framed artwork, availability badge, quick facts and stats.
3. **Services** — four cards describing what you can be hired for.
4. **Selected work** — three project cards; each opens a case-study **drawer**.
5. **Skills** — animated proficiency bars and a looping tech marquee.
6. **Process** — four steps from discovery to launch.
7. **Testimonials** — client quotes with avatars and ratings.
8. **Writing** — article cards linking out to published posts.
9. **CTA** — contact prompt with email fallback.

**About page** — narrative intro, stats, services, experience timeline, toolkit.
**Projects page** — filterable grid, featured card, case-study drawer with deep detail.
**Contact page** — validated form (sending/success/error states), contact cards and a
**socials grid** for every profile. Submissions are stored by the API.

**Owner dashboard** (`/admin`) — server-backed:

- Email + password sign-in verified by Express against environment variables. The
  browser receives an `HttpOnly`, `SameSite=Lax` session cookie — no password or hash
  ships in the bundle.
- Sessions expire after `ADMIN_SESSION_HOURS`; a timer and the route guard sign you out.
- A drawer-based control panel (no dropdowns) with one section per front-page system:
  profile & hero, about/stats/experience, skills & tech stack, socials, projects,
  services, process, testimonials, writing, inbox and settings.
- Edits autosave to `PUT /api/content` and appear on the public site immediately for
  every visitor (with a local cache for instant paint).
- Contact form → `POST /api/messages` → dashboard inbox: read, reply, mark
  read/unread, delete.
- Export/import JSON backups and reset to seeded defaults.

**Backend** (`server/`) — Express 4:

- JSON-file persistence with atomic, serialized writes (`content.json`, `messages.json`).
- Owner auth, rate-limited login and message endpoints, validation for every payload.
- Serves the built SPA in production with SPA fallback, cache headers and security
  headers.

**Site chrome**

- Sticky glass navbar with active states and a **slide-in navigation drawer** on
  mobile (with socials, availability and CTA) — no dropdown menus.
- **Case-study drawers** instead of modals: slide in from the right, trap focus,
  close on Esc/backdrop and restore focus to the card you clicked.
- **Floating social rail** on wide screens, plus socials in the hero, footer, drawer
  and contact page.
- Scroll progress bar, back-to-top button, skip link and a custom 404.
- Dark theme by default with a full light theme; the toggle persists to
  `localStorage` and is applied before first paint.
- Scroll reveals via `IntersectionObserver`, all disabled under
  `prefers-reduced-motion`.
- Accessible by default: semantic landmarks, labelled controls, visible focus rings,
  keyboard-operable cards, `inert`/`aria-hidden` off-canvas panels.

## Stack

| Layer      | Choice                                     |
| ---------- | ------------------------------------------ |
| Frontend   | React 18                                   |
| Build tool | Vite 6                                     |
| Routing    | React Router 6                             |
| Styling    | Tailwind CSS 3 + hand-written CSS           |
| Icons      | `react-icons` (Feather + Simple Icons)     |
| Backend    | Node 20+ / Express 4                       |
| Storage    | JSON files (`server/data`)                 |
| Auth       | SHA-256 password digest + session cookie   |
| Fonts      | Poppins (Google Fonts)                     |

## Getting started

```bash
npm install
cp .env.example .env.local
npm run auth:hash -- "your-password"   # paste into ADMIN_PASSWORD_HASH
npm run dev                            # Vite :5173 + API :4000
```

`npm run dev` starts both processes; Vite proxies `/api` to Express, so the browser
only ever talks to one origin. Open http://localhost:5173, and sign in at `/admin`.

| Script          | What it does                                             |
| --------------- | -------------------------------------------------------- |
| `npm run dev`   | Vite + Express together (API on `:4000`)                 |
| `npm run dev:web` | Vite only                                              |
| `npm run dev:api` | Express only, with `node --watch`                      |
| `npm run build` | Production frontend build to `dist/`                     |
| `npm start`     | Express serves the API + `dist/`                         |
| `npm run api`   | Express without watch (API + `dist/` if built)           |
| `npm run preview` | Build, then serve API + `dist/`                        |
| `npm test`      | API tests with the built-in Node test runner             |
| `npm run auth:hash` | Print the SHA-256 digest for a password              |

## Project structure

```
index.html
render.yaml                # Render Blueprint (Node web service)
vercel.json                # Vercel SPA rewrite (frontend only)
public/_redirects          # Netlify SPA fallback (frontend only)
server/
  index.js                 # loads env, starts Express on PORT
  app.js                   # routes: health, auth, content, messages, SPA
  data/                    # content.json + messages.json (git-ignored)
  lib/
    auth.js                # SHA-256 verify, sessions, cookies
    config.js              # env loading + config
    store.js               # atomic JSON stores
    validation.js          # content + message payload guards
  test/api.test.js         # API integration tests
scripts/
  dev.mjs                  # runs Vite + Express together
  hash-password.mjs        # npm run auth:hash
src/
  main.jsx                 # React root + BrowserRouter
  App.jsx                  # providers, routes, social rail, scroll progress, 404
  lib/api.js               # typed-ish fetch wrapper for /api
  context/
    ThemeContext.jsx       # theme + localStorage persistence
    AuthContext.jsx        # server session (/me), login, logout, expiry
    ContentContext.jsx     # API content + local cache + debounced saves
  admin/
    AdminRoutes.jsx        # /admin/login + protected dashboard routes
    AdminLayout.jsx        # top bar, drawer navigation, save status
    RequireOwner.jsx       # waits for /me, then guards routes
    useMessages.js         # inbox hook backed by /api/messages
    components/AdminUI.jsx # form controls, list + collection editors
    pages/                 # overview, profile, about, skills, socials, projects,
                           #   services, process, testimonials, writing, messages,
                           #   settings, login
  components/ …            # navbar, hero, drawers, sections
  pages/ …                 # landing, about, projects, project card, skills, contact, footer
  styles/
    LandingPage.css
    Projects.css
    Contact.css
    admin.css              # dashboard layout, forms, login, drawers
  utils/
    data.js                # DEFAULT content (seed + fallback)
    techIcons.js
    useScrollReveal.js
```

## API

All routes are JSON. Owner routes require the session cookie set by login.

| Method   | Route                 | Access | Purpose                            |
| -------- | --------------------- | ------ | ---------------------------------- |
| `GET`    | `/api/health`         | public | Liveness + admin configuration flag |
| `GET`    | `/api/auth/me`        | public | Session + `configured` status       |
| `POST`   | `/api/auth/login`     | public | Verify credentials, set cookie      |
| `POST`   | `/api/auth/logout`    | public | Destroy session, clear cookie       |
| `GET`    | `/api/content`        | public | Current content document            |
| `PUT`    | `/api/content`        | owner  | Save the whole content document     |
| `POST`   | `/api/messages`       | public | Contact form submission (rate-limited) |
| `GET`    | `/api/messages`       | owner  | Inbox + unread count                |
| `PATCH`  | `/api/messages/:id`   | owner  | Mark read / unread                  |
| `DELETE` | `/api/messages/:id`   | owner  | Delete one message                  |
| `DELETE` | `/api/messages`       | owner  | Clear the inbox                     |

`GET /api/content` returns `{ "content": null, "updatedAt": null }` until the owner
saves for the first time; the frontend then renders the seeded defaults from
`src/utils/data.js`.

## Admin dashboard

### Configuration

| Variable                  | Purpose                                               |
| ------------------------- | ----------------------------------------------------- |
| `ADMIN_EMAIL`             | The single email allowed to sign in.                  |
| `ADMIN_PASSWORD_HASH`     | SHA-256 hex digest of the password (not the password). |
| `ADMIN_SESSION_HOURS`     | Session lifetime in hours (default `8`).               |
| `PORT`                    | Express port (default `4000`, Render sets it).         |
| `DATA_DIR`                | Where JSON data lives (default `server/data`).         |
| `VITE_API_URL`            | Optional absolute API origin if the frontend is hosted elsewhere. |

Generate hashes with `npm run auth:hash -- "your-password"`. Set the variables in
`.env.local` for development and in your host's environment for production. Secrets
are read by `server/index.js` only — they are never bundled into the browser build.

### Sessions and security

- Passwords are never stored; the server compares SHA-256 digests with
  `crypto.timingSafeEqual`.
- Login and message endpoints are rate-limited per IP; every payload is validated.
- Cookies are `HttpOnly`, `SameSite=Lax`, and `Secure` in production.
- Sessions live in server memory: restarting the server signs everyone out.
- Content and messages are written atomically to JSON files. On hosts with an
  ephemeral filesystem (Render free tier), attach a persistent disk at `DATA_DIR` or
  swap `server/lib/store.js` for a database.

### Backups

**Settings → Export JSON** downloads a snapshot. Import a file (or paste JSON) to
restore, and **Reset** returns to the seeded defaults. The same document lives at
`server/data/content.json` on the server.

## Make it yours

1. **Content** — sign in at `/admin` and edit the site without touching code, or change
   the defaults in `src/utils/data.js`. Everything is data-driven: profile and socials
   (with handles), bio, stats, services, skills and levels, tech stack, experience,
   projects, process steps, testimonials and articles. Replace the placeholder email
   (`hello@mashfolio.dev`) and social URLs; empty `links.live`/`links.source` hide
   those buttons automatically.
2. **Images** — swap `src/assets/about-visual.jpg` for your own square photo or
   artwork (≈900×900, compressed).
3. **Colours & type** — tokens at the top of `src/index.css` (`--bgColor`,
   `--mainColor`, `--accent`, `--gradient`, the `--text-*` scale) drive the whole
   site, including the light theme in `[data-theme='light']`.
4. **Backend storage** — replace `server/lib/store.js` with your database of choice;
   the routes and validation stay the same.

## Deploy

The app is a Node web service: Express serves `/api` and the built SPA.

### Render (one-click blueprint)

`render.yaml` creates a **Node web service** with:

- build command `npm ci && npm run build`
- start command `npm start`
- health check at `/api/health`
- pull-request previews
- `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` marked `sync: false` (entered once in the
  Render dashboard), `ADMIN_SESSION_HOURS=8`

To deploy: push the repo, then in Render choose **New → Blueprint**, pick the
repository and apply. Add the two secret values when prompted.

Prefer a manual setup? Create a **Web Service** with:

| Setting        | Value                    |
| -------------- | ------------------------ |
| Runtime        | Node                     |
| Build command  | `npm ci && npm run build` |
| Start command  | `npm start`              |
| Health check   | `/api/health`            |
| Env vars       | `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_HOURS` |

Data on the free tier is ephemeral; add a persistent disk mounted at `/var/data` and
set `DATA_DIR=/var/data` to keep edits and messages across deploys.

### Other hosts

Netlify and Vercel can still host the **frontend** (`public/_redirects` and
`vercel.json` are included), but the dashboard and contact inbox need the Node API.
Deploy `server/` separately (Render, Railway, Fly.io, a VPS) and point the frontend at
it with `VITE_API_URL`. Because session cookies are `SameSite=Lax`, the API must be
same-site with the frontend (or proxied through the same domain) for sign-in to work.
The simplest setup is the single Render service above, which serves both.

## Notes

- Project copy, metrics, testimonials and article links are illustrative template
  content — replace them with your real work before publishing.
- The nav and case-study panels are drawers (right-side sheets), not dropdown menus:
  they animate in, lock scroll, trap focus and close on Esc.
- `npm test` runs the API suite against an ephemeral server and temp data directory;
  it never touches `server/data`.
