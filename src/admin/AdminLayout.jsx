import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FiBarChart2,
  FiEdit3,
  FiExternalLink,
  FiFolder,
  FiGitBranch,
  FiGrid,
  FiInbox,
  FiInfo,
  FiLayers,
  FiLogOut,
  FiMenu,
  FiMessageSquare,
  FiMoon,
  FiSettings,
  FiShare2,
  FiSun,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { useTheme } from '../context/ThemeContext';
import { useMessages } from './useMessages';

const groups = [
  {
    label: 'Overview',
    items: [{ to: '/admin', end: true, icon: FiGrid, label: 'Overview' }],
  },
  {
    label: 'Site content',
    items: [
      { to: '/admin/profile', icon: FiUser, label: 'Profile' },
      { to: '/admin/about', icon: FiInfo, label: 'About & stats' },
      { to: '/admin/skills', icon: FiBarChart2, label: 'Skills & stack' },
      { to: '/admin/socials', icon: FiShare2, label: 'Socials' },
      { to: '/admin/projects', icon: FiFolder, label: 'Projects' },
      { to: '/admin/services', icon: FiLayers, label: 'Services' },
      { to: '/admin/process', icon: FiGitBranch, label: 'Process' },
      { to: '/admin/testimonials', icon: FiMessageSquare, label: 'Testimonials' },
      { to: '/admin/writing', icon: FiEdit3, label: 'Writing' },
    ],
  },
  {
    label: 'Inbox',
    items: [{ to: '/admin/messages', icon: FiInbox, label: 'Messages', badge: 'unread' }],
  },
  {
    label: 'Account',
    items: [{ to: '/admin/settings', icon: FiSettings, label: 'Settings' }],
  },
];

function savedLabel(saveState, timestamp) {
  if (saveState === 'saving') return 'Saving changes…';
  if (saveState === 'error') return 'Saved locally — API unavailable';
  if (saveState === 'locked') return 'Sign in again to save';

  if (!timestamp) return 'All changes saved';

  try {
    return `Saved ${new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  } catch (error) {
    return 'Saved';
  }
}

export default function AdminLayout() {
  const { logout, email, session } = useAuth();
  const { lastSavedAt, saveState } = useContent();
  const { theme, toggle } = useTheme();
  const { unread } = useMessages();
  const navigate = useNavigate();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  const closeNav = () => setNavOpen(false);

  useEffect(() => {
    closeNav();
  }, [location.pathname]);

  useEffect(() => {
    if (!navOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeNav();
    };

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [navOpen]);

  const signOut = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const expiry = session?.expiresAt
    ? new Date(session.expiresAt).toLocaleString([], {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null;

  return (
    <div className="adm">
      <a className="skip-link" href="#admin-main">
        Skip to dashboard content
      </a>

      <header className="adm-topbar">
        <button
          type="button"
          className="adm-menu-btn"
          onClick={() => setNavOpen(true)}
          aria-label="Open dashboard menu"
          aria-expanded={navOpen}
          aria-controls="admin-sidebar"
        >
          <FiMenu aria-hidden="true" />
        </button>

        <Link to="/admin" className="adm-brand">
          <span className="adm-brand-mark" aria-hidden="true">
            M
          </span>
          <span>
            mash<span className="adm-brand-dot">.</span>folio
            <em>studio</em>
          </span>
        </Link>

        <span className="adm-saved" role="status" aria-live="polite">
          <span className="adm-saved-dot" aria-hidden="true" />
          {savedLabel(saveState, lastSavedAt)}
        </span>

        <div className="adm-topbar-actions">
          <button
            type="button"
            className="adm-icon-btn adm-topbar-btn"
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
          </button>

          <Link to="/" className="adm-btn adm-btn-ghost adm-btn-sm adm-view-site">
            <FiExternalLink aria-hidden="true" />
            View site
          </Link>

          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={signOut}>
            <FiLogOut aria-hidden="true" />
            Sign out
          </button>
        </div>
      </header>

      <div className="adm-body">
        {navOpen && (
          <button
            type="button"
            className="adm-scrim"
            aria-label="Close dashboard menu"
            onClick={closeNav}
          />
        )}

        <aside
          className={`adm-sidebar${navOpen ? ' is-open' : ''}`}
          id="admin-sidebar"
          aria-label="Dashboard sections"
        >
          <div className="adm-sidebar-inner">
            <div className="adm-sidebar-head">
              <p>Control panel</p>
              <button
                type="button"
                className="adm-icon-btn adm-sidebar-close"
                onClick={closeNav}
                aria-label="Close dashboard menu"
              >
                <FiX aria-hidden="true" />
              </button>
            </div>

            <nav className="adm-nav">
              {groups.map((group) => (
                <div className="adm-nav-group" key={group.label}>
                  <p className="adm-nav-label">{group.label}</p>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) => `adm-nav-link${isActive ? ' is-active' : ''}`}
                      >
                        <Icon aria-hidden="true" />
                        <span>{item.label}</span>
                        {item.badge === 'unread' && unread > 0 && (
                          <span className="adm-badge">{unread}</span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              ))}
            </nav>

            <div className="adm-sidebar-foot">
              <p className="adm-sidebar-email">{email}</p>
              {expiry && <p className="adm-sidebar-meta">Session ends {expiry}</p>}
              <p className="adm-sidebar-meta">
                Changes save to the API and are cached in this browser. Export a backup from
                Settings.
              </p>
            </div>
          </div>
        </aside>

        <main className="adm-main" id="admin-main" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
