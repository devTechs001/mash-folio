import { Link } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiEdit3,
  FiFolder,
  FiInbox,
  FiLayers,
  FiMessageSquare,
  FiPlus,
  FiSettings,
  FiUser,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { formatMessageDate, useMessages } from '../useMessages';
import { Panel, PageHead } from '../components/AdminUI';

const frontPages = [
  { path: '/', name: 'Home', systems: 'Hero, about preview, skills, selected work, services, process, testimonials, writing' },
  { path: '/about', name: 'About', systems: 'About copy, stats, experience timeline, tech stack' },
  { path: '/projects', name: 'Projects', systems: 'Project cards, filters, project drawers' },
  { path: '/contact', name: 'Contact', systems: 'Email, location, socials, contact form' },
];

export default function Overview() {
  const { content } = useContent();
  const { email, session } = useAuth();
  const { messages, unread } = useMessages();

  const stats = [
    { label: 'Projects', value: content.projects.length, to: '/admin/projects', icon: FiFolder },
    { label: 'Services', value: content.services.length, to: '/admin/services', icon: FiLayers },
    {
      label: 'Testimonials',
      value: content.testimonials.length,
      to: '/admin/testimonials',
      icon: FiMessageSquare,
    },
    { label: 'Articles', value: content.articles.length, to: '/admin/writing', icon: FiEdit3 },
    { label: 'Unread messages', value: unread, to: '/admin/messages', icon: FiInbox },
  ];

  const expiry = session?.expiresAt
    ? new Date(session.expiresAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
    : '—';

  return (
    <div className="adm-page">
      <PageHead
        eyebrow="Dashboard"
        title="Your portfolio, under control"
        actions={
          <>
            <Link to="/admin/projects" className="adm-btn adm-btn-primary adm-btn-sm">
              <FiPlus aria-hidden="true" />
              Add project
            </Link>
            <Link to="/admin/profile" className="adm-btn adm-btn-ghost adm-btn-sm">
              <FiUser aria-hidden="true" />
              Edit profile
            </Link>
          </>
        }
      >
        Signed in as <strong>{email}</strong>. Every change here updates the public site instantly
        and is saved in this browser.
      </PageHead>

      <div className="adm-stat-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link to={stat.to} className="adm-stat" key={stat.label}>
              <span className="adm-stat-icon">
                <Icon aria-hidden="true" />
              </span>
              <span className="adm-stat-value">{stat.value}</span>
              <span className="adm-stat-label">{stat.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="adm-grid-2">
        <Panel
          title="Front pages"
          description="What each public page pulls from the content systems."
        >
          <ul className="adm-page-list">
            {frontPages.map((page) => (
              <li key={page.path}>
                <div>
                  <p>{page.name}</p>
                  <span>{page.systems}</span>
                </div>
                <Link to={page.path} className="adm-link">
                  Open <FiArrowUpRight aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Recent messages"
          description="Submissions from the contact form land here."
          actions={
            <Link to="/admin/messages" className="adm-link">
              Inbox <FiArrowUpRight aria-hidden="true" />
            </Link>
          }
        >
          {messages.length === 0 ? (
            <div className="adm-empty">
              <p>No messages yet.</p>
              <span>Send one through the contact page to test the flow end to end.</span>
            </div>
          ) : (
            <ul className="adm-mini-list">
              {messages.slice(0, 3).map((message) => (
                <li key={message.id}>
                  <div>
                    <p>
                      {message.name}
                      {!message.read && <span className="adm-dot" aria-label="Unread" />}
                    </p>
                    <span>{message.subject}</span>
                  </div>
                  <time dateTime={new Date(message.createdAt).toISOString()}>
                    {formatMessageDate(message.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="adm-grid-2">
        <Panel title="Account" description="Owner session details.">
          <dl className="adm-dl">
            <div>
              <dt>Email</dt>
              <dd>{email || 'Not configured'}</dd>
            </div>
            <div>
              <dt>Session ends</dt>
              <dd>{expiry}</dd>
            </div>
            <div>
              <dt>Content store</dt>
              <dd>Browser localStorage</dd>
            </div>
          </dl>
          <p className="adm-note">
            This dashboard is a client-side owner gate: the password is never stored, only its
            SHA-256 hash. See Settings for backup and deployment notes.
          </p>
        </Panel>

        <Panel title="Quick links" description="Jump straight into the systems you edit most.">
          <div className="adm-quick">
            <Link to="/admin/profile">
              <FiUser aria-hidden="true" /> Profile
            </Link>
            <Link to="/admin/projects">
              <FiFolder aria-hidden="true" /> Projects
            </Link>
            <Link to="/admin/socials">
              <FiLayers aria-hidden="true" /> Socials
            </Link>
            <Link to="/admin/settings">
              <FiSettings aria-hidden="true" /> Settings
            </Link>
          </div>
        </Panel>
      </div>
    </div>
  );
}
