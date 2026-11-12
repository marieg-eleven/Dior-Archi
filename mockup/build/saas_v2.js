  /* ================= v2.0 — structured, glass ================= */
  /* Dossier map: what a project needs, what is linked to what, what is complete or missing. */
  const ST = { done: 'Complete', prog: 'In progress', miss: 'Missing', later: 'Later' };
  const STAGE_I = { Brief: 0, Design: 1, Tender: 2, Works: 3, Handover: 4 };
  function dossier(p) {
    const si = STAGE_I[p.status] || 0, docs = D.DOCS.filter(d => d.project === p.id), has = t => docs.filter(d => d.type === t);
    const ts = D.TENDERS.filter(t => t.project === p.id);
    const age = Pano.age(p, 'Project sheet', p.id === '401111' ? 34 : 6);
    const a = p.admin || {}, missingFields = ['opening', 'commitment', 'boutique', 'concept', 'retail'].filter(k => !a[k]).length;
    const am = Pano.amendments.filter(x => x.project === p.id && x.status === 'pending');
    const pos = p.lines.reduce((n, l) => n + l.pos.length, 0);
    const inv = p.id === '601421' ? ['INV-88412', 'INV-88430', 'INV-88447'].filter(n => !Pano.invoices.has(n)).length : 0;
    const cols = [];
    const it = (k, t, s, st, href, act) => ({ k, t, s, st, href, act });
    cols.push({ name: 'Project', items: [
      it('sheet', 'Project sheet', missingFields ? `${missingFields} fields missing` : age > 30 ? `Confirmed ${age} days ago` : 'Up to date', missingFields || age > 30 ? 'miss' : 'done', `#/project/${p.id}/data`, missingFields ? { a: 'sheet-edit', v: p.id, l: 'Complete' } : age > 30 ? { a: 'confirm-block', v: `${p.id}|Project sheet`, l: 'Confirm' } : null),
      it('team', 'Team and access', p.created ? 'Invitations sent' : '7 people · OKTA', p.created ? 'prog' : 'done', `#/project/${p.id}/data`),
      it('ws', 'Workspaces', p.created ? 'Requested from IT' : 'SharePoint · S: · Teams', p.created ? 'prog' : 'done', `#/project/${p.id}/data`)
    ] });
    cols.push({ name: 'Budget', items: [
      it('sop', 'SOP budget', A.fin() ? mE(p.budget) + ' · Anaplan' : 'Anaplan', 'done', `#/project/${p.id}/costs`),
      it('lines', 'Budget lines', `${p.lines.length} lines · ${A.pct(p.variancePct)}`, p.variancePct > 0.03 ? 'prog' : 'done', `#/project/${p.id}/costs`),
      it('amend', 'Amendments', am.length ? `${am.length} to approve` : 'None pending', am.length ? 'prog' : 'done', `#/project/${p.id}/costs`, am.length && ['bc', 'pm'].includes(state.role.id) ? { a: 'amend-ok', v: am[0].id, l: 'Approve' } : null)
    ] });
    const tItems = ts.length ? ts.map(t => it('t-' + t.id, t.pkg.replace(' — early & main works', ''), `${t.status}${t.status === 'Awarded' && t.awarded ? ' · ' + A.sup(t.awarded).name : t.date ? ' · ' + t.dateLabel + ' ' + A.dfmt(t.date) : ''}`, t.status === 'Awarded' ? 'done' : 'prog', `#/tender/${t.id}`)) : [it('t-none', 'Tenders', si >= 2 ? 'No tender yet' : 'Not started', si >= 2 ? 'miss' : 'later', '#/tenders', si >= 2 ? { a: 'new-tender', v: '', l: 'Start' } : null)];
    cols.push({ name: 'Tenders', items: tItems });
    const awarded = ts.filter(t => t.status === 'Awarded');
    const oItems = [it('pos', 'Orders in Coupa', pos ? `${pos} orders` : 'None yet', pos ? 'done' : si >= 3 ? 'miss' : 'later', `#/project/${p.id}/costs`)];
    awarded.forEach(t => { const fresh = Pano.audit.some(x => x.what.startsWith(t.id + ' awarded')); oItems.push(it('c-' + t.id, `Contract · ${A.sup(t.awarded).name}`, fresh ? 'Not registered in Diorlex' : A.sup(t.awarded).contract + ' · Diorlex', fresh ? 'miss' : 'done', `#/supplier/${t.awarded}`, fresh ? { a: 'open-tool', v: 'Diorlex', l: 'Register' } : null)); });
    oItems.push(it('inv', 'Invoices', inv ? `${inv} to match` : 'All matched', inv ? 'miss' : si >= 3 ? 'done' : 'later', '#/cost', inv ? { a: 'inv-check', v: 'INV-88412', l: 'Review' } : null));
    cols.push({ name: 'Orders and contracts', items: oItems });
    const ga = has('Drawing'), photos = has('Site photos'), minutes = has('Minutes');
    const conflict = p.id === '300407';
    cols.push({ name: 'Drawings and files', items: [
      it('dwg', 'Plans and elevations', ga.length ? `${ga.length} drawings${conflict ? ' · 2 versions' : ''}` : 'None', ga.length ? (conflict ? 'prog' : 'done') : si >= 1 ? 'miss' : 'later', `#/project/${p.id}/documents`, ga.length ? null : { a: 'open-tool', v: 'Upload documents', l: 'Add' }),
      it('photos', 'Site photos', photos.length ? `${photos.length} published` : 'None', photos.length ? 'done' : si >= 3 ? 'miss' : 'later', `#/project/${p.id}/documents`, photos.length || si < 3 ? null : { a: 'open-tool', v: 'Upload documents', l: 'Add' }),
      it('minutes', 'Meeting minutes', minutes.length ? `${minutes.length} filed` : 'None', minutes.length ? 'done' : si >= 1 ? 'miss' : 'later', `#/project/${p.id}/documents`, minutes.length ? null : { a: 'open-tool', v: 'Upload documents', l: 'Add' })
    ] });
    const hand = si >= 4;
    cols.push({ name: 'Handover', items: [
      it('asbuilt', 'As-built drawings', hand ? 'Due before opening' : 'At handover', hand ? 'miss' : 'later', `#/project/${p.id}/documents`, hand ? { a: 'open-tool', v: 'Upload documents', l: 'Add' } : null),
      it('opening', 'Opening photos', hand ? 'Due at opening' : 'At opening', hand ? 'miss' : 'later', `#/project/${p.id}/documents`),
      it('archive', 'Archive', 'Automatic at closing', 'later', `#/project/${p.id}/documents`)
    ] });
    const links = [['sheet', 'sop', 'ok'], ['lines', null, 'ok']];
    const L = [['sheet', 'sop']];
    ts.forEach(t => L.push(['lines', 't-' + t.id]));
    if (!ts.length) L.push(['lines', 't-none']);
    awarded.forEach(t => { L.push(['t-' + t.id, 'pos']); L.push(['t-' + t.id, 'c-' + t.id]); });
    ts.filter(t => t.status === 'Evaluated').forEach(t => L.push(['t-' + t.id, 'pos', 'wait']));
    L.push(['pos', 'inv']);
    const all = cols.flatMap(c => c.items), byK = Object.fromEntries(all.map(x => [x.k, x]));
    const lk = L.filter(l => byK[l[0]] && byK[l[1]]).map(l => [l[0], l[1], l[2] === 'wait' ? 'wait' : (byK[l[0]].st === 'miss' || byK[l[1]].st === 'miss') ? 'broken' : 'ok']);
    const counted = all.filter(x => x.st !== 'later');
    const done = counted.filter(x => x.st === 'done').length, miss = counted.filter(x => x.st === 'miss').length;
    return { cols, links: lk, pct: counted.length ? Math.round(done / counted.length * 100) : 100, miss, prog: counted.filter(x => x.st === 'prog').length, total: counted.length };
  }
  Saas.dossier = dossier;
  const SICON = { done: '<path d="m7 12.5 3.2 3L17 9"/>', prog: '<circle cx="12" cy="12" r="1.2"/><path d="M12 8v4l2.5 1.5"/>', miss: '<path d="M12 7v10M7 12h10"/>', later: '<path d="M8 12h8"/>' };
  const sIcon = st => `<span class="jr-ic jr-${st}" aria-label="${ST[st]}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${SICON[st]}</svg></span>`;
  function journeyHTML(p, opts = {}) {
    const d = dossier(p);
    return `<div class="jr" data-links='${JSON.stringify(d.links)}'><svg class="jr-links" aria-hidden="true"></svg><div class="jr-cols">${d.cols.map(c => `<div class="jr-col"><div class="jr-card">${c.items.map(x => `<div class="jr-it st-${x.st}" data-k="${x.k}">${sIcon(x.st)}<a class="jr-t" href="${x.href}"><b>${esc(x.t)}</b><span>${esc(x.s)}</span></a>${x.act ? `<button class="jr-act" data-act="${x.act.a}" data-v="${esc(x.act.v)}">${x.act.l}</button>` : ''}</div>`).join('')}</div><div class="jr-cap">${c.name}</div></div>`).join('')}</div></div>
      <div class="jr-legend">${['done', 'prog', 'miss', 'later'].map(s => `<span>${sIcon(s)}${ST[s]}</span>`).join('')}<span><i class="ln ok"></i>Linked</span><span><i class="ln broken"></i>Broken link</span></div>`;
  }
  function drawLinks(root) {
    (root || document).querySelectorAll('.jr').forEach(jr => {
      const svg = jr.querySelector('.jr-links'), links = JSON.parse(jr.dataset.links || '[]'), box = jr.getBoundingClientRect();
      svg.setAttribute('width', jr.scrollWidth); svg.setAttribute('height', jr.scrollHeight);
      const pt = (k, side) => { const el = jr.querySelector(`[data-k="${k}"]`); if (!el) return null; const r = el.getBoundingClientRect(); return [(side === 'r' ? r.right : r.left) - box.left + jr.scrollLeft, r.top + r.height / 2 - box.top]; };
      svg.innerHTML = links.map(([a, b, kind]) => { const p0 = pt(a, 'r'), p1 = pt(b, 'l'); if (!p0 || !p1 || p1[0] < p0[0]) return ''; const mx = (p0[0] + p1[0]) / 2; return `<path d="M${p0[0]} ${p0[1]} C${mx} ${p0[1]} ${mx} ${p1[1]} ${p1[0]} ${p1[1]}" class="lk lk-${kind}"/><circle cx="${p0[0]}" cy="${p0[1]}" r="3" class="lkd lk-${kind}"/><circle cx="${p1[0]}" cy="${p1[1]}" r="3" class="lkd lk-${kind}"/>`; }).join('');
      if (!jr._ro) { jr._ro = new ResizeObserver(() => drawLinks(jr.parentNode)); jr._ro.observe(jr); }
    });
  }
  Saas.drawLinks = drawLinks;
  const avatar = p => { const ph = { '201155': null }; return `<span class="av">${window.TEX ? window.TEX.facade(p.concept, { floors: p.floors }) : ''}</span>`; };

  Saas.view = 'pipeline'; Saas.sel = null;
  function home2() {
    const fin = A.fin(), ps = A.vis(), t = A.totals(ps), mw = Pano.work(), v = t.forecast - t.budget;
    const hs = ps.map(p => ({ p, h: Pano.health(p), d: dossier(p) }));
    const risk = hs.filter(x => x.h.overall === 'r');
    const missTot = hs.reduce((a, x) => a + x.d.miss, 0), pctAvg = Math.round(hs.reduce((a, x) => a + x.d.pct, 0) / (hs.length || 1));
    if (!Saas.sel || !A.P[Saas.sel] || !A.visIds().has(Saas.sel)) Saas.sel = (risk[0] || hs[0] || {}).p ? (risk[0] || hs[0]).p.id : null;
    const sel = A.P[Saas.sel];
    const stages = ['Brief', 'Design', 'Tender', 'Works', 'Handover'];
    const coming = [...D.TENDERS.filter(x => x.status !== 'Awarded' && A.visIds().has(x.project)).map(x => ({ d: x.date, t: x.pkg.replace(' — early & main works', ''), s: A.P[x.project].city + ' · ' + x.dateLabel, h: '#/tender/' + x.id })), ...ps.map(p => ({ d: (p.admin || {}).opening || p.handover, t: 'Opening', s: p.city, h: '#/project/' + p.id, op: true }))].filter(x => x.d >= today()).sort((a, b) => a.d.localeCompare(b.d)).slice(0, 5);
    const html = `
    <div class="g-head"><h1>Portfolio</h1><div class="g-actions"><button class="rb" data-act="np-open" title="New project" aria-label="New project">${icon('plus')}</button><button class="rb" data-act="export" data-v="the project register" title="Export to Excel" aria-label="Export to Excel">${icon('export')}</button><button class="rb" data-act="palette" title="Ask Copilot" aria-label="Ask Copilot">${icon('spark')}</button></div></div>
    <section class="gl glance">
      <a class="gv" href="#/cost"><span class="gv-l">Forecast vs budget</span><span class="gv-n ${fin ? A.vcls(v / t.budget) : ''}">${fin ? (v >= 0 ? '+' : '−') + mE(Math.abs(v)) : A.mask()}</span><span class="gv-s">${fin ? `${mE(t.forecast)} for ${mE(t.budget)} budget` : 'Restricted'}</span></a>
      <a class="gv" href="#/projects"><span class="gv-l">Projects at risk</span><span class="gv-n ${risk.length ? 'over' : ''}">${risk.length}<small> / ${ps.length}</small></span><span class="gv-s">${risk.map(x => esc(x.p.city)).join(' · ') || 'None'}</span></a>
      <a class="gv" href="#" data-act="view" data-v="dossiers"><span class="gv-l">Dossiers complete</span><span class="gv-n">${pctAvg}<small>%</small></span><span class="gv-s">${missTot} items missing across projects</span></a>
      <a class="gv" href="#mw" data-act="scroll-mw"><span class="gv-l">Waiting for you</span><span class="gv-n">${mw.length}</span><span class="gv-s">${mw.filter(w => A.days(w[3]) <= 4).length} due this week</span></a>
    </section>
    <section class="gl">
      <div class="gl-h"><h2>${Saas.view === 'pipeline' ? 'Projects by stage' : Saas.view === 'dossiers' ? 'Dossier completeness' : Saas.view === 'world' ? 'Projects worldwide' : 'Platform'}</h2>
        <div class="pills" role="tablist">${[['pipeline', 'Pipeline'], ['dossiers', 'Dossiers'], ['world', 'World'], ['platform', 'Platform']].map(x => `<button role="tab" aria-selected="${Saas.view === x[0]}" class="${Saas.view === x[0] ? 'on' : ''}" data-act="view" data-v="${x[0]}">${x[1]}</button>`).join('')}</div></div>
      ${Saas.view === 'pipeline' ? `<div class="pipe">${stages.map(s => { const list = hs.filter(x => x.p.status === s); return `<div class="pipe-col"><div class="pipe-h">${s}<span>${list.length}</span></div>${list.map(x => `<button class="pc ${x.p.id === Saas.sel ? 'on' : ''}" data-act="sel" data-v="${x.p.id}">${avatar(x.p)}<span class="pc-t"><b>${esc(x.p.city)}</b><span>Opening ${A.dfmt((x.p.admin || {}).opening || x.p.handover)} · dossier ${x.d.pct}%</span></span><span class="dot dot-${x.h.overall}" title="${{ g: 'On track', a: 'Watch', r: 'At risk' }[x.h.overall]}"></span></button>`).join('') || '<div class="pipe-empty">No project</div>'}</div>`; }).join('')}</div>`
      : Saas.view === 'dossiers' ? `<div class="dl">${hs.sort((a, b) => a.d.pct - b.d.pct).map(x => `<button class="dl-row ${x.p.id === Saas.sel ? 'on' : ''}" data-act="sel" data-v="${x.p.id}">${avatar(x.p)}<span class="dl-n"><b>${esc(x.p.city)}</b><span>${x.p.status}</span></span><span class="dl-bar"><i style="width:${x.d.pct}%"></i></span><span class="dl-p">${x.d.pct}%</span><span class="dl-m">${x.d.miss ? `<em class="miss">${x.d.miss} missing</em>` : '<em class="ok">Complete</em>'}${x.d.prog ? ` <em>${x.d.prog} in progress</em>` : ''}</span></button>`).join('')}</div>`
      : `<div class="stage-3d">${Saas.view === 'world' ? '<div class="globe" id="globe" role="img" aria-label="Globe of the projects, coloured by health, linked to Paris"></div><span class="g-hint"><i class="hq-dot"></i>Paris HQ · drag to turn · click a project</span>' : '<div class="hero-3d" id="hero3d" role="img" aria-label="3D model of the platform"></div>'}</div>`}
    </section>
    ${sel ? `<section class="gl" id="dossier"><div class="gl-h"><div class="sel-h">${avatar(sel)}<div><h2>${esc(sel.city)}</h2><span class="muted">${sel.status} · dossier ${dossier(sel).pct}% complete</span></div></div><a class="pill-link" href="#/project/${sel.id}">Open project</a></div>${journeyHTML(sel)}</section>` : ''}
    <div class="gl-row">
      <section class="gl" id="mw"><div class="gl-h"><h2>Waiting for you</h2><span class="cnt">${mw.length}</span></div>
        <ul class="mw-list">${mw.slice(0, 6).map(w => { const n = A.days(w[3]); return `<li><a href="${w[4]}"><span class="t"><b>${esc(w[1])}</b><span>${esc(w[2])}</span></span><span class="due ${n <= 4 ? 'soon' : ''}">${n <= 0 ? 'Today' : n === 1 ? 'Tomorrow' : n + ' d'}</span></a>${w[5] ? `<button class="mw-x" data-act="${w[6] || 'mw-done'}" data-v="${esc(w[7] || w[5])}">${w[6] === 'amend-ok' ? 'Approve' : w[6] === 'confirm-block' ? 'Confirm' : 'Done'}</button>` : ''}</li>`; }).join('') || '<li class="empty">Nothing waiting for you.</li>'}</ul></section>
      <section class="gl"><div class="gl-h"><h2>Coming up</h2></div>
        <ul class="plain dates">${coming.map(x => { const d = new Date(x.d + 'T12:00:00'); return `<li><a href="${x.h}"><span class="d ${x.op ? 'op' : ''}"><b>${d.getDate()}</b>${d.toLocaleDateString('en-GB', { month: 'short' })}</span><span><b>${esc(x.t)}</b><i>${esc(x.s)}</i></span></a></li>`; }).join('')}</ul></section>
    </div>`;
    const after = () => {
      drawLinks(document.getElementById('dossier'));
      if (Saas.view === 'world') globe(document.getElementById('globe'), ps);
      if (Saas.view === 'platform') { const h0 = home0(); if (h0 && h0.after) h0.after(); }
    };
    return { html, after };
  }
  A.views.home = home2;
  I.plus = '<path d="M12 5v14M5 12h14"/>';
  I.export = '<path d="M12 4v11M7.5 8.5 12 4l4.5 4.5M5 14v5h14v-5"/>';
  I.upload = '<path d="M12 20V9M7.5 13.5 12 9l4.5 4.5M5 5h14"/>';
  I.id = '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 10h3M8 14h6"/>';

  /* project overview: dossier map under the summary */
  const project1 = A.views.project;
  A.views.project = (id, tab) => {
    const out = project1(id, tab); const p = A.P[id];
    if (!p || !out || (tab && tab !== 'overview')) return out;
    const d = dossier(p);
    const block = `<section class="gl" id="dossier"><div class="gl-h"><h2>Dossier</h2><span class="muted">${d.pct}% complete · ${d.miss} missing · ${d.prog} in progress</span></div>${journeyHTML(p)}</section>`;
    const k = out.html.indexOf('<nav class="tabs"');
    if (k > 0) out.html = out.html.slice(0, k) + block + out.html.slice(k);
    const af = out.after; out.after = () => { if (af) af(); drawLinks(document.getElementById('dossier')); };
    return out;
  };

  /* shell: top pill navigation + round action rail */
  function railShell() {
    document.body.classList.add('saas', 'glass');
    const rail = document.createElement('aside'); rail.className = 'rail'; rail.setAttribute('aria-label', 'Quick actions');
    rail.innerHTML = [['np-open', '', 'plus', 'New project'], ['open-tool', 'Upload documents', 'upload', 'Upload documents'], ['palette', '', 'spark', 'Ask Copilot'], ['export', 'the project register', 'export', 'Export to Excel']].map(x => `<button class="rb" data-act="${x[0]}" data-v="${x[1]}" title="${x[3]}" aria-label="${x[3]}">${icon(x[2])}</button>`).join('') + `<span class="rail-sep"></span><a class="rb" href="#/platform" data-nav="#/platform" title="Admin" aria-label="Admin">${icon('admin')}</a><button class="rb" id="railId" title="Show backlog IDs" aria-label="Show backlog IDs">${icon('id')}</button>`;
    document.body.insertBefore(rail, document.body.firstChild);
    rail.querySelector('#railId').addEventListener('click', () => { const b = document.getElementById('reqBtn'); if (b) b.click(); });
    const top = document.querySelector('.top-in');
    if (top) {
      const r = top.querySelector('.top-r');
      const bell = document.createElement('a'); bell.className = 'icon-btn bell'; bell.href = '#mw'; bell.setAttribute('aria-label', 'Waiting for you'); bell.innerHTML = icon('bell') + '<em id="bellCount"></em>';
      bell.addEventListener('click', e => { e.preventDefault(); if (!/^#\/(home)?$/.test(location.hash || '#/home')) location.hash = '#/home'; setTimeout(() => { const m = document.getElementById('mw'); if (m) m.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300); });
      if (r) r.insertBefore(bell, r.querySelector('#role'));
      const ask = top.querySelector('.ask-btn'); if (ask) { ask.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'; ask.setAttribute('aria-label', 'Search or ask'); }
    }
    const fab = document.createElement('button'); fab.className = 'fab'; fab.setAttribute('data-act', 'np-open'); fab.setAttribute('aria-label', 'New project'); fab.innerHTML = icon('plus', 22); document.body.appendChild(fab);
  }
  const handle1 = Pano.handle;
  Pano.handle = (act, v, b) => {
    switch (act) {
      case 'view': Saas.view = v; A.render(true); return true;
      case 'sel': Saas.sel = v; if (Saas.view !== 'pipeline' && Saas.view !== 'dossiers') Saas.view = 'pipeline'; A.render(true); setTimeout(() => { const d = document.getElementById('dossier'); if (d && window.innerWidth < 900) d.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80); return true;
      case 'scroll-mw': { const m = document.getElementById('mw'); if (m) m.scrollIntoView({ behavior: 'smooth', block: 'start' }); return true; }
    }
    return handle1(act, v, b);
  };
  document.addEventListener('click', e => { const a = e.target.closest('a[data-act]'); if (a && a.getAttribute('href') && a.getAttribute('href').startsWith('#') && !a.getAttribute('href').startsWith('#/')) e.preventDefault(); }, true);
  window.addEventListener('resize', () => drawLinks());
