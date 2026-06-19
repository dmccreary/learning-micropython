# Testing Audio Ports

!!! mascot-welcome "Welcome to the Audio Port Test"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will test your left and right audio connections by sending a tone to each one. This makes sure both channels are wired correctly before you try playing real audio files.

## What This Lab Does

This program sends a 1,000 Hz (1 kHz) square wave to the left audio channel for one second, then to the right audio channel for one second. If you hear a beep from each side, your wiring is correct.

## The Test Program

```python
from machine import Pin, PWM  # import Pin and PWM classes
from utime import sleep        # import sleep to pause between steps

# Set these pin numbers to match your wiring
AUDIO_LEFT_PIN  = 18           # GPIO pin connected to the left channel
AUDIO_RIGHT_PIN = 19           # GPIO pin connected to the right channel

# --- Test the left channel ---
# Create a PWM object on the left channel pin
left_speaker = PWM(Pin(AUDIO_LEFT_PIN))
left_speaker.duty_u16(1000)    # turn the left channel on at low volume
left_speaker.freq(1000)        # set the frequency to 1 kHz
sleep(1)                       # play the tone for 1 second
left_speaker.duty_u16(0)       # turn the left channel off
left_speaker.duty_u16(0)       # confirm the left channel is off
sleep(1)                       # pause for 1 second before testing the right

# --- Test the right channel ---
# Create a PWM object on the right channel pin
right_speaker = PWM(Pin(AUDIO_RIGHT_PIN))
right_speaker.duty_u16(1000)   # turn the right channel on at low volume
right_speaker.freq(1000)       # set the frequency to 1 kHz
sleep(1)                       # play the tone for 1 second
right_speaker.duty_u16(0)      # turn the right channel off
right_speaker.duty_u16(0)      # confirm the right channel is off
```

### What Each Section Does

1. `AUDIO_LEFT_PIN = 18` — the GPIO pin number for the left audio channel. Change this to match your wiring.
2. `AUDIO_RIGHT_PIN = 19` — the GPIO pin number for the right audio channel.
3. `left_speaker = PWM(Pin(AUDIO_LEFT_PIN))` — creates a PWM object on the left pin.
4. `left_speaker.duty_u16(1000)` — turns the tone on. The value 1000 gives a low but audible volume.
5. `left_speaker.freq(1000)` — sets the pitch to 1,000 Hz.
6. `sleep(1)` — keeps the tone playing for 1 second.
7. `left_speaker.duty_u16(0)` — silences the left channel before testing the right.
8. `sleep(1)` — waits 1 second so you can hear the gap between the two tests.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    If you only have one speaker (mono audio), connect it to one of the two pins and confirm it beeps. Then move it to the other pin and run the program again.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Always set `duty_u16(0)` at the end of each channel test. If you skip this step, the tone keeps playing on that pin even after the program moves to the next step.

## References

[Wikipedia — Phone Connector (Audio)](https://en.wikipedia.org/wiki/Phone_connector_(audio)#Computer_sound)

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Both audio channels are tested and working. You are ready to play real WAV files through your stereo output!
