# Benchmark Mastt et apports à Panoptic (v1.1)

Auteur : Marie Guegain, eleven. 12 novembre 2026.

Source : les descriptions publiques de Mastt (pages produit et cas d'usage indexées, fiches GetApp, G2, Crozdesk, TrustRadius). Le site mastt.com n'était pas accessible depuis l'environnement de travail : aucune démonstration n'a été vue, et les chiffres de gain annoncés par Mastt sont des affirmations commerciales.

## 1. Ce qu'est Mastt

Un logiciel de pilotage de projets d'investissement côté maître d'ouvrage : propriétaires, assistants à maîtrise d'ouvrage, consultants. Il ne s'adresse pas aux entreprises de travaux. C'est le même point de vue que Dior Architecture.

| Brique | Ce que fait Mastt |
|---|---|
| Coûts | Budget, engagements (contrats), avenants approuvés et en attente, prévisionnel final (EAC, forecast final cost), payé à date, écarts |
| Contrats et paiements | Contrats, avenants (variations), situations de travaux, certificats de paiement |
| Trésorerie | Prévision mensuelle des paiements par projet, programme ou portefeuille |
| Programme | Tableau de bord portefeuille : coût, planning, risques, santé de chaque projet |
| Planning | Phases, jalons, import MS Project et Primavera P6 |
| Risques | Registre (cause, impact, traitement, responsable), matrice probabilité × impact |
| Documents | Rattachés aux contrats, paiements, risques ; droits, piste d'audit |
| Reporting | Tableaux de bord personnalisables, partage en lecture seule, figeage des rapports (snapshots) |
| IA | Saisie assistée (extraction des contrats et factures), revue des paiements contre le contrat avec source de chaque chiffre, assistant conversationnel, génération de modèles de rapports (Template Studio) |

## 2. Ce que nous reprenons, et pourquoi

| Standard Mastt | Dans Panoptic v1.1 | Lien avec l'Excel |
|---|---|---|
| Prévisionnel final (EAC) : engagé + avenants en attente + reste à faire, comparé au budget | Onglet Budget & costs, bloc « Cost position » : budget initial, modifications approuvées, budget actuel, engagé, avenants en attente, prévisionnel final, écart, payé | 1.5, 2.1, 2.6, 7.7.5 |
| Avenants séparés : en attente dans le prévisionnel, pas dans l'engagé | Liste « Variations » par projet, approbation ou refus par le contrôleur, tracés au journal | 2.6, 2.8, 7.6.2 |
| Prévision de trésorerie mensuelle | Courbe cumulée par projet (prévu au budget, payé, reste à payer) ; barres mensuelles du portefeuille et total des 12 prochains mois | 2.7 (« add payments info, cash flows? ») |
| Santé du projet | Indicateur vert / orange / rouge sur trois axes : coût, planning (avancement contre temps écoulé), fraîcheur des données | 7.7.1, 7.7.5 |
| Figeage des rapports | « Since the last report » : les chiffres du mois sont figés ; le rapport suivant montre ce qui a bougé et pourquoi | 2.8, 7.7.7 |
| IA avec source et validation humaine | Chaque montant d'offre ouvre sa source (fichier, onglet, cellule : SOR R2, cellule K129 pour le MEP de Legend) ; un acheteur coche « vérifié » | 3.5, 2.4 |
| Revue des factures par l'IA | « Check » sur les factures Coupa à rapprocher : contrôles (fournisseur, PO, retenue, taux du contrat, pièces manquantes) et champs lus avec leur emplacement | 2.3, 7.9.2 |

## 3. Ce que nous ne reprenons pas, ou plus tard

- **Registre des risques :** utile mais absent de l'Excel. À proposer en phase 2, branché sur les alertes marché évoquées en atelier (variation des prix matières).
- **Planning détaillé (P6, MS Project) :** hors périmètre. Panoptic garde les jalons (engagement, ouverture) et l'avancement.
- **Générateur de rapports par IA :** la note de pilotage et le Copilot couvrent le besoin. Le générateur de modèles est en P3 dans l'Excel (7.7.6).
- **Situations de travaux et certificats de paiement :** chez Dior, les paiements passent par Coupa. Panoptic lit et rapproche, sans recréer le circuit de paiement.
- **Navigation latérale par module :** nous gardons une barre supérieure à 8 entrées, plus lisible pour des profils non financiers.

## 4. Points à valider avec le client

- La définition du prévisionnel final et des avenants doit coller au vocabulaire Finance de Dior : variation, change order, amendement budgétaire.
- Le profil de trésorerie (courbe en S entre engagement et ouverture) est une hypothèse. Il faudra le caler sur l'historique des paiements Coupa.
- Les seuils de santé (coût 1 % et 3 %, retard d'avancement 15 % et 30 %, fiche de plus de 30 et 60 jours) sont à fixer avec le comité.
- Les factures et avenants présentés sont illustratifs, sauf Melbourne Flinders Lane (offres réelles du SOR R2).
