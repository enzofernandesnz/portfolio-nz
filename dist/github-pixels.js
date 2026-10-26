/* Decorative pixel field; independent of real GitHub contribution data. */
(() => {
 const section=document.querySelector('#github');
 const canvas=document.createElement('canvas');canvas.className='github-pixel-background';canvas.setAttribute('aria-hidden','true');section.prepend(canvas);
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const motion=matchMedia('(prefers-reduced-motion: reduce)'),button=document.querySelector('.github-pixel-toggle');
 let width=0,height=0,step=10,cells=[],frame=0,visible=false,paused=false,last=0;
 let pointer={x:-1000,y:-1000},ripple=null;
 function labels(){const en=document.documentElement.lang==='en';button.textContent=paused?(en?'Resume effect':'Retomar efeito'):(en?'Pause effect':'Pausar efeito');button.setAttribute('aria-pressed',String(paused));button.hidden=motion.matches;}
 function resize(){
  width=section.clientWidth;height=section.clientHeight;step=width<600?6:10;
  const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  const cols=Math.ceil(width/step),rows=Math.ceil(height/step);
  cells=[];for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const seed=(Math.sin(x*127.1+y*311.7)*43758.5453)%1;cells.push({x:x*step,y:y*step,seed});}draw(0);start();
 }
 function draw(time){ctx.clearRect(0,0,width,height);const animate=!paused&&!motion.matches;
  for(const c of cells){let glow=c.seed>.97?.16:.025;
   if(animate){if(c.seed>.97)glow+=.08*(1+Math.sin(time/1500+c.seed*50));const d=Math.hypot(c.x-pointer.x,c.y-pointer.y);glow+=Math.max(0,1-d/95)*.5;
    if(ripple){const age=time-ripple.time;if(age<1100){const dist=Math.hypot(c.x-ripple.x,c.y-ripple.y);glow+=Math.max(0,1-Math.abs(dist-age*.32)/30)*(1-age/1100)*.6;}else ripple=null;}}
   ctx.fillStyle=`rgba(190,242,100,${Math.min(.95,glow)})`;ctx.fillRect(c.x+1,c.y+1,step-2,step-2);
  }
 }
 function tick(time){frame=0;if(!visible||document.hidden||paused||motion.matches)return;if(time-last>60){draw(time);last=time;}frame=requestAnimationFrame(tick);}
 function start(){if(!frame&&visible&&!document.hidden&&!paused&&!motion.matches)frame=requestAnimationFrame(tick);}
 function stop(){cancelAnimationFrame(frame);frame=0;}
 new ResizeObserver(resize).observe(section);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else stop();}).observe(section);
 section.addEventListener('pointermove',e=>{const r=section.getBoundingClientRect();pointer={x:e.clientX-r.left,y:e.clientY-r.top};},{passive:true});
 section.addEventListener('pointerleave',()=>pointer={x:-1000,y:-1000});
 section.addEventListener('pointerdown',e=>{if(e.target.closest('a,button,input,select,textarea'))return;const r=section.getBoundingClientRect();ripple={x:e.clientX-r.left,y:e.clientY-r.top,time:performance.now()};},{passive:true});
 button.addEventListener('click',()=>{paused=!paused;labels();if(paused){stop();draw(0);}else start();});
 motion.addEventListener('change',()=>{labels();stop();draw(0);start();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});
 new MutationObserver(labels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});labels();
})();
