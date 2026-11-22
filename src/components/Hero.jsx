import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiSend } from 'react-icons/fi';
import { SiReact, SiNodedotjs, SiTypescript } from 'react-icons/si';
import { useContent } from '../context/ContentContext';
import SocialLinks from './SocialLinks';

function useTypewriter(words, { type = 80, erase = 38, hold = 1900 } = {}) {
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(reduced ? words[0] : '');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) return undefined;

    const word = words[index % words.length];
    let delay = deleting ? erase : type;

    if (!deleting && text === word) delay = hold;
    if (deleting && text === '') delay = 240;

    const timer = setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true);
        return;
      }

      if (deleting && text === '') {
        setDeleting(false);
        setIndex((value) => (value + 1) % words.length);
        return;
      }

      setText(word.slice(0, text.length + (deleting ? -1 : 1)));
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, index, words, type, erase, hold, reduced]);

  return text;
}

export default function Hero() {
  const { profile, heroCode } = useContent();
  const roles = useMemo(
    () => (profile.roles?.length ? profile.roles : [profile.role || 'Developer']),
    [profile.roles, profile.role]
  );
  const typed = useTypewriter(roles);

  return (
    <section className="home" id="home">
      <div className="home-bg" aria-hidden="true">
        <div className="grid-overlay" />
        <span className="blob blob-1" />
        <span className="blob blob-2" />
      </div>

      <div className="container home-inner">
        <div className="home-content">
          <span className="eyebrow">
            <span className="dot" aria-hidden="true" />
            {profile.availability}
          </span>

          <p className="home-hello">Hello, I&apos;m</p>

          <h1 className="home-name">
            {profile.firstName}
            <span aria-hidden="true">.</span>
          </h1>

          <h2 className="home-role">
            <span className="home-role-prefix">I&apos;m a</span>{' '}
            <span className="multiple-text" aria-hidden="true">
              {typed}
              <i className="type-caret" />
            </span>
            <span className="sr-only">{profile.role}</span>
          </h2>

          <p className="home-desc">
            {profile.tagline} Currently building with React, TypeScript and Node — based in{' '}
            {profile.location}.
          </p>

          <div className="home-actions">
            <Link to="/projects" className="btn">
              View my work
              <FiArrowRight aria-hidden="true" />
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Get in touch
              <FiSend aria-hidden="true" />
            </Link>
          </div>

          <div className="home-foot">
            <span className="home-foot-label">Find me on</span>
            <SocialLinks links={profile.socials} />
          </div>
        </div>

        <div className="home-visual">
          <div className="code-card">
            <div className="code-card-bar">
              <span className="code-dot red" />
              <span className="code-dot yellow" />
              <span className="code-dot green" />
              <span className="code-file">developer.js</span>
              <span className="code-live">
                <i /> live
              </span>
            </div>

            <pre className="code-body" aria-label="A snippet describing Mash as a developer">
              {heroCode.lines.map((line) => (
                <span className="code-line" key={line.n}>
                  <span className="code-ln" aria-hidden="true">
                    {line.n}
                  </span>
                  <code>
                    {line.content.length === 0
                      ? '\u00A0'
                      : line.content.map((token, index) => (
                          <span key={index} className={`tok tok-${token.c}`}>
                            {token.t}
                          </span>
                        ))}
                  </code>
                </span>
              ))}
            </pre>

            <div className="code-card-foot">
              <span>
                <i className="status-dot" /> Available for work
              </span>
              <span className="code-card-loc">Nairobi · UTC+3</span>
            </div>
          </div>

          <div className="float-badge badge-react" aria-hidden="true">
            <SiReact />
            <span>React</span>
          </div>
          <div className="float-badge badge-node" aria-hidden="true">
            <SiNodedotjs />
            <span>Node.js</span>
          </div>
          <div className="float-badge badge-ts" aria-hidden="true">
            <SiTypescript />
            <span>TypeScript</span>
          </div>
        </div>
      </div>

      <a className="scroll-hint" href="#about" aria-label="Scroll to the about section">
        <span className="mouse" aria-hidden="true">
          <span className="wheel" />
        </span>
        <span>Scroll to explore</span>
      </a>
    </section>
  );
}
