/* Scroll-assembled particles with spring return, pointer repulsion and click burst. */
(() => {
 const panel=document.querySelector('.experience-pixels');if(!panel)return;
 const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');panel.append(canvas);
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const colors=['#1b2820','#304d2a','#496d33','#80ad43','#bef264'];
 let cells=[],size=0,pitch=0,progress=0,frame=0,last=0,visible=false,pointer=null,wave=null;
 const clamp=v=>Math.max(0,Math.min(1,v));
 function level(x,y){
  let v=0;
  if(x>=14&&x<=15&&y>=3&&y<=32)v=2;
  // Two parallel pixel paths split from the vertical branch and join again.
  if(y>=11&&y<=17&&Math.abs(x-(16+(y-11)*8/6))<1.3)v=2;
  if(x>=24&&x<=25&&y>=17&&y<=25)v=2;
  if(y>=25&&y<=29&&Math.abs(x-(24-(y-25)*8/4))<1.3)v=2;
  for(const [nx,ny,r,l] of [[14.5,6.5,3.8,1],[14.5,6.5,2.6,4],[14.5,18.5,2.3,3],[14.5,30,2.3,3],[24.5,20,2.3,4]])if(Math.hypot(x-nx,y-ny)<=r)v=Math.max(v,l);
  return v;
 }
 function reset(){progress=0;for(const c of cells){c.x=c.sx;c.y=c.sy;c.vx=c.vy=c.heat=0;}}
 function resize(){
  size=panel.clientWidth-20;pitch=size/38;const dpr=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.round(size*dpr);canvas.height=Math.round(size*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  cells=[];
  for(let y=0;y<38;y++)for(let x=0;x<38;x++){
   const hx=(x+.5)*pitch,hy=(y+.5)*pitch,sx=hx+(Math.random()-.5)*pitch*7,sy=size+pitch*(2+Math.random()*7);
   cells.push({hx,hy,sx,sy,x:progress>.5?hx:sx,y:progress>.5?hy:sy,vx:0,vy:0,heat:0,level:level(x,y),delay:(x/38*.5+(37-y)/38*.18+Math.random()*.07)});
  }
  if(motion.matches)draw(performance.now(),16);else start();
 }
 function draw(time,dt){
  const box=panel.getBoundingClientRect(),fraction=clamp((Math.min(box.bottom,innerHeight)-Math.max(box.top,0))/box.height);
  const q=clamp((fraction-.2)/.5),target=q*q*(3-2*q);
  progress=motion.matches?1:progress+(target-progress)*(1-Math.exp(-dt/320));
  ctx.clearRect(0,0,size,size);const factor=Math.min(2,dt/16.67);
  for(const c of cells){
   const part=motion.matches?1:clamp((progress-c.delay)/.3),ease=1-(1-part)**3;
   if(motion.matches){c.x=c.hx;c.y=c.hy;c.heat=0;}else{
    const tx=c.sx+(c.hx-c.sx)*ease,ty=c.sy+(c.hy-c.sy)*ease;
    let ax=(tx-c.x)*.11,ay=(ty-c.y)*.11;
    if(pointer&&part>0){const dx=c.x-pointer.x,dy=c.y-pointer.y,d=Math.hypot(dx,dy)||1;if(d<74){const force=1-d/74;ax+=dx/d*force*.8;ay+=dy/d*force*.8;c.heat=Math.max(c.heat,force);}}
    if(wave){const distance=Math.hypot(c.x-wave.x,c.y-wave.y),edge=(time-wave.time)*.85-distance;if(edge>0&&edge<50)c.heat=Math.max(c.heat,Math.sin(edge/50*Math.PI));}
    c.vx=(c.vx+ax*factor)*Math.pow(.8,factor);c.vy=(c.vy+ay*factor)*Math.pow(.8,factor);c.x+=c.vx*factor;c.y+=c.vy*factor;c.heat*=Math.pow(.955,factor);
   }
   if(part<=0)continue;
   const side=pitch*.8*(.3+.7*ease)*(1+Math.min(c.heat,1)*.22);
   ctx.fillStyle=colors[c.level];ctx.beginPath();ctx.roundRect(c.x-side/2,c.y-side/2,side,side,side*.22);ctx.fill();
   if(c.heat>.05){ctx.fillStyle=`rgba(225,255,164,${Math.min(.8,c.heat*.8)})`;ctx.fill();}
  }
  if(wave&&time-wave.time>1400)wave=null;
 }
 function tick(time){frame=0;if(!visible||document.hidden||motion.matches)return;draw(time,Math.min(40,time-(last||time-16)));last=time;frame=requestAnimationFrame(tick);}
 function start(){if(visible&&!document.hidden&&!motion.matches&&!frame){last=0;frame=requestAnimationFrame(tick);}}
 function stop(){cancelAnimationFrame(frame);frame=0;last=0;}
 function position(e){const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*size/r.width,y:(e.clientY-r.top)*size/r.height};}
 panel.addEventListener('pointermove',e=>{if(e.pointerType==='mouse')pointer=position(e);},{passive:true});
 panel.addEventListener('pointerleave',()=>pointer=null);
 panel.addEventListener('click',e=>{
  if(motion.matches)return;const p=e.detail?position(e):{x:size/2,y:size/2};wave={...p,time:performance.now()};
  for(const c of cells){const dx=c.x-p.x,dy=c.y-p.y,d=Math.hypot(dx,dy)||1,radius=Math.max(160,pitch*14);if(d<radius){const force=(1-d/radius)**1.5;c.vx+=dx/d*force*16+(Math.random()-.5)*force*4;c.vy+=dy/d*force*16+(Math.random()-.5)*force*4;}}
  start();
 });
 new ResizeObserver(resize).observe(panel);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){if(motion.matches)draw(performance.now(),16);else start();}else{stop();reset();}},{rootMargin:'15% 0px'}).observe(panel);
 motion.addEventListener('change',()=>{stop();if(motion.matches)draw(performance.now(),16);else start();});
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
 function labels(){const en=document.documentElement.lang==='en';panel.setAttribute('aria-label',en?'Interactive career branches: click to scatter the pixels':'Ramificações interativas da trajetória: clique para espalhar os pixels');panel.title=en?'Move the pointer or click':'Mova o mouse ou clique';}
 new MutationObserver(labels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});labels();
})();
