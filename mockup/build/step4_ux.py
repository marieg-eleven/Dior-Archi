r"""Step 4 — UX rework: role-based home (My work), lifecycle project tabs with Team & data,
new-project wizard and Excel import, cost search by univers and fixture, Admin with
'Your tools' and 'Data health', Melbourne forecast aligned on the main-contract offers.
Author: Marie Guegain — eleven."""
import sys
P = sys.argv[1]; s = open(P, encoding='utf-8').read()
def rep(a, b, count=1):
    global s
    assert a in s, 'MISSING: ' + a[:110]; s = s.replace(a, b, count)

# ================= DATA =================
# Melbourne: forecast follows the best main-contract offer (Redwood €12.47M, +€523k vs benchmark, MEP-driven)
i = s.index("{ id: '201155', real: true")
j = s.index("over: {} },", i)
s = s[:j] + "over: { '05': 0.28 } }," + s[j + len("over: {} },"):]
rep("  const mil3 = lineOf('100610', '03'), par1 = lineOf('PAR01', '01');",
    "  const mil3 = lineOf('100610', '03'), par1 = lineOf('PAR01', '01');\n  const mel = PROJECTS.find(p => p.id === '201155'), melMep = lineOf('201155', '05');")
rep("    { id: 'A3',",
    "    { id: 'A7', level: 'warning', kind: 'Budget', title: 'Melbourne forecast above budget after the main-contract offers', body: `The best offer (Redwood, €12.47M) is €523k above the €11.95M benchmark, driven by MEP (+€1.19M). ARC-201155.05 now forecasts €${melMep.forecast.toLocaleString('en-GB')}k for €${melMep.budget.toLocaleString('en-GB')}k. Project forecast €${(mel.forecast / 1000).toFixed(2)}M, +${(mel.variancePct * 100).toFixed(1)}% on the SOP budget. A budget amendment is waiting for approval.`, project: '201155', link: '#/tender/T-26-026', src: ['SOR R2', 'Anaplan'], req: '2.4' },\n    { id: 'A3',")
# univers x fixture cost items (7.5.3)
rep("  const TENDER_STAGES = ['Draft',", r"""  /* ---------- Cost items by univers and fixture (financial search 7.5.3) ---------- */
  const UNIVERS = ['Women RTW', 'Bags', 'SLG', 'Shoes', 'CJ', 'Fine Jewellery', 'Men', 'Maison'];
  const UNI_SHARE = { 'Women RTW': 0.2, Bags: 0.17, SLG: 0.09, Shoes: 0.09, CJ: 0.09, 'Fine Jewellery': 0.1, Men: 0.2, Maison: 0.06 };
  const FIXTURES = { '01': [['Wall fixtures', 'lm', 4200], ['Vitrines & niches', 'unit', 9800], ['Cash wrap', 'unit', 38000]], '06': [['Display tables', 'unit', 7600], ['Seating', 'unit', 5200]], '04': [['Lighting', 'm²', 310]], '02': [['Flooring', 'm²', 420]] };
  const UNI_PRICE = { 'Women RTW': 0.95, Bags: 1.14, SLG: 1.02, Shoes: 0.97, CJ: 1.06, 'Fine Jewellery': 1.38, Men: 0.92, Maison: 0.88 };
  const COST_ITEMS = [];
  PROJECTS.forEach(p => {
    const r = rng(hash(p.id + 'uni'));
    const uni = UNIVERS.filter(u => !(u === 'Fine Jewellery' && /FSS/.test(p.type))).filter(u => !(u === 'Men' && /jewellery/i.test(p.type)));
    const tot = uni.reduce((a, u) => a + UNI_SHARE[u], 0);
    p.lines.filter(l => FIXTURES[l.short]).forEach(l => {
      const fx = FIXTURES[l.short];
      uni.forEach(u => fx.forEach((f, k) => {
        const amount = Math.round(l.forecast * UNI_SHARE[u] / tot / fx.length * (0.8 + r() * 0.4));
        if (amount < 4) return;
        const unitPrice = Math.round(f[2] * UNI_PRICE[u] * (p.zone === 'East' ? 1.08 : 1) * (0.9 + r() * 0.2));
        const po = l.pos.length ? l.pos[k % l.pos.length] : null;
        COST_ITEMS.push({ project: p.id, univers: u, fixture: f[0], unit: f[1], unitPrice, qty: Math.max(1, Math.round(amount * 1000 / unitPrice)), amount, line: l.code, supplier: po ? po.supplier : null, concept: p.concept, zone: p.zone, status: p.status });
      }));
    });
  });

  const TENDER_STAGES = ['Draft',""")
rep("window.DATA = { BOUTIQUES, DAM_FOLDERS, TODAY,", "window.DATA = { UNIVERS, COST_ITEMS, BOUTIQUES, DAM_FOLDERS, TODAY,")

