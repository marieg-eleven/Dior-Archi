"""Step 2 — images, plans and tables from the workshop screens; administration screen; backlog coverage.
Author: Marie Guegain — eleven. Applied in place to mockup/index.html."""
import sys
P = sys.argv[1]
s = open(P, encoding='utf-8').read()
def rep(a, b, count=1):
    global s
    n = s.count(a)
    assert n >= count and n > 0, f'MISSING ({n}): ' + a[:100]
    s = s.replace(a, b, count)

# ---------- CSS
rep("</style>", """
/* --- photos, source tables, admin (v0.2) --- */
.ph{width:100%;height:100%;object-fit:cover;display:block}
.pic{position:relative}
.pic .ref{position:absolute;left:10px;bottom:10px;background:rgba(255,255,255,.92);border-radius:999px;font-size:11.5px;padding:4px 9px;color:var(--ink-2)}
.photo-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}
.photo-row figure,.ph-card{margin:0}
.photo-row .fr{aspect-ratio:1/1;border-radius:var(--r);overflow:hidden;background:var(--mist)}
.photo-row .fr.wide{aspect-ratio:4/5}
.photo-row figcaption{margin-top:10px;font-size:13.5px}
.photo-row figcaption b{display:block;font-weight:600;font-size:15px}
.src-panel{border:1px solid var(--line);border-radius:var(--r);background:#fff;margin-top:22px}
.src-panel summary{list-style:none;display:flex;align-items:center;gap:14px;padding:14px 18px;cursor:pointer}
.src-panel summary::-webkit-details-marker{display:none}
.src-panel summary b{display:block;font-weight:600}
.src-panel summary .tag{margin-left:auto}
.src-panel summary::after{content:"Show";font-size:12.5px;color:var(--grey);border:1px solid var(--line-2);border-radius:999px;padding:4px 10px}
.src-panel[open] summary::after{content:"Hide"}
.src-body{padding:0 18px 18px}
.src-body img,.img-frame img{width:100%;display:block;border-radius:10px;border:1px solid var(--line)}
.img-frame{margin:0}
.img-frame figcaption{font-size:12.5px;color:var(--grey);margin-top:8px}
.doc-prev{display:block;margin:16px 0 4px}
.doc-prev img{width:100%;border-radius:10px;border:1px solid var(--line);display:block}
.hero-photo{margin:22px 0 0;border-radius:var(--r);overflow:hidden;position:relative;max-height:460px}
.hero-photo img{width:100%;height:460px;object-fit:cover;display:block}
.hero-photo figcaption{position:absolute;left:16px;bottom:16px;background:rgba(255,255,255,.93);border-radius:999px;padding:6px 12px;font-size:12.5px}
.btq{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:28px;padding:28px 0;border-top:1px solid var(--line)}
.btq .main{aspect-ratio:16/10;border-radius:var(--r);overflow:hidden;background:var(--mist)}
.btq .thumbs{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:10px}
.btq .thumbs img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:8px;display:block;border:1px solid var(--line)}
.btq h3{font:600 24px/1.2 var(--sans);margin:0 0 4px}
.folders{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 18px;margin-top:14px}
.folders span{display:flex;align-items:center;gap:9px;font-size:13px;padding:8px 0;border-bottom:1px solid var(--line)}
.folders span::before{content:"";width:16px;height:12px;border-radius:2px 4px 2px 2px;background:#e9c46a;flex:none}
.folders span.has{font-weight:600}
.facts-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:0;border:1px solid var(--line);border-radius:var(--r);overflow:hidden;background:#fff}
.facts-grid div{padding:14px 16px;border-right:1px solid var(--line);border-bottom:1px solid var(--line)}
.facts-grid dt{font-size:12px;color:var(--grey);margin:0 0 4px}.facts-grid dd{margin:0;font-weight:600}
.wf{display:flex;flex-direction:column;align-items:center}
.wf-node{border:1px solid var(--line);border-radius:12px;padding:12px 16px;width:100%;max-width:520px;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.04)}
.wf-node.ai{border:1px solid transparent;background:linear-gradient(#fff,#fff) padding-box,var(--nacre) border-box}
.wf-node.cond{background:#fbf8f2;border-style:dashed}
.wf-k{font:600 11px var(--sans);letter-spacing:.08em;text-transform:uppercase;color:var(--grey);display:flex;align-items:center;gap:8px}
.wf-node b{display:block;font-weight:600;margin-top:4px}
.wf-link{width:1px;height:20px;background:var(--line-2)}
.wf-split{display:grid;grid-template-columns:1fr 1fr;gap:14px;width:100%;max-width:520px}
.tog{display:inline-block;width:30px;height:18px;border-radius:999px;background:var(--line-2);position:relative;vertical-align:middle}
.tog::after{content:"";position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff}
.tog.on{background:var(--sage)}.tog.on::after{left:14px}
.perm{font-size:15px;text-align:center}
@media (max-width:900px){.photo-row{grid-template-columns:repeat(2,minmax(0,1fr))}.btq{grid-template-columns:1fr}.folders{grid-template-columns:1fr}.facts-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
</style>""")

