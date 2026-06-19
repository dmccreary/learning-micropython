# OLED Ping (Distance Sensor Display)

!!! mascot-welcome "Welcome to OLED Ping"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will connect an ultrasonic distance sensor to your OLED display. Press a button to take a measurement and see the distance on screen! Let's build something amazing!

An **ultrasonic sensor** (like the HC-SR04) measures distance by sending out a sound pulse and waiting for the echo to return. The longer the echo takes to come back, the farther away the object is.

In this lab, you will press a button to turn measuring on and off. The distance will show on the OLED display.

## Circuit

![OLED Ping circuit diagram showing Pico, HC-SR04 sensor, button, and OLED display](../../img/oled-ping-circuit.png)

## Wiring Steps

1. Connect the OLED GND to Pico GND.
2. Connect the OLED VCC to Pico 3.3V.
3. Connect the OLED SDA to Pico GP0.
4. Connect the OLED SCL to Pico GP1.
5. Connect the HC-SR04 trigger pin to Pico GP14.
6. Connect the HC-SR04 echo pin to Pico GP13.
7. Connect the HC-SR04 VCC to Pico 5V (VBUS) and GND to Pico GND.
8. Connect one leg of the button to Pico GP16 and the other to Pico GND.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The button uses a **debounce** timer. When you press a button, it can "bounce" and register many presses in one touch. A timer waits 200 milliseconds before acting — long enough for the bounce to settle.

## Code

```py
from machine import Pin, I2C, Timer   # import pin, I2C, and timer tools
from ssd1306 import SSD1306_I2C       # import the display driver
import utime                          # import the time library

# this variable tracks whether distance measuring is on or off
measure_on = False                    # start with measuring turned off

# called when the button is first pressed — starts a short timer to debounce
def debounce(pin):
    timer.init(mode=Timer.ONE_SHOT, period=200, callback=on_pressed)  # wait 200ms then run on_pressed

# called after the debounce timer fires — toggles measuring on/off
def on_pressed(timer):
    global measure_on                 # we need to change the global variable
    measure_on = not measure_on       # flip: if True becomes False, if False becomes True

# set up the button on GP16 with an internal pull-down resistor
button = Pin(16, Pin.IN, Pin.PULL_DOWN)
timer  = Timer()                      # create a timer object for debouncing
button.irq(debounce, Pin.IRQ_RISING)  # call debounce() when the button is pressed

# set up the OLED display on GP0 (SDA) and GP1 (SCL)
i2c  = I2C(0, sda=Pin(0), scl=Pin(1), freq=40000)  # create the I2C connection
oled = SSD1306_I2C(128, 64, i2c)                    # create the display object

# set up the HC-SR04 sensor pins
trigger = Pin(14, Pin.OUT)   # trigger sends the sound pulse out
echo    = Pin(13, Pin.IN)    # echo listens for the pulse to return

# measure the distance in centimeters
def measure_distance():
    trigger.low()                           # make sure the trigger is off
    utime.sleep_us(2)                       # wait 2 microseconds
    trigger.high()                          # send a short sound pulse
    utime.sleep_us(5)                       # pulse lasts 5 microseconds
    trigger.low()                           # stop the pulse

    while echo.value() == 0:               # wait for the echo to start
        signal_start = utime.ticks_us()    # record when echo goes high

    while echo.value() == 1:               # wait for the echo to end
        signal_end = utime.ticks_us()      # record when echo goes low

    time_elapsed = signal_end - signal_start          # how long the echo lasted (microseconds)
    distance_cm  = (time_elapsed * 0.0343) / 2        # convert time to centimeters
    return distance_cm

try:
    while True:
        oled.fill(0)                        # clear the display to black
        if measure_on:                      # only show distance if measuring is turned on
            result = measure_distance()             # get the distance
            oled.text("Distance:", 0, 0)            # draw the label at the top
            oled.text(str(result) + " cm", 0, 10)  # draw the distance value below
        oled.show()                         # send the drawing to the screen
        utime.sleep(1)                      # wait one second before the next reading
except KeyboardInterrupt:
    pass                                    # stop gracefully when you press Ctrl+C
```

**What each section does:**

1. `measure_on = False` — starts with measuring turned off. The button toggles this.
2. `debounce(pin)` — called when the button is pressed. It starts a 200-millisecond timer instead of acting immediately.
3. `on_pressed(timer)` — called when the timer fires. It flips `measure_on` between True and False.
4. `button.irq(debounce, Pin.IRQ_RISING)` — tells MicroPython to call `debounce()` every time GP16 goes from low to high (button pressed).
5. `measure_distance()` — sends a sound pulse, times the echo, and converts the time to centimeters.
6. `(time_elapsed * 0.0343) / 2` — the speed of sound is about 343 meters per second (0.0343 cm per microsecond). Dividing by 2 accounts for the pulse travelling to the object and back.
7. `if measure_on` — only displays the distance if the button has turned measuring on.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    If the distance reading seems wrong, make sure your sensor is powered from VBUS (5V), not 3.3V. The HC-SR04 needs 5V to work correctly.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Keep objects at least 2 cm away from the sensor. Very close objects can confuse the timing and give wrong readings.

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You connected a real sensor to your display and used a button to control the program! Next, you will build a two-player Pong game on the same display.
