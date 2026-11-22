import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiGlobe } from 'react-icons/fi';
import { SiDevdotto } from 'react-icons/si';

const icons = {
  github: FiGithub,
  linkedin: FiLinkedin,
  twitter: FiTwitter,
  mail: FiMail,
  devto: SiDevdotto,
  website: FiGlobe,
};

export function getSocialIcon(name) {
  return icons[name] ?? FiGlobe;
}

/**
 * Consistent social buttons used in the hero, footer, contact page and drawer.
 */
export default function SocialLinks({
  links = [],
  className = 'social-link',
  containerClassName = 'footer-socials',
  showLabels = false,
  ...rest
}) {
  if (!links.length) return null;

  return (
    <div className={containerClassName} {...rest}>
      {links.map((link) => {
        const Icon = getSocialIcon(link.icon);
        const isExternal = link.href.startsWith('http');

        return (
          <a
            key={link.label}
            href={link.href}
            className={className}
            aria-label={link.label}
            title={link.label}
            {...(isExternal ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
          >
            <Icon aria-hidden="true" />
            {showLabels && <span className="social-link-label">{link.label}</span>}
          </a>
        );
      })}
    </div>
  );
}
