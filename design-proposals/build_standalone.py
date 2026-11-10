"""Bundle each design proposal into a single self-contained HTML file.

Inlines data.js, vendor/three.min.js and every local image (as data: URIs)
so a proposal can be opened with a double-click or sent by e-mail.
Author: Marie Guegain — eleven

Usage: python3 build_standalone.py   ->  writes standalone/<name>.html
"""
import base64
import mimetypes
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent
OUT = ROOT / "standalone"
PAGES = ["a-montaigne.html", "b-nuit.html", "c-cannage.html", "d-atelier.html", "e-studio.html"]


def data_uri(rel: str) -> str:
    path = ROOT / rel
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


def inline_scripts(html: str) -> str:
    def repl(m):
        src = m.group(1)
        if src.startswith(("http:", "https:")):
            return m.group(0)
        code = (ROOT / src).read_text(encoding="utf-8")
        return "<script>\n" + code.replace("</script", "<\\/script") + "\n</script>"
    return re.sub(r'<script\s+src="([^"]+)"\s*>\s*</script>', repl, html)


def inline_assets(text: str) -> str:
    def repl(m):
        rel = m.group(0)
        return data_uri(rel) if (ROOT / rel).exists() else rel
    return re.sub(r"assets/[\w\-.]+\.(?:png|jpe?g|svg|webp)", repl, text)


def main():
    OUT.mkdir(exist_ok=True)
    for name in PAGES:
        src = ROOT / name
        if not src.exists():
            print("skip (missing)", name)
            continue
        html = inline_assets(inline_scripts(src.read_text(encoding="utf-8")))
        (OUT / name).write_text(html, encoding="utf-8")
        print(f"{name}: {len(html) / 1024:.0f} KB")


if __name__ == "__main__":
    main()
