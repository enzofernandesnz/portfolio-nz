import { useLayoutEffect, useRef, useState } from 'react';
import { projects } from './data/projects.js';
import { Text, useLanguage } from './language.jsx';

const orderedProjects = [...projects].sort((a, b) =>
  a.id === 'estagi-on' ? -1 : b.id === 'estagi-on' ? 1 : b.date.localeCompare(a.date)
);
const scrollBehavior = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';

export default function Projects() {
  const { language, locale, tr } = useLanguage();
  const list = useRef(null);
  const dialog = useRef(null);
  const [current, setCurrent] = useState(0);
  const [navigation, setNavigation] = useState({ hidden: true, previous: true, next: false });
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  function step() {
    const track = list.current;
    return (track.firstElementChild?.getBoundingClientRect().width || 0) + parseFloat(getComputedStyle(track).gap);
  }

  function update() {
    const track = list.current;
    const limit = track.scrollWidth - track.clientWidth;
    setNavigation({ hidden: limit <= 2, previous: track.scrollLeft <= 2, next: track.scrollLeft >= limit - 2 });
    setCurrent(Math.max(0, Math.min(orderedProjects.length - 1, Math.round(track.scrollLeft / step()))));
  }

  function moveTo(index) {
    list.current.scrollTo({ left: index * step(), behavior: scrollBehavior() });
  }

  function showProject(project) {
    setSelected(project);
    setOpen(true);
  }

  useLayoutEffect(() => {
    const track = list.current;
    track.scrollTo({ left: 0, behavior: 'instant' });
    const resize = new ResizeObserver(update);
    resize.observe(track);
    update();
    return () => resize.disconnect();
  }, [language]);

  useLayoutEffect(() => {
    if (open && !dialog.current.open) dialog.current.showModal();
    else if (!open && dialog.current.open) dialog.current.close();
  }, [open]);

  return <>
    <section className="projects-section" id="projetos" aria-labelledby="projects-title">
      <div className="wrap section">
        <div className="section-label"><span>02 /</span><Text pt="PROJETOS" en="PROJECTS" /></div>
        <div className="section-heading"><Text as="h2" id="projects-title" pt="Uma ideia. Um projeto. Um novo aprendizado." en="An idea. A project. Something new learned." /></div>
        <div className="project-carousel">
          <div ref={list} id="project-list" className="project-list" role="region" aria-labelledby="projects-title" aria-live="polite" tabIndex="0" onScroll={update}>
            {orderedProjects.map((project, index) => {
              const date = new Date(project.date + 'T12:00:00');
              const month = date.toLocaleDateString(locale, { month: 'short' }).replace('.', '').toUpperCase();
              let kind = project.category === 'frontend' ? 'FRONT-END' : project.team || project.id === 'mechanic' ? 'FULL STACK · ' + tr('EM EQUIPE', 'TEAM PROJECT') : 'FULL STACK';
              if (project.category === 'java') kind = project.id === 'oficina' ? 'JAVA · CONSOLE' : 'JAVA · WEB';
              return <article key={project.id} className={'project' + (index === current ? ' is-current' : '')}>
                <time className="project-date" dateTime={project.date}>{month}<strong>{date.getFullYear()}</strong></time>
                <button type="button" className={'project-visual' + (project.isLogo ? ' mechanic-visual' : '')} aria-label={tr('Ampliar imagem de', 'Enlarge image of') + ' ' + project.name} onClick={() => showProject(project)}>
                  <img src={project.image} alt={project.isLogo ? tr('Logotipo do projeto MEchanic', 'MEchanic project logo') : tr('Captura da interface de ', 'Screenshot of ') + project.name} loading="lazy" width="800" height="520" />
                  {project.isLogo && <small>{tr('PROJETO ACADÊMICO EM EQUIPE', 'TEAM ACADEMIC PROJECT')}</small>}
                  <span className="zoom-label" aria-hidden="true">↗</span>
                </button>
                <div className="project-info">
                  <div className="project-kind">{kind}</div><h3>{project.name}</h3>
                  {project.awardPT && <div className="project-award"><strong>{tr(project.awardPT, project.awardEN)}</strong><span>{tr(project.awardDetailPT, project.awardDetailEN)}</span></div>}
                  <p>{project[language]}</p><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                  <div className="project-links"><a href={project.repo} target="_blank" rel="noopener noreferrer">{tr('Repositório', 'Repository')} ↗</a>{project.demo ? <a href={project.demo} target="_blank" rel="noopener noreferrer">{tr('Ver site', 'Live site')} ↗</a> : <button type="button" className="details" onClick={() => showProject(project)}>{tr('Ver detalhes', 'View details')} +</button>}</div>
                </div>
              </article>;
            })}
          </div>
          <div className="project-navigation" hidden={navigation.hidden}>
            <div className="project-pagination" role="group" aria-label={tr('Selecionar projeto', 'Select project')}>
              {orderedProjects.map((project, index) => <button key={project.id} type="button" aria-controls="project-list" aria-label={`${tr('Ir para projeto', 'Go to project')} ${index + 1}: ${project.name}`} aria-current={index === current ? 'true' : undefined} onClick={() => moveTo(index)} />)}
            </div>
            <div className="project-arrows"><button type="button" className="project-previous" aria-controls="project-list" disabled={navigation.previous} onClick={() => list.current.scrollBy({ left: -step(), behavior: scrollBehavior() })}><span aria-hidden="true">←</span>{' '}<Text pt="Anterior" en="Previous" /></button><button type="button" className="project-next" aria-controls="project-list" disabled={navigation.next} onClick={() => list.current.scrollBy({ left: step(), behavior: scrollBehavior() })}><Text pt="Próximo" en="Next" />{' '}<span aria-hidden="true">→</span></button></div>
          </div>
        </div>
      </div>
    </section>
    <dialog ref={dialog} id="project-dialog" aria-labelledby="dialog-title" onClose={() => setOpen(false)} onClick={event => {
      if (event.target !== dialog.current) return;
      const box = dialog.current.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) setOpen(false);
    }}>
      <button className="dialog-close" type="button" aria-label="Fechar / Close" onClick={() => setOpen(false)}>×</button>
      <div id="dialog-content">{selected && <><h3 id="dialog-title">{selected.name}</h3><img className="dialog-image" src={selected.image} alt={tr(selected.captionPT, selected.captionEN)} /><p className="dialog-caption">{tr(selected.captionPT, selected.captionEN)}</p><a href={selected.repo} target="_blank" rel="noopener noreferrer" className="text-link">{tr('Abrir repositório ↗', 'Open repository ↗')}</a></>}</div>
    </dialog>
  </>;
}
