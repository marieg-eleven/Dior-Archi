"""Step 7 — SaaS shell and UI system (v1.2): left navigation, opaque top bar, cards on a
neutral canvas, one action colour, 3 weights, nothing under 12px, no glass, no rainbow
gradients, no decorative pills. Loads build/saas.js. Author: Marie Guegain — eleven."""
import sys, re, pathlib
P = sys.argv[1]; s = open(P, encoding='utf-8').read()
HERE = pathlib.Path(__file__).resolve().parent
def rep(a, b, count=1):
    global s
    assert a in s, 'MISSING: ' + a[:110]; s = s.replace(a, b, count)

# --- type floor and weight cap in the existing stylesheet (typography skill)
i0, i1 = s.index('<style>'), s.index('</style>')
css = s[i0:i1]
def bump(m):
    v = float(m.group(2)); return m.group(1) + ('12' if v < 12 else m.group(2)) + 'px'
css = re.sub(r'(font:\s*(?:italic\s+)?\d{3}\s+)(\d+(?:\.\d+)?)px', bump, css)
css = re.sub(r'(font-size:\s*)(\d+(?:\.\d+)?)px', bump, css)
css = re.sub(r'font-weight:\s*700', 'font-weight:600', css).replace('font:700 ', 'font:600 ')
s = s[:i0] + css + s[i1:]
s = s.replace('family=Figtree:ital,wght@0,400;0,500;0,600;0,700;1,400', 'family=Figtree:ital,wght@0,400;0,500;0,600;1,400')
# --- no conic "nacre" gradient anywhere (anti-slop): solid warm neutral instead
s = re.sub(r'--nacre:conic-gradient\([^;]*\);', '--nacre:#efe9df;', s)
# --- documents: AI readiness and ask AI on each row
i = s.index('function docTable(list)'); j = s.index('function assets()', i)
seg = s[i:j].replace('<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(d.name)}</span>', '<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(d.name)}</span>${window.Saas ? Saas.docBadges(d) : \'\'}', 1)
s = s[:i] + seg + s[j:]
rep("· v1.1, 12 November 2026", "· v1.2, 12 November 2026")

