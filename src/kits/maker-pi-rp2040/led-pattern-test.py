# Demo for Maker Pi RP2040 board

import machine
import time
import VL53L0X

sda=machine.Pin(0) # row one on our standard Pico breadboard
scl=machine.Pin(1) # row two on our standard Pico breadboard
i2c=machine.I2C(0, sda=sda, scl=scl, freq=400000)
# print("Device found at decimal", i2c.scan())

# The Maker Pi RP2040 has 13 fantastic blue GPIO status LEDs
blue_led_pins = [2, 3,  4,  5,  6,  7, 16, 17, 26, 27, 28]
dist_scale =    [2, 4, 6, 8, 10, 13, 16, 20, 25, 35, 50, 75, 100]
number_leds = len(blue_led_pins)
led_ports = []
delay = .05

# calibration parameters
zero_dist = 65 # distance measure when an object is about 1/2 cm away
max_dist = 350 # max distance we are able to read
scale_factor = .2

# create a list of the ports
for i in range(number_leds):
   led_ports.append(machine.Pin(blue_led_pins[i], machine.Pin.OUT))

# Create a VL53L0X object
tof = VL53L0X.VL53L0X(i2c)

# blue up
for i in range(0, number_leds):
    led_ports[i].high()
    time.sleep(delay)
    led_ports[i].low()
# blue down
for i in range(number_leds - 1, 0, -1):
    led_ports[i].high()
    time.sleep(delay)
    led_ports[i].low()

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

def led_show_dist(in_distance):
    global number_leds
    for led_index in range(0, number_leds):
        if in_distance > dist_scale[led_index]:
            led_ports[led_index].high()
        else:
            led_ports[led_index].low()

# start our time-of-flight sensor
tof.start()
# loop forever
while True:
    distance = get_distance()
    print(distance)
    led_show_dist(distance)
    time.sleep(0.05)

# clean up
tof.stop()