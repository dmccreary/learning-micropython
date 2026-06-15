# MIDI Projects with MicroPython

!!! mascot-welcome "Welcome to the MIDI Projects Section"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    MIDI is the language that musical instruments use to talk to each other.
    With a Raspberry Pi Pico and a few components, you can build your own
    MIDI instrument, controller, or sequencer. Let's build something amazing!

## What Is MIDI?

**MIDI** stands for **Musical Instrument Digital Interface**. It is a standard
protocol that lets electronic instruments, computers, and controllers communicate.

MIDI does not send audio — it sends **instructions**, like:
- "Play note 60 (Middle C) at volume 80"
- "Stop note 60"
- "Change to instrument 25 (steel guitar)"

These instructions are called **MIDI messages**. A synthesizer or software
(like GarageBand or a DAW) receives the messages and produces the actual sound.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Think of MIDI like sheet music. The sheet music tells a musician what notes
    to play, but the musician (synthesizer) decides what it sounds like. MIDI
    separates the *instructions* from the *sound*.

## MIDI on the Raspberry Pi Pico

The Pico can send MIDI messages over its **UART serial port** at the standard
MIDI baud rate of **31 250 bits per second**.

To send MIDI to external gear, you need:
- A **MIDI output circuit** (an optocoupler and resistors, or a ready-made board)
- A **5-pin DIN MIDI cable**

For beginners, the easiest approach is to use **USB MIDI** by connecting the
Pico directly to a computer. The computer sees the Pico as a USB MIDI device.

## MIDI Hardware Options

| Option | Cost | Notes |
|--------|------|-------|
| Direct UART (serial MIDI) | ~$1 in parts | Needs optocoupler circuit |
| PicoMIDI Development Board (Midimuso) | ~$20 | All-in-one board with DIN connectors |
| USB MIDI (software only) | $0 | Pico W firmware needed |

## Projects in This Section

| Project | What You Build |
|---------|---------------|
| [MIDI Basics](../10-midi.md) | Send ascending MIDI notes over UART |
| Chromatic Scale | Play every note in one octave on a MIDI synth |
| Piano Keyboard | 13 buttons that play a full octave |
| MIDI Sequencer | A looping pattern of notes |

## Quick Start: Play a Note Over UART

You need:
1. Raspberry Pi Pico
2. MIDI output circuit connected to GP4 (TX1)
3. MIDI synthesizer or computer with a soft synth

```python
from machine import Pin, UART
import time

# MIDI uses 31250 baud — this is the universal MIDI speed
uart = UART(1, baudrate=31250, tx=Pin(4), rx=Pin(5))
uart.init(bits=8, parity=None, stop=1)

def note_on(channel, note, velocity):
    """Send a MIDI Note On message."""
    # 0x90 = Note On command on channel 1 (channels are 0–15)
    uart.write(bytearray([0x90 | channel, note, velocity]))

def note_off(channel, note):
    """Send a MIDI Note Off message."""
    uart.write(bytearray([0x80 | channel, note, 0]))

# Play Middle C (note 60) for one second
note_on(0, 60, 100)   # channel 0, note 60, velocity 100
time.sleep(1)
note_off(0, 60)
```

## MIDI Note Numbers

MIDI uses numbers 0–127 for notes. Middle C is note number **60**:

| Note | MIDI number |
|------|------------|
| C4 (Middle C) | 60 |
| D4 | 62 |
| E4 | 64 |
| F4 | 65 |
| G4 | 67 |
| A4 (440 Hz) | 69 |
| B4 | 71 |
| C5 | 72 |

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    You can test MIDI without any hardware by installing a free software
    synthesizer on your computer, such as **VirtualMIDISynth** (Windows) or
    using the built-in **IAC Driver** (Mac). Connect the Pico via USB and the
    computer will receive your MIDI messages as if from a keyboard.

## References

1. [MIDI Association — MIDI Basics](https://www.midi.org/midi-articles/about-midi-part-1-introduction)
2. [Simple DIY Electromusic Project (Kevin)](https://diyelectromusic.wordpress.com/)
3. [SDEMP MicroPython MIDI Code on GitHub](https://github.com/diyelectromusic/sdemp/tree/main/src/SDEMP/Micropython)
4. [Pico MIDI by Barb Arach](https://barbarach.com/pico-midi-external-switches/)
5. [PicoMIDI Development Board (Midimuso)](https://www.ebay.com/itm/134794678425)
