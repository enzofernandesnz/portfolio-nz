// Credentials remain in Actions; only public response data is published.
import {mkdir, writeFile} from 'node:fs/promises';
const user='enzofernandesnz';
const repo='ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-1-ti1-0427200-estagi-on';
const headers={Accept:'application/vnd.github+json','User-Agent':'portfolio-nz'};
if(process.env.GITHUB_TOKEN) headers.Authorization=`Bearer ${process.env.GITHUB_TOKEN}`;
let previous={};
try {const r=await fetch('https://enzofernandesnz.dev/data/github.json',{signal:AbortSignal.timeout(15000)});if(r.ok)previous=await r.json();}catch{}
const output={...previous,contributors:{...previous.contributors}};
async function get(path){
 for(let i=0;i<6;i++){
  const r=await fetch(`https://api.github.com/${path}`,{headers,signal:AbortSignal.timeout(20000)});
  if(r.status===202){await new Promise(resolve=>setTimeout(resolve,10000));continue;}
  if(!r.ok)throw Error(`GitHub HTTP ${r.status}`);
  return r.status===204?[]:await r.json();
 }
 throw Error('Statistics still pending');
}
for(const [key,path] of Object.entries({profile:`users/${user}`,repos:`users/${user}/repos?per_page=100&sort=updated`,events:`users/${user}/events/public?per_page=100`,contributors:`repos/${repo}/stats/contributors`})){
 try{
  const data=await get(path);const entry={data,updatedAt:new Date().toISOString()};
  if(key==='contributors')output.contributors[repo.toLowerCase()]=entry;else output[key]=entry;
 }catch(error){console.warn(`${key}: ${error.message}; retaining previous data when available`);}
}
if(!output.profile||!output.repos||!output.contributors[repo.toLowerCase()])throw Error('Required public data unavailable; keeping the current deployment.');
await mkdir('dist/data',{recursive:true});
await writeFile('dist/data/github.json',JSON.stringify(output));
