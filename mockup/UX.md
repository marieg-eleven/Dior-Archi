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
