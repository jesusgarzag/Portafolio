import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OUT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT / "assets" / "certificados"


def build():
    OUT.mkdir(parents=True, exist_ok=True)
    src = (HERE / "cv.html").as_uri()
    ok = True
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 900, "height": 1200})
        for lang in ("es", "en"):
            page.goto(f"{src}?lang={lang}", wait_until="networkidle")
            page.wait_for_function("window.__cvReady === true", timeout=30000)
            overflow = page.evaluate("window.__cvOverflow")
            missing = page.evaluate("window.__cvFonts")
            pages = page.evaluate("document.querySelectorAll('.page').length")
            if missing:
                print("fuentes sin cargar:", ", ".join(missing))
            target = OUT / f"cv_{lang}.pdf"
            page.pdf(path=str(target), format="Letter", print_background=True, prefer_css_page_size=True, margin={"top": "0", "right": "0", "bottom": "0", "left": "0"})
            status = "ok" if max(overflow) <= 0 and pages == 2 and not missing else "revisar"
            ok = ok and status == "ok"
            print(f"{target.name}: {pages} páginas, desborde {overflow} px, {target.stat().st_size // 1024} KB · {status}")
        browser.close()
    return ok


if __name__ == "__main__":
    sys.exit(0 if build() else 1)
