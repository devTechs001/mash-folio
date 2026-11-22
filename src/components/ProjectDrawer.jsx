import { Link } from 'react-router-dom';
import { FiCheck, FiExternalLink, FiGithub, FiMail } from 'react-icons/fi';
import Drawer from './Drawer';
import TechChips from './TechChips';
import { getTechIcon } from '../utils/techIcons';

export default function ProjectDrawer({ project, open, onClose }) {
  return (
    <Drawer
      open={open && Boolean(project)}
      onClose={onClose}
      label={project ? `Case study: ${project.title}` : 'Project case study'}
      size="lg"
      className="case-drawer"
    >
      {project && (
        <div className="case" style={{ '--c1': project.colors[0], '--c2': project.colors[1] }}>
          <div className="case-cover">
            <span className="cover-grid" aria-hidden="true" />

            <span className="case-cover-top">
              <span className="project-badge">{project.category}</span>
              <span className="project-badge case-cover-year">{project.year}</span>
            </span>

            <span className="case-icons" aria-hidden="true">
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

          <div className="case-body">
            <div className="case-meta">
              <span className={`status-pill status-${project.status.toLowerCase().replace(/\s+/g, '-')}`}>
                {project.status}
              </span>
              {project.featured && <span className="featured-pill">Featured</span>}
            </div>

            <h2 className="case-title">{project.title}</h2>
            <p className="case-lead">{project.description}</p>

            <h3 className="case-subtitle">What I built</h3>
            <ul className="case-highlights">
              {project.highlights.map((item) => (
                <li key={item}>
                  <FiCheck aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h3 className="case-subtitle">Stack</h3>
            <TechChips tech={project.tech} />

            <div className="case-actions">
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
                <FiMail aria-hidden="true" />
                Ask about this project
              </Link>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}
