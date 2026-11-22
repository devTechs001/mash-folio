import { useEffect, useRef } from 'react';

/**
 * Attach to a container; every descendant (and the container itself) with the
 * `.reveal` class fades/slides in once it scrolls into view.
 *
 * Re-scans when children change so filtered lists animate too. If
 * IntersectionObserver is unavailable or the user prefers reduced motion,
 * everything is revealed immediately.
 */
export function useScrollReveal({ threshold = 0.15, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const collect = () => {
      const nodes = [];
      if (root.classList.contains('reveal')) nodes.push(root);
      nodes.push(...root.querySelectorAll('.reveal'));
      return nodes;
    };

    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      collect().forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }

    const seen = new WeakSet();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    const scan = () => {
      collect().forEach((el) => {
        if (seen.has(el) || el.classList.contains('is-visible')) return;
        seen.add(el);
        observer.observe(el);
      });
    };

    scan();

    const mutation = new MutationObserver(scan);
    mutation.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, [threshold, rootMargin]);

  return ref;
}

export default useScrollReveal;