# ---------- suppliers: real tenderers carry their Coupa code
rep("SUPPLIERS.forEach(s => { s.code = 'EXAMPLE-' + s.id.slice(2); });",
    "SUPPLIERS.forEach(s => { s.code = ['EX15', 'EX16'].includes(s.id) ? s.coupa : 'EXAMPLE-' + s.id.slice(2); });")

# ---------- helpers
rep("  const blkH = (title,", """  const srcPanel = window.srcPanel = (title, meta, img, note) => `<details class="src-panel"><summary><span class="ext xlsx">xlsx</span><span><b>${title}</b><span class="small muted">${meta}</span></span><span class="tag src">Today, in Excel</span></summary><div class="src-body"><p class="small muted" style="margin:0 0 12px">${note}</p><a href="${img}" target="_blank" rel="noopener"><img src="${img}" alt="${title}"></a></div></details>`;
  const blkH = (title,""")

# ---------- document drawer: preview + summaries for the real files
rep("    else ai = 'Summary and tags generated on upload.';",
    """    else if (d.type === 'Tender analysis' && t) ai = 'Statement of rates read package by package (preliminaries, general contractor, MEP, millwork), converted from AUD at 1.8. Totals feed the offer comparison of ' + t.id + '.';
    else if (d.type === 'Tender analysis') ai = 'Awarded value against competitor 1 and 2 for every 2027 package, with the gap in € and %. Panoptic keeps these benchmarks per supplier and per package.';
    else if (d.type === 'Project list') ai = 'One row per project and package: zone, region, project ID, opening and commitment dates, boutique type and concept, retail and façade m², SOP budget. Panoptic takes it over as the project register.';
    else if (d.type === 'Project info') ai = 'Surfaces and display capacity extracted: 678 m² selling, 1,278 m² gross, 445 m² back of house, 553 m² exterior façade; 1,371 women and 440 men SKUs on display.';
    else if (d.type === 'Opening book') ai = 'Opening announcement, 144 slides: façade photos, layout plans by level and key figures.';
    else if (d.type === 'Site photos' && d.img) ai = 'From ARCHITECTURE PHOTOS / 2025 best of on the S: drive. Pushed to Dior DAM with project, concept and area tags.';
    else ai = 'Summary and tags generated on upload.';""")
rep("""      <div class="chips">${d.tags.map(x => `<span class="tag ai">${esc(x)}</span>`).join('')}${req('5.2')}</div>""",
    """      ${d.img ? `<a class="doc-prev" href="${d.img}" target="_blank" rel="noopener"><img src="${d.img}" alt="Preview of ${esc(d.name)}"></a><p class="small muted" style="margin:0 0 12px">Preview from the workshop screen, 9 Nov 2026</p>` : ''}
      <div class="chips">${d.tags.map(x => `<span class="tag ai">${esc(x)}</span>`).join('')}${req('5.2')}</div>""")
rep("${req('5.5', '7.8.1')}", "${req('5.5', '7.8.1', '7.8.4')}")

# ---------- projects page: source table + project sheet on real projects
rep("""      ${body}`;
    return { html, after() { if (state.projView === 'skyline')""",
    """      ${body}
      ${srcPanel('2026 - ADMIN FOLLOW UP.xlsx · sheet 2027', 'The project list as it is kept today, one tab per opening year', 'assets/tbl-admin-follow-up-2027.jpg', 'Panoptic takes over these columns as the project register: zone, region, project ID, opening and commitment dates, months before opening, project and boutique type, boutique concept, retail and façade m², SOP budget. The six 2027 openings in this mockup come from this sheet.')}`;
    return { html, after() { if (state.projView === 'skyline')""")
