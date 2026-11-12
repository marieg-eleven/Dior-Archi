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
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, W / H, 0.1, 100); cam.position.set(0, 0, 4.4);
    scene.add(new THREE.AmbientLight(0xffffff, 0.78)); const dl = new THREE.DirectionalLight(0xffffff, 0.45); dl.position.set(-3, 2, 4); scene.add(dl);
    const g = new THREE.Group(); g.rotation.x = 0.32; scene.add(g);
    const R = 1, vec = (lat, lng, r) => { const ph = (90 - lat) * Math.PI / 180, th = (lng + 180) * Math.PI / 180; return new THREE.Vector3(-r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)); };
    g.add(new THREE.Mesh(new THREE.SphereGeometry(R, 72, 72), new THREE.MeshLambertMaterial({ color: 0xf4f0e8 })));
    const gold = new THREE.LineBasicMaterial({ color: 0xa48a62, transparent: true, opacity: 0.32 });
    for (let lat = -60; lat <= 60; lat += 30) { const pts = []; for (let l = -180; l <= 180; l += 4) pts.push(vec(lat, l, R * 1.002)); g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gold)); }
    for (let lng = -180; lng < 180; lng += 30) { const pts = []; for (let la = -90; la <= 90; la += 4) pts.push(vec(la, lng, R * 1.002)); g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gold)); }
    if (!landCache) { landCache = []; const N = 14000, gold2 = Math.PI * (3 - Math.sqrt(5)); for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, th = gold2 * i, lat = Math.asin(y) * 180 / Math.PI; let lng = (th * 180 / Math.PI) % 360; if (lng > 180) lng -= 360; if (LAND.some(pl => inPoly(lng, lat, pl))) landCache.push([lat, lng]); } }
    const dp = []; landCache.forEach(([la, ln]) => { const v = vec(la, ln, R * 1.004); dp.push(v.x, v.y, v.z); });
    const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.Float32BufferAttribute(dp, 3));
    g.add(new THREE.Points(dg, new THREE.PointsMaterial({ color: 0x2b2a28, size: 0.011, transparent: true, opacity: 0.55 })));
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
    const hqLab = document.createElement('span'); hqLab.className = 'g-lab g-hq'; hqLab.textContent = 'Paris HQ'; el.appendChild(hqLab);
    g.rotation.y = -2.55;
    let drag = null, vy = reduce ? 0 : 0.0016, raf;
    el.addEventListener('pointerdown', e => { if (e.target.closest('a')) return; drag = { x: e.clientX, y: e.clientY, ry: g.rotation.y, rx: g.rotation.x }; el.setPointerCapture(e.pointerId); el.classList.add('grab'); });
    el.addEventListener('pointermove', e => { if (!drag) return; g.rotation.y = drag.ry + (e.clientX - drag.x) * 0.006; g.rotation.x = Math.max(-0.6, Math.min(0.9, drag.rx + (e.clientY - drag.y) * 0.004)); });
    const end = () => { drag = null; el.classList.remove('grab'); }; el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    const ro = new ResizeObserver(() => { W = el.clientWidth; H = el.clientHeight; if (!W || !H) return; renderer.setSize(W, H); cam.aspect = W / H; cam.updateProjectionMatrix(); }); ro.observe(el);
    const v3 = new THREE.Vector3(), camDir = new THREE.Vector3();
    const place = (pos, node) => { v3.copy(pos).applyMatrix4(g.matrixWorld); const facing = v3.clone().normalize().dot(camDir.copy(cam.position).normalize()); const s = v3.project(cam); node.style.transform = `translate(${(s.x * 0.5 + 0.5) * W}px, ${(-s.y * 0.5 + 0.5) * H}px)`; node.style.opacity = facing > 0.18 ? 1 : 0; node.style.pointerEvents = facing > 0.18 ? 'auto' : 'none'; };
    let t = 0;
    const tick = () => {
      if (!el.isConnected) { cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); return; }
      if (!drag) g.rotation.y += vy; t += 0.02;
      rings.forEach(r => { const k = reduce ? 1.4 : 1 + ((t % 1.6) / 1.6) * 1.6; r.scale.set(k, k, k); r.material.opacity = reduce ? 0.6 : 0.85 * (1 - (t % 1.6) / 1.6); });
      g.updateMatrixWorld(); renderer.render(scene, cam);
      pins.forEach(x => place(x.tip, x.lab)); place(hq.position, hqLab);
      raf = requestAnimationFrame(tick);
    };
    tick();
  }
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
        ${Saas.hero === 'world' ? '<div class="globe" id="globe" role="img" aria-label="Globe of the projects, coloured by health, linked to Paris"></div><span class="g-hint">Drag to turn · click a project</span>' : '<div class="hero-3d" id="hero3d" role="img" aria-label="3D model of the platform: six departments around one data core"></div>'}
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
