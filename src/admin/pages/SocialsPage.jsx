import { useContent } from '../../context/ContentContext';
import { getSocialIcon } from '../../components/SocialLinks';
import {
  CollectionList,
  PageHead,
  Panel,
  SelectInput,
  TextInput,
} from '../components/AdminUI';

const ICON_OPTIONS = ['github', 'linkedin', 'twitter', 'devto', 'mail', 'website'];

function newSocial() {
  return { label: 'New link', handle: '', href: 'https://', icon: 'website' };
}

export default function SocialsPage() {
  const { content, updateProfile } = useContent();
  const { profile } = content;
  const socials = profile.socials;

  return (
    <div className="adm-page">
      <PageHead eyebrow="Social system" title="Socials & contact links">
        These links power the navbar menu, social rail, footer, contact page and hero.
      </PageHead>

      <Panel
        title="Links"
        description="Use mailto: for email. Order is preserved everywhere the socials appear."
      >
        <CollectionList
          items={socials}
          onChange={(next) => updateProfile({ socials: next })}
          create={newSocial}
          itemTitle={(social) => social.label || 'Untitled link'}
          itemMeta={(social) => social.href}
          addLabel="Add social link"
          renderItem={(social, patch) => {
            const Icon = getSocialIcon(social.icon);

            return (
              <>
                <div className="adm-social-preview">
                  <span className="adm-social-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <div>
                    <strong>{social.label || 'Untitled link'}</strong>
                    <span>{social.handle || social.href}</span>
                  </div>
                </div>

                <div className="adm-grid-2">
                  <TextInput
                    label="Label"
                    value={social.label}
                    onChange={(label) => patch({ label })}
                  />
                  <TextInput
                    label="Handle"
                    value={social.handle}
                    onChange={(handle) => patch({ handle })}
                    hint="Shown in the contact cards."
                  />
                  <TextInput
                    label="URL"
                    value={social.href}
                    onChange={(href) => patch({ href })}
                    hint="https://… or mailto:…"
                  />
                  <SelectInput
                    label="Icon"
                    value={social.icon}
                    onChange={(icon) => patch({ icon })}
                    options={ICON_OPTIONS}
                  />
                </div>
              </>
            );
          }}
        />
      </Panel>

      <p className="adm-note">
        Tip: these links also appear in the footer, the contact page and the social rail, so one
        edit keeps every surface in sync.
      </p>
    </div>
  );
}
