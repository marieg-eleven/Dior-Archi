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
      const ask = top.querySelector('.ask-btn'); if (ask) ask.insertAdjacentHTML('afterbegin', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>');
    }
    side.addEventListener('click', e => { if (e.target.closest('a')) document.body.classList.remove('side-open'); });
    const scrim = document.createElement('div'); scrim.className = 'side-scrim'; scrim.addEventListener('click', () => document.body.classList.remove('side-open')); document.body.appendChild(scrim);
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

  /* ---------------- Home: portfolio dashboard (v1.3) ---------------- */
  const GEO = { Melbourne: [-37.81, 144.96], Copenhagen: [55.68, 12.57], 'Los Cabos': [22.89, -109.91], Sanya: [18.25, 109.51], 'Kuala Lumpur': [3.15, 101.71], 'Ras Al Khaimah': [25.79, 55.94], Paris: [48.86, 2.35], Geneva: [46.2, 6.15], 'New York': [40.71, -74.0], Miami: [25.76, -80.19], Singapore: [1.29, 103.85], Sydney: [-33.87, 151.21], Tokyo: [35.68, 139.69], Seoul: [37.57, 126.98], Shanghai: [31.23, 121.47], Beijing: [39.9, 116.4], 'Hong Kong': [22.32, 114.17], Bangkok: [13.75, 100.5], London: [51.51, -0.13], Milan: [45.46, 9.19], Dubai: [25.2, 55.27], Doha: [25.29, 51.53], 'Abu Dhabi': [24.45, 54.38], 'Beverly Hills': [34.07, -118.4], 'Los Angeles': [34.05, -118.24], Dallas: [32.78, -96.8], Aspen: [39.19, -106.82], Dusseldorf: [51.23, 6.78], Busan: [35.18, 129.08], Hiroshima: [34.39, 132.46], 'Costa Mesa': [33.64, -117.92], Osaka: [34.69, 135.5], Rome: [41.9, 12.5], Madrid: [40.42, -3.7], Munich: [48.14, 11.58], Taipei: [25.03, 121.57], Jakarta: [-6.2, 106.85], Mumbai: [19.08, 72.88], 'São Paulo': [-23.55, -46.63], Toronto: [43.65, -79.38], Chengdu: [30.57, 104.07] };
  const geoOf = p => { const k = Object.keys(GEO).find(c => (p.city || '').startsWith(c)); return k ? GEO[k] : null; };
  const LAND = [
    [[-168,65],[-160,71],[-140,70],[-125,72],[-95,72],[-80,73],[-62,66],[-55,52],[-66,45],[-70,42],[-76,35],[-81,31],[-80,25],[-83,29],[-90,30],[-97,27],[-97,22],[-92,18],[-87,21],[-88,15],[-83,9],[-79,8],[-85,11],[-92,14],[-105,20],[-110,23],[-112,30],[-117,32],[-124,40],[-124,48],[-133,56],[-150,60],[-165,60]],
    [[-55,60],[-43,60],[-20,70],[-20,80],[-60,82],[-72,77],[-55,70]],
    [[-80,9],[-72,12],[-60,10],[-50,0],[-35,-5],[-39,-15],[-48,-26],[-58,-35],[-65,-41],[-68,-52],[-74,-52],[-73,-40],[-71,-20],[-76,-14],[-81,-5],[-79,2]],
    [[-10,36],[-9,43],[-2,44],[-5,48],[2,51],[8,54],[8,57],[5,60],[10,63],[15,69],[25,71],[30,70],[40,67],[45,68],[60,68],[60,45],[50,45],[40,42],[28,41],[26,38],[22,37],[19,40],[16,38],[12,44],[8,44],[3,43],[-1,37]],
    [[60,68],[70,73],[80,73],[100,78],[115,73],[140,72],[160,70],[180,68],[180,64],[170,60],[160,58],[155,50],[142,46],[135,43],[130,35],[122,31],[121,25],[110,20],[108,12],[105,9],[103,1],[100,6],[98,16],[94,18],[91,22],[85,20],[80,13],[77,8],[73,18],[68,24],[62,25],[57,26],[56,23],[59,22],[52,16],[44,12],[42,15],[36,28],[34,31],[36,36],[30,37],[28,41],[40,42],[50,45],[60,45]],
    [[-17,15],[-17,21],[-10,30],[-6,36],[10,37],[20,32],[30,31],[33,31],[35,27],[43,12],[51,12],[50,2],[40,-5],[40,-15],[35,-25],[27,-34],[19,-35],[13,-20],[12,-6],[9,4],[0,5],[-8,4],[-13,8]],
    [[114,-22],[122,-18],[130,-12],[137,-12],[142,-11],[146,-19],[153,-26],[150,-37],[141,-38],[135,-35],[129,-32],[115,-34]],
    [[-5,50],[1,51],[2,53],[-2,57],[-5,58],[-6,55],[-3,54],[-5,52]],
    [[130,31],[135,34],[140,35],[142,40],[141,45],[139,42],[136,36],[132,34]],
    [[109,-2],[110,2],[117,7],[119,1],[116,-4]],[[95,5],[98,4],[106,-4],[106,-6],[101,-3]],[[106,-6],[115,-8],[114,-9],[106,-7.5]],
    [[131,-1],[141,-3],[150,-10],[141,-9],[132,-4]],[[44,-25],[47,-25],[50,-15],[49,-12],[44,-17]],[[166,-46],[174,-41],[178,-38],[173,-35],[172,-41],[167,-45]],[[120,18],[122,18],[126,7],[122,7]]
  ];
  const inPoly = (x, y, poly) => { let ins = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) ins = !ins; } return ins; };
  let landCache = null;
  function globe(el, ps) {
    const THREE = window.THREE; if (!THREE || !el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = el.clientWidth, H = el.clientHeight;
    let renderer; try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { el.innerHTML = '<p class="muted" style="padding:20px">3D is not available in this browser.</p>'; return; }
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); renderer.setSize(W, H); el.appendChild(renderer.domElement);
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, W / H, 0.1, 100); const fit = () => { const a = W / H, t = Math.tan(15 * Math.PI / 180); cam.position.set(0, 0, Math.max(1.22 / t, 1.22 / (t * a))); }; fit();
    scene.add(new THREE.AmbientLight(0xffffff, 0.78)); const dl = new THREE.DirectionalLight(0xffffff, 0.45); dl.position.set(-3, 2, 4); scene.add(dl);
    const g = new THREE.Group(); g.rotation.x = 0.22; scene.add(g);
    const R = 1, vec = (lat, lng, r) => { const ph = (90 - lat) * Math.PI / 180, th = (lng + 180) * Math.PI / 180; return new THREE.Vector3(-r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)); };
    g.add(new THREE.Mesh(new THREE.SphereGeometry(R, 72, 72), new THREE.MeshLambertMaterial({ color: 0xf4f0e8 })));
    const gold = new THREE.LineBasicMaterial({ color: 0xa48a62, transparent: true, opacity: 0.32 });
    for (let lat = -60; lat <= 60; lat += 30) { const pts = []; for (let l = -180; l <= 180; l += 4) pts.push(vec(lat, l, R * 1.002)); g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gold)); }
    for (let lng = -180; lng < 180; lng += 30) { const pts = []; for (let la = -90; la <= 90; la += 4) pts.push(vec(la, lng, R * 1.002)); g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gold)); }
    if (!landCache) { landCache = []; const N = 18000, gold2 = Math.PI * (3 - Math.sqrt(5)); for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, th = gold2 * i, lat = Math.asin(y) * 180 / Math.PI; let lng = (th * 180 / Math.PI) % 360; if (lng > 180) lng -= 360; if (LAND.some(pl => inPoly(lng, lat, pl))) landCache.push([lat, lng]); } }
    const dp = []; landCache.forEach(([la, ln]) => { const v = vec(la, ln, R * 1.004); dp.push(v.x, v.y, v.z); });
    const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.Float32BufferAttribute(dp, 3));
    g.add(new THREE.Points(dg, new THREE.PointsMaterial({ color: 0x2b2a28, size: 0.016, transparent: true, opacity: 0.8 })));
    const COL = { g: 0x3f6450, a: 0x9c6c16, r: 0xb0161f };
    const paris = vec(48.86, 2.35, R);
    const pins = [], rings = [];
    ps.forEach(p => {
      const ll = geoOf(p); if (!ll) return;
      const h = Pano.health(p).overall, base = vec(ll[0], ll[1], R), tip = vec(ll[0], ll[1], R * 1.09);
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([base, tip]), new THREE.LineBasicMaterial({ color: COL[h] })));
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 16), new THREE.MeshBasicMaterial({ color: COL[h] })); head.position.copy(tip); g.add(head);
      if (h !== 'g') { const ring = new THREE.Mesh(new THREE.RingGeometry(0.03, 0.036, 40), new THREE.MeshBasicMaterial({ color: COL[h], transparent: true, opacity: 0.8, side: THREE.DoubleSide })); ring.position.copy(base.clone().multiplyScalar(1.003)); ring.lookAt(base.clone().multiplyScalar(2)); g.add(ring); rings.push(ring); }
      const mid = base.clone().add(paris).multiplyScalar(0.5); const dist = base.distanceTo(paris); mid.normalize().multiplyScalar(R + dist * 0.28);
      const curve = new THREE.QuadraticBezierCurve3(paris.clone(), mid, base.clone());
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)), new THREE.LineBasicMaterial({ color: 0xa48a62, transparent: true, opacity: 0.45 })));
      const lab = document.createElement('a'); lab.className = 'g-lab g-lab-' + h; lab.href = '#/project/' + p.id; lab.innerHTML = `<i></i>${esc(p.city)}`; el.appendChild(lab);
      pins.push({ p, tip, lab });
    });
    const hq = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 16), new THREE.MeshBasicMaterial({ color: 0x1b1a18 })); hq.position.copy(vec(48.86, 2.35, R * 1.01)); g.add(hq);
    g.rotation.y = -3.05;
    let drag = null, vy = reduce ? 0 : 0.0016, raf;
    el.addEventListener('pointerdown', e => { if (e.target.closest('a')) return; drag = { x: e.clientX, y: e.clientY, ry: g.rotation.y, rx: g.rotation.x }; el.setPointerCapture(e.pointerId); el.classList.add('grab'); });
    el.addEventListener('pointermove', e => { if (!drag) return; g.rotation.y = drag.ry + (e.clientX - drag.x) * 0.006; g.rotation.x = Math.max(-0.6, Math.min(0.9, drag.rx + (e.clientY - drag.y) * 0.004)); });
    const end = () => { drag = null; el.classList.remove('grab'); }; el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    const ro = new ResizeObserver(() => { W = el.clientWidth; H = el.clientHeight; if (!W || !H) return; renderer.setSize(W, H); cam.aspect = W / H; fit(); cam.updateProjectionMatrix(); }); ro.observe(el);
    const v3 = new THREE.Vector3(), camDir = new THREE.Vector3();
    const place = (pos, node) => { v3.copy(pos).applyMatrix4(g.matrixWorld); const facing = v3.clone().normalize().dot(camDir.copy(cam.position).normalize()); const s = v3.project(cam); node.style.transform = `translate(${(s.x * 0.5 + 0.5) * W}px, ${(-s.y * 0.5 + 0.5) * H}px)`; node.style.opacity = facing > 0.18 ? 1 : 0; node.style.pointerEvents = facing > 0.18 ? 'auto' : 'none'; };
    let t = 0;
    const tick = () => {
      if (!el.isConnected) { cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); return; }
      if (!drag) g.rotation.y += vy; t += 0.02;
      rings.forEach(r => { const k = reduce ? 1.4 : 1 + ((t % 1.6) / 1.6) * 1.6; r.scale.set(k, k, k); r.material.opacity = reduce ? 0.6 : 0.85 * (1 - (t % 1.6) / 1.6); });
      g.updateMatrixWorld(); renderer.render(scene, cam);
      pins.forEach(x => place(x.tip, x.lab));
      const shown = pins.filter(x => x.lab.style.opacity === '1').map(x => { const m = /translate\(([-\d.]+)px, ([-\d.]+)px\)/.exec(x.lab.style.transform); return { x, px: m ? +m[1] : 0, py: m ? +m[2] : 0 }; }).sort((a, b) => a.py - b.py);
      const taken = [];
      shown.forEach(o => { let y = o.py; while (taken.some(t => Math.abs(t.px - o.px) < 130 && Math.abs(t.py - y) < 24)) y += 24; taken.push({ px: o.px, py: y }); if (y !== o.py) o.x.lab.style.transform = `translate(${o.px}px, ${y}px)`; });
      raf = requestAnimationFrame(tick);
    };
    tick();
  }
  const cat = h => /tender/.test(h) ? 'Tender' : /costs|#\/cost/.test(h) ? 'Cost' : /\/data/.test(h) ? 'Data' : /supplier/.test(h) ? 'Supplier' : /documents/.test(h) ? 'Files' : /library/.test(h) ? 'Library' : 'Project';
  Saas.hero = 'world';
  const home0 = A.views.home;
  function home() {
    const fin = A.fin();
    const ps = A.vis();
    const t = A.totals(ps);
    const mw = Pano.work();
    const hs = ps.map(p => ({ p, h: Pano.health(p) }));
    const cnt = k => hs.filter(x => x.h.overall === k).length;
    const v = t.forecast - t.budget;
    const openT = D.TENDERS.filter(x => x.status !== 'Awarded' && A.visIds().has(x.project)).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
    const openings = ps.slice().sort((a, b) => ((a.admin || {}).opening || a.handover).localeCompare((b.admin || {}).opening || b.handover)).filter(p => ((p.admin || {}).opening || p.handover) >= today()).slice(0, 3);
    const cats = {}; ps.forEach(p => p.lines.forEach(l => { cats[l.name] = (cats[l.name] || 0) + l.budget; }));
    const catList = Object.entries(cats).sort((a, b) => b[1] - a[1]); const catTot = catList.reduce((a, x) => a + x[1], 0) || 1;
    const shades = ['#1b1a18', '#3d3a35', '#5f5a52', '#817a70', '#a48a62', '#bda67f', '#d3c3a4', '#e3d8c4', '#efe8dc'];
    let acc = 0; const donut = catList.map((c, i) => { const a0 = acc / catTot, a1 = (acc += c[1]) / catTot; const arc = a => [50 + 38 * Math.sin(2 * Math.PI * a), 50 - 38 * Math.cos(2 * Math.PI * a)]; const [x0, y0] = arc(a0), [x1, y1] = arc(a1 - 0.0001); return `<path d="M${x0} ${y0} A38 38 0 ${a1 - a0 > 0.5 ? 1 : 0} 1 ${x1} ${y1}" stroke="${shades[i % shades.length]}" stroke-width="14" fill="none"/>`; }).join('');
    const starts = ps.map(p => new Date(((p.admin || {}).commitment || addDays(p.handover, -540)) + 'T12:00:00')), ends = ps.map(p => new Date(((p.admin || {}).opening || p.handover) + 'T12:00:00'));
    const t0 = new Date(Math.min(...starts)); t0.setDate(1); const t1 = new Date(Math.max(...ends)); t1.setMonth(t1.getMonth() + 1);
    const pos = d => ((d - t0) / (t1 - t0) * 100).toFixed(2) + '%';
    const years = []; for (let y = t0.getFullYear(); y <= t1.getFullYear(); y++) { const d = new Date(y, 0, 1); if (d > t0 && d < t1) years.push(d); }
    const stagesOf = (s, e) => { const span = e - s; return [['Design', 0, 0.3], ['Tender', 0.3, 0.45], ['Works', 0.45, 1]].map(x => [x[0], new Date(s.getTime() + span * x[1]), new Date(s.getTime() + span * x[2])]); };
    const bar = (val, max, cls = '') => `<span class="mbar ${cls}"><i style="width:${Math.max(0, Math.min(100, val / (max || 1) * 100)).toFixed(1)}%"></i></span>`;
    const stageBar = `<span class="mstack">${D.STATUSES.map(s => { const n = ps.filter(p => p.status === s).length; return n ? `<i style="flex:${n};background:${STAGE_C[s]}" title="${s}: ${n}"></i>` : ''; }).join('')}</span>`;
    const byZone = ['West', 'East'].map(z => ({ z, list: hs.filter(x => x.p.zone === z) }));
    const html = `
    <div class="dash-head"><h1>Portfolio</h1><div class="actions"><button class="btn ghost" data-act="palette">${icon('spark', 16)} Ask Copilot</button><button class="btn" data-act="np-open">New project</button></div></div>
    <div class="tiles">
      <div class="tile"><span class="t-l">Projects</span><span class="t-v">${ps.length}</span>${stageBar}<span class="t-s">${ps.filter(p => p.status === 'Works').length} in works · ${ps.filter(p => p.status === 'Tender').length} in tender</span></div>
      <div class="tile"><span class="t-l">Budget</span><span class="t-v">${fin ? mE(t.budget) : A.mask()}</span>${fin ? bar(t.budget, Math.max(t.budget, t.forecast), 'mute') : ''}<span class="t-s">SOP · Anaplan</span></div>
      <div class="tile"><span class="t-l">Committed</span><span class="t-v">${fin ? mE(t.committed) : A.mask()}</span>${fin ? bar(t.committed, t.budget) : ''}<span class="t-s">${fin ? Math.round(t.committed / t.budget * 100) + '% of budget' : 'Coupa'}</span></div>
      <div class="tile"><span class="t-l">Forecast final cost</span><span class="t-v">${fin ? mE(t.forecast) : A.mask()}</span>${fin ? `<span class="mbar mark"><i style="width:${(t.forecast / Math.max(t.budget, t.forecast) * 100).toFixed(1)}%"></i><b style="left:${(t.budget / Math.max(t.budget, t.forecast) * 100).toFixed(1)}%"></b></span>` : ''}<span class="t-s">red mark = budget</span></div>
      <div class="tile"><span class="t-l">Variance</span><span class="t-v ${fin ? A.vcls(v / t.budget) : ''}">${fin ? (v >= 0 ? '+' : '−') + mE(Math.abs(v)) : A.mask()}</span><span class="t-s">${fin ? A.pct(v / t.budget) + ' on budget' : ''}</span></div>
      <div class="tile"><span class="t-l">Paid to date</span><span class="t-v">${fin ? mE(t.actual) : A.mask()}</span>${fin ? bar(t.actual, t.forecast) : ''}<span class="t-s">${fin ? Math.round(t.actual / t.forecast * 100) + '% of forecast' : ''}</span></div>
    </div>
    <section class="card hero-card"><div class="hero-stage">
        <div class="seg hero-seg" role="tablist" aria-label="3D view"><button class="${Saas.hero === 'world' ? 'on' : ''}" data-act="hero" data-v="world" role="tab" aria-selected="${Saas.hero === 'world'}">World</button><button class="${Saas.hero === 'platform' ? 'on' : ''}" data-act="hero" data-v="platform" role="tab" aria-selected="${Saas.hero === 'platform'}">Platform</button></div>
        ${Saas.hero === 'world' ? '<div class="globe" id="globe" role="img" aria-label="Globe of the projects, coloured by health, linked to Paris"></div><span class="g-hint"><i class="hq-dot"></i>Paris HQ · drag to turn · click a project</span>' : '<div class="hero-3d" id="hero3d" role="img" aria-label="3D model of the platform: six departments around one data core"></div>'}
      </div>
      <div class="hero-side">
        <div class="health-sum"><div><b class="hs-g">${cnt('g')}</b><span>On track</span></div><div><b class="hs-a">${cnt('a')}</b><span>Watch</span></div><div><b class="hs-r">${cnt('r')}</b><span>At risk</span></div></div>
        ${byZone.map(zz => `<h3 class="zone-h">${zz.z} <span>${zz.list.length}</span></h3><ul class="plain zone-list">${zz.list.sort((a, b) => ({ r: 0, a: 1, g: 2 }[a.h.overall] - { r: 0, a: 1, g: 2 }[b.h.overall])).map(x => `<li><a href="#/project/${x.p.id}"><span class="dot dot-${x.h.overall}"></span><span class="zn">${esc(x.p.city)}</span><span class="zd">${A.dfmt((x.p.admin || {}).opening || x.p.handover)}</span></a></li>`).join('')}</ul>`).join('')}
      </div></section>
    <div class="cards c2w">
      <section class="card"><div class="card-h"><h2>My work</h2><span class="count">${mw.length}</span></div>
        <ul class="mw-list">${mw.slice(0, 6).map(w => { const n = A.days(w[3]); return `<li><a href="${w[4]}"><span class="tag ${w[0] === 'Approve' ? 'ai' : ''}">${cat(w[4])}</span><span class="t"><b>${esc(w[1])}</b><span>${esc(w[2])}</span></span><span class="due ${n <= 4 ? 'soon' : ''}">${n <= 0 ? 'Today' : n === 1 ? 'Tomorrow' : n + ' d'}</span></a>${w[5] ? `<button class="mw-x" data-act="${w[6] || 'mw-done'}" data-v="${esc(w[7] || w[5])}">${w[6] === 'amend-ok' ? 'Approve' : w[6] === 'confirm-block' ? 'Confirm' : 'Done'}</button>` : ''}</li>`; }).join('') || '<li class="empty">Nothing waiting for you.</li>'}</ul></section>
      <section class="card"><div class="card-h"><h2>Coming up</h2><a class="more" href="#/tenders">Tenders</a></div>
        <ul class="plain dates">${openT.map(x => `<li><a href="#/tender/${x.id}"><span class="d"><b>${new Date(x.date + 'T12:00:00').getDate()}</b>${new Date(x.date + 'T12:00:00').toLocaleDateString('en-GB', { month: 'short' })}</span><span><b>${esc(x.pkg)}</b><i>${A.P[x.project].city} · ${x.dateLabel}</i></span></a></li>`).join('')}${openings.map(p => { const d = new Date(((p.admin || {}).opening || p.handover) + 'T12:00:00'); return `<li><a href="#/project/${p.id}"><span class="d op"><b>${d.getDate()}</b>${d.toLocaleDateString('en-GB', { month: 'short' })}</span><span><b>Opening</b><i>${esc(p.city)}</i></span></a></li>`; }).join('')}</ul></section>
    </div>
    <section class="card"><div class="card-h"><h2>Projects</h2><a class="more" href="#/projects">All projects</a></div>
      <div class="tbl-wrap"><table class="tbl ptable"><thead><tr><th>Project</th><th>Stage</th><th class="hide-sm">Opening</th><th class="r hide-sm">Budget</th><th class="hide-xs">Paid / committed</th><th class="r">Variance</th><th class="hide-sm">Cost</th><th class="hide-sm">Time</th><th class="hide-sm">Data</th></tr></thead><tbody>
      ${hs.map(({ p, h }) => `<tr class="click" data-href="#/project/${p.id}"><td><div class="pname"><span class="thumb">${window.TEX ? window.TEX.facade(p.concept, { floors: p.floors }) : ''}</span><span><b>${esc(p.city)}</b><span class="small muted">${esc(p.country)}</span></span></div></td><td>${A.statusTag(p.status)}</td><td class="hide-sm">${A.dfmt((p.admin || {}).opening || p.handover)}</td><td class="r hide-sm">${fin ? mE(p.budget) : A.mask()}</td><td class="hide-xs" style="min-width:130px">${fin ? payBar(p) : ''}</td><td class="r ${A.vcls(p.variancePct)}">${fin ? A.pct(p.variancePct) : A.mask()}</td><td class="hide-sm">${fin ? rag(h.cost) : '—'}</td><td class="hide-sm">${rag(h.sched)}</td><td class="hide-sm">${rag(h.data)}</td></tr>`).join('')}</tbody></table></div></section>
    <div class="cards c2">
      <section class="card"><div class="card-h"><h2>Timeline</h2></div>
        <div class="gantt"><div class="g-axis">${years.map(y => `<span style="left:${pos(y)}">${y.getFullYear()}</span>`).join('')}</div>
        ${ps.map((p, i) => { const s = starts[i], e = ends[i]; return `<a class="g-row" href="#/project/${p.id}"><span class="g-name">${esc(p.city)}</span><span class="g-track">${stagesOf(s, e).map(st => `<i style="left:${pos(st[1])};width:calc(${pos(st[2])} - ${pos(st[1])});background:${STAGE_C[st[0]]}" title="${st[0]}"></i>`).join('')}<b style="left:${pos(e)}" title="Opening ${A.dfmt(e.toISOString().slice(0, 10))}"></b></span></a>`; }).join('')}
        <span class="g-today" style="left:calc(var(--gname) + (100% - var(--gname)) * ${((Date.now() - t0) / (t1 - t0)).toFixed(4)})"><em>Today</em></span></div>
        <div class="legend" style="margin-top:10px">${['Design', 'Tender', 'Works'].map(s => `<span><i style="background:${STAGE_C[s]}"></i>${s}</span>`).join('')}<span><i style="background:var(--rouge);width:3px"></i>Opening</span></div></section>
      <section class="card"><div class="card-h"><h2>Budget by category</h2></div>
        ${fin ? `<div class="donut-wrap"><svg viewBox="0 0 100 100" class="donut" role="img" aria-label="Budget split by category">${donut}<text x="50" y="52" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor">${mE(catTot)}</text></svg>
        <ul class="plain cats">${catList.map((c, i) => `<li><i style="background:${shades[i % shades.length]}"></i><span>${c[0]}</span><b>${Math.round(c[1] / catTot * 100)}%</b></li>`).join('')}</ul></div>` : A.restricted('Cost data')}</section>
    </div>
    <div class="cards c2">
      <section class="card"><div class="card-h"><h2>Needs attention</h2></div><ul class="list">${(D.ALERTS || []).filter(a => (A.fin() || a.kind !== 'Budget') && (!a.project || A.visIds().has(a.project))).slice(0, 4).map(a => `<li><a class="row alert" href="${a.link}"><span class="lvl ${a.level}"></span><div style="flex:1;min-width:0"><h3>${esc(a.title)}</h3><p>${esc(String(a.body))}</p></div></a></li>`).join('')}</ul></section>
      <section class="card"><div class="card-h"><h2>Recently opened</h2><a class="more" href="#/library/boutiques">Photos</a></div>
        <div class="photo-grid">${[['assets/store-bangkok-facade.jpg', 'Bangkok EM Quartier'], ['assets/store-rodeo-facade-2.jpg', 'Beverly Hills Rodeo Drive'], ['assets/store-bangkok-tryon-pink.jpg', 'Bangkok · try-on'], ['assets/store-bangkok-tryon-women.jpg', 'Bangkok · try-on']].map(x => `<a href="#/library/boutiques"><img src="${x[0]}" alt="${x[1]}"><span>${x[1]}</span></a>`).join('')}</div></section>
    </div>`;
    const after = () => { if (Saas.hero === 'world') globe(document.getElementById('globe'), ps); else { const h0 = home0(); if (h0 && h0.after) h0.after(); } };
    return { html, after };
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
      case 'hero': Saas.hero = v; A.render(true); return true;
      case 'ctab': Saas.ctab = v; A.render(true); return true;
      case 'tree': Saas.open.has(v) ? Saas.open.delete(v) : Saas.open.add(v); A.render(true); return true;
      case 'tree-all': { const all = A.vis(); if (Saas.open.size >= all.length) Saas.open.clear(); else all.forEach(p => Saas.open.add(p.id)); A.render(true); return true; }
    }
    return handle0(act, v, b);
  };
  document.addEventListener('click', e => { const a = e.target.closest('a[data-act="ctab"]'); if (a) e.preventDefault(); }, true);

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
    return `<div class="jr" data-links='${JSON.stringify(d.links)}'><svg class="jr-links" aria-hidden="true"></svg><div class="jr-cols">${d.cols.map(c => `<div class="jr-col"><div class="jr-card">${c.items.map(x => `<div class="jr-it st-${x.st}" data-k="${x.k}">${sIcon(x.st)}<div class="jr-tx"><a class="jr-t" href="${x.href}"><b>${esc(x.t)}</b><span>${esc(x.s)}</span></a>${x.act ? `<button class="jr-act" data-act="${x.act.a}" data-v="${esc(x.act.v)}">${x.act.l}</button>` : ''}</div></div>`).join('')}</div><div class="jr-cap">${c.name}</div></div>`).join('')}</div></div>
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
      ${Saas.view === 'pipeline' ? `<div class="pipe">${stages.map(s => { const list = hs.filter(x => x.p.status === s); return `<div class="pipe-col"><div class="pipe-h">${s}<span>${list.length}</span></div>${list.map(x => `<button class="pc ${x.p.id === Saas.sel ? 'on' : ''}" data-act="sel" data-v="${x.p.id}">${avatar(x.p)}<span class="pc-t"><b>${esc(x.p.city)}</b><span>Opening ${A.dfmt((x.p.admin || {}).opening || x.p.handover)}</span></span><span class="pc-r"><b>${x.d.pct}%</b><span class="dot dot-${x.h.overall}" title="${{ g: 'On track', a: 'Watch', r: 'At risk' }[x.h.overall]}"></span></span></button>`).join('') || '<div class="pipe-empty">No project</div>'}</div>`; }).join('')}</div>`
      : Saas.view === 'dossiers' ? `<div class="dl">${hs.sort((a, b) => a.d.pct - b.d.pct).map(x => `<button class="dl-row ${x.p.id === Saas.sel ? 'on' : ''}" data-act="sel" data-v="${x.p.id}">${avatar(x.p)}<span class="dl-n"><b>${esc(x.p.city)}</b><span>${x.p.status}</span></span><span class="dl-bar"><i style="width:${x.d.pct}%"></i></span><span class="dl-p">${x.d.pct}%</span><span class="dl-m">${x.d.miss ? `<em class="miss">${x.d.miss} missing</em>` : '<em class="ok">Nothing missing</em>'}${x.d.prog ? ` <em>${x.d.prog} in progress</em>` : ''}</span></button>`).join('')}</div>`
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

  const start = () => { railShell(); setTimeout(afterRender, 50); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(start, 0)); else start();
})();
