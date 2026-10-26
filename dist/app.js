// Progressive enhancement: content stays visible without JavaScript or motion.
const revealOnScroll = (() => {
  if (!('IntersectionObserver' in window)) return () => {};
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const registered = new WeakSet();
  const pending = new Set();
  const selector = '.section-label, #about-title, .skills-world, .about-content > *, .skills > div, .section-heading, .project-controls, .timeline-note, .project, .experience-grid > div:first-child, .experience, .contact-grid > div > h2, .contact-grid > div > p, .contact-links > a, #contact-form';
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
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) [...pending].forEach(element => show(element, true));
  });
  document.addEventListener('focusin', event => {
    const element = event.target.closest('.scroll-reveal');
    if (element && pending.has(element)) show(element, true);
  });
  return (root = document) => {
    // Project filters replace their cards; release detached observer targets.
    for (const element of pending) {
      if (!element.isConnected) { observer.unobserve(element); pending.delete(element); }
    }
    root.querySelectorAll(selector).forEach(element => {
      if (registered.has(element)) return;
      registered.add(element);
      // Preserve content already on screen, passed by scrolling, or focused.
      if (reducedMotion.matches || element.getBoundingClientRect().top < innerHeight - 32 || element.contains(document.activeElement)) return;
      element.classList.add('scroll-reveal');
      pending.add(element);
      observer.observe(element);
    });
  };
})();

