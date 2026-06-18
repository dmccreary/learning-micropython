# Interactive Infographic Overlay Plan

This document describes the design and implementation plan for converting the
24 static infographic poster pages into interactive MicroSims with hover zones,
click-to-reveal fact panels, and a built-in quiz mode.

## Problem

The 24 infographic posters are static PNG images embedded in flat markdown files.
There is no interactivity, no way for a student to drill into details, and no
mechanism for a teacher to assess whether a student understood the content.

## Solution

Each poster becomes a MicroSim-style page: the PNG infographic is the background
image, and a transparent HTML overlay catches hover and click events on meaningful
zones (columns for comparison grids, rows for table-style diagrams). A Quiz Me mode
lets students self-test against 3–5 questions per infographic.

## File Structure

Each poster is converted from a flat `.md` file to a subdirectory:

```
docs/posters/
  shared-libs/
    grid-diagram.js      ← rectangular zone overlay engine (vanilla JS)
    grid-overlay.css     ← styles for zones, detail panel, quiz UI
    diagram.js           ← point-marker engine (from interactive-infographic-overlay skill)
    style.css            ← styles for point-marker overlays
    main-template.html   ← copy-paste starting point for new posters
  {poster-slug}/
    index.md             ← converted from flat .md; includes <iframe src="main.html">
    main.html            ← interactive viewer
    data.json            ← zone definitions + quiz questions
    poster-image.png     ← the infographic PNG, living WITH the poster (self-contained)
```

**Each poster is fully self-contained.** Its infographic PNG lives inside the
poster directory alongside `main.html`/`data.json`, so the entire poster (markup +
data + image) can be copied into another textbook as a unit. `data.json` references
the image by bare filename (`"image": "poster-image.png"`).

The chapter that used to display the static PNG now **embeds the interactive
poster** instead — see [Chapter Embedding](#chapter-embedding). (The original PNG
copy left behind in `docs/chapters/.../` is still used by the thumbnail grid in
`posters/index.md`.)

## Two Overlay Modes

### Mode 1: Grid Overlay (most posters)

For comparison-table infographics where each column represents one technology.
`grid-diagram.js` draws transparent `<div>` rectangles over each column.

- **Hover**: subtle color highlight on the column (optional label chip via `showLabels`)
- **Click**: slide-in detail panel shows the facts list
- **Quiz Me**: question appears, student clicks the correct column. A **wrong**
  answer shakes red and lets them retry. A **correct** answer flashes green and
  pops a **"Correct!" celebration modal** — a gold star and a "Correct!" heading
  over the image — and the student clicks **OK** to advance to the next question.
  This explicit, click-to-continue feedback is core to the quiz experience.
- **Edit mode** (`?edit=true` URL param): draggable corner handles let the author
  calibrate zone coordinates against the actual image; Copy JSON button exports
  the calibrated `data.json`

Suited for: `python-vs-micropython`, `ides`, `microncontrollers`, `motor-types`,
`serial-protocols`, `sensors`, `motion-light-sensors`, `motor-drivers`, `led-types`,
`display-technologies`, `sound-output`, `wireless-technologies`, `memory-types`,
`electronic-components`, `input-devices`, `edge-ai`

### Mode 2: Point Overlay (complex layouts)

For posters with irregular layouts (pin maps, layered architecture diagrams).
Uses the existing `diagram.js` from the `interactive-infographic-overlay` skill
with numbered circular markers and callout labels.

Suited for: `gpio-functions` (row zones), `digital-vs-analog`, `communication-protocols`,
`robot-configurations`, `resistor-color-codes`, `micropython-errors`, `iot-architecture`

## data.json Schema (Grid Mode)

```json
{
  "title": "Poster Title",
  "image": "poster-image.png",
  "layout": "grid",
  "palette": ["#hex1", "#hex2"],
  "zones": [
    {
      "id": "unique-id",
      "label": "Column Label",
      "color": "#hex",
      "x1": 8, "y1": 12, "x2": 40, "y2": 94,
      "summary": "One-line summary shown under label",
      "facts": ["fact 1", "fact 2", "..."]
    }
  ],
  "quiz": [
    {
      "question": "Question text?",
      "correct_zone": "unique-id",
      "explanation": "Why this answer is correct."
    }
  ]
}
```

