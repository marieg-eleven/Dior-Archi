# Couverture du cadrage Excel, ligne par ligne (v2.1)

Auteur : Marie Guegain, eleven. 12 novembre 2026.

Référence : `20260615_AI_TRANSFORMATION-ARCHITECTURE.xlsx`, onglet « 2026 AI - AI for Transformation », 129 lignes. La même table est visible dans la plateforme : Admin › Backlog coverage.

## Synthèse

| Priorité | Lignes | Montré | En partie | Plan de livraison (sans écran) | Plus tard |
|---|---|---|---|---|---|
| P1 | 49 | 41 | 0 | 8 | 0 |
| P2 | 49 | 42 | 1 | 6 | 0 |
| P3 | 26 | 8 | 8 | 2 | 8 |
| P4 | 5 | 5 | 0 | 0 | 0 |

**Les huit capacités que l'Excel demande de confirmer pour P1 + P2 sont toutes couvertes :**
- vision financière complète ;
- cycle des appels d'offres avec IA ;
- connaissance des fournisseurs ;
- accès sécurisé par rôle ;
- gouvernance documentaire ;
- alertes en temps réel ;
- reporting ;
- socle technique.

Le détail figure en tête de l'onglet Backlog coverage.

**Autres onglets de l'Excel :**
- **D-NEXT 2025 :** les modules catalogue, design book et contractants sont repris dans Library et Suppliers.
- **SYSTEM :** les sept systèmes (Coupa, Anaplan, OKTA, DAM, SharePoint, AED, Diorlex) figurent dans Admin › Integrations.

**Atelier :** la demande d'alertes sur les variations du marché est couverte par la règle R10 de la page Alerts.

## Détail

