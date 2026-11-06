import { createEffectScope } from './lifecycle.js';

/* Adaptado de SkillsGlobe, Copyright (c) 2026 João Paulo Aramuni.
 * Licença MIT: licenses/LICENSE-skills-globe.txt. Adaptação para JavaScript nativo. */
export function mountSkillsGlobe() {
const scope = createEffectScope();
const { requestAnimationFrame, cancelAnimationFrame, setTimeout, clearTimeout, queueMicrotask } = scope;

"use strict";
const DRAG_THRESHOLD = 6; // px: acima disso o clique vira arrasto e não abre o link
const MAX_TILT = 1.1; // rad: limite da inclinação vertical
const GRID_STEPS = 64; // pontos por linha da grade

// Espiral de Fibonacci: N pontos bem distribuídos numa esfera de raio 1
function fibonacciSphere(n) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / n;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
  });
}

// Linhas da grade: 6 meridianos + 5 paralelos (pontos 3D na esfera de raio 1)
function sphereGrid() {
  const lines = [];
  for (let m = 0; m < 6; m += 1) {
    const lon = (m / 6) * Math.PI;
    lines.push(
      Array.from({ length: GRID_STEPS + 1 }, (_, i) => {
        const t = (i / GRID_STEPS) * Math.PI * 2;
        return { x: Math.cos(t) * Math.cos(lon), y: Math.sin(t), z: Math.cos(t) * Math.sin(lon) };
      })
    );
  }
  for (const lat of [-60, -30, 0, 30, 60]) {
    const phi = (lat * Math.PI) / 180;
    lines.push(
      Array.from({ length: GRID_STEPS + 1 }, (_, i) => {
        const t = (i / GRID_STEPS) * Math.PI * 2;
        return { x: Math.cos(phi) * Math.cos(t), y: Math.sin(phi), z: Math.cos(phi) * Math.sin(t) };
      })
    );
  }
  return lines;
}
const GRID = sphereGrid();

// Gira o ponto em Y (horizontal) e depois em X (vertical)
function rotate(p, rx, ry) {
  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);
  const x1 = p.x * cosY - p.z * sinY;
  const z1 = p.x * sinY + p.z * cosY;
  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  return { x: x1, y: p.y * cosX - z1 * sinX, z: p.y * sinX + z1 * cosX };
}