rep("""<div id="floorInfo">${floorSummary(p)}</div></section>""",
    """<div id="floorInfo">${floorSummary(p)}</div></section>
        ${p.admin ? `<section class="blk">${blkH('Project sheet', 'From 2026 - ADMIN FOLLOW UP, sheet 2027', req('1.1'), '#/projects', 'Source table')}<dl class="facts-grid">${[['Project ID', p.id], ['Opening', dlong(p.admin.opening)], ['Commitment', dlong(p.admin.commitment)], ['Months before opening', p.admin.months + ' months'], ['SOP budget', fin() ? '€' + p.admin.sop.toLocaleString('en-GB') : mask()], ['Boutique type', p.admin.boutique], ['Boutique concept', p.admin.concept], ['Retail', p.admin.retail + ' m²'], ['Interior façade', p.admin.fcInt ? p.admin.fcInt + ' m² · ' + p.admin.fcIntConcept : '—'], ['Exterior façade', p.admin.fcExt ? p.admin.fcExt + ' m² · ' + p.admin.fcExtConcept : '—']].map(x => `<div><dt>${x[0]}</dt><dd>${x[1]}</dd></div>`).join('')}</dl></section>` : ''}""")

# ---------- tenders page: competitors table as it is today
rep("""      <section class="blk">${blkH('All tenders', '')}${tenderTable(list)}</section>`;""",
    """      <section class="blk">${blkH('All tenders', '')}${tenderTable(list)}
      ${srcPanel('2026 - ADMIN FOLLOW UP.xlsx · competitors', 'Awarded cost against competitor 1 and 2, per project and package', 'assets/tbl-competitors-2027.jpg', 'Today the bid benchmark lives in extra columns of the project list. Panoptic stores every offer line by line (T-26-026 for Melbourne Flinders Lane reads the real SOR R2: Legend €12.54M against Redwood €12.47M) and computes the gaps itself.')}</section>`;""")

# ---------- home: concept photos + recently opened
OLD_HOME_PIC = "<div class=\"pic\">${window.TEX.facade(c.id, { floors: 2, wide: true })}</div>"
rep(OLD_HOME_PIC, "<div class=\"pic\">${c.photo ? `<img class=\"ph\" src=\"${c.photo}\" alt=\"\"><span class=\"ref\">${c.ref}</span>` : window.TEX.facade(c.id, { floors: 2, wide: true })}</div>")
rep("<div class=\"strip\">${ps.map(pcard).join('')}</div></section>",
    """<div class="strip">${ps.map(pcard).join('')}</div></section>
    <section class="blk">${blkH('Recently opened', 'ARCHITECTURE PHOTOS / 2025 best of, pushed to Dior DAM', req('5.4', '7.9.5'), '#/library/boutiques', 'Boutiques & photos')}<div class="photo-row">${[['assets/store-bangkok-facade.jpg', 'Bangkok EM Quartier', 'Façade, Women, Men & Salon · Feb 2025'], ['assets/store-bangkok-tryon-pink.jpg', 'Bangkok EM Quartier', 'Women try-on · Feb 2025'], ['assets/store-rodeo-facade-2.jpg', 'Beverly Hills Rodeo Drive', 'Façade, Women & Men · Sept 2025'], ['assets/store-bangkok-tryon-women.jpg', 'Bangkok EM Quartier', 'Women try-on · Feb 2025']].map(x => `<figure><a class="fr" href="#/library/boutiques" style="display:block"><img class="ph" src="${x[0]}" alt="${x[1]}"></a><figcaption><b>${x[1]}</b><span class="muted">${x[2]}</span></figcaption></figure>`).join('')}</div></section>""")

# ---------- library: photos on concept cards + Boutiques tab
rep("<div class=\"pic\">${TEX.facade(c.id, { floors: 2, wide: true })}</div>",
    "<div class=\"pic\">${c.photo ? `<img class=\"ph\" src=\"${c.photo}\" alt=\"\"><span class=\"ref\">${c.ref}</span>` : TEX.facade(c.id, { floors: 2, wide: true })}</div>")
