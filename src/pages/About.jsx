import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiCheckCircle,
  FiMapPin,
  FiCoffee,
} from 'react-icons/fi';
import Services from '../components/Services';
import { about, experience, profile, stats, techStack } from '../utils/data';
import { useScrollReveal } from '../utils/useScrollReveal';
import { getTechIcon } from '../utils/techIcons';
import aboutVisual from '../assets/about-visual.jpg';
import '../styles/LandingPage.css';

export default function About() {
  const revealRef = useScrollReveal();

  return (
    <div className="page about-page" ref={revealRef}>
      <div className="container">
        <header className="page-head">
          <span className="eyebrow reveal">About me</span>
          <h1 className="title reveal">
            Designing &amp; building
            <br />
            <span className="accent">for the web</span>
          </h1>
          <p className="reveal">{about.lead}</p>
        </header>

        <div className="about-grid about-grid-page">
          <div className="about-visual reveal">
            <div className="about-image">
              <img
                src={aboutVisual}
                alt="Abstract 3D artwork representing Mash's approach to building software"
              />
            </div>

            <div className="about-float-card">
              <span className="about-float-icon">
                <FiMapPin aria-hidden="true" />
              </span>
              <span>
                <strong>Nairobi, KE</strong>
                <span>Working remotely · UTC+3</span>
              </span>
            </div>

            <span className="about-badge">
              <FiCheckCircle aria-hidden="true" />
              {profile.availability}
            </span>
          </div>

          <div className="about-content reveal">
            <h2 className="title about-title">
              Hi, I&apos;m {profile.firstName}.
              <br />
              <span className="accent">I make the web feel easy.</span>
            </h2>

            {about.paragraphs.map((paragraph) => (
              <p className="about-text" key={paragraph.slice(0, 24)}>
                {paragraph}
              </p>
            ))}

            <div className="about-actions">
              <Link to="/projects" className="btn">
                See my projects
                <FiArrowRight aria-hidden="true" />
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Say hello
              </Link>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat) => (
            <div className="stat-card reveal" key={stat.label}>
              <p className="stat-value">
                {stat.value}
                <span>{stat.suffix}</span>
              </p>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>

        <Services className="about-subsection" />

        {/* Experience */}
        <section className="section about-subsection">
          <div className="section-head">
            <span className="eyebrow reveal">Experience</span>
            <h2 className="title reveal">
              The road <span className="accent">so far</span>
            </h2>
            <p className="section-sub reveal">
              Five years of building, breaking and shipping — in studios, on teams and solo.
            </p>
          </div>

          <div className="timeline">
            {experience.map((job) => (
              <article className="timeline-item reveal" key={`${job.role}-${job.period}`}>
                <span className="timeline-dot" aria-hidden="true" />
                <span className="timeline-period">{job.period}</span>
                <h3>{job.role}</h3>
                <h4>{job.company}</h4>
                <p className="timeline-summary">{job.summary}</p>
                <ul className="timeline-points">
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Toolkit */}
        <section className="section about-subsection">
          <div className="section-head">
            <span className="eyebrow reveal">Toolkit</span>
            <h2 className="title reveal">
              Everyday <span className="accent">tools</span>
            </h2>
            <p className="section-sub reveal">
              The stack I reach for most. I pick tools that make the next developer&apos;s life
              easier, too.
            </p>
          </div>

          <div className="toolkit-grid reveal">
            {techStack.map((name) => {
              const Icon = getTechIcon(name);

              return (
                <span className="chip toolkit-chip" key={name}>
                  <Icon aria-hidden="true" />
                  {name}
                </span>
              );
            })}
          </div>

          <div className="about-outro reveal">
            <FiCoffee aria-hidden="true" />
            <p>
              Off the clock you&apos;ll find me reading source code, sketching interfaces or
              mentoring newer developers in Nairobi&apos;s dev community.
            </p>
          </div>
        </section>

        <div className="about-cta reveal">
          <p>Want the full story — or just to talk shop?</p>
          <Link to="/contact" className="btn">
            Get in touch
            <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
