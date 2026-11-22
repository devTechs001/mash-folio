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

const ICONS = ['code', 'layout', 'server', 'zap'];

function newService() {
  return { icon: 'code', title: 'New service', text: '' };
}

export default function ServicesPage() {
  const { content, setSection } = useContent();
  const { services } = content;

  return (
    <div className="adm-page">
      <PageHead
        eyebrow="Services system"
        title="What you offer"
        actions={
          <Link to="/#services" className="adm-btn adm-btn-ghost adm-btn-sm">
            Preview services <FiExternalLink aria-hidden="true" />
          </Link>
        }
      >
        Shown on the home page and reused on the about page. Four cards read best.
      </PageHead>

      <Panel title="Service cards" description="Icon, title and a sentence about the outcome.">
        <CollectionList
          items={services}
          onChange={(next) => setSection('services', next)}
          create={newService}
          itemTitle={(service) => service.title || 'Untitled service'}
          itemMeta={(service) => service.icon}
          addLabel="Add service"
          renderItem={(service, patch) => (
            <>
              <div className="adm-grid-2">
                <TextInput
                  label="Title"
                  value={service.title}
                  onChange={(title) => patch({ title })}
                />
                <SelectInput
                  label="Icon"
                  value={service.icon}
                  onChange={(icon) => patch({ icon })}
                  options={ICONS}
                />
              </div>
              <TextArea
                label="Description"
                rows={3}
                value={service.text}
                onChange={(text) => patch({ text })}
              />
            </>
          )}
        />
      </Panel>
    </div>
  );
}