rep("['books', 'Design books', D.BOOKS.length]];", "['books', 'Design books', D.BOOKS.length], ['boutiques', 'Boutiques & photos', D.BOUTIQUES.length]];")
rep("    else body = `<div class=\"filters\"><span class=\"muted small\">Design books",
    "    else if (tab === 'boutiques') body = boutiquesView();\n    else body = `<div class=\"filters\"><span class=\"muted small\">Design books")
rep("  function library(tab) {", """  function boutiquesView() {
    return `<div class="filters"><span class="muted small">Opened boutiques used as references: photos from ARCHITECTURE PHOTOS on the S: drive, plans and project info from the opening books ${req('5.4', '6.5', '6.7')}</span></div>
      ${D.BOUTIQUES.map(b => `<article class="btq"><div><div class="main"><img class="ph" src="${b.photos[0]}" alt="${b.name}"></div><div class="thumbs">${b.photos.slice(1).map(ph => `<a href="${ph}" target="_blank" rel="noopener"><img src="${ph}" alt=""></a>`).join('')}${b.plan ? `<a href="${b.plan}" target="_blank" rel="noopener"><img src="${b.plan}" alt="Layout plan" style="object-fit:contain;background:#fff"></a>` : ''}</div></div>
        <div><span class="tag">${b.opened}</span> <span class="tag src">${C[b.concept].name} façade</span><h3 style="margin-top:12px">${b.name}</h3><p class="muted" style="margin:0 0 16px">${b.scope}</p>
          <dl class="spec">${b.facts.map(f => `<dt>${f[0]}</dt><dd>${f[1]}</dd>`).join('')}</dl>
          ${b.table ? `<figure class="img-frame" style="margin-top:18px"><a href="${b.table}" target="_blank" rel="noopener"><img src="${b.table}" alt="Area calculation and display capacity"></a><figcaption>Project info: estimated display capacity at opening and area calculation</figcaption></figure>` : ''}
          ${b.plan ? `<figure class="img-frame" style="margin-top:18px"><a href="${b.plan}" target="_blank" rel="noopener"><img src="${b.plan}" alt="Layout plan"></a><figcaption>Layout plan, opening announcement (Nov 2025)</figcaption></figure>` : ''}</div></article>`).join('')}
      <section class="blk">${blkH('2025 best of', `${D.DAM_FOLDERS.length} of 56 folders shown · S:\\\\DIOR\\\\ARCHITECTURE PHOTOS`, req('7.1.6'))}<div class="folders">${D.DAM_FOLDERS.map(f => `<span class="${/BANGKOK EM|BEVERLY/.test(f) ? 'has' : ''}">${f}</span>`).join('')}</div>
        <details class="src-panel"><summary><span class="ext jpg">jpg</span><span><b>Architecture (\\\\\\\\parh01-serv20) S: › DIOR › ARCHITECTURE PHOTOS › 2025 best of</b><span class="small muted">The folder as it is today</span></span><span class="tag src">Today, on the server</span></summary><div class="src-body"><img src="assets/dam-2025-best-of-folder.jpg" alt="Folder view"></div></details></section>`;
  }
  function library(tab) {""")

# ---------- concept page: reference photo
rep("""      <section class="grid g-8-4"><div class="stage3d short" id="c3d">""",
    """      ${c.photo ? `<figure class="hero-photo"><img src="${c.photo}" alt="${c.ref}"><figcaption>Reference boutique: ${c.ref} · Architecture photos</figcaption></figure>` : ''}
      <section class="grid g-8-4" style="margin-top:22px"><div class="stage3d short" id="c3d">""")

# ---------- assets: today's material
rep("""<span class="small"><b>226K</b> of 275K files</span></div></section>""",
    """<span class="small"><b>226K</b> of 275K files</span></div>
        <div class="grid g-6-6" style="margin-top:26px;gap:26px"><figure class="img-frame"><img src="assets/slide-department-overview.jpg" alt="Architecture department overview"><figcaption>Architecture department overview: processes, tools and volumes per team (workshop slide)</figcaption></figure>
          <figure class="img-frame"><img src="assets/dam-2025-best-of-folder.jpg" alt="ARCHITECTURE PHOTOS folder"><figcaption>S: › DIOR › ARCHITECTURE PHOTOS › 2025 best of: 56 boutique folders, browsed by hand today</figcaption></figure></div></section>""")

# ---------- platform: administration tab + delivery track
rep("const tabs = [['sources', 'Sources & integration'], ['scope', 'Scope from the backlog']];",
    "const tabs = [['sources', 'Sources & integration'], ['admin', 'Administration'], ['scope', 'Scope from the backlog']];")
