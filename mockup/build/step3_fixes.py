"""Step 3 — coverage tags, version, small fixes. Author: Marie Guegain — eleven."""
import sys
P = sys.argv[1]; s = open(P, encoding='utf-8').read()
def rep(a, b):
    global s
    assert a in s, 'MISSING: ' + a[:90]; s = s.replace(a, b, 1)
rep("· v0.1, 9 November 2026", "· v0.2, 10 November 2026")
rep("const SHOWN = new Set(['1.3',", "const SHOWN = new Set(['5.7', '7.1.5', '7.7.9', '7.8.5', '7.8.6', '7.9.9', '1.3',")
rep("Faceted and full-text search ${req('7.5.2', '7.5.4', '5.6')}", "Faceted and full-text search across the archive ${req('7.5.2', '7.5.4', '5.6', '7.8.6')}")
rep("archived automatically at award`, req('3.9', '7.6.3')", "archived automatically at award`, req('3.9', '7.6.3', '7.8.5')")
rep("linked to ARC-${p.id}.${t.line}`, req('3.3', '2.4')", "linked to ARC-${p.id}.${t.line}`, req('3.3', '2.4', '1.3')")
# navigation follows the revised priorities: cost and tenders first, design library later
rep("const NAV = [['#/projects', 'Projects'], ['#/assets', 'Assets'], ['#/cost', 'Cost control'], ['#/tenders', 'Tenders'], ['#/suppliers', 'Suppliers'], ['#/library', 'Design library'], ['#/platform', 'Platform']];",
    "const NAV = [['#/projects', 'Projects'], ['#/cost', 'Cost control'], ['#/tenders', 'Tenders'], ['#/suppliers', 'Suppliers'], ['#/assets', 'Assets'], ['#/library', 'Design library'], ['#/platform', 'Platform']];")
open(P, 'w', encoding='utf-8').write(s); print('step3 ok')
