import { Link } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';
import { useContent } from '../../context/ContentContext';
import {
  CollectionList,
  ColorInput,
  PageHead,
  Panel,
  StringListEditor,
  TextArea,
  TextInput,
  Toggle,
} from '../components/AdminUI';

function newProject() {
  return {
    id: `project-${Date.now().toString(36)}`,
    title: 'New project',
    category: 'Full-Stack',
    year: String(new Date().getFullYear()),
    status: 'Live',
    featured: false,
    blurb: '',
    description: '',
    highlights: [],
    tech: [],
    colors: ['#00eeff', '#4f8cff'],
    links: { source: '', live: '' },
  };
}

export default function ProjectsPage() {
  const { content, setSection } = useContent();
  const { projects } = content;

  const featuredCount = projects.filter((project) => project.featured).length;

  return (
    <div className="adm-page">
      <PageHead
        eyebrow="Projects system"
        title="Case studies"
        actions={
          <Link to="/projects" className="adm-btn adm-btn-ghost adm-btn-sm">
            Preview projects <FiExternalLink aria-hidden="true" />
          </Link>
        }
      >
        {projects.length} projects · {featuredCount} featured on the home page. Filters are generated
        from categories automatically.
      </PageHead>

      <Panel
        title="All projects"
        description="Featured projects are picked first for the home page. Only the first three appear there."
      >
        <CollectionList
          items={projects}
          onChange={(next) => setSection('projects', next)}
          create={newProject}
          itemTitle={(project) => project.title || 'Untitled project'}
          itemMeta={(project) =>
            [project.category, project.year, project.featured ? 'Featured' : null]
              .filter(Boolean)
              .join(' · ')
          }
          addLabel="Add project"
          renderItem={(project, patch) => (
            <>
              <div className="adm-grid-2">
                <TextInput
                  label="Title"
                  value={project.title}
                  onChange={(title) => patch({ title })}
                />
                <TextInput
                  label="Slug / id"
                  value={project.id}
                  onChange={(id) => patch({ id })}
                  hint="Used as a stable key and deep link."
                  spellCheck={false}
                />
                <TextInput
                  label="Category"
                  value={project.category}
                  onChange={(category) => patch({ category })}
                  hint="Creates a filter chip, e.g. Full-Stack."
                />
                <TextInput label="Year" value={project.year} onChange={(year) => patch({ year })} />
                <TextInput
                  label="Status"
                  value={project.status}
                  onChange={(status) => patch({ status })}
                  hint="Live, Beta, Open source…"
                />
                <div className="adm-toggle-cell">
                  <Toggle
                    label="Feature on home"
                    description="Shown in the selected-work section."
                    checked={project.featured}
                    onChange={(featured) => patch({ featured })}
                  />
                </div>
              </div>

              <TextArea
                label="Card blurb"
                rows={2}
                value={project.blurb}
                onChange={(blurb) => patch({ blurb })}
                hint="One line, shown on the card."
              />

              <TextArea
                label="Case study description"
                rows={5}
                value={project.description}
                onChange={(description) => patch({ description })}
                hint="The story told in the project drawer."
              />

              <StringListEditor
                label="Highlights"
                items={project.highlights}
                onChange={(highlights) => patch({ highlights })}
                addLabel="Add highlight"
                rows={2}
                placeholder="A measurable outcome"
              />

              <StringListEditor
                label="Tech used"
                items={project.tech}
                onChange={(tech) => patch({ tech })}
                addLabel="Add technology"
                placeholder="e.g. React"
              />

              <div className="adm-grid-2">
                <ColorInput
                  label="Gradient start"
                  value={project.colors?.[0]}
                  onChange={(value) => patch({ colors: [value, project.colors?.[1] ?? '#4f8cff'] })}
                />
                <ColorInput
                  label="Gradient end"
                  value={project.colors?.[1]}
                  onChange={(value) => patch({ colors: [project.colors?.[0] ?? '#00eeff', value] })}
                />
              </div>

              <div className="adm-grid-2">
                <TextInput
                  label="Source URL"
                  value={project.links?.source}
                  onChange={(source) => patch({ links: { ...project.links, source } })}
                  placeholder="https://github.com/…"
                />
                <TextInput
                  label="Live URL"
                  value={project.links?.live}
                  onChange={(live) => patch({ links: { ...project.links, live } })}
                  placeholder="https://… (optional)"
                />
              </div>
            </>
          )}
        />
      </Panel>
    </div>
  );
}