# ================= CSS =================
rep("</style>", r"""
/* --- v0.3 UX --- */
.mywork{margin-top:30px;max-width:560px}
.mywork .blk-h{margin-bottom:6px}
.row.mw{display:grid;grid-template-columns:76px minmax(0,1fr) 62px;gap:12px;align-items:center;padding:11px 0;border-bottom:1px solid var(--line)}
.mw .tag{justify-content:center}
.mw .t b{display:block;font-weight:600;font-size:14.5px;line-height:1.3}
.mw .t span{display:block;font-size:12.5px;color:var(--grey);margin-top:2px}
.mw .due{font-size:12.5px;text-align:right;color:var(--grey)}
.mw .due.soon{color:var(--rouge);font-weight:600}
.hero .display.work{font-size:clamp(34px,3.4vw,50px)}
.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 16px}
.form-grid.three{grid-template-columns:repeat(3,minmax(0,1fr))}
.fld{display:flex;flex-direction:column;gap:6px;font-size:12.5px;color:var(--grey)}
.fld input,.fld select{font:inherit;font-size:14px;color:var(--ink);border:1px solid var(--line-2);border-radius:8px;padding:9px 10px;background:#fff}
.fld .sync{color:var(--sage);font-weight:600}
.np-steps{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:10px 0 22px}
.np-steps span{font-size:12px;color:var(--grey);border-top:3px solid var(--line);padding-top:8px}
.np-steps span.on{color:var(--ink);border-color:var(--ink);font-weight:600}
.np-steps span.done{border-color:var(--stone)}
.opt{border:1px solid var(--line);border-radius:12px;padding:14px 16px;display:block;margin-bottom:10px;background:#fff}
.opt.on{border-color:var(--ink);box-shadow:0 0 0 1px var(--ink)}
.opt b{display:block;font-weight:600;margin-bottom:2px}
.np-foot{display:flex;gap:10px;justify-content:space-between;align-items:center;margin-top:24px;padding-top:16px;border-top:1px solid var(--line)}
.checklist{list-style:none;margin:0;padding:0}
.checklist li{display:grid;grid-template-columns:22px 1fr auto;gap:10px;padding:10px 0;border-bottom:1px solid var(--line);font-size:14px}
.checklist li::before{content:"✓";color:var(--sage);font-weight:700}
.uni-bar{display:grid;grid-template-columns:120px 1fr 92px;gap:12px;align-items:center;padding:8px 0;border-bottom:1px solid var(--line);font-size:13.5px}
.uni-bar i{display:block;height:8px;border-radius:4px;background:var(--ink)}
.uni-bar .t{text-align:right;font-weight:600}
.drop{border:1.5px dashed var(--line-2);border-radius:14px;padding:22px;text-align:center;color:var(--grey);margin-bottom:18px;background:var(--mist)}
.ws{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.ws div{border:1px solid var(--line);border-radius:12px;padding:12px 14px;display:flex;align-items:center;gap:12px;background:#fff}
.ws div span{flex:1;min-width:0}
.ws b{display:block;font-weight:600;font-size:13.5px}
.ws code{font-size:12px;color:var(--grey);word-break:break-all}
.newbtn{height:38px;padding:0 16px;border-radius:999px;border:1px solid var(--line-2);background:#fff;font:500 14px var(--sans);cursor:pointer;margin-right:4px}
.newbtn:hover{border-color:var(--ink)}
@media (max-width:900px){.form-grid,.form-grid.three,.ws{grid-template-columns:1fr}.np-steps{grid-template-columns:repeat(5,minmax(0,1fr))}}
</style>""")

# ================= VIEWS (first IIFE) =================
rep("const state = { role: D.ROLES[0],", "const state = { costView: 'overview', cu: new Set(), cfx: 'All', cconcept: 'All', np: 1, npSrc: 'anaplan', role: D.ROLES[0],")

# --- home: role-based "My work" first
rep("  function home() {\n", r"""  function myWork() {
    const W = {
      proc: [['Approve', 'Award the Melbourne main contract (T-26-026)', 'Redwood €12.47M against Legend €12.54M · MEP gap to clarify', '2026-11-20', '#/tender/T-26-026'], ['Review', 'Scope gap in the Melbourne stone offers', 'Waterproofing missing from the lowest bid (T-26-031)', '2026-11-18', '#/tender/T-26-031'], ['Match', '3 Coupa invoices without a budget line', 'Ras Al Khaimah Wynn · suggestion ready', '2026-11-14', '#/cost'], ['Confirm', 'Copenhagen project sheet', 'Last confirmed 34 days ago', '2026-11-13', '#/project/401111/data'], ['Renew', 'Master agreement with EXAMPLE-04', 'Ends 20 Dec · Diorlex', '2026-12-01', '#/supplier/EX04']],
      pm: [['Confirm', 'Copenhagen project sheet', 'Last confirmed 34 days ago', '2026-11-13', '#/project/401111/data'], ['Approve', 'Award the Melbourne main contract', 'Second approver after Procurement', '2026-11-20', '#/tender/T-26-026'], ['Upload', 'Sanya Swire GA plans, rev 13', 'Two versions of the façade elevation to reconcile', '2026-11-17', '#/project/300407/documents'], ['Publish', 'Kuala Lumpur site photos, November', 'To Dior DAM', '2026-11-21', '#/project/200769/documents']],
      bc: [['Approve', 'Budget amendment, Melbourne MEP', 'From the main-contract offers · ARC-201155.05', '2026-11-19', '#/project/201155/costs'], ['Decide', 'Los Cabos façade change order', '21% above its budget line', '2026-11-15', '#/project/100610/costs'], ['Match', '3 Coupa invoices without a budget line', 'Ras Al Khaimah Wynn · suggestion ready', '2026-11-14', '#/cost'], ['Refresh', 'Monthly forecast to Anaplan', 'Push committed and forecast to v4', '2026-11-28', '#/cost']],
      arch: [['Review', 'Sanya façade elevation, rev12 or rev12b', 'Keep one as the reference', '2026-11-17', '#/project/300407/documents'], ['Validate', 'Alternative quarry for Melbourne stone', 'Sample approval for Pietra Lunare', '2026-11-16', '#/tender/T-26-031'], ['Update', 'Women boutique design book, v4.3', 'Two materials replaced', '2026-11-25', '#/library/books']],
      sp: [['Confirm', 'Copenhagen surfaces and display capacity', 'Before the main-works tender', '2026-11-13', '#/project/401111/data'], ['Brief', 'Singapore shop-in-shop', 'Survey and schedule to upload', '2026-11-26', '#/project/SIN11']],
      gc: [['Clarify', 'MEP pricing, Melbourne main contract', 'Fire services and plumbing allowances', '2026-11-18', '#/tender/T-26-026'], ['Download', 'SOW v3 and drawings', 'Main-contract package', '2026-11-14', '#/tender/T-26-026']]
    };
    return W[state.role.id] || W.proc;
  }
  function home() {
    const mw = myWork();
""")
rep("""        <h1 class="display">The whole architecture portfolio, in one view.</h1>
        <p class="lede">Budgets from Anaplan, orders from Coupa, tenders, drawings and the design library, linked project by project. Ask a question in English or French.</p>""",
    """        <h1 class="display work">${mw.length} things need you this week.</h1>""")
