# La nuit de la Petite Souris

Une petite expérience web (site statique, sans compte, sans suivi) racontée à la première personne par Quenotte, la Petite Souris : six scènes illustrées de son voyage nocturne (château, forêt, Meuse, place Ducale, Aiglemont, le chat Pantoufle), un mini-jeu avec le chat, la caméra de la souris, une lettre qui s'écrit mot à mot, et un diplôme à imprimer.

## Les fichiers

| Fichier | Rôle |
|---|---|
| `config.js` | **Le seul fichier à modifier** : adresse du site (QR code), prénoms, dents, endroit où sèche le billet. |
| `index.html` | L'histoire : accueil, puis 5 chapitres. |
| `mot.html` | Le mot de la souris avec le QR code, à glisser sous l'oreiller (impression A6) ou à afficher en plein écran. Il dit où chercher le cadeau. |
| `certificat.html` | Le diplôme, mis en page pour une impression A4. |
| `js/data.js` | Tous les textes de Quenotte : scènes, mini-jeu, caméra, lettre, badges. |
| `js/decors.js` | Les six décors illustrés du chapitre 1 (SVG faits maison) et leurs éléments à toucher. |
| `js/scenes.js` | Le déroulé des scènes : élément obligatoire, bonus, étoiles, main qui montre, « Continuer ». |
| `js/narration.js` | Le bandeau de lecture en bas de l'écran (portrait, expressions, texte par groupes de mots). |
| `js/musique.js` | La musique d'ambiance générée en code (boîte à musique, une variation par chapitre). |
| `js/audio.js` | Les effets sonores générés en code. |
| `js/art.js` | Symboles, icônes, portrait de Quenotte, décors des autres chapitres. |
| `js/app.js` | Les chapitres, la progression, le fil rouge. |
| `css/`, `fonts/`, `vendor/` | Styles, polices embarquées (licence OFL), générateur de QR code (MIT). |
| `outils/serveur.js` | Mini serveur pour tester sur l'ordinateur. |

## Comment ça se joue

- **Chapitre 1, six scènes.** Dans chaque scène, un élément brille fort : c'est l'élément obligatoire (lanterne, champignons, billet à plier en trois touches, Grand Marionnettiste, girouette, Pantoufle). Le toucher débloque « Continuer ». Deux autres éléments scintillent doucement : ce sont les bonus (hulotte, sac, renard, luciole, poisson, reflet de la lune, pigeon, fromage, lampadaire, fenêtre de la chambre, pot de fleurs, fenêtre du salon). Chaque bonus donne une **étoile découverte** ; 6 étoiles donnent le badge Exploratrice, 12 le badge Œil de lynx.
- Les deux secrets de chaque image sont signalés par une petite étoile qui clignote et un compteur « ★ 0/2 » en haut à droite de l'image. Quenotte l'explique une fois, à la première scène. Un secret n'est accepté que lorsque Quenotte a fini sa phrase, et le bouton Continuer disparaît le temps du secret pour ne pas changer de scène par erreur.
- Après 4 secondes sans toucher, une petite main montre l'élément obligatoire ; après 8 secondes, le halo grossit. Un toucher à côté fait juste bouger la scène.
- **Narration.** Quenotte parle dans le bandeau du bas, de hauteur fixe pour que l'image reste entière à l'écran (un texte trop long défile dans le cadre). Le texte apparaît par petits groupes de mots ; un toucher sur le texte l'affiche d'un coup. Seul le bouton jaune **« Suite ▸ »** passe au texte suivant : rien n'avance tout seul.
- **Son.** La musique démarre au premier toucher. Le bouton haut-parleur coupe musique et effets.
- **Billet.** Dans l'histoire, le billet de 5 € sert de bateau sur la Meuse puis sèche sur la cheminée (éteinte !) : c'est là qu'il faut poser le vrai billet. Le mot A6 sous l'oreiller et la lettre indiquent cet endroit. Sur le diplôme, un bouton « J'ai trouvé mon billet ! » donne le badge correspondant.
- **Chapitre secret.** Une fois que le Grand Marionnettiste a fait coucou, le toucher trois fois de suite ouvre la 13e scène.

## Mettre en ligne sur GitHub Pages

Le dépôt prévu est `https://github.com/Florian-Gaudin/Petite-souris.git`, donc l'adresse du site sera **https://florian-gaudin.github.io/Petite-souris/** (déjà renseignée dans `config.js`).

1. Dans ce dossier, dans un terminal :
   ```
   git add .
   git commit -m "mise à jour"
   git push
   ```
   (Première fois : `git remote add origin https://github.com/Florian-Gaudin/Petite-souris.git` puis `git push -u origin main`.)
2. Sur github.com, ouvrir le dépôt → **Settings** → **Pages** → « Build and deployment » : Source = *Deploy from a branch*, Branch = **main** et dossier **/ (root)** → **Save**.
3. Attendre une à deux minutes. Le site est à l'adresse ci-dessus. Le dépôt doit être **public** pour que GitHub Pages gratuit fonctionne.
4. Ouvrir l'adresse sur la tablette pour vérifier, puis imprimer `mot.html` en A6 (ou l'afficher sur l'ordinateur) : le QR code pointe vers le site.

## Tester sur l'ordinateur

- Avec Node.js : `node outils/serveur.js` puis ouvrir http://localhost:8765/ (les polices ne se chargent pas toujours quand on ouvre `index.html` directement depuis l'explorateur).
- Avec XAMPP : démarrer Apache et ouvrir http://localhost/CESI/Petite%20souris/ .
- Pour simuler une tablette ou un téléphone : dans Chrome ou Edge, F12 puis l'icône « appareil » (largeurs 768 et 390 testées).

## Réinitialiser et sauter des chapitres

- Lien discret **« Recommencer »** en bas à droite de l'écran d'accueil : efface la progression, les étoiles, les badges et la date mémorisée.
- Dans l'adresse : `index.html?reset=1` fait la même chose.
- `index.html?chapitre=3` débloque et ouvre directement le chapitre 3 (de 0 à 5).
- `index.html?chapitre=1&scene=4` ouvre directement la scène 4 du voyage (de 0 à 5).
- `index.html?chapitre=3&t=20` avance de 20 secondes dans la caméra.
- Les perles du ruban rouge en haut permettent de revoir un chapitre déjà débloqué ; les pastilles sous le ruban permettent de revoir une scène déjà vue.
- La progression est mémorisée **dans le navigateur de l'appareil** (localStorage). La tablette et l'ordinateur ont donc chacun leur progression.
