import { Link } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';
import { useContent } from '../../context/ContentContext';
import {
  CollectionList,
  PageHead,
  Panel,
  StringListEditor,
  TextArea,
  TextInput,
} from '../components/AdminUI';

function newStat() {
  return { value: 0, suffix: '', label: 'New stat' };
}

function newRole() {
  return { role: 'New role', company: '', period: '', summary: '', points: [] };
}

export default function AboutPage() {
  const { content, setSection, updateAbout } = useContent();
  const { about, stats, experience } = content;

  return (
    <div className="adm-page">
      <PageHead
        eyebrow="About system"
        title="About, numbers & experience"
        actions={
          <Link to="/about" className="adm-btn adm-btn-ghost adm-btn-sm">
            Preview about <FiExternalLink aria-hidden="true" />
          </Link>
        }
      >
        Controls the about page plus the shortened about block on the home page.
      </PageHead>

      <Panel title="About copy" description="The lead paragraph appears on the home page too.">
        <TextArea label="Lead" rows={4} value={about.lead} onChange={(lead) => updateAbout({ lead })} />

        <StringListEditor
          label="Story paragraphs"
          items={about.paragraphs}
          onChange={(paragraphs) => updateAbout({ paragraphs })}
          addLabel="Add paragraph"
          rows={4}
          placeholder="Tell the story…"
        />

        <StringListEditor
          label="What you bring (bullet points)"
          items={about.points}
          onChange={(points) => updateAbout({ points })}
          addLabel="Add point"
          rows={2}
          placeholder="A short, concrete promise"
        />
      </Panel>

      <Panel
        title="Stats"
        description="The four numbers under the hero. Keep labels short so the row stays balanced."
      >
        <CollectionList
          items={stats}
          onChange={(next) => setSection('stats', next)}
          create={newStat}
          itemTitle={(stat) => `${stat.value}${stat.suffix} — ${stat.label}`}
          itemMeta={() => 'Home + about'}
          addLabel="Add stat"
          renderItem={(stat, patch) => (
            <div className="adm-grid-3">
              <TextInput
                label="Value"
                type="number"
                value={stat.value}
                onChange={(value) => patch({ value: Number(value) || 0 })}
              />
              <TextInput
                label="Suffix"
                value={stat.suffix}
                onChange={(suffix) => patch({ suffix })}
                hint="e.g. + or /100"
              />
              <TextInput label="Label" value={stat.label} onChange={(label) => patch({ label })} />
            </div>
          )}
        />
      </Panel>

      <Panel
        title="Experience timeline"
        description="Newest role first. Points are the bullets shown under each role."
      >
        <CollectionList
          items={experience}
          onChange={(next) => setSection('experience', next)}
          create={newRole}
          itemTitle={(role) => role.role || 'Untitled role'}
          itemMeta={(role) => [role.company, role.period].filter(Boolean).join(' · ')}
          addLabel="Add experience"
          renderItem={(role, patch) => (
            <>
              <div className="adm-grid-2">
                <TextInput label="Role" value={role.role} onChange={(value) => patch({ role: value })} />
                <TextInput
                  label="Company"
                  value={role.company}
                  onChange={(company) => patch({ company })}
                />
                <TextInput
                  label="Period"
                  value={role.period}
                  onChange={(period) => patch({ period })}
                  hint="e.g. 2023 — Present"
                />
              </div>
              <TextArea
                label="Summary"
                rows={3}
                value={role.summary}
                onChange={(summary) => patch({ summary })}
              />
              <StringListEditor
                label="Highlights"
                items={role.points}
                onChange={(points) => patch({ points })}
                addLabel="Add highlight"
                rows={2}
              />
            </>
          )}
        />
      </Panel>
    </div>
  );
}
