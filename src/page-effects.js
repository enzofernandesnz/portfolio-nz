import { useLayoutEffect } from 'react';

const revealSelector = '.section-label, #about-title, .skills-world, .about-content > *, .skills > div, .section-heading, .project-controls, .timeline-note, .project, #certificates-title, .certificate-carousel, .experience-grid > div:first-child, .experience, .contact-grid > div > h2, .contact-grid > div > p, .contact-links > a, #contact-form';

export function useRevealOnScroll() {
  useLayoutEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const registered = new WeakSet();
    const pending = new Set();
    function show(element, instant = false) {
      if (instant) element.classList.add('reveal-instant');
      element.classList.add('is-revealed');
      pending.delete(element);
      observer.unobserve(element);
    }
    const observer = new IntersectionObserver(entries => {
      let order = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.style.setProperty('--reveal-delay', `${Math.min(order++, 2) * 70}ms`);
        show(entry.target);
      }
    }, { rootMargin: '0px 0px -32px 0px', threshold: 0 });
    function scan() {
      for (const element of pending) if (!element.isConnected) { observer.unobserve(element); pending.delete(element); }
      document.querySelectorAll(revealSelector).forEach(element => {
        if (registered.has(element)) return;
        registered.add(element);
        if (reducedMotion.matches || element.getBoundingClientRect().top < innerHeight - 32 || element.contains(document.activeElement)) return;
        element.classList.add('scroll-reveal');
        pending.add(element);
        observer.observe(element);
      });
    }
    const addedNodes = new MutationObserver(scan);
    addedNodes.observe(document.getElementById('root'), { childList: true, subtree: true });
    const onMotionChange = () => { if (reducedMotion.matches) [...pending].forEach(element => show(element, true)); };
    const onFocus = event => { const element = event.target.closest('.scroll-reveal'); if (element && pending.has(element)) show(element, true); };
    reducedMotion.addEventListener('change', onMotionChange);
    document.addEventListener('focusin', onFocus);
    scan();
    return () => {
      observer.disconnect();
      addedNodes.disconnect();
      reducedMotion.removeEventListener('change', onMotionChange);
      document.removeEventListener('focusin', onFocus);
      for (const element of pending) element.classList.remove('scroll-reveal');
    };
  }, []);
}
