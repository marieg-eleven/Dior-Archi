# Maquette Panoptic v0.3 : logique de navigation et usage au quotidien

Auteur : Marie Guegain, eleven. Version du 10 novembre 2026.

## 1. Ce qui n'allait pas dans la v0.2

- **Accueil :** c'était un écran de présentation (grand titre et modèle 3D), sans les actions qui attendent l'utilisateur. Or on ouvre l'outil pour savoir quoi faire.
- **Deux logiques mélangées dans le menu :** des objets transverses (Tenders, Suppliers, Assets) et un « Platform » qui mélangeait administration et périmètre du backlog. Le backlog est un outil de cadrage, pas une fonction du produit.
- **Libellés flous :** « Assets » contenait des documents, « Materials & assets » des matériaux. On ne savait pas où chercher un fichier.
- **Onglets projet :** leur ordre ne suivait pas le travail réel. Rien n'y indiquait qui tient la donnée, ni où sont les fichiers.
- **Cycle de vie absent :** rien pour créer un projet, rien pour garder les données à jour, rien sur le lien avec Excel, SharePoint, Outlook ou Teams.

## 2. Nouvelle organisation

| Menu | Rôle | Pour qui |
|---|---|---|
| Home | « My work » : approbations, vérifications et mises à jour du rôle, avec échéance. Ensuite les KPI, les alertes et les échéances d'appels d'offres. | Tous |
| Projects | Le registre des projets. Il remplace la liste ADMIN FOLLOW UP, avec import et export Excel et le bouton « New project ». | Project managers, Store Planning |
| Cost control | Vue d'ensemble du portefeuille, et recherche par univers, type de mobilier et concept de façade. | Finance, Cost control |
| Tenders | Les appels d'offres de tous les projets, du brouillon à l'attribution. | Procurement |
| Suppliers | Fiches, indicateurs, contrats. | Procurement, Legal |
| Documents | Tous les fichiers indexés (ancien « Assets »). | Tous |
| Library | Matériaux, mobilier, façades, design books, boutiques de référence avec photos. | Concept Design, R&D |
| Admin | Your tools, Data health, Integrations, Roles & workflows, Backlog coverage. | IT, administrateurs, comité de pilotage |

S'ajoutent un bouton **« + New »** permanent (projet, appel d'offres depuis un SOW, documents, demande de modification budgétaire) et la barre « Search or ask ».

**Les onglets d'un projet suivent le travail :** Overview, Budget & costs, Tenders, Suppliers, Drawings & documents, Design & materials, Team & data.

## 3. Ajouter un projet

Le bouton **New project** ouvre un parcours guidé en 5 étapes :
1. **Point de départ :** un code projet Anaplan (identité et budget SOP repris et synchronisés), une ligne du fichier ADMIN FOLLOW UP, ou une page vierge.
2. **Programme :** zone, type, boutique, concept, dates, m², univers présents.
3. **Budget :** budget SOP et modèle de lignes, créées ensuite dans Anaplan.
4. **Équipe :** les accès viennent des groupes OKTA ; les externes ont une date d'expiration.
5. **Espace de travail créé automatiquement :** site SharePoint et dossier S: avec la même arborescence (01 Brief à 05 Handover), espace sur le serveur de plans, canal Teams, code projet Coupa, album DAM, ligne dans l'export Excel.

**Import from Excel** lit le fichier ADMIN FOLLOW UP tel qu'il est tenu aujourd'hui. Il compare chaque ligne au registre : identique, à créer ou à vérifier. Un budget différent d'Anaplan est signalé à la Finance, jamais écrasé.

## 4. Garder les données à jour

- **Un propriétaire et une source par bloc de données.** C'est l'onglet « Team & data » du projet : fiche projet, budget (Anaplan), commandes (Coupa), appels d'offres, plans, documents, photos, contrats.
- **Des seuils de fraîcheur :** 30 jours pour la fiche projet, 7 pour le budget. Au-delà, Panoptic demande au propriétaire de confirmer, dans Teams. S'il n'y a pas de changement, un clic suffit.
- **Admin › Data health :** un score par projet (champs manquants, fiche ancienne, fichiers non classés, factures non rapprochées) et l'envoi groupé des demandes de confirmation.
- **Des règles sans code :** nouvelle révision de plan, PO sans ligne budgétaire, attribution d'un appel d'offres, fichier déposé, ouverture à moins de 60 jours.

## 5. Travailler avec les outils actuels

Admin › Your tools précise, pour chaque outil, ce qui reste et ce qui change.

