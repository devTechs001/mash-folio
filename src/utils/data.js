/**
 * Single source of truth for everything on the site.
 * Edit this file to make the portfolio yours — the UI is fully data-driven.
 */

export const profile = {
  name: 'Mash',
  firstName: 'Mash',
  role: 'Full-Stack Developer',
  roles: [
    'Full-Stack Developer',
    'React Engineer',
    'UI Craftsman',
    'Problem Solver',
  ],
  tagline:
    'I design and build fast, accessible web products — from the first wireframe to the final deploy.',
  location: 'Nairobi, Kenya',
  email: 'hello@mashfolio.dev',
  availability: 'Available for new projects',
  responseTime: 'Replies within 24 hours',
  socials: [
    {
      label: 'GitHub',
      handle: '@devTechs001',
      href: 'https://github.com/devTechs001',
      icon: 'github',
    },
    {
      label: 'LinkedIn',
      handle: 'in/devtechs001',
      href: 'https://www.linkedin.com/in/devtechs001',
      icon: 'linkedin',
    },
    {
      label: 'X / Twitter',
      handle: '@devtechs001',
      href: 'https://x.com/devtechs001',
      icon: 'twitter',
    },
    {
      label: 'Dev.to',
      handle: '@devtechs001',
      href: 'https://dev.to/devtechs001',
      icon: 'devto',
    },
    {
      label: 'Email',
      handle: 'hello@mashfolio.dev',
      href: 'mailto:hello@mashfolio.dev',
      icon: 'mail',
    },
  ],
};

export const heroCode = {
  lines: [
    { n: 1, content: [{ t: 'const', c: 'key' }, { t: ' developer ' , c: 'plain'}, { t: '=', c: 'op' }, { t: ' {', c: 'plain' }] },
    { n: 2, content: [{ t: 'name', c: 'prop' }, { t: ': ', c: 'plain' }, { t: "'Mash'", c: 'str' }, { t: ',', c: 'plain' }] },
    { n: 3, content: [{ t: 'role', c: 'prop' }, { t: ': ', c: 'plain' }, { t: "'Full-Stack Developer'", c: 'str' }, { t: ',', c: 'plain' }] },
    { n: 4, content: [{ t: 'based', c: 'prop' }, { t: ': ', c: 'plain' }, { t: "'Nairobi, KE'", c: 'str' }, { t: ',', c: 'plain' }] },
    { n: 5, content: [{ t: 'stack', c: 'prop' }, { t: ': [', c: 'plain' }, { t: "'React'", c: 'str' }, { t: ', ', c: 'plain' }, { t: "'Node'", c: 'str' }, { t: ', ', c: 'plain' }, { t: "'Tailwind'", c: 'str' }, { t: '],', c: 'plain' }] },
    { n: 6, content: [{ t: 'available', c: 'prop' }, { t: ': ', c: 'plain' }, { t: 'true', c: 'bool' }, { t: ',', c: 'plain' }] },
    { n: 7, content: [{ t: '};', c: 'plain' }] },
    { n: 8, content: [] },
    { n: 9, content: [{ t: 'function', c: 'key' }, { t: ' build', c: 'fn' }, { t: '(', c: 'plain' }, { t: 'idea', c: 'var' }, { t: ') {', c: 'plain' }] },
    { n: 10, content: [{ t: '  return', c: 'key' }, { t: ' idea', c: 'var' }, { t: '.map', c: 'fn' }, { t: '(', c: 'plain' }, { t: 'pixel', c: 'var' }, { t: ' => ', c: 'op' }, { t: 'craft', c: 'fn' }, { t: '(pixel));', c: 'plain' }] },
    { n: 11, content: [{ t: '}', c: 'plain' }] },
  ],
};

