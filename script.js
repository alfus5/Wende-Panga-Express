function showSection(id) {
  document.querySelectorAll('section, footer').forEach(s => s.classList.add('section-hidden'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.remove('section-hidden');
    if (id === 'accueil') {
      applyCarouselEffect(); // réapplique l’effet 3D
    }
  }
}

function envoyerRDV(event) {
  event.preventDefault();
  const confirmation = document.getElementById('confirmation');
  confirmation.style.display = 'block';

  setTimeout(() => {
    confirmation.style.display = 'none';
    showSection('accueil');
  }, 3000);
}

// 🌀 EFFET 3D SUR LES CARTES D’ACCUEIL
function applyCarouselEffect() {
  const carousel = document.querySelector('#accueil .carousel-centered');
  if (!carousel) return;

  const cards = carousel.querySelectorAll('.card');

  function updateTransform() {
    const center = carousel.scrollLeft + carousel.offsetWidth / 2;
    cards.forEach(card => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = (center - cardCenter) / carousel.offsetWidth;
      const scale = 1 - Math.min(Math.abs(distance) * 0.6, 0.4);
      const rotate = distance * 25;

      card.style.transform = `scale(${scale}) rotateY(${rotate}deg)`;
      card.style.zIndex = `${Math.floor(1000 - Math.abs(distance) * 100)}`;
    });
  }

  carousel.addEventListener('scroll', updateTransform);
  updateTransform();
}

window.onload = () => {
  showSection('accueil');
  applyCarouselEffect();
};
