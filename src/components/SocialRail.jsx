import { profile } from '../utils/data';
import { getSocialIcon } from './SocialLinks';

/**
 * Vertical social rail pinned to the left edge on wide screens — a modern
 * portfolio touch that keeps your profiles one click away on every page.
 */
export default function SocialRail() {
  return (
    <aside className="social-rail" aria-label="Social profiles">
      <span className="social-rail-line" aria-hidden="true" />

      {profile.socials.map((social) => {
        const Icon = getSocialIcon(social.icon);
        const isExternal = social.href.startsWith('http');

        return (
          <a
            key={social.label}
            href={social.href}
            className="social-rail-link"
            aria-label={social.label}
            title={social.label}
            {...(isExternal ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
          >
            <Icon aria-hidden="true" />
          </a>
        );
      })}

      <span className="social-rail-line" aria-hidden="true" />
      <span className="social-rail-label" aria-hidden="true">
        Let&apos;s connect
      </span>
    </aside>
  );
}