CSS = r"""
/* ===== v1.2 SaaS UI system =====
   Layout: fixed left navigation (240px) + opaque top bar; pages centred at 1320px on a neutral canvas.
   Colour 60-30-10: canvas L0, white cards and dark navigation as structure, ink as the single action colour.
   Stone and sage/ochre/red are reserved for data and status. */
:root{--canvas:#f6f5f2;--surface:#fff;--border:rgba(27,26,24,.09);--side:#17181a;--shadow:0 8px 24px rgba(0,0,0,.07)}
body.saas{background:var(--canvas);padding-left:240px}
.saas .side{position:fixed;inset:0 auto 0 0;width:240px;background:var(--side);color:#cfcbc4;display:flex;flex-direction:column;padding:18px 12px 14px;z-index:60;overflow-y:auto}
.saas .side-brand{display:flex;align-items:center;gap:12px;padding:6px 12px 22px;color:#fff;text-decoration:none}
.saas .side-brand img{height:22px;width:auto;filter:invert(1)}
.saas .side-brand span{display:flex;flex-direction:column;line-height:1.2}
.saas .side-brand b{font:600 12px/1.2 var(--sans);letter-spacing:.14em;text-transform:uppercase}
.saas .side-brand i{font:italic 400 14px/1.2 var(--display);color:#b9b4ab}
.saas .side-nav{display:flex;flex-direction:column;gap:2px}
.saas .side a[data-nav]{display:flex;align-items:center;gap:12px;height:40px;padding:0 12px;border-radius:8px;color:#cfcbc4;font:500 14px/1 var(--sans);text-decoration:none}
.saas .side a[data-nav]:hover{background:rgba(255,255,255,.06);color:#fff}
.saas .side a[data-nav].on{background:#fff;color:var(--side)}
.saas .side a[data-nav]:focus-visible{outline:2px solid #fff;outline-offset:2px}
.saas .side-count:empty,.saas .bell em:empty{display:none}
.saas .side-count{margin-left:auto;font:600 12px/1 var(--sans);font-style:normal;background:rgba(255,255,255,.14);color:#fff;border-radius:10px;padding:4px 7px}
.saas .side a.on .side-count{background:var(--side)}
.saas .side-foot{margin-top:auto;border-top:1px solid rgba(255,255,255,.08);padding-top:10px;display:flex;flex-direction:column;gap:6px}
.saas .side-status{font:400 12px/1.4 var(--sans);color:#9a968f;padding:4px 12px}
.saas .top{background:var(--surface);backdrop-filter:none;-webkit-backdrop-filter:none;border-bottom:1px solid var(--border)}
.saas .top .brand,.saas .top .nav{display:none}
.saas .top-in{max-width:none;height:60px;padding:0 24px;gap:12px;flex-wrap:nowrap}
.saas .crumb{flex:1;min-width:0;display:flex;align-items:center;gap:8px;font:400 14px/1 var(--sans);color:var(--grey);white-space:nowrap;overflow:hidden}
.saas .crumb b{color:var(--ink);font-weight:600}
.saas .crumb a{color:var(--grey)}
.saas .side-toggle{display:none}
.saas .top-r{display:flex;align-items:center;gap:10px}
.saas .ask-btn{background:var(--canvas);color:var(--grey);border:1px solid var(--border);min-width:260px;justify-content:flex-start;font-weight:400}
.saas .ask-btn .orb{display:none}
.saas .ask-btn:hover{border-color:var(--line-2);color:var(--ink)}
.saas .newbtn{background:var(--ink);color:#fff;border-color:var(--ink)}
.saas .bell{position:relative}
.saas .bell em{position:absolute;top:-4px;right:-4px;font:600 12px/1 var(--sans);font-style:normal;background:var(--ink);color:#fff;border-radius:10px;padding:3px 6px}
.saas main{max-width:1320px;margin:0 auto;padding:24px 32px 64px}
.saas .foot-in{max-width:1320px}
.saas .sample{display:none}
.saas .page-head{padding-top:8px;border-bottom:0}
.saas .page-head h1{font-size:clamp(30px,3vw,40px);line-height:1.15}
.saas .page-head .sub{font-size:16px;line-height:1.55;max-width:70ch}
/* cards: every section is an L1 surface with a hairline border */
.saas main .blk,.saas .card,.saas .summary{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:22px 24px;margin-top:16px;box-shadow:0 1px 2px rgba(0,0,0,.03)}
.saas main .blk .blk-h h2,.saas .card-h h2{font:600 18px/1.25 var(--sans);letter-spacing:0}
.saas .card-h{display:flex;align-items:baseline;flex-wrap:wrap;gap:6px 12px;margin-bottom:14px}
.saas .card-h h2{margin:0;display:flex;align-items:center;gap:8px}
.saas .card-h .more{margin-left:auto;font-size:14px;color:var(--ink);border-bottom:1px solid var(--line-2)}
.saas .cards{display:grid;gap:16px;margin-top:16px}
.saas .cards>.card{margin-top:0}
.saas .cards.c3{grid-template-columns:minmax(0,1.5fr) minmax(0,1fr) minmax(0,1fr)}
.saas .cards.c2{grid-template-columns:repeat(2,minmax(0,1fr))}
.saas .panel{border:1px solid var(--border);border-radius:10px;box-shadow:none}
/* dashboard */
.saas .dash-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;padding-top:8px}
.saas .dash-head h1{font:400 clamp(30px,3vw,40px)/1.15 var(--display);margin:4px 0 6px}
.saas .dash-head .hello{margin:0;font-size:14px}
.saas .dash-head .sub{margin:0;color:var(--grey);font-size:16px}
.saas .dash-head .actions{display:flex;gap:10px}
.saas .tiles{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;margin-top:20px}
.saas .tile{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px 18px;display:flex;flex-direction:column;gap:6px;min-width:0}
.saas .t-l{font:500 14px/1.3 var(--sans);color:var(--grey)}
.saas .t-v{font:600 28px/1.1 var(--sans);letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.saas .t-s{font:400 12px/1.4 var(--sans);color:var(--grey)}
.saas .kpis{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;border:0;margin-top:16px}
.saas .kpi{background:var(--surface);border:1px solid var(--border)!important;border-radius:12px;padding:16px 18px}
.saas .mw-list,.saas .plain{list-style:none;margin:0;padding:0}
.saas .mw-list li{display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--line)}
.saas .mw-list li:last-child,.saas .plain li:last-child a{border-bottom:0}
.saas .mw-list a{flex:1;min-width:0;display:grid;grid-template-columns:72px minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px 0;color:inherit}
.saas .mw-list .tag{justify-content:center}
.saas .mw-list .t b{display:block;font-weight:600;font-size:14px;line-height:1.35}
.saas .mw-list .t span{display:block;font-size:12px;color:var(--grey);line-height:1.4}
.saas .mw-list .due{font-size:12px;color:var(--grey);white-space:nowrap}
.saas .mw-list .due.soon{color:var(--rouge);font-weight:600}
.saas li.empty{padding:14px 0;color:var(--grey);font-size:14px;border:0}
.saas .health-sum{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px}
.saas .health-sum div{display:flex;flex-direction:column;gap:2px;padding:10px 12px;border-radius:8px;background:var(--canvas)}
.saas .health-sum b{font:600 28px/1.1 var(--sans)}
.saas .health-sum span{font-size:12px;color:var(--grey)}
.saas .hs-g{color:var(--sage)}.saas .hs-a{color:var(--ochre)}.saas .hs-r{color:var(--rouge)}
.saas .plain a{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid var(--line);color:inherit;font-size:14px}
.saas .plain.dates a{justify-content:flex-start}
.saas .plain.dates .d{width:60px;flex:none;font-size:12px;color:var(--grey)}
.saas .plain.dates b{display:block;font-weight:600;font-size:14px}
.saas .plain.dates i{display:block;font-style:normal;font-size:12px;color:var(--grey)}
.saas .pbar{display:flex;height:8px;border-radius:4px;background:var(--mist);overflow:hidden}
.saas .pbar i{display:block;height:100%}
.saas .pb-paid{background:var(--ink)}.saas .pb-com{background:var(--stone-2)}
.saas .tbl td{font-size:14px}
.saas .tbl th{font-size:12px}
.saas .tbl tr.click{cursor:pointer}
.saas .tbl tr.click:hover td{background:var(--canvas)}
.saas .rag{display:inline-block;font:500 12px/1 var(--sans);padding:4px 8px;border-radius:6px;border:1px solid}
.saas .rag-g{color:var(--sage);border-color:rgba(63,100,80,.35);background:rgba(63,100,80,.06)}
.saas .rag-a{color:var(--ochre);border-color:rgba(156,108,22,.35);background:rgba(156,108,22,.06)}
.saas .rag-r{color:var(--rouge);border-color:rgba(176,22,31,.35);background:rgba(176,22,31,.05)}
.saas .gantt{position:relative;padding-top:24px}
.saas .g-axis{position:absolute;left:132px;right:0;top:0;height:18px}
.saas .g-axis span{position:absolute;transform:translateX(-50%);font-size:12px;color:var(--grey)}
.saas .g-row{display:grid;grid-template-columns:132px minmax(0,1fr);align-items:center;height:30px;color:inherit}
.saas .g-name{font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:10px}
.saas .g-track{position:relative;height:10px;background:var(--mist);border-radius:5px}
.saas .g-track i{position:absolute;top:0;bottom:0}
.saas .g-track b{position:absolute;top:-4px;bottom:-4px;width:3px;margin-left:-1px;background:var(--rouge);border-radius:2px}
.saas .g-today{position:absolute;top:20px;bottom:0;width:1px;background:var(--ink);opacity:.45}
.saas .g-today em{position:absolute;top:-20px;left:4px;font:500 12px/1 var(--sans);font-style:normal;color:var(--ink)}
.saas .donut-wrap{display:grid;grid-template-columns:160px minmax(0,1fr);gap:20px;align-items:center}
.saas .donut{width:160px;height:160px;color:var(--ink)}
.saas .cats li{display:grid;grid-template-columns:10px minmax(0,1fr) auto;gap:10px;align-items:center;padding:6px 0;border-bottom:1px solid var(--line);font-size:14px}
.saas .cats li i{width:10px;height:10px;border-radius:2px}
.saas .cats b{font-weight:500;font-variant-numeric:tabular-nums}
.saas .photo-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.saas .photo-grid a{display:flex;flex-direction:column;gap:6px;color:inherit;font-size:12px}
.saas .photo-grid img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:8px;border:1px solid var(--border)}
/* project summary */
.saas .summary{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:24px;align-items:center}
.saas .summary ul{list-style:none;margin:0;padding:0}
.saas .summary li{font-size:14px;line-height:1.55;padding:3px 0}
.saas .summary b{font-weight:600}
.saas .rings{display:flex;gap:14px}
.saas .ring{width:76px;height:76px;border-radius:50%;border:5px solid;display:grid;place-items:center;font:500 12px/1 var(--sans);color:var(--ink)}
.saas .ring-g{border-color:var(--sage)}.saas .ring-a{border-color:var(--ochre)}.saas .ring-r{border-color:var(--rouge)}
/* cost tree */
.saas .tree .tree-p td{background:#fbfaf8;font-size:14px}
.saas .tree .tw{display:inline-block;width:14px;margin-right:6px;transition:transform .15s;color:var(--grey);font-size:16px}
.saas .tree .tw.on{transform:rotate(90deg)}
.saas .lvl-b{display:inline-grid;place-items:center;width:20px;height:20px;border-radius:50%;font:600 12px/1 var(--sans);color:#fff;margin-right:8px;vertical-align:middle}
.saas .lvl-b.p{background:var(--ink-2)}.saas .lvl-b.l{background:var(--stone)}.saas .lvl-b.c{background:#6f7f93}
.saas .tree-l td:first-child{padding-left:38px}
.saas .tree-c td{color:var(--grey)}
.saas .tree-c td:first-child{padding-left:66px}
/* AI status chips: status, not decoration */
.saas .ai-chip{display:inline-block;margin-left:8px;font:500 12px/1 var(--sans);color:var(--sage);border:1px solid rgba(63,100,80,.3);border-radius:6px;padding:3px 7px;white-space:nowrap}
.saas .ai-chip.off{color:var(--grey);border-color:var(--line-2)}
.saas .ai-chip.warn{color:var(--ochre);border-color:rgba(156,108,22,.35)}
.saas .ask-ai{all:unset;margin-left:8px;font:500 12px/1 var(--sans);color:var(--ink);border-bottom:1px solid var(--line-2);cursor:pointer}
.saas .ask-ai:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
/* anti-slop: static metadata as plain text, no pills */
.saas .a-foot{gap:12px}
.saas .a-foot .tag,.saas .tag.src{background:none;border:0;padding:0;height:auto;color:var(--grey);font-size:12px}
.saas .tag{border-radius:6px;font-size:12px}
.saas .tag.ai{background:#efe9df;color:#6b5430}
.saas .orb{background:var(--stone)!important}
.saas .ai-box{border:1px solid var(--border);background:var(--canvas)}
.saas .ext{min-width:40px;font-size:12px!important;letter-spacing:0}
.saas .tbl td .ai-chip{margin-left:10px}
.saas .tbl td[style*="max-width:340px"]{max-width:460px!important}
.saas .modal,.saas .drawer{box-shadow:var(--shadow);border:1px solid var(--border)}
.saas .hero{display:none}
/* narrow: navigation becomes a drawer */
@media (max-width:1100px){.saas .tiles{grid-template-columns:repeat(3,minmax(0,1fr))}.saas .cards.c3{grid-template-columns:1fr 1fr}.saas .ask-btn{min-width:0}}
@media (max-width:960px){body.saas{padding-left:0}.saas .side{transform:translateX(-100%);transition:transform .2s}.saas.side-open .side{transform:none;box-shadow:var(--shadow)}.saas .side-toggle{display:inline-flex}.saas main{padding:16px max(16px,env(safe-area-inset-left,0px)) 48px}.saas .cards.c2,.saas .cards.c3{grid-template-columns:1fr}.saas .summary{grid-template-columns:1fr}.saas .donut-wrap{grid-template-columns:1fr}}
@media (max-width:640px){.saas .tiles{grid-template-columns:1fr 1fr}.saas .top-in{padding:0 12px;gap:8px}.saas .ask-btn,.saas #reqBtn,.saas .crumb{display:none}.saas .role{max-width:150px}.saas .top-r{margin-left:auto}}
@media (prefers-reduced-motion:reduce){.saas .side,.saas .tree .tw{transition:none}}
"""
rep("</style>", CSS + "</style>", 1)
js = (HERE / 'saas.js').read_text(encoding='utf-8')
k = s.rindex("</body>")
s = s[:k] + "<script>\n" + js + "\n</script>\n" + s[k:]
open(P, 'w', encoding='utf-8').write(s); print('step7 ok')
