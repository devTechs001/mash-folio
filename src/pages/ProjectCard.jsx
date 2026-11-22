import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  FiArrowUpRight,
  FiCheck,
  FiExternalLink,
  FiGithub,
  FiX,
} from 'react-icons/fi';
import { getTechIcon } from '../utils/techIcons';

function TechChips({ tech, limit }) {
  const visible = limit ? tech.slice(0, limit) : tech;
  const hidden = limit ? tech.length - visible.length : 0;

  return (
    <div className="project-tech">
      {visible.map((name) => {
        const Icon = getTechIcon(name);

        return (
          <span className="chip" key={name}>
            <Icon aria-hidden="true" />
            {name}
          </span>
        );
      })}
      {hidden > 0 && <span className="chip chip-more">+{hidden}</span>}
    </div>
  );
}

export default function ProjectCard({ project, index, onOpen }) {
  return (
    <article
      className={`project-card${project.featured ? ' is-featured' : ''}`}
      style={{ '--c1': project.colors[0], '--c2': project.colors[1] }}
    >
      <button
        type="button"
        className="project-cover"
        onClick={() => onOpen(project)}
        aria-label={`Open case study for ${project.title}`}
      >
        <span className="cover-grid" aria-hidden="true" />
        <span className="cover-index" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className="cover-top">
          <span className="project-badge">{project.category}</span>
          <span className="project-year">{project.year}</span>
        </span>

        <span className="cover-icons" aria-hidden="true">
          {project.tech.slice(0, 3).map((name) => {
            const Icon = getTechIcon(name);

            return (
              <span className="cover-icon" key={name}>
                <Icon />
              </span>
            );
          })}
        </span>

        <span className="cover-cta">
          View case study
          <FiArrowUpRight aria-hidden="true" />
        </span>
      </button>

      <div className="project-body">
        <p className="project-meta">
          <span className={`status-pill status-${project.status.toLowerCase().replace(/\s+/g, '-')}`}>
            {project.status}
          </span>
          {project.featured && <span className="featured-pill">Featured</span>}
          <span>{project.year}</span>
        </p>

        <h3 className="project-title">
          <button type="button" onClick={() => onOpen(project)}>
            {project.title}
          </button>
        </h3>

        <p className="project-blurb">{project.blurb}</p>

        <TechChips tech={project.tech} limit={4} />

        <div className="project-actions">
          <button type="button" className="text-link" onClick={() => onOpen(project)}>
            Case study
            <FiArrowUpRight aria-hidden="true" />
          </button>

          {project.links?.source && (
            <a
              className="text-link"
              href={project.links.source}
              target="_blank"
              rel="noreferrer noopener"
            >
              <FiGithub aria-hidden="true" />
              Source
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProjectModal({ project, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
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
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [onClose]);

  return createPortal(
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="modal custom-scrollbar"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        ref={dialogRef}
        style={{ '--c1': project.colors[0], '--c2': project.colors[1] }}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close case study"
          ref={closeRef}
        >
          <FiX aria-hidden="true" />
        </button>

        <div className="modal-cover">
          <span className="cover-grid" aria-hidden="true" />
          <span className="modal-cover-label">{project.category}</span>
          <span className="modal-cover-icons" aria-hidden="true">
            {project.tech.slice(0, 4).map((name) => {
              const Icon = getTechIcon(name);

              return (
                <span className="cover-icon" key={name}>
                  <Icon />
                </span>
              );
            })}
          </span>
        </div>

        <div className="modal-body">
          <div className="modal-meta">
            <span className="chip">{project.category}</span>
            <span className="chip">{project.year}</span>
            <span className="chip">{project.status}</span>
          </div>

          <h2 id="project-modal-title">{project.title}</h2>
          <p className="modal-lead">{project.description}</p>

          <h3 className="modal-subtitle">What I built</h3>
          <ul className="modal-highlights">
            {project.highlights.map((item) => (
              <li key={item}>
                <FiCheck aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="modal-subtitle">Stack</h3>
          <TechChips tech={project.tech} />

          <div className="modal-actions">
            {project.links?.live && (
              <a
                className="btn"
                href={project.links.live}
                target="_blank"
                rel="noreferrer noopener"
              >
                <FiExternalLink aria-hidden="true" />
                Live demo
              </a>
            )}

            {project.links?.source && (
              <a
                className="btn btn-outline"
                href={project.links.source}
                target="_blank"
                rel="noreferrer noopener"
              >
                <FiGithub aria-hidden="true" />
                Source code
              </a>
            )}

            <Link className="btn btn-ghost" to="/contact" onClick={onClose}>
              Ask about this project
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