- **Anaplan, Coupa, Diorlex :** ils restent les systèmes de référence. Panoptic lit leurs données et renvoie l'engagé et les PO ; rien n'est saisi deux fois.
- **SharePoint, S: et serveur de plans :** les fichiers restent où ils sont. Panoptic les indexe, les classe et pointe vers eux. AutoCAD ne change pas.
- **Outlook :** chaque appel d'offres a sa boîte mail. Les offres reçues y sont classées et lues automatiquement.
- **Teams :** alertes, approbations et demandes de mise à jour arrivent dans Teams et s'y traitent.
- **Excel :** export au format ADMIN FOLLOW UP, puis réimport avec revue des changements. Les montants budgétaires restent en lecture seule.
- **Power BI :** connecteur sécurisé.

## 6. Autres changements de la v0.3

- **Melbourne Flinders Lane :** le prévisionnel suit maintenant la meilleure offre du marché principal. Redwood est à 12,47 M€, soit 523 k€ au-dessus de la référence, à cause du lot MEP. Le projet passe à 14,94 M€ (+3,0 % sur le budget SOP), avec une alerte et une modification budgétaire à approuver.
- **Recherche par univers (7.5.3) :** dans Cost control, filtres Women RTW, Bags, SLG, Shoes, CJ, Fine Jewellery, Men et Maison, croisés avec le type de mobilier et le concept de façade. On obtient la dépense par univers, le coût unitaire de référence par mobilier et univers, et les lignes de coût reliées au budget.

La répartition par univers et les prix unitaires sont des données d'exemple. Pour les remplacer, il faudra les lignes des SOR, qui sont déjà découpées par lot.


## 7. v1.2 : interface SaaS et règles de design

Inspirée des logiciels du marché (Mastt pour les maîtres d'ouvrage), avec des règles explicites pour rester simple et éviter l'effet « généré par IA ».

**Structure**
- Navigation latérale fixe : Home, Projects, Cost control, Tenders, Suppliers, Documents, Library, puis Admin en bas. Le nombre de tâches en attente s'affiche à côté de Home.
- En haut, une barre opaque : où l'on est, recherche et Copilot, bouton « + New », cloche « My work », rôle.
- Un seul type de page par écran :

| Écran | Type de page |
|---|---|
| Home | Tableau de bord, sans filtres |
| Projects, Documents | Liste |
| Projet | Fiche détail |
| Cost control | Analyse à onglets : Overview, Budgets (projet › ligne Anaplan › commande Coupa), Variations, Cash flow, Payments, Search by univers |
| Tenders | Tableau par étape |
| Admin | Paramètres |

**Règles visuelles**
- **Couleurs :** fond neutre, cartes blanches à liseré fin, navigation sombre. Une seule couleur d'action, l'encre. L'or et le vert, orange, rouge sont réservés aux données et aux états.
- **Typographie :** Figtree en trois graisses (400, 500, 600), aucun texte sous 12 px, cellules de tableau en 14 px. Bodoni seulement pour les titres de page.
- **Ce qui a été retiré :** le flou de la barre du haut, le dégradé arc-en-ciel du Copilot, les pastilles décoratives autour des métadonnées (sources, villes), qui deviennent du texte simple.
- **Indicateurs d'état :** vert, orange ou rouge pour le coût, le délai et les données ; « AI ready » sur les documents lisibles par l'IA.
- **Petits écrans :** la navigation passe dans un tiroir sous 960 px, sans défilement horizontal à 390 px.


## 8. v1.3 : la 3D revient, un tableau de bord plus visuel, le mobile

- **3D sur le tableau de bord, au choix :**
  - **World :** un globe façon porcelaine (ivoire, continents en pointillés d'encre, méridiens or). Les projets y sont épinglés selon leur santé, avec une onde pour ceux à surveiller, et reliés à Paris par des arcs dorés. On le fait tourner au doigt ou à la souris ; un clic ouvre le projet.
  - **Platform :** la maquette 3D des six pôles autour du socle de données. Un clic sur un pôle ouvre la partie correspondante de la plateforme.
- **Santé par zone :** à côté du globe, la santé de chaque projet regroupée par zone, avec sa date d'ouverture.
- **Indicateurs lisibles d'un coup d'œil :** répartition par étape, engagé et payé en barres, prévisionnel final avec le budget marqué en rouge.
- **Projets reconnaissables :** chaque ligne du tableau porte une vignette de sa façade.
- **Dates :** affichées en gros, façon calendrier.
- **Sous-titres :** les descriptions sous les titres sont masquées. Elles réapparaissent avec le bouton « ID », en mode cadrage.
- **Mobile :** aucune page ne déborde à 390 px.
  - Navigation en tiroir avec fond assombri, recherche en icône.
  - Colonnes secondaires masquées, grilles en une colonne, onglets qui défilent.
  - Fenêtres en plein écran, globe redimensionné.
