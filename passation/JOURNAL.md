# Journal de passation — Programme d'Armand

> Écrit le 2026-11-09 pour permettre à n'importe quel assistant (ou humain) de
> reprendre le projet sans accès aux conversations précédentes. Le contexte
> produit (programme, conventions, décisions tranchées, backlog) est dans
> **CLAUDE.md** ; ce fichier contient l'historique, le mode d'emploi
> opérationnel et les leçons techniques apprises.

## 1. Résumé du projet en trois phrases

App web de suivi de musculation pour Armand (16 ans, frère d'Inès), PWA
installée sur son iPhone, hébergée sur GitHub Pages. Un seul fichier
`index.html` en vanilla JS/CSS, données en localStorage sur son téléphone,
aucune dépendance serveur. Tout le travail a été fait le 2026-09-18 en une
session (9 commits, voir `git log`).

## 2. Historique (tout a eu lieu le 2026-09-18)

1. **v1 rapatriée** depuis un artifact claude.ai (fichier unique HTML),
   séances renommées Push + Pull / Legs / Full body.
2. **Transformation en PWA** : `manifest.webmanifest`, `sw.js` (cache-first,
   usage hors ligne à la salle), icônes haltère générées, dépôt GitHub créé,
   GitHub Pages activé. Correction au passage d'un bug `[hidden]` (voir § 6).
3. **Illustrations d'exercices** générées en IA (vignette sur chaque carte,
   plein écran au tap) + **révision du programme** à la demande d'Inès :
   dos protégé (squat, soulevé de terre, rowing penché retirés), 5 exos/séance.
4. **Banque d'exercices + journal de progression** : refonte du modèle de
   données (schéma localStorage v2 avec migration v1→v2), exercices
   interchangeables par créneau, séances enregistrées par date, écran
   "Ta progression" avec sparklines SVG.
5. **Banque élargie à 46 exercices** (tous adaptés à son âge, dos protégé).
6. **Passage au format PPL + rappels** (Push lundi / Pull mercredi / Legs
   vendredi-samedi), décision validée par Inès — détail dans CLAUDE.md.
