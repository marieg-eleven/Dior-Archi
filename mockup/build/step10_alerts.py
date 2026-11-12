"""Step 10 — v2.1: alerts inbox and rules, clearer hierarchy on the home page, role shortcuts,
coverage map of every Excel feature in Admin › Backlog coverage. Author: Marie Guegain — eleven."""
import sys
P = sys.argv[1]; s = open(P, encoding='utf-8').read()
def rep(a, b, count=1):
    global s
    assert a in s, 'MISSING: ' + a[:110]; s = s.replace(a, b, count)
rep("· v2.0, 12 November 2026", "· v2.1, 12 November 2026")
# coverage table: where each feature lives
rep("<th>#</th><th>Module</th><th>Feature</th><th>Priority</th><th>In mockup</th>", "<th>#</th><th>Module</th><th>Feature</th><th>Priority</th><th>Status</th><th>Where in the platform</th>")
rep("${SHOWN.has(f.id) ? '<span class=\"status s-ok\">Shown</span>' : DELIVERY.has(f.id) ? '<span class=\"status s-warn\">Delivery track</span>' : '<span class=\"muted small\">—</span>'}</td>",
    "${(() => { const w = (window.WHERE || {})[f.id]; const st = w ? w[0] : (SHOWN.has(f.id) ? 'shown' : DELIVERY.has(f.id) ? 'delivery' : 'later'); return st === 'shown' ? '<span class=\"status s-ok\">Shown</span>' : st === 'partial' ? '<span class=\"status s-warn\">Partly</span>' : st === 'delivery' ? '<span class=\"status\">Delivery plan</span>' : '<span class=\"muted small\">Later (P3)</span>'; })()}</td><td class=\"small\">${((window.WHERE || {})[f.id] || ['', ''])[1]}</td>")
