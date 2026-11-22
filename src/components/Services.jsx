import { FiCode, FiLayout, FiServer, FiZap } from 'react-icons/fi';
import { useContent } from '../context/ContentContext';
import { useScrollReveal } from '../utils/useScrollReveal';

const icons = {
  code: FiCode,
  layout: FiLayout,
  server: FiServer,
  zap: FiZap,
};

export default function Services({ id = 'services', className = '' }) {
  const { content } = useContent();
  const services = content.services || [];
  const revealRef = useScrollReveal();

  return (
    <section className={`section services-section ${className}`.trim()} id={id}>
      <div className="container" ref={revealRef}>
        <div className="section-head">
          <span className="eyebrow reveal">What I do</span>
          <h2 className="title reveal">
            How I can <span className="accent">help</span>
          </h2>
          <p className="section-sub reveal">
            From a single landing page to a full product, I plug in wherever the work needs
            doing.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => {
            const Icon = icons[service.icon] ?? FiCode;

            return (
              <article
                className="service-card reveal"
                key={service.title}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <span className="service-icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
