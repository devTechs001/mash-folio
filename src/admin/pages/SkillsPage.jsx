import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useContent } from '../../context/ContentContext';
import {
  IconButton,
  PageHead,
  Panel,
  StringListEditor,
  TextInput,
} from '../components/AdminUI';

function SkillList({ items = [], onChange, label }) {
  const update = (index, patch) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  const remove = (index) => onChange(items.filter((_, i) => i !== index));
  const add = () => onChange([...items, { name: 'New skill', level: 80 }]);

  return (
    <div className="adm-field">
      <span className="adm-label">{label}</span>

      <div className="adm-skill-list">
        {items.map((skill, index) => (
          <div className="adm-skill-row" key={index}>
            <input
              className="adm-input"
              value={skill.name}
              onChange={(event) => update(index, { name: event.target.value })}
              aria-label={`${label} skill ${index + 1} name`}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={skill.level}
              onChange={(event) => update(index, { level: Number(event.target.value) })}
              aria-label={`${skill.name || 'Skill'} proficiency`}
              className="adm-range"
            />
            <input
              type="number"
              min="0"
              max="100"
              className="adm-input adm-num"
              value={skill.level}
              onChange={(event) =>
                update(index, { level: Math.max(0, Math.min(100, Number(event.target.value) || 0)) })
              }
              aria-label={`${skill.name || 'Skill'} percent`}
            />
            <IconButton label="Remove skill" tone="danger" onClick={() => remove(index)}>
              <FiTrash2 aria-hidden="true" />
            </IconButton>
          </div>
        ))}
      </div>

      <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm adm-add" onClick={add}>
        <FiPlus aria-hidden="true" />
        Add skill
      </button>
    </div>
  );
}

export default function SkillsPage() {
  const { content, setSection } = useContent();
  const { skills, techStack } = content;

  const updateSkills = (group, next) => setSection('skills', { ...skills, [group]: next });

  return (
    <div className="adm-page">
      <PageHead eyebrow="Skills system" title="Skills & tech stack">
        Controls the animated skill bars plus the marquee of technologies on the home page.
      </PageHead>

      <Panel
        title="Skill bars"
        description="Level is the percentage width of the bar. Aim for honest numbers."
      >
        <SkillList
          label="Frontend"
          items={skills.frontend}
          onChange={(next) => updateSkills('frontend', next)}
        />
        <SkillList
          label="Backend & tooling"
          items={skills.backend}
          onChange={(next) => updateSkills('backend', next)}
        />
      </Panel>

      <Panel
        title="Tech stack"
        description="Names should match the logos in the marquee — unknown names fall back to a generic icon."
      >
        <StringListEditor
          label="Technologies"
          items={techStack}
          onChange={(next) => setSection('techStack', next)}
          addLabel="Add technology"
          placeholder="e.g. SvelteKit"
          hint="Order matters: this is the order they scroll on the home page."
        />
      </Panel>
    </div>
  );
}