| # | Priorité | Fonction | Statut | Où dans la plateforme |
|---|---|---|---|---|
| 1.1 | P1 | Financial Project Entity | Montré | Projects › project › Team & data (project sheet) · Projects › Import from Excel |
| 1.2 | P2 | Material Database | Montré | Library › Materials |
| 1.3 | P1 | Tender & SOW Data Model | Montré | Tenders › tender › Scope of work |
| 1.4 | P1 | Supplier & Contract Entity | Montré | Suppliers › supplier (Coupa ID, contract, tender history) |
| 1.5 | P1 | Budget Control Entity | Montré | Project › Budget & costs (Anaplan line › Coupa orders) |
| 1.6 | P2 | Services & User Model | Montré | Admin › Roles & workflows |
| 1.7 | P3 | Design Book | Montré | Library › Design books |
| 2.1 | P1 | Live Budget Dashboard | Montré | Cost control › Overview · Home key figures |
| 2.2 | P1 | Anaplan ↔ Platform Sync | Montré | Admin › Integrations (Anaplan) · budget amendments pushed to Anaplan |
| 2.3 | P1 | Coupa ↔ Platform Sync | Montré | Admin › Integrations (Coupa) · Cost control › Payments |
| 2.4 | P1 | SOW Cost Breakdown Integrator | Montré | Tenders › tender › offer comparison (SOR read by Copilot, with sources) |
| 2.5 | P1 | Budget Variance & Alert Engine | Montré | Alerts › rules R1, R2 · Cost control threshold |
| 2.6 | P1 | Commitment Tracker | Montré | Project › Budget & costs › Cost position, variations |
| 2.7 | P2 | Budget Reporting & Export | Montré | Cost control › Export, Cash flow |
| 2.8 | P2 | Audit Trail & Budget History | Montré | Project › Budget history · Cost control › Since the last report · Admin audit log |
| 3.1 | P1 | Tender Repository & Index | Montré | Tenders › All tenders · Documents (SOW, BOQ, returns) |
| 3.2 | P1 | Tender Lifecycle Tracking | Montré | Tenders › pipeline Draft → Awarded |
| 3.3 | P1 | SOW Line-Item Management | Montré | Tenders › tender › Scope of work |
| 3.4 | P1 | Multi-Bid Comparison Tool | Montré | Tenders › tender › Offer comparison |
| 3.5 | P1 | AI-Powered Tender Analysis | Montré | Tenders › tender › What Panoptic found · Alerts rule R4 |
| 3.6 | P1 | Tender <> Coupa Integration | Montré | Tenders › tender › Award (draft PO in Coupa) |
| 3.7 | P2 | Tender <> Material Quality Control | Montré | Tenders › findings (alternative quarry, sample approval) |
| 3.8 | P2 | Bidder Access Portal | Montré | Tenders › tender › Bidder access · role General contractor |
| 3.9 | P2 | Tender Document Archiving | Montré | Tenders › tender file, archived at award |
| 4.1 | P1 | Supplier Directory & Profiles | Montré | Suppliers |
| 4.2 | P2 | Supplier Performance KPIs | Montré | Suppliers › supplier KPIs |
| 4.3 | P2 | Contract Repository | Montré | Suppliers › contract (Diorlex) · Alerts rule R5 |
| 4.4 | P2 | Material / Furniture Pricing | Montré | Library › Materials prices · Supplier › materials supplied |
| 4.5 | P3 | Supplier Onboarding & Due Diligence | En partie | Admin › Workflows › Supplier onboarding (configured, off) |
| 4.6 | P3 | Bidder Access & Data Control | Montré | Tenders › Bidder access · financial data masked for externals |
| 5.1 | P1 | Budget Document Archive | Montré | Documents (budget exports, SOW, BOQ, POs) |
| 5.2 | P1 | Intelligent Document Tagging (AI) | Montré | Documents › tags and AI ready status |
| 5.3 | P2 | Flow to ECM (SharePoint) | Montré | Admin › Integrations (SharePoint) · Project › workspaces |
| 5.4 | P3 | Flow to DAM (Dior DAM) | Montré | Library › Boutiques & photos · Integrations (DAM) |
| 5.5 | P2 | Document Lifecycle Management | Montré | Documents › file › lifecycle |
| 5.6 | P2 | Full-Text Search on Documents | Montré | Documents search · Ask AI on a file |
| 5.7 | P3 | Flow to AED Services | Montré | Admin › Integrations (AED, planned) |
| 6.1 | P3 | Browse & Filter Catalog | Montré | Library › Materials filters |
| 6.2 | P3 | Manage & Dashboard — Catalog | En partie | Library › Materials (view, compare); editing in phase 2 |
| 6.3 | P3 | Extract Data from Catalog | En partie | Material › Spec sheet export |
| 6.4 | P4 | Browse Furnishing / Material / Lighting | Montré | Library › Furniture & lighting |
| 6.5 | P4 | Browse & Manage Look | Montré | Library › Façades & concepts |
| 6.6 | P3 | Create & Browse Design Book | Montré | Library › Design books |
| 6.7 | P4 | Technical Drawings | Montré | Project › levels and plans · Documents › drawings |
| 6.8 | P4 | Lighting Concept | Montré | Library › Lighting concept book |
| 6.9 | P4 | Guideline Design Export | Montré | Design book › Export guideline PDF |
| 7.1.1 | P1 | Project Bootstrap & Infrastructure | Plan de livraison | Delivery plan (hosting, environments) |
| 7.1.2 | P1 | API Gateway & Integration Bus | Montré | Admin › Integrations (data flow) |
| 7.1.3 | P1 | Coupa API Integration Layer | Montré | Admin › Integrations (Coupa) |
| 7.1.4 | P1 | Anaplan API Integration Layer | Montré | Admin › Integrations (Anaplan) |
| 7.1.5 | P1 | Unified Database Architecture | Montré | Admin › Integrations (architecture) · explainer page |
| 7.1.6 | P1 | Data Migration & ETL Pipeline | Montré | Projects › Import from Excel · Documents (226K of 275K indexed) |
| 7.1.7 | P1 | Platform Security Architecture | Plan de livraison | Delivery plan (security) |
| 7.2.1 | P1 | CI/CD Pipeline Setup | Plan de livraison | Delivery plan |
| 7.2.2 | P1 | Platform Monitoring & Alerting | Montré | Admin › Integrations health · Alerts rule R11 |
| 7.2.3 | P1 | Security & Penetration Testing | Plan de livraison | Delivery plan |
| 7.2.4 | P1 | Backup & Disaster Recovery | Plan de livraison | Delivery plan |
| 7.2.5 | P2 | Performance & Load Testing | Plan de livraison | Delivery plan |
| 7.2.6 | P2 | Test Automation Framework | Plan de livraison | Delivery plan |
| 7.2.7 | P2 | Release Management & Rollback | Plan de livraison | Delivery plan |
| 7.3.1 | P1 | OKTA SSO Integration | Montré | Admin › Roles (OKTA SSO, MFA) |
| 7.3.3 | P1 | Role & ACL — Internal Users | Montré | Role selector · Admin › Roles |
| 7.3.4 | P1 | Role & ACL — External Users | Montré | Role General contractor (external) |
| 7.3.5 | P1 | Granular Financial Data ACL | Montré | Financial figures masked for non-finance roles |
| 7.3.6 | P2 | External Party Secure Access Portal | Montré | Tenders › Bidder access portal |
| 7.3.7 | P2 | GDPR & Data Privacy Compliance | Plan de livraison | Delivery plan (GDPR) |
| 7.3.8 | P3 | Access Review & Recertification | Plus tard (P3) | P3, not in the prototype |
| 7.4.1 | P2 | Team Structure Configuration | Montré | Admin › teams |
| 7.4.2 | P2 | Zone Management | Montré | Zone filters (Projects, Cost control) · Home by zone |
| 7.4.3 | P2 | Content Hierarchy & Tree Management | Montré | New project › standard folder tree |
| 7.4.4 | P2 | Project-Level Team Assignment | Montré | Project › Team & data |
| 7.4.5 | P3 | Organisational Structure Sync | En partie | Team from OKTA groups (sync in phase 3) |
| 7.5.1 | P2 | Tags Management & Taxonomy | Montré | Documents tags |
| 7.5.2 | P2 | Native Faceted Search | Montré | Documents facets |
| 7.5.3 | P2 | Financial Data Search | Montré | Cost control › Search by univers |
| 7.5.4 | P2 | Cross-Document Content Search | Montré | Search or ask · Ask AI |
| 7.5.5 | P3 | Saved Searches & Automated Alerts | Montré | Alerts › rule R12 Saved search |
| 7.5.6 | P3 | Search Analytics & Query Reporting | Plus tard (P3) | P3, not in the prototype |
| 7.6.1 | P1 | Object Versioning & Audit Trail | Montré | Admin › Audit log |
| 7.6.2 | P1 | Budget Amendment Versioning | Montré | Project › Budget history, amendments |
| 7.6.3 | P1 | Tender Document Version Control | Montré | Tender documents (SOW v3) · Alerts rule R9 |
| 7.6.4 | P1 | Real-Time Notification Engine | Montré | Alerts (Panoptic, Teams, e-mail) |
| 7.6.5 | P1 | Budget Threshold & Overspend Alerts | Montré | Alerts › rules R1, R2 with thresholds |
| 7.6.6 | P2 | Escalation & Deadline Reminders | Montré | Alerts › escalation · rules R3, R5, R7 |
| 7.6.7 | P2 | Configurable Approval Workflows | Montré | Admin › Approval workflow |
| 7.6.8 | P3 | Delegation & Out-of-Office Rules | Plus tard (P3) | P3, not in the prototype |
| 7.6.9 | P3 | Workflow Analytics & SLA Reporting | En partie | Admin › Workflows (runs, median approval time) |
| 7.7.1 | P2 | Role-Based Home Dashboard | Montré | Home by role, shortcuts |
| 7.7.2 | P1 | Financial KPI Dashboard | Montré | Cost control › Overview |
| 7.7.3 | P2 | Tender Activity Dashboard | Montré | Tenders pipeline |
| 7.7.4 | P2 | Supplier Performance Dashboard | Montré | Suppliers KPIs |
| 7.7.5 | P1 | Project Cost Summary Dashboard | Montré | Project › Cost position |
| 7.7.6 | P3 | Custom Report Builder | Plus tard (P3) | P3, not in the prototype |
| 7.7.7 | P3 | Scheduled Report Distribution | En partie | Since the last report · draft steering note |
| 7.7.8 | P3 | BI Tool Connectivity | En partie | Admin › Your tools (Power BI connector) |
| 7.7.9 | P2 | Governance & Compliance Reporting | En partie | Admin › Audit log, Data health |
| 7.8.1 | P2 | Lifecycle Policy Engine | Montré | Documents › file lifecycle |
| 7.8.2 | P2 | Automated Retention Rules | Montré | Documents › file retention |
| 7.8.3 | P2 | Legal Hold Management | Montré | Documents › file › Legal hold |
| 7.8.4 | P2 | Document Status Tracking | Montré | Documents status · Project › Team & data |
| 7.8.5 | P2 | Automated Archiving Triggers | Montré | Tender file archived at award |
| 7.8.6 | P2 | Archive Access & Retrieval | Montré | Documents archive search |
| 7.8.7 | P3 | Controlled Disposal Workflow | Plus tard (P3) | P3, not in the prototype |
| 7.8.8 | P3 | Compliance & Lifecycle Reporting | En partie | Admin › Data health |
| 7.9.1 | P1 | Integration Management Console | Montré | Admin › Integrations console |
| 7.9.2 | P1 | Coupa Connector Management | Montré | Admin › Integrations (Coupa) · invoices to match |
| 7.9.3 | P1 | Anaplan Connector Management | Montré | Admin › Integrations (Anaplan) |
| 7.9.4 | P2 | SharePoint / ECM Connector | Montré | Admin › Integrations (SharePoint) |
| 7.9.5 | P2 | Dior DAM Connector | Montré | Admin › Integrations (DAM) |
| 7.9.6 | P2 | AED Services Connector | Montré | Admin › Integrations (AED, planned) |
| 7.9.7 | P2 | Diorlex / Legal Connector | Montré | Admin › Integrations (Diorlex) |
| 7.9.8 | P3 | AutoCAD / Design Tool Connector | Montré | Drawing revisions detected · Alerts rule R9 |
| 7.9.9 | P1 | Integration Health Monitoring | Montré | Admin › Integrations health · Alerts rule R11 |
| 7.9.10 | P2 | Integration Audit Log | Montré | Admin › Audit log |
| 7.10.1 | P1 | Global Admin Console | Montré | Admin |
| 7.10.2 | P2 | No-Code Configuration Management | Montré | Alerts › Rules · Admin › Workflows |
| 7.10.3 | P2 | Feature Flag Management | Montré | Admin › Workflows on per zone |
| 7.10.4 | P2 | Multi-Language Support (EN/FR) | Montré | Admin › Language EN / FR |
| 7.10.5 | P3 | Platform Usage & Adoption Analytics | Plus tard (P3) | P3, not in the prototype |
| 7.10.6 | P3 | Maintenance & Downtime Management | Plus tard (P3) | P3, not in the prototype |
| 7.10.7 | P3 | Helpdesk & IT Support Integration | Plus tard (P3) | P3, not in the prototype |
| 7.11.1 | P1 | Stakeholder Engagement & Comms Plan | Plan de livraison | Delivery plan |
| 7.11.2 | P1 | UAT Framework | Plan de livraison | Delivery plan |
| 7.11.3 | P1 | Role-Based Training Programme | Plan de livraison | Delivery plan |
| 7.11.4 | P2 | Super User / Champion Network | Plan de livraison | Delivery plan |
| 7.11.5 | P2 | In-Platform Onboarding & Help | Montré | Home shortcuts by role · this note |
| 7.11.6 | P2 | Feedback Loop & Continuous Improvement | Plan de livraison | Delivery plan |
| 7.11.7 | P3 | External Party Onboarding | Plan de livraison | Delivery plan |
| 7.11.8 | P3 | Post Go-Live Hypercare Support | Plan de livraison | Delivery plan |
