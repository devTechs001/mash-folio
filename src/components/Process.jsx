import { FiSearch, FiPenTool, FiCode, FiTrendingUp } from 'react-icons/fi';
import { processSteps } from '../utils/data';
import { useScrollReveal } from '../utils/useScrollReveal';

const icons = {
  search: FiSearch,
  design: FiPenTool,
  build: FiCode,
  grow: FiTrendingUp,
};

export default function Process() {
  const revealRef = useScrollReveal();

  return (
    <section className="section process-section" id="process">
      <div className="container" ref={revealRef}>
        <div className="section-head">
          <span className="eyebrow reveal">How I work</span>
          <h2 className="title reveal">
            A simple, <span className="accent">predictable process</span>
          </h2>
          <p className="section-sub reveal">
            No black boxes. You always know what is happening, what is next, and what I need
            from you.
          </p>
        </div>

        <div className="process-grid">
          {processSteps.map((step, index) => {
            const Icon = icons[step.icon] ?? FiCode;

            return (
              <article
                className="process-step reveal"
                key={step.number}
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <span className="process-num" aria-hidden="true">
                  {step.number}
                </span>
                <span className="process-icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
