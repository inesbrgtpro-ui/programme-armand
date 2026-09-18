# Programme d'Armand — App de suivi d'entraînement

## Contexte

Application web de suivi de musculation pour Armand, 16 ans (né le 22/03/2010).
Il s'entraîne en salle de sport et pratique aussi le VTT quasi quotidiennement
(10-20 km le soir), beaucoup de marche et de la course occasionnelle (8-10 km).

L'app est conçue et maintenue par sa grande sœur Inès, avec l'aide de Claude.

**Public cible : un ado de 16 ans.** Tout le contenu de l'app (textes, labels,
messages) doit rester simple, direct, motivant, sans jargon. Tutoiement partout.

## Objectif du produit

Donner à Armand un cadre clair pour ses séances de muscu, qu'il suivait
jusqu'ici "au feeling" en full body sans structure :

1. Checklist visuelle des exercices et des séries à faire
2. Chrono de repos automatique après chaque série cochée
3. Suivi des charges (kg) pour visualiser la progression
4. Motivation : progression de séance, compteur de séances terminées

## Philosophie du programme (important)

Format retenu : **PPL hybride sur 3 séances/semaine** — Push+Pull combiné,
Legs, puis Full body.

Pourquoi pas un PPL classique (Push / Pull / Legs sur 3 jours) : chaque muscle
ne serait travaillé qu'1x/semaine, ce qui est sous-optimal pour progresser.
Le PPL classique n'est efficace qu'à 5-6 séances/semaine, incompatible avec
son VTT quasi quotidien. Le format hybride garde la logique Push/Pull/Legs
tout en travaillant chaque muscle **2x par semaine**, avec des séances de
45-60 min.

## Le programme (contenu métier — ne pas modifier sans validation)

**Contrainte validée par Inès (2026-09-18) : protéger le dos d'Armand.**
Pas de squat barre, pas de soulevé de terre, pas de rowing barre buste penché :
les exercices dos/jambes se font sur machine ou poulie, buste soutenu ou
vertical. Séances limitées à 5 exercices.

### Séance 1 — Push + Pull (lundi)
| Exercice | Type | Séries × Reps | Repos |
|---|---|---|---|
| Développé couché haltères | Push | 4 × 8-10 | 2 min |
| Tractions (ou tirage vertical) | Pull | 4 × 6-10 | 2 min |
| Développé épaules haltères | Push | 3 × 10 | 1 min 30 |
| Rowing machine (appui poitrine) | Pull | 3 × 10-12 | 1 min 30 |
| Curl biceps | Pull | 3 × 12 | 1 min |

### Séance 2 — Legs (mercredi)
| Exercice | Séries × Reps | Repos |
|---|---|---|
| Presse à cuisses | 4 × 10-12 | 2 min |
| Fentes marchées haltères | 3 × 10/jambe | 1 min 30 |
| Leg extension (quadriceps) | 3 × 12 | 1 min |
| Leg curl (ischios) | 3 × 12 | 1 min |
| Gainage planche | 3 × 45 s | 45 s |

### Séance 3 — Full body, axe dos + abdos (vendredi ou samedi)
| Exercice | Séries × Reps | Repos |
|---|---|---|
| Tirage vertical (dos) | 3 × 10-12 | 1 min 30 |
| Développé incliné | 3 × 10 | 1 min 30 |
| Tirage horizontal (dos) | 3 × 12 | 1 min 30 |
| Relevés de jambes suspendu (abdos) | 3 × 12 | 1 min |
| Planche latérale (obliques) | 2 × 30 s/côté | 45 s |

### Règles d'entraînement (affichées dans l'app)
- Technique parfaite avant d'augmenter le poids
- Progression : toutes les séries au max des reps avec bonne technique → +2,5 kg
- Minimum 48 h entre deux séances de muscu
- Jour legs = VTT tranquille le soir
- 8-9 h de sommeil, au moins 1 jour off complet par semaine

**Point de vigilance santé (16 ans, en croissance)** : jamais d'incitation à
charger lourd, priorité à la technique et à la récupération. Toute évolution du
programme doit respecter ce principe.

## État actuel

