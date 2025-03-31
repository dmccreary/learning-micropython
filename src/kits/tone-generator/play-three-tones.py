from machine import Pin, PWM
from utime import sleep

# lower right corner with USB connector on top
SPEAKER_PIN = 16

# create a Pulse Width Modulation Object on this pin
speaker = PWM(Pin(SPEAKER_PIN))

speaker.duty_u16(1000)
speaker.freq(300) # 1 Kilohertz
sleep(.5) # wait a 1/4 second
speaker.duty_u16(0)
sleep(.25)

speaker.duty_u16(1000)
speaker.freq(800)
sleep(.5)
speaker.duty_u16(0)
sleep(.25)

speaker.duty_u16(1000)
speaker.freq(400)
sleep(.5)

# turn off the PWM 
speaker.duty_u16(0)