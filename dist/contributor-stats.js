/* ContributorStats: public GitHub default-branch statistics without a client token. */
(() => {
  const $ = selector => document.querySelector(selector);
  const tr = (pt,en) => document.documentElement.lang==='en' ? en : pt;
  const number = n => Number(n).toLocaleString(document.documentElement.lang==='en'?'en-US':'pt-BR');
  const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
  const input=$('#contributor-repository'),form=$('.contributor-form'),status=$('.contributor-status'),cancel=$('.contributor-cancel'),submit=$('.contributor-submit'),results=$('.contributor-results'),sort=$('#contributor-sort');
  let controller=null, data=null, analyzedRepo='', lastStatus=null;
  function setStatus(pt,en){lastStatus={pt,en};status.textContent=tr(pt,en);}
  function parseRepo(value) {
    value=value.trim();
    if(/^https?:\/\//i.test(value)) {const url=new URL(value);if(url.hostname.toLowerCase()!=='github.com'||url.username||url.password)throw Error('invalid');value=url.pathname.replace(/^\/+|\/+$/g,'');}
    const parts=value.split('/'); if(parts.length<2)throw Error('invalid');
    let [owner,repo]=parts;repo=repo.replace(/\.git$/i,'');
    if(!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38})$/.test(owner)||!/^[a-zA-Z0-9_.-]{1,100}$/.test(repo)||repo==='.'||repo==='..')throw Error('invalid');
    return {owner,repo};
  }
  function sleep(ms,signal){return new Promise((resolve,reject)=>{if(signal.aborted){reject(new DOMException('Aborted','AbortError'));return;}const id=setTimeout(()=>{signal.removeEventListener('abort',abort);resolve();},ms);function abort(){clearTimeout(id);reject(new DOMException('Aborted','AbortError'));}signal.addEventListener('abort',abort,{once:true});});}
  async function analyze(event){
    event?.preventDefault();let repo;
    try{repo=parseRepo(input.value);}catch{setStatus('Informe um repositório válido do GitHub, por exemplo dono/projeto.','Enter a valid GitHub repository, for example owner/project.');return;}
    if(controller)controller.abort();const active=new AbortController();controller=active;submit.disabled=true;cancel.hidden=false;results.hidden=true;data=null;
    const name=`${repo.owner}/${repo.repo}`;let saved=null;setStatus(`Consultando ${name} no GitHub…`,`Checking ${name} on GitHub…`);
    try{
      const key='contributors:'+name.toLowerCase();
      const published=(await window.nzGithubData.snapshot).contributors?.[name.toLowerCase()];
      const cached=window.nzGithubData.read(key);
      saved=published && (!cached || published.updatedAt>cached.updatedAt) ? published : cached;
      if(controller!==active)return;
      let response, raw;
      if(saved){ raw=saved.data; }
      else {
      const blocked=window.nzGithubData.read('blockedUntil');
      if(blocked && Date.now()<blocked)throw Error('limit');
      for(let i=0;i<6;i++){
        const url=`https://api.github.com/repos/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.repo)}/stats/contributors`;
        response=await fetch(url,{headers:{Accept:'application/vnd.github+json'},signal:active.signal});
        if(response.status!==202)break;
        setStatus(`O GitHub está preparando as estatísticas. Tentativa ${i+1} de 6…`,`GitHub is preparing the statistics. Attempt ${i+1} of 6…`);
        if(i<5)await sleep(3500,active.signal);
      }
      if(response.status===202)throw Error('pending');
      if(response.status===404)throw Error('notfound');
      if(response.status===403||response.status===429){
        const reset=Number(response.headers.get('x-ratelimit-reset'))*1000;
        const retry=Number(response.headers.get('retry-after'))*1000;
        window.nzGithubData.save('blockedUntil',Math.max(Date.now()+60000,reset||Date.now()+(retry||3600000)));throw Error('limit');
      }
      if(!response.ok)throw Error('network');
      raw=response.status===204?[]:await response.json();if(!Array.isArray(raw))throw Error('network');
      saved={data:raw,updatedAt:new Date().toISOString()};window.nzGithubData.save(key,saved);
      }
      if(!Array.isArray(raw))throw Error('network');
      if(controller!==active)return;
      data=raw.map((item,index)=>{
        const weeks=Array.isArray(item.weeks)?item.weeks:[];
        const author=item.author?.login||tr(`Autor não identificado ${index+1}`,`Unknown author ${index+1}`);
        const added=weeks.reduce((n,w)=>n+(Number(w.a)||0),0),removed=weeks.reduce((n,w)=>n+(Number(w.d)||0),0);
        const last=Math.max(0,...weeks.filter(w=>Number(w.c)>0).map(w=>Number(w.w)||0));
        return {author,login:item.author?.login||null,commits:Number(item.total)||0,added,removed,net:added-removed,last};
      });
      analyzedRepo=name;
      if(!data.length){setStatus('O GitHub não retornou colaboradores para este repositório.','GitHub returned no contributors for this repository.');return;}
      renderResults();results.hidden=false;setStatus(`Estatísticas da branch principal. Atualizadas em ${new Date(saved.updatedAt).toLocaleString('pt-BR')}.`,`Default-branch statistics. Updated ${new Date(saved.updatedAt).toLocaleString('en-US')}.`);
    }catch(error){if(controller!==active)return;if(error.name==='AbortError')setStatus('Análise cancelada.','Analysis canceled.');else if(error.message==='pending')setStatus('O GitHub ainda está preparando os dados. Tente novamente em alguns instantes.','GitHub is still preparing the data. Please try again shortly.');else if(error.message==='notfound')setStatus('Repositório não encontrado ou não é público. Confira o endereço.','Repository not found or not public. Check the address.');else if(error.message==='limit')setStatus(`O GitHub limitou novas consultas nesta conexão. Tente após ${new Date(window.nzGithubData.read('blockedUntil')||Date.now()+3600000).toLocaleTimeString('pt-BR')}. A análise do Estagi.ON continua disponível.`,`GitHub limited new requests on this connection. Try after ${new Date(window.nzGithubData.read('blockedUntil')||Date.now()+3600000).toLocaleTimeString('en-US')}. The Estagi.ON analysis remains available.`);else setStatus('Não foi possível carregar os dados. Confira sua conexão e tente novamente.','Could not load the data. Check your connection and try again.');}
    finally{if(controller===active){controller=null;submit.disabled=false;cancel.hidden=true;}}
  }
  function renderResults(){
    if(!data)return;const rows=[...data].sort((a,b)=>b[sort.value]-a[sort.value]||b.commits-a.commits||a.author.localeCompare(b.author));
    for(const [id,v] of [['people',rows.length],['commits',rows.reduce((n,r)=>n+r.commits,0)],['added',rows.reduce((n,r)=>n+r.added,0)],['removed',rows.reduce((n,r)=>n+r.removed,0)]])$(`#contributor-${id}`).textContent=number(v);
    $('.contributor-repo-name').textContent=analyzedRepo;
    const max=Math.max(1,...rows.map(r=>Math.abs(r[sort.value]))),chart=$('.contributor-chart');chart.replaceChildren();chart.setAttribute('aria-label',tr('Gráfico de participação por colaborador','Contribution chart by author'));
    for(const r of rows.slice(0,10)){const line=node('div','contributor-chart-row'),name=node('span','contributor-chart-name',r.author),bar=node('span','contributor-chart-track'),fill=node('span','contributor-chart-fill'),value=node('strong','',number(r[sort.value]));fill.style.width=`${Math.max(0,Math.abs(r[sort.value])/max*100)}%`;bar.append(fill);line.append(name,bar,value);chart.append(line);}
    const body=$('.contributor-table tbody');body.replaceChildren();
    for(const r of rows){const row=document.createElement('tr'),who=document.createElement('td');if(r.login&&/^[a-zA-Z0-9-]{1,39}$/.test(r.login)){const link=node('a','',r.author);link.href=`https://github.com/${r.login}`;link.target='_blank';link.rel='noopener noreferrer';who.append(link);}else who.textContent=r.author;row.append(who);
      for(const value of [r.commits,r.added,r.removed,r.net])row.append(node('td','',number(value)));
      row.append(node('td','',r.last?new Date(r.last*1000).toLocaleDateString(document.documentElement.lang==='en'?'en-US':'pt-BR',{day:'2-digit',month:'short',year:'numeric'}):'—'));body.append(row);
    }
  }
  form.addEventListener('submit',analyze);cancel.addEventListener('click',()=>controller?.abort());sort.addEventListener('change',renderResults);
  $('.contributor-csv').addEventListener('click',()=>{
    if(!data)return;const csvCell=value=>{let s=String(value);if(typeof value==='string'&&/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
    const lines=[['Colaborador','Commits','Adições','Remoções','Saldo','Semana do último commit'],...[...data].sort((a,b)=>b[sort.value]-a[sort.value]).map(r=>[r.author,r.commits,r.added,r.removed,r.net,r.last?new Date(r.last*1000).toISOString().slice(0,10):''])];
    const blob=new Blob(['\ufeff'+lines.map(row=>row.map(csvCell).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='colaboradores-github.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  new MutationObserver(()=>{if(lastStatus)status.textContent=tr(lastStatus.pt,lastStatus.en);renderResults();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  let initiated=false;const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)&&!initiated){initiated=true;observer.disconnect();analyze();}},{rootMargin:'250px'});observer.observe($('.contributor-panel'));
})();
