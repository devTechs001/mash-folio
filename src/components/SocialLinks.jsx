import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiGlobe } from 'react-icons/fi';

const icons = {
  github: FiGithub,
  linkedin: FiLinkedin,
  twitter: FiTwitter,
  mail: FiMail,
  website: FiGlobe,
};

/**
 * Consistent social buttons used in the header area of pages, the hero and the footer.
 */
export default function SocialLinks({ links = [], className = 'social-link', ...rest }) {
  if (!links.length) return null;

  return (
    <div className="footer-socials" {...rest}>
      {links.map((link) => {
        const Icon = icons[link.icon] ?? FiGlobe;
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
          </a>
        );
      })}
    </div>
  );
}
