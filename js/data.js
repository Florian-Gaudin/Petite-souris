// Textes de l'histoire. Les mots entre accolades sont remplacés par la configuration.
window.DATA = {

  // Journal de bord du chapitre 1. f = position sur le trajet (0 = château, 1 = devant la maison).
  statuts: [
    { t: "01:12", f: 0.00, txt: "Départ du {chateau}. Lanterne allumée, sac vide. C'est parti !" },
    { t: "01:19", f: 0.09, txt: "Les quatre chevaliers de pierre m'ont dit « Bonne route ! ». Ils ne parlent que la nuit." },
    { t: "01:27", f: 0.18, txt: "Coucou aux nutons dans leur grotte. Ils réparaient une chaussure." },
    { t: "01:38", f: 0.28, txt: "Taxi sanglier ! Grognon m'emmène à travers la forêt. Ça sent fort, mais c'est rapide." },
    { t: "01:48", f: 0.38, txt: "Pause fromage. Du Rocroi ! Il sent TRÈS fort. Pardon." },
    { t: "02:03", f: 0.50, txt: "Charleville, place Ducale : 27 maisons jumelles. J'ai compté deux fois." },
    { t: "02:10", f: 0.60, txt: "Le Grand Marionnettiste dort. Le jour, il joue 12 histoires. Je lui chuchote la 13e : la tienne.", tts: "Le Grand Marionnettiste dort. Le jour, il joue douze histoires. Je lui chuchote la treizième : la tienne." },
    { t: "02:20", f: 0.74, txt: "Je traverse la Meuse devant le vieux moulin, sur ton billet de 5 € plié en bateau. Il flotte très bien !", tts: "Je traverse la Meuse devant le vieux moulin, sur ton billet de cinq euros plié en bateau. Il flotte très bien !" },
    { t: "02:26", f: 0.88, txt: "{ville}, ça MONTE ! Du givre sur l'herbe, les pattes gelées." },
    { t: "02:31", f: 1.00, txt: "ALERTE ! {chat}, le chat du voisin, dort en travers du chemin. {enfant}, aide-moi !", alerte: true },
  ],

  // Phrases du chapitre 2
  jeu: {
    consigne: "Reste appuyé pour avancer. Lâche quand {chat} ouvre un œil !",
    vu: "Mmh ?",
    gagne: "Passé ! Merci {enfant} !",
    trop: "{chat} ronfle trop fort pour entendre quoi que ce soit.",
  },

  // Lettre du chapitre 4 (une phrase par ligne, vocabulaire CE1)
  lettre: [
    "Chère {enfant},",
    "Merci ! Sans toi, je serais encore devant le chat {chat}.",
    "Je suis entrée tout doucement. {poupee} dormait à côté de toi. Il a ronflé un petit peu. Chut !",
    "J'ai pris ta dent. Elle va retrouver sa jumelle, ta première dent, au château. Elles sont ensemble maintenant.",
    "{ligneBillet}",
    "Brosse bien tes dents, le matin et le soir. Les nouvelles vont pousser grandes et fortes.",
    "À la prochaine dent !",
  ],
  ligneBilletBateau: "Pour toi, j'ai laissé un billet de 5 euros. Il m'a servi de bateau sur la Meuse ! Je l'ai posé {lieuBillet} pour qu'il sèche. Va voir, et déplie-le doucement.",
  ligneBilletSimple: "Pour toi, j'ai laissé un billet de 5 euros {lieuBillet}. Un billet, c'est rare ! C'est parce que tu m'as aidée.",
  signature: "Bisous à moustaches, {souris}",
  heureLettre: "3 h 02",
  heureLettreTts: "Il est trois heures deux.",
  ps: "P.-S. La caméra dit « 99 % ». Et le 1 % qui reste ?!",

  // Chapitre secret : la 13e scène du Grand Marionnettiste
  scene13: [
    "Scène treize : la nuit de la deuxième dent de {enfant}.",
    "Le chat {chat} ronfle. {enfant} a aidé la souris à passer.",
    "Les deux dents jumelles sont réunies au château.",
  ],

  // Badges
  badges: [
    { id: "detective", nom: "Détective de nuit", chapitre: 1 },
    { id: "passechat", nom: "Passe-Chat", chapitre: 2 },
    { id: "hibou", nom: "Œil de hibou", chapitre: 3 },
    { id: "amie", nom: "Amie de {souris}", chapitre: 4 },
    { id: "jumelle", nom: "Dent jumelle", chapitre: 5 },
    { id: "scene13", nom: "Scène 13", secret: true },
  ],

  // Textes lus par le bouton Écouter
  ecouter: {
    0: ["{enfant}, quelqu'un est venu cette nuit…", "Touche le bouton pour allumer la lanterne."],
    2: ["Chut ! {chat} dort.", "Reste appuyé sur le bouton pour avancer. Lâche-le quand {chat} ouvre un œil !"],
    3: ["C'est la caméra de {souris}. Elle a tout filmé pour toi.", "Regarde bien : la dent, le bateau, et {poupee} qui dort."],
    5: ["Bravo {enfant} !", "Voici ton certificat officiel de dent de lait perdue, signé par {souris}.", "Tu peux l'imprimer avec un grand."],
  },
};
