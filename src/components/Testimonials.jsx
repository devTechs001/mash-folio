import { FiStar } from 'react-icons/fi';
import { useContent } from '../context/ContentContext';
import { useScrollReveal } from '../utils/useScrollReveal';

export default function Testimonials() {
  const { content } = useContent();
  const testimonials = content.testimonials || [];
  const revealRef = useScrollReveal();

  return (
    <section className="section testimonials-section" id="testimonials">
      <div className="container" ref={revealRef}>
        <div className="section-head">
          <span className="eyebrow reveal">Kind words</span>
          <h2 className="title reveal">
            What it&apos;s like <span className="accent">to work together</span>
          </h2>
          <p className="section-sub reveal">
            Feedback from the founders and product teams I&apos;ve built alongside.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <figure
              className="testimonial reveal"
              key={testimonial.name}
              style={{
                transitionDelay: `${index * 70}ms`,
                '--a1': testimonial.accent[0],
                '--a2': testimonial.accent[1],
              }}
            >
              <span className="testimonial-mark" aria-hidden="true">
                &ldquo;
              </span>

              <blockquote>{testimonial.quote}</blockquote>

              <figcaption>
                <span className="testimonial-avatar" aria-hidden="true">
                  {testimonial.initials}
                </span>

                <span className="testimonial-person">
                  <strong>{testimonial.name}</strong>
                  <span>
                    {testimonial.role}, {testimonial.company}
                  </span>
                </span>

                <span
                  className="testimonial-stars"
                  role="img"
                  aria-label="Rated 5 out of 5"
                >
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <FiStar key={starIndex} aria-hidden="true" />
                  ))}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
