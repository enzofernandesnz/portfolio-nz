import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useLanguage, Text as Label} from './language.jsx';
import {useGitHubData} from './github-data.js';
import ContributorStats from './ContributorStats.jsx';

const user = 'enzofernandesnz';
const snakeURL = 'https://raw.githubusercontent.com/enzofernandesnz/enzofernandesnz/output/github-contribution-grid-snake-dark.svg';

function formatDate(date, locale, options = {day: '2-digit', month: 'short', year: 'numeric'}) {
  return new Date(date.length === 10 ? date + 'T12:00:00' : date).toLocaleDateString(locale, options).replace(/\./g, '');
}

export function GitHubTicker() {
  const {tr, locale} = useLanguage();
  const {latestCommits} = useGitHubData();
  const commits = latestCommits.filter(commit => commit.repo && commit.date).slice(0, 12);
  const group = hidden => <div className="github-ticker-group" aria-hidden={hidden || undefined}>{commits.map(commit => <span className="github-ticker-item" key={commit.fullName || commit.repo}><i className="github-ticker-dot" /><time className="github-ticker-date">{formatDate(commit.date, locale, {day: '2-digit', month: 'short'})}</time><strong>{`commit(${commit.repo})`}</strong>{commit.message && <span className="github-ticker-summary">{commit.message}</span>}</span>)}</div>;
  return <div className="github-ticker" aria-label="Atividade recente no GitHub"><div className={`github-ticker-track${commits.length ? ' is-moving' : ''}`}>{commits.length ? <>{group(false)}{group(true)}</> : <span className="github-ticker-empty">{tr('Carregando os últimos commits públicos…', 'Loading the latest public commits…')}</span>}</div></div>;
}

function ContributionCalendar({data, error}) {
  const {tr, locale} = useLanguage();
  const days = Array.isArray(data?.contributions) ? data.contributions : [];
  const [selectedDate, setSelectedDate] = useState(null);
  const [keyboardDate, setKeyboardDate] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [snakeLoaded, setSnakeLoaded] = useState(false);
  const scroll = useRef(null);
  const calendar = useRef(null);
  const snake = useRef(null);
  const showSnake = !reducedMotion && snakeLoaded;
  const selectedDay = days.find(day => day.date === selectedDate);

  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => { setReducedMotion(query.matches); setSnakeLoaded(false); };
    query.addEventListener('change', change);
    if (snake.current.complete && snake.current.naturalWidth > 0) setSnakeLoaded(true);
    return () => query.removeEventListener('change', change);
  }, []);

  useLayoutEffect(() => {
    scroll.current.scrollLeft = scroll.current.scrollWidth;
  }, [data, locale, showSnake]);

  useEffect(() => {
    if (!keyboardDate) return;
    calendar.current.querySelector('.is-selected')?.scrollIntoView({block: 'nearest', inline: 'nearest'});
  }, [keyboardDate]);

  function dayDescription(day) {
    return `${formatDate(day.date, locale)} · ${day.count} ${day.count === 1 ? tr('contribuição', 'contribution') : tr('contribuições', 'contributions')}`;
  }

  function onKeyDown(event) {
    const delta = {ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1}[event.key];
    if (!delta || !days.length) return;
    event.preventDefault();
    const found = days.findIndex(day => day.date === selectedDate);
    const index = Math.max(0, Math.min(days.length - 1, (found < 0 ? days.length - 1 : found) + delta));
    setSelectedDate(days[index].date);
    setKeyboardDate(days[index].date);
  }

  const total = days.length ? days.reduce((sum, day) => sum + (Number(day.count) || 0), 0).toLocaleString(locale) : '—';
  return <div className={`github-contributions-card${showSnake ? ' has-snake-animation' : ''}`}>
    <div className="github-card-head"><div><Label className="github-kicker" pt="ATIVIDADE NO ÚLTIMO ANO" en="ACTIVITY OVER THE LAST YEAR" /><p className="github-total"><strong id="github-total">{total}</strong>{' '}<Label pt="contribuições" en="contributions" /></p></div><span className="github-live"><i />{' '}<Label pt="Dados públicos" en="Public data" /></span></div>
    <img ref={snake} className="github-snake" hidden={!showSnake} decoding="async" data-src={snakeURL} src={reducedMotion ? undefined : snakeURL} alt={tr('Animação da cobra comendo as contribuições do GitHub', 'Animated snake eating GitHub contributions')} onLoad={() => setSnakeLoaded(true)} onError={() => setSnakeLoaded(false)} />
    <div className="github-heatmap-scroll" ref={scroll}><div className="github-heatmap" ref={calendar} tabIndex={days.length ? 0 : undefined} aria-label={tr('Calendário de contribuições. Use as setas para explorar os dias.', 'Contribution calendar. Use arrow keys to explore days.')} onKeyDown={onKeyDown}>{days.map(day => <span key={day.date} className={`github-day${keyboardDate === day.date ? ' is-selected' : ''}`} data-level={Math.max(0, Math.min(4, Number(day.level) || 0))} title={dayDescription(day)} onPointerEnter={() => setSelectedDate(day.date)} />)}</div></div>
    <div className="github-heatmap-footer"><span className="github-day-info" role="status" data-pt="Passe o mouse ou use as setas para explorar" data-en="Hover or use arrow keys to explore">{selectedDay ? dayDescription(selectedDay) : tr('Passe o mouse ou use as setas para explorar', 'Hover or use arrow keys to explore')}</span><span className="github-legend"><Label pt="Menos" en="Less" />{[0, 1, 2, 3, 4].map(level => <i data-level={level} key={level} />)}<Label pt="Mais" en="More" /></span></div>
    <p className="github-graph-error" role="status" hidden={days.length > 0 || !error}>{error && tr('Calendário indisponível no momento. Veja as contribuições no seu perfil do GitHub.', 'Contribution calendar is currently unavailable. See contributions on GitHub.')}</p>
  </div>;
}

