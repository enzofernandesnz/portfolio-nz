/* Certificates provided by Enzo, shown one at a time. */
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
  const $ = selector => document.querySelector(selector);
  const tr = (pt,en) => document.documentElement.lang==='en'?en:pt;
  const imagePath = c => `assets/certificates/${c.file}`;
  const currentName = c => tr(c.pt,c.en);
  const date = c => new Date(c.date+'T12:00:00').toLocaleDateString(document.documentElement.lang==='en'?'en-US':'pt-BR',{day:'numeric',month:'long',year:'numeric'});
  const dots=$('.certificate-pagination'),card=$('.certificate-card'),preview=$('.certificate-preview'),dialog=$('#certificate-dialog');
  let index=0;
  function render() {
    const c=certificates[index], name=currentName(c);
    card.querySelector('h3').textContent=name;
    card.querySelector('.certificate-copy').textContent=tr('Curso oferecido pela COTEMIG — Colégio e Faculdade, por meio da Cisco Networking Academy.','Course offered by COTEMIG — Colégio e Faculdade through Cisco Networking Academy.');
    card.querySelector('.certificate-date').textContent=tr(`Concluído em ${date(c)}`,`Completed on ${date(c)}`);
    const img=preview.querySelector('img');img.src=imagePath(c);img.alt=tr(`Certificado de ${c.pt}, de Enzo Fernandes Alcantara.`,`Certificate for ${c.en}, awarded to Enzo Fernandes Alcantara.`);
    preview.setAttribute('aria-label',tr(`Ampliar certificado de ${c.pt}`,`Enlarge ${c.en} certificate`));
    $('.certificate-count').textContent=`${String(index+1).padStart(2,'0')} / ${String(certificates.length).padStart(2,'0')}`;
    $('.certificate-prev').disabled=index===0;$('.certificate-next').disabled=index===certificates.length-1;
    $('.certificate-prev').setAttribute('aria-label',tr('Certificado anterior','Previous certificate'));$('.certificate-next').setAttribute('aria-label',tr('Próximo certificado','Next certificate'));
    dots.setAttribute('aria-label',tr('Selecionar certificado','Select certificate'));
    dots.replaceChildren();certificates.forEach((item,i)=>{const dot=document.createElement('button');dot.type='button';dot.setAttribute('aria-label',`${tr('Ver certificado','View certificate')}: ${currentName(item)} (${date(item)})`);dot.setAttribute('aria-controls','certificate-slide');if(i===index)dot.setAttribute('aria-current','true');dot.addEventListener('click',()=>{index=i;render();});dots.append(dot);});
    $('.certificate-close').setAttribute('aria-label',tr('Fechar','Close'));
    if(dialog.open) fillDialog();
  }
  function fillDialog(){const c=certificates[index],img=$('.certificate-full');$('#certificate-dialog-title').textContent=currentName(c);img.src=imagePath(c);img.alt=tr(`Certificado de ${c.pt}, de Enzo Fernandes Alcantara.`,`Certificate for ${c.en}, awarded to Enzo Fernandes Alcantara.`);$('.certificate-dialog-date').textContent=tr(`Concluído em ${date(c)}`,`Completed on ${date(c)}`);}
  function open(){fillDialog();dialog.showModal();}
  $('.certificate-open').addEventListener('click',open);preview.addEventListener('click',open);$('.certificate-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
  $('.certificate-prev').addEventListener('click',()=>{if(index>0){index--;render();}});$('.certificate-next').addEventListener('click',()=>{if(index<certificates.length-1){index++;render();}});
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});render();
})();
