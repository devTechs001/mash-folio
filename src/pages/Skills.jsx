import { FiLayout, FiServer } from 'react-icons/fi';
import { useContent } from '../context/ContentContext';
import { getTechIcon } from '../utils/techIcons';
import { useScrollReveal } from '../utils/useScrollReveal';

function SkillBar({ item, index }) {
  const Icon = getTechIcon(item.name);

  return (
    <div
      className="bar reveal"
      style={{ '--pct': `${item.level}%`, transitionDelay: `${index * 70}ms` }}
    >
      <div className="info">
        <span className="info-name">
          <Icon aria-hidden="true" />
          {item.name}
        </span>
        <span className="info-level">{item.level}%</span>
      </div>
      <div
        className="progress-line"
        role="progressbar"
        aria-label={`${item.name} proficiency`}
        aria-valuenow={item.level}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span />
      </div>
    </div>
  );
}

function SkillColumn({ title, subtitle, icon: Icon, items }) {
  return (
    <div className="skill-column reveal">
      <h3 className="skill-col-title">
        <span className="skill-col-icon">
          <Icon aria-hidden="true" />
        </span>
        {title}
        <em>{subtitle}</em>
      </h3>

      {items.map((item, index) => (
        <SkillBar key={item.name} item={item} index={index} />
      ))}
    </div>
  );
}

export default function Skills() {
  const { skills, techStack } = useContent();
  const revealRef = useScrollReveal();
  const marqueeItems = [...techStack, ...techStack];

  return (
    <section className="section skills-section" id="skills">
      <div className="container" ref={revealRef}>
        <div className="section-head">
          <span className="eyebrow reveal">Skills &amp; tools</span>
          <h2 className="title reveal">
            What I <span className="accent">build with</span>
          </h2>
          <p className="section-sub reveal">
            A practical toolkit built over five years of shipping real products — chosen for
            speed of delivery, not novelty.
          </p>
        </div>

        <div className="skills-container">
          <div className="container1">
            <SkillColumn
              title="Frontend"
              subtitle="Craft"
              icon={FiLayout}
              items={skills.frontend}
            />
          </div>

          <div className="container2">
            <SkillColumn
              title="Backend"
              subtitle="Systems"
              icon={FiServer}
              items={skills.backend}
            />
          </div>
        </div>

        <div className="tech-strip reveal">
          <div className="tech-track">
            {marqueeItems.map((name, index) => {
              const Icon = getTechIcon(name);

              return (
                <span
                  className="tech-pill"
                  key={`${name}-${index}`}
                  aria-hidden={index >= techStack.length ? 'true' : undefined}
                >
                  <Icon aria-hidden="true" />
                  {name}
                </span>
              );
            })}
          </div>
        </div>

        <p className="skills-note reveal">
          Always learning — currently exploring React Server Components and local-first apps.
        </p>
      </div>
    </section>
  );
}
