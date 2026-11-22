import { FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import { PageHead, Panel, StringListEditor, TextArea, TextInput } from '../components/AdminUI';

export default function ProfilePage() {
  const { content, updateProfile } = useContent();
  const { profile } = content;

  return (
    <div className="adm-page">
      <PageHead
        eyebrow="Profile system"
        title="Identity & hero"
        actions={
          <Link to="/" className="adm-btn adm-btn-ghost adm-btn-sm">
            Preview home <FiExternalLink aria-hidden="true" />
          </Link>
        }
      >
        These fields feed the navbar, hero, footer, contact page and page titles.
      </PageHead>

      <Panel title="Who you are" description="Keep the name and role short — they appear everywhere.">
        <div className="adm-grid-2">
          <TextInput label="Display name" value={profile.name} onChange={(name) => updateProfile({ name })} />
          <TextInput
            label="First name"
            value={profile.firstName}
            onChange={(firstName) => updateProfile({ firstName })}
            hint="Used in greetings like “Hi, I’m Mash”."
          />
          <TextInput
            label="Primary role"
            value={profile.role}
            onChange={(role) => updateProfile({ role })}
          />
          <TextInput
            label="Location"
            value={profile.location}
            onChange={(location) => updateProfile({ location })}
          />
          <TextInput
            label="Contact email"
            type="email"
            value={profile.email}
            onChange={(email) => updateProfile({ email })}
          />
          <TextInput
            label="Availability badge"
            value={profile.availability}
            onChange={(availability) => updateProfile({ availability })}
          />
          <TextInput
            label="Response time"
            value={profile.responseTime}
            onChange={(responseTime) => updateProfile({ responseTime })}
          />
        </div>

        <TextArea
          label="Hero tagline"
          rows={3}
          value={profile.tagline}
          onChange={(tagline) => updateProfile({ tagline })}
          hint="One or two sentences under the headline."
        />
      </Panel>

      <Panel
        title="Typing roles"
        description="The hero cycles through these phrases. Keep each one under ~28 characters."
      >
        <StringListEditor
          label="Roles"
          items={profile.roles}
          onChange={(roles) => updateProfile({ roles })}
          addLabel="Add role"
          placeholder="e.g. Product Engineer"
        />
        <p className="adm-note">
          The first role is used as the fallback when the list is empty. Leave at least one.
        </p>
      </Panel>
    </div>
  );
}
