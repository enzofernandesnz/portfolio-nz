/* Small contribution-grid snake animation for the GitHub section. */
(() => {
  const canvas = document.querySelector('.github-snake');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  if (!context) return;

  const columns = 52;
  const rows = 7;
  const cell = 12;
  const gap = 6;
  const left = Math.round((canvas.width - (columns * cell + (columns - 1) * gap)) / 2);
  const top = 10;
  const route = [];
  for (let x = 0; x < columns; x++) route.push({x, y: 2});
  for (let x = columns - 1; x >= 0; x--) route.push({x, y: 3});

  const shades = ['#064e32', '#08743f', '#0b944b', '#20c663', '#54e987'];
  let head = 0;
  let length = 9;
  let food = (head + 30) % route.length;
  let timer = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function updateLanguage() {
    canvas.setAttribute('aria-label', document.documentElement.lang === 'en' ? canvas.dataset.ariaEn : canvas.dataset.ariaPt);
  }

  function roundedSquare(x, y, size, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.roundRect(x, y, size, size, radius);
    context.fill();
  }

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const px = left + x * (cell + gap);
        const py = top + y * (cell + gap);
        roundedSquare(px, py, cell, 2, '#171e24');
        const seed = (x * 37 + y * 71 + x * y * 13) % 97;
        if (seed < 5) roundedSquare(px, py, cell, 2, seed < 2 ? '#075332' : '#123b2c');
      }
    }

    for (let i = length - 1; i >= 0; i--) {
      const position = route[(head - i + route.length) % route.length];
      const px = left + position.x * (cell + gap);
      const py = top + position.y * (cell + gap);
      roundedSquare(px, py, cell, 2, shades[Math.max(0, shades.length - 1 - Math.min(i, shades.length - 1))]);
    }

    for (let i = 0; i < 3; i++) {
      const position = route[(food + i) % route.length];
      const px = left + position.x * (cell + gap);
      const py = top + position.y * (cell + gap);
      roundedSquare(px, py, cell, 3, '#a900c5');
    }
  }

  function nextStep() {
    head = (head + 1) % route.length;
    const distance = (food - head + route.length) % route.length;
    if (distance < 3 || distance > route.length - length) {
      length = Math.min(length + 2, route.length - 12);
      food = (head + 28 + Math.floor(Math.random() * (route.length - length - 34))) % route.length;
    }
    draw();
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = 0;
  }

  function start() {
    stop();
    if (!reducedMotion.matches && !document.hidden) timer = window.setInterval(nextStep, 145);
    draw();
  }

  reducedMotion.addEventListener('change', start);
  document.addEventListener('visibilitychange', start);
  new MutationObserver(updateLanguage).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
  updateLanguage();
  start();
})();
