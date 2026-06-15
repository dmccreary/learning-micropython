---
title: IoT Data Flow Explorer
description: Students can trace the path of an HTTP GET request from the Pico W through the router to an API server and back as JSON.
image: /sims/iot-data-flow/iot-data-flow.png
og:image: /sims/iot-data-flow/iot-data-flow.png
twitter:image: /sims/iot-data-flow/iot-data-flow.png
social:
   cards: false
quality_score: 0
---

# IoT Data Flow Explorer

<iframe src="main.html" height="482" width="100%" scrolling="no"></iframe>

[Run the IoT Data Flow Explorer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit this MicroSim in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

Students can trace the path of an HTTP GET request from the Pico W through the router to an API server and back as JSON.

This interactive MicroSim supports a **Understand (L2)** learning objective: students
can **trace** the concept through hands-on exploration rather than passive
reading. It accompanies
[Chapter 19: Wireless Connectivity and Internet of Things](../../chapters/19-wireless-iot/index.md).

## How to Use

Use the controls below the drawing area to explore the simulation. Move the
sliders, press the buttons, and watch how the display changes. Try to predict
what will happen before you change a control, then check whether you were right.

## Embedding This MicroSim

You can add this MicroSim to any web page with the following HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/iot-data-flow/main.html"
        height="450px"
        width="100%"
        scrolling="no"></iframe>
```

## Specification

The full specification below was extracted from
[Chapter 19: Wireless Connectivity and Internet of Things](../../chapters/19-wireless-iot/index.md).

```text
Type: diagram
**sim-id:** iot-data-flow<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Understand (L2)
Bloom Verb: trace
Learning Objective: Students can trace the path of an HTTP GET request from the Pico W through the router to an API server and back as JSON.

Canvas layout:
- Left to right: Pico W icon → Router icon → Internet cloud → API server icon
- Below: response flow with JSON arrow returning
- Bottom panel: the request URL and JSON response side by side

Visual elements:
- Animated packet (moving dot) travels from Pico W to server and back
- Hovering over each hop reveals: "TCP port 80", "DNS lookup", "JSON parse"
- Status indicators: Wi-Fi strength bar on Pico W; HTTP status code on server

Interactive controls:
- "Send Request" button triggers the animation
- Input fields: "Latitude" and "Longitude" — updates the URL shown at the bottom
- Toggle: "GET (fetch data)" vs "POST (send data)"

Instructional Rationale: Animating the round trip from device to internet and back makes the abstract HTTP request cycle tangible for students who have only used web APIs as end users.

Implementation: p5.js. Animated circle moves along Bezier path from Pico to server; JSON response displayed in a monospace box at the bottom.
```

## Lesson Plan

### Grade Level
Ages 10-18 (primary audience: beginning makers and programmers)

### Duration
10-15 minutes

### Learning Objective
Students can trace the path of an HTTP GET request from the Pico W through the router to an API server and back as JSON.

- **Bloom Level:** Understand (L2)
- **Bloom Verb:** trace

### Activities

1. **Explore** (5 min): Open the MicroSim and try each control to see what it does.
2. **Predict & Test** (5 min): Before moving a control, predict the result, then test it.
3. **Connect to Code** (5 min): Relate what you see to the MicroPython code in the chapter.

### Assessment
Ask students to explain, in their own words, how changing each control affects
the outcome and how that maps to the MicroPython program.

## References

1. [Chapter 19: Wireless Connectivity and Internet of Things](../../chapters/19-wireless-iot/index.md) - the chapter this MicroSim supports.
2. [p5.js Reference](https://p5js.org/reference/) - documentation for the p5.js library used to build this MicroSim.
3. [MicroPython Documentation](https://docs.micropython.org/) - official MicroPython language and library reference.
