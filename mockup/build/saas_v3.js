  /* ================= v2.1 — alert engine, alerts inbox, role shortcuts, coverage map ================= */
  const ROLES_N = { proc: 'Procurement Officer', pm: 'Project Manager', bc: 'Budget Controller', arch: 'Architect', sp: 'Store Planner', gc: 'General contractor', fin: 'Finance Manager', it: 'IT / platform admin', legal: 'Legal' };
  const RULES = [
    { id: 'R1', name: 'Budget line overspent', kind: 'Budget', when: 'Committed spend on an Anaplan line goes above its budget by more than the threshold', source: 'Coupa orders × Anaplan budget', check: 'At every Coupa sync (near real time)', to: ['bc', 'pm'], ch: ['In-app', 'Teams'], esc: 'Director Architecture after 5 days', th: 5, unit: '%', req: '2.5 · 7.6.5' },
    { id: 'R2', name: 'Project forecast above budget', kind: 'Budget', when: 'Forecast final cost of a project goes above its SOP budget by more than the threshold', source: 'Panoptic forecast × Anaplan SOP', check: 'Every night', to: ['bc', 'pm'], ch: ['In-app', 'Teams', 'Email'], esc: 'Director Architecture after 5 days', th: 3, unit: '%', req: '2.5 · 7.7.5' },
    { id: 'R3', name: 'Tender deadline approaching', kind: 'Tender', when: 'A tender date (bids due, evaluation, award) is less than the threshold away', source: 'Panoptic tenders', check: 'Every morning', to: ['proc'], ch: ['In-app', 'Teams'], esc: 'Head of Procurement on the day', th: 7, unit: 'days', req: '3.2 · 7.6.6' },
    { id: 'R4', name: 'Scope gap in an offer', kind: 'Tender', when: 'Copilot finds a SOW line that is not priced, excluded or far from the benchmark', source: 'Tender returns read by Copilot', check: 'When an offer arrives', to: ['proc', 'pm'], ch: ['In-app', 'Teams'], esc: 'Head of Procurement after 3 days', th: 0, unit: '', req: '3.5' },
    { id: 'R5', name: 'Contract about to expire', kind: 'Contract', when: 'A master agreement ends within the threshold', source: 'Diorlex', check: 'Every week', to: ['proc', 'legal'], ch: ['In-app', 'Email'], esc: 'Legal 15 days before', th: 60, unit: 'days', req: '4.3 · 7.6.6' },
    { id: 'R6', name: 'Invoice without a budget line', kind: 'Budget', when: 'A Coupa invoice cannot be matched to an order or a budget line', source: 'Coupa invoices', check: 'At every Coupa sync', to: ['bc'], ch: ['In-app'], esc: 'Finance Manager after 7 days', th: 0, unit: '', req: '2.3 · 7.9.2' },
    { id: 'R7', name: 'Decision waiting', kind: 'Budget', when: 'A budget amendment or a variation waits for approval longer than the threshold', source: 'Panoptic approvals', check: 'Every morning', to: ['bc', 'pm'], ch: ['In-app', 'Teams'], esc: 'Next approver after the threshold', th: 3, unit: 'days', req: '7.6.6 · 7.6.7' },
    { id: 'R8', name: 'Project sheet out of date', kind: 'Data', when: 'The project sheet has not been confirmed for longer than the threshold', source: 'Panoptic project register', check: 'Every night', to: ['pm'], ch: ['Teams'], esc: 'Store Planning after 15 more days', th: 30, unit: 'days', req: '7.8.4' },
    { id: 'R9', name: 'Two versions of a drawing', kind: 'Data', when: 'The same drawing exists with different revisions on the server and in SharePoint', source: 'Design release server × SharePoint', check: 'At every file index', to: ['arch'], ch: ['In-app'], esc: '—', th: 0, unit: '', req: '7.6.3 · 7.9.8' },
    { id: 'R10', name: 'Market price signal', kind: 'Market', when: 'A material index used in a project moves by more than the threshold over 3 months', source: 'Market price feed (to choose with Procurement)', check: 'Every week', to: ['proc', 'bc'], ch: ['In-app', 'Email'], esc: '—', th: 5, unit: '%', req: 'Workshop: market variations' },
    { id: 'R11', name: 'Connector error', kind: 'System', when: 'A sync with Coupa, Anaplan, SharePoint or the DAM fails or leaves exceptions', source: 'Integration console', check: 'Continuous', to: ['it'], ch: ['In-app', 'Email'], esc: 'IT on-call after 2 hours', th: 0, unit: '', req: '7.9.9 · 7.2.2' },
    { id: 'R12', name: 'Saved search', kind: 'Data', when: 'A new document matches a search someone saved (for example: SOW for Melbourne)', source: 'Document index', check: 'When a file is indexed', to: ['proc', 'pm', 'arch'], ch: ['In-app'], esc: '—', th: 0, unit: '', req: '7.5.5' }
  ];
  const ruleOn = r => !(Pano.rules[r.id] && Pano.rules[r.id].off);
  const ruleTh = r => (Pano.rules[r.id] && Pano.rules[r.id].th != null) ? +Pano.rules[r.id].th : r.th;
  const R = Object.fromEntries(RULES.map(r => [r.id, r]));
  function computeAlerts() {
    const out = [], add = (rid, id, sev, title, body, o = {}) => { const r = R[rid]; if (!ruleOn(r)) return; out.push(Object.assign({ id: rid + '-' + id, rule: r, sev, title, body, raised: today() }, o)); };
    const ps = A.vis();
    ps.forEach(p => {
      const th = ruleTh(R.R1) / 100;
      p.lines.filter(l => l.committed > l.budget * (1 + th)).forEach(l => { const pc = l.committed / l.budget - 1; add('R1', l.code, pc > 0.1 ? 'high' : 'medium', `${l.name} ${Math.round(pc * 100)}% over budget · ${p.city}`, `${l.code}: ${A.kE(l.committed)} committed in Coupa for ${A.kE(l.budget)} in Anaplan.`, { project: p.id, link: `#/project/${p.id}/costs`, fig: A.pct(pc) }); });
      if (p.variancePct > ruleTh(R.R2) / 100) add('R2', p.id, p.variancePct > 0.05 ? 'high' : 'medium', `${p.city} forecast ${A.pct(p.variancePct)} above budget`, `Forecast final cost ${mE(p.forecast)} for an SOP budget of ${mE(p.budget)}.`, { project: p.id, link: `#/project/${p.id}/costs`, fig: A.pct(p.variancePct) });
      const age = Pano.age(p, 'Project sheet', p.id === '401111' ? 34 : 6);
      if (age > ruleTh(R.R8)) add('R8', p.id, 'low', `${p.city} project sheet not confirmed for ${age} days`, 'Dates, surfaces and stage may be out of date. The project manager is asked to confirm.', { project: p.id, link: `#/project/${p.id}/data`, fig: age + ' d', act: { a: 'confirm-block', v: `${p.id}|Project sheet`, l: 'Confirm now' } });
    });
    D.TENDERS.filter(t => t.status !== 'Awarded' && A.visIds().has(t.project)).forEach(t => { const n = A.days(t.date); if (n >= 0 && n <= ruleTh(R.R3)) add('R3', t.id, n <= 3 ? 'high' : 'medium', `${t.pkg} · ${t.dateLabel} in ${n} day${n === 1 ? '' : 's'}`, `${A.P[t.project].city}, ${t.id}. ${t.bidders.length} bidder${t.bidders.length > 1 ? 's' : ''}.`, { project: t.project, link: `#/tender/${t.id}`, fig: n + ' d' }); (t.bids || []).forEach(b => b.gaps.forEach(g => add('R4', t.id + '-' + b.supplier + g.ref, g.soft ? 'medium' : 'high', `Scope gap: ${A.sup(b.supplier).name}, ${t.pkg}`, `${g.text} (SOW ${g.ref}). ${A.P[t.project].city}.`, { project: t.project, link: `#/tender/${t.id}`, fig: g.ref }))); });
    D.SUPPLIERS.forEach(s => { const n = A.days(s.expiry); if (n >= 0 && n <= ruleTh(R.R5)) add('R5', s.id, n <= 45 ? 'high' : 'medium', `Master agreement with ${s.name} ends in ${n} days`, `${s.contract} · ${s.cat}. Check live tenders that list this supplier.`, { link: `#/supplier/${s.id}`, fig: n + ' d' }); });
    const left = ['INV-88412', 'INV-88430', 'INV-88447'].filter(n => !Pano.invoices.has(n));
    if (left.length) add('R6', 'RAK', 'medium', `${left.length} Coupa invoice${left.length > 1 ? 's' : ''} without a budget line`, 'Ras Al Khaimah Wynn. Copilot suggests a line for each; the budget controller confirms.', { project: '601421', link: '#/cost', fig: left.length, act: { a: 'inv-check', v: left[0], l: 'Review' } });
    Pano.amendments.filter(a => a.status === 'pending' && A.P[a.project]).forEach(a => { const n = Math.max(0, -A.days(a.created)); if (n >= ruleTh(R.R7)) add('R7', a.id, 'medium', `Budget amendment waiting · ${A.P[a.project].city}`, `+€${a.amount}k on line ${a.line}: ${a.reason}. Waiting ${n} days.`, { project: a.project, link: `#/project/${a.project}/costs`, fig: n + ' d', act: ['bc', 'pm'].includes(state.role.id) ? { a: 'amend-ok', v: a.id, l: 'Approve' } : null }); });
    Pano.variations.filter(v => v.status === 'pending' && A.P[v.project]).forEach(v => { const n = Math.max(0, -A.days(v.raised)); if (n >= ruleTh(R.R7)) add('R7', v.id, 'medium', `Variation waiting · ${A.P[v.project].city}`, `${v.title}, +${mE(v.amount)}. Waiting ${n} days.`, { project: v.project, link: `#/project/${v.project}/costs`, fig: n + ' d', act: ['bc', 'pm'].includes(state.role.id) ? { a: 'var-ok', v: v.id, l: 'Approve' } : null }); });
    if (A.visIds().has('300407')) add('R9', 'SAN-elev', 'low', 'Two versions of the Sanya façade elevation', 'rev12 on the design server, rev12b on SharePoint. Keep one as the reference.', { project: '300407', link: '#/project/300407/documents', fig: '2 rev' });
    if (A.visIds().has('100610')) add('R10', 'ALU', 'low', 'Aluminium +6% over 3 months', 'Exposure: exterior façade cladding on Los Cabos, about +€48k. Illustrative signal until the price feed is chosen.', { project: '100610', link: '#/project/100610/costs', fig: '+6%' });
    add('R11', 'COUPA', 'low', 'Coupa sync: 3 exceptions', 'Three invoices could not be matched automatically at the 21:14 sync.', { link: '#/platform/sources', fig: '3' });
    const order = { high: 0, medium: 1, low: 2 };
    return out.map(a => Object.assign(a, { st: (Pano.alertState[a.id] || {}).st || 'new', owner: (Pano.alertState[a.id] || {}).owner || null })).sort((a, b) => (a.st === 'resolved') - (b.st === 'resolved') || order[a.sev] - order[b.sev]);
  }
  Saas.alerts = computeAlerts;
  const mine = a => a.rule.to.includes(state.role.id) || a.owner === state.role.id;
  const SEV = { high: 'Urgent', medium: 'Important', low: 'For information' };
  const CH = { 'In-app': 'Panoptic', Teams: 'Teams', Email: 'E-mail' };
  Saas.alertKind = 'All'; Saas.alertSel = null; Saas.alertTab = 'inbox'; Saas.alertScope = 'mine';
  function alertsView() {
    const all = computeAlerts();
    const scoped = all.filter(a => Saas.alertScope === 'all' || mine(a));
    const list = scoped.filter(a => Saas.alertKind === 'All' || a.rule.kind === Saas.alertKind);
    if (!list.some(a => a.id === Saas.alertSel)) Saas.alertSel = (list.find(a => a.st !== 'resolved') || list[0] || {}).id;
    const sel = list.find(a => a.id === Saas.alertSel);
    const kinds = ['All', ...new Set(all.map(a => a.rule.kind))];
    const open = scoped.filter(a => a.st !== 'resolved');
    const head = `<div class="g-head"><h1>Alerts</h1><div class="pills">${[['inbox', 'Inbox'], ['rules', 'Rules']].map(t => `<button class="${Saas.alertTab === t[0] ? 'on' : ''}" data-act="atab" data-v="${t[0]}">${t[1]}</button>`).join('')}</div></div>
      <section class="gl how"><div class="how-flow">${[['1', 'Data arrives', 'Anaplan, Coupa, tenders, Diorlex, files'], ['2', 'A rule checks it', `${RULES.filter(ruleOn).length} rules, each with a threshold`], ['3', 'The right person is told', 'In Panoptic, in Teams or by e-mail'], ['4', 'Someone acts', 'Approve, confirm, review, or assign']].map((x, i) => `<div class="how-step"><b>${x[0]}</b><span><strong>${x[1]}</strong>${x[2]}</span></div>${i < 3 ? '<i class="how-arr" aria-hidden="true">→</i>' : ''}`).join('')}</div></section>`;
    if (Saas.alertTab === 'rules') {
      return { html: head + `<section class="gl"><div class="gl-h"><h2>Rules</h2><span class="muted">Edit thresholds and switch rules on or off. No code.</span></div><div class="tbl-wrap"><table class="tbl rules"><thead><tr><th>Rule</th><th>Raised when</th><th>Threshold</th><th>Source and check</th><th>Who is told</th><th>Escalation</th><th>On</th></tr></thead><tbody>${RULES.map(r => `<tr><td><b>${r.name}</b><div class="small muted">${r.kind} · ${r.req}</div></td><td class="small">${r.when}</td><td>${r.unit ? `<label class="thr"><input type="number" min="0" step="1" value="${ruleTh(r)}" data-rule-th="${r.id}" aria-label="Threshold for ${r.name}"> ${r.unit}</label>` : '—'}</td><td class="small">${r.source}<div class="muted">${r.check}</div></td><td class="small">${r.to.map(x => ROLES_N[x]).join(', ')}<div class="muted">${r.ch.map(c => CH[c]).join(' · ')}</div></td><td class="small">${r.esc}</td><td><button class="tog ${ruleOn(r) ? 'on' : ''}" data-act="rule-tog" data-v="${r.id}" aria-pressed="${ruleOn(r)}" aria-label="Rule ${r.name}"></button></td></tr>`).join('')}</tbody></table></div></section>` };
    }
    const body = `<section class="gl"><div class="gl-h"><div class="pills">${[['mine', `For me · ${all.filter(mine).filter(a => a.st !== 'resolved').length}`], ['all', `Everyone · ${all.filter(a => a.st !== 'resolved').length}`]].map(t => `<button class="${Saas.alertScope === t[0] ? 'on' : ''}" data-act="ascope" data-v="${t[0]}">${t[1]}</button>`).join('')}</div><div class="chips">${kinds.map(k => `<button class="chip ${Saas.alertKind === k ? 'on' : ''}" data-act="akind" data-v="${k}">${k}</button>`).join('')}</div></div>
      <div class="inbox"><ul class="ib-list">${list.map(a => `<li><button class="ib-it ${a.id === Saas.alertSel ? 'on' : ''} st-${a.st}" data-act="asel" data-v="${a.id}"><span class="sev sev-${a.sev}"></span><span class="ib-t"><b>${esc(a.title)}</b><span>${a.rule.kind} · ${a.project && A.P[a.project] ? esc(A.P[a.project].city) + ' · ' : ''}${a.st === 'resolved' ? 'Resolved' : a.st === 'ack' ? 'Seen' : a.owner ? 'Assigned to ' + ROLES_N[a.owner] : 'New'}</span></span><span class="ib-fig">${esc(String(a.fig || ''))}</span></button></li>`).join('') || '<li class="empty">No alert here. When a rule fires, the alert appears in this list.</li>'}</ul>
      ${sel ? `<div class="ib-detail"><span class="sev-l sev-${sel.sev}">${SEV[sel.sev]}</span><h2>${esc(sel.title)}</h2><p>${esc(sel.body)}</p>
        <ol class="trace"><li><b>Source</b>${sel.rule.source}</li><li><b>Rule</b>${sel.rule.name}${sel.rule.unit ? ` · threshold ${ruleTh(sel.rule)} ${sel.rule.unit}` : ''} · ${sel.rule.check.toLowerCase()}</li><li><b>Sent to</b>${sel.rule.to.map(x => ROLES_N[x]).join(', ')} · ${sel.rule.ch.map(c => CH[c]).join(', ')}</li><li><b>If nobody acts</b>${sel.rule.esc}</li></ol>
        <div class="ib-acts">${sel.act && sel.st !== 'resolved' ? `<button class="btn" data-act="${sel.act.a}" data-v="${esc(sel.act.v)}">${sel.act.l}</button>` : ''}${sel.link ? `<a class="btn ghost" href="${sel.link}">Open</a>` : ''}${sel.st === 'resolved' ? '' : `<button class="btn ghost" data-act="aack" data-v="${sel.id}">Mark as seen</button><button class="btn ghost" data-act="ares" data-v="${sel.id}">Resolve</button>`}
          <label class="ib-assign">Assign to <select data-assign="${sel.id}" aria-label="Assign alert">${['', 'proc', 'pm', 'bc', 'arch', 'sp'].map(r => `<option value="${r}" ${sel.owner === r ? 'selected' : ''}>${r ? ROLES_N[r] : 'Nobody'}</option>`).join('')}</select></label></div></div>` : ''}
      </div></section>`;
    return { html: head + body };
  }
  async function setAlert(id, patch, msg) {
    if (!Pano.guard()) return;
    const cur = Object.assign({}, Pano.alertState[id] || {}, patch, { at: new Date().toISOString(), by: state.role.name });
    if (!(await Pano.saveDoc('alertstate', id, cur))) return;
    Pano.alertState[id] = cur; Pano.logEvent(msg + ': ' + id); A.render(true);
  }

  /* role shortcuts: one click into the work of each role */
  const SHORT = {
    proc: [['Tenders to award', '#/tenders'], ['Compare offers · Melbourne', '#/tender/T-26-026'], ['Suppliers and contracts', '#/suppliers']],
    pm: [['My projects', '#/projects'], ['Dossier gaps', 'view:dossiers'], ['Upload documents', 'act:open-tool:Upload documents']],
    bc: [['Budgets by project', 'ctab:budgets'], ['Variations to decide', 'ctab:variations'], ['Invoices to review', 'ctab:payments']],
    arch: [['Drawings and documents', '#/assets'], ['Materials library', '#/library'], ['Design books', '#/library/books']],
    sp: [['Projects', '#/projects'], ['New project', 'act:np-open:'], ['Import from Excel', 'act:np-import:']],
    gc: [['My tender', '#/tender/T-26-026'], ['Documents shared with me', '#/assets']]
  };
  const shortcut = s => { const [l, t] = s; if (t.startsWith('#')) return `<a class="sc" href="${t}">${l}</a>`; const [k, a, v] = t.split(':'); if (k === 'view') return `<button class="sc" data-act="view" data-v="${a}">${l}</button>`; if (k === 'ctab') return `<button class="sc" data-act="goctab" data-v="${a}">${l}</button>`; return `<button class="sc" data-act="${a}" data-v="${v || ''}">${l}</button>`; };

  /* home v2.1: hierarchy = alerts first, then key figures, then projects and dossier */
  const home2b = A.views.home;
  A.views.home = () => {
    if ((location.hash || '') === '#/alerts') return alertsView();
    const out = home2b();
    const al = computeAlerts().filter(a => a.st !== 'resolved');
    const mineList = al.filter(mine);
    const top = (mineList.length ? mineList : al).slice(0, 3);
    const urgent = al.filter(a => a.sev === 'high').length;
    const band = `<section class="gl attn"><div class="gl-h"><h2>Needs attention</h2><a class="pill-link" href="#/alerts">All alerts · ${al.length}</a></div>
      <div class="attn-cards">${top.map(a => `<div class="attn-c sev-b-${a.sev}"><span class="sev-l sev-${a.sev}">${SEV[a.sev]}</span><b>${esc(a.title)}</b><span class="attn-s">${esc(a.rule.name)} · ${a.rule.source}</span><div class="attn-a">${a.act ? `<button class="btn sm" data-act="${a.act.a}" data-v="${esc(a.act.v)}">${a.act.l}</button>` : ''}${a.link ? `<a class="btn sm ghost" href="${a.link}">Open</a>` : ''}</div></div>`).join('') || '<p class="muted">No alert. Rules keep checking budgets, tenders, contracts and files.</p>'}</div></section>`;
    let html = out.html;
    html = html.replace(/<a class="gv" href="#mw" data-act="scroll-mw">[\s\S]*?<\/a>/, `<a class="gv" href="#/alerts"><span class="gv-l">Open alerts</span><span class="gv-n ${urgent ? 'over' : ''}">${al.length}</span><span class="gv-s">${urgent} urgent · ${mineList.length} for you</span></a>`);
    const sc = (SHORT[state.role.id] || SHORT.pm).map(shortcut).join('');
    html = html.replace('<h1>Portfolio</h1>', `<div><h1>Portfolio</h1><div class="shortcuts">${sc}</div></div>`);
    const k = html.indexOf('<section class="gl">', html.indexOf('class="gl glance"'));
    html = k > 0 ? html.slice(0, k) + band + html.slice(k) : html + band;
    return { html, after: out.after };
  };

  /* coverage map: where each Excel feature lives (status: shown, partial, delivery, later) */
  window.WHERE = {
    '1.1': ['shown', 'Projects › project › Team & data (project sheet) · Projects › Import from Excel'], '1.2': ['shown', 'Library › Materials'], '1.3': ['shown', 'Tenders › tender › Scope of work'], '1.4': ['shown', 'Suppliers › supplier (Coupa ID, contract, tender history)'], '1.5': ['shown', 'Project › Budget & costs (Anaplan line › Coupa orders)'], '1.6': ['shown', 'Admin › Roles & workflows'], '1.7': ['shown', 'Library › Design books'],
    '2.1': ['shown', 'Cost control › Overview · Home key figures'], '2.2': ['shown', 'Admin › Integrations (Anaplan) · budget amendments pushed to Anaplan'], '2.3': ['shown', 'Admin › Integrations (Coupa) · Cost control › Payments'], '2.4': ['shown', 'Tenders › tender › offer comparison (SOR read by Copilot, with sources)'], '2.5': ['shown', 'Alerts › rules R1, R2 · Cost control threshold'], '2.6': ['shown', 'Project › Budget & costs › Cost position, variations'], '2.7': ['shown', 'Cost control › Export, Cash flow'], '2.8': ['shown', 'Project › Budget history · Cost control › Since the last report · Admin audit log'],
    '3.1': ['shown', 'Tenders › All tenders · Documents (SOW, BOQ, returns)'], '3.2': ['shown', 'Tenders › pipeline Draft → Awarded'], '3.3': ['shown', 'Tenders › tender › Scope of work'], '3.4': ['shown', 'Tenders › tender › Offer comparison'], '3.5': ['shown', 'Tenders › tender › What Panoptic found · Alerts rule R4'], '3.6': ['shown', 'Tenders › tender › Award (draft PO in Coupa)'], '3.7': ['shown', 'Tenders › findings (alternative quarry, sample approval)'], '3.8': ['shown', 'Tenders › tender › Bidder access · role General contractor'], '3.9': ['shown', 'Tenders › tender file, archived at award'],
    '4.1': ['shown', 'Suppliers'], '4.2': ['shown', 'Suppliers › supplier KPIs'], '4.3': ['shown', 'Suppliers › contract (Diorlex) · Alerts rule R5'], '4.4': ['shown', 'Library › Materials prices · Supplier › materials supplied'], '4.5': ['partial', 'Admin › Workflows › Supplier onboarding (configured, off)'], '4.6': ['shown', 'Tenders › Bidder access · financial data masked for externals'],
    '5.1': ['shown', 'Documents (budget exports, SOW, BOQ, POs)'], '5.2': ['shown', 'Documents › tags and AI ready status'], '5.3': ['shown', 'Admin › Integrations (SharePoint) · Project › workspaces'], '5.4': ['shown', 'Library › Boutiques & photos · Integrations (DAM)'], '5.5': ['shown', 'Documents › file › lifecycle'], '5.6': ['shown', 'Documents search · Ask AI on a file'], '5.7': ['shown', 'Admin › Integrations (AED, planned)'],
    '6.1': ['shown', 'Library › Materials filters'], '6.2': ['partial', 'Library › Materials (view, compare); editing in phase 2'], '6.3': ['partial', 'Material › Spec sheet export'], '6.4': ['shown', 'Library › Furniture & lighting'], '6.5': ['shown', 'Library › Façades & concepts'], '6.6': ['shown', 'Library › Design books'], '6.7': ['shown', 'Project › levels and plans · Documents › drawings'], '6.8': ['shown', 'Library › Lighting concept book'], '6.9': ['shown', 'Design book › Export guideline PDF'],
    '7.1.1': ['delivery', 'Delivery plan (hosting, environments)'], '7.1.2': ['shown', 'Admin › Integrations (data flow)'], '7.1.3': ['shown', 'Admin › Integrations (Coupa)'], '7.1.4': ['shown', 'Admin › Integrations (Anaplan)'], '7.1.5': ['shown', 'Admin › Integrations (architecture) · explainer page'], '7.1.6': ['shown', 'Projects › Import from Excel · Documents (226K of 275K indexed)'], '7.1.7': ['delivery', 'Delivery plan (security)'],
    '7.2.1': ['delivery', 'Delivery plan'], '7.2.2': ['shown', 'Admin › Integrations health · Alerts rule R11'], '7.2.3': ['delivery', 'Delivery plan'], '7.2.4': ['delivery', 'Delivery plan'], '7.2.5': ['delivery', 'Delivery plan'], '7.2.6': ['delivery', 'Delivery plan'], '7.2.7': ['delivery', 'Delivery plan'],
    '7.3.1': ['shown', 'Admin › Roles (OKTA SSO, MFA)'], '7.3.3': ['shown', 'Role selector · Admin › Roles'], '7.3.4': ['shown', 'Role General contractor (external)'], '7.3.5': ['shown', 'Financial figures masked for non-finance roles'], '7.3.6': ['shown', 'Tenders › Bidder access portal'], '7.3.7': ['delivery', 'Delivery plan (GDPR)'], '7.3.8': ['later', 'P3, not in the prototype'],
    '7.4.1': ['shown', 'Admin › teams'], '7.4.2': ['shown', 'Zone filters (Projects, Cost control) · Home by zone'], '7.4.3': ['shown', 'New project › standard folder tree'], '7.4.4': ['shown', 'Project › Team & data'], '7.4.5': ['partial', 'Team from OKTA groups (sync in phase 3)'],
    '7.5.1': ['shown', 'Documents tags'], '7.5.2': ['shown', 'Documents facets'], '7.5.3': ['shown', 'Cost control › Search by univers'], '7.5.4': ['shown', 'Search or ask · Ask AI'], '7.5.5': ['shown', 'Alerts › rule R12 Saved search'], '7.5.6': ['later', 'P3, not in the prototype'],
    '7.6.1': ['shown', 'Admin › Audit log'], '7.6.2': ['shown', 'Project › Budget history, amendments'], '7.6.3': ['shown', 'Tender documents (SOW v3) · Alerts rule R9'], '7.6.4': ['shown', 'Alerts (Panoptic, Teams, e-mail)'], '7.6.5': ['shown', 'Alerts › rules R1, R2 with thresholds'], '7.6.6': ['shown', 'Alerts › escalation · rules R3, R5, R7'], '7.6.7': ['shown', 'Admin › Approval workflow'], '7.6.8': ['later', 'P3, not in the prototype'], '7.6.9': ['partial', 'Admin › Workflows (runs, median approval time)'],
    '7.7.1': ['shown', 'Home by role, shortcuts'], '7.7.2': ['shown', 'Cost control › Overview'], '7.7.3': ['shown', 'Tenders pipeline'], '7.7.4': ['shown', 'Suppliers KPIs'], '7.7.5': ['shown', 'Project › Cost position'], '7.7.6': ['later', 'P3, not in the prototype'], '7.7.7': ['partial', 'Since the last report · draft steering note'], '7.7.8': ['partial', 'Admin › Your tools (Power BI connector)'], '7.7.9': ['partial', 'Admin › Audit log, Data health'],
    '7.8.1': ['shown', 'Documents › file lifecycle'], '7.8.2': ['shown', 'Documents › file retention'], '7.8.3': ['shown', 'Documents › file › Legal hold'], '7.8.4': ['shown', 'Documents status · Project › Team & data'], '7.8.5': ['shown', 'Tender file archived at award'], '7.8.6': ['shown', 'Documents archive search'], '7.8.7': ['later', 'P3, not in the prototype'], '7.8.8': ['partial', 'Admin › Data health'],
    '7.9.1': ['shown', 'Admin › Integrations console'], '7.9.2': ['shown', 'Admin › Integrations (Coupa) · invoices to match'], '7.9.3': ['shown', 'Admin › Integrations (Anaplan)'], '7.9.4': ['shown', 'Admin › Integrations (SharePoint)'], '7.9.5': ['shown', 'Admin › Integrations (DAM)'], '7.9.6': ['shown', 'Admin › Integrations (AED, planned)'], '7.9.7': ['shown', 'Admin › Integrations (Diorlex)'], '7.9.8': ['shown', 'Drawing revisions detected · Alerts rule R9'], '7.9.9': ['shown', 'Admin › Integrations health · Alerts rule R11'], '7.9.10': ['shown', 'Admin › Audit log'],
    '7.10.1': ['shown', 'Admin'], '7.10.2': ['shown', 'Alerts › Rules · Admin › Workflows'], '7.10.3': ['shown', 'Admin › Workflows on per zone'], '7.10.4': ['shown', 'Admin › Language EN / FR'], '7.10.5': ['later', 'P3, not in the prototype'], '7.10.6': ['later', 'P3, not in the prototype'], '7.10.7': ['later', 'P3, not in the prototype'],
    '7.11.1': ['delivery', 'Delivery plan'], '7.11.2': ['delivery', 'Delivery plan'], '7.11.3': ['delivery', 'Delivery plan'], '7.11.4': ['delivery', 'Delivery plan'], '7.11.5': ['shown', 'Home shortcuts by role · this note'], '7.11.6': ['delivery', 'Delivery plan'], '7.11.7': ['delivery', 'Delivery plan'], '7.11.8': ['delivery', 'Delivery plan']
  };

  /* actions for v2.1 */
  const handle2 = Pano.handle;
  Pano.handle = (act, v, b) => {
    switch (act) {
      case 'atab': Saas.alertTab = v; A.render(true); return true;
      case 'ascope': Saas.alertScope = v; A.render(true); return true;
      case 'akind': Saas.alertKind = v; A.render(true); return true;
      case 'asel': Saas.alertSel = v; A.render(true); return true;
      case 'aack': setAlert(v, { st: 'ack' }, 'Alert seen'); return true;
      case 'ares': setAlert(v, { st: 'resolved' }, 'Alert resolved'); return true;
      case 'rule-tog': { if (!Pano.guard()) return true; const cur = Object.assign({}, Pano.rules[v] || {}); cur.off = !cur.off; Pano.saveDoc('rules', v, cur).then(ok => { if (ok) { Pano.rules[v] = cur; Pano.logEvent(`Alert rule ${v} switched ${cur.off ? 'off' : 'on'}`); A.render(true); } }); return true; }
      case 'goctab': Saas.ctab = v; location.hash = '#/cost'; return true;
    }
    return handle2(act, v, b);
  };
  document.addEventListener('change', e => {
    const t = e.target;
    if (t.dataset && t.dataset.ruleTh) { if (!Pano.guard()) return; const id = t.dataset.ruleTh; const cur = Object.assign({}, Pano.rules[id] || {}, { th: Math.max(0, +t.value || 0) }); Pano.saveDoc('rules', id, cur).then(ok => { if (ok) { Pano.rules[id] = cur; Pano.logEvent(`Alert rule ${id} threshold set to ${cur.th}`); A.render(true); A.toast('Threshold saved. Alerts are recalculated.'); } }); }
    if (t.dataset && t.dataset.assign) setAlert(t.dataset.assign, { owner: t.value || null }, 'Alert assigned');
  });
  Saas.navAlerts = () => {
    const nav = document.querySelector('.top .nav'); if (!nav || nav.querySelector('[data-nav="#/alerts"]')) return;
    const a = document.createElement('a'); a.href = '#/alerts'; a.dataset.nav = '#/alerts'; a.textContent = 'Alerts';
    const home = nav.querySelector('[data-nav="#/home"]'); if (home && home.nextSibling) nav.insertBefore(a, home.nextSibling); else nav.appendChild(a);
    const bell = document.querySelector('.bell'); if (bell) { bell.href = '#/alerts'; bell.onclick = null; bell.replaceWith(bell.cloneNode(true)); }
  };
  Saas.confirmHTML = () => {
    const rows = [['Full financial visibility: budget vs actual vs committed, from Coupa and Anaplan', 'Cost control · Project › Budget & costs · Home', '2.1, 2.2, 2.3, 2.6'], ['Tender lifecycle from repository to award, with AI analysis', 'Tenders · tender › comparison, findings, award', '3.1 to 3.6'], ['Supplier intelligence: profiles, KPIs, contracts', 'Suppliers', '4.1 to 4.3'], ['Secure, role-controlled access: OKTA SSO, RBAC internal and external', 'Admin › Roles · role selector · bidder access', '7.3.1 to 7.3.6'], ['Document governance: AI tagging, full-text search, SharePoint', 'Documents · Integrations', '5.1 to 5.6'], ['Real-time alerting: budget breaches, overspend thresholds', 'Alerts (inbox and rules)', '2.5, 7.6.4, 7.6.5'], ['Reporting layer: financial KPIs, tender pipeline, supplier performance', 'Home · Cost control · Tenders · Suppliers', '7.7.1 to 7.7.5'], ['Core technical infrastructure: API gateway, cloud hosting, hybrid database', 'Admin › Integrations · delivery plan', '7.1.1 to 7.1.7']];
    const W = window.WHERE || {}, F = window.FEATURES || [];
    const cnt = (p, st) => F.filter(f => f.p === p && W[f.id] && W[f.id][0] === st).length;
    return `<section class="blk"><div class="blk-h"><h2>P1 + P2 check, as asked in the Excel</h2></div>
      <div class="cov-sum">${['P1', 'P2', 'P3', 'P4'].map(p => `<div><b>${p}</b><span>${cnt(p, 'shown')} shown · ${cnt(p, 'partial')} partly · ${cnt(p, 'delivery')} delivery plan · ${cnt(p, 'later')} later</span></div>`).join('')}</div>
      <div class="tbl-wrap" style="margin-top:14px"><table class="tbl"><thead><tr><th>Capability the Excel asks to confirm</th><th>Where in the platform</th><th>Backlog</th><th></th></tr></thead><tbody>${rows.map(r => `<tr><td>${r[0]}</td><td class="small">${r[1]}</td><td class="code">${r[2]}</td><td><span class="status s-ok">Covered</span></td></tr>`).join('')}</tbody></table></div></section>`;
  };
  const render2 = A.render;
  A.render = (keep) => { render2(keep); Saas.navAlerts(); const n = computeAlerts().filter(a => a.st !== 'resolved' && mine(a)).length; const b = document.getElementById('bellCount'); if (b) b.textContent = n || ''; document.querySelectorAll('.top .nav [data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === '#/alerts' ? location.hash === '#/alerts' : a.classList.contains('on') && location.hash !== '#/alerts')); };
  window.addEventListener('hashchange', () => setTimeout(() => { Saas.navAlerts(); const on = location.hash === '#/alerts'; document.querySelectorAll('.top .nav [data-nav]').forEach(a => { if (a.dataset.nav === '#/alerts') a.classList.toggle('on', on); else if (on) a.classList.remove('on'); }); }, 0));
