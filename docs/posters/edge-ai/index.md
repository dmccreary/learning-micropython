---
title: Edge AI on Microcontrollers
description: An interactive comparison of three ways to run machine learning on tiny hardware — MicroPython with ulab, TensorFlow Lite Micro, and Edge Impulse — with a built-in quiz.
image: /posters/edge-ai/edge-ai-software-stack.png
og:image: /posters/edge-ai/edge-ai-software-stack.png
twitter:image: /posters/edge-ai/edge-ai-software-stack.png
social:
   cards: false
hide:
    toc
---

Audience: advanced students exploring machine learning on tiny hardware.
Chapter: 22 — Advanced Hardware & AI

<iframe src="main.html" width="100%" height="800" scrolling="no"></iframe>

## About This Infographic

Compares three approaches to running machine learning models on microcontrollers: pure-Python inference with MicroPython and ulab, on-device neural networks with TensorFlow Lite Micro, and the end-to-end Edge Impulse platform. Click each column to see frameworks, model formats, speeds, and memory needs, then use Quiz Me to test which approach fits a given task.

## Image Prompt

!!! prompt
    Please generate a wide-landscape infographic.

    Render all text exactly verbatim. Do not substitute any numbers, paraphrase labels, or invent extra rows/columns/stats. Where a cell says "None" or "N/A", render that exactly.

    A clean, modern, flat-design educational comparison infographic poster, landscape 16:9, titled at the top in large bold sans-serif: "Edge AI on Microcontrollers", subtitle beneath: "Running machine learning models on tiny hardware — three approaches compared."

    Layout: a three-column comparison table on a light off-white background (#F7F9FC). Each column is a rounded-corner card with a distinct accent color on its top edge and a simple logo / icon at the top. A vertical row-label strip on the far left lists the nine attributes. Generous white space, thin divider lines, friendly textbook feel.

    Column 1 (deep purple #6A3FB5): Header "MicroPython + NumPy-style"; Sub-header "Pure Python inference"; Icon: Python snake logo outline in purple. Rows:
    · Framework: ulab (MicroPython extension — numpy-style arrays)
    · Supported boards: RP2040 (Pico), RP2350 (Pico 2), ESP32 (with ulab firmware)
    · Model format: Custom Python code — implement your own kNN, decision tree, or linear regression
    · Typical model size: < 10 KB (hand-coded logic; no neural net runtime)
    · Inference speed: Moderate — pure Python array math; ~10–100 ms per prediction
    · Training: On a PC using scikit-learn or similar; export weights as Python lists
    · Memory needed: Fits in 264 KB RAM (keep models simple)
    · MicroPython: import ulab.numpy as np; then matrix math for inference
    · Best for: Simple classifiers (kNN, linear regression); first ML experiments

    Column 2 (teal blue #1389A6): Header "TensorFlow Lite Micro"; Sub-header "On-device neural networks"; Icon: TensorFlow logo (stylized T) in teal. Rows:
    · Framework: TensorFlow Lite for Microcontrollers (TFLite Micro)
    · Supported boards: RP2040, RP2350 (via C/C++ port); ESP32 (with Arduino or IDF)
    · Model format: .tflite flatbuffer model file — quantized INT8 preferred for small RAM
    · Typical model size: 10–200 KB (quantized; full float models are larger)
    · Inference speed: Fast — C++ runtime; ~1–50 ms per image classification frame
    · Training: Google Colab or local PC using TensorFlow + Keras; export as .tflite
    · Memory needed: ~64–512 KB RAM for typical small models
    · MicroPython: Not native — requires MicroPython with C extension or Arduino build
    · Best for: Keyword spotting, gesture recognition, small image classification

    Column 3 (raspberry red #C7164E): Header "Edge Impulse"; Sub-header "End-to-end ML platform"; Icon: Edge Impulse stylized "E" circuit-board logo in red. Rows:
    · Framework: Edge Impulse cloud platform + generated C++ library or Arduino library
    · Supported boards: Pico, ESP32, Arduino Nano 33 BLE Sense, many more (web-based)
    · Model format: Edge Impulse exports a C++ library (.zip) optimized for your board
    · Typical model size: 5–100 KB (optimized and quantized automatically by platform)
    · Inference speed: Very fast — CMSIS-NN optimized for ARM Cortex-M; < 10 ms typical
    · Training: Upload data on edgeimpulse.com; train in browser; auto-deploys to board
    · Memory needed: Board profiler shows exact RAM/Flash usage before you deploy
    · MicroPython: Export Arduino sketch or C++ library; integrate via serial or direct port
    · Best for: Audio classification, anomaly detection, motion recognition — with guided workflow

    Below the three columns, a note banner spanning all three (dark slate #2A2E3A background, white text): "Key rule: start simple (MicroPython + ulab) → add TFLite Micro if you need a neural net → use Edge Impulse if you want a complete no-code ML pipeline."

    Typography: one clean geometric sans-serif (Inter/Roboto style), bold column headers, monospace for code snippets and file extensions, numbers bold. Footer bar: "Sources: TensorFlow Lite Micro documentation (tensorflow.org) · Edge Impulse documentation (docs.edgeimpulse.com) · ulab documentation (micropython-ulab.readthedocs.io) — verified June 2026." Overall: tidy vector flat-design infographic poster, three-column grid with framework icons, suitable for a textbook or classroom screen.
