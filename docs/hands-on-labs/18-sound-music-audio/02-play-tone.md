# Play a Tone Using PWM

!!! mascot-welcome "Welcome to Your First Sound Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will make your Pico play a single beep. It is your first step toward making real music with code!

## Importing the Sleep Function

You will need to pause your program between tones. You can import the `sleep` function directly from MicroPython's time library:

```python
from utime import sleep  # import just the sleep function
```

Now you can write `sleep(0.5)` to pause for half a second. This is shorter than writing `utime.sleep(0.5)` every time.

If you need other functions from the `utime` library later, you can import those too. Just add them after the comma, like `from utime import sleep, ticks_ms`.

## Lab 1: Play a Single Tone

This program plays one tone for one second, then turns the sound off.

```python
from machine import Pin, PWM  # import Pin and PWM classes
from utime import sleep        # import sleep so we can pause

SPEAKER_PIN = 16               # GPIO pin connected to the speaker

# Create a PWM object on the speaker pin
speaker = PWM(Pin(SPEAKER_PIN))

speaker.duty_u16(32768)        # set duty cycle to 50% (half of 65535)
speaker.freq(1000)             # set the frequency to 1000 Hz (1 kHz)
sleep(1)                       # wait for 1 second while the tone plays
speaker.duty_u16(0)            # turn the sound off by setting duty cycle to 0
speaker.duty_u16(0)            # confirm the sound is off
```

### What Each Line Does

1. `PWM(Pin(SPEAKER_PIN))` — creates a PWM signal on pin 16, which is connected to your speaker.
2. `speaker.duty_u16(32768)` — turns the sound on. 32768 is exactly half of 65535, giving a 50% duty cycle.
3. `speaker.freq(1000)` — sets the pitch to 1000 Hz (cycles per second). That is about the pitch of a phone dial tone.
4. `sleep(1)` — waits for one second while the tone plays.
5. `speaker.duty_u16(0)` — turns the tone off by setting the duty cycle to zero.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The tone will keep sounding until you set the duty cycle to 0. The PWM hardware runs on its own — it does not stop when your program finishes.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Always set `speaker.duty_u16(0)` at the end of your program. If you forget, the tone keeps playing until you unplug the Pico!

## Experiments

Try these changes to learn how the code works:

1. Change the line `speaker.freq(1000)` to other values. Try numbers from 100 to 10000. What frequency sounds the loudest to your ear? What is the highest pitch you can still hear?
2. What happens when you comment out the last line that sets the duty cycle to 0? Put a `#` at the start of `speaker.duty_u16(0)` and run it. Make sure to set it back to 0 again, or the tone will keep playing until you unplug the Pico.
3. Change `sleep(1)` to `sleep(0.1)`. How short can the beep get before you can barely hear it?

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Your Pico just made its first sound! In the next lab, you will play three tones in a row to make a simple musical pattern.