The top-level **`title`** is **not rendered as a visible heading** by the grid
engine (`grid-diagram.js`) — it is used only as the image `alt` text and in the
edit-mode JSON export. The visible poster title is the one printed in the image,
so keep `title` here for accessibility but never repeat it as a `# Title` H1 in
`index.md` (that was the original duplicate-title bug — see
[Display Guidelines](#display-guidelines)).

Zone coordinates (`x1, y1, x2, y2`) are percentages of the image dimensions.
Use `main.html?edit=true` to drag corner handles and calibrate against the real image.

Optional top-level flag **`"showLabels": true`** renders a small label chip at the
top of each zone on hover. It is **off by default** because the comparison
infographics already print the column titles in the image, and a chip would
overlap them. Only enable it for an image that has no built-in titles.

## index.md Template

```markdown
---
title: Poster Title
description: One-sentence summary for SEO and social previews (no colons).
image: /posters/poster-slug/poster-image.png
og:image: /posters/poster-slug/poster-image.png
twitter:image: /posters/poster-slug/poster-image.png
social:
   cards: false
hide:
    toc
---

Audience: ...
Chapter: N — Chapter Name

<iframe src="main.html" width="100%" height="800" scrolling="no"></iframe>

## About This Infographic

[1–2 sentences describing what the infographic compares.]

## Image Prompt

!!! prompt
    [original image generation prompt, preserved verbatim]
```

**Frontmatter conventions** (match the rest of the site — see any `docs/sims/*/index.md`):

- `title` / `description` — set the page `<title>`, meta description, and og/twitter
  titles+descriptions. Keep `description` to one sentence with **no colons**
  (or quote the whole value); quote any `title` that contains a colon.
- `image` — the social-preview image, given as a **site-root-absolute path** to the
  poster's own PNG inside its directory (e.g. `/posters/led-types/led-types-infographic.png`).
  The `plugins/social_override.py` hook rewrites it to an absolute
  `site_url + image` URL for `og:image` / `twitter:image`, so social cards show the
  actual infographic. `og:image` / `twitter:image` are included to match house style.
- `social: { cards: false }` — opt out of the auto-generated social card since the
  poster supplies its own image.
- `hide: toc` — hides the right-hand table-of-contents sidebar so the infographic
  uses the full content width. The no-dash form shown here is what the rest of the
  repo uses and is verified to work — don't "correct" it to a `- toc` list.

## Display Guidelines

These rules apply to **every** poster — keep them consistent across all 24.

!!! tip "⭐ Automatic iframe height resize — the favorite feature, never remove it!"
    The most-loved behavior of these posters is that the iframe **resizes itself
    to fit its content automatically.** As a student clicks a column (taller facts
    panel) or runs the quiz (question → answers → score → "Try Again"), the iframe
    grows and shrinks so everything is visible — **no scrollbar, no clipping, no
    dead space** — at any window width.

    Two pieces make this work, and **both must stay in place**:

    1. `grid-diagram.js` → `_reportHeight()` posts a `microsim-resize` message on
       load, on every content change, and on window resize (via `ResizeObserver`).
    2. The `message` listener in `docs/js/extra.js` resizes the matching iframe to
       that reported height.

    Never "fix" a height problem by hard-coding a tall iframe — that brings back
    either clipping (with `scrolling="no"`) or scrollbars and dead space. When you
    add a new poster you do **nothing special**: the shared engine + listener give
    you the resize for free.

**Iframe markup** — identical for every poster (matches all other MicroSims on the site):

```html
<iframe src="main.html" width="100%" height="800" scrolling="no"></iframe>
```

- `width="100%"` — fills the content column responsively.
- `scrolling="no"` — no inner scrollbar; the auto-resize guarantees a perfect fit.
- **No** inline border style — `docs/css/extra.css` styles **all** iframes
  sitewide, so every poster inherits the shared border automatically:

    ```css
    /* Iframe styles all should have a solid blue border that is 2px wide */
    iframe {
      width: 100%;
      border: solid 2px blue;
    }
    ```

    Putting `style="border:none"` (or any inline border) on a poster iframe would
    override this shared rule and make that poster look different from the rest of
    the site — so keep inline styles off the iframe.
- `height="800"` is **only a pre-JS fallback**; the listener overrides it on load.

**Page title** — the infographic image already prints the poster title across the
top, so the `index.md` body **omits the `# Title` H1** to avoid showing it twice.
The title still lives in the frontmatter `title:` (page `<title>`, nav label, and
social cards) and in `data.json` `title` (image `alt` text + edit-mode export).

**Column titles** — leave `"showLabels": false` (the default) whenever the image
already prints its column titles, so the hover chip never overlaps them.

**Controls placement** — the Explore / Quiz Me buttons sit **below** the image, so
they never cover the infographic.

## Chapter Embedding

A chapter that used to show a poster as a static `![](image.png)` now embeds the
**interactive** poster with an iframe pointing at the poster's `main.html`:

```html
<iframe src="../../posters/{poster-slug}/main.html" width="100%" height="800" scrolling="no"></iframe>
```

- The `../../` climbs from `docs/chapters/{chapter}/` up to `docs/` and back down
  into `posters/{slug}/` (works with mkdocs `use_directory_urls`).
- Same iframe convention as the poster page (no inline border, `scrolling="no"`),
  and the auto-resize listener in `docs/js/extra.js` is sitewide, so the embed
  resizes to fit on the chapter page too — even though the chapter keeps its TOC
  sidebar and therefore has a narrower content column.
- Not every poster has a chapter embed: a poster only replaces a chapter image if
  the chapter actually displayed one. (At conversion time `wireless-technologies`
  and `display-technologies` had no inline chapter image, so no chapter embed was
  added for them.)

## MkDocs Configuration

- Each converted poster changes from `posters/slug.md` → `posters/slug/index.md` in `mkdocs.yml`
- **Do NOT exclude the whole `posters/shared-libs/` directory.** `exclude_docs`
  removes files from the build entirely — if you exclude the directory, the
  `grid-diagram.js` / `grid-overlay.css` assets are never copied to the site and
  every interactive poster renders as an unstyled, image-less form (404 on the
  CSS/JS). mkdocs copies non-Markdown files (`.js`, `.css`, `.json`, `.html`) as
  static assets automatically and does **not** treat them as nav pages, so they
  just need to be left in place. Only exclude the dev-only template:

  ```yaml
  exclude_docs: |
    posters/shared-libs/main-template.html
  ```

!!! warning "Verify against the built site, not the raw docs folder"
    Serving `docs/` directly with `python -m http.server` will serve every file
    and hide an `exclude_docs` mistake. Always confirm interactive posters with
    `mkdocs build` output (or `mkdocs serve`), where excluded assets are actually
    missing.

## Implementation Progress

### Phase 1 — Infrastructure ✓
- [x] `shared-libs/grid-diagram.js` — grid zone overlay engine
- [x] `shared-libs/grid-overlay.css` — styles
- [x] `shared-libs/diagram.js` — point-marker engine (copied from skill)
- [x] `shared-libs/style.css` — point-marker styles (copied from skill)
- [x] `shared-libs/main-template.html` — HTML template
- [x] `mkdocs.yml` — `exclude_docs` set to exclude ONLY `main-template.html` (see MkDocs Configuration)

### Phase 2 — Pilot Posters ✓
- [x] `serial-protocols/` — 3-column grid (UART, 1-Wire, I2S — see Accuracy Notes), 5 quiz questions
- [x] `python-vs-micropython/` — 2-column grid, 4 quiz questions
- [x] `gpio-functions/` — 7 row zones (one per GPIO function type), 5 quiz questions

### Phase 2b — Test Cases ✓
Four additional posters built and verified to exercise each grid shape:
- [x] `motor-types/` — 3-column grid (DC, Servo, Stepper), 5 quiz questions
- [x] `led-types/` — 4-column grid (Single, RGB, NeoPixel, Matrix), 5 quiz questions
- [x] `wireless-technologies/` — 4-column grid (WiFi, BLE, LoRa, Zigbee), 5 quiz questions
- [x] `display-technologies/` — 3-column grid (OLED, TFT, ePaper), 5 quiz questions

Zone coordinates for these four were calibrated by reading the actual PNG images
(all 1536×1024) and measuring each column's edges, rather than guessing — so they
land within a few percent and only need minor `?edit=true` fine-tuning if at all.

### Phase 3 — Remaining 17 Posters
Follow the same pattern for each remaining flat `.md` file:
1. `mkdir docs/posters/{slug}/`
2. Write `data.json` with zones calibrated to the image + 3–5 quiz questions
3. Copy `main.html` from `shared-libs/main-template.html`, set title
4. Convert flat `.md` to `index.md` with iframe embed
5. Update nav entry in `mkdocs.yml`
6. Open `main.html?edit=true` in browser and drag corners to calibrate zones
7. Paste calibrated JSON back into `data.json`

Remaining posters: `ides`, `microncontrollers`, `electronic-components`,
`resistor-color-codes`, `digital-vs-analog`, `communication-protocols`, `sensors`,
`motion-light-sensors`, `motor-drivers`, `robot-configurations`, `sound-output`,
`iot-architecture`, `memory-types`, `micropython-errors`, `input-devices`, `edge-ai`

## Accuracy Notes (from plan review)

- **serial-protocols image vs. content**: The page was originally titled "I2C vs.
  SPI vs. UART", but the image it embeds
  (`specialized-communication-protocols-infographic.png`) actually shows **UART ·
  1-Wire · I2S**. There is no single rendered image showing I2C/SPI/UART together.
  The page has been retitled to "Specialized Serial Protocols: UART · 1-Wire · I2S"
  and the overlay zones now match the real image. The I2C/SPI comparison lives in
  the separate `communication-protocols-infographic.png` (I2C vs SPI, 2 columns),
  which the `communication-protocols/` poster will use when converted.
- **led-types.md was missing its image line**: the original flat file had no
  `![](...)` reference (only the index thumbnail did). The converted
  `led-types/index.md` embeds the interactive `main.html`, so this is resolved.
- When converting `communication-protocols/`, use a **2-column** grid (I2C, SPI)
  to match its actual image — not 3 columns.

## Calibration Workflow

After generating a poster's `main.html` and `data.json`:

1. Open `docs/posters/{slug}/main.html?edit=true` in a browser (or via `mkdocs serve`)
2. Orange corner handles appear on each zone rectangle
3. Drag the handles until each rectangle precisely covers its column/row
4. Click **Copy JSON** — the calibrated coordinates are in your clipboard
5. Paste into `data.json`, replacing the `zones` array coordinates
6. Reload `main.html` (without `?edit=true`) to verify the zones look correct

## Verification Checklist

- [ ] Zones highlight on hover in Explore mode
- [ ] Click panel shows label, summary, and facts list
- [ ] Quiz Me shows questions one at a time, tracks score
- [ ] Wrong answer: red shake, retry same question (no modal)
- [ ] Correct answer: green flash + "Correct!" modal with gold star; **OK** advances to next question
- [ ] Quiz complete: shows score and Try Again button
- [ ] Confetti fires on quiz completion
- [ ] `mkdocs serve` builds with no errors
- [ ] ⭐ iframe auto-resizes to fit content in **every** state — prompt, facts
      panel (tallest), quiz question, and quiz-complete — with **no scrollbar, no
      clipping, and no dead space** (the favorite feature)
- [ ] iframe uses `scrolling="no"`, `width="100%"`, and **no** inline border style
- [ ] Column-title hover chips do not overlap titles already in the image (`showLabels` off)
- [ ] Mobile viewport (375px wide) — zones and panel still usable