rep("""<div class="ask-ex">${EXAMPLES.map(e => `<button type="button" data-q="${esc(e)}">${esc(e)}</button>`).join('')}</div>""",
    """<div class="mywork">${blkH('My work', `${esc(state.role.name)} · approvals, checks and updates`, req('7.7.1', '7.6.6'))}<ul class="list">${mw.map(w => { const n = days(w[3]); return `<li><a class="row mw" href="${w[4]}"><span class="tag ${w[0] === 'Approve' ? 'ai' : ''}">${w[0]}</span><span class="t"><b>${esc(w[1])}</b><span>${esc(w[2])}</span></span><span class="due ${n <= 4 ? 'soon' : ''}">${n <= 0 ? 'Today' : n === 1 ? 'Tomorrow' : 'In ' + n + ' days'}</span></a></li>`; }).join('')}</ul></div>""")

# --- projects page: creation and Excel round-trip
rep("""        <div class="actions">${seg('pview',""",
    """        <div class="actions"><button class="btn ghost" data-act="np-import">Import from Excel</button><button class="btn ghost" data-act="export" data-v="the project register (ADMIN FOLLOW UP columns, .xlsx)">Export to Excel</button><button class="btn" data-act="np-open">New project</button>${seg('pview',""")

# --- project tabs in working order, plus Team & data
rep("const tabs = [['overview', 'Overview'], ['costs', 'Costs', p.lines.length], ['tenders', 'Tenders', pTenders.length], ['documents', 'Documents', pDocs.length], ['materials', 'Materials & assets', p.mats.length], ['suppliers', 'Suppliers', p.suppliers.length]];",
    "const tabs = [['overview', 'Overview'], ['costs', 'Budget & costs', p.lines.length], ['tenders', 'Tenders', pTenders.length], ['suppliers', 'Suppliers', p.suppliers.length], ['documents', 'Drawings & documents', pDocs.length], ['materials', 'Design & materials', p.mats.length], ['data', 'Team & data']];")
