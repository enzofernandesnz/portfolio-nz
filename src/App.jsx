import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { About, Experience, Footer, HeaderMarkup, Hero } from './content.jsx';
import { Text } from './language.jsx';
import Projects from './Projects.jsx';
import Certificates from './Certificates.jsx';
import Contact from './Contact.jsx';
import { GitHubSection, GitHubTicker } from './GitHub.jsx';
import Effects from './Effects.jsx';
import { useRevealOnScroll } from './page-effects.js';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');
  useEffect(() => {
    const close = event => { if (event.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', close);
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-20% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
    return () => { observer.disconnect(); document.removeEventListener('keydown', close); };
  }, []);
  return <HeaderMarkup menuOpen={menuOpen} active={active} closeMenu={() => setMenuOpen(false)} toggleMenu={() => setMenuOpen(value => !value)} />;
}

function ReadingProgress() {
  const progress = useRef(null);
  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const root = document.documentElement;
      const distance = root.scrollHeight - root.clientHeight;
      const fraction = distance > 0 ? Math.max(0, Math.min(1, window.scrollY / distance)) : 0;
      progress.current.style.transform = `scaleX(${fraction})`;
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    for (const event of ['scroll', 'resize', 'pageshow', 'load']) window.addEventListener(event, schedule, { passive: true });
    update();
    return () => {
      resize.disconnect();
      cancelAnimationFrame(frame);
      for (const event of ['scroll', 'resize', 'pageshow', 'load']) window.removeEventListener(event, schedule);
    };
  }, []);
  return <div ref={progress} className="reading-progress" aria-hidden="true" />;
}

export default function App() {
  useRevealOnScroll();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      let anchor;
      try { anchor = decodeURIComponent(window.location.hash.slice(1)); }
      catch { return; }
      if (anchor) document.getElementById(anchor)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return <>
    {createPortal(<canvas className="cursor-smoke" aria-hidden="true" />, document.body)}
    <Text as="a" className="skip-link" href="#conteudo" pt="Pular para o conteúdo" en="Skip to content" />
    <Header />
    <main id="conteudo">
      <Hero />
      <GitHubTicker />
      <About />
      <Projects />
      <Certificates />
      <GitHubSection />
      <Experience />
      <Contact />
    </main>
    <Footer />
    <ReadingProgress />
    <Effects />
  </>;
}
