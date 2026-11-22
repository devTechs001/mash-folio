import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  FiMenu,
  FiSun,
  FiMoon,
  FiArrowRight,
  FiArrowUpRight,
  FiMail,
} from 'react-icons/fi';
import Drawer from './Drawer';
import { getSocialIcon } from './SocialLinks';
import { useContent } from '../context/ContentContext';
import { useTheme } from '../context/ThemeContext';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const { profile } = useContent();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isDark = theme === 'dark';

  const closeDrawer = () => setOpen(false);

  // Close the navigation drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) setOpen(false);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header className={`header${scrolled ? ' scrolled' : ''}`}>
      <Link to="/" className="logo" aria-label="Mash — back to home">
        <span className="logo-mark" aria-hidden="true">
          M
        </span>
        <span className="logo-text">
          mash<span>.</span>
        </span>
      </Link>

      <nav className="navbar" aria-label="Primary">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="header-actions">
        <button
          type="button"
          className="theme-toggle"
          onClick={toggle}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
          title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        >
          {isDark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
        </button>

        <Link to="/contact" className="btn btn-sm header-cta">
          Let&apos;s talk
        </Link>

        <button
          type="button"
          className="menu-icon"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="site-drawer"
          aria-label="Open navigation drawer"
        >
          <FiMenu aria-hidden="true" />
        </button>
      </div>

      <Drawer
        open={open}
        onClose={closeDrawer}
        label="Site navigation"
        panelId="site-drawer"
        className="nav-drawer-root"
      >
        <div className="nav-drawer">
          <div className="nav-drawer-head">
            <Link to="/" className="logo" onClick={closeDrawer}>
              <span className="logo-mark" aria-hidden="true">
                M
              </span>
              <span className="logo-text">
                mash<span>.</span>
              </span>
            </Link>
          </div>

          <p className="drawer-label">Navigate</p>
          <nav className="nav-drawer-links" aria-label="Site sections">
            {links.map((link, index) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={closeDrawer}
                className={({ isActive }) => `nav-drawer-link${isActive ? ' active' : ''}`}
              >
                <span className="nav-drawer-num">{String(index + 1).padStart(2, '0')}</span>
                <span className="nav-drawer-text">{link.label}</span>
                <FiArrowUpRight aria-hidden="true" />
              </NavLink>
            ))}
          </nav>

          <p className="drawer-label">Socials</p>
          <div className="nav-drawer-socials">
            {profile.socials.map((social) => {
              const Icon = getSocialIcon(social.icon);
              const isExternal = social.href.startsWith('http');

              return (
                <a
                  key={social.label}
                  href={social.href}
                  className="nav-drawer-social"
                  {...(isExternal
                    ? { target: '_blank', rel: 'noreferrer noopener' }
                    : {})}
                >
                  <Icon aria-hidden="true" />
                  <span>{social.label}</span>
                  <span className="nav-drawer-handle">{social.handle}</span>
                </a>
              );
            })}
          </div>

          <div className="nav-drawer-foot">
            <span className="nav-drawer-status">
              <i aria-hidden="true" />
              {profile.availability}
            </span>

            <Link to="/contact" className="btn" onClick={closeDrawer}>
              Start a project
              <FiArrowRight aria-hidden="true" />
            </Link>

            <a className="nav-drawer-mail" href={`mailto:${profile.email}`}>
              <FiMail aria-hidden="true" />
              {profile.email}
            </a>
          </div>
        </div>
      </Drawer>
    </header>
  );
}
