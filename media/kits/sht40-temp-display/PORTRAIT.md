# Mood Ring Thermometer (SHT40 Sensor Kit): portrait video (the default)

| | |
|---|---|
| Frame | **1080 x 1920**, 9:16 vertical |
| Length | 30 s, 30 fps, H.264 video + AAC audio |
| Made for | YouTube Shorts and other vertical feeds (phones, stories) |
| File | `~/Movies/sht40-temp-display-30s.mp4` (with sound), `~/Movies/sht40-temp-display-30s-silent.mp4` (picture only) |
| Source | `animation.html` rendered with `data-format="portrait"` (a 720 x 1280 stage at x1.5) |

This is the default version. Use it whenever a video must be vertical. The landscape twin is
described in [LANDSCAPE.md](LANDSCAPE.md); the story, timing and soundtrack are identical.

## 1. Build

```bash
media/kits/sht40-temp-display/build.sh --format portrait --preview   # about a minute: 360x640, 10 fps, proves the pipeline
media/kits/sht40-temp-display/build.sh --format portrait             # full quality, a few minutes (900 frames)
```

Plain `build.sh` builds both versions. The build prints the frame size, duration and loudness,
and ends with `OK: no rendered media inside <repo>`. Read those lines:

| Check | Pass |
|---|---|
| Frame | `1080x1920` |
| Duration | 30.0 s (+/- 0.1) |
| Integrated loudness | -16 to -12 LUFS |
| True peak | at or below -0.3 dBFS |

## 2. What the portrait layout does differently

The portrait video is **not** the landscape video cropped. The same page re-lays itself out
for a tall frame; the animation timeline is unchanged.

| Part | Portrait | Landscape |
|---|---|---|
| Caption | top third, left aligned, headline 52 px on up to two lines | top band, 44 px on one line |
| Camera | wide shot (whole kit), then a **mid shot** while wiring, then a close shot of the screen, then wide again | wide, then close on the screen, then wide |
| Callout tags | larger type (26 px), shorter wording where needed | 16 px |
| Mode pills | wrap to two rows | one row |
| Lab chips | wrap to two rows | one row |
| Progress bar | inside the safe box, above the bottom margin | bottom edge |

### Safe zone

Shorts draws its own interface over the picture: the status bar and header at the top, the
title / channel / subscribe at the bottom (roughly the bottom 20 %), and like / comment / share
down the right edge (roughly the right 12 %). YouTube does not publish an exact organic safe
zone and third-party figures disagree, so this recipe uses a conservative box:

| Edge | Keep clear | At 1080 x 1920 |
|---|---|---|
| Top | 165 stage px | 248 px |
| Bottom | 255 stage px | 382 px |
| Left | 40 stage px | 60 px |
| Right | 80 stage px | 120 px |

Captions, callout tags, the controls and the screen must sit inside the box. Check it:

```bash
T=$(mktemp -d)
python3 -I skills/video-of-kit-generator/scripts/render_frames.py media/kits/sht40-temp-display/animation.html \
  --out $T --format portrait --scale 1 --times 1.5,5,9.5,14,20,25,28,29
skills/video-of-kit-generator/scripts/contact_sheet.sh $T $T/sheet.png 4 --safe
```

Open `$T/sheet.png`. The yellow box is the safe zone. Nothing important may cross it.

## 3. Notes for this kit

**This kit (sht40-temp-display), portrait notes**

- Camera: wide 0-3 s (`translate(28px,448px) scale(.52)`, whole kit), mid 4-8 s (`translate(-6px,356px) scale(.78)`, Pico + 13 wires + SHT40 + button), close 9.2-26 s (`translate(-534px,354px) scale(.95)`, the round screen), wide again 27.4-30 s.
- Captions wrap to two lines: "Meet the Mood / Ring Thermometer", "13 wires: sensor, / screen, button", "Reads the air in / 8 ms, to 0.2 °C" (non-breaking spaces keep "8 ms" and "0.2 °C" together), "Tap the button / for six modes", "Feel the air. / See it in color."
- Short tag wordings: "Round screen" (landscape adds "· 240 x 240 dots"), "Power from 3V3" (landscape adds "· never VBUS").
- The "±0.2 °C · 8 ms" and "Tap: next mode" tags sit at rig (640, 520), under the screen at the close pose.
- Six mode pills wrap 4 + 2 (Classic Buddy Live Ring / Finger Hi/Lo); the nine lab chips fit one row.
- Screen faces are the kit's own PNGs from docs/kits/sht40-temp-display/ (hello-world, smartwatch-face, smartwatch-modes sprite), referenced by relative path, not copied.


## 4. Before you upload

- [ ] `ffprobe` says 1080x1920 and 30.0 s (the build printed it).
- [ ] You are about to upload `sht40-temp-display-30s.mp4`, not `-silent` and not `-landscape`.
- [ ] Open the file in QuickTime. The caption is readable, nothing sits in the yellow margins,
      and the last second fades out cleanly. (You, not Claude, have to listen: the soundtrack is
      synthesized and cannot be checked by ear from the build.)

## 5. Upload to YouTube as a Short

1. Open YouTube Studio (studio.youtube.com) and choose **Create > Upload videos**.
2. Pick `~/Movies/sht40-temp-display-30s.mp4`.
3. Title: lead with the kit name, then what it does. Description: link to the kit page in the
   book. Adding `#Shorts` to the title or description is common practice; it is not required, a
   vertical video of up to three minutes is treated as a Short.
4. Answer the **Made for kids** question. YouTube requires it on every upload and the choice is
   yours (it changes comments and personalization).
5. Choose visibility and **Save**. When processing finishes, the video appears under
   **Content > Shorts** in Studio and its address has the form `youtube.com/shorts/ID`.

To show it on the site, upload it to YouTube and embed by URL. Never copy the MP4 into `docs/`.
A vertical video needs a vertical frame or YouTube pillarboxes it:

```html
<iframe src="https://www.youtube.com/embed/VIDEO_ID" title="Mood Ring Thermometer (SHT40 Sensor Kit) in 30 seconds"
        style="aspect-ratio:9/16;width:min(100%,360px);border:0" allowfullscreen></iframe>
```

## 6. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| YouTube shows it as a normal video, not a Short | the frame is not vertical: `ffprobe` the file you uploaded; it must be `sht40-temp-display-30s.mp4` |
| Build warns "page is ... larger than the portrait frame" | `animation.html` has no portrait layout; add the PORTRAIT block (see `references/animation-guide.md`) |
| Caption or a tag hidden under the Shorts interface | it is outside the safe box; move it and recheck with `contact_sheet.sh --safe` |
| A tag is unreadable on a phone | raise `--tag-fs` in the portrait token block and re-place the tag |
| Headline leaves one word on its own line | shorten it or keep `text-wrap: balance` on `.head` |
| An old landscape file sits under the same name in `~/Movies` | before this recipe had two versions, `sht40-temp-display-30s.mp4` was landscape; rebuild to replace it |