const widget = document.querySelector('.skills-world');
if (!widget) return scope.dispose;
const stage = widget.querySelector('.skills-globe');
const canvas = widget.querySelector('canvas');
if (!stage || !canvas) return scope.dispose;
const ctx = canvas.getContext('2d');
if (!ctx) return scope.dispose;
const items = [...widget.querySelectorAll('.skills-globe-item')];
const points = fibonacciSphere(items.length);
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const toggle = widget.querySelector('.globe-toggle');
const pause = widget.querySelector('.globe-pause');
if (!toggle || !pause) return scope.dispose;
scope.preserveAttributes(widget, ['class']);
scope.preserveAttributes(canvas, ['width', 'height']);
for (const item of items) scope.preserveAttributes(item, ['style']);
for (const button of [toggle, pause]) {
  scope.preserveAttributes(button, ['hidden', 'aria-pressed', 'data-pt', 'data-en']);
  const text = button.textContent;
  scope.onCleanup(() => { button.textContent = text; });
}
const m = {rx:-.3,ry:0,vx:0,vy:0,dragging:false,hover:false,focused:false,moved:0,last:null,start:null,pointer:null};
scope.onCleanup(() => {
  if (m.pointer !== null && stage.hasPointerCapture(m.pointer)) stage.releasePointerCapture(m.pointer);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
let listMode = false, paused = false, visible = false, frame = 0, lastTime = 0;
widget.classList.add('is-enhanced');
toggle.hidden = false;
pause.hidden = false;

function draw() {
  const width = stage.clientWidth, height = stage.clientHeight;
  if (!width || !height) return;
  const radius = Math.min(width, height) * .36, camera = radius * 4.2;
  const cx = width / 2, cy = height / 2;
  const project = p => {
    const r = rotate(p, m.rx, m.ry), scale = camera / (camera - r.z * radius);
    return {x:cx+r.x*radius*scale,y:cy+r.y*radius*scale,z:r.z,scale};
  };
  const dpr = Math.min(devicePixelRatio || 1, 2);
  if (canvas.width !== Math.round(width*dpr) || canvas.height !== Math.round(height*dpr)) {
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
  }
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
  const halo=ctx.createRadialGradient(cx,cy,radius*.15,cx,cy,radius*1.3);
  halo.addColorStop(0,'#bef26412');halo.addColorStop(1,'#bef26400');
  ctx.fillStyle=halo;ctx.beginPath();ctx.arc(cx,cy,radius*1.3,0,Math.PI*2);ctx.fill();
  ctx.lineWidth=.8;ctx.strokeStyle='#bef264';
  for(const line of GRID){
    let prev=project(line[0]);
    for(let i=1;i<line.length;i++){
      const cur=project(line[i]);ctx.globalAlpha=(prev.z+cur.z)/2>0?.3:.07;
      ctx.beginPath();ctx.moveTo(prev.x,prev.y);ctx.lineTo(cur.x,cur.y);ctx.stroke();prev=cur;
    }
  }
  ctx.globalAlpha=1;
  points.forEach((p,i)=>{
    const el=items[i],{x,y,z,scale}=project(p),depth=(z+1)/2;
    el.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%) scale(${(.68+.32*depth)*scale})`;
    el.style.opacity=String(.3+.7*depth**1.5);el.style.zIndex=String(Math.round(depth*100));
  });
}
function canAnimate(){return visible&&!document.hidden&&!listMode&&!paused&&!reduced.matches&&!m.focused;}
function tick(now){
  frame=0;
  if(!canAnimate())return;
  const dt=Math.min((now-lastTime)/1000,.05);
  if(dt<1/30){frame=requestAnimationFrame(tick);return;}
  lastTime=now;
  if(!m.dragging){
    m.ry+=.16*dt*(m.hover?.25:1)+m.vy*dt*60;
    m.rx=Math.max(-MAX_TILT,Math.min(MAX_TILT,m.rx+m.vx*dt*60));
    const decay=Math.pow(.92,dt*60);m.vx*=decay;m.vy*=decay;
  }
  draw();frame=requestAnimationFrame(tick);
}
function sync(){
  cancelAnimationFrame(frame);frame=0;
  if(!listMode)draw();
  if(canAnimate()){lastTime=performance.now();frame=requestAnimationFrame(tick);}
}
function label(button,pt,en){
  button.dataset.pt=pt;button.dataset.en=en;
  button.textContent=document.documentElement.lang==='en'?en:pt;
}
scope.listen(toggle, 'click',()=>{
  listMode=!listMode;widget.classList.toggle('is-list',listMode);
  toggle.setAttribute('aria-pressed',String(listMode));
  label(toggle,listMode?'Ver globo':'Ver lista',listMode?'Show globe':'Show list');
  pause.hidden=listMode;sync();
});
scope.listen(pause, 'click',()=>{
  paused=!paused;m.vx=m.vy=0;pause.setAttribute('aria-pressed',String(paused));
  label(pause,paused?'Retomar rotação':'Pausar rotação',paused?'Resume rotation':'Pause rotation');sync();
});
scope.listen(stage, 'pointerdown',e=>{
  if(listMode||!e.isPrimary||e.button!==0)return;
  m.dragging=true;m.pointer=e.pointerId;m.start=m.last={x:e.clientX,y:e.clientY};m.moved=0;m.vx=m.vy=0;
});
scope.listen(stage, 'pointermove',e=>{
  if(!m.dragging||e.pointerId!==m.pointer||listMode)return;
  const distance=Math.hypot(e.clientX-m.start.x,e.clientY-m.start.y);
  if(e.pointerType==='touch'&&distance>DRAG_THRESHOLD&&Math.abs(e.clientY-m.start.y)>Math.abs(e.clientX-m.start.x)*1.2){m.dragging=false;return;}
  if(distance<=DRAG_THRESHOLD)return;
  m.moved=Math.max(m.moved,distance);
  if(!stage.hasPointerCapture(e.pointerId))stage.setPointerCapture(e.pointerId);
  const dx=e.clientX-m.last.x,dy=e.clientY-m.last.y;m.last={x:e.clientX,y:e.clientY};
  m.ry+=dx*.006;m.rx=Math.max(-MAX_TILT,Math.min(MAX_TILT,m.rx-dy*.006));
  m.vy=reduced.matches||paused?0:Math.max(-.08,Math.min(.08,dx*.006));
  m.vx=reduced.matches||paused?0:Math.max(-.08,Math.min(.08,-dy*.006));
  draw();
});
function release(e){
  if(e.pointerId!==m.pointer)return;
  m.dragging=false;
  if(stage.hasPointerCapture(e.pointerId))stage.releasePointerCapture(e.pointerId);
}
scope.listen(stage, 'pointerup',release);
scope.listen(stage, 'pointercancel',release);
scope.listen(stage, 'lostpointercapture',()=>{m.dragging=false;});
scope.listen(stage, 'pointerenter',()=>{m.hover=true;});
scope.listen(stage, 'pointerleave',()=>{m.hover=false;if(!stage.hasPointerCapture(m.pointer??-1))m.dragging=false;});
scope.listen(stage, 'click',e=>{if(!listMode&&m.moved>DRAG_THRESHOLD&&e.detail!==0){e.preventDefault();e.stopPropagation();}m.moved=0;},true);
scope.listen(stage, 'dragstart',e=>e.preventDefault());
scope.listen(stage, 'focusin',()=>{m.focused=true;sync();});
scope.listen(stage, 'focusout',()=>{queueMicrotask(()=>{m.focused=stage.contains(document.activeElement);sync();});});
scope.observer(IntersectionObserver, ([entry])=>{visible=entry.isIntersecting;sync();}).observe(stage);
scope.observer(ResizeObserver, sync).observe(stage);
scope.listen(reduced, 'change',()=>{m.vx=m.vy=0;sync();});
scope.listen(document, 'visibilitychange',sync);
scope.listen(window, 'pagehide',()=>{cancelAnimationFrame(frame);frame=0;});
scope.listen(window, 'pageshow',sync);
sync();


return scope.dispose;
}
