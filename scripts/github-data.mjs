// Collect public repository metadata and each repository’s newest commit.
// Only this workflow token can read GitHub; it is never published in the site.
import {appendFile, mkdir, writeFile} from 'node:fs/promises';
const user='enzofernandesnz';
const contributorRepo='ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-1-ti1-0427200-estagi-on';
const headers={Accept:'application/vnd.github+json','User-Agent':'portfolio-nz'};
if(process.env.GITHUB_TOKEN)headers.Authorization=`Bearer ${process.env.GITHUB_TOKEN}`;
let previous={};
try{const r=await fetch('https://enzofernandesnz.dev/data/github.json',{signal:AbortSignal.timeout(15000)});if(r.ok)previous=await r.json();}catch{}
const output={...previous,contributors:{...previous.contributors}};delete output.events;
async function get(path){
 let response=await fetch(`https://api.github.com/${path}`,{headers,signal:AbortSignal.timeout(20000)});
 // The Actions token can be scoped to this repo. Retry a public endpoint anonymously if needed.
 if(process.env.GITHUB_TOKEN&&[401,403,404].includes(response.status))response=await fetch(`https://api.github.com/${path}`,{headers:{Accept:'application/vnd.github+json','User-Agent':'portfolio-nz'},signal:AbortSignal.timeout(20000)});
 for(let i=0;response.status===202&&i<5;i++){
  await new Promise(resolve=>setTimeout(resolve,8000));
  response=await fetch(`https://api.github.com/${path}`,{headers,signal:AbortSignal.timeout(20000)});
 }
 if(!response.ok)throw Error(`GitHub HTTP ${response.status}`);
 return response.status===204?[]:response.json();
}
function entry(data,old){return {data,updatedAt:old&&JSON.stringify(old.data)===JSON.stringify(data)?old.updatedAt:new Date().toISOString()};}
for(const [key,path] of Object.entries({profile:`users/${user}`,repos:`users/${user}/repos?per_page=100&type=public&sort=pushed`,contributors:`repos/${contributorRepo}/stats/contributors`})){
 try{const data=await get(path);const old=key==='contributors'?previous.contributors?.[contributorRepo.toLowerCase()]:previous[key];
  if(key==='contributors')output.contributors[contributorRepo.toLowerCase()]=entry(data,old);else output[key]=entry(data,old);
 }catch(error){console.warn(`${key}: ${error.message}; retaining previously published data`);}
}
const oldCommits=new Map((previous.latestCommits||[]).map(item=>[item.fullName.toLowerCase(),item]));
const repos=(output.repos?.data||[]).filter(repo=>!repo.private&&!repo.fork&&!repo.archived&&repo.default_branch);
const latest=await Promise.all(repos.map(async repo=>{
 const fullName=repo.full_name||`${repo.owner.login}/${repo.name}`,key=fullName.toLowerCase();
 try{
  const commits=await get(`repos/${encodeURIComponent(fullName.split('/')[0])}/${encodeURIComponent(fullName.split('/')[1])}/commits?per_page=1`),c=commits[0];
  if(!c)return oldCommits.get(key)||null;
  const item={fullName,repo:repo.name,message:(c.commit.message||'').split('\n')[0].slice(0,160),date:c.commit.author?.date||c.commit.committer?.date,url:c.html_url,sha:c.sha};
  const old=oldCommits.get(key);if(old&&old.sha===item.sha)item.updatedAt=old.updatedAt;else item.updatedAt=new Date().toISOString();return item;
 }catch(error){console.warn(`${fullName}: ${error.message}; retaining previous commit`);return oldCommits.get(key)||null;}
}));
const nextCommits=latest.filter(Boolean).sort((a,b)=>new Date(b.date)-new Date(a.date));
if(nextCommits.length)output.latestCommits=nextCommits;
if(!output.profile||!output.repos||!output.contributors[contributorRepo.toLowerCase()]||!output.latestCommits?.length)throw Error('Required public GitHub data unavailable; preserving the current deployment.');
await mkdir('dist/data',{recursive:true});
const next=JSON.stringify(output);const oldText=Object.keys(previous).length?JSON.stringify(previous):'';
await writeFile('dist/data/github.json',next);
await appendFile(process.env.GITHUB_OUTPUT,`changed=${oldText===next?'false':'true'}\n`);
