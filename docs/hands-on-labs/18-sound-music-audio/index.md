# Introduction to Sound and Music in MicroPython

!!! mascot-welcome "Welcome to Sound and Music"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this section, you will make your Pico play sounds, tones, and music. Get ready to build something that you can actually hear!

## How Microcontrollers Make Sound

Microcontrollers are great at switching a pin on and off very fast. These pins produce a **digital signal** — a voltage that is either zero volts (off) or 3.3 volts (on). There is no in-between.

But sound needs a signal that changes smoothly, like a wave. So how can a digital chip make sound?

The answer is a trick called **Pulse-Width Modulation (PWM)**. PWM works by switching a pin on and off so fast that the speaker cannot follow each individual switch. The speaker hears the average voltage instead.

When PWM switches faster, the pitch goes up. When it switches slower, the pitch goes down.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    PWM creates sound by switching a pin on and off very fast. The faster it switches, the higher the pitch you hear.

## What Is a Duty Cycle?

The **duty cycle** is how much of the time the signal is "on" compared to "off." A 50% duty cycle means the signal is on half the time and off the other half.

![Duty Cycle](../../img/duty-cycle.png)

For making sound, we use a 50% duty cycle. This gives a nice, even tone. On the Raspberry Pi Pico, you set the duty cycle like this:

```python
speaker.duty_u16(1000)  # turn the sound on at a low volume
```

When your program is done playing a tone, you must turn the duty cycle back to zero:

```python
speaker.duty_u16(0)  # turn the sound off
```

If you forget that last line, the tone keeps playing even after your program stops. This happens because the PWM hardware runs on its own — it does not need the main program to keep going!

## Importing the Libraries You Need

Every sound program starts with two imports:

```python
from machine import Pin, PWM  # gives us Pin and PWM classes
from utime import sleep        # lets us pause between notes
```

- `Pin` lets you control a GPIO pin.
- `PWM` lets you create a Pulse-Width Modulation signal on that pin.
- `sleep` pauses the program for a set number of seconds.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    The `sleep` function takes a number of seconds. Use `sleep(0.5)` to wait half a second, or `sleep(0.1)` to wait one tenth of a second.

## Ways to Connect a Sound Device

You can connect several different devices to make sound with your Pico:

1. **Active buzzer** — the easiest option. Apply power and it beeps at one fixed pitch.
2. **Passive buzzer** — a tiny speaker-like device. You send it a PWM signal and it plays whatever pitch you choose. Most labs use this type.
3. **Small magnetic speaker** — louder than a buzzer, but needs more current than a GPIO pin can supply. Always use an amplifier module between the Pico and a speaker.
4. **Speaker with amplifier** — an amplifier board (about $1.20) boosts the Pico's signal to drive a real speaker at a useful volume.

![Magnetic Buzzer](../../img/magnetic-buzzer.png)
![Piezo Buzzer](../../img/piezo-buzzer.png)

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Never connect a speaker directly to a GPIO pin without an amplifier. The pin cannot supply enough current and you may damage the Pico.

## What You Will Learn in This Section

Each lab in this section builds on the last one:

- **Play a Tone** — make the Pico play one single beep.
- **Play Three Tones** — play a sequence of three different pitches.
- **Play a Scale** — step through many pitches automatically.
- **Play Mario** — play a famous video-game melody.
- **Eight-Key Piano** — turn eight buttons into a playable keyboard.
- **Playing an Audio File** — play a real WAV sound file stored on the Pico.
- **I2S Standard** — learn about the Inter-IC Sound (I2S) digital audio bus.
- **Converting MP3 to WAV** — convert audio files on your computer.
- **MIDI** — send Musical Instrument Digital Interface (MIDI) messages to other devices.

## References

1. [Buzzer vs Speaker](https://electronics.stackexchange.com/questions/288930/what-is-the-difference-between-a-buzzer-and-a-speaker-and-are-there-any-other-ba)
2. [Juke Phone in C](https://github.com/TuriSc/Jukephone) — convert an old telephone into an MP3 jukebox. Written in C, but could be adapted to MicroPython.
3. [Mannbro Pico ChipSound Music Player](https://github.com/mannbro/PiPico_8-bit_ChipSound_Tracker_Async_MusicPlayer)

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You now know the basics of how the Pico makes sound. Pick the first lab and start playing!
