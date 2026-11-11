# La nuit de la Petite Souris

Une petite expérience web (site statique, sans compte, sans suivi) qui raconte la visite de Quenotte, la Petite Souris, pendant la nuit : suivi sur la carte, mini-jeu avec le chat, caméra de la souris, lettre à écouter, diplôme à imprimer.

## Les fichiers

| Fichier | Rôle |
|---|---|
| `config.js` | **Le seul fichier à modifier** : adresse du site (QR code), prénoms, dents, billet, voix. |
| `index.html` | L'histoire en 6 écrans (accueil + 5 chapitres). |
| `mot.html` | Le mot de la souris avec le QR code, à afficher en plein écran sur l'ordinateur (ou à imprimer en A6). |
| `certificat.html` | Le diplôme, mis en page pour une impression A4. |
| `js/data.js` | Tous les textes : journal de bord, lettre, badges, chapitre secret. |
| `js/art.js` | Les dessins (SVG faits maison). |
| `css/`, `fonts/`, `vendor/` | Styles, polices embarquées (licence OFL), générateur de QR code (MIT). |
| `outils/serveur.js` | Mini serveur pour tester sur l'ordinateur. |

## Mettre en ligne sur GitHub Pages

Le dépôt prévu est `https://github.com/Florian-Gaudin/Petite-souris.git`, donc l'adresse du site sera **https://florian-gaudin.github.io/Petite-souris/** (déjà renseignée dans `config.js`).

1. Dans ce dossier, dans un terminal :
   ```
   git init
   git add .
   git commit -m "La nuit de la Petite Souris"
   git branch -M main
   git remote add origin https://github.com/Florian-Gaudin/Petite-souris.git
   git push -u origin main
   ```
   (Si le dépôt est déjà initialisé, seules les trois dernières lignes manquent.)
2. Sur github.com, ouvrir le dépôt → **Settings** → **Pages** → « Build and deployment » : Source = *Deploy from a branch*, Branch = **main** et dossier **/ (root)** → **Save**.
3. Attendre une à deux minutes. Le site est à l'adresse ci-dessus. Le dépôt doit être **public** pour que GitHub Pages gratuit fonctionne.
4. Ouvrir l'adresse sur le téléphone pour vérifier, puis ouvrir `https://florian-gaudin.github.io/Petite-souris/mot.html` sur l'ordinateur : le QR code pointe vers le site.

Pour mettre à jour le site plus tard : modifier les fichiers, puis `git add . && git commit -m "mise à jour" && git push`.

## Tester sur l'ordinateur

- Avec Node.js : `node outils/serveur.js` puis ouvrir http://localhost:8765/ (les polices ne se chargent pas toujours quand on ouvre `index.html` directement depuis l'explorateur).
- Avec XAMPP : démarrer Apache et ouvrir http://localhost/CESI/Petite%20souris/ .
- Pour simuler une tablette ou un téléphone : dans Chrome ou Edge, F12 puis l'icône « appareil » (largeurs 768 et 390 testées).

## Réinitialiser et sauter des chapitres

- Lien discret **« Recommencer »** en bas à droite de l'écran d'accueil : efface la progression, les badges et la date mémorisée.
- Dans l'adresse : `index.html?reset=1` fait la même chose.
- `index.html?chapitre=3` débloque et ouvre directement le chapitre 3 (de 0 à 5), pratique pour tester.
- Les perles du ruban rouge en haut permettent de revoir un chapitre déjà débloqué.
- La progression est mémorisée **dans le navigateur de l'appareil** (localStorage). La tablette et l'ordinateur ont donc chacun leur progression.

## Changer l'adresse du QR code

Modifier la ligne `url` dans `config.js`, enregistrer, puis recharger `mot.html` : le QR code est regénéré sur place, hors ligne. Si l'adresse contient encore `VOTRE-COMPTE`, un bandeau rouge le signale.

## La date de la nuit

Elle est calculée au premier lancement sur l'appareil (avant midi : la nuit qui vient de finir ; après midi : la nuit qui vient), puis figée dans la mémoire du navigateur. Pour la forcer, écrire par exemple `nuit: "2026-11-10"` (le soir du départ) dans `config.js`. Le lien « Recommencer » recalcule la date.

## Le matin

1. Sur l'ordinateur, ouvrir `mot.html` (en ligne ou en local), bouton « Plein écran ».
2. Clémentine scanne le QR code avec l'appareil photo de la tablette (iPad : l'appareil photo reconnaît les QR codes ; Android : appareil photo ou Google Lens).
3. Le son ne démarre qu'après son premier toucher sur « Allumer la lanterne ». Le bouton haut-parleur en haut à droite coupe ou remet le son ; « Écouter » lit les textes à voix haute (voix française de la tablette).
4. À la fin, « Imprimer le diplôme » ouvre `certificat.html` avec les badges gagnés. Depuis l'ordinateur, ouvrir `certificat.html` affiche le diplôme avec tous les badges (ajouter `?secret=1` si elle a trouvé la 13e scène).

Le billet plié en bateau est posé sur la cheminée : la caméra montre Quenotte qui l'y dépose « pour qu'il sèche », et la lettre l'envoie le chercher.

## Chapitre secret

Sur la carte (chapitre 1), toucher trois fois le Grand Marionnettiste ouvre la 13e scène. Pour le désactiver : `secret: false` dans `config.js`.

## Les prochaines dents

1. Dans `config.js`, ajouter la nouvelle dent dans `dents` (position `bas-centrale-gauche` ou `bas-centrale-droite` pour l'instant ; d'autres positions peuvent être ajoutées dans `js/certificat.js`, fonction `machoireSVG`).
2. Changer si besoin le lieu du billet (`billet.lieu`) ou désactiver le bateau (`billet.bateau: false`).
3. Adapter quelques statuts du journal de bord et la lettre dans `js/data.js`.
4. Sur la tablette, utiliser « Recommencer » pour repartir du début avec la nouvelle date.

## Accessibilité et confidentialité

- `prefers-reduced-motion` est respecté : sans animations, la souris saute d'étape en étape et la vidéo s'affiche sans scintillement.
- Aucun service tiers : polices, sons (fabriqués en code) et QR code sont embarqués. Aucun cookie, aucune statistique.
- Le site est public sur GitHub Pages : il ne contient que le prénom de l'enfant et le nom du village. Les pages demandent aux moteurs de recherche de ne pas les indexer (`noindex`).
