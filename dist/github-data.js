/* Public GitHub data snapshot, refreshed from Pages without visitor API calls. */
(() => {
 const read=key=>{try{return JSON.parse(localStorage.getItem('nz-github:'+key));}catch{return null;}};
 const save=(key,value)=>{try{localStorage.setItem('nz-github:'+key,JSON.stringify(value));}catch{}};
 let current={},snapshot=Promise.resolve(current);const listeners=new Set();
 async function refresh(){try{const response=await fetch(new URL('data/github.json',document.baseURI),{cache:'no-store',headers:{Accept:'application/json'}});if(response.ok){const next=await response.json();if(JSON.stringify(next.latestCommits)!==JSON.stringify(current.latestCommits)){current=next;for(const listener of listeners)listener(current);}else current=next;}}catch{}return current;}
 snapshot=refresh();
 window.nzGithubData={get snapshot(){return snapshot;},read,save,subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener);},refresh};
 window.setInterval(refresh,5*60*1000);
})();
