import { FiArrowUpRight, FiGithub } from 'react-icons/fi';
import TechChips from '../components/TechChips';
import { getTechIcon } from '../utils/techIcons';

export default function ProjectCard({ project, index, onOpen, compact = false }) {
  const featured = project.featured && !compact;

  return (
    <article
      className={`project-card${featured ? ' is-featured' : ''}`}
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
