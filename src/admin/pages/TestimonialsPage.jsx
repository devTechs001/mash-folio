import { Link } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';
import { useContent } from '../../context/ContentContext';
import {
  CollectionList,
  ColorInput,
  PageHead,
  Panel,
  TextArea,
  TextInput,
} from '../components/AdminUI';

function newTestimonial() {
  return {
    quote: '',
    name: 'New client',
    role: '',
    company: '',
    initials: 'NC',
    accent: ['#00e5ff', '#4f8cff'],
  };
}

function initialsFrom(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function TestimonialsPage() {
  const { content, setSection } = useContent();
  const { testimonials } = content;

  return (
    <div className="adm-page">
      <PageHead
        eyebrow="Testimonials system"
        title="Kind words"
        actions={
          <Link to="/#testimonials" className="adm-btn adm-btn-ghost adm-btn-sm">
            Preview <FiExternalLink aria-hidden="true" />
          </Link>
        }
      >
        Quotes shown on the home page. Three read best; more are fine.
      </PageHead>

      <Panel title="Quotes" description="Accent colours drive the avatar gradient.">
        <CollectionList
          items={testimonials}
          onChange={(next) => setSection('testimonials', next)}
          create={newTestimonial}
          itemTitle={(item) => item.name || 'Untitled quote'}
          itemMeta={(item) => [item.role, item.company].filter(Boolean).join(' · ')}
          addLabel="Add testimonial"
          renderItem={(item, patch) => (
            <>
              <TextArea
                label="Quote"
                rows={4}
                value={item.quote}
                onChange={(quote) => patch({ quote })}
              />

              <div className="adm-grid-2">
                <TextInput
                  label="Name"
                  value={item.name}
                  onChange={(name) =>
                    patch({ name, initials: initialsFrom(name) || item.initials })
                  }
                />
                <TextInput
                  label="Initials"
                  value={item.initials}
                  onChange={(initials) => patch({ initials: initials.slice(0, 3).toUpperCase() })}
                  hint="Shown inside the avatar."
                />
                <TextInput label="Role" value={item.role} onChange={(role) => patch({ role })} />
                <TextInput
                  label="Company"
                  value={item.company}
                  onChange={(company) => patch({ company })}
                />
                <ColorInput
                  label="Avatar gradient start"
                  value={item.accent?.[0]}
                  onChange={(value) => patch({ accent: [value, item.accent?.[1] ?? '#4f8cff'] })}
                />
                <ColorInput
                  label="Avatar gradient end"
                  value={item.accent?.[1]}
                  onChange={(value) => patch({ accent: [item.accent?.[0] ?? '#00e5ff', value] })}
                />
              </div>
            </>
          )}
        />
      </Panel>
    </div>
  );
}
