"""Step 1 — real Dior 2027 projects, Flinders Lane main contract, image-backed documents.
Author: Marie Guegain — eleven. Applied in place to mockup/index.html."""
import re, sys
P = sys.argv[1]
s = open(P, encoding='utf-8').read()
def rep(a, b, count=1):
    global s
    assert a in s, 'MISSING: ' + a[:90]
    s = s.replace(a, b, count)

# --- 1. six real 2027 openings (ADMIN FOLLOW UP, sheet 2027) replace six sample projects
NEW = {
 'TYO08': ("201155", "city: 'Melbourne', name2: 'Flinders Lane', country: 'Australia', region: 'Oceania', zone: 'East', type: 'New flagship, Women & Men', status: 'Tender', surface: 610, floors: 2, concept: 'LAT', budget: 14498, handover: '2027-12-31', progress: 0.27,",
           "{ opening: '2027-12-31', commitment: '2026-04-23', boutique: 'Flag', concept: 'PMA by Dior', retail: 610, fcInt: null, fcExt: 180, fcIntConcept: '—', fcExtConcept: 'Generic', sop: 14497633, months: 20 }"),
 'LON02': ("401111", "city: 'Copenhagen', country: 'Denmark', region: 'Europe', zone: 'West', type: 'New boutique, FSS', status: 'Tender', surface: 365, floors: 2, concept: 'PLI', budget: 7531, handover: '2027-07-01', progress: 0.22,",
           "{ opening: '2027-07-01', commitment: '2026-05-12', boutique: 'FSS', concept: 'PMA Lite', retail: 365, fcInt: null, fcExt: 372, fcIntConcept: '—', fcExtConcept: 'Generic', sop: 7530986, months: 13 }"),
 'MIL03': ("100610", "city: 'Los Cabos', country: 'Mexico', region: 'Americas', zone: 'West', type: 'New boutique, FSS', status: 'Works', surface: 368, floors: 2, concept: 'LAT', budget: 5050, handover: '2027-01-31', progress: 0.71,",
           "{ opening: '2027-01-31', commitment: '2026-06-24', boutique: 'FSS', concept: 'PMA by Dior', retail: 368, fcInt: 134, fcExt: null, fcIntConcept: 'Generic', fcExtConcept: '—', sop: 5050120, months: 7 }"),
 'DXB05': ("601421", "city: 'Ras Al Khaimah', name2: 'Wynn', country: 'UAE', region: 'Middle East', zone: 'West', type: 'New boutique, FSS', status: 'Works', surface: 416, floors: 1, concept: 'VOI', budget: 6260, handover: '2027-07-15', progress: 0.38,",
           "{ opening: '2027-07-15', commitment: '2026-07-29', boutique: 'FSS', concept: 'PMA by Dior', retail: 416, fcInt: 50, fcExt: null, fcIntConcept: 'Generic', fcExtConcept: '—', sop: 6260180, months: 11 }"),
 'SEL09': ("300407", "city: 'Sanya', name2: 'Swire', country: 'China', region: 'Asia', zone: 'East', type: 'New flagship', status: 'Works', surface: 690, floors: 2, concept: 'VOI', budget: 9256, handover: '2027-06-01', progress: 0.45,",
           "{ opening: '2027-06-01', commitment: '2026-07-01', boutique: 'Flag', concept: 'PMA by Dior', retail: 690, fcInt: 132, fcExt: 265, fcIntConcept: 'Twist', fcExtConcept: 'NY 5th', sop: 9255900, months: 11 }"),
 'SHA10': ("200769", "city: 'Kuala Lumpur', name2: 'Pavilion', country: 'Malaysia', region: 'Asia', zone: 'East', type: 'Flagship expansion', status: 'Works', surface: 760, floors: 2, concept: 'LAN', budget: 9314, handover: '2027-04-30', progress: 0.6,",
           "{ opening: '2027-04-30', commitment: '2026-07-07', boutique: 'Flag', concept: 'PMA by Dior', retail: 760, fcInt: 398, fcExt: 604, fcIntConcept: 'Chadstone', fcExtConcept: 'Chengdu IFS', sop: 9314437, months: 9 }"),
}
for old, (nid, fields, admin) in NEW.items():
    m = re.search(r"\{ id: '%s', city: [^\n]*?progress: [\d.]+," % old, s)
    assert m, old
    s = s[:m.start()] + "{ id: '%s', real: true, %s admin: %s," % (nid, fields, admin) + s[m.end():]