- **v2 : PWA installable**, en ligne sur GitHub Pages :
  https://inesbrgtpro-ui.github.io/programme-armand/
  (dépôt : https://github.com/inesbrgtpro-ui/programme-armand, compte inesbrgtpro-ui).
  Installée sur l'iPhone d'Armand via Safari → Partager → "Sur l'écran d'accueil".
  Chaque `git push` sur `main` met le site à jour automatiquement.
- Fichiers : `index.html` (app complète, HTML/CSS/JS vanilla, aucune dépendance
  hors Google Fonts), `manifest.webmanifest`, `sw.js` (service worker,
  cache-first pour usage hors ligne — **incrémenter la constante `CACHE` à
  chaque mise à jour**), `icons/` (haltère orange sur fond sombre).
- Séances renommées "Push + Pull / Legs / Full body" (ids de stockage
  inchangés : `upper`, `lower`, `full`).
- Illustrations d'exercices dans `img/`, nommées par slug d'exercice
  (`img/<slug>.webp`, ex. `img/leg-extension.webp`). Images générées en IA
  (style flat, silhouette sombre + orange, deux phases du mouvement).
- Mobile-first (utilisé sur téléphone à la salle), thème clair/sombre auto
  (`prefers-color-scheme`), reduced-motion respecté, safe areas iOS gérées.
- L'ancien artifact Claude (https://claude.ai/artifact/QKaidCkE3d5w19PyzkhEuR)
  reste en ligne comme aperçu, mais la version de référence est la PWA ;
  ses données localStorage sont indépendantes (origine différente).
- Test local : serveur `python3 -m http.server 8642` (config `.claude/launch.json`).

### Fonctionnalités implémentées
- Écran d'accueil : 3 cartes de séance avec % de progression + compteur de
  séances terminées + accès "Ta progression"
- **Banque d'exercices** (46 exercices) : chaque séance est une liste de
  créneaux (label, séries, reps, repos) avec 1 à 6 exercices au choix ; bouton
  "Changer d'exercice" → sélecteur en bas d'écran (vignette, muscles, reps).
  Le premier exercice de `options` est le choix par défaut (= programme
  validé). Tout ajout à la banque doit respecter : dos protégé.
- Écran séance : cartes exercice (créneau, vignette, nom, séries×reps,
  badge repos), boutons de séries cochables, input charge en kg (la charge
  est propre à l'exercice, partagée entre séances)
- Vignette → image plein écran avec explication du mouvement (champ `how`)
- Cocher une série → chrono de repos plein écran automatique (durée propre à
  chaque créneau), boutons "+15 s" et "C'est reparti", bip (WebAudio) +
  vibration (Vibration API) à la fin
- **Journal de progression** : chaque séance terminée est enregistrée
  (date, exercices choisis, charges) ; écran "Ta progression" avec courbes
  d'évolution des charges (sparklines SVG) et journal antéchronologique
- Bannière "Séance terminée" quand tout est coché
- Reset de séance (conserve les charges et le journal)
- Persistance `localStorage` (clé `armand-programme-v1`), tout est en try/catch :
  l'app fonctionne même sans stockage

### Structure des données (localStorage, schéma v2)
```json
{
  "version": 2,
  "sessions": {
    "upper": { "checks": { "0": [true, true] }, "counted": false, "chosen": { "1": "tirage-vertical" } },
    "lower": {}, "full": {}
  },
  "weights": { "dev-couche-halteres": "22.5" },
  "history": [
    { "d": "2026-09-18", "s": "upper", "exos": [ { "k": "dev-couche-halteres", "w": "22.5" } ] }
  ],
  "completed": 4
}
```
- La banque est dans la constante `EXOS` (slug → name/muscles/how/reps?) et
  le programme dans `PROGRAM` (id, num, name, day, slots[] avec
  label/sets/reps/rest/options[]). `reps` d'un exercice remplace celui du
  créneau (ex. planche "45 s").
- Chaque exercice a son image `img/<slug>.webp` : en ajouter une lors de tout
  ajout à la banque, et l'ajouter à `PRECACHE` dans `sw.js`.
- Les ids de séance (`upper`, `lower`, `full`) et les slugs d'exercices
  servent de clés de stockage : ne pas les renommer sans migration
  (une migration v1→v2 existe déjà dans le script en exemple).

## Pistes d'évolution (backlog)

- [x] Renommer les séances en "Push + Pull / Legs / Full body" dans l'UI
      (ids de stockage conservés)
- [x] PWA : manifest + service worker pour installation écran d'accueil et
      usage hors ligne
- [x] Historique par date : log de chaque séance terminée (date, charges) pour
      visualiser la progression dans le temps
- [x] Graphique d'évolution des charges par exercice (sparklines)
- [x] Substitutions d'exercices (banque d'exercices par créneau)
- [ ] Export/import des données (changement de téléphone)
- [ ] Mode "semaine" : planning lundi/mercredi/vendredi avec rappel du jour
- [ ] Volet nutrition/récupération simple (plus tard : le projet global couvre
      aussi révisions, finance et santé)

## Conventions pour Claude Code

- Langue : tout en français, tutoiement, vocabulaire accessible à un ado de 16 ans
- Pas d'emojis dans le code ni l'UI (préférence projet)
- Rester en vanilla JS/CSS tant que possible ; pas de framework sans raison forte
- Mobile-first, gros touch targets (l'app s'utilise en pleine séance)
- Toujours conserver la rétrocompatibilité du localStorage (migrer la clé
  `armand-programme-v1` si le schéma change, ne jamais perdre les données)
- Accessibilité : focus visible, aria-labels sur les contrôles, contrastes ok