const projects = [
  {"id": "estagi-on", "date": "2026-04-09", "name": "Estagi.ON", "category": "fullstack", "team": true, "tags": ["HTML5", "CSS3", "JavaScript", "Node.js", "JSON Server"], "image": "assets/estagi-on.png", "repo": "https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-1-ti1-0427200-estagi-on", "pt": "Projeto desenvolvido em grupo no 1º semestre de 2026 para conectar estudantes a empresas com oportunidades de estágio. Reúne busca e publicação de vagas, candidaturas, perfis, calendário e mensagens.", "en": "A team project developed in the first semester of 2026 to connect students with companies offering internships. Includes job search and posting, applications, profiles, a calendar and messaging.", "awardPT": "Certificado de melhor projeto", "awardEN": "Best Project Certificate", "awardDetailPT": "Trabalho Interdisciplinar: Desenvolvimento de Aplicação Web · 1º semestre de 2026", "awardDetailEN": "Interdisciplinary Project: Web Application Development · First semester of 2026", "captionPT": "Tela de busca e listagem de vagas do Estagi.ON, publicada na documentação original da equipe. Projeto acadêmico em grupo.", "captionEN": "Estagi.ON job search and listing screen, published in the team’s original documentation. Academic team project."},
  {id:'delivery',date:'2024-08-13',name:'Delivery',category:'frontend',tags:['HTML5','CSS3'],image:'assets/delivery.webp',repo:'https://github.com/enzofernandesnz/delivery',demo:'https://enzofernandesnz.github.io/delivery/',pt:'Site de restaurante japonês com páginas de apresentação, cardápio e pedidos. Um exercício de estruturação de páginas e identidade visual com HTML e CSS.',en:'A Japanese restaurant website with presentation, menu and order pages. An exercise in page structure and visual identity using HTML and CSS.',captionPT:'Captura real da página inicial do projeto Delivery.',captionEN:'Actual screenshot of the Delivery home page.'},
  {id:'grid',date:'2024-10-28',name:'Display Grid',category:'frontend',tags:['HTML5','CSS3','CSS Grid'],image:'assets/display-grid.webp',repo:'https://github.com/enzofernandesnz/Display-grid',pt:'Exercício de front-end inspirado no layout Ogani: uma vitrine de alimentos organizada com CSS Grid, menus, banners e categorias de produtos.',en:'A front-end exercise inspired by the Ogani layout: a food storefront organized with CSS Grid, navigation, banners and product categories.',captionPT:'Captura do HTML original executado localmente. Exercício inspirado no template Ogani.',captionEN:'Screenshot of the original HTML running locally. Exercise inspired by the Ogani template.'},
  {id:'mechanic',date:'2026-08-06',name:'MEchanic',category:'fullstack',tags:['PHP','Laravel','Blade','SQLite'],image:'assets/mechanic.webp',repo:'https://github.com/enzofernandesnz/MEchanic-dev',pt:'Projeto acadêmico em equipe que conecta clientes e mecânicos. Reúne autenticação, catálogo de serviços, chamados de emergência, chat e avaliações.',en:'A team academic project connecting customers and mechanics. It includes authentication, a service catalog, emergency requests, chat and reviews.',captionPT:'Captura real da página inicial do MEchanic, executado localmente em PHP e Laravel.',captionEN:'Actual screenshot of MEchanic running locally with PHP and Laravel.'}
  ,{id:'blazor',date:'2025-08-08',name:'Gerenciamento de Pedidos',category:'fullstack',tags:['C#','.NET 8','Blazor Server','Bootstrap'],image:'assets/blazor.webp',repo:'https://github.com/enzofernandesnz/atv6_blazor',pt:'Cadastro, edição e exclusão de pedidos com múltiplos itens, cálculo de totais, filtros por cliente e status e paginação. Os dados são mantidos em memória.',en:'Create, edit and delete multi-item orders, calculate totals and filter by customer or status. Includes pagination and stores data in memory.',captionPT:'Aplicação Blazor Server com componentes reutilizáveis e validação de formulários.',captionEN:'A Blazor Server application with reusable components and form validation.'},
  {id:'tse',date:'2026-09-28',name:'Perfil dos Candidatos · MG',category:'java',tags:['Java','Spring Boot','Thymeleaf','OpenCSV'],image:'assets/tse.webp',repo:'https://github.com/enzofernandesnz/Projeto-Candidatos-TSE-2',pt:'Aplicação web que lê uma base CSV de candidatos e permite consultar perfis por gênero, escolaridade e faixa etária, com cartões de candidatura e contagem de resultados.',en:'A web application that reads candidate data from CSV and filters profiles by gender, education and age range, with candidate cards and a result count.',captionPT:'Captura real da aplicação Spring Boot com o CSV original. As fotos de candidatos ausentes refletem os arquivos não incluídos no repositório.',captionEN:'Actual screenshot of the Spring Boot application using its original CSV. Missing candidate photos reflect files absent from the repository.'},
  {id:'oficina',date:'2026-09-28',name:'Gestão de Oficina',category:'java',tags:['Java','POO','ArrayList','Scanner'],image:'assets/oficina.webp',repo:'https://github.com/enzofernandesnz/prova1',pt:'Exercício de orientação a objetos para cadastrar ordens de serviço, associar mecânicos a boxes e distribuir serviços por especialidade, com consultas por status.',en:'An object-oriented programming exercise for managing service orders, assigning mechanics to service bays and distributing jobs by specialty, with status queries.',captionPT:'Saída real do console Java, apresentada em imagem para leitura: menu e consulta de ordens finalizadas por box. Um inicializador temporário chama o método Main original.',captionEN:'Actual Java console output rendered as a readable image: menu and completed-order query by service bay. A temporary launcher calls the original Main method.'}
];
let language='pt';
try { language=localStorage.getItem('portfolio-language')==='en'?'en':'pt'; } catch {}
let filter='all';
const text=(pt,en)=>language==='pt'?pt:en;
const list=document.querySelector('#project-list');
function renderProjects(){
  list.replaceChildren();
  projects.filter(p=>filter==='all'||p.category===filter).sort((a,b)=>b.date.localeCompare(a.date)).forEach(project=>{
    const article=document.createElement('article');article.className='project';
    const date=new Date(project.date+'T12:00:00');
    const month=date.toLocaleDateString(language==='pt'?'pt-BR':'en-US',{month:'short'}).replace('.','').toUpperCase();
    article.innerHTML=`<time class="project-date" datetime="${project.date}">${month}<strong>${date.getFullYear()}</strong></time><button type="button" class="project-visual ${project.isLogo?'mechanic-visual':''}" aria-label="${text('Ampliar imagem de','Enlarge image of')} ${project.name}"><img src="${project.image}" alt="${project.isLogo?text('Logotipo do projeto MEchanic','MEchanic project logo'):text('Captura da interface de ','Screenshot of ')+project.name}" loading="lazy" width="800" height="520">${project.isLogo?`<small>${text('PROJETO ACADÊMICO EM EQUIPE','TEAM ACADEMIC PROJECT')}</small>`:''}<span class="zoom-label" aria-hidden="true">↗</span></button><div class="project-info"><div class="project-kind">${project.category==='frontend'?'FRONT-END':((project.team||project.id==='mechanic')?'FULL STACK · '+text('EM EQUIPE','TEAM PROJECT'):'FULL STACK')}</div><h3>${project.name}</h3><p>${project[language]}</p><div class="tags">${project.tags.map(tag=>`<span>${tag}</span>`).join('')}</div><div class="project-links"><a href="${project.repo}" target="_blank" rel="noopener noreferrer">${text('Repositório','Repository')} ↗</a>${project.demo?`<a href="${project.demo}" target="_blank" rel="noopener noreferrer">${text('Ver site','Live site')} ↗</a>`:`<button type="button" class="details">${text('Ver detalhes','View details')} +</button>`}</div></div>`;
    if(project.awardPT){const award=document.createElement('div');award.className='project-award';const heading=document.createElement('strong');heading.textContent=text(project.awardPT,project.awardEN);const detail=document.createElement('span');detail.textContent=text(project.awardDetailPT,project.awardDetailEN);award.append(heading,detail);article.querySelector('.project-info h3').after(award);}
    if(!project.image){const visual=article.querySelector('.project-visual');visual.className='project-visual code-visual';visual.replaceChildren();const code=document.createElement('span');code.className='code-symbol';code.textContent=project.tags[0];const label=document.createElement('span');label.textContent=project.tags.slice(1).join(' / ');const hint=document.createElement('small');hint.textContent=text('EXPLORAR O PROJETO ↗','EXPLORE THE PROJECT ↗');visual.append(code,label,hint);visual.setAttribute('aria-label',text('Ver detalhes de ','View details of ')+project.name);}
    if(project.category==='java')article.querySelector('.project-kind').textContent=project.id==='oficina'?text('JAVA · CONSOLE','JAVA · CONSOLE'):'JAVA · WEB';
    article.querySelector('.project-visual').addEventListener('click',()=>openProject(project));
    article.querySelector('.details')?.addEventListener('click',()=>openProject(project));
    list.append(article);
  });
  revealOnScroll(list);
  list.scrollTo({left:0,behavior:'instant'});
  requestAnimationFrame(updateProjectNavigation);
}
const projectNavigation=document.querySelector('.project-navigation');
const previousProject=document.querySelector('.project-previous');
const nextProject=document.querySelector('.project-next');
function updateProjectNavigation(){
  const limit=list.scrollWidth-list.clientWidth;
  projectNavigation.hidden=limit<=2;
  previousProject.disabled=list.scrollLeft<=2;
  nextProject.disabled=list.scrollLeft>=limit-2;
}
function moveProjects(direction){
  const card=list.querySelector('.project');
  if(!card)return;
  const step=card.getBoundingClientRect().width+parseFloat(getComputedStyle(list).gap);
  list.scrollBy({left:direction*step,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}
previousProject.addEventListener('click',()=>moveProjects(-1));
nextProject.addEventListener('click',()=>moveProjects(1));
list.addEventListener('scroll',updateProjectNavigation,{passive:true});
new ResizeObserver(updateProjectNavigation).observe(list);
const dialog=document.querySelector('#project-dialog');
function openProject(project){
 const content=document.querySelector('#dialog-content');content.replaceChildren();
 const title=document.createElement('h3');title.id='dialog-title';title.textContent=project.name;
 const image=document.createElement('img');image.className='dialog-image';image.src=project.image;image.alt=language==='pt'?project.captionPT:project.captionEN;
 const caption=document.createElement('p');caption.className='dialog-caption';caption.textContent=image.alt;
 const link=document.createElement('a');link.href=project.repo;link.target='_blank';link.rel='noopener noreferrer';link.className='text-link';link.textContent=text('Abrir repositório ↗','Open repository ↗');
 if(project.image){content.append(title,image,caption,link);}else{const description=document.createElement('p');description.textContent=project[language];content.append(title,description,caption,link);}dialog.showModal();
}
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const box=dialog.getBoundingClientRect();if(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom)dialog.close();}});
function setLanguage(next){
 language=next;document.documentElement.lang=next==='pt'?'pt-BR':'en';
 document.querySelectorAll('[data-pt]').forEach(el=>el.textContent=el.dataset[next]);
 document.querySelectorAll('[data-placeholder-pt]').forEach(el=>el.placeholder=el.dataset[next==='pt'?'placeholderPt':'placeholderEn']);
 document.querySelectorAll('[data-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===next)));
 document.querySelector('#navigation').setAttribute('aria-label',text('Navegação principal','Main navigation'));
 document.querySelector('.filters').setAttribute('aria-label',text('Filtrar projetos','Filter projects'));
 document.querySelector('.menu-toggle').setAttribute('aria-label',text('Alternar menu','Toggle menu'));
 document.title=text('Enzo Fernandes | Desenvolvimento, dados & IA','Enzo Fernandes | Development, data & AI');
 try {localStorage.setItem('portfolio-language',language);}catch{}
 renderProjects();
}
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.language)));
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderProjects();}));
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}
menu.addEventListener('click',()=>{const opened=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(opened));});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){nav.querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.hash==='#'+entry.target.id));}});},{rootMargin:'-20% 0px -55% 0px'});
document.querySelectorAll('main section[id]').forEach(s=>observer.observe(s));
const form=document.querySelector('#contact-form');
form.addEventListener('submit',event=>{
 ['name','message'].forEach(id=>{const field=form.elements[id];field.value=field.value.trim();});
 form.elements.email.value=form.elements.email.value.trim();
 if(form.elements._honey.value || !form.reportValidity()){event.preventDefault();return;}
 // Envio nativo: o serviço oferece captcha, ativação do destinatário e confirmação.
 // Não exibir sucesso antes da resposta real do serviço de e-mail.
 document.querySelector('#form-status').textContent=text('Abrindo a confirmação de envio…','Opening the delivery confirmation…');
});
setLanguage(language);
revealOnScroll();

// Visual reading progress; observes native scrolling without controlling it.
const readingProgress = document.createElement('div');
readingProgress.className = 'reading-progress';
readingProgress.setAttribute('aria-hidden', 'true');
document.body.append(readingProgress);
let progressFrame = 0;
function updateReadingProgress() {
  progressFrame = 0;
  const root = document.documentElement;
  const distance = root.scrollHeight - root.clientHeight;
  const progress = distance > 0 ? Math.max(0, Math.min(1, window.scrollY / distance)) : 0;
  readingProgress.style.transform = `scaleX(${progress})`;
}
function scheduleReadingProgress() {
  if (!progressFrame) progressFrame = requestAnimationFrame(updateReadingProgress);
}
window.addEventListener('scroll', scheduleReadingProgress, { passive: true });
window.addEventListener('resize', scheduleReadingProgress, { passive: true });
window.addEventListener('pageshow', scheduleReadingProgress);
window.addEventListener('load', scheduleReadingProgress);
new ResizeObserver(scheduleReadingProgress).observe(document.body);
updateReadingProgress();
