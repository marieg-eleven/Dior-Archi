# Dior Architecture — Plateforme panoptique

Auteur : Marie Guegain, eleven.

Plateforme digitale panoptique pour le département Architecture de Dior : source unique de vérité, budget control (Anaplan × Coupa × SOW) et tender management, puis documents, fournisseurs et catalogue.

## Étape 1 — Pistes de design (`design-proposals/`)

| Fichier | Piste | Élément 3D |
|---|---|---|
| `index.html` | Page de comparaison et recommandation | — |
| `a-montaigne.html` | A · Montaigne — éditorial ivoire | Boutique isométrique avec étiquettes KPI |
| `b-nuit.html` | B · Nuit Avenue — salle de contrôle sombre | Globe des projets 2027 |
| `c-cannage.html` | C · Cannage — SaaS gris Dior / rose / marine | Plan extrudé, heatmap budget par zone |
| `d-atelier.html` | D · Atelier — langage du plan d’architecte | Axonométrie éclatée des couches de données |
| `e-studio.html` | E · Studio — outil de gestion de travail (timeline, workflows Copilot, board) | Colonnes 3D du portefeuille |

- `data.js` : jeu de données partagé (projets 2027, appel d’offres Melbourne Flinders Lane, alertes, intégrations). Les montants engagés, réels et prévisionnels sont illustratifs.
- `screens/` : captures des maquettes.
- `standalone/` : versions autonomes (un seul fichier HTML, images et scripts intégrés), générées par `python3 build_standalone.py`.

Ouvrir `design-proposals/index.html` dans un navigateur. La 3D se fait tourner à la souris.

## Étape 2 — Maquette retenue (`mockup/`)

- `index.html` : maquette Panoptic v0.3 (à ouvrir avec le dossier `assets/`). `standalone/Dior_Architecture_Panoptic_Mockup_v0.3.html` : même maquette en un seul fichier.
- `original.html` : maquette v0.1 reçue, conservée telle quelle.
- `COUVERTURE.md` : couverture du backlog Excel (toutes les P1 et P2).
- `UX.md` : logique de navigation, création de projet, mise à jour des données, intégration aux outils actuels.
- `build/` : scripts qui produisent la v0.2 à partir de la v0.1 (police, données réelles, images, administration).
