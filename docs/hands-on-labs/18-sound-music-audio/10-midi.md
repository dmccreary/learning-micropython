# MIDI with MicroPython

!!! mascot-welcome "Welcome to MIDI"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will learn what Musical Instrument Digital Interface (MIDI) is and how to send MIDI messages from your Pico. MIDI lets your Pico talk to synthesizers, computers, and other electronic instruments!

!!! note
    This page is an introductory reference. For more detailed MIDI projects, see the [MIDI Projects](midi/index.md) section.

## What Is MIDI?

**Musical Instrument Digital Interface (MIDI)** is a standard protocol for sending music instructions between electronic devices. MIDI does not send audio — it sends commands, like:

- "Play note 60 (Middle C) at volume 80"
- "Stop note 60"
- "Switch to instrument number 25"

A synthesizer, computer, or software app receives these commands and makes the actual sound.

The Pico sends MIDI messages over its **UART** (Universal Asynchronous Receiver-Transmitter) serial port at the standard MIDI speed of **31,250 bits per second**.

## Sample Code

### Ascending Notes

This program plays a sequence of rising notes over MIDI. Each note is two steps higher than the last.

```python
# Play test MIDI ascending notes
from machine import Pin, UART  # import Pin and UART classes
import time

# Set up the UART port for MIDI
# MIDI always uses 31250 baud (bits per second)
uart = UART(1, baudrate=31250, tx=Pin(4), rx=Pin(5))
uart.init(bits=8, parity=None, stop=1)  # 8 data bits, no parity, 1 stop bit

led = Pin("LED", Pin.OUT)      # the built-in LED on the Pico

note = 24                      # start at MIDI note 24 (C1 — a very low note)

while True:
    # Send a Note On message: [command, note number, velocity]
    # 0x90 = Note On on MIDI channel 1
    # velocity 64 = medium volume
    midi_message = bytearray([0x90, note, 64])
    uart.write(midi_message)   # send the Note On command

    led.toggle()               # flash the LED to show a note was sent

    # Send a Note Off message by setting velocity to 0
    midi_message = bytearray([0x90, note, 0])
    uart.write(midi_message)   # send the Note Off command

    time.sleep(0.125)          # wait 1/8 of a second before the next note

    note += 2                  # jump up two semitones
    if note > 64:              # if we have gone too high, restart from note 24
        note = 24
```

### What Each Line Does

1. `UART(1, baudrate=31250, tx=Pin(4), rx=Pin(5))` — sets up UART 1 for MIDI on pins 4 and 5.
2. `uart.init(bits=8, parity=None, stop=1)` — configures the MIDI serial format exactly.
3. `bytearray([0x90, note, 64])` — creates a MIDI Note On message. `0x90` is the Note On command for channel 1.
4. `uart.write(midi_message)` — sends the 3-byte message out the TX pin.
5. `led.toggle()` — flashes the built-in LED each time a note plays.
6. `bytearray([0x90, note, 0])` — sends a Note Off by setting the velocity (third byte) to 0.
7. `note += 2` — steps up two semitones each loop.
8. `if note > 64: note = 24` — resets back to the low starting note.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    A MIDI message is always three bytes: a command byte that says what to do, a note number (0–127), and a velocity (how hard the key is pressed, 0–127). Velocity 0 is the same as a Note Off.

## References

- [Raspberry Pi Pico MIDI Development Board Midimuso](https://www.ebay.com/itm/134794678425?hash=item1f62639099:g:WbcAAOSwvMxk0qof) — a ready-made MIDI board with all connectors for about $20.
- [Simple DIY Electromusic Project](https://diyelectromusic.wordpress.com/)
- [DIY Electro Music SDEMP MicroPython Code on GitHub](https://github.com/diyelectromusic/sdemp/tree/main/src/SDEMP/Micropython)
- [Pico MIDI by Barb Arach](https://barbarach.com/pico-midi-external-switches/)
- [PicoMIDI Manual v1.0](https://docs.google.com/viewer?url=https%3A%2F%2Fmidimuso.co.uk%2Fwp-content%2Fuploads%2F2023%2F07%2FpicoMIDI_manual-2.pdf)

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Your Pico is now sending MIDI messages! Head to the MIDI Projects section to build a full MIDI controller.
