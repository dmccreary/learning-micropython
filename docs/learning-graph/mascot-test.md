---
title: Mascot Style Guide — Monty the MicroPython Snake
description: Rendering test for all seven Monty mascot admonition styles. Verifies float layout, image sizing, and color themes defined in docs/css/mascot.css.
---

# Mascot Style Guide

This page tests all seven **Monty** admonition styles defined in
[`docs/css/mascot.css`](../../css/mascot.css).

Each box below shows the admonition type, its color theme, the correct image
float, and the text wrapping to the right of the image.  If an image is
missing you will see a broken-image icon — check that `docs/img/mascot/` contains
the seven PNG files with transparent backgrounds.

!!! info "Image path note"
    This page lives at `learning-graph/mascot-test/index.html` after MkDocs
    builds it, so every mascot image path is `../../img/mascot/POSE.png`
    (two directory levels up to reach `docs/`).

---

## 1 · Welcome — chapter openings

!!! mascot-welcome "Welcome to This Chapter"
    ![Monty waves hello](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Hi there, coder! I'm **Monty**, your Python snake guide for this course.
    The welcome admonition opens every chapter with an encouraging preview of
    what's coming. The title bar is **emerald green** (`#2e7d32`).

---

## 2 · Thinking — key concepts and insights

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The thinking admonition highlights important concepts and "aha" moments.
    Use it when you want students to pause and make sure an idea has landed
    before moving on. Title bar is **warm brown** (`#5d4037`).

---

## 3 · Tip — hints and helpful guidance

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    The tip admonition shares practical shortcuts that experienced makers use
    but nobody writes down. Use it sparingly — zero to two per chapter.
    Title bar is **teal** (`#00838f`).

---

## 4 · Warning — common mistakes and pitfalls

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    The warning admonition flags the exact place where students commonly get
    tripped up. Always end the body with the specific mistake **and** how to
    avoid it. Title bar is **red** (`#c62828`).

---

## 5 · Encourage — difficult sections

!!! mascot-encourage "You Can Do This!"
    ![Monty encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    The encourage admonition appears before or during content that students
    often find hard. Normalise struggle: "This part is tricky for everyone —
    that's completely normal." Title bar is **blue** (`#0277bd`).

---

## 6 · Celebration — end of chapter / achievements

!!! mascot-celebration "Great Work, Maker!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    The celebration admonition closes every chapter. It uses a **dark purple
    body** (`#311b4f`) so that pale confetti sparkles on Monty's celebration
    pose remain visible. Always end with a call-forward to the next chapter.

---

## 7 · Neutral — general sidebars and notes

!!! mascot-neutral "A Note from Monty"
    ![Monty neutral pose](../../img/mascot/neutral.png){ class="mascot-admonition-img" }
    The neutral admonition is the catch-all for content that doesn't call for
    a specific emotional tone — administrative notes, asides, or introductions.
    Use it at most once per chapter. Title bar is **slate gray** (`#546e7a`).

---

## Image border diagnostic

The boxes below add a visible orange border around each `mascot-admonition-img`
element so you can confirm the float dimensions, margin, and object-fit
behaviour without relying on the actual image content.
Borders should not appear on the live site — they are toggled by the inline
`<style>` block on this page only.

<style>
/* diagnostic border — this page only */
.debug-border .mascot-admonition-img {
  outline: 2px dashed #ff6f00;
  background-color: rgba(255, 111, 0, 0.06);
}
</style>

<div class="debug-border" markdown="1">

!!! mascot-welcome "Welcome — border diagnostic"
    ![Monty waves hello](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    The dashed orange outline shows the exact bounding box of the image element.
    It should be a `90 × 90 px` square (or whatever `--mascot-size` is set to
    in `:root`). If the image appears much smaller than the box, run the trim
    script to remove excess transparent padding from the PNG:
    `python $BK_HOME/src/image-utils/trim-padding-from-image.py docs/img/mascot/welcome.png`

!!! mascot-tip "Tip — border diagnostic"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    The orange outline here lets you verify the `margin: 0 0.6em 0.2em 0`
    spacing between the image and the body text. The right margin creates the
    gap; the bottom margin ensures the image clears neatly above any wrapped
    second line.

</div>

---

## Placement rules quick reference

The table below summarises how often each admonition type should appear.

| Admonition type | Placement | Max per chapter |
|---|---|---|
| `mascot-welcome` | First element of chapter — always | 1 (required) |
| `mascot-thinking` | After introducing a key concept | 1–3 |
| `mascot-tip` | After explaining a technique | 0–2 |
| `mascot-warning` | Before or at a known pain point | 0–2 |
| `mascot-encourage` | Before a hard section | 0–2 |
| `mascot-celebration` | Last element of chapter — always | 1 (required) |
| `mascot-neutral` | General asides, anywhere | 0–1 |
| **Total** | | **≤ 6** |

**Hard rules:**

- Never place two mascot admonitions back-to-back. At least one paragraph of
  regular prose must separate any two Monty boxes.
- Admonition body text must be 1–3 sentences. Longer text defeats the purpose.
- Images go in the **body**, never in the title string. The title bar is clean
  text only.

## Markdown template

Copy and customise any of these snippets for your chapter content.

```markdown
!!! mascot-welcome "Welcome to Chapter N"
    ![Monty waves hello](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Opening text here. Let's build something amazing!

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    One key insight, 1–3 sentences.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    One practical tip, 1–3 sentences.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Specific mistake and how to avoid it, 1–3 sentences.

!!! mascot-encourage "You Can Do This!"
    ![Monty encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    Encouragement for a hard section, 1–3 sentences.

!!! mascot-celebration "Great Work, Maker!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Chapter wrap-up and call-forward to next chapter, 1–3 sentences.
```
