from machine import Pin, PWM
from utime import sleep
import config

# Get the speaker pin from config
SPEAKER_PIN = config.SPEAKER_PIN

# Create a PWM object for the speaker
speaker = PWM(Pin(SPEAKER_PIN))

# Best practice is to set the frequency first, then the duty cycle
speaker.freq(1000)  # 1 kilohertz
speaker.duty_u16(32767)  # 50% duty cycle
sleep(0.5)  # Play for 0.5 seconds

# To turn off the sound, set duty to 0
speaker.duty_u16(0)
sleep(0.25)  # Pause for 0.25 seconds

# Play a different tone
speaker.freq(500)  # 500 Hz (lower pitch)
speaker.duty_u16(32767)  # Turn the sound back on
sleep(0.5)  # Play for 0.5 seconds

# Pause again
speaker.duty_u16(0)
sleep(0.25)

# Play an even higher tone
speaker.freq(2000)  # 2000 Hz (higher pitch)
speaker.duty_u16(32767)  # Turn the sound back on
sleep(0.5)

# Completely turn off the PWM when done
speaker.duty_u16(0)  # First set duty to 0
speaker.deinit()  # Then deinitialize the PWM