/*
 * Dior Architecture — Panoptic Digital Platform
 * Shared mock dataset for the design proposals.
 * Author: Marie Guegain — eleven strategy
 *
 * Project identities, SOP budgets, surfaces and bidders come from the
 * "2026 - ADMIN FOLLOW UP" and "Flinders Lane SOR" screens shown in the
 * 09/11/2026 workshop. Committed / actual / forecast figures, alerts and
 * sync times are ILLUSTRATIVE ONLY (to be replaced by Coupa / Anaplan feeds).
 */
window.PANO = {
  user: { name: "Christophe Ngo", role: "Cost Control — Architecture", zone: "Global" },

  kpis: {
    portfolioBudget: 51.9, // M€ — sum of SOP budgets, 2027 openings below
    committed: 34.6,       // M€ — Coupa POs + signed SOW
    actual: 11.9,          // M€ — invoiced / paid (Coupa)
    forecast: 53.1,        // M€ — forecast at completion
    activeTenders: 14,
    openAlerts: 7,
    files: "275K",
    storage: "1.6 TB"
  },

  // 2027 openings (ADMIN FOLLOW UP, sheet 2027)
  projects: [
    { id: "201155", name: "Melbourne Flinders Lane", city: "Melbourne", country: "Australia", zone: "EAST", region: "SOUTH ASIA",
      type: "New", boutique: "Flag", concept: "PMA by Dior", opening: "2027-12-31", commitment: "2026-04-23",
      retailSqm: 610, fcExtSqm: 180, budget: 14.50, committed: 12.10, actual: 3.40, forecast: 15.19,
      phase: "Bid evaluation", progress: 0.34, lat: -37.81, lng: 144.96, status: "alert" },
    { id: "401111", name: "Copenhagen", city: "Copenhagen", country: "Denmark", zone: "WEST", region: "EUROPE",
      type: "New", boutique: "FSS", concept: "PMA Lite", opening: "2027-07-01", commitment: "2026-05-12",
      retailSqm: 365, fcExtSqm: 372, budget: 7.53, committed: 6.02, actual: 2.31, forecast: 7.41,
      phase: "Construction", progress: 0.52, lat: 55.68, lng: 12.57, status: "ok" },
    { id: "100610", name: "Los Cabos", city: "Los Cabos", country: "Mexico", zone: "WEST", region: "AMERICAS",
      type: "New", boutique: "FSS", concept: "PMA by Dior", opening: "2027-01-31", commitment: "2026-06-24",
      retailSqm: 368, fcIntSqm: 134, budget: 5.05, committed: 4.71, actual: 2.95, forecast: 5.22,
      phase: "Construction", progress: 0.71, lat: 22.89, lng: -109.91, status: "watch" },
    { id: "300407", name: "Sanya Swire", city: "Sanya", country: "China", zone: "EAST", region: "MAINLAND CHINA",
      type: "New", boutique: "Flag", concept: "PMA by Dior", opening: "2027-06-01", commitment: "2026-07-01",
      retailSqm: 690, fcIntSqm: 132, fcExtSqm: 265, budget: 9.26, committed: 6.88, actual: 1.92, forecast: 9.47,
      phase: "Bid evaluation", progress: 0.28, lat: 18.25, lng: 109.51, status: "watch" },
    { id: "200769", name: "Kuala Lumpur Pavilion", city: "Kuala Lumpur", country: "Malaysia", zone: "EAST", region: "SOUTH ASIA",
      type: "Expansion", boutique: "Flag", concept: "PMA by Dior", opening: "2027-04-30", commitment: "2026-07-07",
      retailSqm: 760, fcIntSqm: 398, fcExtSqm: 604, budget: 9.31, committed: 3.40, actual: 0.98, forecast: 9.20,
      phase: "Tender issued", progress: 0.18, lat: 3.15, lng: 101.71, status: "ok" },
    { id: "601421", name: "Ras Al Khaimah Wynn", city: "Ras Al Khaimah", country: "UAE", zone: "WEST", region: "MEA",
      type: "New", boutique: "FSS", concept: "PMA by Dior", opening: "2027-07-15", commitment: "2026-07-29",
      retailSqm: 416, fcIntSqm: 50, budget: 6.26, committed: 1.49, actual: 0.31, forecast: 6.61,
      phase: "Concept design", progress: 0.09, lat: 25.79, lng: 55.94, status: "watch" }
  ],

  // Recently opened boutiques (ARCHITECTURE PHOTOS / 2025 best of)
  openings: [
    { name: "Bangkok EM Quartier", scope: "Women & Men", date: "2025-02", image: "assets/store-bangkok-facade.jpg",
      sellingSqm: 678, grossSqm: 1278, bohSqm: 445, extFacadeSqm: 553 },
    { name: "Beverly Hills Rodeo Drive", scope: "Women & Men", date: "2025-09", image: "assets/store-rodeo-facade-2.jpg" },
    { name: "Bangkok EM Quartier — Women try-on", scope: "Interior", date: "2025-02", image: "assets/store-bangkok-tryon-pink.jpg" },
    { name: "Aspen Galena St", scope: "Women & Men", date: "2025-05" },
    { name: "Abu Dhabi The Galleria", scope: "Fine Jewellery", date: "2025-02" },
    { name: "Beijing Sanlitun", scope: "Women & Men", date: "2025-12" }
  ],

  // Melbourne Flinders Lane — Main Contract SOR (R2, 2 Apr). EUR.
  tender: {
    project: "Melbourne Flinders Lane",
    title: "Main Contract — Early Works + Main Works",
    submission: "2026-03-30",
    stage: "Evaluated",
    stages: ["Draft", "Issued", "Received", "Evaluated", "Awarded"],
    bidders: ["Legend", "Redwood"],
    packages: [
      { code: "PRELIM", label: "Preliminaries",            legend: 2.69, redwood: 1.76, budget: 2.20 },
      { code: "GC",     label: "General contractor",        legend: 5.05, redwood: 4.84, budget: 4.90 },
      { code: "MEP",    label: "Mechanical, electrical, plumbing, fire", legend: 1.72, redwood: 3.24, budget: 2.05 },
      { code: "MW",     label: "Millwork",                  legend: 3.07, redwood: 2.64, budget: 2.80 }
    ]
  },

  // Tender pipeline (2027 sheet — competitors)
  tenders: [
    { project: "Melbourne Flinders Lane", lot: "Main contract", bidders: ["Legend", "Redwood"], stage: "Evaluated", value: 7.30, delta: 0.32 },
    { project: "Copenhagen", lot: "Main contract", bidders: ["Sogeco", "Terp & Co"], stage: "Awarded", value: 2.13, delta: 0.30 },
    { project: "Copenhagen", lot: "Millwork", bidders: ["Zordan", "Arredoquattro"], stage: "Awarded", value: 1.02, delta: 0.33 },
    { project: "Copenhagen", lot: "Furniture", bidders: ["Crestani 2000", "Niva"], stage: "Awarded", value: 0.67, delta: 0.80 },
    { project: "Los Cabos", lot: "Millwork", bidders: ["Buzzoni", "Arquetypo"], stage: "Awarded", value: 1.66, delta: 0.10 },
    { project: "Los Cabos", lot: "Main contract", bidders: ["Vanark"], stage: "Awarded", value: 1.58, delta: 0.01 },
    { project: "Sanya Swire", lot: "Millwork", bidders: ["Basis Form", "Rich Honour"], stage: "Received", value: 1.91, delta: 0.17 },
    { project: "Sanya Swire", lot: "Furniture", bidders: ["Keio", "Tianhua"], stage: "Received", value: 0.52, delta: 0.03 },
    { project: "Kuala Lumpur Pavilion", lot: "Main contract", bidders: ["—"], stage: "Issued", value: null, delta: null },
    { project: "Ras Al Khaimah Wynn", lot: "Main contract", bidders: ["—"], stage: "Draft", value: null, delta: null }
  ],

  alerts: [
    { level: "high", project: "Melbourne Flinders Lane", title: "Forecast above SOP budget",
      text: "Forecast at completion 15.19 M€ vs 14.50 M€ budget (+4.8%). MEP & façade packages drive the gap.", source: "Anaplan × Coupa", time: "09:12" },
    { level: "high", project: "Sanya Swire", title: "Millwork commitment at 102% of budget line",
      text: "PO 4500-88213 (Basis Form) pushes MW.01 above its Anaplan line.", source: "Coupa", time: "08:47" },
    { level: "medium", project: "Copenhagen", title: "PO not mapped to a budget line",
      text: "PO 4500-87730 (Terp & Co) has no Anaplan code. Suggested: GC.04 — Wall works.", source: "AI mapping", time: "Yesterday" },
    { level: "medium", project: "Los Cabos", title: "Market signal — aluminium +6% (3 months)",
      text: "Exterior façade cladding exposed. Estimated impact +48 k€ on FC EXT.", source: "Market watch", time: "Yesterday" },
    { level: "low", project: "Kuala Lumpur Pavilion", title: "Tender deadline in 5 days",
      text: "Main contract RFQ closes 14/11. 3 of 4 bidders have opened the package.", source: "Tender", time: "Mon" }
  ],

  integrations: [
    { name: "Coupa",      role: "POs, invoices, supplier payments", status: "ok",    lastSync: "4 min ago" },
    { name: "Anaplan",    role: "Budget plans & forecasts",         status: "ok",    lastSync: "1 h ago" },
    { name: "OKTA",       role: "SSO & access",                     status: "ok",    lastSync: "live" },
    { name: "SharePoint", role: "Document storage (ECM)",           status: "warn",  lastSync: "3 h ago" },
    { name: "Dior DAM",   role: "Design images & assets",           status: "ok",    lastSync: "22 min ago" },
    { name: "AED",        role: "External services platform",       status: "off",   lastSync: "phase 2" },
    { name: "Diorlex",    role: "Contracts & legal agreements",     status: "ok",    lastSync: "2 h ago" }
  ],

  // The 6 functions of the Architecture department (overview slide)
  departments: [
    { name: "Procurement", folders: "5K", files: "15K", storage: "47 GB", processes: ["Supplier onboarding & due diligence", "RFI, RFQ & negotiations", "Supplier relationship & KPIs", "Legal master agreement", "Tender follow-up SOW"] },
    { name: "Finance", folders: "33K", files: "4K", storage: "35 GB", processes: ["SOP", "Tender follow-up SOW", "Project budget control", "Project list administration", "Budget analysis & reporting"] },
    { name: "Store Planning", folders: "—", files: "—", storage: "local", processes: ["Project brief, survey & schedule", "Call for tender & contractualization", "Project follow-up & reporting", "Budget follow-up", "Direct orders management"] },
    { name: "Project Management", folders: "28K", files: "189K", storage: "1.1 TB", processes: ["Project list coordination", "Project specifications referential", "Drawings development & layout", "Technical drawings follow-up", "DDO & furniture selection"] },
    { name: "Concept Design & 3D", folders: "1K", files: "8K", storage: "19 GB", processes: ["Concept design management", "Technical drawings", "Lighting concept book", "Composition guidelines", "Decorative furniture & accessories"] },
    { name: "Research & Development", folders: "7K", files: "59K", storage: "365 GB", processes: ["Material referential", "Qualification process", "FF&E management", "Project support", "Material & FF&E development", "Material physical library & dispatch"] }
  ],

  // Store zones for the 3D plan (Melbourne Flinders Lane, illustrative split)
  zones: [
    { name: "Women RTW",       sqm: 160, budgetUse: 0.82, status: "ok" },
    { name: "Leathergoods",    sqm: 120, budgetUse: 0.97, status: "watch" },
    { name: "Fine Jewellery",  sqm: 70,  budgetUse: 1.06, status: "alert" },
    { name: "Men",             sqm: 110, budgetUse: 0.74, status: "ok" },
    { name: "Maison",          sqm: 30,  budgetUse: 0.61, status: "ok" },
    { name: "Salon VIC",       sqm: 50,  budgetUse: 0.91, status: "watch" },
    { name: "BOH",             sqm: 70,  budgetUse: 0.55, status: "ok" }
  ],

  roadmap: [
    { phase: "P1", label: "Single source of truth & budget control", items: ["Financial project entity", "Coupa ↔ Anaplan sync", "Live budget dashboard", "Tender repository & lifecycle", "AI tender analysis", "OKTA SSO & RBAC"] },
    { phase: "P2", label: "Tender & supplier intelligence", items: ["Bidder access portal", "Supplier KPIs", "Contract repository (Diorlex)", "Document lifecycle", "Full-text search"] },
    { phase: "P3", label: "Design & catalogue", items: ["Material database", "Design book", "DAM flow", "AutoCAD connector"] }
  ]
};
