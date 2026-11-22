import { useEffect, useRef, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { FiArrowUp } from 'react-icons/fi';
import Navbar from './components/Navbar';
import SocialRail from './components/SocialRail';
import Footer from './pages/Footer';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import './App.css';

const STORAGE_KEY = 'mash-folio-theme';

const pageTitles = {
  '/': 'Mash — Full-Stack Developer',
  '/about': 'About — Mash',
  '/projects': 'Projects — Mash',
  '/contact': 'Contact — Mash',
};

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark';

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch (error) {
    /* storage can be blocked — fall back to the default theme */
  }

  return 'dark';
}

function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? Math.min(doc.scrollTop / max, 1) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={barRef} />
    </div>
  );
}

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const timer = setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else window.scrollTo(0, 0);
      }, 80);

      return () => clearTimeout(timer);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    return undefined;
  }, [pathname, hash]);

  return null;
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`back-to-top${visible ? ' visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <FiArrowUp aria-hidden="true" />
    </button>
  );
}

function NotFound() {
  return (
    <div className="page">
      <div className="container not-found">
        <div>
          <p className="not-found-code">404</p>
          <h1>This page wandered off</h1>
          <p>
            The link you followed doesn&apos;t exist — or maybe it moved. Let&apos;s get you back
            to something useful.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="btn">
              Back home
            </Link>
            <Link to="/projects" className="btn btn-outline">
              See my work
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      /* ignore storage failures, the theme still applies for this session */
    }

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#1f242d' : '#eef3f8');
  }, [theme]);

  useEffect(() => {
    const title = pageTitles[location.pathname];
    document.title = title ?? 'Page not found — Mash';
  }, [location.pathname]);

  return (
    <div className="app-shell" id="top">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <ScrollProgress />
      <ScrollManager />

      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      />

      <SocialRail />

      <main
        className="app-main page-enter"
        id="main-content"
        key={location.pathname}
        tabIndex={-1}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
