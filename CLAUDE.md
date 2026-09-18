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

### Séance 1 — Push + Pull (lundi)
| Exercice | Type | Séries × Reps | Repos |
|---|---|---|---|
| Développé couché haltères | Push | 4 × 8-10 | 2 min |
| Tractions (ou tirage vertical) | Pull | 4 × 6-10 | 2 min |
| Développé épaules haltères | Push | 3 × 10 | 1 min 30 |
| Rowing barre ou machine | Pull | 3 × 10-12 | 1 min 30 |
| Curl biceps | Pull | 3 × 12 | 1 min |
| Extensions triceps | Push | 3 × 12 | 1 min |

### Séance 2 — Legs (mercredi)
| Exercice | Séries × Reps | Repos |
|---|---|---|
| Squat (barre ou goblet) | 4 × 8-10 | 2 min |
| Presse à cuisses | 3 × 10-12 | 1 min 30 |
| Fentes marchées haltères | 3 × 10/jambe | 1 min 30 |
| Leg curl (ischios) | 3 × 12 | 1 min |
| Mollets debout | 3 × 15 | 45 s |
| Gainage planche | 3 × 45 s | 45 s |

### Séance 3 — Full body (vendredi ou samedi)
| Exercice | Séries × Reps | Repos |
|---|---|---|
| Soulevé de terre roumain (léger) | 3 × 10 | 2 min |
| Développé incliné | 3 × 10 | 1 min 30 |
| Tirage horizontal | 3 × 12 | 1 min 30 |
| Élévations latérales | 3 × 15 | 45 s |
| Relevés de jambes suspendu | 3 × 12 | 1 min |

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

- **v1 : fichier unique** `programme-armand.html` (HTML/CSS/JS vanilla, aucune
  dépendance hors Google Fonts). Déjà publié en artifact Claude :
  https://claude.ai/artifact/QKaidCkE3d5w19PyzkhEuR
- Mobile-first (utilisé sur téléphone à la salle), thème clair/sombre auto
  (`prefers-color-scheme`), reduced-motion respecté.
- Note : la v1 nomme les séances "Haut du corps / Bas du corps / Full body".
  À renommer en "Push + Pull / Legs / Full body" (mêmes exercices).

### Fonctionnalités implémentées
- Écran d'accueil : 3 cartes de séance avec % de progression + compteur de
  séances terminées
- Écran séance : cartes exercice (nom, séries×reps, note technique, badge repos),
  boutons de séries cochables, input charge en kg
- Cocher une série → chrono de repos plein écran automatique (durée propre à
  chaque exercice), boutons "+15 s" et "C'est reparti", bip (WebAudio) +
  vibration (Vibration API) à la fin
- Bannière "Séance terminée" quand tout est coché
- Reset de séance (conserve les charges)
- Persistance `localStorage` (clé `armand-programme-v1`), tout est en try/catch :
  l'app fonctionne même sans stockage

### Structure des données (localStorage)
```json
{
  "sessions": {
    "upper": { "checks": { "0": [true, true] }, "weights": { "0": "22.5" }, "counted": false },
    "lower": { ... },
    "full": { ... }
  },
  "completed": 4
}
```
Le programme lui-même est dans la constante `PROGRAM` en tête du script
(id, num, name, day, exos[] avec name/sets/reps/rest/note).
Les ids de séance (`upper`, `lower`, `full`) sont utilisés comme clés de
stockage : ne pas les renommer sans migration des données.

## Pistes d'évolution (backlog)

- [ ] Renommer les séances en "Push + Pull / Legs / Full body" dans l'UI
      (garder les ids de stockage, ou migrer proprement)
- [ ] Historique par date : log de chaque séance terminée (date, charges) pour
      visualiser la progression dans le temps
- [ ] Graphique d'évolution des charges par exercice
- [ ] Export/import des données (changement de téléphone)
- [ ] PWA : manifest + service worker pour installation écran d'accueil et
      usage hors ligne
- [ ] Mode "semaine" : planning lundi/mercredi/vendredi avec rappel du jour
- [ ] Substitutions d'exercices (machine occupée → alternative proposée)
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
