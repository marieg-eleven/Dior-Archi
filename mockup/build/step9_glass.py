"""Step 9 — v2.0: glass UI on a pearl-grey canvas, top pill navigation, round action rail,
structured home (glance, pipeline, dossier map, waiting for you). Glass panels keep a visible
1px edge and an opaque fallback; text sits on near-opaque inner cards. Author: Marie Guegain — eleven."""
import sys
P = sys.argv[1]; s = open(P, encoding='utf-8').read()
def rep(a, b, count=1):
    global s
    assert a in s, 'MISSING: ' + a[:110]; s = s.replace(a, b, count)
rep("· v1.3, 12 November 2026", "· v2.0, 12 November 2026")
CSS = r"""
/* ===== v2.0 glass =====
   Layout: top bar with pill navigation; 64px rail of round actions on the left; content centred at 1280px.
   Surfaces: pearl canvas (L0) → frosted panels (L1, white 58% + blur + 1px light edge + hairline) → inner cards (L2, white 86%).
   Action colour: ink. Status: sage / ochre / rouge. */
:root{--pearl-1:#eeece8;--pearl-2:#e3e2e6;--gl:rgba(255,255,255,.58);--gl-in:rgba(255,255,255,.86);--gl-edge:rgba(255,255,255,.8);--hair:rgba(27,26,24,.07)}
body.glass{padding-left:76px;background:radial-gradient(1100px 620px at 8% -8%,#f7f6f3 0%,rgba(247,246,243,0) 60%),radial-gradient(900px 640px at 100% 0%,#e6e5ee 0%,rgba(230,229,238,0) 58%),linear-gradient(180deg,var(--pearl-1),var(--pearl-2));background-attachment:fixed;min-height:100vh}
.glass .side,.glass .side-scrim,.glass .side-toggle,.glass .crumb,.glass .newbtn,.glass #reqBtn{display:none!important}
/* top bar */
.glass .top{background:rgba(250,249,247,.72);backdrop-filter:blur(18px) saturate(1.2);-webkit-backdrop-filter:blur(18px) saturate(1.2);border-bottom:1px solid var(--hair)}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){.glass .top{background:#faf9f7}}
.glass .top-in{max-width:1360px;margin:0 auto;height:72px;padding:0 28px;gap:20px}
.glass .top .brand{display:flex!important;flex:none}
.glass .top .brand img{height:24px}
.glass .top .nav{display:flex!important;flex:1;justify-content:center;gap:4px;min-width:0;overflow-x:auto;scrollbar-width:none}
.glass .top .nav::-webkit-scrollbar{display:none}
.glass .top .nav a{height:40px;padding:0 16px;border-radius:999px;font:500 14px/40px var(--sans);color:var(--ink-2);white-space:nowrap}
.glass .top .nav a::after{display:none}
.glass .top .nav a:hover{background:rgba(255,255,255,.7)}
.glass .top .nav a.on{background:var(--ink);color:#fff}
.glass .top .nav a[data-nav="#/platform"]{display:none}
.glass .top-r{gap:10px}
.glass .ask-btn,.glass .icon-btn,.glass .rb{width:44px;height:44px;min-width:0;padding:0;border-radius:50%;display:inline-grid;place-items:center;background:rgba(255,255,255,.75);border:1px solid var(--gl-edge);box-shadow:0 0 0 1px var(--hair);color:var(--ink);cursor:pointer}
.glass .ask-btn:hover,.glass .icon-btn:hover,.glass .rb:hover{background:#fff}
.glass .role{height:44px;border-radius:999px;background:rgba(255,255,255,.75);border:1px solid var(--gl-edge);box-shadow:0 0 0 1px var(--hair)}
/* rail */
.glass .rail{position:fixed;left:0;top:72px;bottom:0;width:76px;display:flex;flex-direction:column;align-items:center;gap:12px;padding:20px 0;z-index:30}
.glass .rail-sep{width:24px;height:1px;background:var(--hair);margin:4px 0}
.glass .rail .rb.on{background:var(--ink);color:#fff}
.glass .fab{display:none}
.glass .sample{display:block;left:92px;background:rgba(255,255,255,.8);border:1px solid var(--gl-edge);box-shadow:0 0 0 1px var(--hair);color:var(--grey)}
/* content */
.glass main{max-width:1280px;padding:28px 28px 72px}
.glass .page-head h1,.glass .g-head h1{font:600 clamp(28px,3vw,38px)/1.15 var(--sans);letter-spacing:-.02em}
.glass .g-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:4px 0 18px}
.glass .g-head h1{margin:0}
.glass .g-actions{display:flex;gap:10px}
/* glass panels */
.glass .gl,.glass main .blk,.glass .card,.glass .summary,.glass .kpi,.glass .tile{background:var(--gl);backdrop-filter:blur(22px) saturate(1.15);-webkit-backdrop-filter:blur(22px) saturate(1.15);border:1px solid var(--gl-edge);box-shadow:0 0 0 1px var(--hair),0 12px 32px rgba(40,40,60,.05);border-radius:28px}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){.glass .gl,.glass main .blk,.glass .card,.glass .summary,.glass .kpi,.glass .tile{background:#fbfaf8}}
.glass .gl{padding:22px 24px;margin-top:18px}
.glass main .blk,.glass .card,.glass .summary{padding:22px 24px}
.glass .gl-h{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:16px}
.glass .gl-h h2{font:600 18px/1.25 var(--sans);margin:0}
.glass .gl-h .muted{font-size:14px}
.glass .cnt{font:600 12px/1 var(--sans);background:var(--ink);color:#fff;border-radius:999px;padding:5px 9px}
.glass .tbl-wrap,.glass .panel{background:var(--gl-in);border:1px solid var(--gl-edge);box-shadow:0 0 0 1px var(--hair);border-radius:18px}
.glass .tbl th{background:transparent}
/* glance */
.glass .glance{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;padding:12px}
.glass .gv{display:flex;flex-direction:column;gap:6px;padding:18px 20px;border-radius:20px;background:var(--gl-in);border:1px solid var(--gl-edge);color:inherit;text-decoration:none;min-width:0}
.glass .gv:hover{background:#fff}
.glass .gv-l{font:500 14px/1.3 var(--sans);color:var(--grey)}
.glass .gv-n{font:600 40px/1.05 var(--sans);letter-spacing:-.03em;font-variant-numeric:tabular-nums}
.glass .gv-n small{font-size:20px;color:var(--grey);font-weight:500;letter-spacing:0}
.glass .gv-n.over{color:var(--rouge)}.glass .gv-n.under{color:var(--sage)}
.glass .gv-s{font-size:14px;color:var(--grey);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
/* pills */
.glass .pills{display:flex;gap:4px;padding:4px;border-radius:999px;background:rgba(255,255,255,.6);border:1px solid var(--gl-edge);box-shadow:0 0 0 1px var(--hair)}
.glass .pills button{height:36px;padding:0 16px;border-radius:999px;border:0;background:transparent;font:500 14px/1 var(--sans);color:var(--ink-2);cursor:pointer}
.glass .pills button.on{background:var(--ink);color:#fff}
.glass .pill-link{height:40px;padding:0 18px;border-radius:999px;display:inline-flex;align-items:center;background:var(--ink);color:#fff;font:500 14px/1 var(--sans)}
/* pipeline */
.glass .pipe{display:grid;grid-template-columns:repeat(5,minmax(200px,1fr));gap:14px;overflow-x:auto;padding-bottom:4px}
.glass .pipe-col{display:flex;flex-direction:column;gap:10px;position:relative}
.glass .pipe-col::before{content:"";position:absolute;left:50%;top:44px;bottom:12px;border-left:1px dashed rgba(27,26,24,.14);z-index:0}
.glass .pipe-h{position:relative;z-index:1;height:44px;border-radius:999px;border:1px solid rgba(27,26,24,.14);display:flex;align-items:center;justify-content:center;gap:8px;font:500 14px/1 var(--sans);background:rgba(255,255,255,.4)}
.glass .pipe-h span{font-size:12px;color:var(--grey)}
.glass .pc{position:relative;z-index:1;display:grid;grid-template-columns:44px minmax(0,1fr) auto;align-items:center;gap:12px;padding:8px 14px 8px 8px;border-radius:999px;background:var(--gl-in);border:1px solid var(--gl-edge);box-shadow:0 0 0 1px var(--hair);text-align:left;cursor:pointer;font:inherit;color:inherit}
.glass .pc:hover{background:#fff}
.glass .pc.on{box-shadow:0 0 0 2px var(--ink)}
.glass .pc-t b{display:block;font:600 14px/1.3 var(--sans);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.glass .pc-t span{display:block;font-size:12px;color:var(--grey);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.glass .pc-r{display:flex;align-items:center;gap:8px}.glass .pc-r b{font:600 12px/1 var(--sans);color:var(--grey);font-variant-numeric:tabular-nums}
.glass .pipe-empty{position:relative;z-index:1;font-size:12px;color:var(--grey);text-align:center;padding:8px;background:rgba(255,255,255,.4);border-radius:999px}
.glass .av{width:44px;height:44px;border-radius:50%;overflow:hidden;flex:none;background:#f1efea;border:1px solid var(--gl-edge);box-shadow:0 0 0 1px var(--hair)}
.glass .av svg{width:100%;height:100%;display:block}
/* dossier list */
.glass .dl{display:flex;flex-direction:column;gap:8px}
.glass .dl-row{display:grid;grid-template-columns:44px minmax(120px,1.2fr) minmax(120px,2fr) 48px minmax(150px,1.2fr);align-items:center;gap:14px;padding:8px 16px 8px 8px;border-radius:999px;background:var(--gl-in);border:1px solid var(--gl-edge);box-shadow:0 0 0 1px var(--hair);text-align:left;cursor:pointer;font:inherit;color:inherit}
.glass .dl-row.on{box-shadow:0 0 0 2px var(--ink)}
.glass .dl-n b{display:block;font-weight:600;font-size:14px}.glass .dl-n span{font-size:12px;color:var(--grey)}
.glass .dl-bar{height:8px;border-radius:4px;background:rgba(27,26,24,.08);overflow:hidden}.glass .dl-bar i{display:block;height:100%;background:var(--ink);border-radius:4px}
.glass .dl-p{font:600 14px/1 var(--sans);text-align:right;font-variant-numeric:tabular-nums}
.glass .dl-m em{font-style:normal;font-size:12px;color:var(--grey)}.glass .dl-m em.miss{color:var(--rouge);font-weight:500}.glass .dl-m em.ok{color:var(--sage);font-weight:500}
/* dossier map (journey) */
.glass .sel-h{display:flex;align-items:center;gap:14px}
.glass .sel-h h2{font:600 20px/1.2 var(--sans);margin:0}
.glass .sel-h .muted{font-size:14px}
.glass .jr{position:relative;overflow-x:auto;padding:4px 2px 2px}
.glass .jr-links{position:absolute;left:0;top:0;pointer-events:none;overflow:visible;z-index:2}
.glass .jr-cols{display:grid;grid-template-columns:repeat(6,minmax(168px,1fr));gap:18px;position:relative;z-index:1}
.glass .jr-card{background:var(--gl-in);border:1px solid var(--gl-edge);box-shadow:0 0 0 1px var(--hair);border-radius:22px;padding:8px}
.glass .jr-cap{text-align:center;font:500 14px/1 var(--sans);color:var(--ink-2);margin-top:12px}
.glass .jr-it{display:grid;grid-template-columns:32px minmax(0,1fr);align-items:start;gap:10px;padding:10px 8px;border-radius:14px}
.glass .jr-tx{min-width:0;display:flex;flex-direction:column;align-items:flex-start;gap:8px}
.glass .jr-it+.jr-it{border-top:1px solid var(--hair)}
.glass .jr-t{min-width:0;color:inherit;text-decoration:none}
.glass .jr-t b{display:block;font:500 14px/1.3 var(--sans)}
.glass .jr-t span{display:block;font-size:12px;color:var(--grey);line-height:1.35}
.glass .jr-t:hover b{text-decoration:underline}
.glass .jr-ic{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;border:1px solid}
.glass .jr-done{color:var(--sage);border-color:rgba(63,100,80,.35);background:rgba(63,100,80,.08)}
.glass .jr-prog{color:var(--ochre);border-color:rgba(156,108,22,.35);background:rgba(156,108,22,.07)}
.glass .jr-miss{color:var(--rouge);border-color:rgba(176,22,31,.45);border-style:dashed;background:#fff}
.glass .jr-later{color:var(--grey-2);border-color:var(--line-2);border-style:dashed;background:transparent}
.glass .st-later .jr-t{opacity:.55}
.glass .st-miss .jr-t span{color:var(--rouge)}
.glass .jr-act{height:28px;padding:0 12px;border-radius:999px;border:1px solid var(--ink);background:var(--ink);color:#fff;font:500 12px/1 var(--sans);cursor:pointer}
.glass .st-prog .jr-act{background:transparent;color:var(--ink)}
.glass .lk{fill:none;stroke-width:1.5}
.glass .lk-ok{stroke:rgba(27,26,24,.32)}.glass .lkd.lk-ok{fill:#fff;stroke:rgba(27,26,24,.45)}
.glass .lk-wait{stroke:var(--ochre);stroke-dasharray:4 4;opacity:.8}.glass .lkd.lk-wait{fill:#fff;stroke:var(--ochre)}
.glass .lk-broken{stroke:var(--rouge);stroke-dasharray:5 4}.glass .lkd.lk-broken{fill:#fff;stroke:var(--rouge)}
.glass .jr-legend{display:flex;flex-wrap:wrap;gap:16px;margin-top:16px;font-size:12px;color:var(--grey);align-items:center}
.glass .jr-legend span{display:inline-flex;align-items:center;gap:6px}
.glass .jr-legend .jr-ic{width:20px;height:20px}.glass .jr-legend .jr-ic svg{width:11px;height:11px}
.glass .ln{display:inline-block;width:22px;border-top:1.5px solid rgba(27,26,24,.4)}.glass .ln.broken{border-top:1.5px dashed var(--rouge)}
/* 3D stage */
.glass .stage-3d{position:relative;height:440px;border-radius:22px;overflow:hidden;background:rgba(255,255,255,.5);border:1px solid var(--gl-edge)}
.glass .stage-3d .hero-3d{position:absolute;inset:0;min-height:0;margin:0}
/* two columns */
.glass .gl-row{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:18px}
.glass .gl-row>.gl{margin-top:18px}
.glass .mw-list a{grid-template-columns:minmax(0,1fr) auto}
.glass .tabs a.on{color:var(--ink)}
.glass .summary{margin-top:18px}
/* narrow */
@media (max-width:1100px){.glass .glance{grid-template-columns:repeat(2,minmax(0,1fr))}.glass .gl-row{grid-template-columns:1fr}.glass .top .nav a{padding:0 12px}}
@media (max-width:860px){body.glass{padding-left:0}.glass .rail{display:none}.glass .fab{display:grid;place-items:center;position:fixed;right:max(16px,env(safe-area-inset-right,0px));bottom:calc(20px + env(safe-area-inset-bottom,0px));width:56px;height:56px;border-radius:50%;background:var(--ink);color:#fff;border:0;z-index:50;box-shadow:0 8px 24px rgba(0,0,0,.18)}
 .glass .top-in{height:auto;flex-wrap:wrap;padding:10px 16px 0;gap:10px}.glass .top .nav{order:3;flex-basis:100%;justify-content:flex-start;padding-bottom:10px}.glass .top-r{margin-left:auto}
 .glass main{padding:18px 16px 96px}.glass .sample{left:16px;bottom:16px}}
@media (max-width:640px){.glass .gv-n{font-size:30px}.glass .gl{padding:16px;border-radius:22px}.glass .glance{padding:8px;gap:8px}.glass .gv{padding:14px}.glass .role{max-width:132px}.glass .dl-row{grid-template-columns:40px minmax(0,1fr) 44px;border-radius:20px}.glass .dl-bar,.glass .dl-m{display:none}.glass .pipe{grid-template-columns:repeat(5,minmax(230px,82%));scroll-snap-type:x mandatory}.glass .pipe-col{scroll-snap-align:start}.glass .jr-cols{grid-template-columns:repeat(6,minmax(220px,82%))}.glass .stage-3d{height:340px}}
"""
rep("</style>", CSS + "</style>", 1)
open(P, 'w', encoding='utf-8').write(s); print('step9 ok')
