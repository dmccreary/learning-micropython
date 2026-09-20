#!/usr/bin/env python3
"""Render poster.html to the poster PNG and sync the click-zone rectangles.

Usage:  python3 src/posters/temperature-sensors-v2/build.py

What it does
  1. Loads poster.html in headless Chrome at 2400 px wide.
  2. Saves the full-page screenshot to
     docs/posters/temperature-sensors-v2/temperature-sensors-v2-infographic.png
  3. Measures each <section class="card" data-id="..."> box and writes it into the
     matching zone of docs/posters/temperature-sensors-v2/data.json as percentages
     (x1, y1, x2, y2), so the overlay always lines up with the picture. No manual
     calibration with ?edit=true is needed after editing the poster text.

Needs:  pip install playwright   (uses your installed Google Chrome, no extra download)
The SHT40 picture is a cut-out of docs/kits/sht40-temp/sht40-front.jpg, stored in
assets/sht40.png.  The other three pictures were cropped from the v1 poster image.
"""
import io
import json
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
POSTER_DIR = ROOT / "docs" / "posters" / "temperature-sensors-v2"
OUT_PNG = POSTER_DIR / "temperature-sensors-v2-infographic.png"
DATA_JSON = POSTER_DIR / "data.json"
WIDTH = 2400


def render():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome")
        page = browser.new_page(viewport={"width": WIDTH, "height": 1000}, device_scale_factor=1)
        page.goto((HERE / "poster.html").as_uri())
        page.wait_for_load_state("load")
        page.evaluate("document.fonts.ready")
        height = page.evaluate("Math.ceil(document.documentElement.scrollHeight)")
        cards = page.evaluate(
            """[...document.querySelectorAll('.card')].map(c => {
                 const r = c.getBoundingClientRect();
                 return {id: c.dataset.id, x: r.left, y: r.top + window.scrollY, w: r.width, h: r.height};
               })"""
        )
        # Chrome's single-shot full-page capture repeats the top of the page when the page is
        # taller than ~2300 px, so grab the page in viewport-sized strips and stitch them.
        strip = 1000
        sheet = Image.new("RGB", (WIDTH, height), "white")
        y = 0
        while y < height:
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(80)
            top = page.evaluate("Math.round(window.scrollY)")  # last strip is clamped to the page end
            shot = Image.open(io.BytesIO(page.screenshot()))
            sheet.paste(shot.convert("RGB"), (0, top))
            y += strip
        POSTER_DIR.mkdir(parents=True, exist_ok=True)
        sheet.save(OUT_PNG, optimize=True)
        browser.close()
    return WIDTH, height, cards


def sync_zones(width, height, cards):
    data = json.loads(DATA_JSON.read_text())
    boxes = {c["id"]: c for c in cards}
    for zone in data["zones"]:
        c = boxes[zone["id"]]
        zone["x1"] = round(c["x"] / width * 100, 1)
        zone["y1"] = round(c["y"] / height * 100, 1)
        zone["x2"] = round((c["x"] + c["w"]) / width * 100, 1)
        zone["y2"] = round((c["y"] + c["h"]) / height * 100, 1)
    DATA_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    w, h, cards = render()
    print(f"Rendered {OUT_PNG.relative_to(ROOT)}  ({w} x {h} px)")
    if DATA_JSON.exists():
        sync_zones(w, h, cards)
        print(f"Updated zone rectangles in {DATA_JSON.relative_to(ROOT)}")
    else:
        print("data.json not found - zones not written")