function ContributionStatistics({profile, contributions}) {
  const {locale} = useLanguage();
  const days = Array.isArray(contributions?.contributions) ? contributions.contributions : [];
  const counts = days.map(day => Number(day.count) || 0);
  let run = 0;
  let longest = 0;
  for (const count of counts) {
    run = count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  let current = 0;
  let index = counts.length - 1;
  if (counts[index] === 0) index--;
  while (index >= 0 && counts[index] > 0) { current++; index--; }
  return <div className="github-stats"><div><strong id="github-repo-count">{profile ? profile.public_repos.toLocaleString(locale) : '—'}</strong><Label pt="repositórios públicos" en="public repositories" /></div><div><strong id="github-active-days">{days.length ? counts.filter(count => count > 0).length : '—'}</strong><Label pt="dias com contribuições" en="days with contributions" /></div><div><strong id="github-current-streak">{days.length ? current : '—'}</strong><Label pt="sequência atual" en="current streak" /></div><div><strong id="github-longest-streak">{days.length ? longest : '—'}</strong><Label pt="maior sequência no ano" en="longest streak this year" /></div></div>;
}

function Repositories({repos, error}) {
  const {tr, locale} = useLanguage();
  const recent = repos?.filter(repo => !repo.fork && !repo.archived).sort((a, b) => new Date(b.pushed_at || b.updated_at) - new Date(a.pushed_at || a.updated_at)).slice(0, 4);
  let status = '';
  if (!repos) status = error ? tr('Não foi possível carregar os repositórios agora.', 'Repositories could not be loaded right now.') : tr('Carregando repositórios…', 'Loading repositories…');
  else if (!recent.length) status = tr('Nenhum repositório público disponível.', 'No public repositories available.');
  return <div className="github-repos" aria-live="polite">{status ? <p className="github-repos-status">{status}</p> : recent.map(repo => <a className="github-repo" key={repo.name} href={`https://github.com/${user}/${encodeURIComponent(repo.name)}`} target="_blank" rel="noopener noreferrer"><strong className="github-repo-name">{repo.name}<span className="github-repo-arrow">↗</span></strong><span className="github-repo-meta">{[repo.language || tr('Repositório', 'Repository'), `★ ${repo.stargazers_count || 0}`, formatDate(repo.pushed_at || repo.updated_at, locale, {month: 'short', year: 'numeric'})].join('  ·  ')}</span></a>)}</div>;
}

export function GitHubSection() {
  const data = useGitHubData();
  return <section className="github-section" id="github" aria-labelledby="github-title"><div className="wrap section">
    <div className="section-label"><span>↗ /</span><span>GITHUB</span></div>
    <div className="github-heading"><div><Label as="h2" id="github-title" pt="Código em movimento." en="Code in motion." /><Label as="p" pt="Aqui você acompanha minha atividade pública, minhas contribuições e alguns dos repositórios que venho desenvolvendo e atualizando no GitHub." en="Here you can follow my public activity, contributions and some of the repositories I have been building and updating on GitHub." /></div><a className="github-profile-link" href="https://github.com/enzofernandesnz" target="_blank" rel="noopener noreferrer">@enzofernandesnz ↗</a></div>
    <div className="github-dashboard"><ContributionCalendar data={data.contributions} error={data.errors.contributions} /><ContributionStatistics profile={data.profile} contributions={data.contributions} /></div>
    <div className="github-repos-heading"><Label as="h3" pt="Repositórios atualizados recentemente" en="Recently updated repositories" /><Label as="a" href="https://github.com/enzofernandesnz?tab=repositories" target="_blank" rel="noopener noreferrer" pt="Ver todos no GitHub ↗" en="See all on GitHub ↗" /></div>
    <Repositories repos={data.repos} error={data.errors.repos} />
    <ContributorStats />
  </div></section>;
}
