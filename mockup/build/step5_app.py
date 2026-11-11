"""Step 5 — working app: hooks the functional layer (build/pano.js) into the views,
makes project generation reusable for new projects, loads SheetJS for real Excel files.
Author: Marie Guegain — eleven."""
import sys, pathlib
P = sys.argv[1]; s = open(P, encoding='utf-8').read()
HERE = pathlib.Path(__file__).resolve().parent
def rep(a, b, count=1):
    global s
    assert a in s, 'MISSING: ' + a[:110]; s = s.replace(a, b, count)

# --- data: reusable generators for budget lines and cost items
rep("  PROJECTS.forEach(p => {\n    const r = rng(hash(p.id));\n", "  function genLines(p) {\n    const r = rng(hash(p.id));\n")
i = s.index("    p.suppliers = [...new Set(p.lines.flatMap(l => l.pos.map(x => x.supplier)).filter(Boolean))];\n  });")
s = s[:i] + "    p.suppliers = [...new Set(p.lines.flatMap(l => l.pos.map(x => x.supplier)).filter(Boolean))];\n  }\n  PROJECTS.forEach(genLines);" + s[i + len("    p.suppliers = [...new Set(p.lines.flatMap(l => l.pos.map(x => x.supplier)).filter(Boolean))];\n  });"):]
rep("if (p.name2) p.city = p.city + ' ' + p.name2;", "if (p.name2 && !p.city.endsWith(' ' + p.name2)) p.city = p.city + ' ' + p.name2;")
rep("  PROJECTS.forEach(p => {\n    const r = rng(hash(p.id + 'uni'));\n", "  function genCostItems(p) {\n    const r = rng(hash(p.id + 'uni'));\n")
i = s.index("        COST_ITEMS.push({ project: p.id")
j = s.index("      }));\n    });\n  });", i)
s = s[:j] + "      }));\n    });\n  }\n  PROJECTS.forEach(genCostItems);" + s[j + len("      }));\n    });\n  });"):]
rep("window.DATA = { UNIVERS, COST_ITEMS,", "window.DATA = { genLines, genCostItems, UNIVERS, COST_ITEMS,")

# --- views
rep("  function myWork() {\n    const W = {", "  function myWork() {\n    if (window.Pano && Pano.work) return Pano.work();\n    const W = {")
rep("""<span class="due ${n <= 4 ? 'soon' : ''}">${n <= 0 ? 'Today' : n === 1 ? 'Tomorrow' : 'In ' + n + ' days'}</span></a></li>""",
    """<span class="due ${n <= 4 ? 'soon' : ''}">${n <= 0 ? 'Today' : n === 1 ? 'Tomorrow' : 'In ' + n + ' days'}</span></a>${w[5] ? `<button class="mw-x" data-act="${w[6] || 'mw-done'}" data-v="${esc(w[7] || w[5])}">${w[6] === 'amend-ok' ? 'Approve' : w[6] === 'confirm-block' ? 'Confirm' : 'Done'}</button>` : ''}</li>""")
rep("    const ago = n => n === 0 ? 'Synced today'", "    if (window.Pano) rows.forEach(x => { x[4] = Pano.age(p, x[0], x[4]); });\n    const ago = n => n === 0 ? 'Synced today'")
rep(""">Ask to confirm</button>`""", """>Ask to confirm</button> <button class="btn sm ghost" data-act="confirm-block" data-v="${p.id}|${x[0]}">Confirm</button>`""")
rep("""<p class="small muted" style="margin-top:12px">Rule: a block older""",
    """<div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap"><button class="btn sm" data-act="sheet-edit" data-v="${p.id}">Edit the project sheet</button><button class="btn sm ghost" data-act="open-tool" data-v="Upload documents">Upload documents</button><button class="btn sm ghost" data-act="req-update" data-v="Budget amendment">Request a budget amendment</button></div>
        <p class="small muted" style="margin-top:12px">Rule: a block older""")
rep("const age = p.id === '401111' ? 34 : 2 + Math.floor(r() * 12);", "let age = p.id === '401111' ? 34 : 2 + Math.floor(r() * 12); if (window.Pano) age = Pano.age(p, 'Project sheet', age);")
rep("""<button class="btn sm ghost" data-act="match" data-v="${n}">Confirm</button>""",
    """${window.Pano && Pano.invoices.has(n) ? '<span class="status s-ok">Matched</span>' : `<button class="btn sm ghost" data-act="match" data-v="${n}">Confirm</button>`}""")
rep("""<div><img src="${window.LOGO_URI}" alt=""><div class="t\"""", """<div>${window.LOGO_URI ? `<img src="${window.LOGO_URI}" alt="">` : ''}<div class="t\"""")

# --- shell
rep("    const v = b.dataset.v, act = b.dataset.act;\n    switch (act) {", "    const v = b.dataset.v, act = b.dataset.act;\n    if (window.Pano && Pano.handle(act, v, b)) return;\n    switch (act) {")
rep("""${d.img ? `<a class="doc-prev\"""", """${d.url ? `<p style="margin:14px 0 0"><a class="btn sm" href="${d.url}" target="_blank" rel="noopener">Open the file</a></p>` : ''}${d.img ? `<a class="doc-prev\"""")
rep("${audit.map(a => `<li", "${(window.Pano ? Pano.auditItems().concat(audit) : audit).slice(0, 10).map(a => `<li")
rep("    const out = understand(raw);\n", "    const out = understand(raw);\n    if (window.Pano && Pano.sampleReady) { clearInterval(typing); return Pano.askClaude(raw, body, resHTML(out.res), out.text); }\n")
rep("interactive mockup prepared by eleven", "working prototype prepared by eleven")
rep("· v0.3, 10 November 2026", "· v1.0, 11 November 2026")

# --- CSS, libraries, functional layer
rep("</style>", """
/* --- v1.0 app --- */
.mywork li{display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--line)}
.mywork li .row.mw{flex:1;min-width:0;border-bottom:0}
.mw-x{flex:none;height:30px;padding:0 12px;border-radius:999px;border:1px solid var(--line-2);background:var(--paper);color:var(--ink);font:500 12.5px var(--sans);cursor:pointer}
.mw-x:hover,.mw-x:focus-visible{border-color:var(--ink)}
.chip input{accent-color:#000}
</style>""", 1)
rep("<script>window.LOGO_URI=", '<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>\n<script>window.LOGO_URI=')
js = (HERE / 'pano.js').read_text(encoding='utf-8')
k = s.rindex("</body>")
s = s[:k] + "<script>\n" + js + "\n</script>\n" + s[k:]
open(P, 'w', encoding='utf-8').write(s); print('step5 ok')
