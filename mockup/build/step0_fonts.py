"""Step 0 — readable typography: Figtree for UI and figures, Bodoni Moda kept for display titles.
Author: Marie Guegain — eleven. Usage: step0_fonts.py original.html index.html"""
import re, sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
def rep(a, b):
    global s
    assert a in s, 'MISSING: ' + a[:90]; s = s.replace(a, b)
rep('family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Jost:wght@400;500;600',
    'family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Figtree:ital,wght@0,400;0,500;0,600;0,700;1,400')
rep('--serif:"Bodoni Moda","Didot","Bodoni 72","Bodoni MT",Georgia,serif;\n  --sans:"Jost","Futura","Avenir Next","Century Gothic",system-ui,sans-serif;',
    '--display:"Bodoni Moda","Didot","Bodoni 72","Bodoni MT",Georgia,serif;\n  --serif:"Figtree","Inter","Segoe UI",system-ui,sans-serif;\n  --sans:"Figtree","Inter","Segoe UI",system-ui,sans-serif;')
for a, b in [('.page-head h1{font:400 clamp(34px,4.4vw,56px)/1 var(--serif)', '.page-head h1{font:400 clamp(34px,4.4vw,56px)/1.02 var(--display)'),
             ('.display{font:400 clamp(40px,4.6vw,66px)/1.02 var(--serif)', '.display{font:400 clamp(40px,4.6vw,66px)/1.04 var(--display)'),
             ('.brand .prod span{font:italic 400 13px/1.2 var(--serif)', '.brand .prod span{font:italic 400 13px/1.2 var(--display)'),
             ('.pav-top span{font:italic 400 12px/1.15 var(--serif)', '.pav-top span{font:italic 400 12px/1.15 var(--display)'),
             ('.district{font:italic 400 30px var(--serif)', '.district{font:italic 400 30px var(--display)'),
             ('style="font:italic 400 15px var(--serif);fill:var(--grey)"', 'style="font:italic 400 15px var(--display);fill:var(--grey)"'),
             ('.modal h2{font:400 30px var(--serif)', '.modal h2{font:400 30px var(--display)')]:
    rep(a, b)
s = re.sub(r'font:400 (\d+(?:\.\d+)?px|clamp\([^)]*\))(/[\d.]+ | )var\(--serif\)', lambda m: f'font:600 {m.group(1)}{m.group(2)}var(--serif)', s)
rep('.kpi .k-v{font:600 clamp(30px,3vw,42px)/1.05 var(--serif);margin:8px 0 6px;letter-spacing:-.01em}', '.kpi .k-v{font:600 clamp(28px,2.6vw,36px)/1.1 var(--serif);margin:8px 0 6px;letter-spacing:-.02em}')
rep('body{margin:0;background:var(--paper);color:var(--ink);font:400 14.5px/1.5 var(--sans);letter-spacing:.005em;', 'body{margin:0;background:var(--paper);color:var(--ink);font:400 15px/1.55 var(--sans);letter-spacing:0;')
rep('.nav a{font:500 11px/1 var(--sans);letter-spacing:.11em;text-transform:uppercase;', '.nav a{font:500 14px/1 var(--sans);letter-spacing:0;')
s = s.replace('font:600 26px/1.1 var(--serif)', 'font:600 22px/1.2 var(--serif);letter-spacing:-.01em')
s = s.replace('font:600 28px/1.1 var(--serif)', 'font:600 24px/1.2 var(--serif);letter-spacing:-.01em', 1)
s = s.replace('font:600 22px/1.1 var(--serif)', 'font:600 19px/1.2 var(--serif)', 1)
open(dst, 'w', encoding='utf-8').write(s); print('step0 ok')