# p.name uses city; show the site name too
rep("p.name = p.city + ' — ' + p.type;", "if (p.name2) p.city = p.city + ' ' + p.name2; p.name = p.city + ' — ' + p.type;")
# ids everywhere (budget lines, MARKS, alerts, tenders, docs)
for old, (nid, _, _) in NEW.items():
    s = s.replace(old, nid)
# city names in narrative text
for a, b in [("lowest stone bid for Tokyo", "lowest stone bid for Melbourne"), ("Façades similar to the Tokyo project", "Façades similar to Bangkok EM Quartier"),
             ("<li>Tokyo stone:", "<li>Melbourne stone:"), ("<b>Tenders.</b> Tokyo stone", "<b>Tenders.</b> Melbourne stone"), ("confirm the Tokyo award", "confirm the Melbourne awards"),
             ("Milan's façade change order", "Los Cabos' façade change order"), ("Approve the Milan change order", "Approve the Los Cabos change order"),
             ("Three Dubai invoices", "Three Ras Al Khaimah invoices"), ("Seoul façade elevation", "Sanya façade elevation"), ("Delivery to Shanghai quoted", "Delivery to Kuala Lumpur quoted")]:
    rep(a, b)
s = s.replace("Summarise the Seoul", "Summarise the Sanya")

# --- 2. Flinders Lane main contract: real tenderers and SOR R2 figures (EUR, 1 EUR = 1.8 AUD)
rep("    { id: 'EX12', name: 'Gulf Interiors',",
    "    { id: 'EX15', name: 'Legend', cat: 'General contractor', zones: ['East'], country: 'Australia', coupa: 'CV-106201', contract: 'LMA-2026-012', expiry: '2029-03-31', kpi: { delivery: 90, quality: 4.3, cost: 93 } },\n"
    "    { id: 'EX16', name: 'Redwood', cat: 'General contractor', zones: ['East'], country: 'Australia', coupa: 'CV-106214', contract: 'LMA-2026-015', expiry: '2029-03-31', kpi: { delivery: 88, quality: 4.1, cost: 90 } },\n"
    "    { id: 'EX12', name: 'Gulf Interiors',")
rep("  const TENDERS = [\n",
    "  const TENDERS = [\n    { id: 'T-26-026', project: '201155', pkg: 'Main contract — early & main works', line: '07', status: 'Evaluated', date: '2026-11-20', dateLabel: 'Award', benchmark: 11950, bidders: ['EX15', 'EX16'], owner: 'Procurement Officer — East', real: true,\n"
    "      fixed: { sow: [['Preliminaries (PM, hoarding, set-up, security)', 2200], ['General contractor works', 4900], ['MEP — mechanical, electrical, plumbing, fire', 2050], ['Millwork', 2800]],\n"
    "        bids: { EX15: [2692, 5050, 1724, 3074], EX16: [1760, 4839, 3237, 2637] },\n"
    "        gaps: { EX16: [{ ref: '§3', text: 'MEP priced 88% above Legend: fire services and plumbing allowances to clarify', soft: true }], EX15: [{ ref: '§1', text: 'Preliminaries 22% above benchmark (project management, hoarding)', soft: true }] } } },\n")
rep("  TENDERS.forEach(t => {\n    const r = rng(hash(t.id));\n",
    "  TENDERS.forEach(t => {\n    const r = rng(hash(t.id));\n"
    "    if (t.fixed) { const fx = t.fixed; t.sow = fx.sow.map((x, i) => ({ ref: '§' + (i + 1), name: x[0], benchmark: x[1] })); t.bids = t.bidders.map((sid, k) => { const lines = fx.bids[sid]; const total = lines.reduce((a, b) => a + b, 0); const gaps = fx.gaps[sid] || []; return { supplier: sid, lines, total, tech: [4.4, 4.0][k], lead: [14, 16][k], gaps, risk: Math.round(total * (1 + gaps.length * 0.03)) }; }); return; }\n")

