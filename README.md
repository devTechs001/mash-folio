# mash-folio

A modern, single-page-style portfolio for **Mash**, a full-stack developer in Nairobi —
built with **React + Vite + Tailwind CSS** on top of the dark/cyan design template
(Poppins, `#1f242d` ink, `#0ef` neon accent, 10px rem scale).

Routes: `/`, `/about`, `/projects`, `/contact` (plus a styled 404) and an
owner-only dashboard at `/admin`.

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
**Contact page** — validated form (sending/success states), contact cards and a
**socials grid** for every profile.

**Owner dashboard** (`/admin`)

- Email + password sign-in against environment variables, with an expiring session
  (`localStorage` when “keep me signed in”, `sessionStorage` otherwise).
- A drawer-based control panel (no dropdowns) with one section per front-page system:
  profile & hero, about/stats/experience, skills & tech stack, socials, projects,
  services, process, testimonials, writing, inbox and settings.
- Edits autosave to `localStorage` and render on the public site immediately, in this
  tab and across tabs. Export/import JSON backups and reset to the seeded content.
- The contact form feeds the dashboard inbox; messages can be read, replied to,
  marked read/unread and deleted.

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

| Layer      | Choice                                  |
| ---------- | --------------------------------------- |
| Framework  | React 18                                |
| Build tool | Vite 6                                  |
| Routing    | React Router 6                          |
| Styling    | Tailwind CSS 3 + hand-written CSS        |
| Icons      | `react-icons` (Feather + Simple Icons)  |
| Fonts      | Poppins (Google Fonts)                  |

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the build locally

# owner dashboard credentials (copy the template first)
cp .env.example .env.local
npm run auth:hash -- "your-password"   # paste into VITE_ADMIN_PASSWORD_HASH
```

## Project structure

```
index.html
render.yaml                # Render Blueprint (static site + SPA rewrite)
vercel.json                # Vercel SPA rewrite
public/_redirects          # Netlify SPA fallback
src/
  main.jsx                 # React root + BrowserRouter
  App.jsx                  # routes, theme, social rail, scroll progress, 404
  App.css                  # header, nav drawer, social rail, footer, chrome
  index.css                # reset, design tokens, typography, buttons, utilities
  assets/about-visual.jpg
  components/
    Navbar.jsx             # desktop nav + mobile navigation drawer
    Hero.jsx
    Drawer.jsx             # accessible side-drawer primitive
    ProjectDrawer.jsx      # case-study drawer content
    TechChips.jsx
    Services.jsx
    SelectedWork.jsx
    Process.jsx
    Testimonials.jsx
    Writing.jsx
    SocialLinks.jsx
    SocialRail.jsx
  pages/
    LandingPage.jsx        # hero + all landing sections
    About.jsx
    Projects.jsx
    ProjectCard.jsx        # card (reused on landing + projects page)
    Skills.jsx
    Contact.jsx
    Footer.jsx
  styles/
    LandingPage.css        # hero, about, services, skills, process, testimonials…
    Projects.css           # filters, cards, case-study drawer
    Contact.css            # contact cards, form, socials grid
  context/
    ThemeContext.jsx       # theme + localStorage persistence
    AuthContext.jsx        # owner session, SHA-256 login, expiry
    ContentContext.jsx     # editable content store (seeded from data.js)
  admin/
    AdminRoutes.jsx        # /admin/login + protected dashboard routes
    AdminLayout.jsx        # top bar, drawer navigation, autosave status
    RequireOwner.jsx       # redirects signed-out visitors to the login screen
    useMessages.js         # live inbox hook
    components/AdminUI.jsx # form controls, list + collection editors
    pages/                 # overview, profile, about, skills, socials, projects,
                           #   services, process, testimonials, writing, messages,
                           #   settings, login
  utils/
    data.js                # DEFAULT content (seed for the dashboard)
    messages.js            # contact-form → localStorage inbox helpers
    techIcons.js           # tech name → icon map (with fallback)
    useScrollReveal.js     # reveal-on-scroll hook
  styles/admin.css         # dashboard layout, forms, login, responsive drawers
  scripts/hash-password.mjs  # npm run auth:hash → SHA-256 hex
