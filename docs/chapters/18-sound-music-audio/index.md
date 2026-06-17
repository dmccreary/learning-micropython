---
title: Sound, Music, and Audio Generation
description: Passive and active buzzers, PWM tone generation, musical note frequencies, playing scales and melodies, DAC, I2S audio, MIDI protocol, amplifiers, and speaker wiring.
generated_by: claude skill chapter-content-generator
date: 2026-06-13 00:30:00
version: 0.09
---

# Sound, Music, and Audio Generation

## Summary

Making your projects beep, sing, and play music is one of the most satisfying things you can do with a microcontroller. This chapter starts with the simplest sound maker — a passive buzzer driven by PWM — and builds up through tone generation, musical note frequencies, scales, and complete melodies including the Super Mario theme. You will also learn about the digital-to-analog converter (DAC) for smoother audio output, the I2S protocol for connecting external audio hardware, the MIDI standard for music data, and how to wire an audio amplifier and speaker for louder sound.

## Concepts Covered

This chapter covers the following 15 concepts from the learning graph:

1. Passive Buzzer
2. Active Buzzer
3. Tone Generation
4. Musical Note Frequencies
5. Play a Scale
6. Play a Melody
7. Mario Theme Program
8. Eight-Key Piano Program
9. I2S for Audio
10. I2S Standard
11. DAC (Digital-to-Analog Converter)
12. MIDI Protocol
13. Sound Parts List
14. Audio Amplifier
15. Speaker Wiring

## Prerequisites

This chapter builds on concepts from:

- [Chapter 7: Analog Signals, ADC, and PWM](../07-analog-adc-pwm/index.md)
- [Chapter 8: Communication Protocols: I2C, SPI, and UART](../08-communication-protocols/index.md)

---

