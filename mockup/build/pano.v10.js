/* Architecture Panoptic — functional layer.
 * Author: Marie Guegain — eleven.
 * Persists every change (projects, sheet confirmations, awards, budget amendments,
 * invoice matches, completed tasks, uploads, audit log) in the artifact's shared
 * store when the page runs as a claude.ai artifact, otherwise in this browser.
 * Reads and writes real Excel files (SheetJS), saves files through the viewer,
 * and answers Copilot questions with Claude when the viewer allows it. */
(function () {
  'use strict';
  const A = window.A; if (!A) return;
  const D = A.D, state = A.state, esc = A.esc;
  const COLS = ['projects', 'tenders', 'amendments', 'done', 'invoices', 'audit', 'docs'];
  const INVOICES = ['INV-88412', 'INV-88430', 'INV-88447'];
  const today = () => new Date().toISOString().slice(0, 10);
  const addDays = (iso, n) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const daysSince = iso => Math.max(0, Math.round((Date.now() - new Date(iso + 'T12:00:00').getTime()) / 864e5));
  const wait = ms => new Promise(r => setTimeout(() => r(null), ms));
  const kE = A.kE;

  const Pano = window.Pano = {
    mode: 'memory', canWrite: true, sample: null, sampleReady: false, downloads: null, assets: null,
    done: new Set(), invoices: new Set(), audit: [], np: null, imp: null,
    amendments: [{ id: 'AM-201155-05', project: '201155', line: '05', amount: 521, reason: 'Main-contract offers (SOR R2): MEP priced above its budget line', status: 'pending', created: '2026-11-09' }]
  };

  /* ---------------- store: artifact db, else this browser, else memory ---------------- */
  const Store = {
    db: null, mem: {},
    local(col) { try { return JSON.parse(localStorage.getItem('panoptic:' + col) || '{}'); } catch (e) { return this.mem[col] || {}; } },
    async put(col, id, data) {
      if (this.db) return this.db.collection(col).doc(id).set(data);
      const all = this.local(col); all[id] = data; this.mem[col] = all;
      try { localStorage.setItem('panoptic:' + col, JSON.stringify(all)); } catch (e) { /* memory only */ }
    }
  };
  async function save(col, id, data) {
    try { await Store.put(col, id, data); return true; }
    catch (e) {
      if (e && e.code === 'invalid_argument') { Pano.canWrite = false; setBadge(); A.toast('You can view this page but not change it. Ask the owner for Contributor access.'); }
      else if (e && e.code === 'quota_exceeded') A.toast('The shared store is full. Delete old uploads or audit entries, then try again.');
      else A.toast('The change could not be saved. Try again in a moment.');
      return false;
    }
  }
  function guard() { if (Pano.canWrite) return true; A.toast('You can view this page but not change it. Ask the owner for Contributor access.'); return false; }

  /* ---------------- applying stored state to the in-memory model ---------------- */
  const BASE = {};
  D.PROJECTS.forEach(p => { BASE[p.id] = { budget0: p.budget, over: JSON.parse(JSON.stringify(p.over || {})) }; });
  function recompute(p) {
    const b = BASE[p.id];
    p.budget = b.budget0; p.over = Object.assign({}, b.over);
    D.genLines(p);
    const adj = p.adj || {};
    if (Object.keys(adj).length) {
      Object.entries(adj).forEach(([code, k]) => { const l = p.lines.find(x => x.short === code); if (l) l.budget += +k; });
      const sum = k => p.lines.reduce((a, l) => a + l[k], 0);
      p.budget = sum('budget'); p.variance = p.forecast - p.budget; p.variancePct = p.variance / p.budget;
    }
    for (let i = D.COST_ITEMS.length - 1; i >= 0; i--) if (D.COST_ITEMS[i].project === p.id) D.COST_ITEMS.splice(i, 1);
    D.genCostItems(p);
  }
  const FIELDS = ['city', 'name2', 'country', 'region', 'zone', 'type', 'status', 'surface', 'floors', 'concept', 'handover', 'progress', 'admin', 'fresh', 'adj', 'mats'];
  function applyProject(doc) {
    let p = A.P[doc.id];
    if (!p) {
      p = { id: doc.id, city: doc.city, country: doc.country || '', region: doc.region || '', zone: doc.zone || 'West', type: doc.type || 'New boutique', status: doc.status || 'Brief', surface: +doc.surface || 300, floors: +doc.floors || 1, concept: doc.concept || 'PLI', budget: +doc.sopK || 3000, handover: doc.handover || addDays(today(), 365), progress: +doc.progress || 0.03, mats: doc.mats || [], over: {}, created: true };
      BASE[p.id] = { budget0: p.budget, over: {} };
      D.PROJECTS.push(p); A.P[p.id] = p;
    }
    FIELDS.forEach(k => { if (doc[k] !== undefined && doc[k] !== null) p[k] = doc[k]; });
    if (doc.sopK) BASE[p.id].budget0 = +doc.sopK;
    recompute(p);
  }
  function applyCol(col, docs) {
    if (col === 'projects') docs.forEach(applyProject);
    else if (col === 'tenders') docs.forEach(d => { const t = A.T[d.id]; if (t) { t.status = d.status || t.status; if (d.awarded) t.awarded = d.awarded; } });
    else if (col === 'amendments') { docs.forEach(d => { const i = Pano.amendments.findIndex(a => a.id === d.id); if (i >= 0) Pano.amendments[i] = Object.assign({}, Pano.amendments[i], d); else Pano.amendments.push(d); }); syncAlerts(); }
    else if (col === 'done') docs.forEach(d => Pano.done.add(d.id));
    else if (col === 'invoices') docs.forEach(d => Pano.invoices.add(d.id));
    else if (col === 'audit') { const seen = new Set(Pano.audit.map(a => a.id)); docs.forEach(d => { if (!seen.has(d.id)) Pano.audit.push(d); }); Pano.audit.sort((a, b) => String(b.at).localeCompare(String(a.at))); }
    else if (col === 'docs') docs.forEach(d => { if (!D.DOCS.some(x => x.id === d.id)) D.DOCS.unshift(d); });
  }
  function syncAlerts() {
    const done = Pano.amendments.some(a => a.id === 'AM-201155-05' && a.status === 'approved');
    const i = (D.ALERTS || []).findIndex(a => a.id === 'A7'); if (done && i >= 0) D.ALERTS.splice(i, 1);
  }
  let renderTimer = null;
  function scheduleRender() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(() => {
      const busy = document.querySelector('.modal.on, .drawer.on, .pal.on');
      if (busy) return scheduleRender();
      A.render(true);
    }, 250);
  }

  async function init() {
    setBadge('Connecting…');
    const c = window.claude;
    let db = null, user = null;
    if (c && typeof c.use === 'function') {
      try { db = await Promise.race([c.use('db'), wait(10000)]); } catch (e) { db = null; }
      try { user = await Promise.race([c.use('user'), wait(4000)]); } catch (e) { user = null; }
      c.use('sample').then(s => { if (s) { Pano.sample = s; Pano.sampleReady = true; } }).catch(() => {});
      c.use('downloads').then(d => { Pano.downloads = d; }).catch(() => {});
      c.use('assets').then(a => { Pano.assets = a; }).catch(() => {});
    }
    if (db) {
      Store.db = db; Pano.mode = 'shared';
      if (user) { try { const w = await user.can('data.write'); if (w === false) Pano.canWrite = false; } catch (e) { /* keep inputs */ } }
      let first = 0;
      const timer = setTimeout(() => setBadge('Saved data not reachable yet'), 10000);
      COLS.forEach(col => {
        db.collection(col).onSnapshot(snap => {
          applyCol(col, snap.docs.map(d => Object.assign({ id: d.id }, d.data())));
          if (!snap.metadata.fromCache && ++first >= COLS.length) { clearTimeout(timer); setBadge(); }
          scheduleRender();
        }, () => { clearTimeout(timer); setBadge('Saved data unavailable'); });
      });
    } else {
      try { localStorage.setItem('panoptic:probe', '1'); Pano.mode = 'local'; } catch (e) { Pano.mode = 'memory'; }
      COLS.forEach(col => applyCol(col, Object.entries(Store.local(col)).map(([id, d]) => Object.assign({ id }, d))));
      setBadge(); A.render(true);
    }
  }
  function setBadge(text) {
    const el = document.querySelector('.sample'); if (!el) return;
    const t = text || (Pano.mode === 'shared' ? (Pano.canWrite ? 'Prototype · changes saved for everyone' : 'Prototype · read-only for you') : Pano.mode === 'local' ? 'Prototype · changes saved in this browser' : 'Prototype · changes not saved');
    el.textContent = t; el.title = 'Six 2027 projects, Flinders Lane bids, photos, plans and tables are real; other figures are sample data.';
  }

  /* ---------------- audit ---------------- */
  async function log(what, project) {
    const e = { id: 'AU-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), at: new Date().toISOString(), role: state.role.name, what, project: project || null };
    Pano.audit.unshift(e); await save('audit', e.id, { at: e.at, role: e.role, what: e.what, project: e.project });
  }
  Pano.auditItems = () => Pano.audit.slice(0, 8).map(a => { const d = new Date(a.at); const same = d.toDateString() === new Date().toDateString(); return [same ? d.toTimeString().slice(0, 5) : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), a.role, a.what, 'Panoptic']; });

  /* ---------------- freshness ---------------- */
  function defaultSheetAge(p) { const r = D.rng(D.hash(p.id + 'fresh')); return p.id === '401111' ? 34 : 2 + Math.floor(r() * 12); }
  Pano.age = (p, block, def) => (p.fresh && p.fresh[block]) ? daysSince(p.fresh[block]) : def;

  /* ---------------- My work ---------------- */
  const STATIC = [
    { roles: ['proc', 'arch'], key: 'stone-gap', verb: 'Review', title: 'Scope gap in the Melbourne stone offers', sub: 'Waterproofing missing from the lowest bid (T-26-031)', due: '2026-11-18', href: '#/tender/T-26-031' },
    { roles: ['proc'], key: 'renew-ex04', verb: 'Renew', title: 'Master agreement with EXAMPLE-04', sub: 'Ends 20 Dec · Diorlex', due: '2026-12-01', href: '#/supplier/EX04' },
    { roles: ['pm', 'arch'], key: 'sanya-ga', verb: 'Upload', title: 'Sanya Swire GA plans, rev 13', sub: 'Two versions of the façade elevation to reconcile', due: '2026-11-17', href: '#/project/300407/documents' },
    { roles: ['pm'], key: 'kl-photos', verb: 'Publish', title: 'Kuala Lumpur site photos, November', sub: 'To Dior DAM', due: '2026-11-21', href: '#/project/200769/documents' },
    { roles: ['bc'], key: 'lcb-co2', verb: 'Decide', title: 'Los Cabos façade change order', sub: '21% above its budget line', due: '2026-11-15', href: '#/project/100610/costs' },
    { roles: ['bc'], key: 'fc-v4', verb: 'Refresh', title: 'Monthly forecast to Anaplan', sub: 'Push committed and forecast to v4', due: '2026-11-28', href: '#/cost' },
    { roles: ['arch'], key: 'db-v43', verb: 'Update', title: 'Women boutique design book, v4.3', sub: 'Two materials replaced', due: '2026-11-25', href: '#/library/books' },
    { roles: ['sp'], key: 'sin-brief', verb: 'Brief', title: 'Singapore shop-in-shop', sub: 'Survey and schedule to upload', due: '2026-11-26', href: '#/project/SIN11' },
    { roles: ['gc'], key: 'gc-mep', verb: 'Clarify', title: 'MEP pricing, Melbourne main contract', sub: 'Fire services and plumbing allowances', due: '2026-11-18', href: '#/tender/T-26-026' },
    { roles: ['gc'], key: 'gc-sow', verb: 'Download', title: 'SOW v3 and drawings', sub: 'Main-contract package', due: '2026-11-14', href: '#/tender/T-26-026' }
  ];
  Pano.work = () => {
    const r = state.role.id, out = [];
    const add = (roles, w) => { if (roles.includes(r)) out.push(w); };
    D.TENDERS.filter(t => t.status === 'Evaluated' && A.P[t.project]).forEach(t => {
      const best = (t.bids || []).slice().sort((a, b) => a.total - b.total)[0];
      add(['proc', 'pm'], ['Approve', `Award: ${t.pkg} · ${A.P[t.project].city}`, best ? `Lowest offer ${A.sup(best.supplier).name}, ${kE(best.total)} · ${t.id}` : t.id, t.date, '#/tender/' + t.id]);
    });
    Pano.amendments.filter(a => a.status === 'pending' && A.P[a.project]).forEach(a => {
      add(['bc', 'pm'], ['Approve', `Budget amendment · ${A.P[a.project].city}, line ${a.line}`, `+€${(+a.amount).toLocaleString('en-GB')}k · ${a.reason}`, addDays(a.created, 7), `#/project/${a.project}/costs`, a.id, 'amend-ok', a.id]);
    });
    D.PROJECTS.forEach(p => { const age = Pano.age(p, 'Project sheet', defaultSheetAge(p)); if (age > 30) add(['pm', 'proc', 'sp'], ['Confirm', `${p.city} project sheet`, `Last confirmed ${age} days ago`, today(), `#/project/${p.id}/data`, 'sheet:' + p.id, 'confirm-block', `${p.id}|Project sheet`]); });
    const left = INVOICES.filter(n => !Pano.invoices.has(n)).length;
    if (left) add(['proc', 'bc'], ['Match', `${left} Coupa invoice${left > 1 ? 's' : ''} without a budget line`, 'Ras Al Khaimah Wynn · suggestion ready', '2026-11-14', '#/cost']);
    STATIC.filter(x => x.roles.includes(r) && !Pano.done.has(x.key)).forEach(x => out.push([x.verb, x.title, x.sub, x.due, x.href, x.key]));
    return out.sort((a, b) => a[3].localeCompare(b[3]));
  };

  /* ---------------- forms ---------------- */
  const fld = (label, id, value, attrs = '') => `<label class="fld" for="${id}">${label}<input id="${id}" value="${esc(value == null ? '' : String(value))}" ${attrs}></label>`;
  const sel = (label, id, opts, value) => `<label class="fld" for="${id}">${label}<select id="${id}">${opts.map(o => { const [v, t] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}" ${String(v) === String(value) ? 'selected' : ''}>${esc(t)}</option>`; }).join('')}</select></label>`;
  const val = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const ZONES = [['East|Asia', 'East · Asia'], ['East|South Asia', 'East · South Asia'], ['East|Mainland China', 'East · Mainland China'], ['East|Oceania', 'East · Oceania'], ['West|Europe', 'West · Europe'], ['West|Americas', 'West · Americas'], ['West|Middle East', 'West · Middle East']];
  const TEMPLATE = [['01', 'Millwork & fixtures', 26], ['02', 'Stone & flooring', 14], ['03', 'Façade & glazing', 12], ['04', 'Lighting', 7], ['05', 'MEP & HVAC', 13], ['06', 'Furniture FF&E', 9], ['07', 'General works', 12], ['08', 'Fees & consultants', 5], ['09', 'Contingency', 2]];

  /* New project wizard */
  function npDefaults() { return { step: 1, src: 'anaplan', f: { code: 'ARC-201390', city: '', name2: '', country: '', zr: 'East|Asia', ptype: 'New', boutique: 'FSS', bconcept: 'PMA by Dior', facade: 'PLI', commitment: addDays(today(), 21), opening: addDays(today(), 380), retail: '420', fcInt: '60', fcExt: '', sop: '6200000', pm: 'PM, East zone', arch: 'Concept Design & 3D', sp: 'Store Planning', bc: 'Finance', po: 'Procurement, East', la: 'To appoint' }, uni: new Set(['Women RTW', 'Bags', 'SLG', 'Shoes', 'CJ', 'Men']), err: '' }; }
  function npRead() {
    const f = Pano.np.f;
    Object.keys(f).forEach(k => { const el = document.getElementById('np-' + k); if (el) f[k] = el.value.trim(); });
    document.querySelectorAll('[data-np-uni]').forEach(el => { if (el.checked) Pano.np.uni.add(el.value); else Pano.np.uni.delete(el.value); });
  }
  function npHTML() {
    const n = Pano.np, f = n.f, st = n.step, steps = ['Start', 'Programme', 'Budget', 'Team', 'Workspace'];
    const id = (f.code.match(/\d{4,}/) || [''])[0];
    let body = '';
    if (st === 1) body = `${[['anaplan', 'From an Anaplan project code', 'The code and SOP budget come from Anaplan and stay in sync.'], ['excel', 'From the ADMIN FOLLOW UP file', 'Import one or several rows from the Excel file.'], ['blank', 'From scratch', 'For a brief that has no budget code yet. Give it a provisional code.']].map(o => `<button class="opt ${n.src === o[0] ? 'on' : ''}" style="width:100%;text-align:left;cursor:pointer" data-act="np-src" data-v="${o[0]}"><b>${o[1]}</b><span class="small muted">${o[2]}</span></button>`).join('')}
      ${n.src === 'excel' ? '<p class="small muted">Continue to open the Excel import.</p>' : `<div class="form-grid" style="margin-top:6px">${fld(n.src === 'anaplan' ? 'Anaplan project code' : 'Provisional code', 'np-code', f.code, 'placeholder="ARC-201390"')}${fld('SOP budget (€)', 'np-sop', f.sop, 'inputmode="numeric"')}</div>`}`;
    else if (st === 2) body = `<div class="form-grid three">${fld('City', 'np-city', f.city, 'placeholder="e.g. Doha" required')}${fld('Site or mall', 'np-name2', f.name2, 'placeholder="e.g. Place Vendôme Qatar"')}${fld('Country', 'np-country', f.country, 'placeholder="e.g. Qatar"')}
        ${sel('Zone and region', 'np-zr', ZONES, f.zr)}${sel('Project type', 'np-ptype', ['New', 'Expansion', 'Relocation', 'Renovation', 'Temporary'], f.ptype)}${sel('Boutique type', 'np-boutique', ['FSS', 'Flag', 'SIS'], f.boutique)}
        ${sel('Boutique concept', 'np-bconcept', ['PMA by Dior', 'PMA Lite'], f.bconcept)}${sel('Façade concept', 'np-facade', D.CONCEPTS.map(c => [c.id, c.name]), f.facade)}${fld('Commitment date', 'np-commitment', f.commitment, 'type="date"')}
        ${fld('Opening date', 'np-opening', f.opening, 'type="date"')}${fld('Retail m²', 'np-retail', f.retail, 'inputmode="numeric"')}${fld('Interior façade m²', 'np-fcInt', f.fcInt, 'inputmode="numeric"')}${fld('Exterior façade m²', 'np-fcExt', f.fcExt, 'inputmode="numeric"')}</div>
        <p class="small" style="margin:18px 0 8px"><b style="font-weight:600">Univers in the boutique</b></p><div class="chips">${D.UNIVERS.map(u => `<label class="chip ${n.uni.has(u) ? 'on' : ''}" style="cursor:pointer"><input type="checkbox" data-np-uni value="${u}" ${n.uni.has(u) ? 'checked' : ''} style="margin:0 6px 0 0">${u}</label>`).join('')}</div>`;
    else if (st === 3) { const sop = +f.sop || 0; body = `<div class="form-grid">${fld('SOP budget (€)', 'np-sop', f.sop, 'inputmode="numeric"')}<label class="fld">Budget template<select><option>${esc(f.boutique)} · ${esc(f.bconcept)}</option></select></label></div>
        <div class="tbl-wrap" style="margin-top:16px"><table class="tbl"><thead><tr><th>Budget line</th><th class="r">Share</th><th class="r">Budget</th></tr></thead><tbody>${TEMPLATE.map(l => `<tr><td>${l[0]} ${l[1]}</td><td class="r">${l[2]}%</td><td class="r">€${Math.round(sop * l[2] / 100000).toLocaleString('en-GB')}k</td></tr>`).join('')}</tbody></table></div><p class="small muted">Lines are created under ARC-${esc(id || '…')} and sent to Anaplan for approval.</p>`; }
    else if (st === 4) body = `<div class="form-grid">${fld('Project manager', 'np-pm', f.pm)}${fld('Architect', 'np-arch', f.arch)}${fld('Store planner', 'np-sp', f.sp)}${fld('Budget controller', 'np-bc', f.bc)}${fld('Procurement officer', 'np-po', f.po)}${fld('Local architect', 'np-la', f.la)}</div><p class="small muted" style="margin-top:14px">Access comes from OKTA groups. External parties are invited per tender, with access that expires on its own.</p>`;
    else body = `<p class="muted" style="margin:0 0 12px">Panoptic creates the project now. The connected workspaces are requested from IT with the standard structure.</p><ul class="checklist"><li><span>Project ARC-${esc(id)} · ${esc(f.city)}${f.name2 ? ' ' + esc(f.name2) : ''}, opening ${A.dlong(f.opening)}</span><span class="small muted">Panoptic</span></li><li><span>SharePoint project site: 01 Brief · 02 Design · 03 Tender · 04 Works · 05 Handover</span><span class="small muted">R&P SharePoint</span></li><li><span>Folder S:\\DIOR\\PROJECTS\\${esc(id)} with the same tree</span><span class="small muted">Server</span></li><li><span>Teams channel with the project team, alerts and approvals</span><span class="small muted">Teams</span></li><li><span>Coupa project code, linked to the Anaplan lines</span><span class="small muted">Coupa · Anaplan</span></li><li><span>Row in the ADMIN FOLLOW UP export</span><span class="small muted">Excel</span></li></ul>`;
    return `<h2>New project</h2><p class="muted" style="margin:0">Five steps. Nothing is saved until you create the project.</p>
      <div class="np-steps">${steps.map((x, i) => `<span class="${i + 1 === st ? 'on' : i + 1 < st ? 'done' : ''}">${i + 1}. ${x}</span>`).join('')}</div>${body}
      ${n.err ? `<p class="over small" role="alert" style="margin:14px 0 0">${esc(n.err)}</p>` : ''}
      <div class="np-foot">${st > 1 ? `<button class="btn ghost" data-act="np-step" data-v="${st - 1}">Back</button>` : '<span></span>'}${st < 5 ? `<button class="btn" data-act="np-step" data-v="${st + 1}">Continue</button>` : '<button class="btn" data-act="np-create">Create the project</button>'}</div>`;
  }
  function npValidate(upTo) {
    const f = Pano.np.f, id = (f.code.match(/\d{4,}/) || [''])[0];
    if (upTo >= 1) { if (!id) return 'Enter a project code with at least four digits, for example ARC-201390.'; if (A.P[id]) return `ARC-${id} already exists. Open it from Projects or use another code.`; if (!(+f.sop > 0)) return 'Enter the SOP budget in euros.'; }
    if (upTo >= 2) { if (!f.city) return 'Enter the city.'; if (!f.opening) return 'Enter the opening date.'; if (!(+f.retail > 0)) return 'Enter the retail surface in m².'; }
    return '';
  }
  async function npCreate() {
    npRead(); const err = npValidate(2); if (err) { Pano.np.err = err; A.openModal(npHTML()); return; }
    if (!guard()) return;
    const f = Pano.np.f, id = (f.code.match(/\d{4,}/) || [''])[0], [zone, region] = f.zr.split('|');
    const retail = +f.retail, months = Math.max(0, Math.round((new Date(f.opening) - new Date(f.commitment)) / (30.4 * 864e5)));
    const doc = { city: f.city, name2: f.name2 || null, country: f.country, region, zone, type: `${f.ptype} boutique, ${f.boutique}`.replace('New boutique, Flag', 'New flagship'), status: 'Brief', surface: retail, floors: retail > 450 ? 2 : 1, concept: f.facade, sopK: Math.round(+f.sop / 1000), handover: f.opening, progress: 0.03, mats: [], created: true, createdAt: new Date().toISOString(),
      admin: { opening: f.opening, commitment: f.commitment, boutique: f.boutique, concept: f.bconcept, retail, fcInt: +f.fcInt || null, fcExt: +f.fcExt || null, fcIntConcept: f.fcInt ? 'Generic' : '—', fcExtConcept: f.fcExt ? 'Generic' : '—', sop: +f.sop, months },
      univers: [...Pano.np.uni], team: { pm: f.pm, arch: f.arch, sp: f.sp, bc: f.bc, po: f.po, la: f.la }, fresh: { 'Project sheet': today() } };
    if (!(await save('projects', id, doc))) return;
    applyProject(Object.assign({ id }, doc));
    await log(`Created project ARC-${id} · ${f.city}`, id);
    A.closeOverlays(); location.hash = '#/project/' + id + '/data'; A.render();
    A.toast(`ARC-${id} created. Workspace requests sent; the team will find it in Projects.`);
  }

  /* Edit project sheet */
  function sheetHTML(p) {
    const a = p.admin || {};
    return `<h2>Project sheet</h2><p class="muted" style="margin:0 0 18px">${esc(p.city)} · ARC-${p.id}. Saving also confirms the sheet for the next 30 days.</p>
      <div class="form-grid three">${sel('Stage', 'ps-status', D.STATUSES, p.status)}${fld('Opening date', 'ps-opening', a.opening || p.handover, 'type="date"')}${fld('Commitment date', 'ps-commitment', a.commitment || '', 'type="date"')}
      ${fld('Retail m²', 'ps-retail', a.retail || p.surface, 'inputmode="numeric"')}${fld('Interior façade m²', 'ps-fcInt', a.fcInt || '', 'inputmode="numeric"')}${fld('Exterior façade m²', 'ps-fcExt', a.fcExt || '', 'inputmode="numeric"')}
      ${sel('Boutique type', 'ps-boutique', ['FSS', 'Flag', 'SIS'], a.boutique || 'FSS')}${sel('Boutique concept', 'ps-bconcept', ['PMA by Dior', 'PMA Lite'], a.concept || 'PMA by Dior')}${fld('Progress (%)', 'ps-progress', Math.round(p.progress * 100), 'inputmode="numeric"')}</div>
      <p class="small muted" style="margin-top:14px">The SOP budget (${A.fin() ? '€' + Math.round((a.sop || p.budget * 1000)).toLocaleString('en-GB') : 'restricted'}) comes from Anaplan. To change it, request a budget amendment.</p>
      <div class="np-foot"><button class="btn ghost" data-act="close">Cancel</button><button class="btn" data-act="sheet-save" data-v="${p.id}">Save and confirm</button></div>`;
  }
  async function sheetSave(id) {
    if (!guard()) return;
    const p = A.P[id]; if (!p) return;
    const opening = val('ps-opening'), retail = +val('ps-retail'), progress = Math.min(100, Math.max(0, +val('ps-progress') || 0)) / 100;
    if (!opening || !(retail > 0)) { A.toast('Opening date and retail m² are required.'); return; }
    const admin = Object.assign({}, p.admin || {}, { opening, commitment: val('ps-commitment') || (p.admin || {}).commitment, retail, fcInt: +val('ps-fcInt') || null, fcExt: +val('ps-fcExt') || null, boutique: val('ps-boutique'), concept: val('ps-bconcept') });
    const fresh = Object.assign({}, p.fresh || {}, { 'Project sheet': today() });
    const before = { status: p.status, opening: (p.admin || {}).opening || p.handover, retail: (p.admin || {}).retail || p.surface };
    const doc = projectDoc(p, { status: val('ps-status'), handover: opening, surface: retail, progress, admin, fresh });
    if (!(await save('projects', id, doc))) return;
    applyProject(Object.assign({ id }, doc));
    const ch = []; if (before.status !== doc.status) ch.push(`stage ${before.status} → ${doc.status}`); if (before.opening !== opening) ch.push(`opening ${A.dfmt(before.opening)} → ${A.dfmt(opening)}`); if (+before.retail !== retail) ch.push(`retail ${before.retail} → ${retail} m²`);
    await log(`Project sheet ${p.city} saved${ch.length ? ': ' + ch.join(', ') : ', confirmed unchanged'}`, id);
    A.closeOverlays(); A.render(true); A.toast('Project sheet saved and confirmed.');
  }
  function projectDoc(p, patch) {
    const keep = {}; FIELDS.forEach(k => { if (p[k] !== undefined) keep[k] = p[k]; });
    if (p.name2 && keep.city && keep.city.endsWith(' ' + p.name2)) keep.city = keep.city.slice(0, -(p.name2.length + 1));
    if (p.created) { keep.created = true; keep.sopK = BASE[p.id].budget0; }
    return JSON.parse(JSON.stringify(Object.assign(keep, patch)));
  }
  async function confirmBlock(v) {
    if (!guard()) return;
    const [id, block] = v.split('|'); const p = A.P[id]; if (!p) return;
    const fresh = Object.assign({}, p.fresh || {}, { [block]: today() });
    if (!(await save('projects', id, projectDoc(p, { fresh })))) return;
    p.fresh = fresh; await log(`${block} confirmed for ${p.city}`, id); A.render(true); A.toast(`${block} confirmed for ${p.city}.`);
  }

  /* Budget amendments */
  function amendHTML() {
    const ps = D.PROJECTS.filter(p => A.visIds().has(p.id));
    return `<h2>Budget amendment</h2><p class="muted" style="margin:0 0 18px">The request goes to the budget controller. Once approved, the line is updated here and pushed to Anaplan.</p>
      <div class="form-grid">${sel('Project', 'am-project', ps.map(p => [p.id, p.city]), ps[0] && ps[0].id)}${sel('Budget line', 'am-line', TEMPLATE.map(l => [l[0], `${l[0]} ${l[1]}`]), '05')}${fld('Amount (k€, negative to reduce)', 'am-amount', '100', 'inputmode="numeric"')}${fld('Reason', 'am-reason', '', 'placeholder="e.g. Change order 03, façade lighting"')}</div>
      <div class="np-foot"><button class="btn ghost" data-act="close">Cancel</button><button class="btn" data-act="amend-create">Send for approval</button></div>`;
  }
  async function amendCreate() {
    if (!guard()) return;
    const amount = Math.round(+val('am-amount')), reason = val('am-reason'), project = val('am-project'), line = val('am-line');
    if (!amount || !reason) { A.toast('Enter an amount and a reason.'); return; }
    const a = { id: 'AM-' + project + '-' + line + '-' + Date.now().toString(36), project, line, amount, reason, status: 'pending', created: today() };
    if (!(await save('amendments', a.id, a))) return;
    Pano.amendments.push(a); await log(`Budget amendment requested · ${A.P[project].city} line ${line}, ${amount > 0 ? '+' : ''}€${amount}k`, project);
    A.closeOverlays(); A.render(true); A.toast('Amendment sent to the budget controller.');
  }
  async function amendApprove(id) {
    if (!guard()) return;
    const a = Pano.amendments.find(x => x.id === id); if (!a || a.status !== 'pending') return;
    const p = A.P[a.project]; const adj = Object.assign({}, p.adj || {}); adj[a.line] = (+adj[a.line] || 0) + (+a.amount);
    if (!(await save('projects', p.id, projectDoc(p, { adj })))) return;
    const upd = Object.assign({}, a, { status: 'approved', approved: today(), approver: state.role.name });
    if (!(await save('amendments', a.id, upd))) return;
    Object.assign(a, upd); p.adj = adj; recompute(p); syncAlerts();
    await log(`Budget amendment approved · ${p.city} line ${a.line}, ${a.amount > 0 ? '+' : ''}€${a.amount}k, queued for Anaplan`, p.id);
    A.render(true); A.toast(`Approved. ARC-${p.id}.${a.line} updated; the change is queued for Anaplan.`);
  }

  /* Excel import */
  const COLMAP = { 'ZONE': 'zone', 'REGION': 'region', 'COUNTRY': 'country', 'PROJECT ID': 'id', 'PROJECT NAME': 'name', 'COMMITMENT DATE': 'commitment', 'OPENING DATE': 'opening', 'PROJECT TYPE': 'ptype', 'BOUTIQUE TYPE': 'boutique', 'BOUTIQUE CONCEPT': 'bconcept', 'RETAIL SQM': 'retail', 'FC INT SQM': 'fcInt', 'FC EXT SQM': 'fcExt', 'FC INT CONCEPT': 'fcIntConcept', 'FC EXT CONCEPT': 'fcExtConcept' };
  const norm = h => String(h == null ? '' : h).replace(/\s+/g, ' ').trim().toUpperCase();
  function toISO(v) {
    if (v == null || v === '') return null;
    if (v instanceof Date && !isNaN(v)) return new Date(v.getTime() - v.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
    if (typeof v === 'number') return new Date(Math.round((v - 25569) * 864e5)).toISOString().slice(0, 10);
    const m = String(v).match(/(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})/); if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
    const m2 = String(v).match(/(\d{4})-(\d{2})-(\d{2})/); return m2 ? m2[0] : null;
  }
  const num = v => { if (typeof v === 'number') return v; const s = String(v == null ? '' : v).replace(/[^\d,.-]/g, '').replace(/\s/g, ''); if (!s) return null; const n = parseFloat(s.replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.')); return isNaN(n) ? null : n; };
  function parseRows(aoa, sheet) {
    let hi = -1, map = {};
    for (let i = 0; i < Math.min(aoa.length, 15); i++) { const hs = (aoa[i] || []).map(norm); if (hs.includes('PROJECT ID') && hs.includes('PROJECT NAME')) { hi = i; hs.forEach((h, j) => { if (COLMAP[h]) map[COLMAP[h]] = j; else if (h.startsWith('SOP BUDGET')) map.sop = j; }); break; } }
    if (hi < 0) return [];
    const byId = {};
    aoa.slice(hi + 1).forEach((row, k) => {
      const id = String(row[map.id] == null ? '' : row[map.id]).trim().replace(/\.0$/, ''); if (!/^\w{4,}$/.test(id)) return;
      if (!byId[id]) byId[id] = { id, sheet, row: hi + 2 + k, rows: 0, zone: row[map.zone], region: row[map.region], country: row[map.country], name: row[map.name], commitment: toISO(row[map.commitment]), opening: toISO(row[map.opening]), ptype: row[map.ptype], boutique: row[map.boutique], bconcept: row[map.bconcept], retail: num(row[map.retail]), fcInt: num(row[map.fcInt]), fcExt: num(row[map.fcExt]), fcIntConcept: row[map.fcIntConcept], fcExtConcept: row[map.fcExtConcept], sop: num(row[map.sop]) };
      byId[id].rows++;
    });
    return Object.values(byId);
  }
  function diff(rows) {
    return rows.map(r => {
      const p = A.P[r.id];
      if (!p) return Object.assign(r, { kind: 'new', note: 'Create the project' });
      const a = p.admin || {}, notes = [], apply = {};
      if (r.opening && r.opening !== (a.opening || p.handover)) { notes.push(`opening ${A.dfmt(a.opening || p.handover)} → ${A.dfmt(r.opening)}`); apply.opening = r.opening; }
      if (r.retail && +r.retail !== +(a.retail || p.surface)) { notes.push(`retail ${a.retail || p.surface} → ${r.retail} m²`); apply.retail = +r.retail; }
      let budgetFlag = '';
      if (r.sop && Math.abs(r.sop - (a.sop || p.budget * 1000)) > 1000) budgetFlag = `SOP budget in the file €${Math.round(r.sop).toLocaleString('en-GB')} differs from Anaplan: kept from Anaplan, flagged to Finance`;
      if (budgetFlag) notes.push(budgetFlag);
      return Object.assign(r, { kind: notes.length ? (Object.keys(apply).length ? 'change' : 'flag') : 'same', note: notes.join(' · ') || 'nothing to change', apply, budgetFlag });
    });
  }
  function importHTML() {
    const im = Pano.imp;
    const list = im && im.rows ? `<p class="small muted" style="margin:0 0 10px">${esc(im.file)} · ${im.rows.length} projects read from ${im.lines} rows</p><div class="tbl-wrap"><table class="tbl"><thead><tr><th></th><th>Project</th><th>Sheet · row</th><th>What Panoptic will do</th></tr></thead><tbody>${im.rows.map((r, i) => `<tr><td>${r.kind === 'same' ? '' : `<input type="checkbox" data-imp="${i}" ${r.kind === 'flag' ? '' : 'checked'} aria-label="Apply ${esc(String(r.name || r.id))}">`}</td><td><b style="font-weight:600">${esc(String(r.name || '—'))}</b> <span class="code">${esc(r.id)}</span></td><td class="code">${esc(r.sheet)} · ${r.row}</td><td class="small">${r.kind === 'same' ? '<span class="status s-ok">Same</span> ' : r.kind === 'new' ? '<span class="status s-Approved">New</span> ' : '<span class="status s-warn">Review</span> '}${esc(r.note)}</td></tr>`).join('')}</tbody></table></div>
      <div class="np-foot"><span class="small muted">Applied changes are written to the audit log.</span><button class="btn" data-act="imp-apply">Apply the selected rows</button></div>` : '';
    return `<h2>Import from Excel</h2><p class="muted" style="margin:0 0 18px">Choose the project list as it is kept today. Panoptic reads the ADMIN FOLLOW UP columns (zone, region, country, project ID and name, dates, boutique, m², SOP budget) on every sheet.</p>
      <div class="drop"><label for="imp-file" style="cursor:pointer"><b style="color:var(--ink)">Choose an .xlsx file</b> or drop it here</label><input id="imp-file" type="file" accept=".xlsx,.xls,.xlsm,.csv" style="display:block;margin:12px auto 0"></div>
      ${im && im.error ? `<p class="over small" role="alert">${esc(im.error)}</p>` : ''}
      ${list || `<p class="small muted">No file at hand? <button class="btn sm ghost" data-act="imp-example">Use the example rows</button> (the 2027 sheet shown in the workshop, plus two 2028 rows).</p>`}`;
  }
  async function importFile(file) {
    Pano.imp = { file: file.name };
    if (!window.XLSX) { Pano.imp.error = 'The Excel reader did not load. Check the connection and open the import again.'; A.openModal(importHTML()); return; }
    try {
      const wb = window.XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true });
      let rows = [], lines = 0;
      wb.SheetNames.forEach(n => { const aoa = window.XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, raw: true, defval: null }); const r = parseRows(aoa, n); rows = rows.concat(r); lines += r.reduce((a, x) => a + x.rows, 0); });
      if (!rows.length) { Pano.imp.error = 'No sheet in this file has the PROJECT ID and PROJECT NAME columns.'; }
      else { Pano.imp.rows = diff(rows); Pano.imp.lines = lines; }
    } catch (e) { Pano.imp.error = 'This file could not be read as Excel.'; }
    A.openModal(importHTML());
  }
  function importExample() {
    const H = ['ZONE', 'REGION', 'COUNTRY', 'PROJECT ID', 'PROJECT NAME', 'OPENING YEAR', 'COMMITMENT DATE', 'OPENING DATE', 'PROJECT TYPE', 'BOUTIQUE TYPE', 'BOUTIQUE CONCEPT', 'RETAIL SQM', 'FC INT SQM', 'FC EXT SQM', 'FC INT CONCEPT', 'FC EXT CONCEPT', 'SOP BUDGET €'];
    const R = [['EAST', 'SOUTH ASIA', 'Australia', 201155, 'Melbourne Flinders Lane', 2027, '23/04/2026', '31/12/2027', 'New', 'Flag', 'PMA by Dior', 610, null, 180, '-', 'Generic', 14497633], ['WEST', 'EUROPE', 'Denmark', 401111, 'Copenhagen', 2027, '12/05/2026', '01/07/2027', 'New', 'FSS', 'PMA Lite', 365, null, 372, '-', 'Generic', 7530986], ['WEST', 'AMERICAS', 'Mexico', 100610, 'Los Cabos', 2027, '24/06/2026', '31/01/2027', 'New', 'FSS', 'PMA by Dior', 368, 134, null, 'Generic', '-', 5120000], ['EAST', 'MAINLAND CHINA', 'China', 300407, 'Sanya Swire', 2027, '01/07/2026', '01/06/2027', 'New', 'Flag', 'PMA by Dior', 690, 132, 265, 'Twist', 'NY 5th', 9255900], ['EAST', 'SOUTH ASIA', 'Malaysia', 200769, 'Kuala Lumpur Pavilion', 2027, '07/07/2026', '30/04/2027', 'Expansion', 'Flag', 'PMA by Dior', 760, 398, 604, 'Chadstone', 'Chengdu IFS', 9314437], ['WEST', 'MEA', 'UAE', 601421, 'Ras Al Khaimah Wynn', 2027, '29/07/2026', '15/07/2027', 'New', 'FSS', 'PMA by Dior', 416, 50, null, 'Generic', '-', 6260180]];
    const R28 = [['EAST', 'ASIA', 'Japan', 301912, 'Example project A', 2028, '15/01/2027', '30/03/2028', 'New', 'FSS', 'PMA by Dior', 380, 60, null, 'Generic', '-', 5400000], ['WEST', 'EUROPE', 'Italy', 401188, 'Example project B', 2028, '02/02/2027', '30/06/2028', 'Relocation', 'Flag', 'PMA by Dior', 640, 120, 210, 'Generic', 'Generic', 11800000]];
    const rows = parseRows([H].concat(R, R, R.slice(0, 2)), '2027').concat(parseRows([H].concat(R28), '2028+'));
    Pano.imp = { file: 'Example rows (2027 workshop sheet + two 2028 rows)', rows: diff(rows), lines: R.length * 2 + 2 + R28.length };
    A.openModal(importHTML());
  }
  async function importApply() {
    if (!guard()) return;
    const im = Pano.imp; if (!im || !im.rows) return;
    const picked = [...document.querySelectorAll('[data-imp]')].filter(x => x.checked).map(x => im.rows[+x.dataset.imp]);
    let created = 0, changed = 0, flagged = 0;
    for (const r of picked) {
      const zoneW = /east/i.test(String(r.zone)) ? 'East' : 'West';
      const region = String(r.region || '').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()).replace('Mea', 'Middle East');
      if (r.kind === 'new') {
        const retail = +r.retail || 300;
        const doc = { city: String(r.name || r.id), country: String(r.country || ''), region, zone: zoneW, type: `${r.ptype || 'New'} boutique, ${r.boutique || 'FSS'}`, status: 'Brief', surface: retail, floors: retail > 450 ? 2 : 1, concept: 'PLI', sopK: Math.round((+r.sop || 3e6) / 1000), handover: r.opening || addDays(today(), 400), progress: 0.03, mats: [], created: true, createdAt: new Date().toISOString(), fresh: { 'Project sheet': today() },
          admin: { opening: r.opening, commitment: r.commitment, boutique: r.boutique || 'FSS', concept: r.bconcept || 'PMA by Dior', retail, fcInt: r.fcInt || null, fcExt: r.fcExt || null, fcIntConcept: r.fcIntConcept || '—', fcExtConcept: r.fcExtConcept || '—', sop: +r.sop || null, months: r.opening && r.commitment ? Math.round((new Date(r.opening) - new Date(r.commitment)) / (30.4 * 864e5)) : null } };
        if (await save('projects', r.id, doc)) { applyProject(Object.assign({ id: r.id }, doc)); created++; }
      } else {
        const p = A.P[r.id];
        if (r.apply && Object.keys(r.apply).length) {
          const admin = Object.assign({}, p.admin || {}, r.apply.opening ? { opening: r.apply.opening } : {}, r.apply.retail ? { retail: r.apply.retail } : {});
          const doc = projectDoc(p, Object.assign({ admin }, r.apply.opening ? { handover: r.apply.opening } : {}, r.apply.retail ? { surface: r.apply.retail } : {}));
          if (await save('projects', r.id, doc)) { applyProject(Object.assign({ id: r.id }, doc)); changed++; }
        }
        if (r.budgetFlag) flagged++;
      }
    }
    await log(`Excel import (${im.file}): ${created} created, ${changed} updated, ${flagged} budget difference${flagged === 1 ? '' : 's'} flagged to Finance`);
    Pano.imp = null; A.closeOverlays(); A.render(true);
    A.toast(`${created} project${created === 1 ? '' : 's'} created, ${changed} updated${flagged ? `, ${flagged} budget difference${flagged === 1 ? '' : 's'} flagged to Finance` : ''}.`);
  }

  /* Files out */
  async function saveFile(filename, data, mime) {
    if (Pano.downloads) {
      try { await Pano.downloads.save({ filename, data }); A.toast(`${filename} ready.`); }
      catch (e) { if (!e || e.code !== 'cancelled') A.toast('The file was not saved.'); }
      return;
    }
    try {
      const url = URL.createObjectURL(new Blob([data], { type: mime })); const a = document.createElement('a');
      a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
      A.toast(`${filename} downloaded.`);
    } catch (e) { A.toast('This viewer cannot save files.'); }
  }
  function xlsx(sheets, filename) {
    if (!window.XLSX) {
      const [name, aoa] = sheets[0];
      const csv = aoa.map(r => r.map(c => { const s = c == null ? '' : String(c); return /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(';')).join('\n');
      return saveFile(filename.replace(/\.xlsx$/, '.csv'), '\ufeff' + csv, 'text/csv');
    }
    const wb = window.XLSX.utils.book_new();
    sheets.forEach(([name, aoa]) => { const ws = window.XLSX.utils.aoa_to_sheet(aoa); ws['!cols'] = aoa[0].map(() => ({ wch: 16 })); window.XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31)); });
    const out = window.XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return saveFile(filename, new Uint8Array(out), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  }
  function exportRegister() {
    const H = ['ZONE', 'REGION', 'COUNTRY', 'PROJECT ID', 'PROJECT NAME', 'OPENING YEAR', 'COMMITMENT DATE', 'OPENING DATE', 'MONTHS BEFORE OPENING', 'PROJECT TYPE', 'BOUTIQUE TYPE', 'BOUTIQUE CONCEPT', 'RETAIL SQM', 'FC INT SQM', 'FC EXT SQM', 'FC INT CONCEPT', 'FC EXT CONCEPT', 'SOP BUDGET €', 'COMMITTED €', 'INVOICED €', 'FORECAST €', 'STAGE'];
    const rows = D.PROJECTS.filter(p => A.visIds().has(p.id)).map(p => { const a = p.admin || {}; const open = a.opening || p.handover; return [p.zone.toUpperCase(), (p.region || '').toUpperCase(), p.country, p.id, p.city, open ? open.slice(0, 4) : '', a.commitment || '', open || '', a.months || '', /expansion/i.test(p.type) ? 'Expansion' : 'New', a.boutique || '', a.concept || '', a.retail || p.surface, a.fcInt || '', a.fcExt || '', a.fcIntConcept || '', a.fcExtConcept || '', A.fin() ? Math.round(a.sop || p.budget * 1000) : '', A.fin() ? p.committed * 1000 : '', A.fin() ? p.actual * 1000 : '', A.fin() ? p.forecast * 1000 : '', p.status]; });
    return xlsx([['Project register', [H].concat(rows)]], `Panoptic_project_register_${today()}.xlsx`);
  }
  function exportCosts() {
    if (!A.fin()) return A.toast('Cost data is restricted for this role.');
    const H = ['PROJECT ID', 'PROJECT', 'BUDGET LINE', 'CATEGORY', 'BUDGET k€', 'COMMITTED k€', 'INVOICED k€', 'FORECAST k€', 'VARIANCE %'];
    const rows = []; D.PROJECTS.filter(p => A.visIds().has(p.id)).forEach(p => p.lines.forEach(l => rows.push([p.id, p.city, l.code, l.name, l.budget, l.committed, l.actual, l.forecast, Math.round((l.forecast / l.budget - 1) * 1000) / 10])));
    return xlsx([['Budget lines', [H].concat(rows)]], `Panoptic_budget_lines_${today()}.xlsx`);
  }
  function exportComparison() {
    const id = (location.hash.match(/tender\/([\w-]+)/) || [])[1]; const t = id && A.T[id];
    if (!t || !t.bids) return A.toast('Open a tender with offers to export its comparison.');
    const names = t.bids.map(b => A.sup(b.supplier).name);
    const aoa = [['SOW LINE', 'BUDGET BENCHMARK k€'].concat(names.map(n => n + ' k€'))].concat(t.sow.map((s, i) => [s.ref + ' ' + s.name, s.benchmark].concat(t.bids.map(b => b.lines[i])))).concat([['TOTAL', t.benchmark].concat(t.bids.map(b => b.total))]);
    return xlsx([[t.id, aoa]], `${t.id}_offer_comparison.xlsx`);
  }
  function exportHealth() {
    const H = ['PROJECT ID', 'PROJECT', 'PROJECT SHEET AGE (DAYS)', 'LAST CONFIRMED'];
    const rows = D.PROJECTS.filter(p => A.visIds().has(p.id)).map(p => [p.id, p.city, Pano.age(p, 'Project sheet', defaultSheetAge(p)), (p.fresh && p.fresh['Project sheet']) || '']);
    return xlsx([['Data health', [H].concat(rows)]], `Panoptic_data_health_${today()}.xlsx`);
  }

  /* Uploads */
  const UP_TYPES = [['Drawing', 'dwg', 'Project lifetime'], ['Site photos', 'jpg', 'Project lifetime'], ['Minutes', 'docx', 'Project lifetime'], ['Technical sheet', 'pdf', 'Project lifetime'], ['SOW', 'xlsx', 'Tender · 7 years'], ['Tender return', 'pdf', 'Tender · 7 years'], ['Contract', 'docx', 'Contract · lifetime + 5 years'], ['Invoice', 'pdf', 'Financial · 10 years']];
  function uploadHTML() {
    const ps = D.PROJECTS.filter(p => A.visIds().has(p.id)); const cur = (location.hash.match(/project\/(\w+)/) || [])[1];
    return `<h2>Upload documents</h2><p class="muted" style="margin:0 0 18px">${Pano.assets ? 'Files are stored with the page and filed under the project.' : 'Files are filed under the project for this visit only: storing them needs Editor access on this page.'}</p>
      <div class="form-grid">${sel('Project', 'up-project', ps.map(p => [p.id, p.city]), cur || (ps[0] && ps[0].id))}${sel('Document type', 'up-type', UP_TYPES.map(t => t[0]), 'Drawing')}</div>
      <div class="drop" style="margin-top:16px"><label for="up-files" style="cursor:pointer"><b style="color:var(--ink)">Choose files</b> (PDF, images, Office files, up to 20 MB each)</label><input id="up-files" type="file" multiple style="display:block;margin:12px auto 0"></div>
      <div class="np-foot"><button class="btn ghost" data-act="close">Cancel</button><button class="btn" data-act="upload-go">Upload</button></div>`;
  }
  async function uploadGo() {
    const input = document.getElementById('up-files'); const files = input ? [...input.files] : [];
    if (!files.length) { A.toast('Choose at least one file.'); return; }
    const project = val('up-project'), type = val('up-type'), tdef = UP_TYPES.find(t => t[0] === type) || UP_TYPES[0];
    let n = 0;
    for (const f of files) {
      if (f.size > 20 * 1024 * 1024) { A.toast(`${f.name} is over 20 MB and was skipped.`); continue; }
      let url = null, assetId = null, kept = false;
      if (Pano.assets && Pano.canWrite) { try { const r = await Pano.assets.upload(f); url = r.url; assetId = r.id; kept = true; } catch (e) { url = null; } }
      if (!url) url = URL.createObjectURL(f);
      const ext = (f.name.split('.').pop() || tdef[1]).toLowerCase().slice(0, 4);
      const d = { id: 'UP-' + Date.now().toString(36) + n, name: f.name.replace(/\.[^.]+$/, ''), type, project, ext, src: 'Panoptic upload', retention: tdef[2], status: 'Published', updated: today(), tags: [type.toLowerCase(), 'uploaded', A.P[project].city.toLowerCase()], url, assetId, img: /^image\//.test(f.type) ? url : undefined };
      D.DOCS.unshift(d); n++;
      if (kept) await save('docs', d.id, JSON.parse(JSON.stringify(d)));
    }
    if (n) await log(`${n} document${n > 1 ? 's' : ''} uploaded to ${A.P[project].city} (${type})`, project);
    A.closeOverlays(); A.render(true); A.toast(`${n} document${n > 1 ? 's' : ''} filed under ${A.P[project].city}.`);
  }

  /* Copilot with Claude */
  function context() {
    const ps = D.PROJECTS.filter(p => A.visIds().has(p.id));
    const fin = A.fin();
    const uni = {}; D.COST_ITEMS.filter(i => A.visIds().has(i.project)).forEach(i => { uni[i.univers] = (uni[i.univers] || 0) + i.amount; });
    return {
      today: today(), viewerRole: state.role.name, currency: 'EUR, amounts in k€ unless stated',
      note: 'Six 2027 projects (Melbourne, Copenhagen, Los Cabos, Sanya, Kuala Lumpur, Ras Al Khaimah) and the Melbourne main-contract bids are real; other projects, suppliers named EXAMPLE and cost splits are sample data.',
      projects: ps.map(p => ({ id: p.id, name: p.city, country: p.country, zone: p.zone, region: p.region, type: p.type, stage: p.status, opening: (p.admin || {}).opening || p.handover, retailSqm: (p.admin || {}).retail || p.surface, facade: (A.C[p.concept] || {}).name, budget: fin ? p.budget : 'restricted', committed: fin ? p.committed : 'restricted', invoiced: fin ? p.actual : 'restricted', forecast: fin ? p.forecast : 'restricted', variancePct: fin ? Math.round(p.variancePct * 1000) / 10 : 'restricted', lines: fin ? p.lines.map(l => [l.code, l.name, l.budget, l.committed, l.forecast]) : 'restricted', sheetConfirmedDaysAgo: Pano.age(p, 'Project sheet', defaultSheetAge(p)) })),
      tenders: D.TENDERS.filter(t => A.visIds().has(t.project)).map(t => ({ id: t.id, project: A.P[t.project].city, package: t.pkg, stage: t.status, date: t.date, benchmark: t.benchmark, awardedTo: t.awarded ? A.sup(t.awarded).name : null, offers: (t.bids || []).map(b => ({ supplier: A.sup(b.supplier).name, total: b.total, gaps: b.gaps.map(g => g.text) })) })),
      alerts: (D.ALERTS || []).map(a => ({ title: a.title, text: String(a.body).replace(/<[^>]+>/g, '') })),
      budgetAmendments: Pano.amendments.map(a => ({ project: (A.P[a.project] || {}).city, line: a.line, amountK: a.amount, reason: a.reason, status: a.status })),
      spendByUnivers: fin ? uni : 'restricted',
      suppliers: D.SUPPLIERS.map(s => ({ name: s.name, category: s.cat, country: s.country, contractEnds: s.expiry, onTimePct: s.kpi.delivery })),
      recentChanges: Pano.audit.slice(0, 10).map(a => ({ at: a.at, by: a.role, what: a.what }))
    };
  }
  const fmt = t => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/^\s*[-•]\s+/gm, '• ').replace(/\n/g, '<br>');
  Pano.askClaude = async (raw, body, resHtml, fallbackText) => {
    body.innerHTML = `<div class="answer"><div class="txt cur" id="ansTxt"><span class="muted">Reading projects, budgets, tenders and alerts…</span></div><div class="srcs"><span class="small muted">Answered by Panoptic Copilot from the data in this page · check figures before sharing</span></div></div><div id="ansRes">${resHtml}</div>`;
    const el = document.getElementById('ansTxt');
    const prompt = `You are Panoptic Copilot, the assistant inside the project, cost and tender platform of a luxury brand's store architecture department.\nAnswer the question using ONLY the JSON data below. Reply in the language of the question. Be concise: at most 6 short sentences, or a short list. Give amounts in € with k or M. Name projects, tenders and suppliers as in the data. If the data does not hold the answer, say so plainly and say which system would (Anaplan, Coupa, SharePoint, Diorlex). If the viewer's role makes a figure restricted, say it is restricted. Plain text; you may use **bold** for key figures and "- " for list items.\n\nDATA:\n${JSON.stringify(context())}\n\nQUESTION: ${raw}`;
    try {
      const res = await Pano.sample(prompt, { onText: ({ text }) => { if (el && text) el.innerHTML = fmt(text); }, modelTier: 'default', cache: false });
      if (el) { el.innerHTML = fmt(res.text || ''); el.classList.remove('cur'); }
    } catch (e) {
      if (e && e.code === 'not_granted') Pano.sampleReady = false;
      if (el) { el.classList.remove('cur'); el.innerHTML = (fallbackText || 'Copilot is not available in this view.') + (e && e.code === 'rate_limited' ? '<br><span class="small muted">Copilot is busy; try again in a minute.</span>' : ''); }
    }
  };

  /* ---------------- action router ---------------- */
  Pano.handle = (act, v, b) => {
    switch (act) {
      case 'np-open': Pano.np = npDefaults(); A.openModal(npHTML()); return true;
      case 'np-src': npRead(); Pano.np.src = v; Pano.np.err = ''; A.openModal(npHTML()); return true;
      case 'np-step': {
        npRead(); const to = +v, n = Pano.np;
        if (n.step === 1 && to === 2 && n.src === 'excel') { Pano.imp = null; A.openModal(importHTML()); return true; }
        if (to > n.step) { const err = npValidate(n.step); if (err) { n.err = err; A.openModal(npHTML()); return true; } }
        n.err = ''; n.step = to; A.openModal(npHTML()); return true;
      }
      case 'np-create': npCreate(); return true;
      case 'np-import': Pano.imp = null; A.openModal(importHTML()); return true;
      case 'imp-example': importExample(); return true;
      case 'imp-apply': case 'np-import-ok': importApply(); return true;
      case 'sheet-edit': { const p = A.P[v]; if (p) A.openModal(sheetHTML(p)); return true; }
      case 'sheet-save': sheetSave(v); return true;
      case 'confirm-block': confirmBlock(v); return true;
      case 'amend-ok': amendApprove(v); return true;
      case 'amend-create': amendCreate(); return true;
      case 'upload-go': uploadGo(); return true;
      case 'mw-done': if (!guard()) return true; Pano.done.add(v); save('done', v, { at: new Date().toISOString(), role: state.role.name }).then(() => log(`Marked done: ${v}`)); A.render(true); return true;
      case 'open-tool': if (v === 'Upload documents') { A.openModal(uploadHTML()); return true; } return false;
      case 'req-update': if (v === 'Budget amendment') { A.openModal(amendHTML()); return true; } log(`Confirmation requested: ${String(v).split('|')[0]}`); return false;
      case 'match': if (!guard()) return true; Pano.invoices.add(v); save('invoices', v, { at: new Date().toISOString(), role: state.role.name }).then(() => log(`Invoice ${v} matched to its budget line`)); return false;
      case 'award-ok': { if (!guard()) return true; const [tid, sid] = v.split('|'); save('tenders', tid, { status: 'Awarded', awarded: sid, at: new Date().toISOString() }).then(() => log(`${tid} awarded to ${A.sup(sid).name}; draft PO raised in Coupa`, (A.T[tid] || {}).project)); return false; }
      case 'export': {
        const s = String(v || '');
        if (/register|ADMIN FOLLOW UP/i.test(s)) { exportRegister(); return true; }
        if (/Anaplan format/i.test(s)) { exportCosts(); return true; }
        if (/comparison/i.test(s)) { exportComparison(); return true; }
        if (/data health/i.test(s)) { exportHealth(); return true; }
        return false;
      }
    }
    return false;
  };
  document.addEventListener('change', e => { if (e.target && e.target.id === 'imp-file' && e.target.files[0]) importFile(e.target.files[0]); });
  document.addEventListener('dragover', e => { if (e.target.closest && e.target.closest('.drop')) e.preventDefault(); });
  document.addEventListener('drop', e => { const z = e.target.closest && e.target.closest('.drop'); if (!z) return; e.preventDefault(); const f = e.dataTransfer.files[0]; if (!f) return; if (document.getElementById('imp-file')) importFile(f); else { const i = document.getElementById('up-files'); if (i) { i.files = e.dataTransfer.files; A.toast(`${e.dataTransfer.files.length} file(s) ready to upload.`); } } });

  const start = () => { init(); setTimeout(() => setBadge(), 0); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(start, 0)); else start();
})();
