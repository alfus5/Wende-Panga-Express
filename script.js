// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBo4JVuZi5AtC1wY1TXx4Az8ckQv5QrBPI",
  authDomain: "wende-panga-express.firebaseapp.com",
  projectId: "wende-panga-express",
  storageBucket: "wende-panga-express.firebasestorage.app",
  messagingSenderId: "661266039149",
  appId: "1:661266039149:web:a6b82733096ed5217a9a64",
  measurementId: "G-0JKLWTYV81"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app); // Initialiser la base de données


// Écrire des données
database.ref('rendezvous/').push({
  client: "John Doe",
  tel: "06 00 00 00 00",
  date: "05-06-2025",
  heure: "17:30",
  service: 0,
  message: `🔧 Service : Vanne EGR
📋 Description : La vanne EGR réduit les émissions de NOx en recyclant les gaz.
❗ Symptômes :
- Ralenti instable
- Odeur de gaz
- Moteur bruyant`
});




//Fonctions site


let previousSectionId = 'accueil';

function showSection(id) {
  const currentlyVisible = document.querySelector('section:not(.section-hidden)');
  if (currentlyVisible) {
      previousSectionId = currentlyVisible.id;
  }

  // Masquer toutes les sections et le footer
  document.querySelectorAll('section, footer').forEach(s => s.classList.add('section-hidden'));

  const target = document.getElementById(id);
  if (target) {
      // Réinitialiser les champs et gérer l'affichage de l'intro/formulaire pour la section 'rendezvous'
      if (id === 'rendezvous') {
          // Réinitialisation des titres et champs pour un rendez-vous "vierge"
          document.querySelector('#rdv-titre').textContent = `Prendre Rendez-vous`; // Titre par défaut
          document.querySelector('select[name="service"]').value = "";
          document.querySelector('textarea[name="message"]').value = "";
          document.getElementById('description-service').textContent = "";
          document.getElementById('symptomes-service').innerHTML = "";

          window.isServiceRedirect = false; // Important pour indiquer qu'on n'est pas redirigé d'un service

          // *** AJOUTEZ CES LIGNES POUR GÉRER L'AFFICHAGE INITIAL DU CONTENU DU RDV ***
          document.getElementById('rdv-intro').style.display = 'block'; // Affiche l'intro par défaut
          document.getElementById('formulaire-rdv').style.display = 'none'; // Masque le formulaire par défaut
          // *************************************************************************
      }

      target.classList.remove('section-hidden');

      // Appliquer l'effet de carrousel uniquement si on est sur la page d'accueil
      if (id === 'accueil') {
          applyCarouselEffect();
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

        document.addEventListener('DOMContentLoaded', function() {
            // Code pour gérer l'interaction de l'accordéon
            document.querySelectorAll('.accordion-button').forEach(button => {
                button.addEventListener('click', () => {
                    const content = button.nextElementSibling;
                    const isExpanded = button.getAttribute('aria-expanded') === 'true';
                    button.setAttribute('aria-expanded', !isExpanded);
                    content.style.display = isExpanded ? 'none' : 'block';
                });
            });
        });

        window.onload = () => {
            showSection('accueil');
            applyCarouselEffect();
        };
function openAccordion(id) {
  // Affiche la section accordéon
  showSection(id);

  // Attend un petit délai pour que le DOM soit prêt
  setTimeout(() => {
    const button = document.querySelector(`#${id} .accordion-button`);
    const content = document.querySelector(`#${id} .accordion-content`);
    if (button && content) {
      button.setAttribute('aria-expanded', true);
      content.style.display = 'block';
    }
  }, 100); // 100ms pour laisser le temps au DOM de s’afficher
}
let lastSectionId = '';

function showDetails(titre) {
    // Sauvegarde la dernière section visible
    const currentVisible = document.querySelector('section:not(.section-hidden)');
    if (currentVisible) {
        lastSectionId = currentVisible.id;
    }

    // Masque tout
    document.querySelectorAll('section, footer').forEach(s => s.classList.add('section-hidden'));

    // Met à jour le titre
    const titreElement = document.getElementById('accordion-title');
    if (titreElement) {
        titreElement.textContent = titre;
    }

    // Affiche la section de détails
    document.getElementById('accordion').classList.remove('section-hidden');
}

function showPreviousSection() {
    if (lastSectionId) {
        showSection(lastSectionId);
    }
}
// Liste des services avec leurs données
const services = {
  fap: {
    titre: "Filtre à Particules (FAP)",
    description: "Le FAP filtre les particules fines issues des gaz d’échappement.",
    symptomes: ["Perte de puissance", "Voyant moteur allumé"],
    categorie: "Réparations"
  },
  egr: {
    titre: "Vanne EGR",
    description: "La vanne EGR réduit les émissions de NOx en recyclant les gaz.",
    symptomes: ["Ralenti instable", "Odeur de gaz", "Moteur bruyant"],
    categorie: "Réparations"
  },
  modeDegrade: {
    titre: "Mode dégradé",
    description: "Le véhicule limite les performances pour protéger le moteur.",
    symptomes: ["Vitesse limitée", "Aucune reprise", "Voyant clignotant"],
    categorie: "Réparations"
  },
  interdiction: {
    titre: "Interdiction de démarrer",
    description: "Le véhicule empêche tout démarrage pour des raisons de sécurité ou de panne critique.",
    symptomes: ["Message d'erreur", "Moteur ne se lance pas"],
    categorie: "Réparations"
  },
  puissance: {
    titre: "Perte de puissance",
    description: "Le moteur tourne mais sans puissance réelle, souvent lié à une panne électronique.",
    symptomes: ["Accélération faible", "Aucune reprise"],
    categorie: "Réparations"
  },
  startStop: {
    titre: "Système Start-Stop",
    description: "Ce système coupe le moteur à l’arrêt pour économiser du carburant.",
    symptomes: ["Le moteur ne redémarre pas", "Fonction non disponible"],
    categorie: "Électronique"
  },
  lambda: {
    titre: "Sondes Lambda / O2",
    description: "Mesure l’oxygène dans les gaz d’échappement pour optimiser la combustion.",
    symptomes: ["Consommation élevée", "Ralenti instable", "Voyant pollution"],
    categorie: "Électronique"
  },
  volets: {
    titre: "Volets d’admission",
    description: "Pièces internes qui régulent l’air entrant dans le moteur.",
    symptomes: ["Ralentissements", "Mauvaise combustion", "Voyant allumé"],
    categorie: "Électronique"
  },
  erreurs: {
    titre: "Messages d’erreurs",
    description: "Différents messages d'erreurs électroniques détectés à bord.",
    symptomes: ["Messages OBD", "Voyants multiples"],
    categorie: "Électronique"
  },
  adblue: {
    titre: "Système AdBlue",
    description: "Injection d’urée pour réduire les émissions d’oxyde d’azote.",
    symptomes: ["Message de panne AdBlue", "Refus de démarrage"],
    categorie: "Système moteur"
  },
  demarrageChaud: {
    titre: "Problème de démarrage à chaud",
    description: "Le moteur peine à redémarrer une fois chaud, dû à un capteur ou à l’injection.",
    symptomes: ["Impossible de redémarrer", "Attente longue"],
    categorie: "Système moteur"
  },
  synchro: {
    titre: "Synchronisation calculateurs",
    description: "Mise à jour ou appairage des calculateurs du véhicule.",
    symptomes: ["Voyant électronique", "Comportement instable"],
    categorie: "Système moteur"
  },
  defauts: {
    titre: "Codes & Défauts",
    description: "Lecture et suppression des codes erreurs du véhicule.",
    symptomes: ["Voyants affichés", "Messages OBD persistants"],
    categorie: "Codes & Défauts"
  },
  RDV: {
    titre: "",
    description: "",
    symptomes: ["", ""],
    categorie: ""
  }
};


// Affiche la section RDV avec les bonnes infos
function showRDV(serviceKey) {
  const data = services[serviceKey];
  if (!data) return;

  window.isServiceRedirect = true;
  showSection('rendezvous');

  // Affiche la fiche du service
  document.querySelector('#rdv-titre').textContent = `🔧 ${data.titre}`;
  document.querySelector('#description-service').textContent = data.description;
  document.querySelector('#symptomes-service').innerHTML = data.symptomes.map(s => `<li>${s}</li>`).join('');

  // Masque le formulaire pour l'instant
  document.getElementById('rdv-intro').style.display = 'block';
  document.getElementById('formulaire-rdv').style.display = 'none';

  // Prépare les champs du formulaire
  document.getElementById('select-service').value = data.categorie;
  document.querySelector('textarea[name="message"]').value =
    `🔧 Service : ${data.titre}\n📋 Description : ${data.description}\n❗ Symptômes :\n- ${data.symptomes.join('\n- ')}`;
}
function afficherFormulaireRDV() {
  document.getElementById('rdv-intro').style.display = 'none';
  document.getElementById('formulaire-rdv').style.display = 'flex';
}




//FIREBASE

// Écrire des données
database.ref('rendezvous/').push({
  client: "John Doe",
  tel: "06 00 00 00 00",
  date: "05-06-2025",
  heure: "17:30",
  service: 0,
  message: `🔧 Service : Vanne EGR
📋 Description : La vanne EGR réduit les émissions de NOx en recyclant les gaz.
❗ Symptômes :
- Ralenti instable
- Odeur de gaz
- Moteur bruyant`
});
