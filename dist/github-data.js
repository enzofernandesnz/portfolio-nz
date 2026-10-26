/* Shared, public-only data cache. No access token is used in the browser. */
(() => {
 const read=key=>{try{return JSON.parse(localStorage.getItem('nz-github:'+key));}catch{return null;}};
 const save=(key,value)=>{try{localStorage.setItem('nz-github:'+key,JSON.stringify(value));}catch{}};
 const snapshot=fetch(new URL('data/github.json',document.baseURI),{signal:AbortSignal.timeout(12000)}).then(r=>r.ok?r.json():{}).catch(()=>({}));
 window.nzGithubData={snapshot,read,save};
})();
