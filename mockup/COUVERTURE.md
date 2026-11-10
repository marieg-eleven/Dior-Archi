# Maquette Panoptic v0.2 : couverture du cadrage Excel

Auteur : Marie Guegain, eleven. Version du 10 novembre 2026.

Référence : `20260615_AI_TRANSFORMATION-ARCHITECTURE.xlsx`, onglet « 2026 AI - AI for Transformation » (129 features).

## Couverture par priorité

| Priorité | Features | Montrées dans la maquette | Portées par le plan de livraison (pas d'écran propre) | Non couvertes |
|---|---|---|---|---|
| P1 | 49 | 40 | 9 | 0 |
| P2 | 49 | 40 | 7 | 2 |
| P3 | 26 | 6 | 2 | 18 |
| P4 | 5 | 5 | 0 | 0 |

Toutes les P1 sont couvertes. Les 9 P1 sans écran sont techniques ou de conduite du changement : hébergement, sécurité, CI/CD, monitoring, tests d'intrusion, sauvegardes, plan de communication, recette (UAT), formation. Elles sont listées dans Platform › Administration › Delivery and run.

Dans la maquette, le bouton « ID » de l'en-tête affiche sur chaque écran les numéros du backlog illustrés. L'onglet Platform › Scope from the backlog donne la liste complète, avec le statut « Shown » ou « Delivery track ».

## Ce qui a été ajouté en v0.2 pour combler les écarts

- **Administration** (7.10.1, P1) : rôles et droits (OKTA SSO, RBAC interne et externe, données financières restreintes), workflow d'approbation sans code (7.6.7), activation des workflows par zone, langue EN/FR, journal d'audit (7.9.10).
- **Tags manquants** : modèle de données Tender & SOW (1.3), couches API Coupa et Anaplan (7.1.3, 7.1.4), connecteurs SharePoint, DAM et AED, déclencheurs d'archivage et recherche dans l'archive.

## Restent à traiter

- P2 non couvertes : arborescence de contenu Brand › Zone › Project › Category (7.4.3) et affectation des équipes par projet (7.4.4).
- Recherche financière par « univers » (women, men, bags, SLG, CJ) et par fixture (7.5.3) : le client a validé ce besoin dans l'Excel. La maquette ne propose pas encore ce filtre.
- P3 : reporting avancé (report builder, envoi programmé, connecteur BI), gestion des délégations, recertification des accès, analytics d'usage.

## Données réelles intégrées (captures de l'atelier du 9 novembre)

- Les 6 ouvertures 2027 de « 2026 - ADMIN FOLLOW UP » : Melbourne Flinders Lane, Copenhagen, Los Cabos, Sanya Swire, Kuala Lumpur Pavilion, Ras Al Khaimah Wynn. Pour chacune : ID, dates, type, concept, m² et budget SOP.
- L'appel d'offres Main contract de Melbourne Flinders Lane (SOR R2) : Legend 12,54 M€ contre Redwood 12,47 M€, par lot.
- Photos des boutiques Bangkok EM Quartier et Beverly Hills Rodeo Drive, plan de Rodeo Drive, tableau surfaces et capacité de Bangkok.
- Tableaux sources (project list, concurrents, SOR) et dossier « ARCHITECTURE PHOTOS / 2025 best of ».

Les autres projets, fournisseurs et montants restent des données d'exemple.
