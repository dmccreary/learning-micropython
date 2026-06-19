# Play a Scale

!!! mascot-welcome "Welcome to the Scale Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will use a loop to play many tones in order from low to high. This is called playing a scale — just like you do on a piano!

## Why Use a Loop?

Playing a scale means playing many tones, each a little higher than the last. You could write out each tone one by one, but that would be a very long program! A loop lets you play all the tones in just a few lines of code.

## Playing a Scale With a Loop

This program starts at a very low pitch of 30 Hz and steps up through 64 tones. Each new tone is 10% higher than the last.

```python
from machine import Pin, PWM  # import Pin and PWM classes
from utime import sleep        # import sleep to pause between notes

SPEAKER_PIN = 16               # GPIO pin connected to the speaker

# Create a PWM object on the speaker pin
speaker = PWM(Pin(SPEAKER_PIN))

def play_tone(frequency):
    """Turn on the speaker at the given frequency."""
    speaker.duty_u16(1000)     # turn the sound on
    speaker.freq(frequency)    # set the pitch
    sleep(0.3)                 # hold the note for 0.3 seconds

def be_quiet():
    """Turn the speaker off."""
    speaker.duty_u16(0)        # set duty cycle to 0 to silence the speaker

freq = 30                      # start at 30 Hz (very low)

for i in range(64):            # repeat 64 times
    print(freq)                # print the current frequency
    play_tone(freq)            # play the tone
    freq = int(freq * 1.1)     # increase frequency by 10%

# Turn off the speaker when the scale is done
speaker.duty_u16(0)
```

### What Each Line Does

1. `def play_tone(frequency):` — defines a function that plays one tone at the given pitch.
2. `speaker.duty_u16(1000)` — turns the speaker on.
3. `speaker.freq(frequency)` — sets the pitch to the value passed in.
4. `sleep(0.3)` — holds the note for 0.3 seconds.
5. `freq = 30` — starts the scale at a very low pitch of 30 Hz.
6. `for i in range(64):` — repeats the loop body 64 times.
7. `freq = int(freq * 1.1)` — makes the next frequency 10% higher than the current one.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice that the frequencies printed to the console are not evenly spaced — the gaps get bigger as the pitch goes up. This is how human hearing works: we hear pitch differences as ratios, not as fixed steps.

## How the Frequency Changes

Look at this line from the program:

```python
freq = int(freq * 1.1)
```

This line takes the current frequency and multiplies it by 1.1. That makes the next tone 10% higher than the last one.

This is called a **geometric** or **multiplicative** step. It matches how musical notes are spaced. On a piano, each note is about 6% higher than the one before it.

## Experiments

1. Change the line `freq = int(freq * 1.1)` to `freq = freq + 100`. Now every tone is exactly 100 Hz higher than the last. Run the program. Does it sound like a regular musical scale, or does it sound odd? Why?
2. Change the multiplier from `1.1` to `1.06` to get closer to real musical note spacing. How does it sound now?
3. Change `range(64)` to `range(12)`. Now only play 12 notes. How many octaves do you hear?

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    The `print(freq)` line shows you the current frequency in the console as the scale plays. Watch the numbers and compare them to what you hear!

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You just used a loop to play a whole scale! Next, you will use a list of exact note frequencies to play a real song.
