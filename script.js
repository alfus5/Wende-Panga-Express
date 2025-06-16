/* =========================================================
   FIREBASE  (laisse commenté si tu ne l’utilises pas)
   ========================================================= */
import { initializeApp }   from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAnalytics }    from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
import { getDatabase, ref, push, set }
       from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

const firebaseConfig = {
  apiKey:            "AIzaSyBo4JVuZi5AtC1wY1TXx4Az8ckQv5QrBPI",
  authDomain:        "wende-panga-express.firebaseapp.com",
  databaseURL:       "https://wende-panga-express-default-rtdb.europe-west1.firebasedatabase.app",
  projectId:         "wende-panga-express",
  storageBucket:     "wende-panga-express.appspot.com",
  messagingSenderId: "661266039149",
  appId:             "1:661266039149:web:a6b82733096ed5217a9a64",
  measurementId:     "G-0JKLWTYV81"
};

const app        = initializeApp(firebaseConfig);
getAnalytics(app);
const database   = getDatabase(app);

/* =========================================================
   LOGIQUE DU SITE
   ========================================================= */
let sectionHistory = ['accueil'];
const groupesPrincipaux = ['reparations', 'electronique', 'moteur', 'defauts'];

/* ---------- Afficher une section ---------- */
function showSection(id, skipHistory = false) {
  const current = document.querySelector('section:not(.section-hidden), footer:not(.section-hidden)');
  if (current && current.id !== id && !skipHistory) {
    sectionHistory.push(current.id);
  }

  document.querySelectorAll('section, footer')
          .forEach(s => s.classList.add('section-hidden'));

  const target = document.getElementById(id) ||
                 document.querySelector(`footer#${id}`);
  if (!target) return;

  if (id === 'rendezvous') {
    document.querySelector('#rdv-titre').textContent                 = "Prendre Rendez-vous";
    document.querySelector('select[name="service"]').value          = "";
    document.querySelector('textarea[name="message"]').value        = "";
    document.querySelector('#description-service').textContent       = "";
    document.querySelector('#symptomes-service').innerHTML           = "";
    document.getElementById('rdv-intro').style.display               = 'block';
    document.getElementById('formulaire-rdv').style.display          = 'none';
  }

  target.classList.remove('section-hidden');
  if (id === 'accueil') applyCarouselEffect();
}

/* ------------- Bouton ← Retour ------------- */
function showPreviousSection() {
  let previous;
  while (sectionHistory.length) {
    previous = sectionHistory.pop();
    if (previous !== 'rendezvous') break;
  }
  if (previous) {
    showSection(previous, true);
  } else {
    showSection('accueil', true);
  }
}

/* ----- Confirmation simple « RDV envoyé » ---- */
function envoyerRDV(event) {
  event.preventDefault();
  const conf = document.getElementById('confirmation');
  conf.classList.add('show-confirm');
  setTimeout(() => {
    conf.classList.remove('show-confirm');
    showSection('accueil');
  }, 2500);
}

/* -------- Envoi RDV  (Firebase + cookie) ----- */
function sendRDV(event) {
  event.preventDefault();

  const nom       = document.getElementById('name').value;
  const telephone = document.getElementById('phone').value;
  const date      = document.getElementById('date').value;
  const heure     = document.getElementById('time').value;
  const service   = document.getElementById('select-service').value;
  const message   = document.getElementById('message').value;

  const rdvData = { nom, telephone, date, heure, service, message };

  push(ref(database, 'rendezvous'), rdvData)
    .then(() => console.log('RDV enregistré'))
    .catch(err => console.error('Erreur Firebase', err));

  document.cookie =
    "rdvData=" + encodeURIComponent(JSON.stringify(rdvData)) +
    "; path=/; max-age=2592000";

  envoyerRDV(event);
}