rep("    else {\n      const cats = [...new Set(F.map(f => f.cat))], prios = ['P1', 'P2', 'P3', 'P4'];",
    "    else if (tab === 'admin') body = adminView();\n    else {\n      const cats = [...new Set(F.map(f => f.cat))], prios = ['P1', 'P2', 'P3', 'P4'];")
rep("${SHOWN.has(f.id) ? '<span class=\"status s-ok\">Shown</span>' : '<span class=\"muted small\">—</span>'}",
    "${SHOWN.has(f.id) ? '<span class=\"status s-ok\">Shown</span>' : DELIVERY.has(f.id) ? '<span class=\"status s-warn\">Delivery track</span>' : '<span class=\"muted small\">—</span>'}")
rep("  const SHOWN = new Set([", "  const DELIVERY = new Set(['7.1.1', '7.1.7', '7.2.1', '7.2.2', '7.2.3', '7.2.4', '7.2.5', '7.2.6', '7.2.7', '7.3.7', '7.11.1', '7.11.2', '7.11.3', '7.11.4', '7.11.5', '7.11.6', '7.11.7', '7.11.8']);\n  const SHOWN = new Set(['1.3', '1.6', '5.3', '5.4', '7.1.3', '7.1.4', '7.3.1', '7.3.3', '7.3.6', '7.4.1', '7.6.7', '7.6.9', '7.8.4', '7.9.4', '7.9.5', '7.9.6', '7.9.10', '7.10.1', '7.10.2', '7.10.3', '7.10.4', ")
rep("  function platform(tab) {", r"""  function adminView() {
    const perms = [['Procurement Officer', '●', '●', '●', '●', '●', '○'], ['Project Manager', '●', '●', '○', '○', '●', '—'], ['Budget Controller', '●', '●', '○', '○', '○', '○'], ['Finance Manager', '○', '●', '○', '○', '○', '—'], ['Architect', '●', '—', '○', '○', '●', '—'], ['Store Planner', '●', '—', '○', '—', '●', '—'], ['Local architect', '○', '—', '—', '—', '○', '—'], ['General contractor (external)', '○', '—', 'Own bids', '—', 'Shared', '—'], ['Platform admin', '●', '○', '○', '●', '●', '●']];
    const node = (k, t, sub, cls = '') => `<div class="wf-node ${cls}"><span class="wf-k">${k}</span><b>${t}</b>${sub ? `<span class="small muted">${sub}</span>` : ''}</div>`;
    const link = '<span class="wf-link"></span>';
    const flows = [['Tender award', 'Tender evaluated', 3, true], ['Budget amendment', 'Forecast above line', 2, true], ['PO authorisation', 'PO draft in Coupa', 2, true], ['Supplier onboarding', 'New Coupa vendor', 3, false], ['Document publication', 'Drawing or book approved', 1, true]];
    const audit = [['21:14', 'Coupa', 'Synced 42 POs, 3 exceptions on ARC-601421.07', 'System'], ['20:52', 'Cost controller, East', 'Opened offer comparison T-26-026, Melbourne Flinders Lane', 'Procurement'], ['19:30', 'Dior DAM', 'Pushed 12 photos, BANGKOK EM QUARTIER 2025 02', 'System'], ['18:05', 'Platform admin', 'Changed alert threshold, West zone: 5% → 4%', 'Admin'], ['17:41', 'Anaplan', 'Budget v3 imported for 201155, no change on lines', 'System'], ['16:12', 'External · Legend', 'Downloaded SOW v3, T-26-026 (bidder portal)', 'External']];
    return `<section class="blk grid g-7-5"><div>${blkH('Users and roles', 'Sign-in through OKTA with MFA · 186 users · 9 roles', req('7.3.1', '7.3.3', '7.3.4', '7.3.5', '1.6'))}
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Role</th><th style="text-align:center">Projects</th><th style="text-align:center">Costs</th><th style="text-align:center">Tenders</th><th style="text-align:center">Suppliers</th><th style="text-align:center">Documents</th><th style="text-align:center">Admin</th></tr></thead><tbody>${perms.map(r => `<tr><td><b style="font-weight:600">${r[0]}</b></td>${r.slice(1).map(x => `<td class="perm">${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
        <p class="small muted">● edit · ○ view · — no access. Financial data is visible to Finance and Procurement roles only and every access is logged. External access is scoped to one project and expires with the tender.</p>
        <div class="chips" style="margin-top:14px">${['Concept Design & 3D', 'Research & Development', 'Procurement', 'Compliance', 'Project Management', 'Store Planning', 'Finance'].map(t => `<span class="tag">${t}</span>`).join('')}${req('7.4.1', '7.4.2')}</div></div>
      <div>${blkH('Approval workflow', 'Tender award, built without code', req('7.6.7', '7.10.2'))}
        <div class="wf">${node('When', 'A tender moves to Evaluated', 'Any project · any package')}${link}${node('✦ Panoptic Copilot', 'Read every offer against the SOW and the Anaplan line', 'Flags scope gaps, ranks offers, drafts the award note', 'ai')}${link}${node('If', 'Award is more than 5% above the benchmark, or above €1M', 'Threshold set per zone', 'cond')}${link}
          <div class="wf-split">${node('Approve 1', 'Procurement lead', 'Due in 2 days')}${node('Approve 2', 'Budget controller', 'Then Director Architecture above €1M')}</div>${link}${node('Then', 'Raise the PO in Coupa, update the commitment in Anaplan, archive the tender file', '42 runs this quarter · median approval 1.6 days', '')}</div></div></section>
      <section class="blk grid g-6-6"><div>${blkH('Workflows', 'Switch on per zone', req('7.6.6', '7.6.9', '7.10.3'))}<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Workflow</th><th>Trigger</th><th class="r">Steps</th><th>Active</th></tr></thead><tbody>${flows.map(f => `<tr><td><b style="font-weight:600">${f[0]}</b></td><td class="small">${f[1]}</td><td class="r">${f[2]}</td><td><span class="tog ${f[3] ? 'on' : ''}"></span></td></tr>`).join('')}</tbody></table></div>
        <div class="panel" style="margin-top:18px;display:flex;gap:18px;align-items:center;flex-wrap:wrap"><span><b style="font-weight:600">Language</b> ${req('7.10.4')}</span><span class="chip on">English</span><span class="chip">Français</span><span class="small muted" style="margin-left:auto">Questions to Copilot work in both</span></div></div>
        <div>${blkH('Audit log', 'Every change and every data exchange', req('7.9.10', '7.6.1', '7.7.9'))}<ul class="list">${audit.map(a => `<li style="display:grid;grid-template-columns:52px 1fr;gap:12px;padding:11px 0;border-bottom:1px solid var(--line)"><span class="code">${a[0]}</span><span><b style="font-weight:600">${a[1]}</b> · ${a[2]} <span class="tag src" style="margin-left:6px">${a[3]}</span></span></li>`).join('')}</ul></div></section>
      <section class="blk">${blkH('Delivery and run', 'Backlog items with no screen of their own, carried by the delivery plan', req('7.1.1', '7.2.1', '7.11.1'))}<div class="tbl-wrap"><table class="tbl"><thead><tr><th>#</th><th>Item</th><th>Priority</th><th>Where it shows</th></tr></thead><tbody>${[['7.1.1', 'Cloud hosting, dev / staging / prod, containers', 'P1', 'Platform status, Connector console'], ['7.1.7', 'Security architecture: TLS 1.3, secrets, WAF', 'P1', 'Security review before go-live'], ['7.2.1', 'CI/CD pipelines', 'P1', 'Release notes'], ['7.2.2', 'Monitoring and alerting', 'P1', 'Connector status, Sync now'], ['7.2.3', 'Penetration testing (OWASP)', 'P1', 'Mandatory before financial data'], ['7.2.4', 'Backups and disaster recovery', 'P1', 'RTO / RPO in the run book'], ['7.11.1', 'Stakeholder engagement and comms plan', 'P1', 'Architecture, Finance, Procurement, IT'], ['7.11.2', 'UAT framework per module', 'P1', 'Sign-off on cost and tender modules'], ['7.11.3', 'Role-based training', 'P1', 'One path per role, GC and MW included']].map(r => `<tr><td class="code">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="small muted">${r[3]}</td></tr>`).join('')}</tbody></table></div></section>`;
  }
  function platform(tab) {""")
open(P, 'w', encoding='utf-8').write(s)
print('step2 ok')
