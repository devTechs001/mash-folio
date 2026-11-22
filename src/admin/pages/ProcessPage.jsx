import { Link } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';
import { useContent } from '../../context/ContentContext';
import {
  CollectionList,
  PageHead,
  Panel,
  SelectInput,
  TextArea,
  TextInput,
} from '../components/AdminUI';

const ICONS = ['search', 'design', 'build', 'grow'];

function newStep() {
  return { number: '05', icon: 'build', title: 'New step', text: '' };
}

export default function ProcessPage() {
  const { content, setSection } = useContent();
  const { processSteps } = content;

  return (
    <div className="adm-page">
      <PageHead
        eyebrow="Process system"
        title="How you work"
        actions={
          <Link to="/#process" className="adm-btn adm-btn-ghost adm-btn-sm">
            Preview process <FiExternalLink aria-hidden="true" />
          </Link>
        }
      >
        The numbered timeline on the home page. Steps display in this order.
      </PageHead>

      <Panel title="Steps" description="Renumber after reordering if you want a tidy 01, 02, 03…">
        <CollectionList
          items={processSteps}
          onChange={(next) => setSection('processSteps', next)}
          create={newStep}
          itemTitle={(step) => `${step.number} — ${step.title}`}
          itemMeta={(step) => step.icon}
          addLabel="Add step"
          renderItem={(step, patch) => (
            <>
              <div className="adm-grid-2">
                <TextInput
                  label="Number"
                  value={step.number}
                  onChange={(number) => patch({ number })}
                  hint="Two digits, e.g. 04"
                />
                <SelectInput
                  label="Icon"
                  value={step.icon}
                  onChange={(icon) => patch({ icon })}
                  options={ICONS}
                />
              </div>
              <TextInput label="Title" value={step.title} onChange={(title) => patch({ title })} />
              <TextArea
                label="Description"
                rows={3}
                value={step.text}
                onChange={(text) => patch({ text })}
              />
            </>
          )}
        />
      </Panel>
    </div>
  );
}
