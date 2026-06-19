# Play Three Tones

!!! mascot-welcome "Welcome to Three Tones"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will play three tones in a row. Each tone has its own pitch and its own timing. This is how simple music is made!

## How It Works

Playing a sequence of tones is a simple pattern. For each tone, you:

1. Turn the sound on with `duty_u16`.
2. Set the pitch with `freq`.
3. Wait for a moment with `sleep`.
4. Turn the sound off with `duty_u16(0)`.
5. Wait for a short gap before the next tone.

## Lab 1: Three Tones in a Row

```python
from machine import Pin, PWM  # import Pin and PWM classes
from utime import sleep        # import sleep to pause between notes

SPEAKER_PIN = 16               # GPIO pin connected to the speaker

# Create a PWM object on the speaker pin
speaker = PWM(Pin(SPEAKER_PIN))

# --- First tone: low pitch ---
speaker.duty_u16(1000)         # turn the sound on
speaker.freq(300)              # set pitch to 300 Hz (low note)
sleep(0.5)                     # play for half a second
speaker.duty_u16(0)            # turn the sound off
sleep(0.25)                    # short gap of silence

# --- Second tone: high pitch ---
speaker.duty_u16(1000)         # turn the sound on
speaker.freq(800)              # set pitch to 800 Hz (high note)
sleep(0.5)                     # play for half a second
speaker.duty_u16(0)            # turn the sound off
sleep(0.25)                    # short gap of silence

# --- Third tone: medium pitch ---
speaker.duty_u16(1000)         # turn the sound on
speaker.freq(400)              # set pitch to 400 Hz (medium note)
sleep(0.5)                     # play for half a second

# Always turn the sound off at the end
speaker.duty_u16(0)
```

### What Each Line Does

1. `speaker.duty_u16(1000)` — turns the sound on. The value 1000 is low, making the tone quieter than 32768.
2. `speaker.freq(300)` — sets the pitch to 300 Hz. Lower numbers give lower pitches.
3. `sleep(0.5)` — waits half a second while the note plays.
4. `speaker.duty_u16(0)` — turns the sound off.
5. `sleep(0.25)` — waits a short time between notes. This gap makes each tone sound separate.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The gap between notes matters! Without `sleep(0.25)` between tones, they would blend together and sound like one long note.

## Using Variables for Timing

If you want to change how long each note plays, you would have to update every `sleep(0.5)` line. There is a better way — store the timing values in variables:

```python
# set the time each tone will be on
ONTIME = 0.5
# the time between the tones
OFFTIME = 0.1
```

Now you only need to change one number to update all the notes at once.

## Lab 2: Three Tones With Variables

```python
from machine import Pin, PWM  # import Pin and PWM classes
from utime import sleep        # import sleep to pause between notes

SPEAKER_PIN = 16               # GPIO pin connected to the speaker

# Create a PWM object on the speaker pin
speaker = PWM(Pin(SPEAKER_PIN))

ON_TIME  = 0.25                # how long each note plays (in seconds)
OFF_TIME = 0.1                 # gap of silence between notes (in seconds)

# --- Low tone ---
speaker.duty_u16(1000)         # turn the sound on
speaker.freq(300)              # low pitch: 300 Hz
sleep(ON_TIME)                 # play for ON_TIME seconds
speaker.duty_u16(0)            # turn the sound off
sleep(OFF_TIME)                # short silence

# --- High tone ---
speaker.duty_u16(1000)         # turn the sound on
speaker.freq(800)              # high pitch: 800 Hz
sleep(ON_TIME)                 # play for ON_TIME seconds
speaker.duty_u16(0)            # turn the sound off
sleep(OFF_TIME)                # short silence

# --- Medium tone ---
speaker.duty_u16(1000)         # turn the sound on
speaker.freq(400)              # medium pitch: 400 Hz
sleep(ON_TIME)                 # play for ON_TIME seconds

# Always turn the sound off at the end
speaker.duty_u16(0)
```

### What Changed

- `ON_TIME = 0.25` — one variable controls how long every note plays.
- `OFF_TIME = 0.1` — one variable controls the gap between every note.
- You can now change the timing of the whole program by editing just two lines.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Using CAPITAL_LETTERS for constant values like `ON_TIME` is a Python convention. It tells other coders (and future you!) that this value is set once and does not change while the program runs.

## Experiments

1. Change `ON_TIME` to a very short value like `0.05`. What is the shortest note you can still hear?
2. Try changing the order of the three tones: Low → High → Medium. Then try High → Low → Medium. Which order sounds most like a "game over" sound? Which sounds most like a "level up"?
3. Add a fourth tone. Pick a frequency between 100 and 2000 Hz.

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You just programmed your Pico to play a sequence of notes. In the next lab, you will use a loop to play a whole scale of tones automatically!
