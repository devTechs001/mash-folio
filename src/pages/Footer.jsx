import { Link } from 'react-router-dom';
import { FiMail, FiMapPin, FiClock, FiArrowUp } from 'react-icons/fi';
import SocialLinks from '../components/SocialLinks';
import { profile } from '../utils/data';

const exploreLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
];

const elsewhere = [
  { label: 'GitHub', href: 'https://github.com/devTechs001' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/devtechs001' },
  { label: 'X / Twitter', href: 'https://x.com/devtechs001' },
  { label: 'Email', href: `mailto:${profile.email}` },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="logo" aria-label="Mash — back to home">
              <span className="logo-mark" aria-hidden="true">
                M
              </span>
              <span className="logo-text">
                mash<span>.</span>
              </span>
            </Link>

            <p className="footer-blurb">
              Full-stack developer in {profile.location}, building fast, accessible web products
              with React, TypeScript and Node.
            </p>

            <SocialLinks links={profile.socials} />
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              {exploreLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Elsewhere</h4>
            <ul>
              {elsewhere.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.href.startsWith('http')
                      ? { target: '_blank', rel: 'noreferrer noopener' }
                      : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Get in touch</h4>
            <ul className="footer-contact">
              <li>
                <FiMail aria-hidden="true" />
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </li>
              <li>
                <FiMapPin aria-hidden="true" />
                <span>{profile.location}</span>
              </li>
              <li>
                <FiClock aria-hidden="true" />
                <span>{profile.responseTime}</span>
              </li>
            </ul>

            <Link to="/contact" className="btn btn-sm">
              Start a project
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {year} {profile.name}. All rights reserved.
          </p>

          <p>
            Built with <span className="heart">♥</span> using React, Vite &amp; Tailwind CSS
          </p>

          <button
            type="button"
            className="back-to-top-link"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to top
            <FiArrowUp aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
