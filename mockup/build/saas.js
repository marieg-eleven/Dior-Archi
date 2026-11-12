/* Architecture Panoptic — SaaS shell and views (v1.2).
 * Author: Marie Guegain — eleven.
 * Left navigation, portfolio dashboard, cost module with tabs (overview, budgets,
 * variations, cash flow, payments, univers search), project summary with health
 * rings, document AI badges. Business rules stay in the app and pano.js. */
(function () {
  'use strict';
  const A = window.A, Pano = window.Pano; if (!A || !Pano) return;
  const D = A.D, state = A.state, esc = A.esc;
  const Saas = window.Saas = {};
  const mE = k => '€' + (Math.abs(k) >= 1000 ? (k / 1000).toFixed(1) + 'M' : Math.round(k) + 'k');
  const today = () => new Date().toISOString().slice(0, 10);
  const I = {
    home: '<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',
    projects: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    cost: '<circle cx="12" cy="12" r="9"/><path d="M15 9.2c-.6-1-1.7-1.5-3-1.5-1.8 0-3 .9-3 2.2 0 3 6 1.6 6 4.6 0 1.3-1.3 2.3-3 2.3-1.4 0-2.6-.6-3.2-1.6M12 6v1.7m0 8.6V18"/>',
    tenders: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>',
    suppliers: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><path d="M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c1.8.8 3 2.6 3.5 5.2"/>',
    docs: '<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H10l2 2.5h7.5A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z"/>',
    library: '<path d="M4 4h4v16H4zM10 4h4v16h-4z"/><path d="m16 5 3.8-1 2.2 15.6-3.8 1z"/>',
    admin: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    bell: '<path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>'
  };
  const icon = (k, s = 18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[k]}</svg>`;
  const NAV = [['#/home', 'Home', 'home'], ['#/projects', 'Projects', 'projects'], ['#/cost', 'Cost control', 'cost'], ['#/tenders', 'Tenders', 'tenders'], ['#/suppliers', 'Suppliers', 'suppliers'], ['#/assets', 'Documents', 'docs'], ['#/library', 'Library', 'library']];

  /* ---------------- shell ---------------- */
  function shell() {
    document.body.classList.add('saas');
    const side = document.createElement('aside'); side.className = 'side'; side.setAttribute('aria-label', 'Main navigation');
    side.innerHTML = `<a class="side-brand" href="#/home">${window.LOGO_URI ? `<img src="${window.LOGO_URI}" alt="">` : ''}<span><b>Architecture</b><i>Panoptic</i></span></a>
      <nav class="side-nav">${NAV.map(n => `<a href="${n[0]}" data-nav="${n[0]}">${icon(n[2])}<span>${n[1]}</span>${n[0] === '#/home' ? '<em class="side-count" id="mwCount"></em>' : ''}</a>`).join('')}</nav>
      <div class="side-foot"><a href="#/platform" data-nav="#/platform">${icon('admin')}<span>Admin</span></a><div class="side-status" id="sideStatus"></div></div>`;
    document.body.insertBefore(side, document.body.firstChild);
    const top = document.querySelector('.top-in');
    if (top) {
      const b = document.createElement('button'); b.className = 'icon-btn side-toggle'; b.setAttribute('aria-label', 'Open navigation'); b.innerHTML = icon('menu');
      b.addEventListener('click', () => document.body.classList.toggle('side-open'));
      top.insertBefore(b, top.firstChild);
      const crumb = document.createElement('div'); crumb.className = 'crumb'; crumb.id = 'crumb'; top.insertBefore(crumb, b.nextSibling);
      const bell = document.createElement('a'); bell.className = 'icon-btn bell'; bell.href = '#/home'; bell.setAttribute('aria-label', 'My work'); bell.innerHTML = icon('bell') + '<em id="bellCount"></em>';
      const r = top.querySelector('.top-r'); if (r) r.insertBefore(bell, r.querySelector('#role'));
    }
    side.addEventListener('click', e => { if (e.target.closest('a')) document.body.classList.remove('side-open'); });
  }
  const SECTION = [[/^#\/(home)?$/, 'Home'], [/^#\/project/, 'Projects'], [/^#\/cost/, 'Cost control'], [/^#\/tender/, 'Tenders'], [/^#\/supplier/, 'Suppliers'], [/^#\/assets/, 'Documents'], [/^#\/(library|material|concept|book)/, 'Library'], [/^#\/platform/, 'Admin']];
  function afterRender() {
    const h = location.hash || '#/home';
    const sec = (SECTION.find(s => s[0].test(h)) || [0, 'Home'])[1];
    const pid = (h.match(/#\/project\/(\w+)/) || [])[1];
    const c = document.getElementById('crumb');
    if (c) c.innerHTML = pid && A.P[pid] ? `<a href="#/projects">Projects</a><span>/</span><b>${esc(A.P[pid].city)}</b>` : `<b>${sec}</b>`;
    const n = Pano.work().length;
    ['mwCount', 'bellCount'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = n ? n : ''; });
    const st = document.getElementById('sideStatus'), badge = document.querySelector('.sample');
    if (st && badge) st.textContent = badge.textContent.replace('Prototype · ', '');
  }
  window.addEventListener('hashchange', () => setTimeout(afterRender, 0));
  const render0 = A.render;
  A.render = (keep) => { render0(keep); afterRender(); };

  /* ---------------- shared bits ---------------- */
  const HL = { g: 'Green', a: 'Amber', r: 'Red' };
  const rag = x => `<span class="rag rag-${x}">${HL[x]}</span>`;
  const ring = (label, x) => `<div class="ring ring-${x}" title="${label}: ${HL[x]}"><span>${label}</span></div>`;
  function payBar(p) {
    const s = Math.max(p.budget, p.forecast) || 1, w = k => (Math.max(0, k) / s * 100).toFixed(1) + '%';
    return `<div class="pbar" title="Paid ${mE(p.actual)} · committed ${mE(p.committed)} · budget ${mE(p.budget)}"><i class="pb-paid" style="width:${w(p.actual)}"></i><i class="pb-com" style="width:${w(p.committed - p.actual)}"></i></div>`;
  }
  const tile = (label, value, sub, cls = '') => `<div class="tile ${cls}"><span class="t-l">${label}</span><span class="t-v">${value}</span><span class="t-s">${sub}</span></div>`;
  const STAGE_C = { Brief: 'var(--grey-2)', Design: '#7c8fa6', Tender: 'var(--stone)', Works: 'var(--ink-2)', Handover: 'var(--sage)' };

  /* ---------------- Home: portfolio dashboard ---------------- */
  Saas.zone = 'All';
  const cat = h => /tender/.test(h) ? 'Tender' : /costs|#\/cost/.test(h) ? 'Cost' : /\/data/.test(h) ? 'Data' : /supplier/.test(h) ? 'Supplier' : /documents/.test(h) ? 'Files' : /library/.test(h) ? 'Library' : 'Project';
  function home() {
    const fin = A.fin();
    const ps = A.vis().filter(p => Saas.zone === 'All' || p.zone === Saas.zone);
    const t = A.totals(ps);
    const mw = Pano.work();
    const hs = ps.map(p => ({ p, h: Pano.health(p) }));
    const cnt = k => hs.filter(x => x.h.overall === k).length;
    const v = t.forecast - t.budget;
    const hour = new Date().getHours(), hi = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const openT = D.TENDERS.filter(x => x.status !== 'Awarded' && A.visIds().has(x.project)).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
    const openings = ps.slice().sort((a, b) => ((a.admin || {}).opening || a.handover).localeCompare((b.admin || {}).opening || b.handover)).filter(p => ((p.admin || {}).opening || p.handover) >= today()).slice(0, 4);
    // budget by category
    const cats = {}; ps.forEach(p => p.lines.forEach(l => { cats[l.name] = (cats[l.name] || 0) + l.budget; }));
    const catList = Object.entries(cats).sort((a, b) => b[1] - a[1]);
    const catTot = catList.reduce((a, x) => a + x[1], 0) || 1;
    const shades = ['#1b1a18', '#3d3a35', '#5f5a52', '#817a70', '#a48a62', '#bda67f', '#d3c3a4', '#e3d8c4', '#efe8dc'];
    let acc = 0; const donut = catList.map((c, i) => { const a0 = acc / catTot, a1 = (acc += c[1]) / catTot; const arc = (a) => [50 + 38 * Math.sin(2 * Math.PI * a), 50 - 38 * Math.cos(2 * Math.PI * a)]; const [x0, y0] = arc(a0), [x1, y1] = arc(a1 - 0.0001); return `<path d="M${x0} ${y0} A38 38 0 ${a1 - a0 > 0.5 ? 1 : 0} 1 ${x1} ${y1}" stroke="${shades[i % shades.length]}" stroke-width="14" fill="none"/>`; }).join('');
    // timeline
    const starts = ps.map(p => new Date(((p.admin || {}).commitment || addDays(p.handover, -540)) + 'T12:00:00'));
    const ends = ps.map(p => new Date(((p.admin || {}).opening || p.handover) + 'T12:00:00'));
    const t0 = new Date(Math.min(...starts)); t0.setDate(1); const t1 = new Date(Math.max(...ends)); t1.setMonth(t1.getMonth() + 1);
    const pos = d => ((d - t0) / (t1 - t0) * 100).toFixed(2) + '%';
    const years = []; for (let y = t0.getFullYear(); y <= t1.getFullYear(); y++) { const d = new Date(y, 0, 1); if (d > t0 && d < t1) years.push(d); }
    const stagesOf = (s, e) => { const span = e - s; return [['Design', 0, 0.3], ['Tender', 0.3, 0.45], ['Works', 0.45, 0.97], ['Handover', 0.97, 1]].map(x => [x[0], new Date(s.getTime() + span * x[1]), new Date(s.getTime() + span * x[2])]); };
    const html = `
    <div class="dash-head"><div><p class="hello">${hi}. ${esc(state.role.name)} view</p><h1>Portfolio</h1><p class="sub">${ps.length} projects in West and East zones · Anaplan and Coupa synced today</p></div>
      <div class="actions"><button class="btn ghost" data-act="palette">${icon('spark', 16)} Ask Copilot</button><button class="btn" data-act="np-open">New project</button></div></div>
    <div class="tiles">
      ${tile('Projects', ps.length, `${ps.filter(p => p.status === 'Works').length} in works · ${ps.filter(p => p.status === 'Tender').length} in tender`)}
      ${tile('Budget', fin ? mE(t.budget) : A.mask(), 'SOP, Anaplan')}
      ${tile('Committed', fin ? mE(t.committed) : A.mask(), fin ? Math.round(t.committed / t.budget * 100) + '% of budget · Coupa' : 'Coupa')}
      ${tile('Forecast final cost', fin ? mE(t.forecast) : A.mask(), 'committed + pending + to go')}
      ${tile('Variance', fin ? `<span class="${A.vcls(v / t.budget)}">${v >= 0 ? '+' : '−'}${mE(Math.abs(v))}</span>` : A.mask(), fin ? A.pct(v / t.budget) + ' against budget' : 'Forecast minus budget')}
      ${tile('Paid to date', fin ? mE(t.actual) : A.mask(), fin ? Math.round(t.actual / t.forecast * 100) + '% of forecast' : 'Coupa')}
    </div>
    <div class="cards c3">
      <section class="card"><div class="card-h"><h2>My work</h2><span class="muted small">${mw.length} open</span></div>
        <ul class="mw-list">${mw.slice(0, 6).map(w => { const n = A.days(w[3]); return `<li><a href="${w[4]}"><span class="tag ${w[0] === 'Approve' ? 'ai' : ''}">${cat(w[4])}</span><span class="t"><b>${esc(w[1])}</b><span>${esc(w[2])}</span></span><span class="due ${n <= 4 ? 'soon' : ''}">${n <= 0 ? 'Today' : n === 1 ? 'Tomorrow' : n + ' d'}</span></a>${w[5] ? `<button class="mw-x" data-act="${w[6] || 'mw-done'}" data-v="${esc(w[7] || w[5])}">${w[6] === 'amend-ok' ? 'Approve' : w[6] === 'confirm-block' ? 'Confirm' : 'Done'}</button>` : ''}</li>`; }).join('') || '<li class="empty">Nothing waiting for you. New approvals and checks appear here.</li>'}</ul></section>
      <section class="card"><div class="card-h"><h2>Health</h2><span class="muted small">cost · schedule · data</span></div>
        <div class="health-sum"><div><b class="hs-g">${cnt('g')}</b><span>On track</span></div><div><b class="hs-a">${cnt('a')}</b><span>Watch</span></div><div><b class="hs-r">${cnt('r')}</b><span>At risk</span></div></div>
        <ul class="plain">${hs.filter(x => x.h.overall !== 'g').sort((a, b) => (a.h.overall === 'r' ? -1 : 1) - (b.h.overall === 'r' ? -1 : 1)).slice(0, 4).map(x => `<li><a href="#/project/${x.p.id}"><span>${esc(x.p.city)}</span>${Pano.healthDots(x.p)}</a></li>`).join('') || '<li class="empty">Every project is on track.</li>'}</ul></section>
      <section class="card"><div class="card-h"><h2>Coming up</h2><a class="more" href="#/tenders">Tenders</a></div>
        <ul class="plain dates">${openT.map(x => `<li><a href="#/tender/${x.id}"><span class="d">${A.dfmt(x.date)}</span><span><b>${esc(x.pkg)}</b><i>${A.P[x.project].city} · ${x.dateLabel}</i></span></a></li>`).join('')}${openings.slice(0, 2).map(p => `<li><a href="#/project/${p.id}"><span class="d">${A.dfmt((p.admin || {}).opening || p.handover)}</span><span><b>Opening</b><i>${esc(p.city)}</i></span></a></li>`).join('')}</ul></section>
    </div>
    <section class="card"><div class="card-h"><h2>Projects</h2><a class="more" href="#/projects">All projects</a></div>
      <div class="tbl-wrap"><table class="tbl ptable"><thead><tr><th>Project</th><th>Stage</th><th>Opening</th><th class="r">Budget</th><th>Payment progress</th><th class="r">Variance</th><th class="r">Forecast</th><th>Cost</th><th>Time</th><th>Data</th></tr></thead><tbody>
      ${hs.map(({ p, h }) => `<tr class="click" data-href="#/project/${p.id}"><td><b>${esc(p.city)}</b><div class="small muted">ARC-${p.id} · ${esc(p.type)}</div></td><td>${A.statusTag(p.status)}</td><td class="small">${A.dfmt((p.admin || {}).opening || p.handover)}</td><td class="r">${fin ? mE(p.budget) : A.mask()}</td><td style="min-width:140px">${fin ? payBar(p) : ''}</td><td class="r ${A.vcls(p.variancePct)}">${fin ? A.pct(p.variancePct) : A.mask()}</td><td class="r">${fin ? mE(p.forecast) : A.mask()}</td><td>${fin ? rag(h.cost) : '—'}</td><td>${rag(h.sched)}</td><td>${rag(h.data)}</td></tr>`).join('')}</tbody></table></div>
      <div class="legend" style="margin-top:10px"><span><i style="background:var(--ink)"></i>Paid</span><span><i style="background:var(--stone-2)"></i>Committed, not yet paid</span></div></section>
    <div class="cards c2">
      <section class="card"><div class="card-h"><h2>Timeline</h2><span class="muted small">commitment to opening</span></div>
        <div class="gantt"><div class="g-axis">${years.map(y => `<span style="left:${pos(y)}">${y.getFullYear()}</span>`).join('')}</div>
        ${ps.map((p, i) => { const s = starts[i], e = ends[i]; return `<a class="g-row" href="#/project/${p.id}"><span class="g-name">${esc(p.city)}</span><span class="g-track">${stagesOf(s, e).map(st => `<i style="left:${pos(st[1])};width:calc(${pos(st[2])} - ${pos(st[1])});background:${STAGE_C[st[0]]}" title="${st[0]}"></i>`).join('')}<b style="left:${pos(e)}" title="Opening ${A.dfmt(e.toISOString().slice(0, 10))}"></b></span></a>`; }).join('')}
        <span class="g-today" style="left:calc(132px + (100% - 132px) * ${((Date.now() - t0) / (t1 - t0)).toFixed(4)})"><em>Today</em></span></div>
        <div class="legend" style="margin-top:10px">${['Design', 'Tender', 'Works'].map(s => `<span><i style="background:${STAGE_C[s]}"></i>${s}</span>`).join('')}<span><i style="background:var(--rouge);width:3px"></i>Opening</span></div></section>
      <section class="card"><div class="card-h"><h2>Budget by category</h2><span class="muted small">Anaplan lines</span></div>
        ${fin ? `<div class="donut-wrap"><svg viewBox="0 0 100 100" class="donut" role="img" aria-label="Budget split by category">${donut}<text x="50" y="49" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">${mE(catTot)}</text><text x="50" y="60" text-anchor="middle" font-size="7" fill="currentColor" fill-opacity=".6">budget</text></svg>
        <ul class="plain cats">${catList.map((c, i) => `<li><i style="background:${shades[i % shades.length]}"></i><span>${c[0]}</span><b>${mE(c[1])}</b></li>`).join('')}</ul></div>` : A.restricted('Cost data')}</section>
    </div>
    <div class="cards c2">
      <section class="card"><div class="card-h"><h2>Needs attention</h2><span class="muted small">budget rules and AI checks</span></div><ul class="list">${(D.ALERTS || []).filter(a => (A.fin() || a.kind !== 'Budget') && (!a.project || A.visIds().has(a.project))).slice(0, 4).map(a => `<li><a class="row alert" href="${a.link}"><span class="lvl ${a.level}"></span><div style="flex:1;min-width:0"><h3>${esc(a.title)}</h3><p>${esc(String(a.body))}</p></div></a></li>`).join('')}</ul></section>
      <section class="card"><div class="card-h"><h2>Recently opened</h2><a class="more" href="#/library/boutiques">Boutiques & photos</a></div>
        <div class="photo-grid">${[['assets/store-bangkok-facade.jpg', 'Bangkok EM Quartier'], ['assets/store-rodeo-facade-2.jpg', 'Beverly Hills Rodeo Drive'], ['assets/store-bangkok-tryon-pink.jpg', 'Bangkok · try-on'], ['assets/store-bangkok-tryon-women.jpg', 'Bangkok · try-on']].map(x => `<a href="#/library/boutiques"><img src="${x[0]}" alt="${x[1]}"><span>${x[1]}</span></a>`).join('')}</div></section>
    </div>`;
    return { html };
  }
  function addDays(iso, n) { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }
  A.views.home = home;

  /* ---------------- Cost module with tabs ---------------- */
  Saas.ctab = 'overview'; Saas.open = new Set(['201155']);
  const cost0 = A.views.cost;
  const CTABS = [['overview', 'Overview'], ['budgets', 'Budgets'], ['variations', 'Variations'], ['cash', 'Cash flow'], ['payments', 'Payments'], ['univers', 'Search by univers']];
  function costModule() {
    state.costView = Saas.ctab === 'univers' ? 'search' : 'overview';
    let out = cost0();
    let html = out.html.replace(/<div class="seg"><button[^>]*data-act="cview"[\s\S]*?<\/div>/, '');
    const tabs = `<nav class="tabs" aria-label="Cost sections">${CTABS.map(t => `<a href="#" data-act="ctab" data-v="${t[0]}" class="${Saas.ctab === t[0] ? 'on' : ''}">${t[1]}${t[0] === 'variations' ? `<span class="n">${Pano.variations.filter(v => v.status === 'pending').length}</span>` : ''}</a>`).join('')}</nav>`;
    const headEnd = html.indexOf('</div></div>', html.indexOf('class="page-head"')) + '</div></div>'.length;
    const head = html.slice(0, headEnd);
    if (!A.fin()) return { html: head + tabs + html.slice(headEnd) };
    const all = A.vis().filter(p => state.costZone === 'All' || p.zone === state.costZone);
    let body;
    if (Saas.ctab === 'overview' || Saas.ctab === 'univers') body = html.slice(headEnd);
    else if (Saas.ctab === 'budgets') body = budgetsTree(all);
    else if (Saas.ctab === 'variations') body = variationsAll(all);
    else if (Saas.ctab === 'cash') body = Pano.portfolioCash(all) + cashTable(all);
    else body = payments(all);
    return { html: head + tabs + body, after: out.after };
  }
  function budgetsTree(all) {
    const rows = all.map(p => {
      const open = Saas.open.has(p.id);
      let r = `<tr class="tree-p click" data-act="tree" data-v="${p.id}"><td><span class="tw ${open ? "on" : ""}">›</span><span class="lvl-b p">P</span><b>${esc(p.city)}</b> <span class="code">ARC-${p.id}</span> <span class="muted small">(${p.lines.length})</span></td><td class="r">${mE(p.budget)}</td><td class="r">${mE(p.committed)}</td><td class="r">${mE(p.actual)}</td><td class="r">${mE(p.forecast)}</td><td class="r ${A.vcls(p.variancePct)}">${A.pct(p.variancePct)}</td><td>${payBar(p)}</td></tr>`;
      if (open) r += p.lines.map(l => `<tr class="tree-l"><td><span class="lvl-b l">B</span>${l.short} ${l.name} <span class="code">${l.pos.length} PO${l.pos.length === 1 ? '' : 's'}</span></td><td class="r">${mE(l.budget)}</td><td class="r">${mE(l.committed)}</td><td class="r">${mE(l.actual)}</td><td class="r">${mE(l.forecast)}</td><td class="r ${A.vcls(l.forecast / l.budget - 1)}">${A.pct(l.forecast / l.budget - 1)}</td><td>${payBar({ budget: l.budget, forecast: l.forecast, actual: l.actual, committed: l.committed })}</td></tr>` + l.pos.map(po => `<tr class="tree-c"><td><span class="lvl-b c">C</span>${po.po} · ${po.supplier ? esc(A.sup(po.supplier).name) : esc(po.label || '')}</td><td></td><td class="r">${mE(po.amount)}</td><td class="r">${mE(po.invoiced)}</td><td></td><td></td><td class="small muted">${po.status}</td></tr>`).join('')).join('');
      return r;
    }).join('');
    return `<section class="card"><div class="card-h"><h2>Budgets</h2><span class="muted small">Project › Anaplan budget line › Coupa order. Open a project to see its lines.</span><div class="chips" style="margin-left:auto"><button class="btn sm ghost" data-act="tree-all">Expand all</button><button class="btn sm ghost" data-act="export" data-v="Excel (Anaplan format)">Export</button></div></div>
      <div class="tbl-wrap"><table class="tbl tree"><thead><tr><th>Title</th><th class="r">Budget</th><th class="r">Committed</th><th class="r">Paid</th><th class="r">Forecast</th><th class="r">Variance</th><th>Payment progress</th></tr></thead><tbody>${rows}</tbody></table></div>
      <div class="legend" style="margin-top:10px"><span><b class="lvl-b p">P</b>Project</span><span><b class="lvl-b l">B</b>Budget line (Anaplan)</span><span><b class="lvl-b c">C</b>Order or contract (Coupa)</span></div></section>`;
  }
  function variationsAll(all) {
    const ids = new Set(all.map(p => p.id)); const vs = Pano.variations.filter(v => ids.has(v.project));
    const canAppr = ['bc', 'pm'].includes(state.role.id);
    return `<section class="card"><div class="card-h"><h2>Variations</h2><span class="muted small">Change orders on signed contracts. Pending ones count in the forecast only.</span></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Variation</th><th>Project</th><th>Supplier</th><th>Line</th><th>Raised</th><th class="r">Amount</th><th>Status</th><th></th></tr></thead><tbody>${vs.map(v => `<tr><td><b style="font-weight:600">${esc(v.title)}</b><div class="small muted">${v.id} · ${esc(v.source)}</div></td><td>${esc(A.P[v.project].city)}</td><td class="small">${esc(A.sup(v.supplier).name)}</td><td class="code">${v.line}</td><td class="small">${A.dfmt(v.raised)}</td><td class="r"><b>+${mE(v.amount)}</b></td><td>${v.status === 'pending' ? '<span class="status s-warn">Pending</span>' : v.status === 'approved' ? '<span class="status s-ok">Approved</span>' : '<span class="status">Rejected</span>'}</td><td>${v.status === 'pending' && canAppr ? `<button class="btn sm" data-act="var-ok" data-v="${v.id}">Approve</button>` : ''}</td></tr>`).join('') || '<tr><td colspan="8" class="muted">No variation in this scope.</td></tr>'}</tbody></table></div></section>`;
  }
  function cashTable(all) {
    return `<section class="card"><div class="card-h"><h2>By project</h2><span class="muted small">forecast payments, next three months</span></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Project</th><th class="r">Paid to date</th><th class="r">Next 3 months</th><th class="r">Still to pay</th><th>Opening</th></tr></thead><tbody>${all.map(p => { const r = Pano.cashflow(p).filter(x => x.fc != null).slice(0, 3); const n3 = r.length ? r[r.length - 1].fc - p.actual : 0; return `<tr class="click" data-href="#/project/${p.id}/costs"><td><b>${esc(p.city)}</b></td><td class="r">${mE(p.actual)}</td><td class="r">${mE(Math.max(0, n3))}</td><td class="r">${mE(Math.max(0, p.forecast - p.actual))}</td><td class="small">${A.dfmt((p.admin || {}).opening || p.handover)}</td></tr>`; }).join('')}</tbody></table></div></section>`;
  }
  function payments() {
    const inv = [['INV-88412', 'Gulf Interiors', 84, 'Ras Al Khaimah Wynn'], ['INV-88430', 'Gulf Interiors', 46, 'Ras Al Khaimah Wynn'], ['INV-88447', 'Thermis MEP', 23, 'Ras Al Khaimah Wynn']];
    return `<section class="card"><div class="card-h"><h2>Payments to review</h2><span class="muted small">Coupa invoices. Copilot checks them against the order and the contract; a person confirms.</span></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Invoice</th><th>Supplier</th><th>Project</th><th class="r">Amount</th><th>AI check</th><th></th></tr></thead><tbody>${inv.map(x => `<tr><td><b>${x[0]}</b></td><td>${x[1]}</td><td class="small">${x[3]}</td><td class="r">€${x[2]}k</td><td>${Pano.invoices.has(x[0]) ? '<span class="status s-ok">Matched</span>' : x[0] === 'INV-88430' ? '<span class="ai-chip">No issue found</span>' : '<span class="ai-chip warn">2 points to review</span>'}</td><td>${Pano.invoices.has(x[0]) ? '' : `<button class="btn sm ghost" data-act="inv-check" data-v="${x[0]}">Review</button>`}</td></tr>`).join('')}</tbody></table></div>
      <p class="small muted" style="margin-top:12px">Illustrative invoices. In production they come from Coupa as they are received.</p></section>`;
  }
  A.views.cost = costModule;

  /* ---------------- Projects: table first ---------------- */
  if (!Saas.projViewSet) { state.projView = 'table'; Saas.projViewSet = true; }

  /* ---------------- Project: summary and health rings ---------------- */
  const project0 = A.views.project;
  A.views.project = (id, tab) => {
    const out = project0(id, tab); const p = A.P[id];
    if (!p || !out || !out.html || (tab && tab !== 'overview')) return out;
    const h = Pano.health(p), fin = A.fin();
    const ts = D.TENDERS.filter(t => t.project === id), open = ts.filter(t => t.status !== 'Awarded');
    const vs = Pano.variations.filter(v => v.project === id && v.status === 'pending');
    const lines = [
      `<b>Programme.</b> ${esc(p.status)} stage, ${Math.round(p.progress * 100)}% complete, opening ${A.dlong((p.admin || {}).opening || p.handover)}${h.sched === 'g' ? ', on track against elapsed time' : h.sched === 'a' ? ', slightly behind elapsed time' : ', well behind elapsed time'}.`,
      fin ? `<b>Cost.</b> Forecast final cost ${mE(p.forecast)} against ${mE(p.budget)} budget (${A.pct(p.variancePct)}); ${mE(p.actual)} paid${vs.length ? `; ${vs.length} variation${vs.length > 1 ? 's' : ''} pending` : ''}.` : '<b>Cost.</b> Restricted for this role.',
      `<b>Tenders.</b> ${open.length ? open.map(t => `${esc(t.pkg)} (${t.status.toLowerCase()})`).join(', ') : 'No open tender'}.`,
      `<b>Data.</b> Project sheet confirmed ${h.age} days ago${h.data === 'g' ? '.' : ', confirmation due.'}`
    ];
    const card = `<section class="summary"><div class="sum-text"><div class="card-h"><h2>${icon('spark', 16)} Project summary</h2><span class="muted small">written by Copilot from today's data</span></div><ul>${lines.map(l => `<li>${l}</li>`).join('')}</ul></div>
      <div class="rings">${fin ? ring('Cost', h.cost) : ''}${ring('Time', h.sched)}${ring('Data', h.data)}${ring('Tenders', open.some(t => (t.bids || []).some(b => b.gaps.some(g => !g.soft))) ? 'a' : 'g')}</div></section>`;
    const k = out.html.indexOf('<nav class="tabs"');
    if (k > 0) out.html = out.html.slice(0, k) + card + out.html.slice(k);
    return out;
  };

  /* ---------------- Documents: AI badges ---------------- */
  const CLS = { Drawing: 'Drawing', 'Purchase order': 'Order', Invoice: 'Invoice', SOW: 'SOW', BOQ: 'BOQ', 'Tender return': 'Offer', 'Tender analysis': 'Analysis', Contract: 'Contract', 'Site photos': 'Photo', Minutes: 'Minutes', 'Technical sheet': 'Spec', 'Budget export': 'Budget', 'Design book': 'Design book', 'Project list': 'Register', 'Project info': 'Report', 'Opening book': 'Report' };
  Saas.docBadges = d => { const ready = !/^(jpg|png|dwg)$/.test(d.ext) && d.status !== 'Draft'; return `${ready ? '<span class="ai-chip">AI ready</span>' : ''}${ready ? `<button class="ask-ai" data-q="What does ${esc(d.name)} say? Summarise it.">Ask AI</button>` : ''}`; };
  Saas.cls = d => `<span class="cls">${CLS[d.type] || esc(d.type)}</span>`;

  /* ---------------- actions ---------------- */
  const handle0 = Pano.handle;
  Pano.handle = (act, v, b) => {
    switch (act) {
      case 'dzone': Saas.zone = v; A.render(true); return true;
      case 'ctab': Saas.ctab = v; A.render(true); return true;
      case 'tree': Saas.open.has(v) ? Saas.open.delete(v) : Saas.open.add(v); A.render(true); return true;
      case 'tree-all': { const all = A.vis(); if (Saas.open.size >= all.length) Saas.open.clear(); else all.forEach(p => Saas.open.add(p.id)); A.render(true); return true; }
    }
    return handle0(act, v, b);
  };
  document.addEventListener('click', e => { const a = e.target.closest('a[data-act="ctab"]'); if (a) e.preventDefault(); }, true);

  const start = () => { shell(); setTimeout(afterRender, 50); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(start, 0)); else start();
})();