rep("    else if (tab === 'documents') body =", "    else if (tab === 'data') body = projectData(p);\n    else if (tab === 'documents') body =")
rep("  function project(id, tab) {", r"""  function projectData(p) {
    const r = D.rng(D.hash(p.id + 'fresh'));
    const sheetAge = p.id === '401111' ? 34 : 2 + Math.floor(r() * 12);
    const rows = [
      ['Project sheet', 'Identity, dates, surfaces, concept', 'Panoptic (replaces the ADMIN FOLLOW UP row)', 'Project manager', sheetAge, 30, 'Confirm'],
      ['Budget', 'SOP budget, budget lines, amendments', 'Anaplan', 'Budget controller', 0, 7, 'Open in Anaplan'],
      ['Orders & invoices', 'POs, invoices, suppliers', 'Coupa', 'Automatic', 0, 1, 'Open in Coupa'],
      ['Tenders', 'SOW, offers, statement of rates, award', 'Panoptic · tender mailbox in Outlook', 'Procurement officer', 1 + Math.floor(r() * 6), 14, 'Open'],
      ['Drawings', 'GA plans, elevations (DWG, PDF)', 'Design release server', 'Architect', 1 + Math.floor(r() * 10), 30, 'Open folder'],
      ['Documents', 'Minutes, technical sheets', 'R&P SharePoint, project site', 'Everyone', Math.floor(r() * 4), 30, 'Open in SharePoint'],
      ['Photos', 'Site and opening photos', 'Dior DAM', 'Project manager', 2 + Math.floor(r() * 20), 60, 'Open in DAM'],
      ['Contracts', 'Master agreements, project contracts', 'Diorlex', 'Legal', 5 + Math.floor(r() * 40), 90, 'Open in Diorlex']];
    const ago = n => n === 0 ? 'Synced today' : n === 1 ? 'Yesterday' : n + ' days ago';
    const slug = p.city.toLowerCase().replace(/[^a-z]+/g, '-');
    const ws = [['SharePoint project site', `/sites/RP-Architecture/${p.id}`], ['Server folder', `S:\\DIOR\\PROJECTS\\${p.id}_${p.city.replace(/\s+/g, '_')}`], ['Design release server', `\\\\release\\architecture\\${p.id}`], ['Teams channel', `Architecture · #${slug}`], ['Coupa project', `ARC-${p.id}`], ['Anaplan project', `ARC-${p.id} · version 3`], ['Dior DAM album', `Architecture › ${p.city}`], ['Excel', 'ADMIN FOLLOW UP row, export and re-import']];
    const team = [['Project manager', `PM, ${p.zone} zone`, 'Edit'], ['Architect', 'Concept Design & 3D', 'Edit'], ['Store planner', 'Store Planning', 'Edit'], ['Budget controller', 'Finance', 'Edit · financial data'], ['Procurement officer', `Procurement, ${p.zone}`, 'Edit · financial data'], ['Local architect', p.country, 'View · drawings and documents'], [p.id === '201155' ? 'Legend, Redwood (external)' : 'General contractor (external)', 'Bidder portal', p.id === '201155' ? 'Own bids · until 20 Nov 2026' : 'Shared documents · until handover']];
    return `<section class="blk grid g-7-5"><div>${blkH('Where each piece of data lives', 'One owner and one source per block. Panoptic reads, links and flags what is out of date.', req('7.1.2', '7.8.4', '7.6.6'))}
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Data</th><th>System of record</th><th>Owner</th><th>Last update</th><th></th></tr></thead><tbody>${rows.map(x => { const stale = x[4] > x[5]; return `<tr><td><b style="font-weight:600">${x[0]}</b><div class="small muted">${x[1]}</div></td><td class="small">${x[2]}</td><td class="small">${x[3]}</td><td>${stale ? `<span class="status s-warn">${ago(x[4])}</span>` : `<span class="status s-ok">${ago(x[4])}</span>`}</td><td>${stale ? `<button class="btn sm" data-act="req-update" data-v="${x[0]}|${x[3]}">Ask to confirm</button>` : `<button class="btn sm ghost" data-act="open-tool" data-v="${x[6]}">${x[6]}</button>`}</td></tr>`; }).join('')}</tbody></table></div>
        <p class="small muted" style="margin-top:12px">Rule: a block older than its limit (30 days for the project sheet, 7 for the budget) sends a confirmation request to its owner in Teams. Confirming takes one click when nothing changed.</p></div>
      <div>${blkH('Team and access', 'From OKTA groups', req('7.4.4', '7.3.4'))}<ul class="list">${team.map(t => `<li style="display:grid;grid-template-columns:1fr auto;gap:10px;padding:11px 0;border-bottom:1px solid var(--line)"><span><b style="font-weight:600">${t[0]}</b><span class="small muted" style="display:block">${t[1]}</span></span><span class="small muted" style="text-align:right">${t[2]}</span></li>`).join('')}</ul>
        <button class="btn sm ghost" style="margin-top:12px" data-act="open-tool" data-v="the team editor">Add someone</button></div></section>
      <section class="blk">${blkH('Connected workspaces', 'Created with the project. Files stay where the team works today; Panoptic indexes and links them.', req('7.9.4', '7.9.5', '5.3'))}<div class="ws">${ws.map(w => `<div><span><b>${w[0]}</b><code>${esc(w[1])}</code></span><button class="btn sm ghost" data-act="open-tool" data-v="${w[0]}">Open</button></div>`).join('')}</div></section>`;
  }
  function project(id, tab) {""")

# --- cost control: overview / search by univers
rep("""<div class="actions"><div class="seg">${['All', 'West', 'East'].map(z => `<button class="${state.costZone === z ? 'on' : ''}" data-act="czone" data-v="${z}">${z === 'All' ? 'All zones' : z}</button>`).join('')}</div>""",
    """<div class="actions"><div class="seg">${[['overview', 'Overview'], ['search', 'Search by univers & fixture']].map(z => `<button class="${state.costView === z[0] ? 'on' : ''}" data-act="cview" data-v="${z[0]}">${z[1]}</button>`).join('')}</div><div class="seg">${['All', 'West', 'East'].map(z => `<button class="${state.costZone === z ? 'on' : ''}" data-act="czone" data-v="${z}">${z === 'All' ? 'All zones' : z}</button>`).join('')}</div>""")
rep("    if (!fin()) return { html: head + restricted('Cost control') };",
    "    if (!fin()) return { html: head + restricted('Cost control') };\n    if (state.costView === 'search') return { html: head + costSearch(all) };")