```

## Make it yours

1. **Content** — sign in at `/admin` and edit the site without touching code, or
   change the defaults in `src/utils/data.js`. Everything is data-driven: profile and
   socials (with handles), bio, stats, services, skills and levels, tech stack,
   experience, projects, process steps, testimonials and articles. Replace the
   placeholder email (`hello@mashfolio.dev`) and social URLs; empty
   `links.live`/`links.source` hide those buttons automatically.
2. **Images** — swap `src/assets/about-visual.jpg` for your own square photo or
   artwork (≈900×900, compressed).
3. **Colours & type** — tokens at the top of `src/index.css` (`--bgColor`,
   `--mainColor`, `--accent`, `--gradient`, the `--text-*` scale) drive the whole
   site, including the light theme in `[data-theme='light']`.
4. **Contact form** — it validates and simulates a send. Replace the marked
   `setTimeout` in `src/pages/Contact.jsx` with Formspree / EmailJS / your API.

## Admin dashboard

The dashboard is owner-only and configured entirely through environment variables —
no credentials in source.

| Variable                  | Purpose                                              |
| ------------------------- | ---------------------------------------------------- |
| `VITE_ADMIN_EMAIL`        | The single email allowed to sign in.                 |
| `VITE_ADMIN_PASSWORD_HASH`| SHA-256 hex digest of the password (not the password).|
| `VITE_ADMIN_SESSION_HOURS`| Session lifetime in hours (default `8`).             |

Set them in `.env.local` for development (`.env.example` is the template) and in your
host's dashboard for production. **Vite inlines `VITE_*` values at build time**, so
redeploy after changing them.

- Generate a hash with `npm run auth:hash -- "your-password"`.
- Sign in at `/admin`; `RequireOwner` protects every dashboard route and sessions
  expire automatically (a timer signs you out).
- Content is stored in `localStorage` (`mash-folio-content-v1`) and seeds from
  `src/utils/data.js`. Use **Settings → Export JSON** for backups, import to restore,
  or reset to the seeded demo. Clearing site data also clears edits.
- Contact submissions land in `/admin/messages` in the same browser. For real
  delivery, post the form to an API and replace the helpers in `src/utils/messages.js`.

### Security note

Because this is a static site, the auth check runs in the browser: only the SHA-256
hash is bundled (never the plaintext password), and the session is a local token. That
is enough to keep the dashboard out of casual reach, but it is **not** server-grade
authorisation. For sensitive data or a public production deployment, put the
dashboard behind a real backend/edge function (e.g. Render web service + signed cookie)
and have it own the admin API.

## Deploy

The build is a static SPA, so every route needs to fall back to `index.html`.

### Render (one-click blueprint)

`render.yaml` is included and configured with:

- build command `npm ci && npm run build`
- publish path `./dist`
- catch-all rewrite `/* → /index.html`
- immutable caching for hashed assets
- pull-request previews

To deploy: push the repo, then in Render choose **New → Blueprint**, pick the
repository and apply. Render creates the `mash-folio` static site and redeploys on
every push to the tracked branch.

Prefer a manual setup? Create a **Static Site** with:

| Setting          | Value                  |
| ---------------- | ---------------------- |
| Build command    | `npm ci && npm run build` |
| Publish directory| `dist`                 |
| Env var          | `NODE_VERSION=22.22.3` |
| Env vars         | `VITE_ADMIN_EMAIL`, `VITE_ADMIN_PASSWORD_HASH`, `VITE_ADMIN_SESSION_HOURS` |

…then add the rewrite rule `/*` → `/index.html` under **Redirects/Rewrites**.

### Other hosts

- **Netlify** — `public/_redirects` is already included.
- **Vercel** — `vercel.json` rewrite is already included.
- **GitHub Pages / others** — add an equivalent rewrite, or switch
  `BrowserRouter` to `HashRouter` in `src/main.jsx`.

## Notes

- The contact form stores submissions in this browser so the dashboard inbox works
  without a backend; connect an endpoint (or use the helpers in
  `src/utils/messages.js`) for real delivery.
- Dashboard edits live in the owner's browser until you add a backend. Export a JSON
  backup before clearing site data or moving to another device.
- Project copy, metrics, testimonials and article links are illustrative template
  content — replace them with your real work before publishing.
- The nav and case-study panels are drawers (right-side sheets), not dropdown menus:
  they animate in, lock scroll, trap focus and close on Esc.
