import { FiArrowUpRight } from 'react-icons/fi';
import { articles } from '../utils/data';
import { useScrollReveal } from '../utils/useScrollReveal';

export default function Writing() {
  const revealRef = useScrollReveal();

  return (
    <section className="section writing-section" id="writing">
      <div className="container" ref={revealRef}>
        <div className="section-head">
          <span className="eyebrow reveal">Writing</span>
          <h2 className="title reveal">
            Notes from <span className="accent">the build</span>
          </h2>
          <p className="section-sub reveal">
            Things I&apos;ve learned the hard way — about performance, interfaces and shipping
            software that stays shipped.
          </p>
        </div>

        <div className="writing-grid">
          {articles.map((article, index) => (
            <a
              className="writing-card reveal"
              key={article.title}
              href={article.url}
              target="_blank"
              rel="noreferrer noopener"
              style={{ transitionDelay: `${index * 70}ms` }}
            >
              <p className="writing-meta">
                <span>{article.date}</span>
                <span aria-hidden="true">·</span>
                <span>{article.readingTime}</span>
              </p>

              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>

              <div className="writing-tags">
                {article.tags.map((tag) => (
                  <span className="chip" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>

              <span className="writing-link">
                Read on {article.source}
                <FiArrowUpRight aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
