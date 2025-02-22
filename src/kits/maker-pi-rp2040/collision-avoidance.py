# Time of Flight Distance Sensor Test
# Demo for Maker Pi RP2040 board

from machine import Pin,PWM
import time
import VL53L0X
buzzer=PWM(Pin(22))

sda=machine.Pin(0) # row one on our standard Pico breadboard
scl=machine.Pin(1) # row two on our standard Pico breadboard
i2c=machine.I2C(0, sda=sda, scl=scl, freq=400000)
# print("Device found at decimal", i2c.scan())

# dist_scale =    [2, 4, 6, 8, 10, 13, 16, 20, 25, 35, 50, 75, 100]
dist_scale =    [2, 4, 6, 8, 10, 15, 20, 25, 50, 100, 150, 200, 300]

delay = .05

# calibration parameters
zero_dist = 65 # distance measure when an object is about 1/2 cm away
max_dist = 350 # max distance we are able to read
scale_factor = .2

# Create a VL53L0X object
tof = VL53L0X.VL53L0X(i2c)


# get the normalized time-of-flight distance
def get_distance():
    global zero_dist, scale_factor
    tof_distance = tof.read()
    if tof_distance > max_dist:
        return tof_distance
    # if our current time-of-flight distance is lower than our zero distance then reset the zero distance
    if tof_distance < zero_dist:
        zero_dist = tof_distance
    return  int((tof_distance - zero_dist) * scale_factor)

def playtone(frequency):
    buzzer.duty_u16(1000)
    buzzer.freq(frequency)

def bequiet():
    buzzer.duty_u16(0)
    
def play_no_signal():
    playtone(100)
    time.sleep(0.1)
    bequiet()

def play_turn():
    playtone(500)
    time.sleep(0.1)
    bequiet()
    
# start our time-of-flight sensor
tof.start()
valid_distance = 1

# loop forever
def main():
    while True:
        global valid_distance
        distance = get_distance()
        if distance > 1000:
            # only print if we used to have a valid distance
            if valid_distance == 1:
                print('no signal')
                
            valid_distance = 0
        else:
            print(distance)
            if distance < 30:
                play_turn()
            valid_distance = 1
            led_show_dist(distance)
        time.sleep(0.05)

# clean up


# This allows us to stop the sound by doing a Stop or Control-C which is a keyboard intrrup
try:
    main()
except KeyboardInterrupt:
    print('Got ctrl-c')
finally:
    # Optional cleanup code
    print('turning off sound')
    buzzer.duty_u16(0)
    tof.stop()