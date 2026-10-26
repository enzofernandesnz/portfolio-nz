/* GitHub activity for enzofernandesnz. Public data, no browser token required. */
(() => {
  const user = 'enzofernandesnz';
  const $ = selector => document.querySelector(selector);
  const isEnglish = () => document.documentElement.lang === 'en';
  const tr = (pt, en) => isEnglish() ? en : pt;
  const make = (tag, className, text) => { const el=document.createElement(tag); if(className)el.className=className; if(text!==undefined)el.textContent=text; return el; };
  const state = { profile:null, repos:null, events:null, contributions:null, errors:{} };
  let selectedDay = null;
  function formatDate(date, options={day:'2-digit',month:'short',year:'numeric'}) {
    return new Date(date.length===10 ? date+'T12:00:00' : date).toLocaleDateString(isEnglish()?'en-US':'pt-BR',options).replace(/\./g,'');
  }
  function renderTicker() {
    const track=$('.github-ticker-track'); track.replaceChildren(); track.classList.remove('is-moving');
    const events=(state.events||[]).filter(e=>e.type==='PushEvent' && e.repo?.name && e.created_at).slice(0,12);
    if(!events.length) { track.append(make('span','github-ticker-empty',state.errors.events ? tr('Atividade recente indisponível.','Recent activity is unavailable.') : state.events ? tr('Sem atividade pública recente no GitHub.','No recent public GitHub activity.') : tr('Carregando atividade recente do GitHub…','Loading recent GitHub activity…'))); return; }
    const group=make('div','github-ticker-group');
    for(const event of events) {
      const item=make('span','github-ticker-item');
      item.append(make('i','github-ticker-dot'),make('time','github-ticker-date',formatDate(event.created_at,{day:'2-digit',month:'short'})),make('strong','',`push(${event.repo.name.split('/').pop()})`));
      const summary=event.payload?.commits?.[0]?.message?.split('\n')[0];
      if(summary)item.append(make('span','github-ticker-summary',summary));
      group.append(item);
    }
    track.append(group); const copy=group.cloneNode(true);copy.setAttribute('aria-hidden','true');track.append(copy);track.classList.add('is-moving');
  }
  function showDay(day) {
    selectedDay=day;
    $('.github-day-info').textContent=day ? `${formatDate(day.date)} · ${day.count} ${day.count===1 ? tr('contribuição','contribution') : tr('contribuições','contributions')}` : tr('Passe o mouse ou use as setas para explorar','Hover or use arrow keys to explore');
  }
  function renderContributions() {
    const map=$('.github-heatmap'), error=$('.github-graph-error');
    map.replaceChildren();
    const days=state.contributions?.contributions;
    if(!Array.isArray(days)||!days.length) {
      error.hidden=!state.errors.contributions;
      if(!error.hidden)error.textContent=tr('Calendário indisponível no momento. Veja as contribuições no seu perfil do GitHub.','Contribution calendar is currently unavailable. See contributions on GitHub.');
      map.removeAttribute('tabindex'); return;
    }
    error.hidden=true;map.tabIndex=0;map.setAttribute('aria-label',tr('Calendário de contribuições. Use as setas para explorar os dias.','Contribution calendar. Use arrow keys to explore days.'));
    const fragment=document.createDocumentFragment();
    for(const day of days) {
      const cell=make('span','github-day');cell.dataset.level=String(Math.max(0,Math.min(4,Number(day.level)||0)));
      cell.title=`${formatDate(day.date)} · ${day.count} ${day.count===1 ? tr('contribuição','contribution') : tr('contribuições','contributions')}`;
      cell.addEventListener('pointerenter',()=>showDay(day));fragment.append(cell);
    }
    map.append(fragment);
    $('.github-heatmap-scroll').scrollLeft=$('.github-heatmap-scroll').scrollWidth;
    const counts=days.map(d=>Number(d.count)||0), total=counts.reduce((a,b)=>a+b,0);
    $('#github-total').textContent=total.toLocaleString(isEnglish()?'en-US':'pt-BR');
    $('#github-active-days').textContent=String(counts.filter(n=>n>0).length);
    let run=0,longest=0; for(const n of counts){run=n>0?run+1:0;longest=Math.max(longest,run);}
    let current=0; let i=counts.length-1; if(counts[i]===0)i--; while(i>=0&&counts[i]>0){current++;i--;}
    $('#github-current-streak').textContent=String(current);$('#github-longest-streak').textContent=String(longest);
    showDay(selectedDay && days.find(d=>d.date===selectedDay.date) || null);
  }
  const map=$('.github-heatmap');
  map.addEventListener('keydown',event=>{
    const delta={ArrowLeft:-7,ArrowRight:7,ArrowUp:-1,ArrowDown:1}[event.key]; if(!delta)return;
    event.preventDefault();const days=state.contributions?.contributions||[];if(!days.length)return;
    const found=days.findIndex(d=>d.date===selectedDay?.date);const index=Math.max(0,Math.min(days.length-1,(found<0?days.length-1:found)+delta));
    showDay(days[index]);const cells=map.querySelectorAll('.github-day');cells.forEach(c=>c.classList.remove('is-selected'));cells[index]?.classList.add('is-selected');cells[index]?.scrollIntoView({block:'nearest',inline:'nearest'});
  });
  function renderRepos() {
    const target=$('.github-repos');target.replaceChildren();
    if(!state.repos) {target.append(make('p','github-repos-status',state.errors.repos?tr('Não foi possível carregar os repositórios agora.','Repositories could not be loaded right now.'):tr('Carregando repositórios…','Loading repositories…')));return;}
    const repos=state.repos.filter(r=>!r.fork&&!r.archived).sort((a,b)=>new Date(b.pushed_at||b.updated_at)-new Date(a.pushed_at||a.updated_at)).slice(0,4);
    if(!repos.length){target.append(make('p','github-repos-status',tr('Nenhum repositório público disponível.','No public repositories available.')));return;}
    for(const repo of repos) {
      const link=make('a','github-repo');link.href=`https://github.com/${user}/${encodeURIComponent(repo.name)}`;link.target='_blank';link.rel='noopener noreferrer';
      const name=make('strong','github-repo-name',repo.name);const arrow=make('span','github-repo-arrow','↗');name.append(arrow);
      const details=[repo.language||tr('Repositório','Repository'),`★ ${repo.stargazers_count||0}`,formatDate(repo.pushed_at||repo.updated_at,{month:'short',year:'numeric'})];
      link.append(name,make('span','github-repo-meta',details.join('  ·  ')));target.append(link);
    }
  }
  function renderProfile(){ $('#github-repo-count').textContent=state.profile ? state.profile.public_repos.toLocaleString(isEnglish()?'en-US':'pt-BR') : '—'; }
  function render(){renderProfile();renderTicker();renderContributions();renderRepos();}
  async function getJson(url){const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);try{const res=await fetch(url,{signal:controller.signal,headers:{Accept:'application/json'}});if(!res.ok)throw new Error(`HTTP ${res.status}`);return await res.json();}finally{clearTimeout(timeout);}}
  const sources={profile:`https://api.github.com/users/${user}`,repos:`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`,events:`https://api.github.com/users/${user}/events/public?per_page=100`,contributions:`https://github-contributions-api.jogruber.de/v4/${user}?y=last`};
  Object.entries(sources).forEach(async ([key,url])=>{try{state[key]=await getJson(url);}catch{state.errors[key]=true;}render();});
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