rep("  function cost() {", r"""  function costSearch(all) {
    const ids = new Set(all.map(p => p.id));
    const base = D.COST_ITEMS.filter(i => ids.has(i.project));
    const items = base.filter(i => (!state.cu.size || state.cu.has(i.univers)) && (state.cfx === 'All' || i.fixture === state.cfx) && (state.cconcept === 'All' || i.concept === state.cconcept));
    const sum = a => a.reduce((x, i) => x + i.amount, 0);
    const byU = D.UNIVERS.map(u => ({ u, v: sum(items.filter(i => i.univers === u)) })).filter(x => x.v > 0);
    const max = Math.max(1, ...byU.map(x => x.v)), tot = sum(items);
    const fixtures = [...new Set(base.map(i => i.fixture))];
    const unis = byU.map(x => x.u);
    const avg = (f, u) => { const L = items.filter(i => i.fixture === f && i.univers === u); return L.length ? Math.round(L.reduce((a, i) => a + i.unitPrice, 0) / L.length) : null; };
    const unitOf = f => (base.find(i => i.fixture === f) || {}).unit;
    const top = items.slice().sort((a, b) => b.amount - a.amount).slice(0, 12);
    const chips = D.UNIVERS.map(u => `<button class="chip ${state.cu.has(u) ? 'on' : ''}" data-act="cuni" data-v="${u}">${u}</button>`).join('');
    return `<div class="filters"><span class="lbl">Univers</span><button class="chip ${state.cu.size ? '' : 'on'}" data-act="cuni" data-v="">All</button>${chips}
        <select class="select" data-input="cfx" aria-label="Fixture" style="margin-left:8px"><option value="All">Any fixture</option>${fixtures.map(f => `<option ${state.cfx === f ? 'selected' : ''}>${f}</option>`).join('')}</select>
        <select class="select" data-input="cconcept" aria-label="Façade concept"><option value="All">Any façade concept</option>${D.CONCEPTS.map(c => `<option value="${c.id}" ${state.cconcept === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select>
        <span class="muted small" style="margin-left:auto">${items.length} cost lines · ${kE(tot)} ${req('7.5.3')}</span></div>
      <section class="blk grid g-6-6" style="margin-top:8px"><div>${blkH('Spend by univers', 'Forecast, all fixtures selected')}${byU.map(x => `<div class="uni-bar"><span>${x.u}</span><span><i style="width:${Math.round(x.v / max * 100)}%"></i></span><span class="t">${kE(x.v)}</span></div>`).join('') || '<p class="muted">No cost line for this selection.</p>'}
          <div class="ai-box" style="margin-top:22px;padding:16px 18px"><p style="margin:0">Ask in plain words, for example <button class="chip" data-q="Bags wall fixtures in the East zone, cost per linear metre">Bags wall fixtures in the East, € per lm</button> <button class="chip" data-q="Compare CJ vitrines between Melbourne and Copenhagen">CJ vitrines, Melbourne vs Copenhagen</button></p></div></div>
        <div>${blkH('Unit cost benchmark', 'Average across projects, by fixture and univers')}<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Fixture</th>${unis.map(u => `<th class="r">${u}</th>`).join('')}</tr></thead><tbody>${fixtures.filter(f => state.cfx === 'All' || f === state.cfx).map(f => `<tr><td><b style="font-weight:600">${f}</b><div class="small muted">€ per ${unitOf(f)}</div></td>${unis.map(u => { const a = avg(f, u); return `<td class="r">${a ? a.toLocaleString('en-GB') : '—'}</td>`; }).join('')}</tr>`).join('')}</tbody></table></div></div></section>
      <section class="blk">${blkH('Cost lines', 'Largest first · each line opens its project budget', '', '', '')}<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Project</th><th>Univers</th><th>Fixture</th><th class="r">Quantity</th><th class="r">Unit cost</th><th class="r">Forecast</th><th>Supplier</th><th>Budget line</th></tr></thead><tbody>${top.map(i => `<tr class="click" data-href="#/project/${i.project}/costs"><td><b>${P[i.project].city}</b></td><td>${i.univers}</td><td>${i.fixture}</td><td class="r">${i.qty.toLocaleString('en-GB')} ${i.unit === 'unit' ? (i.qty > 1 ? 'units' : 'unit') : i.unit}</td><td class="r">€${i.unitPrice.toLocaleString('en-GB')}</td><td class="r">${kE(i.amount)}</td><td class="small">${i.supplier ? sup(i.supplier).name : '—'}</td><td class="code">${i.line}</td></tr>`).join('')}</tbody></table></div></section>`;
  }
  function cost() {""")
s = s.replace("A.openPalette = openPalette;", "A.openPalette = openPalette;", 1)

# ================= SHELL (second IIFE) =================
rep("const NAV = [['#/projects', 'Projects'], ['#/cost', 'Cost control'], ['#/tenders', 'Tenders'], ['#/suppliers', 'Suppliers'], ['#/assets', 'Assets'], ['#/library', 'Design library'], ['#/platform', 'Platform']];",
    "const NAV = [['#/home', 'Home'], ['#/projects', 'Projects'], ['#/cost', 'Cost control'], ['#/tenders', 'Tenders'], ['#/suppliers', 'Suppliers'], ['#/assets', 'Documents'], ['#/library', 'Library'], ['#/platform', 'Admin']];")
rep("""<div class="top-r"><button class="ask-btn" data-act="palette\"""", """<div class="top-r"><button class="newbtn" data-act="new-menu">+ New</button><button class="ask-btn" data-act="palette\"""")
rep("<h1>Assets & documents</h1>", "<h1>Documents</h1>")
rep("<h1>Platform</h1><p class=\"sub\">The sources Panoptic connects to, and the scope of the 2026 backlog. Turn on “Backlog IDs” in the header to see which feature each screen illustrates.</p>",
    "<h1>Admin</h1><p class=\"sub\">How Panoptic works with the tools the team already uses, how its data stays current, and who can do what. Turn on “ID” in the header to see the backlog feature behind each screen.</p>")
rep("    tab = tab || 'sources';\n    const tabs = [['sources', 'Sources & integration'], ['admin', 'Administration'], ['scope', 'Scope from the backlog']];",
    "    tab = tab || 'tools';\n    const tabs = [['tools', 'Your tools'], ['health', 'Data health'], ['sources', 'Integrations'], ['admin', 'Roles & workflows'], ['scope', 'Backlog coverage']];")