7. **Deux correctifs** : date locale (au lieu d'UTC) pour le journal, et
   bouton de remise à zéro en double appui (au lieu de `confirm()`, bloqué
   sur iOS en app installée).

Les messages de commit sont détaillés et fiables : `git log` donne le détail
exact de chaque étape.

## 3. Comptes et ressources externes

| Ressource | Détail |
|---|---|
| Dépôt GitHub | https://github.com/inesbrgtpro-ui/programme-armand (public) |
| Compte GitHub | `inesbrgtpro-ui`, authentifié sur ce Mac via `gh` CLI (keyring). Vérifier avec `gh auth status`. Inès a aussi un compte `ines-code-max`, non utilisé ici. |
| Site (prod) | https://inesbrgtpro-ui.github.io/programme-armand/ — GitHub Pages, build "legacy" depuis `main` racine. Chaque push déploie en ~30-60 s (parfois 2-3 min de cache CDN). |
| Artifact claude.ai | https://claude.ai/artifact/QKaidCkE3d5w19PyzkhEuR — copie de démo historique, liée au compte claude.ai d'Inès et mise à jour uniquement depuis une conversation Claude. **Un autre outil ne pourra pas la maintenir : l'ignorer.** La PWA est la seule référence ; au 2026-09-18 l'artifact était synchronisé (version 8). |
| Images IA | Générées via le connecteur Higgsfield/HeyGen de Claude (modèle `gpt_image_2_5`, 1 crédit/image, solde ~545 crédits au 2026-09-18, plan "ultimate"). Si ce connecteur n'est plus disponible, n'importe quel générateur d'images fait l'affaire avec le gabarit du § 5. Les PNG sources ne sont pas conservés ; seuls les WebP finaux dans `img/` existent. |

Aucune clé d'API, aucun secret, aucun backend : tout le projet tient dans ce
dossier + le dépôt GitHub.

## 4. Runbook opérationnel

### Modifier et publier
1. Éditer `index.html` (tout est dedans : CSS, données `EXOS`/`PROGRAM`, JS).
2. **Incrémenter la constante `CACHE` dans `sw.js`** (ex. `armand-v3.2.3`).
   Sans ça, les utilisateurs gardent l'ancienne version en cache.
3. Si des images sont ajoutées/supprimées : mettre à jour la liste `PRECACHE`
   dans `sw.js`.
4. Commit + `git push` sur `main` → le site se met à jour tout seul.
5. Vérifier : `curl -s -o /dev/null -w "%{http_code}" https://inesbrgtpro-ui.github.io/programme-armand/`
   (ou grep d'une chaîne nouvellement ajoutée, le CDN peut mettre ~1-3 min).

Côté Armand : la nouvelle version se télécharge en arrière-plan à la première
ouverture avec réseau et devient visible à la **deuxième** ouverture.

### Tester en local
- Serveur : `python3 -m http.server 8642` depuis la racine du dossier
  (déjà configuré dans `.claude/launch.json`, nom `app-armand`), puis
  http://localhost:8642.
- **Piège** : le service worker sert la version en cache, pas les fichiers
  modifiés. Avant chaque vérification, purger dans la console du navigateur :
  ```js
  const regs = await navigator.serviceWorker.getRegistrations();
  for (const r of regs) await r.unregister();
  for (const k of await caches.keys()) await caches.delete(k);
  localStorage.clear(); // optionnel : repartir de données vierges
  ```
  puis recharger.
- Tester en largeur mobile (~375 px) : l'app est utilisée uniquement sur téléphone.

### Garde-fous données (critiques)
- Clé localStorage : `armand-programme-v1` (le nom ne change pas, c'est le
  champ `version` interne qui évolue). Schéma v2 documenté dans CLAUDE.md.
- **Ne jamais renommer** les ids de séance (`upper`, `lower`, `full`) ni les
  slugs d'exercices : ce sont des clés de stockage. Tout changement de schéma
  passe par une migration (exemple v1→v2 présent dans `index.html`, cherché
  par `state.version < 2`).
- Rappel mapping depuis le passage en PPL : `upper` = Push, `full` = Pull,
  `lower` = Legs (historique : c'étaient "haut du corps / full body / bas du corps").
- Le reset d'une séance ne touche ni aux charges ni au journal : conserver
  ce comportement.

## 5. Pipeline des illustrations d'exercices

Chaque exercice de la banque `EXOS` a une image `img/<slug>.webp` (720 px de
large, WebP qualité 80, ~10-15 Ko). Pour en ajouter une :

1. Générer une image 3:2 avec ce gabarit de prompt (remplacer la description
   du mouvement ; il donne un style cohérent avec les 46 existantes) :

   > Illustration vectorielle flat design d'un exercice de musculation :
   > [NOM + description précise de la position et du matériel, vue de profil
   > ou de face]. Deux phases côte à côte : à gauche [position de départ],
   > à droite [position d'arrivée], fine flèche orange indiquant [la
   > trajectoire]. Style minimaliste épuré : silhouette encre très foncée
   > (#17221C), machine/équipement gris, accents orange vif (#FF4D24),
   > fond uni crème (#F2F4F1). Aucun texte, aucune lettre, aucun chiffre.

   (Exercice statique type gainage : une seule position + ligne orange
   d'alignement au lieu des deux phases.)

2. Convertir (Pillow est installé sur ce Mac) :
   ```python
   from PIL import Image
   im = Image.open("source.png").convert("RGB")
   w = 720; h = round(im.height * w / im.width)
   im.resize((w, h), Image.LANCZOS).save("img/<slug>.webp", "WEBP", quality=80)
   ```
3. Ajouter l'entrée dans `EXOS` (name, muscles, how — 2-3 phrases simples en
   tutoiement —, reps optionnel), le slug dans les `options` du bon créneau,
   et le fichier dans `PRECACHE` de `sw.js`. Incrémenter `CACHE`.

Les vignettes recadrent l'image en carré calé à gauche
(`object-position:12% 50%`) : la position de départ doit être dans le tiers
gauche de l'image.

## 6. Leçons techniques apprises (pièges réels rencontrés)

- **`confirm()`, `alert()`, `prompt()` sont bloqués** quand la PWA est
  installée sur l'écran d'accueil iOS (et dans les aperçus sandboxés) : la
  popup n'apparaît pas et `confirm()` répond `false` en silence — le bouton
  semble mort. Solution en place : confirmation par double appui (le bouton
  change de texte, se désarme après 4 s). À réutiliser pour toute confirmation.
- **`[hidden]` ne suffit pas** si une règle CSS pose un `display` sur
  l'élément : la règle auteur gagne sur le style navigateur. D'où le
  `[hidden]{display:none !important}` global en tête du CSS — ne pas le retirer.
  (Le bug était invisible du temps de l'artifact : le wrapper claude.ai
  injectait cette règle lui-même.)
- **Dates du journal en heure locale**, jamais `toISOString()` (UTC) : une
  séance finie à 0h30 heure française serait datée de la veille. Le code
  construit la date avec `getFullYear/getMonth/getDate`.
- **Service worker cache-first** : en dev il masque toutes les modifications
  (purge obligatoire, § 4) ; en prod un oubli d'incrément de `CACHE` fige
  l'app chez les utilisateurs.
- **Génération d'images par lot** : l'API image peut renvoyer un 429
  (rate limit) sur un élément du lot ; l'élément échoué se resoumet sans
  risque (l'échec de soumission est explicite).
- Les charges (`weights`) sont indexées par slug d'exercice, **globales à
  l'app** (pas par séance) : un même exercice garde sa charge partout.
- Le `sets`/`reps`/`rest` appartient au **créneau** (slot) ; un exercice peut
  seulement surcharger `reps` (champ `reps` dans `EXOS`). Tous les exercices
  d'un créneau partagent le même nombre de séries — le journal et les coches
  en dépendent.

## 7. Ce qui n'est PAS fait (état exact au 2026-11-09)

- Le backlog de CLAUDE.md fait foi. Les plus utiles ensuite, dans l'ordre que
  je recommanderais : **export/import des données** (seule protection contre
  une perte du localStorage — vol/casse/réinitialisation du téléphone, ou
  Safari qui purge le stockage d'un site non visité depuis longtemps),
  puis mode "semaine", puis suivi VTT manuel (option proposée à Inès en
  remplacement du connecteur Garmin, jamais validée explicitement).
- Aucune analytics, aucun compte utilisateur, aucune sauvegarde distante :
  c'est un choix (simplicité, gratuité, vie privée), pas un oubli.
- Il n'est pas certain qu'Armand ait déjà installé la version PPL ni saisi
  des données réelles : rien côté code ne permet de le savoir (tout est sur
  son téléphone). En cas de doute, demander à Inès avant tout changement de
  schéma de données.
