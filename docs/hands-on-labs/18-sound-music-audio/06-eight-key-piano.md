# Eight-Key Piano

!!! mascot-welcome "Welcome to the Piano Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will wire up eight buttons and turn your Pico into a real playable piano! Press a button and hear a note.

<iframe width="560" height="315" src="https://www.youtube.com/embed/IeHaYR17zcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Parts You Will Need

1. A Raspberry Pi Pico
2. A standard-size breadboard (or two half-size breadboards)
3. 8 momentary push buttons
4. A speaker or a [piezo buzzer](https://en.wikipedia.org/wiki/Piezoelectric_speaker)
5. (Optional) A small sound amplifier such as the [LM386 DC 5V-12V Mini Micro Audio Amplifier](https://www.ebay.com/itm/234012505949?hash=item367c3b775d:g:sPkAAOSwtoVbOFbf) for under $2. In a quiet room you may not need it.

![Eight Key Piano](../../img/eight-key-piano.jpg)

## How the Buttons Are Wired

Each button connects one GPIO pin to the 3.3 V rail on the breadboard. When you press the button, the pin reads HIGH (1). When you release it, the pin reads LOW (0).

You do not need external resistors. You set each pin to use an internal pull-down resistor in code:

```python
button_pin_1 = machine.Pin(10, machine.Pin.IN, machine.Pin.PULL_DOWN)
```

This means the pin is always pulled to 0 V (LOW) until a button press connects it to 3.3 V (HIGH).

## The Play-Tone Functions

Two functions handle all the sound:

```python
def play_tone(frequency):
    speaker.duty_u16(1000)     # turn the PWM signal on
    speaker.freq(frequency)    # set the pitch to the given frequency
    builtin_led.high()         # turn the built-in LED on to show a note is playing

def be_quiet():
    speaker.duty_u16(0)        # turn the PWM signal off (silence)
    builtin_led.low()          # turn the built-in LED off
```

To check if a button is pressed, you read the pin's value:

```python
if button_pin_1.value() == 1:  # if the pin is HIGH, the button is pressed
    play_tone(220)             # play note A3 (220 Hz)
```

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The eight notes go from A3 (220 Hz) up to A4 (440 Hz). A4 is exactly twice the frequency of A3 — that is one octave higher. Each step in between is a note in the musical scale.

## Full Program

```python
# Play a tone while a button is held down
from machine import Pin, PWM
from utime import sleep, ticks_ms
import machine

SPEAKER_PIN = 22               # GPIO pin connected to the speaker
speaker = PWM(Pin(SPEAKER_PIN))

builtin_led = machine.Pin(25, Pin.OUT)  # the built-in LED on the Pico

# Connect each GPIO pin through a button to the 3.3 V rail
button_pin_1 = machine.Pin(10, machine.Pin.IN, machine.Pin.PULL_DOWN)
button_pin_2 = machine.Pin(11, machine.Pin.IN, machine.Pin.PULL_DOWN)
button_pin_3 = machine.Pin(12, machine.Pin.IN, machine.Pin.PULL_DOWN)
button_pin_4 = machine.Pin(13, machine.Pin.IN, machine.Pin.PULL_DOWN)
button_pin_5 = machine.Pin(14, machine.Pin.IN, machine.Pin.PULL_DOWN)
button_pin_6 = machine.Pin(15, machine.Pin.IN, machine.Pin.PULL_DOWN)
button_pin_7 = machine.Pin(16, machine.Pin.IN, machine.Pin.PULL_DOWN)
button_pin_8 = machine.Pin(17, machine.Pin.IN, machine.Pin.PULL_DOWN)

def play_tone(frequency):
    """Turn the speaker on at the given frequency and light the LED."""
    speaker.duty_u16(1000)     # turn the PWM signal on
    speaker.freq(frequency)    # set the pitch
    builtin_led.high()         # show that a note is playing

def be_quiet():
    """Turn the speaker off and turn off the LED."""
    speaker.duty_u16(0)        # silence the speaker
    builtin_led.low()          # show that no note is playing

while True:                    # keep checking buttons forever
    if   button_pin_1.value() == 1:
        play_tone(220)         # A3 — the lowest note
    elif button_pin_2.value() == 1:
        play_tone(247)         # B3
    elif button_pin_3.value() == 1:
        play_tone(262)         # C4 (Middle C)
    elif button_pin_4.value() == 1:
        play_tone(294)         # D4
    elif button_pin_5.value() == 1:
        play_tone(330)         # E4
    elif button_pin_6.value() == 1:
        play_tone(349)         # F4
    elif button_pin_7.value() == 1:
        play_tone(392)         # G4
    elif button_pin_8.value() == 1:
        play_tone(440)         # A4 — one octave above A3
    else:
        be_quiet()             # no button pressed — stay silent
```

### What Each Section Does

1. `SPEAKER_PIN = 22` — the GPIO pin number where the speaker is connected.
2. `machine.Pin.PULL_DOWN` — sets each button pin to use an internal pull-down resistor.
3. `while True:` — loops forever, checking all eight buttons every cycle.
4. `elif` — checks each button in order. Only the first pressed button gets to play.
5. `else: be_quiet()` — if no button is pressed, turn the sound off.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    The built-in LED on pin 25 lights up while any note is playing. This gives you a visual sign that the circuit is working even if you cannot hear anything.

## Exercises

1. Rewrite the code using two lists — one for pin numbers and one for note frequencies. Use a loop to check each button.
2. Try different note frequencies to play other musical scales (minor scale, pentatonic scale).
3. Add a ninth button that shifts all the notes up one octave by doubling their frequencies.
4. Connect an OLED display and show the name of the note being played on screen.
5. Print the time each note is pressed and the length of the pauses between notes.
6. Save the sequence of notes to a file so you can play it back later.
7. Add a simple menu: start a new recording, save it, or play it back.
8. Eight keys are not enough for many songs. Use two full-size breadboards to add more keys.
9. Look into a small MIDI keyboard such as the 32-key $40 [MIDIPLUS AKM320 USB MIDI Keyboard Controller](https://www.amazon.com/midiplus-32-Key-Midi-Controller-AKM320/dp/B00VHKMK64/ref=bmx_dp_n4il8m3n_37/135-5614730-7499827?th=1).
10. Read about running Musical Instrument Digital Interface (MIDI) on the Pico: [MIDI, MicroPython and the Raspberry Pi Pico](https://diyelectromusic.wordpress.com/2021/01/23/midi-micropython-and-the-raspberry-pi-pico/).

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You built a real playable instrument! Next, you will learn how to play full audio files stored on the Pico's memory.
