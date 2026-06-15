# Cover Image Prompt — *Learning MicroPython*

This prompt was generated with the `book-installer` cover-image generator
(`generate-cover.sh` / `generate-cover-openai.py`, run in `--local-prompt`
mode) and then hand-tuned to add Monty the mascot, a centered title, and a
montage of the textbook's concepts behind the title.

- **Output target:** `docs/img/cover.png`
- **Dimensions:** 1200 × 630 px (1.91:1 — the Open Graph / social-preview standard)
- **Title:** Learning MicroPython (centered)
- **Mascot:** Monty in his **welcome** pose, **lower-left corner**
- **Source keywords (from the course description):** micropython, sensor,
  physical computing, Raspberry Pi Pico, displays, projects, light, robots
- **Color palette:** deep blue and teal background, white title text, warm
  emerald/lime mascot, subtle orange/amber accents

---

## Image Prompt (copy this into ChatGPT, GPT Image, DALL·E, Midjourney, etc.)

Please generate a new image, **1200 × 630 pixels (1.91:1 wide-landscape aspect
ratio)**, a modern, professional **book cover for *Learning MicroPython***, a
hands-on textbook that teaches kids and beginners to program microcontrollers
and build real electronics projects.

**Title (centered):** Place the title text **"Learning MicroPython"** large,
crisp, and high-contrast in the **horizontal and vertical center** of the
image, in clean modern white (or very light) sans-serif lettering with a soft
glow or subtle drop shadow so it stays perfectly readable on top of the
background. This is the **only** readable text in the image. Spell it exactly:
**Learning MicroPython**. No other words, no captions, no logos, no
watermarks, no trademarks, no garbled text.

**Background — a montage of physical-computing concepts behind the title:**
Fill the background with a tasteful, lightly-overlapping collage of the
elements students build with in this book, arranged around and behind the
title so they frame it rather than crowd it (keep the area directly behind the
title calmer and slightly darkened for legibility). Include recognizable
icon-style illustrations of:

- a green **Raspberry Pi Pico microcontroller board** with gold castellated edges
- a **solderless breadboard** with a few colorful jumper wires
- a glowing **LED** with a resistor, and a strip of rainbow **NeoPixel RGB lights**
- a small **OLED display** and a **7-segment / LED-matrix display** showing simple glowing digits
- a couple of **sensors** (an ultrasonic distance sensor, a temperature/humidity sensor)
- a **small wheeled robot** (line-follower / collision-avoidance style) with a tiny DC motor and servo
- a **buzzer with musical notes / sound waves**
- a **Wi-Fi / IoT wireless signal** radiating arcs to suggest networking
- faint floating snippets of **Python code** and circuit-trace lines weaving everything together

Render these as clean, modern, flat-vector tech illustrations with subtle
depth, soft glows, and circuit-board trace patterns connecting them — bright
and inviting, never cluttered or photorealistic.

**Mascot — Monty in the lower-left corner:** In the **lower-left corner**,
place **Monty the MicroPython Snake** in a friendly **welcome pose**. Monty is
a cheerful cartoon python with a compact rounded body and an oversized
expressive head, **bright emerald-green scales with lighter lime-green
markings and a cream-colored belly**. He wears **large round wire-rim
glasses** over big sparkling blue-green eyes and has a warm open smile. He has
two small rounded cartoon arms; **one arm is raised in a welcoming wave** (with
a couple of small sparkle/exclamation marks near his hand to show
enthusiasm). A small green **Raspberry Pi Pico badge** is attached to his upper
chest, and his tail curls into a neat spiral beside him. Draw him in a modern
flat-vector cartoon style with clean outlines that match a children's
educational mascot. Size Monty so he sits comfortably in the lower-left corner
without overlapping or obscuring the centered title.

**Color palette & mood:** Deep blue and teal gradient background, white title
text, warm emerald/lime green for Monty, with subtle orange/amber accent
highlights on the LEDs and sound waves. Overall feel: friendly, energetic,
modern, educational, and inviting to a 10–18-year-old maker. Clean, balanced,
and professional — a polished STEM/maker textbook cover.

**Style:** modern flat-vector tech illustration, high-quality digital art,
crisp edges, soft glows, professional educational textbook cover. Avoid:
photorealism, clutter, extra text, misspellings, logos, watermarks.

---

## Composition map (for reference)

```
+-------------------------------------------------------------+
|   montage: Pico · breadboard · sensors · Wi-Fi arcs         |
|   code snippets · circuit traces                            |
|                                                             |
|                 LEARNING  MICROPYTHON   <- centered title   |
|                                                             |
|  [ Monty 👋 ]      montage: NeoPixels · OLED · robot · buzzer|
|  (welcome pose,                                             |
|   lower-left)                                               |
+-------------------------------------------------------------+
```

## After generating

1. Save the result as `docs/img/cover.png`.
2. Confirm it is **1200 × 630 px** (crop/resize if the model returns a
   different size): `identify docs/img/cover.png`
3. Verify the title reads exactly **"Learning MicroPython"** with no stray text.
4. Wire it up for social previews with the `social-media-preview` book-installer
   feature (og:image / twitter:image), and reference it from `docs/index.md`.
