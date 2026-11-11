// ============================================================
//  La nuit de la Petite Souris — CONFIGURATION
//  C'est le seul fichier à modifier pour adapter l'histoire.
// ============================================================
window.CONFIG = {

  // Adresse finale du site (GitHub Pages). Elle sert au QR code de mot.html.
  // Exemple : "https://mon-compte.github.io/nuit-2/"  (gardez la barre finale)
  url: "https://florian-gaudin.github.io/Petite-souris/",

  // Les personnages
  enfant: "Clémentine",
  poupee: "Nicolas",
  souris: "Quenotte",
  chat: "Pantoufle",
  chateau: "Château des Dents de Lait",
  ville: "Aiglemont",

  // Date de la nuit : null = calculée automatiquement au premier lancement
  // (avant midi : la nuit qui vient de finir ; après midi : la nuit qui vient), puis figée.
  // Pour forcer : "2026-11-10" (le soir du départ de la souris).
  nuit: null,

  // Les dents déjà tombées (pour le schéma de la mâchoire du bas sur le diplôme).
  // Positions possibles : "bas-centrale-gauche" ou "bas-centrale-droite"
  // (gauche/droite tels qu'on les voit sur le dessin, face à l'enfant).
  dents: [
    { numero: 1, position: "bas-centrale-gauche" },
    { numero: 2, position: "bas-centrale-droite" },
  ],

  // Où le billet (plié en bateau sur la Meuse) sèche jusqu'au matin. Le vrai billet doit être posé là,
  // sur une cheminée ÉTEINTE. La lettre et le mot sous l'oreiller donnent cet endroit.
  billet: { lieu: "sur la cheminée" },

  // Chapitre secret (toucher 3 fois le Grand Marionnettiste, une fois qu'il a fait coucou)
  secret: true,
};
