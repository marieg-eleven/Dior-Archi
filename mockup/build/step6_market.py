"""Step 6 — market-standard cost controls (benchmark of owner-side tools such as Mastt):
health per project, cost position and variations, cash flow, report snapshots,
AI figures with their source and a human check, invoice review.
Author: Marie Guegain — eleven."""
import sys
P = sys.argv[1]; s = open(P, encoding='utf-8').read()
def rep(a, b, count=1):
    global s
    assert a in s, 'MISSING: ' + a[:110]; s = s.replace(a, b, count)
# health
rep("<th>Project</th><th>Status</th><th>Zone</th>", "<th>Project</th><th>Status</th><th>Health</th><th>Zone</th>")
rep("<td>${statusTag(p.status)}</td><td>${p.zone} · ${p.region}</td>", "<td>${statusTag(p.status)}</td><td>${window.Pano ? Pano.healthPill(p) : ''}</td><td>${p.zone} · ${p.region}</td>")
rep("</div><h3>${p.city}</h3><div class=\"ty\">", "</div><h3>${p.city}${window.Pano ? Pano.healthDots(p) : ''}</h3><div class=\"ty\">")
rep("<div><dt>Handover</dt><dd>${dlong(p.handover)}</dd></div>", "<div><dt>Handover</dt><dd>${dlong(p.handover)}</dd></div><div><dt>Health</dt><dd>${window.Pano ? Pano.healthPill(p) : ''}</dd></div>")
# project cost position, variations, cash flow
rep("    return `<section class=\"blk grid g-8-4\"><div>${blkH('Budget lines and purchase orders'", "    return `${window.Pano ? Pano.costPosition(p) : ''}<section class=\"blk grid g-8-4\"><div>${blkH('Budget lines and purchase orders'")
# portfolio cash flow and snapshots
rep("      <section class=\"blk grid g-7-5\">\n        <div>${blkH('By budget category'", "      ${window.Pano ? Pano.snapshotSection(all) + Pano.portfolioCash(all) : ''}\n      <section class=\"blk grid g-7-5\">\n        <div>${blkH('By budget category'")
rep("`<button class=\"btn sm ghost\" data-act=\"match\" data-v=\"${n}\">Confirm</button>`", "`<button class=\"btn sm ghost\" data-act=\"inv-check\" data-v=\"${n}\">Check</button> <button class=\"btn sm ghost\" data-act=\"match\" data-v=\"${n}\">Confirm</button>`")
# AI with sources in the offer comparison
rep("return `<td class=\"cell ${c.rec ? 'rec' : ''}\">${kE(v)}<small class=\"${vcls(d)}\">${pct(d, 0)}</small></td>`;", "return `<td class=\"cell ${c.rec ? 'rec' : ''}\">${window.Pano ? Pano.provBtn(t.id, c.b.supplier, i, kE(v)) : kE(v)}<small class=\"${vcls(d)}\">${pct(d, 0)}</small></td>`;")
rep("· v1.0, 11 November 2026", "· v1.1, 12 November 2026")
rep("</style>", """
/* --- v1.1 market-standard controls --- */
.hp{display:inline-flex;align-items:center;gap:6px;font:600 12px/1 var(--sans);padding:5px 9px;border-radius:999px;background:var(--mist);white-space:nowrap}
.hp i,.hdots i{width:8px;height:8px;border-radius:50%;display:inline-block}
.hp-g i,.hd-g{background:var(--sage)}.hp-a i,.hd-a{background:var(--ochre)}.hp-r i,.hd-r{background:var(--rouge)}
.hdots{display:inline-flex;gap:4px;margin-left:10px;vertical-align:middle}
.ffc-bar{position:relative;display:flex;height:16px;border-radius:4px;overflow:visible;background:var(--mist)}
.ffc-bar span{display:block;height:100%}
.ffc-bar span:first-child{border-radius:4px 0 0 4px}
.ffc-bar .pend,.pend-sw{background:repeating-linear-gradient(45deg,var(--ochre) 0 4px,transparent 4px 7px);border:1px solid var(--ochre)}
.ffc-bar b{position:absolute;top:-5px;bottom:-5px;width:2px;background:var(--rouge)}
.ffc .legend{margin-top:10px}
.facts-grid.five{grid-template-columns:repeat(5,minmax(0,1fr))}
.facts-grid.five div{display:flex;flex-direction:column;gap:2px}
.sub-h{font:600 15px/1.3 var(--sans);margin:26px 0 10px}
.var-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;padding:13px 0;border-bottom:1px solid var(--line)}
.var-row b{display:block;font-weight:600}
.var-row .r{text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:8px}
.var-act{display:flex;gap:6px}
.big{font:600 34px/1.1 var(--sans);margin:4px 0 8px;letter-spacing:-.02em}
.srcbtn{all:unset;cursor:pointer;border-bottom:1px dotted var(--grey-2)}
.srcbtn:hover,.srcbtn:focus-visible{border-bottom-color:var(--ink)}
.ok-tick{color:var(--sage);font-weight:700}
.checks{list-style:none;margin:0 0 6px;padding:0}
.checks li{padding:8px 0 8px 26px;border-bottom:1px solid var(--line);position:relative;font-size:14px}
.checks li::before{position:absolute;left:0;top:8px;font-weight:700}
.checks li.ok::before{content:"✓";color:var(--sage)}
.checks li.warn::before{content:"!";color:var(--ochre)}
td.under{color:var(--sage)}
@media (max-width:900px){.facts-grid.five{grid-template-columns:repeat(2,minmax(0,1fr))}}
</style>""")
open(P, 'w', encoding='utf-8').write(s); print('step6 ok')
