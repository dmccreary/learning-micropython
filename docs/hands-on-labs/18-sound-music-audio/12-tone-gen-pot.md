# Tone Generator with a Potentiometer

!!! mascot-welcome "Welcome to the Tone Generator Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will turn a knob to change the pitch of a tone. Twist the potentiometer and hear the sound change in real time!

## Setup

Wire up your components like this:

1. Connect the middle pin (wiper) of the potentiometer to the **ADC0** pin — that is GPIO pin 26 on the Pico.
2. Connect one outer pin of the potentiometer to **GND**.
3. Connect the other outer pin to **3.3VREF** — use the isolated GND pin next to it.
4. Connect the speaker between **GND** and **GPIO pin 15** (lower-left corner of the Pico).

Then load and run the code below.

## Tone Generator Code

```python
import machine    # import the machine module for hardware control
import time       # import time for pausing

# Set up the potentiometer on ADC pin 26
pot = machine.ADC(26)                      # read analog voltage from pin 26

# Set up the speaker as a PWM output on pin 15
speaker_pin = machine.Pin(15)              # use GPIO pin 15
speaker_pwm = machine.PWM(speaker_pin)    # create a PWM signal on that pin

# Turn the PWM on at 50% duty cycle to produce sound
speaker_pwm.duty_u16(32768)               # 32768 is half of 65535 — 50% duty cycle

# Frequency range in Hz
MIN_FREQ = 100                             # lowest tone: 100 Hz (very low rumble)
MAX_FREQ = 2000                            # highest tone: 2000 Hz (sharp beep)

try:
    while True:
        # Read the current position of the potentiometer
        pot_value = pot.read_u16()         # returns a value from 0 to 65535

        # Map the potentiometer value to a frequency in Hz
        # When pot_value is 0, frequency = MIN_FREQ
        # When pot_value is 65535, frequency = MAX_FREQ
        frequency = MIN_FREQ + (pot_value / 65535) * (MAX_FREQ - MIN_FREQ)

        # Update the speaker frequency
        speaker_pwm.freq(int(frequency))   # freq() needs a whole number

        # Short delay to avoid updating too many times per second
        time.sleep(0.01)                   # wait 10 milliseconds

except KeyboardInterrupt:
    # Clean up when the user presses Ctrl-C to stop the program
    speaker_pwm.deinit()                   # turn off the PWM hardware
    print("Program terminated")
```

## Code Explanation

1. `pot = machine.ADC(26)` — sets up pin 26 as an **Analog-to-Digital Converter (ADC)** input to read the potentiometer voltage.
2. `speaker_pwm = machine.PWM(speaker_pin)` — creates a **Pulse-Width Modulation (PWM)** signal on pin 15 for the speaker.
3. `speaker_pwm.duty_u16(32768)` — turns the sound on at 50% duty cycle. This stays on the whole time; only the frequency changes.
4. `pot_value = pot.read_u16()` — reads the potentiometer. The value goes from 0 (fully turned one way) to 65535 (fully turned the other way).
5. `frequency = MIN_FREQ + (pot_value / 65535) * (MAX_FREQ - MIN_FREQ)` — converts the potentiometer reading into a frequency between 100 Hz and 2,000 Hz.
6. `speaker_pwm.freq(int(frequency))` — sends the new frequency to the PWM output. The `int()` call rounds it to a whole number.
7. `time.sleep(0.01)` — waits 10 milliseconds. Without this delay, the program would update the frequency thousands of times per second, which is not useful.
8. `speaker_pwm.deinit()` — turns the PWM hardware off when you stop the program. Without this, the tone would keep playing!

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The `try/except KeyboardInterrupt` block is important! When you press Ctrl-C to stop the program, the `except` block runs `deinit()` to stop the PWM. Without it, the tone would keep playing after your program stops.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    When you turn the potentiometer, the ADC reads the changing voltage on pin 26 and converts it to a number. Twisting the knob changes the number, which changes the frequency, which changes the pitch you hear.

!!! challenges
    1. Change `MAX_FREQ` to `4000`. Can you hear the full range?
    2. What is the highest frequency you can still hear? (Hint: most people cannot hear above 20,000 Hz, but many already start losing high frequencies much earlier.)
    3. Connect an OLED display and draw a picture of a sine wave that changes shape as the frequency changes.

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You just built a real electronic theremin-style instrument! You control the pitch with your fingers on a knob.
