import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';

/**
 * Accessible side drawer (right-aligned).
 *
 * Rendered once and kept in the DOM; `open` drives the slide-in transition.
 * While closed it is aria-hidden, inert and visibility:hidden, so nothing inside
 * is focusable. While open it traps focus, closes on Esc/backdrop, locks body
 * scroll and restores focus to the trigger on exit.
 */
export default function Drawer({
  open,
  onClose,
  label,
  size = 'md',
  panelId,
  children,
  className = '',
}) {
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const lastFocused = useRef(null);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Block focus/AT access when hidden (visibility:hidden is the fallback).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.inert = !open;
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const panel = panelRef.current;
    lastFocused.current = document.activeElement;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = setTimeout(() => {
      closeRef.current?.focus();
    }, 80);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== 'Tab' || !panel) return;

      const focusable = panel.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;

      const target = lastFocused.current;
      if (target instanceof HTMLElement && document.contains(target)) {
        target.focus({ preventScroll: true });
      }
    };
  }, [open]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`drawer-root ${open ? 'open' : ''} ${className}`.trim()}
      ref={rootRef}
      aria-hidden={!open}
    >
      <div
        className="drawer-backdrop"
        onClick={() => onCloseRef.current?.()}
        aria-hidden="true"
      />

      <aside
        id={panelId}
        className={`drawer-panel drawer-${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        ref={panelRef}
      >
        <button
          type="button"
          className="drawer-close"
          onClick={() => onCloseRef.current?.()}
          aria-label="Close panel"
          ref={closeRef}
        >
          <FiX aria-hidden="true" />
        </button>

        <div className="drawer-scroll custom-scrollbar">{children}</div>
      </aside>
    </div>,
    document.body
  );
}
