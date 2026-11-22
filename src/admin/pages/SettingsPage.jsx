import { useRef, useState } from 'react';
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiDownload,
  FiKey,
  FiLogOut,
  FiRefreshCw,
  FiShield,
  FiUpload,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { PageHead, Panel } from '../components/AdminUI';

export default function SettingsPage() {
  const { email, sessionHours, session, logout } = useAuth();
  const { exportJSON, importJSON, reset } = useContent();
  const fileRef = useRef(null);
  const [pasteValue, setPasteValue] = useState('');
  const [status, setStatus] = useState(null); // { type: 'ok' | 'error', text }

  const expiry = session?.expiresAt
    ? new Date(session.expiresAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
    : '—';

  const download = () => {
    try {
      const blob = new Blob([exportJSON()], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mash-folio-content-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatus({ type: 'ok', text: 'Backup downloaded.' });
    } catch (error) {
      setStatus({ type: 'error', text: 'Could not create the download.' });
    }
  };

  const applyImport = (text) => {
    try {
      importJSON(text);
      setStatus({ type: 'ok', text: 'Content imported. Check the front pages.' });
      setPasteValue('');
    } catch (error) {
      setStatus({ type: 'error', text: error.message || 'Import failed.' });
    }
  };

  const onFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      applyImport(await file.text());
    } catch (error) {
      setStatus({ type: 'error', text: 'Could not read that file.' });
    } finally {
      event.target.value = '';
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Reset every page back to the seeded demo content? Your edits will be lost (export a backup first).'
      )
    ) {
      reset();
      setStatus({ type: 'ok', text: 'Content reset to the defaults in src/utils/data.js.' });
    }
  };

  return (
    <div className="adm-page">
      <PageHead eyebrow="Settings" title="Account, data & deployment">
        Everything an owner needs to hand this site off safely.
      </PageHead>

      <div className="adm-grid-2">
        <Panel title="Owner account" description="Credentials come from environment variables.">
          <dl className="adm-dl">
            <div>
              <dt>Email</dt>
              <dd>{email || 'Not configured'}</dd>
            </div>
            <div>
              <dt>Session length</dt>
              <dd>{sessionHours} hours</dd>
            </div>
            <div>
              <dt>This session ends</dt>
              <dd>{expiry}</dd>
            </div>
            <div>
              <dt>Password storage</dt>
              <dd>Server-side SHA-256 hash — never sent to the browser</dd>
            </div>
          </dl>

          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={logout}>
            <FiLogOut aria-hidden="true" />
            Sign out
          </button>
        </Panel>

        <Panel title="Rotate the password">
          <ol className="adm-steps">
            <li>
              Generate a new hash: <code>npm run auth:hash -- &quot;new-password&quot;</code>
            </li>
            <li>
              Update <code>ADMIN_PASSWORD_HASH</code> in <code>.env.local</code> (and in Render for
              production).
            </li>
            <li>Restart the Node server or redeploy — env vars are read at boot.</li>
          </ol>
          <p className="adm-note">
            <FiKey aria-hidden="true" /> Authentication is verified by the Express API and the
            browser only receives an <code>HttpOnly</code>, <code>SameSite=Lax</code> session
            cookie. Sessions live in server memory, so a restart signs everyone out.
          </p>
        </Panel>
      </div>

      <Panel
        title="Content backup"
        description="Content is saved to the API (server/data) and cached here. Export a snapshot before migrating hosts."
        actions={
          <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={download}>
            <FiDownload aria-hidden="true" />
            Export JSON
          </button>
        }
      >
        <div className="adm-grid-2">
          <div className="adm-field">
            <span className="adm-label">Import from file</span>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="adm-input adm-file"
              onChange={onFile}
            />
            <span className="adm-hint">Only content keys are applied; unknown keys are ignored.</span>
          </div>

          <div className="adm-field">
            <label className="adm-label" htmlFor="import-json">
              Or paste JSON
            </label>
            <textarea
              id="import-json"
              className="adm-input adm-textarea"
              rows={5}
              value={pasteValue}
              onChange={(event) => setPasteValue(event.target.value)}
              placeholder='{ "profile": { "name": "Mash" } }'
              spellCheck={false}
            />
            <button
              type="button"
              className="adm-btn adm-btn-sm"
              onClick={() => applyImport(pasteValue)}
              disabled={!pasteValue.trim()}
            >
              <FiUpload aria-hidden="true" />
              Import pasted JSON
            </button>
          </div>
        </div>

        {status && (
          <p className={`adm-inline-status ${status.type === 'ok' ? 'is-ok' : 'is-error'}`} role="status">
            {status.type === 'ok' ? (
              <FiCheckCircle aria-hidden="true" />
            ) : (
              <FiAlertTriangle aria-hidden="true" />
            )}
            {status.text}
          </p>
        )}

        <div className="adm-danger">
          <div>
            <p>Reset to seeded content</p>
            <span>Restores the demo profile, projects and copy from src/utils/data.js.</span>
          </div>
          <button type="button" className="adm-btn adm-btn-danger adm-btn-sm" onClick={handleReset}>
            <FiRefreshCw aria-hidden="true" />
            Reset everything
          </button>
        </div>
      </Panel>

      <Panel
        title="Deployment"
        description="The Express server hosts the API and the built site. Set these where it runs."
      >
        <div className="adm-env">
          <code>ADMIN_EMAIL</code>
          <span>Owner sign-in email.</span>
          <code>ADMIN_PASSWORD_HASH</code>
          <span>SHA-256 hex digest of the password.</span>
          <code>ADMIN_SESSION_HOURS</code>
          <span>Session lifetime in hours (default 8).</span>
          <code>DATA_DIR</code>
          <span>Where content.json and messages.json live (default server/data).</span>
          <code>PORT</code>
          <span>HTTP port for the API + site (Render sets this for you).</span>
        </div>
        <p className="adm-note">
          <FiShield aria-hidden="true" /> Render: deploy the repo as a <strong>Web Service</strong>{' '}
          (Node) with build <code>npm ci &amp;&amp; npm run build</code> and start{' '}
          <code>npm start</code>. The Blueprint in <code>render.yaml</code> does this and lists the
          secrets with <code>sync: false</code>. Attach a persistent disk at <code>DATA_DIR</code>{' '}
          if you need data to survive deploys.
        </p>
      </Panel>
    </div>
  );
}
