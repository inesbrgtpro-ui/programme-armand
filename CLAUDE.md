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

Format retenu (validé par Inès le 2026-09-18, remplace l'hybride initial) :
**PPL + rappels sur 3 séances/semaine** — Push (lundi), Pull (mercredi),
Legs (vendredi ou samedi).

Un PPL classique à 3 séances/semaine ne travaille chaque muscle qu'1x/semaine.
Compromis retenu : des séances thématiques (plus simples, plus motivantes pour
un ado) mais chaque séance Push/Pull se termine par **un exercice de rappel**
de l'autre groupe (Push finit par un exo de dos, Pull par un exo de
pecs/épaules) → fréquence ~1,5x/semaine par muscle. Les jambes ne passent
qu'1x/semaine en salle, mais le VTT quasi quotidien complète largement.

## Le programme (contenu métier — ne pas modifier sans validation)

**Contrainte validée par Inès (2026-09-18) : protéger le dos d'Armand.**
Pas de squat barre, pas de soulevé de terre, pas de rowing barre buste penché :
les exercices dos/jambes se font sur machine ou poulie, buste soutenu ou
vertical. Séances limitées à 5 exercices.

Chaque créneau propose des alternatives (banque d'exercices) ; le premier
exercice listé est le choix par défaut.

### Séance 1 — Push (lundi), id `upper`
| Créneau | Défaut | Séries × Reps | Repos |
|---|---|---|---|
| Pectoraux - lourd | Développé couché haltères | 4 × 8-10 | 2 min |
| Pectoraux - incliné/écarté | Développé incliné haltères | 3 × 10 | 1 min 30 |
| Épaules | Développé épaules haltères | 3 × 10 | 1 min 30 |
| Triceps | Extensions triceps poulie | 3 × 12 | 1 min |
| Rappel dos | Tirage vertical | 3 × 10-12 | 1 min 30 |

### Séance 2 — Pull (mercredi), id `full`
| Créneau | Défaut | Séries × Reps | Repos |
|---|---|---|---|
| Dos - tirage vertical | Tractions | 4 × 6-10 | 2 min |
| Dos - tirage horizontal | Rowing machine (appui poitrine) | 3 × 10-12 | 1 min 30 |
| Arrière d'épaules / posture | Face pull | 3 × 15 | 1 min |
| Biceps | Curl biceps haltères | 3 × 12 | 1 min |
| Rappel pecs/épaules | Pompes | 3 × 10 | 1 min 30 |

### Séance 3 — Legs (vendredi ou samedi), id `lower`
| Créneau | Défaut | Séries × Reps | Repos |
|---|---|---|---|
| Cuisses - lourd | Presse à cuisses inclinée | 4 × 10-12 | 2 min |
| Cuisses - une jambe | Fentes marchées haltères | 3 × 10/jambe | 1 min 30 |
| Quadriceps | Leg extension | 3 × 12 | 1 min |
| Ischios / fessiers | Leg curl allongé | 3 × 12 | 1 min |
| Abdos | Gainage planche | 3 × 45 s | 45 s |

Attention au mapping ids ↔ séances depuis le passage en PPL : `upper` = Push,
`full` = Pull, `lower` = Legs (les ids de stockage n'ont pas bougé, seuls les
noms affichés ont changé).

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
