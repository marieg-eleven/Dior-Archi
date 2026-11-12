"""Build the self-contained files of the working app. Author: Marie Guegain — eleven.
- standalone/Architecture_Panoptic_v2.1.html : full page, client branding, saves in the browser.
- ../app/panoptic.html : artifact page (no document wrapper, no client logo), saves in the artifact's shared store."""
import base64, mimetypes, pathlib, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
html = (ROOT / 'index.html').read_text(encoding='utf-8')
def uri(m):
    p = ROOT / m.group(0)
    return f"data:{mimetypes.guess_type(p.name)[0]};base64," + base64.b64encode(p.read_bytes()).decode() if p.exists() else m.group(0)
full = re.sub(r"assets/[\w\-.]+\.(?:png|jpe?g)", uri, html)
(ROOT / 'standalone').mkdir(exist_ok=True)
for old in (ROOT / 'standalone').glob('*.html'): old.unlink()
(ROOT / 'standalone' / 'Architecture_Panoptic_v2.1.html').write_text(full, encoding='utf-8')

art = full
art = re.sub(r'<script>window\.LOGO_URI="[^"]*";</script>', '<script>window.LOGO_URI="";</script>', art)
art = art.replace('<img src="${window.LOGO_URI}" alt="Dior"><span class="sep"></span>', '')
head = re.search(r'<head>(.*?)</head>', art, re.S).group(1)
head = re.sub(r'<meta charset="[^"]*">\s*', '', head)
head = re.sub(r'<meta name="viewport"[^>]*>\s*', '', head)
head = re.sub(r'<meta name="description"[^>]*>', '<meta name="description" content="Architecture Panoptic: working prototype of the project, cost and tender platform. Prepared by eleven.">', head)
title = re.search(r'<title>.*?</title>', head, re.S).group(0)
head = head.replace(title, '')
body = re.search(r'<body[^>]*>(.*)</body>', art, re.S).group(1)
out = title + '\n' + head.strip() + '\n' + body.strip() + '\n'
app = ROOT.parent / 'app'; app.mkdir(exist_ok=True)
(app / 'panoptic.html').write_text(out, encoding='utf-8')
print(f'standalone {len(full)/1e6:.1f} MB · artifact {len(out)/1e6:.1f} MB')
