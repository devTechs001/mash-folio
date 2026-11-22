# mash-folio

A personal portfolio for **Mash**, a full-stack developer in Nairobi. Built with
**React + Vite + Tailwind CSS** on top of the supplied dark/cyan design template —
Poppins, `#1f242d` ink, `#0ef` neon accent, and a 10px rem scale.

Live routes: `/`, `/about`, `/projects`, `/contact` (plus a styled 404).

## What's inside

- **Landing page** — animated hero with a typing role, floating tech badges and a
  code-card visual; about preview with orbit-framed artwork; animated skill bars; a
  looping tech marquee; contact CTA.
- **About page** — narrative intro, stats, services, experience timeline and toolkit.
- **Projects page** — filterable grid, featured card, and an accessible case-study
  modal (Esc to close, backdrop click, focus trap, scroll lock).
- **Contact page** — validated form with sending/success states, contact cards and
  direct email fallback.
- **Chrome** — sticky blurred navbar with active states, mobile menu, scroll progress
  bar, back-to-top, footer, skip link.
- **Theme** — dark by default, with a full light theme and a toggle that persists to
  `localStorage` (applied before first paint to avoid a flash).
- **Motion** — scroll reveals via `IntersectionObserver`, all disabled under
  `prefers-reduced-motion`.
- **Accessibility** — semantic landmarks, visible focus rings, labelled controls,
  ARIA on interactive widgets, keyboard-operable cards, colour contrast tuned for both
  themes.

## Stack

| Layer      | Choice                                  |
| ---------- | --------------------------------------- |
| Framework  | React 18                                |
| Build tool | Vite 6                                  |
| Routing    | React Router 6                          |
| Styling    | Tailwind CSS 3 + hand-written CSS        |
| Icons      | `react-icons` (Feather + Simple Icons)  |
| Fonts      | Poppins (Google Fonts)                  |

Tailwind is configured and available for layout utilities; the design system itself
lives in the stylesheets (`src/index.css` + `src/styles/*.css`) because the template's
custom type scale and `62.5%` root font-size are easier to keep consistent there.

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
public/_redirects          # Netlify SPA fallback
vercel.json                # Vercel SPA rewrite
src/
  main.jsx                 # React root + BrowserRouter
  App.jsx                  # routes, theme, scroll progress, back-to-top, 404
  App.css                  # header, footer, page chrome
  index.css                # reset, design tokens, typography, buttons, utilities
  assets/
    about-visual.jpg       # generated hero/about artwork
  components/
    Navbar.jsx
    Hero.jsx
    SocialLinks.jsx
  pages/
    LandingPage.jsx        # hero + about + skills + CTA
    About.jsx
    Projects.jsx
    ProjectCard.jsx        # card + ProjectModal
    Skills.jsx
    Contact.jsx
    Footer.jsx
  styles/
    LandingPage.css        # hero, about, stats, skills, CTA, About page
    Projects.css           # filters, cards, modal
    Contact.css            # info cards, form, success state
  utils/
    data.js                # ALL content: profile, about, stats, skills, projects…
    techIcons.js           # tech name → icon map (with fallback)
    useScrollReveal.js     # reveal-on-scroll hook
```

## Make it yours

1. **Content** — edit `src/utils/data.js`. Everything (name, role, roles for the
   typing effect, bio, stats, services, skills + levels, tech stack, experience,
   projects, socials) is data-driven. Replace the placeholder email
   (`hello@mashfolio.dev`) and social URLs, and add `links.live` / `links.source`
   per project — empty strings hide the corresponding button.
2. **Images** — swap `src/assets/about-visual.jpg` for your own square photo or
   artwork (keep it around 900×900 and compress it).
3. **Colours & type** — the tokens at the top of `src/index.css`
   (`--bgColor`, `--mainColor`, `--accent`, `--gradient`, the `--text-*` scale) drive
   the entire site, including the light theme in `[data-theme='light']`.
4. **Contact form** — it validates and simulates a send. To actually deliver mail,
   replace the marked `setTimeout` in `src/pages/Contact.jsx` with a request to
   Formspree, EmailJS, Resend or your own endpoint. Keep the success state in sync.

## Deployment

The build is a static SPA, so deep links need a fallback to `index.html`:

- **Netlify** — `public/_redirects` is already included.
- **Vercel** — `vercel.json` rewrite is already included.
- **GitHub Pages / other static hosts** — add an equivalent rewrite, or switch
  `BrowserRouter` to `HashRouter` in `src/main.jsx`.

## Notes

- The contact form is front-end only until you connect an endpoint; messages are not
  stored anywhere.
- Project copy, metrics and experience entries are illustrative template content —
  replace them with your real work before publishing.
- Default theme is dark to match the template; the toggle preference is remembered per
  browser.
