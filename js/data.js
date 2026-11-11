// Textes de l'histoire, racontée par Quenotte à la première personne.
// Les mots entre accolades sont remplacés par la configuration ({enfant}, {poupee}, {chat}, {ville}…).
// Expressions possibles du portrait : sourire, joie, surprise, chuchote, clin, triste.
window.DATA = {

  // ---------- Chapitre 0 : accueil ----------
  accueil: {
    txt: "Coucou {enfant} ! Moi, c'est {souris}, la souris des dents de lait. Cette nuit, j'ai eu besoin de toi. Viens, je vais te raconter mon voyage, depuis mon château jusqu'à ta maison.",
    expr: "joie",
    bouton: "Viens, je te raconte !",
  },

  // ---------- Chapitre 1 : six scènes ----------
  // Chaque scène : une bulle d'arrivée (intro), un élément obligatoire (ou une chaîne d'éléments)
  // avec une demande avant le toucher et une réponse après, deux éléments bonus, puis le « pont ».
  scenes: [
    {
      id: "chateau", titre: "Le château", heure: "00:45", ambiance: "chateau",
      intro: { txt: "Au fond de la forêt des Ardennes, mon château dort sous les étoiles. Dans ma boîte à trésors, il n'y a qu'une seule dent de lait : ta toute première, celle du bas. Elle est bien triste, toute seule.", expr: "triste" },
      oblig: ["lanterne"], bonus: ["feuillage", "sac"],
      elements: {
        lanterne: {
          demande: { txt: "Mais j'ai reçu un message : ta deuxième dent est tombée ! C'est la jumelle de la première. Je dois aller la chercher cette nuit. Allume ma lanterne, il fait si noir !", expr: "surprise" },
          reponse: { txt: "Merci {enfant} ! Avec ma lanterne, je vois comme en plein jour.", expr: "joie" },
        },
        feuillage: { bulle: { txt: "Hou hou ! C'est la hulotte, ma voisine. « Bon voyage, {souris} ! » qu'elle me dit.", expr: "surprise" } },
        sac: { bulle: { txt: "Regarde dans mon sac : j'ai un cadeau pour toi ! C'est un billet de 5 euros, pour te remercier de ta dent.", expr: "clin" } },
      },
      pont: { txt: "C'est parti, direction la forêt !", expr: "joie" },
    },
    {
      id: "foret", titre: "La forêt des Ardennes", heure: "01:05", ambiance: "foret",
      intro: { txt: "Me voilà dans la grande forêt. Les arbres sont si hauts qu'ils cachent la lune. Je trottine sur mes petites pattes, mais je n'y vois presque rien.", expr: "chuchote" },
      oblig: ["champignons"], bonus: ["buisson", "luciole"],
      elements: {
        champignons: {
          demande: { txt: "Tu vois ces champignons sur le chemin ? On dirait qu'ils brillent un petit peu. Touche-les, pour voir !", expr: "surprise" },
          etapes: ["Oh, il s'allume ! Un…", "Deux…", "Trois champignons !"],
          reponse: { txt: "Ils s'allument quand on les touche ! Un, deux, trois champignons… et la forêt devient toute dorée. Merci, je vois enfin le chemin !", expr: "joie" },
        },
        buisson: { bulle: { txt: "Bonsoir, petite souris ! Je suis le renard. Je veille sur la forêt pendant que tout le monde dort. Je sais où tu vas : continue tout droit, tu vas entendre l'eau.", expr: "surprise" } },
        luciole: { bulle: { txt: "Cette luciole connaît tous les raccourcis ! Elle fait des zigzags pour me montrer la route.", expr: "clin" } },
      },
      pont: { txt: "J'entends de l'eau qui coule… ça doit être la Meuse !", expr: "sourire" },
    },
    {
      id: "meuse", titre: "La Meuse", heure: "01:30", ambiance: "meuse",
      intro: { txt: "Voilà la Meuse, la grande rivière des Ardennes. Elle est large, large, large, et il n'y a pas de pont pour les souris. Comment faire ?", expr: "surprise" },
      oblig: ["billet"], bonus: ["bulles", "reflet"],
      elements: {
        billet: {
          demande: { txt: "J'ai une idée ! J'ai un billet de 5 euros pour toi, et je vais le plier pour en faire un bateau. Aide-moi : touche le billet pour le plier.", expr: "clin" },
          etapes: ["Un pli…", "Deux plis…", "Trois plis… Le bateau est prêt !"],
          reponse: { txt: "Je monte à bord et hop, je traverse ! Le bateau se balance sous la lune. Oh, quelques gouttes ont mouillé le billet. Ne t'inquiète pas, je le ferai sécher au chaud, sur ta cheminée.", expr: "joie" },
        },
        bulles: { bulle: { txt: "Splash ! Un poisson me dit bonjour. Il a l'air de bien s'amuser, lui.", expr: "surprise" } },
        reflet: { bulle: { txt: "Regarde, la lune se baigne dans la Meuse. Quand on la touche, elle fait des ronds dans l'eau !", expr: "sourire" } },
      },
      pont: { txt: "Sur l'autre rive, je vois briller les lumières de Charleville.", expr: "joie" },
    },
    {
      id: "place", titre: "La place Ducale", heure: "01:50", ambiance: "place",
      intro: { txt: "Quelle belle place ! C'est la place Ducale, avec ses grandes arcades. Je me faufile d'arcade en arcade sans faire de bruit.", expr: "sourire" },
      oblig: ["marionnettiste"], bonus: ["fenetre", "fromage"],
      elements: {
        marionnettiste: {
          demande: { txt: "Regarde là-haut : c'est le Grand Marionnettiste ! Je crois qu'il m'a vue passer. Touche-le, pour voir ce qu'il fait.", expr: "surprise" },
          reponse: { txt: "Il a vu passer une petite souris et il me fait coucou ! Il fait même danser un pantin pour moi.", expr: "joie" },
        },
        fenetre: { bulle: { txt: "Chut, un pigeon dort derrière la fenêtre. Oh, je l'ai réveillé ! Pardon, monsieur le pigeon.", expr: "chuchote" } },
        fromage: { bulle: { txt: "Pause fromage ! Avec tous ces kilomètres, j'avais bien mérité un petit morceau. Miam.", expr: "joie" } },
      },
      pont: { txt: "Le Grand Marionnettiste m'indique le chemin : tout droit jusqu'à {ville} !", expr: "sourire" },
    },
    {
      id: "aiglemont", titre: "{ville}", heure: "02:10", ambiance: "aiglemont",
      intro: { txt: "Me voici à {ville}. Toutes les maisons dorment et les volets sont fermés. Mais laquelle est la tienne ?", expr: "surprise" },
      oblig: ["girouette"], bonus: ["lampadaire", "fenetre"],
      elements: {
        girouette: {
          demande: { txt: "Tu vois la girouette, sur le toit ? Fais-la tourner, elle va me guider !", expr: "clin" },
          reponse: { txt: "Elle tourne, elle tourne… elle s'arrête. Ta maison est par là !", expr: "joie" },
        },
        lampadaire: { bulle: { txt: "Ce lampadaire grésille comme s'il ronflait. Dors bien, lampadaire !", expr: "clin" } },
        fenetre: { bulle: { txt: "Là-haut, une petite lumière : la veilleuse de ta chambre. Je vois {poupee}, bien au chaud à côté de toi.", expr: "chuchote" } },
      },
      pont: { txt: "J'y suis presque ! Il ne reste que le jardin à traverser.", expr: "sourire" },
    },
    {
      id: "pantoufle", titre: "{chat}", heure: "02:31", ambiance: "pantoufle",
      intro: { txt: "Le jardin est tout calme… Chut ! Il y a quelque chose devant la porte. Deux grands yeux brillent dans le noir. Touche-les, doucement.", expr: "chuchote" },
      oblig: ["yeux", "quenotte"], bonus: ["moustache", "porte"],
      elements: {
        yeux: {
          reponse: { txt: "C'est {chat}, le chat du voisin ! Il dort sur le seuil et il a l'oreille fine. Si je le réveille, il va miauler, et {poupee} va se réveiller. Je ne veux surtout pas ça.", expr: "surprise" },
        },
        quenotte: {
          demande: { txt: "Je sais, je sais… j'ai un plan. Touche-moi, je t'explique !", expr: "chuchote" },
          reponse: { txt: "{enfant}, j'ai besoin de toi. Quand {chat} dort, j'avance. Quand il ouvre les yeux, je m'arrête. Tu m'aides ?", expr: "sourire" },
        },
        moustache: { bulle: { txt: "Il ronronne dans son sommeil. Ses moustaches frétillent, il doit rêver de croquettes.", expr: "chuchote" } },
        porte: { bulle: { txt: "La porte grince, tout doux ! C'est par là que je vais passer, si {chat} ne se réveille pas.", expr: "chuchote" } },
      },
      pont: null,
      bouton: "Aider {souris} !",
    },
  ],

  // Petites phrases quand on découvre un bonus
  etoile: "Une étoile de découverte !",
  etoilesToutes: "Toutes les étoiles de la scène !",

  // ---------- Chapitre 2 : 1, 2, 3, soleil avec le chat ----------
  jeu: {
    intro: { txt: "Reste appuyé sur le bouton pour me faire avancer. Dès que {chat} ouvre un œil, lâche tout !", expr: "chuchote" },
    dort: ["Chut… avance !", "Il dort, vas-y doucement.", "Encore un peu…"],
    baille: ["Il bâille… attention !", "Oh oh, il remue."],
    reveille: ["Il bouge, stop !", "Ne bouge plus !"],
    vu: ["Mmh ? Ouf, il se rendort. On continue.", "Il m'a presque vue ! Je recule un peu."],
    trop: "{chat} ronfle trop fort pour entendre quoi que ce soit. Fonce !",
    gagne: { txt: "Passé ! Merci {enfant}, sans toi je serais encore devant lui. Maintenant, chut… je rentre.", expr: "joie" },
    bouton: "Voir ma caméra",
  },

  // ---------- Chapitre 3 : la caméra (Quenotte chuchote) ----------
  camera: {
    intro: { txt: "Chut… J'ai mis ma petite caméra en marche. Je suis entrée par la chatière, {chat} n'a rien entendu.", expr: "chuchote" },
    cheminee: { txt: "Voilà ta cheminée, bien éteinte. Je pose ton billet dessus : il va sécher au chaud jusqu'au matin.", expr: "chuchote" },
    chambre: { txt: "Te voilà ! Tu dors comme une marmotte. Et {poupee} dort aussi, tout contre toi.", expr: "chuchote" },
    dent: { txt: "Sous l'oreiller… la voilà, ta deuxième dent ! À la place, je glisse un petit mot pour toi.", expr: "joie" },
    fin: { txt: "Mission accomplie ! Je repars au château avec ta dent. Bonne nuit, {enfant}.", expr: "clin" },
    bouton: "Lire ma lettre",
  },

  // ---------- Chapitre 4 : la lettre ----------
  lettreIntro: { txt: "Je t'ai laissé une lettre avant de partir. Touche le cachet de cire pour l'ouvrir.", expr: "sourire" },
  lettreFin: { txt: "Lis-la bien, et va vite voir sur la cheminée !", expr: "clin" },
  lettre: [
    "Chère {enfant},",
    "Merci pour ton aide cette nuit ! Sans toi, je serais encore devant {chat}.",
    "Je suis entrée tout doucement. {poupee} dormait contre toi, et je n'ai pas fait un bruit.",
    "J'ai pris ta deuxième dent. Au château, elle a retrouvé sa jumelle. Elles ne se quittent plus !",
    "Ton billet de 5 euros a traversé la Meuse en bateau. Il sèche {lieuBillet} : va vite le chercher !",
    "Brosse bien tes dents, le matin et le soir. Les nouvelles vont pousser grandes et fortes.",
    "À la prochaine dent !",
  ],
  signature: "Bisous à moustaches, {souris}",
  heureLettre: "3 h 02",
  ps: "P.-S. J'ai laissé un bout de fromage à {chat}. Ne lui dis pas que c'est moi.",
  lireAvec: "Lis-la avec papa !",
  boutonLettre: "Mon diplôme",

  // ---------- Chapitre 5 : le diplôme ----------
  diplome: { txt: "Bravo {enfant} ! Voici ton diplôme officiel, signé de ma patte. Tu peux l'imprimer avec un grand.", expr: "joie" },
  billetTrouve: { txt: "Tu l'as trouvé ? Il est sec maintenant. Il est à toi !", expr: "joie" },

  // ---------- Chapitre secret : la 13e scène du Grand Marionnettiste ----------
  scene13: [
    "Scène treize : la nuit de la deuxième dent de {enfant}.",
    "Le chat {chat} ronfle. {enfant} a aidé la souris à passer.",
    "Les deux dents jumelles sont réunies au château.",
  ],

  // ---------- Badges du diplôme ----------
  badges: [
    { id: "detective", nom: "Détective de nuit", chapitre: 1 },
    { id: "exploratrice", nom: "Exploratrice", etoiles: 6 },
    { id: "lynx", nom: "Œil de lynx", etoiles: 12 },
    { id: "passechat", nom: "Passe-Chat", chapitre: 2 },
    { id: "hibou", nom: "Œil de hibou", chapitre: 3 },
    { id: "amie", nom: "Amie de {souris}", chapitre: 4 },
    { id: "jumelle", nom: "Dent jumelle", chapitre: 5 },
    { id: "billet", nom: "Billet trouvé", bouton: true },
    { id: "scene13", nom: "Scène 13", secret: true },
  ],
};
