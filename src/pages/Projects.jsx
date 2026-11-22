import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiFolder } from 'react-icons/fi';
import ProjectCard, { ProjectModal } from './ProjectCard';
import { projectFilters, projects } from '../utils/data';
import { useScrollReveal } from '../utils/useScrollReveal';
import '../styles/Projects.css';

export default function Projects() {
  const [filter, setFilter] = useState('All');
  const [activeProject, setActiveProject] = useState(null);
  const revealRef = useScrollReveal();

  const counts = useMemo(() => {
    return projectFilters.reduce((acc, category) => {
      acc[category] =
        category === 'All'
          ? projects.length
          : projects.filter((project) => project.category === category).length;
      return acc;
    }, {});
  }, []);

  const filtered = useMemo(
    () => (filter === 'All' ? projects : projects.filter((project) => project.category === filter)),
    [filter]
  );

  return (
    <div className="page projects-page" ref={revealRef}>
      <div className="container">
        <header className="page-head">
          <span className="eyebrow reveal">Portfolio</span>
          <h1 className="title reveal">
            Selected <span className="accent">work</span>
          </h1>
          <p className="reveal">
            A small sample of products I&apos;ve designed, built and shipped — each one solving a
            real problem for real people. Open a card to read how it was made.
          </p>
        </header>

        <div className="projects-toolbar reveal">
          <div className="filters" role="group" aria-label="Filter projects by category">
            {projectFilters.map((category) => (
              <button
                type="button"
                key={category}
                className={`filter-btn${filter === category ? ' active' : ''}`}
                aria-pressed={filter === category}
                onClick={() => setFilter(category)}
              >
                {category}
                <span className="filter-count">{counts[category]}</span>
              </button>
            ))}
          </div>

          <p className="projects-count" aria-live="polite">
            Showing {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="projects-grid" key={filter}>
            {filtered.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onOpen={setActiveProject}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FiFolder aria-hidden="true" />
            <h2>Nothing here yet</h2>
            <p>No projects in this category — try another filter.</p>
          </div>
        )}

        <div className="projects-cta reveal">
          <div>
            <h2>Something you&apos;d like built?</h2>
            <p>I&apos;m taking on new projects. Let&apos;s talk about yours.</p>
          </div>
          <Link to="/contact" className="btn">
            Start a project
            <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>

      {activeProject && (
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      )}
    </div>
  );
}
