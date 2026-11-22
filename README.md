# mash-folio

A modern, single-page-style portfolio for **Mash**, a full-stack developer in Nairobi —
built with **React + Vite + Tailwind CSS** on top of the dark/cyan design template
(Poppins, `#1f242d` ink, `#0ef` neon accent, 10px rem scale).

Routes: `/`, `/about`, `/projects`, `/contact` (plus a styled 404).

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
  utils/
    data.js                # ALL content (profile, about, stats, services, skills,
                           #   projects, experience, process, testimonials, articles)
    techIcons.js           # tech name → icon map (with fallback)
    useScrollReveal.js     # reveal-on-scroll hook
```

## Make it yours

1. **Content** — edit `src/utils/data.js`. Everything is data-driven: profile and
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

…then add the rewrite rule `/*` → `/index.html` under **Redirects/Rewrites**.

### Other hosts

- **Netlify** — `public/_redirects` is already included.
- **Vercel** — `vercel.json` rewrite is already included.
- **GitHub Pages / others** — add an equivalent rewrite, or switch
  `BrowserRouter` to `HashRouter` in `src/main.jsx`.

## Notes

- The contact form is front-end only until you connect an endpoint; messages are not
  stored anywhere.
- Project copy, metrics, testimonials and article links are illustrative template
  content — replace them with your real work before publishing.
- The nav and case-study panels are drawers (right-side sheets), not dropdown menus:
  they animate in, lock scroll, trap focus and close on Esc.