export const about = {
  lead:
    "I'm Mash, a full-stack developer based in Nairobi. I turn fuzzy ideas into products people actually enjoy using — clean interfaces on top, boring-and-reliable systems underneath.",
  paragraphs: [
    'I started out writing small tools to make my own life easier, and never really stopped. Today I build production web applications end to end: design systems and interfaces in React, APIs and data models in Node, then the pipelines that ship them safely.',
    "What I care about most is the details you feel rather than see — pages that load before you notice, forms that forgive mistakes, layouts that hold up from a 360px phone to an ultrawide display. I also care about the code behind it: small components, clear names, tests where they earn their keep.",
    'When I am not shipping, I am usually breaking apart an open-source library to see how it works, sketching UI ideas, or mentoring newer developers in the local community.',
  ],
  points: [
    'End-to-end delivery — design, build, deploy, iterate',
    'Accessibility and performance treated as features, not afterthoughts',
    'Clear communication, realistic timelines, no surprises',
  ],
};

export const stats = [
  { value: 5, suffix: '+', label: 'Years building for the web' },
  { value: 28, suffix: '', label: 'Projects shipped' },
  { value: 14, suffix: '', label: 'Clients & teams' },
  { value: 99, suffix: '/100', label: 'Average Lighthouse score' },
];

export const services = [
  {
    icon: 'code',
    title: 'Web applications',
    text: 'Production React apps with routing, auth, state and real APIs — built to grow past the MVP.',
  },
  {
    icon: 'layout',
    title: 'UI engineering',
    text: 'Design systems, component libraries and pixel-accurate interfaces that stay maintainable.',
  },
  {
    icon: 'server',
    title: 'APIs & data',
    text: 'Node services, REST and GraphQL endpoints, database schemas and background jobs.',
  },
  {
    icon: 'zap',
    title: 'Performance & a11y',
    text: 'Audits, Core Web Vitals work and accessibility fixes that measurably improve the product.',
  },
];

export const skills = {
  frontend: [
    { name: 'React / Next.js', level: 94 },
    { name: 'JavaScript / TypeScript', level: 90 },
    { name: 'HTML5 & CSS3', level: 96 },
    { name: 'Tailwind CSS', level: 92 },
    { name: 'Framer Motion', level: 80 },
  ],
  backend: [
    { name: 'Node.js / Express', level: 88 },
    { name: 'PostgreSQL / MongoDB', level: 84 },
    { name: 'REST & GraphQL APIs', level: 86 },
    { name: 'Docker & CI/CD', level: 76 },
    { name: 'Testing (Jest, Vitest)', level: 78 },
  ],
};

export const techStack = [
  'React',
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'Node.js',
  'Express',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'Docker',
  'GraphQL',
  'Firebase',
  'Supabase',
  'Git',
  'Figma',
  'Vite',
];

export const experience = [
  {
    role: 'Full-Stack Developer',
    company: 'Freelance & contract',
    period: '2023 — Present',
    summary:
      'Partnering with founders and product teams to take ideas from a blank canvas to a shipped product.',
    points: [
      'Shipped 12+ client applications across fintech, education and logistics',
      'Owned architecture, implementation and deployment on Vercel and AWS',
      'Introduced component libraries that cut new-feature build time roughly in half',
    ],
  },
  {
    role: 'Frontend Developer',
    company: 'Savannah Labs',
    period: '2022 — 2023',
    summary:
      'Built the customer-facing surface of a B2B analytics suite alongside a four-person product squad.',
    points: [
      'Rebuilt the dashboard in React + TypeScript with a shared design-system package',
      'Improved Lighthouse performance from 61 to 96 through code-splitting and image strategy',
      'Paired with design to turn Figma prototypes into accessible, responsive components',
    ],
  },
  {
    role: 'Junior Web Developer',
    company: 'Nairobi Web Collective',
    period: '2021 — 2022',
    summary:
      'Cut my teeth on marketing sites, WordPress builds and the occasional custom dashboard.',
    points: [
      'Delivered 20+ responsive marketing pages with a strong focus on Core Web Vitals',
      'Automated repetitive build and deployment steps with small Node scripts',
    ],
  },
];


