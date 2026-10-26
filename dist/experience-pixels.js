/* Decorative branch diagram for the career section. */
(() => {
 const panel=document.querySelector('.experience-pixels');if(!panel)return;
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
 svg.setAttribute('viewBox','0 0 380 360');svg.setAttribute('aria-hidden','true');
 const points=[];
 for(let y=7;y<=30;y+=.2)points.push([15,y]);
 for(let t=0;t<=1;t+=.005){const y=11+t*17,x=15+10*Math.sin(Math.PI*t);points.push([x,y]);}
 const nodes=[[15,7],[15,19],[25,20],[15,30]];
 for(let y=0;y<36;y++)for(let x=0;x<38;x++){
  const rect=document.createElementNS(ns,'rect');rect.setAttribute('x',x*10+1);rect.setAttribute('y',y*10+1);rect.setAttribute('width','8');rect.setAttribute('height','8');rect.setAttribute('rx','1.6');
  const nodeDist=Math.min(...nodes.map(([nx,ny])=>Math.hypot(x-nx,y-ny)));
  const lineDist=Math.min(...points.map(([px,py])=>Math.hypot(x-px,y-py)));
  let level=nodeDist<1.8?4:nodeDist<2.5?2:lineDist<.85?3:lineDist<1.4?1:0;
  rect.setAttribute('class',`experience-pixel pixel-level-${level}`);rect.style.setProperty('--pixel-delay',`${(35-y)*25}ms`);svg.append(rect);
 }
 panel.append(svg);
 function labels(){const en=document.documentElement.lang==='en';panel.setAttribute('aria-label',en?'Animate career branches':'Animar ramificações da trajetória');panel.title=en?'Click to animate':'Clique para animar';}
 new MutationObserver(labels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});labels();
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let timer;
 function replay(){if(reduced.matches)return;clearTimeout(timer);panel.classList.remove('is-playing');void panel.offsetWidth;panel.classList.add('is-playing');timer=setTimeout(()=>panel.classList.remove('is-playing'),2800);}
 panel.addEventListener('click',replay);panel.addEventListener('pointerenter',replay);
 new IntersectionObserver((entries,observer)=>{if(entries.some(e=>e.isIntersecting)){replay();observer.disconnect();}},{threshold:.35}).observe(panel);
 reduced.addEventListener('change',()=>{if(reduced.matches){clearTimeout(timer);panel.classList.remove('is-playing');}});
})();
