import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiMail, FiZap } from 'react-icons/fi';
import Hero from '../components/Hero';
import Skills from './Skills';
import { about, profile, stats } from '../utils/data';
import { useScrollReveal } from '../utils/useScrollReveal';
import aboutVisual from '../assets/about-visual.jpg';
import '../styles/LandingPage.css';

export default function LandingPage() {
  const revealRef = useScrollReveal();

  return (
    <>
      <Hero />

      <div ref={revealRef}>
        {/* About preview */}
        <section className="section about-section" id="about">
          <div className="container">
            <div className="about-grid">
              <div className="about-visual reveal">
                <div className="about-image">
                  <img
                    src={aboutVisual}
                    alt="Abstract 3D artwork representing Mash's approach to building software"
                    loading="lazy"
                  />
                </div>

                <div className="about-float-card">
                  <span className="about-float-icon">
                    <FiZap aria-hidden="true" />
                  </span>
                  <span>
                    <strong>99/100</strong>
                    <span>Avg. Lighthouse</span>
                  </span>
                </div>

                <span className="about-badge">
                  <FiCheckCircle aria-hidden="true" />
                  {profile.availability}
                </span>
              </div>

              <div className="about-content reveal">
                <span className="eyebrow">About me</span>
                <h2 className="title about-title">
                  Code that ships,
                  <br />
                  <span className="accent">design that lasts.</span>
                </h2>

                <p className="about-lead">{about.lead}</p>

                <ul className="about-points">
                  {about.points.map((point) => (
                    <li key={point}>
                      <FiCheckCircle aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="about-actions">
                  <Link to="/about" className="btn">
                    More about me
                    <FiArrowRight aria-hidden="true" />
                  </Link>
                  <Link to="/contact" className="btn btn-outline">
                    Get in touch
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
          </div>
        </section>

        <Skills />

        {/* Contact call to action */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-card reveal">
              <div className="cta-copy">
                <span className="eyebrow">Let&apos;s work together</span>
                <h2>
                  Have a project
                  <br />
                  in mind?
                </h2>
                <p>
                  I&apos;m currently taking on a few select projects. Tell me what you&apos;re
                  building and let&apos;s figure out the fastest path to something real.
                </p>
              </div>

              <div className="cta-actions">
                <Link to="/contact" className="btn btn-lg">
                  Start a conversation
                  <FiArrowRight aria-hidden="true" />
                </Link>
                <a href={`mailto:${profile.email}`} className="btn btn-outline btn-lg">
                  <FiMail aria-hidden="true" />
                  Email me
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