# --- 3. documents backed by the workshop screenshots (tables, plans, photos)
rep("    Minutes: { src: 'R&P SharePoint', ext: 'docx', retention: 'Project lifetime' }\n",
    "    Minutes: { src: 'R&P SharePoint', ext: 'docx', retention: 'Project lifetime' },\n"
    "    'Project list': { src: 'Finance server', ext: 'xlsx', retention: 'Financial · 10 years' },\n"
    "    'Tender analysis': { src: 'Finance server', ext: 'xlsx', retention: 'Tender · 7 years' },\n"
    "    'Project info': { src: 'Design release server', ext: 'pdf', retention: 'Project lifetime' },\n"
    "    'Opening book': { src: 'R&P SharePoint', ext: 'pptx', retention: 'Project lifetime' }\n")
rep("  DOCS.sort((a, b) => b.updated.localeCompare(a.updated));",
    "  addDoc({ name: 'FINAL_Dior Flinders Lane - MC - SOR - R2(2Apr)', type: 'Tender analysis', project: '201155', tender: 'T-26-026', status: 'Approved', updated: '2026-06-15', tags: ['sor', 'main contract', 'legend', 'redwood', 'aud→eur'], img: 'assets/tbl-flinders-lane-sor-r2.jpg', real: true });\n"
    "  addDoc({ name: '2026 - ADMIN FOLLOW UP (sheet 2027)', type: 'Project list', status: 'Approved', updated: '2026-11-05', tags: ['project list', 'sop budget', 'surfaces', 'opening dates'], img: 'assets/tbl-admin-follow-up-2027.jpg', real: true });\n"
    "  addDoc({ name: '2026 - ADMIN FOLLOW UP (competitors, 2027)', type: 'Tender analysis', status: 'Approved', updated: '2026-11-09', tags: ['competitors', 'awarded vs bids', 'fc cost / m²'], img: 'assets/tbl-competitors-2027.jpg', real: true });\n"
    "  addDoc({ name: '2025 02 13 Dior EM Quartier Bangkok - Project info', type: 'Project info', status: 'Published', updated: '2025-02-13', tags: ['bangkok', 'sqm', 'display capacity', 'women & men'], img: 'assets/tbl-bangkok-area-capacity.jpg', real: true });\n"
    "  addDoc({ name: '2025 11 03_Dior WEST_USA_Beverly Hills_Rodeo Drive_Opening Announcement', type: 'Opening book', status: 'Published', updated: '2025-11-03', tags: ['rodeo drive', 'layout', 'façade'], img: 'assets/store-rodeo-plan.jpg', real: true });\n"
    "  addDoc({ name: 'BANGKOK EM QUARTIER WOMEN&MEN&SALON 2025 02 — façade', type: 'Site photos', status: 'Published', updated: '2025-09-26', tags: ['architecture photos', '2025 best of', 'façade'], img: 'assets/store-bangkok-facade.jpg', real: true });\n"
    "  addDoc({ name: 'BANGKOK EM QUARTIER WOMEN&MEN&SALON 2025 02 — women try-on', type: 'Site photos', status: 'Published', updated: '2025-09-26', tags: ['architecture photos', 'try-on', 'interior'], img: 'assets/store-bangkok-tryon-pink.jpg', real: true });\n"
    "  addDoc({ name: 'BEVERLY HILLS RODEO DRIVE 2025 09 25 — façade', type: 'Site photos', status: 'Published', updated: '2026-04-23', tags: ['architecture photos', '2025 best of', 'façade'], img: 'assets/store-rodeo-facade-2.jpg', real: true });\n"
    "  DOCS.sort((a, b) => b.updated.localeCompare(a.updated));")

