"""Inline assets/ images into a single self-contained HTML. Author: Marie Guegain — eleven."""
import base64, mimetypes, pathlib, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
html = (ROOT / 'index.html').read_text(encoding='utf-8')
def uri(m):
    p = ROOT / m.group(0)
    if not p.exists(): return m.group(0)
    return f"data:{mimetypes.guess_type(p.name)[0]};base64," + base64.b64encode(p.read_bytes()).decode()
out = re.sub(r"assets/[\w\-.]+\.(?:png|jpe?g)", uri, html)
(ROOT / 'standalone').mkdir(exist_ok=True)
(ROOT / 'standalone' / 'Dior_Architecture_Panoptic_Mockup_v0.3.html').write_text(out, encoding='utf-8')
print(f'standalone: {len(out)/1024/1024:.1f} MB')
