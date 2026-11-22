import { useId, useState } from 'react';
import {
  FiChevronDown,
  FiChevronRight,
  FiChevronUp,
  FiCopy,
  FiPlus,
  FiTrash2,
} from 'react-icons/fi';

/* -------------------------------------------------------------------------- */
/* Layout atoms                                                               */
/* -------------------------------------------------------------------------- */

export function PageHead({ eyebrow, title, children, actions }) {
  return (
    <header className="adm-page-head">
      <div>
        {eyebrow && <p className="adm-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {children && <p className="adm-page-sub">{children}</p>}
      </div>
      {actions && <div className="adm-page-actions">{actions}</div>}
    </header>
  );
}

export function Panel({ title, description, actions, children, className = '' }) {
  return (
    <section className={`adm-panel ${className}`.trim()}>
      {(title || actions) && (
        <div className="adm-panel-head">
          <div>
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
          {actions && <div className="adm-panel-actions">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function EmptyState({ title, children }) {
  return (
    <div className="adm-empty">
      <p>{title}</p>
      {children && <span>{children}</span>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Form controls                                                              */
/* -------------------------------------------------------------------------- */

export function Field({ label, hint, htmlFor, children }) {
  return (
    <div className="adm-field">
      {label && (
        <label className="adm-label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {hint && <span className="adm-hint">{hint}</span>}
    </div>
  );
}

export function TextInput({ label, value, onChange, hint, type = 'text', ...rest }) {
  const id = useId();
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <input
        id={id}
        className="adm-input"
        type={type}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        {...rest}
      />
    </Field>
  );
}

export function TextArea({ label, value, onChange, hint, rows = 4, ...rest }) {
  const id = useId();
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <textarea
        id={id}
        className="adm-input adm-textarea"
        rows={rows}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        {...rest}
      />
    </Field>
  );
}

export function SelectInput({ label, value, onChange, options = [], hint }) {
  const id = useId();
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <select
        id={id}
        className="adm-input adm-select"
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function ColorInput({ label, value, onChange }) {
  const id = useId();
  return (
    <Field label={label} htmlFor={id}>
      <div className="adm-color">
        <input
          id={id}
          type="color"
          value={value || '#00eeff'}
          onChange={(event) => onChange(event.target.value)}
        />
        <input
          className="adm-input"
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          aria-label={`${label} hex value`}
          spellCheck={false}
        />
      </div>
    </Field>
  );
}

export function Toggle({ label, description, checked, onChange }) {
  return (
    <label className="adm-toggle">
      <span className="adm-toggle-copy">
        <span className="adm-label">{label}</span>
        {description && <span className="adm-hint">{description}</span>}
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={Boolean(checked)}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="adm-switch" aria-hidden="true" />
    </label>
  );
}

export function IconButton({ label, onClick, disabled, children, tone = '' }) {
  return (
    <button
      type="button"
      className={`adm-icon-btn ${tone}`.trim()}
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* List of plain strings                                                      */
/* -------------------------------------------------------------------------- */

export function StringListEditor({
  label,
  items = [],
  onChange,
  placeholder = 'Add an item',
  addLabel = 'Add',
  rows = 1,
  hint,
}) {
  const update = (index, value) => onChange(items.map((item, i) => (i === index ? value : item)));
  const remove = (index) => onChange(items.filter((_, i) => i !== index));
  const add = () => onChange([...items, '']);

  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="adm-field">
      {label && <span className="adm-label">{label}</span>}
      <div className="adm-list">
        {items.map((item, index) => (
          <div className="adm-list-row" key={index}>
            {rows > 1 ? (
              <textarea
                className="adm-input adm-textarea"
                rows={rows}
                value={item}
                placeholder={placeholder}
                onChange={(event) => update(index, event.target.value)}
              />
            ) : (
              <input
                className="adm-input"
                value={item}
                placeholder={placeholder}
                onChange={(event) => update(index, event.target.value)}
              />
            )}
            <div className="adm-list-tools">
              <IconButton label="Move up" onClick={() => move(index, -1)} disabled={index === 0}>
                <FiChevronUp aria-hidden="true" />
              </IconButton>
              <IconButton
                label="Move down"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
              >
                <FiChevronDown aria-hidden="true" />
              </IconButton>
              <IconButton label="Remove" tone="danger" onClick={() => remove(index)}>
                <FiTrash2 aria-hidden="true" />
              </IconButton>
            </div>
          </div>
        ))}
        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm adm-add" onClick={add}>
          <FiPlus aria-hidden="true" />
          {addLabel}
        </button>
      </div>
      {hint && <span className="adm-hint">{hint}</span>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Generic collection editor (projects, services, testimonials, …)            */
/* -------------------------------------------------------------------------- */

function deepCopy(value) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (error) {
    return { ...value };
  }
}

export function CollectionList({
  items = [],
  onChange,
  create,
  itemTitle,
  itemMeta,
  renderItem,
  addLabel = 'Add item',
  emptyText = 'Nothing here yet — add your first entry.',
}) {
  const [expanded, setExpanded] = useState(null);
  const baseId = useId();

  const update = (index, patch) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  const remove = (index) => {
    onChange(items.filter((_, i) => i !== index));
    setExpanded(null);
  };

  const duplicate = (index) => {
    const copy = deepCopy(items[index]);
    if (copy.id) copy.id = `${copy.id}-copy-${Math.random().toString(36).slice(2, 6)}`;
    const next = [...items.slice(0, index + 1), copy, ...items.slice(index + 1)];
    onChange(next);
    setExpanded(index + 1);
  };

  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    setExpanded(target);
  };

  const add = () => {
    onChange([...items, create()]);
    setExpanded(items.length);
  };

  return (
    <div className="adm-collection">
      {items.length === 0 && <EmptyState title={emptyText} />}

      {items.map((item, index) => {
        const open = expanded === index;
        const bodyId = `${baseId}-item-${index}`;

        return (
          <div className={`adm-item${open ? ' is-open' : ''}`} key={index}>
            <div className="adm-item-head">
              <button
                type="button"
                className="adm-item-toggle"
                aria-expanded={open}
                aria-controls={bodyId}
                onClick={() => setExpanded(open ? null : index)}
              >
                {open ? (
                  <FiChevronDown aria-hidden="true" />
                ) : (
                  <FiChevronRight aria-hidden="true" />
                )}
                <span className="adm-item-copy">
                  <span className="adm-item-title">{itemTitle(item, index)}</span>
                  {itemMeta && <span className="adm-item-meta">{itemMeta(item, index)}</span>}
                </span>
              </button>

              <div className="adm-item-tools">
                <IconButton
                  label="Move up"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                >
                  <FiChevronUp aria-hidden="true" />
                </IconButton>
                <IconButton
                  label="Move down"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                >
                  <FiChevronDown aria-hidden="true" />
                </IconButton>
                <IconButton label="Duplicate" onClick={() => duplicate(index)}>
                  <FiCopy aria-hidden="true" />
                </IconButton>
                <IconButton label="Delete" tone="danger" onClick={() => remove(index)}>
                  <FiTrash2 aria-hidden="true" />
                </IconButton>
              </div>
            </div>

            {open && (
              <div className="adm-item-body" id={bodyId}>
                {renderItem(item, (patch) => update(index, patch), index)}
              </div>
            )}
          </div>
        );
      })}

      <button type="button" className="adm-btn adm-btn-sm adm-add-collection" onClick={add}>
        <FiPlus aria-hidden="true" />
        {addLabel}
      </button>
    </div>
  );
}