export const processSteps = [
  {
    number: '01',
    icon: 'search',
    title: 'Discover',
    text: 'A working session to pin down the problem, the people and what success actually looks like. No decks, just questions.',
  },
  {
    number: '02',
    icon: 'design',
    title: 'Shape it',
    text: 'Wireframes and a technical plan side by side — so the interface and the data model stop surprising each other later.',
  },
  {
    number: '03',
    icon: 'build',
    title: 'Build',
    text: 'Small, reviewable increments with a live preview from week one. You see progress instead of status reports.',
  },
  {
    number: '04',
    icon: 'grow',
    title: 'Launch & iterate',
    text: 'Ship, measure, refine. I stay around after launch for the fixes and improvements only real users can reveal.',
  },
];

export const testimonials = [
  {
    quote:
      'Mash took a half-formed idea and turned it into a product our customers actually understand. The dashboard he built cut our support tickets by a third in the first month.',
    name: 'Amina Otieno',
    role: 'Product Lead',
    company: 'Nimbus',
    initials: 'AO',
    accent: ['#00e5ff', '#4f8cff'],
  },
  {
    quote:
      'He is the rare developer who pushes back on the right things — scope, not quality. We shipped two weeks early and the codebase is still a pleasure to work in.',
    name: 'Daniel Kimani',
    role: 'Founder',
    company: 'Savannah Labs',
    initials: 'DK',
    accent: ['#14b8a6', '#00e5ff'],
  },
  {
    quote:
      'Our site went from 58 to 99 on Lighthouse without a redesign. Mash documented everything so our own team could keep it that way.',
    name: 'Grace Wanjiru',
    role: 'Marketing Director',
    company: 'Campus Connect',
    initials: 'GW',
    accent: ['#8b5cf6', '#22d3ee'],
  },
];

export const articles = [
  {
    title: 'Why your React app feels slow',
    excerpt:
      'Four fixes that actually move the needle — from route-level splitting to the re-render you did not know you were causing.',
    date: 'May 2025',
    readingTime: '7 min read',
    tags: ['React', 'Performance'],
    source: 'Dev.to',
    url: 'https://dev.to/devtechs001',
  },
  {
    title: 'Designing forms people do not hate',
    excerpt:
      'Validation timing, error wording and the small layout decisions that decide whether someone finishes your form.',
    date: 'Feb 2025',
    readingTime: '6 min read',
    tags: ['UX', 'Accessibility'],
    source: 'Dev.to',
    url: 'https://dev.to/devtechs001',
  },
  {
    title: 'A local-first architecture you can ship this week',
    excerpt:
      'IndexedDB, an optimistic sync queue and a healthy distrust of the network — without rewriting your whole stack.',
    date: 'Nov 2024',
    readingTime: '9 min read',
    tags: ['Architecture', 'IndexedDB'],
    source: 'Dev.to',
    url: 'https://dev.to/devtechs001',
  },
];

