import { useMemo, useState } from 'react';
import {
  FiAlertCircle,
  FiCheck,
  FiChevronDown,
  FiChevronRight,
  FiInbox,
  FiMail,
  FiRefreshCw,
  FiTrash2,
} from 'react-icons/fi';
import { formatMessageDate, useMessages } from '../useMessages';
import { EmptyState, PageHead, Panel } from '../components/AdminUI';

export default function MessagesPage() {
  const { messages, unread, loading, error, reload, markRead, remove, clearAll } = useMessages();
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState(null);
  const [busy, setBusy] = useState(false);

  const visible = useMemo(
    () => (filter === 'unread' ? messages.filter((message) => !message.read) : messages),
    [filter, messages]
  );

  const handleClear = async () => {
    if (!window.confirm('Delete every message in the inbox? This cannot be undone.')) return;

    setBusy(true);
    try {
      await clearAll();
      setOpenId(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-page">
      <PageHead eyebrow="Inbox" title="Messages">
        {messages.length} total · {unread} unread. Submitted through the contact form and stored by
        the Express API.
      </PageHead>

      <Panel
        title="Contact form submissions"
        actions={
          <>
            <div className="adm-seg" role="group" aria-label="Filter messages">
              <button
                type="button"
                className={filter === 'all' ? 'is-active' : ''}
                aria-pressed={filter === 'all'}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={filter === 'unread' ? 'is-active' : ''}
                aria-pressed={filter === 'unread'}
                onClick={() => setFilter('unread')}
              >
                Unread {unread > 0 && <span className="adm-badge">{unread}</span>}
              </button>
            </div>
            <button
              type="button"
              className="adm-btn adm-btn-ghost adm-btn-sm"
              onClick={() => reload()}
              disabled={loading}
            >
              <FiRefreshCw aria-hidden="true" />
              Refresh
            </button>
            {messages.length > 0 && (
              <button
                type="button"
                className="adm-btn adm-btn-ghost adm-btn-sm"
                onClick={handleClear}
                disabled={busy}
              >
                <FiTrash2 aria-hidden="true" />
                Clear all
              </button>
            )}
          </>
        }
      >
        {error && (
          <p className="adm-alert adm-alert-error" role="alert">
            <FiAlertCircle aria-hidden="true" />
            {error.status === 401
              ? 'Your session expired — sign in again to read the inbox.'
              : error.message}
          </p>
        )}

        {loading && messages.length === 0 ? (
          <div className="adm-empty" role="status">
            <p>Loading messages…</p>
          </div>
        ) : visible.length === 0 ? (
          <EmptyState title={filter === 'unread' ? 'No unread messages.' : 'The inbox is empty.'}>
            <a href="/contact" className="adm-link">
              Open the contact page
            </a>{' '}
            and send a note — it will appear here instantly.
          </EmptyState>
        ) : (
          <ul className="adm-messages">
            {visible.map((message) => {
              const open = openId === message.id;

              return (
                <li key={message.id} className={`adm-message${message.read ? '' : ' is-unread'}`}>
                  <div className="adm-message-head">
                    <button
                      type="button"
                      className="adm-message-toggle"
                      aria-expanded={open}
                      aria-controls={`message-${message.id}`}
                      onClick={() => {
                        setOpenId(open ? null : message.id);
                        if (!message.read) markRead(message.id, true);
                      }}
                    >
                      {open ? (
                        <FiChevronDown aria-hidden="true" />
                      ) : (
                        <FiChevronRight aria-hidden="true" />
                      )}
                      <span className="adm-message-who">
                        <strong>{message.name || 'Anonymous'}</strong>
                        <span>{message.subject}</span>
                      </span>
                    </button>

                    <div className="adm-message-meta">
                      <time dateTime={new Date(message.createdAt).toISOString()}>
                        {formatMessageDate(message.createdAt)}
                      </time>
                      {!message.read && <span className="adm-dot" aria-label="Unread" />}
                      <button
                        type="button"
                        className="adm-icon-btn"
                        aria-label={message.read ? 'Mark as unread' : 'Mark as read'}
                        title={message.read ? 'Mark as unread' : 'Mark as read'}
                        onClick={() => markRead(message.id, !message.read)}
                      >
                        <FiCheck aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="adm-icon-btn danger"
                        aria-label="Delete message"
                        title="Delete message"
                        onClick={() => remove(message.id)}
                      >
                        <FiTrash2 aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {open && (
                    <div className="adm-message-body" id={`message-${message.id}`}>
                      <p className="adm-message-text">{message.message}</p>
                      <div className="adm-message-actions">
                        <a
                          className="adm-btn adm-btn-ghost adm-btn-sm"
                          href={`mailto:${message.email}?subject=${encodeURIComponent(
                            `Re: ${message.subject}`
                          )}`}
                        >
                          <FiMail aria-hidden="true" />
                          Reply to {message.email}
                        </a>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      <div className="adm-note-panel">
        <FiInbox aria-hidden="true" />
        <p>
          Messages are stored by the API in <code>server/data/messages.json</code> (or{' '}
          <code>DATA_DIR</code>) and require an owner session to read. On Render&apos;s free tier the
          disk is ephemeral — attach a persistent disk or a database for long-term storage.
        </p>
      </div>
    </div>
  );
}
