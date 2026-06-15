---
title: Piano Keyboard Tone Generator
description: Students can play notes on a virtual keyboard and observe the corresponding frequency values used in MicroPython code.
image: /sims/piano-tone-generator/piano-tone-generator.png
og:image: /sims/piano-tone-generator/piano-tone-generator.png
twitter:image: /sims/piano-tone-generator/piano-tone-generator.png
social:
   cards: false
quality_score: 0
---

# Piano Keyboard Tone Generator

<iframe src="main.html" height="452" width="100%" scrolling="no"></iframe>

[Run the Piano Keyboard Tone Generator MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can play notes on a virtual keyboard and observe the corresponding frequency values used in MicroPython code.

This interactive MicroSim supports a **Apply (L3)** learning objective: students
can **play** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 18: Sound, Music, and Audio Generation](../../chapters/18-sound-music-audio/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/piano-tone-generator/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 18: Sound, Music, and Audio Generation](../../chapters/18-sound-music-audio/index.md).

```text
Type: microsim
**sim-id:** piano-tone-generator<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Apply (L3)
Bloom Verb: play
Learning Objective: Students can play notes on a virtual keyboard and observe the corresponding frequency values used in MicroPython code.

Canvas layout:
- Center: an 8-key piano keyboard (C4 through C5) drawn with white and black keys
- Below: a frequency display showing the current note and Hz value
- Code panel: shows the `buzzer.freq(XXX)` line that would play the clicked note

Visual elements:
- White keys: C D E F G A B C
- Black keys: C# D# F# G# A#
- Active key highlighted yellow when clicked; oscilloscope waveform animates at the note's frequency

Interactive controls:
- Click a key to play the tone using the Web Audio API (oscillator node)
- Keyboard keyboard shortcuts: a-s-d-f-g-h-j-k for C-D-E-F-G-A-B-C

Instructional Rationale: Playing notes with visual and auditory feedback while seeing the frequency value and code builds the frequency→note→code connection that students need before writing melody programs.

Implementation: p5.js + Web Audio API. Each key click creates an OscillatorNode at the correct frequency; draws waveform animation using sin function.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can play notes on a virtual keyboard and observe the corresponding frequency values used in MicroPython code.

- **Bloom Level:** Apply (L3)
- **Bloom Verb:** play

### Activities

1. **Explore** (5 min): Open the MicroSim and try each control to see what it does.
2. **Predict & Test** (5 min): Before moving a control, predict the result, then test it.
3. **Connect to Code** (5 min): Relate what you see to the MicroPython code in the chapter.

### Assessment
Ask students to explain, in their own words, how changing each control affects
the outcome and how that maps to the MicroPython program.

## References

1. [Chapter 18: Sound, Music, and Audio Generation](../../chapters/18-sound-music-audio/index.md) - the chapter this MicroSim supports.
2. [p5.js Reference](https://p5js.org/reference/) - documentation for the p5.js library used to build this MicroSim.
3. [MicroPython Documentation](https://docs.micropython.org/) - official MicroPython language and library reference.