i = s.index("  function platform(tab) {")
j = s.index("    let body = '';\n    if (tab === 'sources')", i)
s = s[:j] + "    let body = '';\n    if (tab === 'tools') body = toolsView();\n    else if (tab === 'health') body = healthView();\n    else if (tab === 'sources')" + s[j + len("    let body = '';\n    if (tab === 'sources')"):]
rep("  function platform(tab) {", r"""  function toolsView() {
    const rows = [
      ['Excel', 'ADMIN FOLLOW UP, statements of rates, cost studies', 'Panoptic becomes the project register. Exports keep the ADMIN FOLLOW UP columns; an edited file can be re-imported and every change is shown before it is applied.', 'Keep Excel for analysis; stop copying figures by hand.'],
      ['Anaplan', 'Budget plans and forecasts', 'Stays the budget of record. Panoptic reads the lines and pushes committed and forecast back.', 'Budget amendments are approved in Panoptic, then land in Anaplan.'],
      ['Coupa', 'POs, invoices, supplier master', 'Stays the purchasing system. Panoptic reads POs and invoices and raises the draft PO at award.', 'No double entry. Unmatched invoices get a suggested budget line.'],
      ['R&P SharePoint', 'Documents, technical data, admin files', 'Stays the storage. Each project gets its site with the standard folder tree; Panoptic indexes and tags every file.', 'Save files as today. Search and context come from Panoptic.'],
      ['S: drive and design release server', 'DWG, PDF, concept files, photos', 'Read in place. New revisions are detected and linked to the project; photos are pushed to the DAM.', 'Architects keep AutoCAD and their folders.'],
      ['Outlook', 'Tender returns and supplier mail', 'Each tender has a mailbox. Returns sent there are filed, read and added to the comparison.', 'Bidders keep sending by e-mail.'],
      ['Teams', 'Daily coordination', 'Alerts, approvals and update requests arrive in Teams and can be answered there.', 'Approve an award or confirm a sheet without opening Panoptic.'],
      ['Diorlex', 'Contracts and master agreements', 'Stays the legal record. Panoptic links agreements to suppliers and warns before they expire.', 'Nothing changes for Legal.'],
      ['Power BI', 'Group reporting', 'Reads Panoptic through a secure connector.', 'Existing reports can switch source progressively.']];
    const week = [['Monday', 'Anaplan and Coupa sync overnight. My work lists what changed for you.'], ['Tender day', 'Bidders e-mail their offers to the tender mailbox. Panoptic files them, reads the SOR and updates the comparison.'], ['Award', 'Two approvals in Teams. Panoptic raises the PO in Coupa and the commitment in Anaplan.'], ['Month end', 'Owners confirm their blocks in one click. The steering note is drafted from live data.']];
    return `<section class="blk">${blkH('What stays, what changes', 'Panoptic sits on top of the current tools. Each one stays the record for what it owns.', req('7.1.2', '7.9.1'))}<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Tool</th><th>Used today for</th><th>With Panoptic</th><th>For the team</th></tr></thead><tbody>${rows.map(r => `<tr><td><b style="font-weight:600">${r[0]}</b></td><td class="small">${r[1]}</td><td class="small">${r[2]}</td><td class="small muted">${r[3]}</td></tr>`).join('')}</tbody></table></div></section>
      <section class="blk grid g-6-6"><div>${blkH('A week with Panoptic', '')}<ol style="margin:0;padding-left:20px">${week.map(w => `<li style="padding:8px 0"><b style="font-weight:600">${w[0]}.</b> ${w[1]}</li>`).join('')}</ol></div>
        <div>${blkH('Excel round-trip', 'For teams that want to keep working in Excel', req('2.7', '7.1.6'))}<ul class="checklist"><li><span>Export the project register in the ADMIN FOLLOW UP layout</span><span class="small muted">.xlsx</span></li><li><span>Edit offline, re-import: changes are listed and approved one by one</span><span class="small muted">audit log</span></li><li><span>Budget figures stay read-only: they come from Anaplan</span><span class="small muted">source of truth</span></li></ul><button class="btn sm ghost" style="margin-top:14px" data-act="np-import">Try an import</button></div></section>`;
  }
  function healthView() {
    const ps = D.PROJECTS.filter(p => visIds().has(p.id));
    const rows = ps.map(p => { const r = D.rng(D.hash(p.id + 'fresh')); const age = p.id === '401111' ? 34 : 2 + Math.floor(r() * 12); const missing = p.admin ? 0 : 2 + Math.floor(r() * 3); const untagged = Math.floor(r() * 9); const unmatched = p.id === '601421' ? 3 : 0; const score = Math.max(55, 100 - missing * 6 - (age > 30 ? 12 : 0) - untagged - unmatched * 4); return { p, age, missing, untagged, unmatched, score }; }).sort((a, b) => a.score - b.score);
    const avg = Math.round(rows.reduce((a, x) => a + x.score, 0) / rows.length);
    return `<section class="blk">${blkH('Data health', `Average ${avg}% · checked every night`, req('7.8.4', '7.6.6', '7.10.2'))}<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Project</th><th class="r">Health</th><th>Project sheet</th><th class="r">Missing fields</th><th class="r">Files to tag</th><th class="r">Invoices to match</th><th></th></tr></thead><tbody>${rows.map(x => `<tr><td><b>${x.p.city}</b> <span class="code">ARC-${x.p.id}</span></td><td class="r"><b style="font-weight:600;color:${x.score < 80 ? 'var(--rouge)' : x.score < 90 ? 'var(--ochre)' : 'var(--sage)'}">${x.score}%</b></td><td>${x.age > 30 ? `<span class="status s-warn">${x.age} days old</span>` : `<span class="status s-ok">Confirmed ${x.age} days ago</span>`}</td><td class="r">${x.missing || '—'}</td><td class="r">${x.untagged || '—'}</td><td class="r">${x.unmatched || '—'}</td><td><a class="btn sm ghost" href="#/project/${x.p.id}/data">Open</a></td></tr>`).join('')}</tbody></table></div>
        <div style="display:flex;gap:10px;margin-top:16px"><button class="btn" data-act="req-update" data-v="all stale blocks|their owners">Send confirmation requests</button><button class="btn ghost" data-act="export" data-v="data health report">Export</button></div></section>
      <section class="blk">${blkH('Rules that keep the data current', 'Edited here, without code', req('7.10.2'))}<div class="tbl-wrap"><table class="tbl"><thead><tr><th>When</th><th>Panoptic does</th><th>Active</th></tr></thead><tbody>${[['A project sheet is older than 30 days', 'Asks the project manager to confirm, in Teams'], ['A drawing gets a new revision on the server', 'Links it to the project and notifies the materials owner'], ['A Coupa PO has no budget line', 'Suggests one; the budget controller confirms'], ['A tender is awarded', 'Archives the tender file and starts the contract record in Diorlex'], ['A file lands in a project folder', 'Tags it by type, supplier and budget line'], ['Opening is less than 60 days away', 'Checks that photos, as-built drawings and handover documents are planned']].map(r => `<tr><td>${r[0]}</td><td class="small">${r[1]}</td><td><span class="tog on"></span></td></tr>`).join('')}</tbody></table></div></section>`;
  }
  function npHTML() {
    const st = state.np, steps = ['Start', 'Programme', 'Budget', 'Team', 'Workspace'];
    let body = '';
    if (st === 1) body = `${[['anaplan', 'From an Anaplan project code', 'The code, name, zone and SOP budget come from Anaplan and stay in sync.'], ['excel', 'From the ADMIN FOLLOW UP file', 'Pick one or several rows; Panoptic maps the columns.'], ['blank', 'From scratch', 'For a brief that has no budget code yet.']].map(o => `<button class="opt ${state.npSrc === o[0] ? 'on' : ''}" style="width:100%;text-align:left;cursor:pointer" data-act="np-src" data-v="${o[0]}"><b>${o[1]}</b><span class="small muted">${o[2]}</span></button>`).join('')}
        ${state.npSrc === 'anaplan' ? `<div class="form-grid" style="margin-top:6px"><label class="fld">Anaplan project code<input value="ARC-201390"></label><label class="fld">Found in Anaplan<input value="New boutique · Asia · SOP €6.20M" readonly></label></div>` : ''}`;
    else if (st === 2) body = `<div class="form-grid three"><label class="fld">Project ID <span class="sync">↻ Anaplan</span><input value="201390" readonly></label><label class="fld">Name<input value="New boutique (example)"></label><label class="fld">City<input value=""  placeholder="City"></label>
        <label class="fld">Zone and region<select><option>East · Asia</option><option>East · South Asia</option><option>West · Europe</option><option>West · Americas</option><option>West · MEA</option></select></label><label class="fld">Project type<select><option>New</option><option>Expansion</option><option>Relocation</option><option>Renovation</option><option>Temporary</option></select></label><label class="fld">Boutique type<select><option>FSS</option><option>Flag</option><option>SIS</option></select></label>
        <label class="fld">Boutique concept<select><option>PMA by Dior</option><option>PMA Lite</option></select></label><label class="fld">Commitment date<input type="date" value="2026-12-01"></label><label class="fld">Opening date<input type="date" value="2027-11-30"></label>
        <label class="fld">Retail m²<input value="420"></label><label class="fld">Interior façade m²<input value="60"></label><label class="fld">Exterior façade m²<input value=""></label></div>
        <p class="small" style="margin:18px 0 8px"><b style="font-weight:600">Univers in the boutique</b></p><div class="chips">${D.UNIVERS.map((u, i) => `<span class="chip ${i < 6 ? 'on' : ''}">${u}</span>`).join('')}<span class="chip">Parfums</span></div>`;
    else if (st === 3) body = `<div class="form-grid"><label class="fld">SOP budget <span class="sync">↻ Anaplan</span><input value="€6,200,000" readonly></label><label class="fld">Budget template<select><option>FSS · PMA by Dior</option><option>Flag · PMA by Dior</option><option>FSS · PMA Lite</option></select></label></div>
        <div class="tbl-wrap" style="margin-top:16px"><table class="tbl"><thead><tr><th>Budget line</th><th class="r">Share</th><th class="r">Budget</th></tr></thead><tbody>${[['01 Millwork & fixtures', 26], ['02 Stone & flooring', 14], ['03 Façade & glazing', 12], ['04 Lighting', 7], ['05 MEP & HVAC', 13], ['06 Furniture FF&E', 9], ['07 General works', 12], ['08 Fees & consultants', 5], ['09 Contingency', 2]].map(l => `<tr><td>${l[0]}</td><td class="r">${l[1]}%</td><td class="r">€${(6200 * l[1] / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}k</td></tr>`).join('')}</tbody></table></div><p class="small muted">Lines are created in Anaplan under ARC-201390 once approved.</p>`;
    else if (st === 4) body = `<div class="form-grid">${[['Project manager', 'PM, East zone'], ['Architect', 'Concept Design & 3D'], ['Store planner', 'Store Planning'], ['Budget controller', 'Finance'], ['Procurement officer', 'Procurement, East'], ['Local architect', 'To appoint']].map(t => `<label class="fld">${t[0]}<input value="${t[1]}"></label>`).join('')}</div><p class="small muted" style="margin-top:14px">Access comes from OKTA groups. External parties (general contractors, millworkers) are invited per tender, with access that expires on its own.</p>`;
    else body = `<p class="muted" style="margin:0 0 12px">Panoptic creates these for you, with the standard structure.</p><ul class="checklist"><li><span>SharePoint project site with the standard tree: 01 Brief · 02 Design · 03 Tender · 04 Works · 05 Handover</span><span class="small muted">R&P SharePoint</span></li><li><span>Folder S:\\DIOR\\PROJECTS\\201390 with the same tree</span><span class="small muted">Server</span></li><li><span>Project space on the design release server</span><span class="small muted">DWG, PDF</span></li><li><span>Teams channel with the project team, alerts and approvals</span><span class="small muted">Teams</span></li><li><span>Coupa project code request, linked to the Anaplan lines</span><span class="small muted">Coupa · Anaplan</span></li><li><span>Album in the Dior DAM for site and opening photos</span><span class="small muted">DAM</span></li><li><span>Row in the ADMIN FOLLOW UP export</span><span class="small muted">Excel</span></li></ul>`;
    return `<h2>New project</h2><p class="muted" style="margin:0">Five steps, about three minutes. ${req('1.1', '7.4.3', '7.4.4')}</p>
      <div class="np-steps">${steps.map((x, i) => `<span class="${i + 1 === st ? 'on' : i + 1 < st ? 'done' : ''}">${i + 1}. ${x}</span>`).join('')}</div>${body}
      <div class="np-foot">${st > 1 ? `<button class="btn ghost" data-act="np-step" data-v="${st - 1}">Back</button>` : '<span></span>'}${st < 5 ? `<button class="btn" data-act="np-step" data-v="${st + 1}">Continue</button>` : '<button class="btn" data-act="np-create">Create the project</button>'}</div>`;
  }
  function importHTML() {
    return `<h2>Import from Excel</h2><p class="muted" style="margin:0 0 18px">Drop the project list as it is kept today. Panoptic recognises the ADMIN FOLLOW UP columns. ${req('7.1.6', '1.1')}</p>
      <div class="drop"><b style="color:var(--ink)">2026 - ADMIN FOLLOW UP.xlsx</b> · sheets 2027 and 2028+ · 61 rows read</div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Row</th><th>Project</th><th>What Panoptic will do</th><th></th></tr></thead><tbody>${[['2027 · 2-6', 'Melbourne Flinders Lane · 201155', 'Already in Panoptic, no change', 'ok'], ['2027 · 7-13', 'Copenhagen · 401111', 'Opening date unchanged · retail m² 365 confirmed', 'ok'], ['2027 · 14-18', 'Los Cabos · 100610', 'SOP budget in the file differs from Anaplan: kept from Anaplan, flagged to Finance', 'warn'], ['2027 · 19-25', 'Sanya Swire · 300407', 'Already in Panoptic, no change', 'ok'], ['2028+ · 2-5', 'New project (example) · 201390', 'Create the project, then complete team and workspace', 'new'], ['2028+ · 6-9', 'New project (example) · 401188', 'Create the project, then complete team and workspace', 'new']].map(r => `<tr><td class="code">${r[0]}</td><td><b style="font-weight:600">${r[1]}</b></td><td class="small">${r[2]}</td><td>${r[3] === 'ok' ? '<span class="status s-ok">Same</span>' : r[3] === 'warn' ? '<span class="status s-warn">Review</span>' : '<span class="status s-Approved">New</span>'}</td></tr>`).join('')}</tbody></table></div>
      <div class="np-foot"><span class="small muted">Every change is written to the audit log.</span><button class="btn" data-act="np-import-ok">Import 2 projects, review 1 difference</button></div>`;
  }
  function platform(tab) {""")

