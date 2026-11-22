import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import ProjectCard from '../pages/ProjectCard';
import ProjectDrawer from './ProjectDrawer';
import { useContent } from '../context/ContentContext';
import { useScrollReveal } from '../utils/useScrollReveal';
import '../styles/Projects.css';

export default function SelectedWork() {
  const { content } = useContent();
  const projects = content.projects || [];
  const revealRef = useScrollReveal();
  const [activeProject, setActiveProject] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const picks = useMemo(() => {
    const featured = projects.filter((project) => project.featured);
    const rest = projects.filter((project) => !project.featured);
    return [...featured, ...rest].slice(0, 3);
  }, [projects]);

  const openProject = (project) => {
    setActiveProject(project);
    setDrawerOpen(true);
  };

  return (
    <section className="section work-section" id="work">
      <div className="container" ref={revealRef}>
        <div className="section-head">
          <span className="eyebrow reveal">Selected work</span>
          <h2 className="title reveal">
            A few things <span className="accent">I&apos;ve shipped</span>
          </h2>
          <p className="section-sub reveal">
            Products built end to end — open a card to read how each one works and what it took
            to get there.
          </p>
        </div>

        <div className="projects-grid work-grid">
          {picks.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={openProject}
              compact
            />
          ))}
        </div>

        <div className="section-foot reveal">
          <Link to="/projects" className="btn btn-outline">
            See all {projects.length} projects
            <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>

      <ProjectDrawer
        project={activeProject}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </section>
  );
}
