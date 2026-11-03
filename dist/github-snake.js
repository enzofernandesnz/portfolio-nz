(() => {
  const image = document.querySelector('.github-snake');
  const card = image.closest('.github-contributions-card');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  function update() {
    const showAnimation = !reducedMotion.matches && image.complete && image.naturalWidth > 0;
    image.hidden = !showAnimation;
    card.classList.toggle('has-snake-animation', showAnimation);
  }

  function syncMotion() {
    if (reducedMotion.matches) {
      image.removeAttribute('src');
    } else if (!image.hasAttribute('src')) {
      image.src = image.dataset.src;
    }
    update();
  }

  function updateLanguage() {
    image.alt = document.documentElement.lang === 'en'
      ? 'Animated snake eating GitHub contributions'
      : 'Animação da cobra comendo as contribuições do GitHub';
  }

  image.addEventListener('load', update);
  image.addEventListener('error', update);
  reducedMotion.addEventListener('change', syncMotion);
  new MutationObserver(updateLanguage).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang']
  });
  updateLanguage();
  syncMotion();
})();