rep("<section class=\"blk grid g-6-6\"><div>${blkH('From catalogue to full system'", "${window.Saas && Saas.confirmHTML ? Saas.confirmHTML() : ''}<section class=\"blk grid g-6-6\"><div>${blkH('From catalogue to full system'")
CSS = r"""
/* ===== v2.1 alerts and hierarchy ===== */
.glass .shortcuts{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.glass .sc{height:36px;padding:0 14px;border-radius:999px;display:inline-flex;align-items:center;background:rgba(255,255,255,.75);border:1px solid var(--gl-edge);box-shadow:0 0 0 1px var(--hair);font:500 14px/1 var(--sans);color:var(--ink);cursor:pointer;text-decoration:none}
.glass .sc:hover{background:#fff}
.glass .g-head{align-items:flex-start}
.glass .attn-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.glass .attn-c{display:flex;flex-direction:column;gap:8px;padding:16px 18px;border-radius:20px;background:var(--gl-in);border:1px solid var(--gl-edge);box-shadow:0 0 0 1px var(--hair);border-left:4px solid var(--grey-2)}
.glass .attn-c b{font:600 16px/1.3 var(--sans)}
.glass .attn-s{font-size:12px;color:var(--grey)}
.glass .attn-a{display:flex;gap:8px;margin-top:auto;padding-top:4px}
.glass .sev-b-high{border-left-color:var(--rouge)}.glass .sev-b-medium{border-left-color:var(--ochre)}.glass .sev-b-low{border-left-color:var(--grey-2)}
.glass .sev-l{font:600 12px/1 var(--sans);letter-spacing:.04em;text-transform:uppercase}
.glass .sev-l.sev-high{color:var(--rouge)}.glass .sev-l.sev-medium{color:var(--ochre)}.glass .sev-l.sev-low{color:var(--grey)}
.glass .how{padding:14px 18px}
.glass .how-flow{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.glass .how-step{display:flex;align-items:center;gap:12px;flex:1;min-width:180px}
.glass .how-step b{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:var(--ink);color:#fff;font:600 14px/1 var(--sans);flex:none}
.glass .how-step span{display:flex;flex-direction:column;font-size:12px;color:var(--grey);line-height:1.35}
.glass .how-step strong{font:600 14px/1.3 var(--sans);color:var(--ink)}
.glass .how-arr{color:var(--grey-2);font-style:normal}
.glass .inbox{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:16px;align-items:start}
.glass .ib-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;max-height:640px;overflow-y:auto}
.glass .ib-it{width:100%;display:grid;grid-template-columns:10px minmax(0,1fr) auto;gap:12px;align-items:center;padding:12px 14px;border-radius:16px;background:var(--gl-in);border:1px solid var(--gl-edge);box-shadow:0 0 0 1px var(--hair);text-align:left;cursor:pointer;font:inherit;color:inherit}
.glass .ib-it.on{box-shadow:0 0 0 2px var(--ink)}
.glass .ib-it.st-resolved{opacity:.55}
.glass .ib-t b{display:block;font:600 14px/1.3 var(--sans)}.glass .ib-t span{display:block;font-size:12px;color:var(--grey);margin-top:2px}
.glass .ib-fig{font:600 12px/1 var(--sans);color:var(--grey);white-space:nowrap}
.glass .sev{width:10px;height:10px;border-radius:50%}
.glass .sev.sev-high{background:var(--rouge)}.glass .sev.sev-medium{background:var(--ochre)}.glass .sev.sev-low{background:var(--grey-2)}
.glass .ib-detail{position:sticky;top:92px;padding:20px 22px;border-radius:22px;background:var(--gl-in);border:1px solid var(--gl-edge);box-shadow:0 0 0 1px var(--hair)}
.glass .ib-detail h2{font:600 20px/1.25 var(--sans);margin:8px 0 6px}
.glass .ib-detail p{font-size:14px;line-height:1.55;margin:0 0 14px}
.glass .trace{list-style:none;margin:0 0 16px;padding:0;border-left:2px solid var(--hair)}
.glass .trace li{position:relative;padding:6px 0 6px 18px;font-size:14px;line-height:1.45}
.glass .trace li::before{content:"";position:absolute;left:-6px;top:12px;width:10px;height:10px;border-radius:50%;background:#fff;border:2px solid var(--ink)}
.glass .trace b{display:block;font:600 12px/1.2 var(--sans);letter-spacing:.04em;text-transform:uppercase;color:var(--grey);margin-bottom:2px}
.glass .ib-acts{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.glass .ib-assign{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--grey);margin-left:auto}
.glass .ib-assign select{height:36px;border-radius:999px;border:1px solid var(--line-2);padding:0 10px;font:inherit;font-size:14px;background:#fff;color:var(--ink)}
.glass .rules td{vertical-align:top}
.glass .thr{display:inline-flex;align-items:center;gap:6px;font-size:14px;white-space:nowrap}
.glass .thr input{width:64px;height:34px;border-radius:10px;border:1px solid var(--line-2);padding:0 8px;font:inherit;font-size:14px}
.glass button.tog{border:0;cursor:pointer;padding:0;display:inline-block}
.glass .cov-sum{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.glass .cov-sum div{padding:12px 14px;border-radius:14px;background:var(--gl-in);border:1px solid var(--gl-edge)}
.glass .cov-sum b{display:block;font:600 16px/1.2 var(--sans)}.glass .cov-sum span{font-size:12px;color:var(--grey)}
@media (max-width:1000px){.glass .attn-cards{grid-template-columns:1fr}.glass .inbox{grid-template-columns:1fr}.glass .ib-detail{position:static}.glass .cov-sum{grid-template-columns:1fr 1fr}}
@media (max-width:640px){.glass .how-arr{display:none}.glass .how-step{min-width:calc(50% - 12px)}.glass .ib-assign{margin-left:0}}
"""
rep("</style>", CSS + "</style>", 1)
open(P, 'w', encoding='utf-8').write(s); print('step10 ok')