function applyCarouselEffect() {
  const carousel = document.querySelector('#accueil .carousel-centered');
  if (!carousel) return;
  const cards = carousel.querySelectorAll('.card');
  const update = () => {
    const center = carousel.scrollLeft + carousel.offsetWidth / 2;
    cards.forEach(card => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const d = (center - cardCenter) / carousel.offsetWidth;
      const scale  = 1 - Math.min(Math.abs(d) * 0.6, 0.4);
      const rotate = d * 25;
      card.style.transform = `scale(${scale}) rotateY(${rotate}deg)`;
      card.style.zIndex    = `${1000 - Math.abs(Math.round(d*100))}`;
    });
  };
  carousel.addEventListener('scroll', update);
  update();
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.accordion-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const content  = btn.nextElementSibling;
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
      content.style.display = expanded ? 'none' : 'block';
    });
  });
});

window.onload = () => {
  showSection('accueil');
  applyCarouselEffect();
};

function openAccordion(id) {
  showSection(id);
  setTimeout(() => {
    const button = document.querySelector(`#${id} .accordion-button`);
    const content = document.querySelector(`#${id} .accordion-content`);
    if (button && content) {
      button.setAttribute('aria-expanded', true);
      content.style.display = 'block';
    }
  }, 100);
}

function showDetails(titre) {
  const currentVisible = document.querySelector('section:not(.section-hidden)');
  if (currentVisible) sectionHistory.push(currentVisible.id);
  document.querySelectorAll('section, footer').forEach(s => s.classList.add('section-hidden'));
  const titreElement = document.getElementById('accordion-title');
  if (titreElement) titreElement.textContent = titre;
  document.getElementById('accordion').classList.remove('section-hidden');
}

const services = {
  fap:      { titre: "Filtre à Particules (FAP)",   description: "Le FAP filtre les particules fines issues des gaz d’échappement.", symptomes: ["Perte de puissance", "Voyant moteur allumé"], categorie: "reparations" },
  egr:      { titre: "Vanne EGR",                  description: "La vanne EGR réduit les émissions de NOx en recyclant les gaz.",       symptomes: ["Ralenti instable", "Odeur de gaz", "Moteur bruyant"], categorie: "reparations" },
  modeDegrade: { titre: "Mode dégradé",            description: "Le véhicule limite les performances pour protéger le moteur.",        symptomes: ["Vitesse limitée", "Aucune reprise", "Voyant clignotant"], categorie: "reparations" },
  // ... (ajoute les autres services ici comme avant)
};

function showRDV(serviceKey) {
  const data = services[serviceKey];
  if (!data) return;

  const current = document.querySelector('section:not(.section-hidden)');
  if (current) sectionHistory.push(current.id);
  sectionHistory.push(data.categorie.toLowerCase());

  showSection('rendezvous');
  document.querySelector('#rdv-titre').textContent = `🔧 ${data.titre}`;
  document.querySelector('#description-service').textContent = data.description;
  document.querySelector('#symptomes-service').innerHTML = data.symptomes.map(s => `<li>${s}</li>`).join('');
  document.getElementById('rdv-intro').style.display = 'block';
  document.getElementById('formulaire-rdv').style.display = 'none';
  document.getElementById('select-service').value = data.categorie;
  document.querySelector('textarea[name="message"]').value =
    `🔧 Service : ${data.titre}\n📋 Description : ${data.description}\n❗ Symptômes :\n- ${data.symptomes.join('\n- ')}`;
}

function afficherFormulaireRDV() {
  document.getElementById('rdv-intro').style.display = 'none';
  document.getElementById('formulaire-rdv').style.display = 'flex';
}

function toggleMenu() {
  const menu = document.querySelector("nav ul");
  menu.classList.toggle("show");
}

window.showSection = showSection;
window.showPreviousSection = showPreviousSection;
window.openAccordion = openAccordion;
window.showDetails = showDetails;
window.showRDV = showRDV;
window.envoyerRDV = envoyerRDV;
window.afficherFormulaireRDV = afficherFormulaireRDV;
window.toggleMenu = toggleMenu;
window.sendRDV = sendRDV;