export const projects = [
  {
    id: 'nimbus-analytics',
    title: 'Nimbus Analytics',
    category: 'Full-Stack',
    year: '2025',
    status: 'Live',
    featured: true,
    blurb:
      'A real-time product analytics dashboard that turns raw event streams into decisions.',
    description:
      'Nimbus is a multi-tenant analytics platform for product teams. It ingests events through a Node pipeline, rolls them up into time-series buckets, and renders them in a fast, keyboard-friendly dashboard. The hard part was never the charts — it was keeping queries snappy while letting teams slice data freely.',
    highlights: [
      'Streams 2M+ events per day through a Node ingestion pipeline into PostgreSQL and Redis',
      'Twelve reusable chart components with virtualised tables and saved views',
      'Cut first meaningful paint from 4.2s to 1.1s with route-level code splitting and caching',
    ],
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    colors: ['#00e5ff', '#4f8cff'],
    links: { source: 'https://github.com/devTechs001', live: '' },
  },
  {
    id: 'safari-pay',
    title: 'Safari Pay',
    category: 'Full-Stack',
    year: '2024',
    status: 'Live',
    blurb:
      'A checkout and reconciliation layer that makes mobile money feel instant for small merchants.',
    description:
      'Safari Pay wraps mobile-money APIs in a single, predictable checkout flow. Merchants get hosted payment links, webhook-driven confirmations and a reconciliation dashboard that explains every shilling that moved — including the failures.',
    highlights: [
      'Idempotent payment intents with retries and webhook signature verification',
      'Reconciliation view that flags mismatched or stuck transactions automatically',
      'Hosted checkout under 60KB, usable on 2G connections',
    ],
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Redis'],
    colors: ['#14b8a6', '#00e5ff'],
    links: { source: 'https://github.com/devTechs001', live: '' },
  },
  {
    id: 'folio-studio',
    title: 'Folio Studio',
    category: 'Frontend',
    year: '2024',
    status: 'Beta',
    blurb:
      'A visual portfolio builder with live theming, drag-to-arrange sections and instant publishing.',
    description:
      'Folio Studio lets creatives assemble a portfolio without touching code. The editor is a canvas of composable blocks, with a theme engine built on CSS custom properties, keyboard-first reordering and a preview that is the real site — not a screenshot.',
    highlights: [
      'Block-based editor with undo/redo and keyboard-accessible drag ordering',
      'Theme engine built on CSS variables with instant, flash-free preview',
      'Publishes static sites to a CDN in under three seconds',
    ],
    tech: ['React', 'Vite', 'Tailwind CSS', 'Supabase', 'Framer Motion'],
    colors: ['#38bdf8', '#6366f1'],
    links: { source: 'https://github.com/devTechs001', live: '' },
  },
  {
    id: 'devnotes',
    title: 'DevNotes',
    category: 'Frontend',
    year: '2023',
    status: 'Live',
    blurb:
      'An offline-first markdown notebook with instant search and zero accounts required.',
    description:
      'DevNotes is a local-first PWA for developers who hoard snippets. Notes live in IndexedDB, sync is optional, and full-text search stays under 30ms even with thousands of documents. It installs like a native app and works on a plane.',
    highlights: [
      'Offline-first architecture with IndexedDB and an optimistic sync queue',
      'Full-text fuzzy search across 5,000+ notes in under 30ms',
      'Installable PWA scoring 100 on Lighthouse accessibility',
    ],
    tech: ['React', 'TypeScript', 'Vite', 'IndexedDB', 'Tailwind CSS'],
    colors: ['#0ea5e9', '#22d3ee'],
    links: { source: 'https://github.com/devTechs001', live: '' },
  },
  {
    id: 'campus-connect',
    title: 'Campus Connect',
    category: 'Full-Stack',
    year: '2023',
    status: 'Live',
    blurb:
      'A community platform where students find study groups, events and campus resources.',
    description:
      'Campus Connect started as a WhatsApp replacement for one department and grew to 3,000 students. It handles groups, event RSVPs, moderation queues and a resource library, with a mobile-first UI that works on the cheapest Android phones.',
    highlights: [
      'Grew to 3,000 monthly active students without a marketing budget',
      'Realtime group chat with moderation tools and rate limiting',
      'Mobile-first UI tested on low-end Android devices and 3G',
    ],
    tech: ['React', 'Firebase', 'Tailwind CSS', 'Node.js'],
    colors: ['#8b5cf6', '#22d3ee'],
    links: { source: 'https://github.com/devTechs001', live: '' },
  },
  {
    id: 'aurora-ui',
    title: 'Aurora UI',
    category: 'Open Source',
    year: '2023',
    status: 'Open source',
    blurb:
      'An accessible React component library with 30+ primitives and zero runtime styling.',
    description:
      'Aurora UI is my attempt to build the component library I keep wishing existed: accessible by default, headless where it matters, and styled with plain CSS variables. Every component ships with tests, keyboard interaction notes and a Storybook story.',
    highlights: [
      '32 accessible components with WAI-ARIA patterns and keyboard navigation',
      'Zero-runtime styling through CSS custom properties and data attributes',
      'Documented with Storybook, unit tests and visual regression snapshots',
    ],
    tech: ['React', 'TypeScript', 'Storybook', 'Vitest', 'CSS'],
    colors: ['#06b6d4', '#3b82f6'],
    links: { source: 'https://github.com/devTechs001', live: '' },
  },
];

export const projectFilters = ['All', 'Full-Stack', 'Frontend', 'Open Source'];