# --- actions & inputs
rep("      case 'new-tender':",
    r"""      case 'new-menu': openModal(`<h2>New</h2><p class="muted" style="margin:0 0 18px">Start something. Panoptic files it in the right place.</p>${[['np-open', 'Project', 'From an Anaplan code, an Excel row or from scratch'], ['new-tender', 'Tender from a SOW', 'Upload the SOW; lines are read and linked to the budget'], ['open-tool', 'Upload documents', 'Drop files; they are tagged by project, supplier and budget line'], ['req-update', 'Budget amendment', 'Ask for a change on a budget line; approval goes to Finance']].map(o => `<button class="opt" style="width:100%;text-align:left;cursor:pointer" data-act="${o[0]}" data-v="${o[1]}"><b>${o[1]}</b><span class="small muted">${o[2]}</span></button>`).join('')}`); break;
      case 'np-open': state.np = 1; openModal(npHTML()); break;
      case 'np-step': state.np = +v; openModal(npHTML()); break;
      case 'np-src': state.npSrc = v; openModal(npHTML()); break;
      case 'np-create': closeOverlays(); toast('Project ARC-201390 created. SharePoint site, server folder and Teams channel are being set up; the team has been invited.'); break;
      case 'np-import': openModal(importHTML()); break;
      case 'np-import-ok': closeOverlays(); toast('2 projects created and 1 difference sent to Finance for review. Details in the audit log.'); break;
      case 'req-update': { const [what, who] = (v || '').split('|'); closeOverlays(); toast(`Confirmation request sent in Teams${who ? ' to ' + esc(who) : ''}${what ? ' for ' + esc(what) : ''}.`); break; }
      case 'open-tool': closeOverlays(); toast(`Opens ${esc(v)} in its own tool. In the product this is a direct link.`); break;
      case 'cview': state.costView = v; rerender(); break;
      case 'cuni': if (!v) state.cu.clear(); else state.cu.has(v) ? state.cu.delete(v) : state.cu.add(v); rerender(); break;
      case 'new-tender':""")
rep("    if (k === 'supCat') { state.supCat = e.target.value; rerender(); }",
    "    if (k === 'supCat') { state.supCat = e.target.value; rerender(); }\n    if (k === 'cfx' || k === 'cconcept') { state[k] = e.target.value; rerender(); }")
# coverage
rep("const SHOWN = new Set(['5.7',", "const SHOWN = new Set(['7.4.3', '7.4.4', '7.7.1', '5.7',")
rep("· v0.2, 10 November 2026", "· v0.3, 10 November 2026")
open(P, 'w', encoding='utf-8').write(s); print('step4 ok')
