---
title: Spectrum Analyzer Concept
description: Students can explain how an FFT converts a time-domain audio signal into a frequency-domain spectrum and identify what the bars in a spectrum analyzer represent.
image: /sims/spectrum-analyzer-concept/spectrum-analyzer-concept.png
og:image: /sims/spectrum-analyzer-concept/spectrum-analyzer-concept.png
twitter:image: /sims/spectrum-analyzer-concept/spectrum-analyzer-concept.png
social:
   cards: false
quality_score: 0
---

# Spectrum Analyzer Concept

<iframe src="main.html" height="537" width="100%" scrolling="no"></iframe>

[Run the Spectrum Analyzer Concept MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can explain how an FFT converts a time-domain audio signal into a frequency-domain spectrum and identify what the bars in a spectrum analyzer represent.

This interactive MicroSim supports a **Understand (L2)** learning objective: students
can **explain** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 11: Rotary Encoders, Touch Sensors, and Audio Input](../../chapters/11-encoders-touch-audio/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/spectrum-analyzer-concept/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 11: Rotary Encoders, Touch Sensors, and Audio Input](../../chapters/11-encoders-touch-audio/index.md).

```text
Type: diagram
**sim-id:** spectrum-analyzer-concept<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Understand (L2)
Bloom Verb: explain
Learning Objective: Students can explain how an FFT converts a time-domain audio signal into a frequency-domain spectrum and identify what the bars in a spectrum analyzer represent.

Canvas layout:
- Top half: a time-domain waveform display (like an oscilloscope)
- Bottom half: frequency-domain bar graph (spectrum analyzer display)

Visual elements:
- Top: a sine wave or composite waveform; a "Frequency" slider adds harmonics
- Bottom: color-coded bars (bass = red, mid = green, treble = blue) updating live
- Arrow from top to bottom labeled "FFT"

Interactive controls:
- createSlider() for adding a low-frequency component (50–200 Hz)
- createSlider() for adding a high-frequency component (2,000–8,000 Hz)
- createSlider() for "Noise" level (0–50%)
- Bars in the spectrum update to show the energy in each frequency band

Instructional Rationale: Seeing the waveform in the top half transform into bars in the bottom half with a labeled FFT arrow makes the abstract transform concrete — students see cause and effect directly.

Implementation: p5.js. Generate composite sine wave from slider values; compute analytical FFT bins from component frequencies; draw bars.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can explain how an FFT converts a time-domain audio signal into a frequency-domain spectrum and identify what the bars in a spectrum analyzer represent.

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** explain

### Activities

1. **Explore** (5 min): Open the MicroSim and try each control to see what it does.
2. **Predict & Test** (5 min): Before moving a control, predict the result, then test it.
3. **Connect to Code** (5 min): Relate what you see to the MicroPython code in the chapter.

### Assessment
Ask students to explain, in their own words, how changing each control affects
the outcome and how that maps to the MicroPython program.

## References

1. [Chapter 11: Rotary Encoders, Touch Sensors, and Audio Input](../../chapters/11-encoders-touch-audio/index.md) - the chapter this MicroSim supports.
2. [p5.js Reference](https://p5js.org/reference/) - documentation for the p5.js library used to build this MicroSim.
3. [MicroPython Documentation](https://docs.micropython.org/) - official MicroPython language and library reference.
