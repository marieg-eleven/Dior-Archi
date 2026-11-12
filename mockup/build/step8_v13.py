"""Step 8 — v1.3: 3D back on the dashboard (porcelain globe of the projects, or the platform
model), more visual dashboard, no needless subtitles, mobile pass. Author: Marie Guegain — eleven."""
import sys, pathlib
P = sys.argv[1]; s = open(P, encoding='utf-8').read()
ROOT = pathlib.Path(__file__).resolve().parent.parent
def rep(a, b, count=1):
    global s
    assert a in s, 'MISSING: ' + a[:110]; s = s.replace(a, b, count)
three = (ROOT / 'vendor' / 'three.min.js').read_text(encoding='utf-8')
rep('<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>', '<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>\n<script>/* three.js r147, MIT licence */\n' + three + '\n</script>')
rep("· v1.2, 12 November 2026", "· v1.3, 12 November 2026")
CSS = r"""
/* ===== v1.3 ===== */
/* no needless subtitles: descriptions only when backlog IDs are shown */
.saas .page-head .sub,.saas .blk-h .meta,.saas .card-h>.muted{display:none}
.saas.show-req .page-head .sub,.saas.show-req .blk-h .meta{display:block}
.saas .dash-head{align-items:center;padding-top:4px}
.saas .dash-head h1{margin:0}
.saas .count{font:600 12px/1 var(--sans);background:var(--ink);color:#fff;border-radius:10px;padding:4px 8px}
/* tiles with a visual cue each */
.saas .tile{gap:8px}
.saas .t-v.over{color:var(--rouge)}.saas .t-v.under{color:var(--sage)}
.saas .mbar{display:block;position:relative;height:6px;border-radius:3px;background:var(--mist)}
.saas .mbar i{display:block;height:100%;border-radius:3px;background:var(--ink)}
.saas .mbar.mute i{background:var(--stone-2)}
.saas .mbar.mark b{position:absolute;top:-3px;bottom:-3px;width:2px;margin-left:-1px;background:var(--rouge)}
.saas .mstack{display:flex;gap:2px;height:6px;border-radius:3px;overflow:hidden}
.saas .mstack i{display:block;height:100%}
/* hero: 3D globe or platform model + health by zone */
.saas .hero-card{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(0,1fr);padding:0;overflow:hidden}
.saas .hero-stage{position:relative;height:460px;background:#fbfaf7;border-right:1px solid var(--border)}
.saas .globe{position:absolute;inset:0;cursor:grab;touch-action:pan-y}
.saas .globe.grab{cursor:grabbing}
.saas .globe canvas{display:block}
.saas .hero-seg{position:absolute;top:16px;left:16px;z-index:3;background:var(--surface)}
.saas .g-hint{position:absolute;left:16px;bottom:14px;font-size:12px;color:var(--grey);z-index:2}
.saas .g-lab{position:absolute;left:0;top:0;z-index:2;display:flex;align-items:center;gap:6px;margin:-34px 0 0 6px;padding:4px 8px;border-radius:6px;background:rgba(255,255,255,.94);border:1px solid var(--border);font:500 12px/1 var(--sans);color:var(--ink);white-space:nowrap;transition:opacity .2s;text-decoration:none}
.saas .g-lab i{width:7px;height:7px;border-radius:50%}
.saas .g-lab-g i{background:var(--sage)}.saas .g-lab-a i{background:var(--ochre)}.saas .g-lab-r i{background:var(--rouge)}
.saas .g-lab:hover{border-color:var(--ink)}
.saas .g-hint{display:flex;align-items:center;gap:8px}
.saas .hq-dot{width:8px;height:8px;border-radius:50%;background:var(--ink)}
.saas .hero-card .hero-3d{position:absolute;inset:0;min-height:0;margin:0}
.saas .hero-side{padding:20px 22px;overflow-y:auto;max-height:460px}
.saas .zone-h{display:flex;justify-content:space-between;margin:18px 0 4px;font:600 12px/1 var(--sans);letter-spacing:.08em;text-transform:uppercase;color:var(--grey)}
.saas .zone-list a{display:grid;grid-template-columns:10px minmax(0,1fr) auto;gap:10px;padding:8px 0}
.saas .zone-list .zn{font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.saas .zone-list .zd{font-size:12px;color:var(--grey)}
.saas .dot{width:8px;height:8px;border-radius:50%}
.saas .dot-g{background:var(--sage)}.saas .dot-a{background:var(--ochre)}.saas .dot-r{background:var(--rouge)}
/* lists */
.saas .cards.c2w{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr)}
.saas .plain.dates a{gap:14px}
.saas .plain.dates .d{width:48px;flex:none;text-align:center;border:1px solid var(--border);border-radius:8px;padding:6px 0;font-size:12px;color:var(--grey);line-height:1.2}
.saas .plain.dates .d b{display:block;font:600 18px/1.1 var(--sans);color:var(--ink)}
.saas .plain.dates .d.op{border-color:rgba(176,22,31,.35)}
.saas .pname{display:flex;align-items:center;gap:12px}
.saas .pname b{display:block;font-weight:600}
.saas .pname .small{display:block;font-size:12px}
.saas .thumb{width:46px;height:36px;flex:none;border-radius:6px;overflow:hidden;border:1px solid var(--border);background:#f1efea}
.saas .thumb svg{display:block;width:100%;height:100%}
.saas .gantt{--gname:132px}
.saas .g-axis{left:var(--gname)}
.saas .g-row{grid-template-columns:var(--gname) minmax(0,1fr)}
/* tabs, kanban and overlays on small screens */
.saas .tabs{overflow-x:auto;flex-wrap:nowrap;scrollbar-width:none}
.saas .tabs::-webkit-scrollbar{display:none}
.saas .tabs a{white-space:nowrap}
.saas .side-scrim{display:none}
@media (max-width:1100px){.saas .hero-card{grid-template-columns:1fr}.saas .hero-stage{border-right:0;border-bottom:1px solid var(--border)}.saas .hero-side{max-height:none}.saas .cards.c2w{grid-template-columns:1fr}}
@media (max-width:960px){.saas.side-open .side-scrim{display:block;position:fixed;inset:0;background:rgba(0,0,0,.32);z-index:55}.saas .kanban{overflow-x:auto;grid-auto-flow:column;grid-template-columns:repeat(5,minmax(240px,1fr))}}
@media (max-width:760px){.saas .hide-sm{display:none}.saas .hero-stage{height:340px}.saas .page-head{flex-direction:column;align-items:flex-start;gap:12px}.saas .page-head h1,.saas .dash-head h1{font-size:30px}.saas .gantt{--gname:92px}.saas .modal{width:calc(100% - 16px);max-height:92vh;padding:20px}.saas .drawer{width:100%;max-width:100%}.saas .facts{grid-template-columns:repeat(2,minmax(0,1fr))}.saas main .blk,.saas .card,.saas .summary{padding:18px 16px}}
@media (max-width:640px){.saas .ask-btn{display:inline-flex!important;min-width:0;width:40px;padding:0;justify-content:center}.saas .ask-btn .t{display:none}.saas .dash-head .actions .btn.ghost{display:none}.saas .tiles{gap:8px}.saas .t-v{font-size:22px}.saas .health-sum b{font-size:22px}}
@media (max-width:480px){.saas .hide-xs{display:none}}
.saas .tbl-wrap{overflow-x:auto;max-width:100%}
.saas .grid>*,.saas .assets>*,.saas .blk>*{min-width:0}
.saas .blk-h{flex-wrap:wrap}
@media (max-width:760px){.saas .bars-lines>div{grid-template-columns:100px minmax(0,1fr) 56px!important}.saas .grid,.saas .assets{grid-template-columns:minmax(0,1fr)!important}.saas .assets aside{position:static}.saas .facts-grid,.saas .facts-grid.five{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:760px){.saas .kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.saas .kpi .k-v{font-size:24px}.saas .tiles{grid-template-columns:repeat(2,minmax(0,1fr))}.saas .filters{flex-wrap:wrap}.saas .hero-stage{height:320px}}
"""
rep("</style>", CSS + "</style>", 1)
open(P, 'w', encoding='utf-8').write(s); print('step8 ok')
