/* Certificates supplied by Enzo, with a native sideways carousel. */
(() => {
  const certificates = [
    {date:'2025-11-17',pt:'Introdução à IA moderna',en:'Introduction to Modern AI',file:'ia-2025.webp'},
    {date:'2025-11-17',pt:'Introdução à IoT e à Transformação Digital',en:'Introduction to IoT and Digital Transformation',file:'iot-2025.webp'},
    {date:'2025-11-17',pt:'Fundamentos do Hardware do Computador',en:'Computer Hardware Basics',file:'hardware-2025.webp'},
    {date:'2025-11-17',pt:'Uso de Computadores e Dispositivos Móveis',en:'Using Computer and Mobile Devices',file:'dispositivos-2025.webp'},
    {date:'2025-11-11',pt:'Introdução à Cibersegurança',en:'Introduction to Cybersecurity',file:'ciberseguranca-2025.webp'},
    {date:'2025-11-11',pt:'Conscientização digital',en:'Digital Awareness',file:'consciencia-digital-2025.webp'},
    {date:'2025-04-03',pt:'Defesa de rede',en:'Network Defense',file:'defesa-rede-2025.webp'},
    {date:'2024-11-16',pt:'Introdução à Cibersegurança',en:'Introduction to Cybersecurity',file:'ciberseguranca-2024.webp'},
    {date:'2024-06-28',pt:'Fundamentos do Hardware do Computador',en:'Computer Hardware Basics',file:'hardware-2024.webp'}
  ];
  const $=selector=>document.querySelector(selector), tr=(pt,en)=>document.documentElement.lang==='en'?en:pt;
  const imagePath=c=>`assets/certificates/${c.file}`, name=c=>tr(c.pt,c.en);
  const date=c=>new Date(c.date+'T12:00:00').toLocaleDateString(document.documentElement.lang==='en'?'en-US':'pt-BR',{day:'numeric',month:'long',year:'numeric'});
  const dots=$('.certificate-pagination'),track=$('.certificate-track'),dialog=$('#certificate-dialog');
  const prev=$('.certificate-prev'),next=$('.certificate-next');
  let index=0, dialogIndex=0;
  function fillDialog(i){const c=certificates[i],img=$('.certificate-full');$('#certificate-dialog-title').textContent=name(c);img.src=imagePath(c);img.alt=tr(`Certificado de ${c.pt}, de Enzo Fernandes Alcantara.`,`Certificate for ${c.en}, awarded to Enzo Fernandes Alcantara.`);$('.certificate-dialog-date').textContent=tr(`Concluído em ${date(c)}`,`Completed on ${date(c)}`);}
  function open(i){dialogIndex=i;fillDialog(i);dialog.showModal();}
  certificates.forEach((c,i)=>{
    const card=document.createElement('article');card.className='certificate-card';
    card.innerHTML='<button class="certificate-preview" type="button"><img alt="" width="1395" height="945" loading="lazy"><span aria-hidden="true">↗</span></button><div class="certificate-info"><span class="certificate-tag"></span><h3></h3><p class="certificate-issuer">Cisco Networking Academy · COTEMIG</p><p class="certificate-copy"></p><p class="certificate-date"></p><button class="certificate-open" type="button"></button></div>';
    card.querySelector('img').src=imagePath(c);card.querySelector('.certificate-preview').addEventListener('click',()=>open(i));card.querySelector('.certificate-open').addEventListener('click',()=>open(i));track.append(card);
    const dot=document.createElement('button');dot.type='button';dot.setAttribute('aria-controls','certificate-slide');dot.addEventListener('click',()=>moveTo(i));dots.append(dot);
  });
  function step(){const card=track.firstElementChild;return card?card.getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap):1;}
  function moveTo(i){track.scrollTo({left:Math.max(0,Math.min(certificates.length-1,i))*step(),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
  function update(){
    index=Math.max(0,Math.min(certificates.length-1,Math.round(track.scrollLeft/step())));
    $('.certificate-count').textContent=`${String(index+1).padStart(2,'0')} / ${String(certificates.length).padStart(2,'0')}`;
    prev.disabled=index===0;next.disabled=index===certificates.length-1;
    [...track.children].forEach((card,i)=>{card.classList.toggle('is-current',i===index);card.inert=i!==index;});
    [...dots.children].forEach((dot,i)=>{if(i===index)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current');});
  }
  function translate(){
    certificates.forEach((c,i)=>{
      const card=track.children[i],preview=card.querySelector('.certificate-preview');
      card.querySelector('h3').textContent=name(c);
      card.querySelector('.certificate-tag').textContent=tr('CERTIFICADO DE CONCLUSÃO','CERTIFICATE OF COMPLETION');
      card.querySelector('.certificate-copy').textContent=tr('Curso oferecido pela COTEMIG — Colégio e Faculdade, por meio da Cisco Networking Academy.','Course offered by COTEMIG — Colégio e Faculdade through Cisco Networking Academy.');
      card.querySelector('.certificate-date').textContent=tr(`Concluído em ${date(c)}`,`Completed on ${date(c)}`);
      card.querySelector('.certificate-open').textContent=tr('Ver certificado ↗','View certificate ↗');
      const img=preview.querySelector('img');img.alt=tr(`Certificado de ${c.pt}, de Enzo Fernandes Alcantara.`,`Certificate for ${c.en}, awarded to Enzo Fernandes Alcantara.`);
      preview.setAttribute('aria-label',tr(`Ampliar certificado de ${c.pt}`,`Enlarge ${c.en} certificate`));
      dots.children[i].setAttribute('aria-label',`${tr('Ver certificado','View certificate')}: ${name(c)} (${date(c)})`);
    });
    prev.setAttribute('aria-label',tr('Certificado anterior','Previous certificate'));next.setAttribute('aria-label',tr('Próximo certificado','Next certificate'));
    dots.setAttribute('aria-label',tr('Selecionar certificado','Select certificate'));$('.certificate-close').setAttribute('aria-label',tr('Fechar','Close'));if(dialog.open)fillDialog(dialogIndex);
  }
  prev.addEventListener('click',()=>moveTo(index-1));next.addEventListener('click',()=>moveTo(index+1));track.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',()=>{track.scrollTo({left:index*step(),behavior:'instant'});update();},{passive:true});
  $('.certificate-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
  new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});translate();update();
})();