# --- 4. reference boutiques (ARCHITECTURE PHOTOS / 2025 best of) and concept photos
rep("  const CONCEPTS = [", "  const BOUTIQUES = [\n"
    "    { id: 'BKK', name: 'Bangkok EM Quartier', scope: 'Women, Men & Salon', opened: 'Feb 2025', concept: 'LAT', photos: ['assets/store-bangkok-facade.jpg', 'assets/store-bangkok-tryon-pink.jpg', 'assets/store-bangkok-tryon-women.jpg'], table: 'assets/tbl-bangkok-area-capacity.jpg', facts: [['Selling area', '678 m²'], ['Gross area', '1,278 m²'], ['BOH area', '445 m²'], ['Ext. façade', '553 m²'], ['Int. façade', '327 m²'], ['Women / Men / Maison', '513 / 135 / 30 m²'], ['Displayed SKUs, women', '1,371'], ['Displayed SKUs, men', '440']] },\n"
    "    { id: 'BVH', name: 'Beverly Hills Rodeo Drive', scope: 'Women & Men', opened: 'Sept 2025', concept: 'VOI', photos: ['assets/store-rodeo-facade-2.jpg', 'assets/store-rodeo-facade-1.jpg'], plan: 'assets/store-rodeo-plan.jpg', facts: [['Levels', '2'], ['Layout', 'Women & Men, salon, staircase'], ['Opening book', '144 slides, Nov 2025']] }\n"
    "  ];\n  const DAM_FOLDERS = ['ABU DHABI THE GALLERIA SOWWAH FJ 2025 02 04', 'ASPEN GALENA ST Women&MEN 2025 05 22', 'BANGKOK EM QUARTIER WOMEN&MEN&SALON 2025 02', 'BANGKOK SIAM PARAGON MEN TEMP 2025 09 01', 'BANGKOK SIAM PARAGON WOMEN TEMP 2025 07 01', 'BEIJING SANLITUN 2025 12 07', 'BEVERLY HILLS RODEO DRIVE 2025 09 25', 'BUSAN SSG CENTUM SSG TEMP 1 WOMEN LG&ACC 2025', 'COSTA MESA SOUTH COAST PLAZA MEN and W&J 2025', 'COSTA MESA SOUTH COAST PLAZA WOMEN VIP 2025', 'DALLAS HIGHLAND PARK VILLAGE CAFE 2025 02 21', 'GERMANY DUSSELDORF TEMP 2025 07 24', 'HIROSHIMA FUKUYA 1F WOMEN 2025 09 04', 'HIROSHIMA FUKUYA 2F WOMEN&MEN 2025 09 04', 'HONG KONG LANDMARK TEMP 1 WOMEN 2025 09 01'];\n"
    "  const CONCEPTS = [")
rep("costWest: 4200, costEast: 4650,", "photo: 'assets/store-bangkok-facade.jpg', ref: 'Bangkok EM Quartier, 2025', costWest: 4200, costEast: 4650,")
rep("costWest: 6200, costEast: 6400,", "photo: 'assets/store-rodeo-facade-2.jpg', ref: 'Beverly Hills Rodeo Drive, 2025', costWest: 6200, costEast: 6400,")
rep("window.DATA = { TODAY,", "window.DATA = { BOUTIQUES, DAM_FOLDERS, TODAY,")

# --- 5. footer / sample badge
rep("<span>All figures, suppliers, contracts and people are sample data. File volumes come from the Architecture department overview.</span>",
    "<span>Real: the six 2027 openings (ADMIN FOLLOW UP), the Flinders Lane main-contract bids (SOR R2), photos, plans and tables from the 9 Nov workshop. Everything else is sample data.</span>")
rep("smp.title = 'All figures, suppliers, contracts and people are fictitious'; smp.textContent = 'Mockup · sample data';",
    "smp.title = 'Six 2027 projects, Flinders Lane bids, photos, plans and tables are real; the rest is sample data'; smp.textContent = 'Mockup · partly sample data';")
open(P, 'w', encoding='utf-8').write(s)
print('step1 ok')