!!! mascot-welcome "Welcome to Chapter 18"
    ![Monty waves hello](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    It is time to make some noise! A passive buzzer, a few PWM commands, and the right frequencies — and your Pico will play the Super Mario theme. By the end of this chapter you will have a working musical instrument. Let's get sonic!

<iframe src="../../posters/sound-output/main.html" width="100%" height="800" scrolling="no"></iframe>

## Buzzers — The Simplest Sound Makers

Two types of buzzers exist, and they work very differently.

An **active buzzer** has its own oscillator circuit inside. Apply 3.3 V to the positive pin and GND to the negative pin and it beeps at a fixed frequency. It is the simplest possible sound output — just turn it on and off. However, you cannot change its pitch.

A **passive buzzer** has no internal oscillator. It is just a tiny speaker coil. To make sound, you must drive it with a rapidly alternating signal — which is exactly what PWM does. By changing the PWM frequency, you change the pitch. This is the buzzer used for music.

```python
from machine import Pin, PWM

# Passive buzzer on GP16
buzzer = PWM(Pin(16))

def play_tone(frequency, duration_ms):
    buzzer.freq(frequency)
    buzzer.duty_u16(32768)      # 50% duty cycle = maximum volume
    utime.sleep_ms(duration_ms)
    buzzer.duty_u16(0)          # silence
    utime.sleep_ms(20)          # brief gap between notes

play_tone(440, 500)    # play A4 for 500 ms
```

## Tone Generation — Musical Note Frequencies

Sound is vibration. The **frequency** of a musical note is how many times per second the sound wave vibrates, measured in hertz (Hz). The musical note A4 (the A above middle C) is defined as exactly **440 Hz**. Each octave doubles the frequency.

The following table shows standard note frequencies for the 4th octave (C4 = middle C):

| Note | Frequency (Hz) |
|------|---------------|
| C4 | 261.6 |
| D4 | 293.7 |
| E4 | 329.6 |
| F4 | 349.2 |
| G4 | 392.0 |
| A4 | 440.0 |
| B4 | 493.9 |
| C5 | 523.3 |

Store these in a dictionary for easy access:

```python
NOTES = {
    "C4": 262, "D4": 294, "E4": 330, "F4": 349,
    "G4": 392, "A4": 440, "B4": 494, "C5": 523,
    "C3": 131, "D3": 147, "E3": 165, "G3": 196,
    "REST": 0
}
```

## Playing a Scale

A **scale** is a sequence of notes in ascending or descending pitch order. Playing all seven notes (C, D, E, F, G, A, B) and back down is a **major scale**.

```python
import utime
from machine import Pin, PWM

buzzer = PWM(Pin(16))

NOTES = {"C4": 262, "D4": 294, "E4": 330, "F4": 349,
         "G4": 392, "A4": 440, "B4": 494, "C5": 523}

def play_note(name, ms=300):
    freq = NOTES[name]
    if freq > 0:
        buzzer.freq(freq)
        buzzer.duty_u16(32768)
    utime.sleep_ms(ms)
    buzzer.duty_u16(0)
    utime.sleep_ms(30)

scale = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"]
for note in scale:
    play_note(note)
```

## Playing a Melody — Super Mario Theme

A **melody** is a sequence of notes and their durations. In music, note length is expressed as fractions of a **beat** (quarter note = 1 beat, eighth note = 0.5 beat, etc.). At 120 BPM (beats per minute), one beat = 500 ms.

Here is the opening phrase of the Super Mario Bros. theme:

```python
# BPM = 120, one beat = 500 ms, eighth note = 250 ms
Q = 250   # quarter note in ms (at 120 BPM, half the usual so it feels right at tempo)
E = 125   # eighth note
H = 500   # half note

MARIO = [
    ("E5", E), ("E5", E), ("REST", E), ("E5", E),
    ("REST", E), ("C5", E), ("E5", Q),
    ("G5", Q), ("REST", Q), ("G4", Q),
]

NOTES = {
    "C4": 262, "E4": 330, "G4": 392, "C5": 523,
    "E5": 659, "G5": 784, "REST": 0
}

buzzer = PWM(Pin(16))

for note, duration in MARIO:
    freq = NOTES.get(note, 0)
    if freq > 0:
        buzzer.freq(freq)
        buzzer.duty_u16(32768)
    else:
        buzzer.duty_u16(0)
    utime.sleep_ms(duration)
    buzzer.duty_u16(0)
    utime.sleep_ms(20)
```

## Eight-Key Piano Program

An **eight-key piano** turns eight buttons into a one-octave piano. Each button plays a different note of the C major scale when pressed.

```python
from machine import Pin, PWM
import utime

buzzer = PWM(Pin(16))
SCALE  = [262, 294, 330, 349, 392, 440, 494, 523]   # C4 through C5
button_pins = [Pin(i, Pin.IN, Pin.PULL_UP) for i in range(6, 14)]

while True:
    for i, btn in enumerate(button_pins):
        if btn.value() == 0:             # active LOW — button pressed
            buzzer.freq(SCALE[i])
            buzzer.duty_u16(32768)
            break
    else:
        buzzer.duty_u16(0)               # no button pressed → silence
    utime.sleep_ms(10)
```

!!! mascot-tip "Use Wires Instead of Eight Buttons"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Eight tactile buttons can be hard to wire cleanly on a breadboard. For the piano demo, try using eight short jumper wires. Touch the free end of each wire to GND and the note plays. It feels surprisingly like a real capacitive touch instrument!

#### Diagram: Piano Keyboard Tone Generator

<iframe src="../../sims/piano-tone-generator/main.html" width="100%" height="452px" scrolling="no"></iframe>

<details markdown="1">
<summary>Piano Keyboard Tone Generator MicroSim</summary>
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
</details>

## Digital-to-Analog Converter (DAC)

A **DAC** (Digital-to-Analog Converter) is the opposite of an ADC — it converts a digital number into an analog voltage. This allows the Pico to output smooth audio waveforms rather than the on/off square waves produced by PWM.

The Raspberry Pi Pico does not have a built-in DAC. External DAC chips (like the MCP4725 over I2C, or PCM5102 over I2S) provide smooth audio output. For simple buzzer music, PWM is adequate. For playing recorded sounds or high-quality audio, use I2S with an external DAC.

## I2S for Audio — Higher Quality Sound

The **I2S standard** (Inter-IC Sound) is a digital audio bus designed for transferring PCM (Pulse Code Modulation) audio data between chips. Using I2S, the Pico can:

- Play WAV or raw PCM audio files through an I2S DAC module.
- Record audio from an I2S digital microphone (Chapter 11).

**I2S for audio output** requires an external I2S DAC chip (such as MAX98357A or PCM5102A), a small speaker, and the `machine.I2S` class:

```python
from machine import I2S, Pin
import os

audio = I2S(0, sck=Pin(10), ws=Pin(11), sd=Pin(9),
            mode=I2S.TX, bits=16, format=I2S.STEREO,
            rate=22050, ibuf=5000)

# Read WAV data from Pico flash and stream to speaker
with open("sound.wav", "rb") as f:
    f.seek(44)   # skip WAV header (44 bytes for standard PCM WAV)
    while True:
        data = f.read(1000)
        if not data:
            break
        audio.write(data)
```

## MIDI Protocol

**MIDI** (Musical Instrument Digital Interface) is a standard for sending music control messages between electronic instruments and computers. A MIDI message says "play note 60 (middle C) at velocity 80" — it does not contain audio data, just instructions.

The Pico can receive MIDI over UART (standard MIDI at 31,250 baud) or USB MIDI, parse the messages, and play the corresponding tones on a buzzer or I2S speaker.

MIDI note numbers map linearly to frequencies:

\[ f = 440 \times 2^{(n-69)/12} \]

where `n` is the MIDI note number (60 = middle C, 69 = A4 at 440 Hz).

## Audio Amplifier and Speaker Wiring

A passive buzzer works for simple tones, but it is quiet. For louder sound, wire a small speaker (4 Ω or 8 Ω) through an **audio amplifier** module.

The **MAX98357A** is a simple I2S amplifier breakout that provides 3W output power. Connect its I2S input to the Pico and its output directly to a speaker:

```
Pico GP9  → MAX98357A DIN
Pico GP10 → MAX98357A BCLK
Pico GP11 → MAX98357A LRC
MAX98357A VIN → 3.3V or 5V
MAX98357A GND → GND
MAX98357A + → Speaker +
MAX98357A - → Speaker -
```

**Sound parts list** for a complete audio system:

- Passive buzzer (for simple tones, very inexpensive)
- OR I2S DAC module (MAX98357A, PCM5102A) for WAV playback
- 4 Ω or 8 Ω small speaker (0.5 W to 3 W)
- 10 µF electrolytic capacitor across the speaker to block DC offset
- Optional: 3.5 mm audio jack breakout for headphone output

## Key Takeaways

- **Passive buzzers** use PWM frequency to set pitch; change `buzzer.freq()` to change the note.
- **Active buzzers** make a fixed-pitch beep with a constant voltage — no frequency control.
- Musical notes have specific Hz values: A4 = 440 Hz; each octave doubles the frequency.
- Store notes in a dictionary `{name: frequency}` and durations in tuples for clean melody code.
- A **DAC** converts digital numbers to smooth analog voltages — the Pico needs an external DAC for high-quality audio.
- **I2S** carries digital PCM audio; the Pico uses `I2S.TX` to play WAV files through an I2S DAC.
- **MIDI** sends note-on/note-off messages (not audio data) over UART at 31,250 baud.
- For loud sound, pair an I2S DAC with a **MAX98357A** amplifier and a small speaker.

??? question "Quick Check: How do you play a REST (silence) for 250 ms with a passive buzzer? (Click to reveal)"
    **Set `buzzer.duty_u16(0)`** to silence the buzzer output, then `utime.sleep_ms(250)`. Setting duty to 0 stops all PWM output. Do NOT set the frequency to 0 — that would cause an error. Just kill the duty cycle.

!!! mascot-celebration "Your Pico Can Sing!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    From a simple beep to full melodies to I2S audio — your Pico now has a voice! Chapter 19 connects it to the internet with Wi-Fi and MQTT for IoT projects. Data in, data out, around the world. Let's go wireless!

## References

[See the Annotated References for this chapter](references.md)
