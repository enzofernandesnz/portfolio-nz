import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useLanguage, Text as Label} from './language.jsx';
import {getPublishedData, readCache, saveCache} from './github-data.js';

const initialRepository = 'https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-1-ti1-0427200-estagi-on';

function parseRepository(value) {
  value = value.trim();
  if (/^https?:\/\//i.test(value)) {
    const url = new URL(value);
    if (url.hostname.toLowerCase() !== 'github.com' || url.username || url.password) throw new Error('invalid');
    value = url.pathname.replace(/^\/+|\/+$/g, '');
  }
  const parts = value.split('/');
  if (parts.length < 2) throw new Error('invalid');
  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/i, '');
  if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38})$/.test(owner)
      || !/^[a-zA-Z0-9_.-]{1,100}$/.test(repo) || repo === '.' || repo === '..') throw new Error('invalid');
  return {owner, repo};
}

function sleep(milliseconds, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) { reject(new DOMException('Aborted', 'AbortError')); return; }
    const abort = () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')); };
    const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, milliseconds);
    signal.addEventListener('abort', abort, {once: true});
  });
}

export default function ContributorStats() {
  const {tr, locale} = useLanguage();
  const panel = useRef(null);
  const activeController = useRef(null);
  const mounted = useRef(true);
  const [repository, setRepository] = useState(initialRepository);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(['', '']);
  const [result, setResult] = useState(null);
  const [sort, setSort] = useState('commits');
  const number = value => Number(value).toLocaleString(locale);

  const analyze = useCallback(async value => {
    let repo;
    try { repo = parseRepository(value); }
    catch { setStatus(['Informe um repositório válido do GitHub, por exemplo dono/projeto.', 'Enter a valid GitHub repository, for example owner/project.']); return; }
    activeController.current?.abort();
    const controller = new AbortController();
    activeController.current = controller;
    const isActive = () => mounted.current && activeController.current === controller;
    const name = `${repo.owner}/${repo.repo}`;
    setBusy(true);
    setResult(null);
    setStatus([`Consultando ${name} no GitHub…`, `Checking ${name} on GitHub…`]);
    try {
      const key = `contributors:${name.toLowerCase()}`;
      const published = (await getPublishedData()).contributors?.[name.toLowerCase()];
      const cached = readCache(key);
      let saved = published && (!cached || published.updatedAt > cached.updatedAt) ? published : cached;
      if (!isActive()) return;
      controller.signal.throwIfAborted();
      let raw;
      if (saved) raw = saved.data;
      else {
        const blocked = readCache('blockedUntil');
        if (blocked && Date.now() < blocked) throw new Error('limit');
        let response;
        for (let attempt = 0; attempt < 6; attempt++) {
          response = await fetch(`https://api.github.com/repos/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.repo)}/stats/contributors`, {
            headers: {Accept: 'application/vnd.github+json'}, signal: controller.signal
          });
          if (!isActive()) return;
          controller.signal.throwIfAborted();
          if (response.status !== 202) break;
          setStatus([`O GitHub está preparando as estatísticas. Tentativa ${attempt + 1} de 6…`, `GitHub is preparing the statistics. Attempt ${attempt + 1} of 6…`]);
          if (attempt < 5) await sleep(3500, controller.signal);
        }
        if (response.status === 202) throw new Error('pending');
        if (response.status === 404) throw new Error('notfound');
        if (response.status === 403 || response.status === 429) {
          const reset = Number(response.headers.get('x-ratelimit-reset')) * 1000;
          const retry = Number(response.headers.get('retry-after')) * 1000;
          saveCache('blockedUntil', Math.max(Date.now() + 60000, reset || Date.now() + (retry || 3600000)));
          throw new Error('limit');
        }
        if (!response.ok) throw new Error('network');
        raw = response.status === 204 ? [] : await response.json();
        if (!isActive()) return;
        controller.signal.throwIfAborted();
        if (!Array.isArray(raw)) throw new Error('network');
        saved = {data: raw, updatedAt: new Date().toISOString()};
        saveCache(key, saved);
      }
      if (!Array.isArray(raw)) throw new Error('network');
      if (!isActive()) return;
      controller.signal.throwIfAborted();
      if (!raw.length) {
        setStatus(['O GitHub não retornou colaboradores para este repositório.', 'GitHub returned no contributors for this repository.']);
        return;
      }
      setResult({name, raw});
      setStatus([`Estatísticas da branch principal. Atualizadas em ${new Date(saved.updatedAt).toLocaleString('pt-BR')}.`, `Default-branch statistics. Updated ${new Date(saved.updatedAt).toLocaleString('en-US')}.`]);
    } catch (error) {
      if (!isActive()) return;
      if (error.name === 'AbortError') setStatus(['Análise cancelada.', 'Analysis canceled.']);
      else if (error.message === 'pending') setStatus(['O GitHub ainda está preparando os dados. Tente novamente em alguns instantes.', 'GitHub is still preparing the data. Please try again shortly.']);
      else if (error.message === 'notfound') setStatus(['Repositório não encontrado ou não é público. Confira o endereço.', 'Repository not found or not public. Check the address.']);
      else if (error.message === 'limit') {
        const until = readCache('blockedUntil') || Date.now() + 3600000;
        setStatus([`O GitHub limitou novas consultas nesta conexão. Tente após ${new Date(until).toLocaleTimeString('pt-BR')}. A análise do Estagi.ON continua disponível.`, `GitHub limited new requests on this connection. Try after ${new Date(until).toLocaleTimeString('en-US')}. The Estagi.ON analysis remains available.`]);
      } else setStatus(['Não foi possível carregar os dados. Confira sua conexão e tente novamente.', 'Could not load the data. Check your connection and try again.']);
    } finally {
      if (isActive()) { activeController.current = null; setBusy(false); }
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    let initiated = false;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting) && !initiated) {
        initiated = true;
        observer.disconnect();
        analyze(initialRepository);
      }
    }, {rootMargin: '250px'});
    observer.observe(panel.current);
    return () => { mounted.current = false; observer.disconnect(); activeController.current?.abort(); };
  }, [analyze]);

  const rows = useMemo(() => (result?.raw || []).map((item, index) => {
    const weeks = Array.isArray(item.weeks) ? item.weeks : [];
    const added = weeks.reduce((total, week) => total + (Number(week.a) || 0), 0);
    const removed = weeks.reduce((total, week) => total + (Number(week.d) || 0), 0);
    return {
      author: item.author?.login || tr(`Autor não identificado ${index + 1}`, `Unknown author ${index + 1}`),
      login: item.author?.login || null, commits: Number(item.total) || 0, added, removed, net: added - removed,
      last: Math.max(0, ...weeks.filter(week => Number(week.c) > 0).map(week => Number(week.w) || 0))
    };
  }).sort((a, b) => b[sort] - a[sort] || b.commits - a.commits || a.author.localeCompare(b.author)), [result, sort, tr]);
  const maximum = Math.max(1, ...rows.map(row => Math.abs(row[sort])));

  function exportCSV() {
    if (!result) return;
    const csvCell = value => {
      let cell = String(value);
      if (typeof value === 'string' && /^[=+@\-\t\r]/.test(cell)) cell = `'${cell}`;
      return `"${cell.replace(/"/g, '""')}"`;
    };
    const lines = [
      ['Colaborador', 'Commits', 'Adições', 'Remoções', 'Saldo', 'Semana do último commit'],
      ...rows.map(row => [row.author, row.commits, row.added, row.removed, row.net, row.last ? new Date(row.last * 1000).toISOString().slice(0, 10) : ''])
    ];
    const blob = new Blob(['\ufeff' + lines.map(row => row.map(csvCell).join(';')).join('\r\n')], {type: 'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'colaboradores-github.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <div ref={panel} className="contributor-panel" id="colaboradores" aria-labelledby="contributors-title">
    <div className="contributor-heading"><div><Label className="github-kicker" pt="TRABALHO EM EQUIPE" en="TEAMWORK" /><Label as="h3" id="contributors-title" pt="Colaborações em código." en="Collaborating through code." /><Label as="p" pt="Explore os colaboradores e a atividade de um repositório público." en="Explore contributors and activity for a public repository." /></div><span className="contributor-badge">CONTRIBUTOR STATS</span></div>
    <form className="contributor-form" onSubmit={event => { event.preventDefault(); analyze(repository); }}>
      <Label as="label" htmlFor="contributor-repository" pt="Repositório do GitHub" en="GitHub repository" />
      <div className="contributor-form-row"><input id="contributor-repository" type="text" required maxLength="250" value={repository} onChange={event => setRepository(event.target.value)} autoComplete="off" spellCheck="false" /><Label as="button" type="submit" className="contributor-submit" disabled={busy} pt="Analisar" en="Analyze" /><Label as="button" type="button" className="contributor-cancel" hidden={!busy} onClick={() => activeController.current?.abort()} pt="Cancelar" en="Cancel" /></div>
      <Label as="p" pt="Dados da branch principal, fornecidos pelo GitHub. Commits e linhas não medem, sozinhos, a qualidade ou toda a contribuição de cada pessoa." en="Data from the default branch, provided by GitHub. Commits and lines alone do not measure quality or each person's full contribution." />
    </form>
    <p className="contributor-status" role="status" aria-live="polite">{tr(...status)}</p>
    <div className="contributor-results" hidden={!result}>
      <div className="contributor-overview"><div><strong id="contributor-people">{result ? number(rows.length) : '—'}</strong><Label pt="autores (inclui bots)" en="authors (includes bots)" /></div><div><strong id="contributor-commits">{result ? number(rows.reduce((total, row) => total + row.commits, 0)) : '—'}</strong><span>commits</span></div><div><strong id="contributor-added">{result ? number(rows.reduce((total, row) => total + row.added, 0)) : '—'}</strong><Label pt="linhas adicionadas" en="lines added" /></div><div><strong id="contributor-removed">{result ? number(rows.reduce((total, row) => total + row.removed, 0)) : '—'}</strong><Label pt="linhas removidas" en="lines removed" /></div></div>
      <div className="contributor-results-head"><div><Label as="h4" pt="Participação por colaborador" en="Contributions by author" /><p className="contributor-repo-name">{result?.name}</p></div><div className="contributor-actions"><Label as="label" htmlFor="contributor-sort" pt="Ordenar por" en="Sort by" /><select id="contributor-sort" value={sort} onChange={event => setSort(event.target.value)}><Label as="option" value="commits" pt="Commits" en="Commits" /><Label as="option" value="added" pt="Linhas adicionadas" en="Lines added" /><Label as="option" value="removed" pt="Linhas removidas" en="Lines removed" /><Label as="option" value="net" pt="Saldo de linhas" en="Net lines" /></select><Label as="button" type="button" className="contributor-csv" onClick={exportCSV} pt="Exportar CSV" en="Export CSV" /></div></div>
      <div className="contributor-chart" aria-label={tr('Gráfico de participação por colaborador', 'Contribution chart by author')}>{rows.slice(0, 10).map(row => <div className="contributor-chart-row" key={row.author}><span className="contributor-chart-name">{row.author}</span><span className="contributor-chart-track"><span className="contributor-chart-fill" style={{width: `${Math.max(0, Math.abs(row[sort]) / maximum * 100)}%`}} /></span><strong>{number(row[sort])}</strong></div>)}</div>
      <div className="contributor-table-wrap"><table className="contributor-table"><thead><tr><Label as="th" pt="Colaborador" en="Contributor" /><th>Commits</th><Label as="th" pt="Adições" en="Added" /><Label as="th" pt="Remoções" en="Removed" /><Label as="th" pt="Saldo" en="Net" /><Label as="th" pt="Última semana com commit" en="Last week with commits" /></tr></thead><tbody>{rows.map(row => <tr key={row.author}><td>{row.login && /^[a-zA-Z0-9-]{1,39}$/.test(row.login) ? <a href={`https://github.com/${row.login}`} target="_blank" rel="noopener noreferrer">{row.author}</a> : row.author}</td>{[row.commits, row.added, row.removed, row.net].map((value, index) => <td key={index}>{number(value)}</td>)}<td>{row.last ? new Date(row.last * 1000).toLocaleDateString(locale, {day: '2-digit', month: 'short', year: 'numeric'}) : '—'}</td></tr>)}</tbody></table></div>
    </div>
  </div>;
}
