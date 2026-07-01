# Elecrow Advanced Sensor Kit

!!! mascot-welcome "Welcome to the Elecrow Advanced Kit!"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    This kit takes everything you have learned and puts it together. You will use a motion sensor, a light sensor, a 4-digit display, LEDs, a buzzer, and RFID cards — all controlled from your Pico. Let's build something amazing!

The **Elecrow Advanced Sensor Kit** is a collection of components that work together on a development board. It includes:

- **TM1637 4-digit 7-segment display** — shows numbers and simple text
- **PIR motion sensor** — detects when a person or animal moves nearby
- **Photoresistor (light sensor)** — measures how bright the light is
- **RGB LED** — shows color by mixing red, green, and blue
- **Buzzer** — makes beeping sounds
- **Laser module** — shines a tiny dot of red light
- **RFID module** — reads and writes data to key fobs and cards
- **Rotary encoder** — a knob you can turn and click

This page covers the most useful programs from the kit. Each lab focuses on one component at a time, then a final project combines them.

## Installing the TM1637 Driver

The 4-digit display uses a driver library. Copy `tm1637.py` from `src/kits/elecrow-adv/` to the root folder on your Pico.

## Lab 1: TM1637 4-Digit Display

The **TM1637** is a two-wire display controller. You connect just a clock wire and a data wire, and it drives all four digit segments.

**Wiring:**

1. Connect display **CLK** to **GPIO 1**.
2. Connect display **DIO** to **GPIO 0**.
3. Connect display **VCC** to **3.3V**.
4. Connect display **GND** to **GND**.

```python
import tm1637
from machine import Pin
from utime import sleep

CLK_PIN = 1
DIO_PIN = 0

# Create the display object
tm = tm1637.TM1637(clk=Pin(CLK_PIN), dio=Pin(DIO_PIN))

# Show a number
tm.number(1234)              # displays "1234"
sleep(1)

# Show a time (with colon between digits 2 and 3)
tm.numbers(12, 59)           # displays "12:59" with the colon lit
sleep(1)

# Show scrolling text
tm.scroll("Hello World")    # scrolls text across the 4 digits

# Show temperature
tm.temperature(24)          # displays "24°C"
sleep(1)
```

### What Each Line Does

1. `tm1637.TM1637(clk=..., dio=...)` — creates the display driver.
2. `tm.number(1234)` — shows any number from -999 to 9999.
3. `tm.numbers(12, 59)` — shows two separate two-digit numbers with the colon between them. Great for clocks.
4. `tm.scroll("Hello World")` — scrolls text at about 4 characters per second.
5. `tm.temperature(24)` — shows a temperature with the degree symbol.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The TM1637 only has two wires for data (CLK and DIO). It uses a special timing protocol — not I2C or SPI. The `tm1637.py` library handles all the timing for you.

## Lab 2: PIR Motion Sensor + Light Sensor

The **PIR (Passive Infrared) sensor** detects the heat signature of moving people or animals. The **photoresistor** measures brightness. This lab turns on an RGB LED only when motion is detected AND the room is dark enough.

**Wiring:**

1. Connect photoresistor (light sensor) ADC output to **GPIO 26** (ADC0).
2. Connect PIR sensor signal to **GPIO 1**.
3. Connect RGB LED red to **GPIO 2**, green to **GPIO 3**, blue to **GPIO 4** (each through a 330Ω resistor).

```python
from machine import Pin, PWM, ADC
from utime import sleep

# Sensor inputs
light_sensor = ADC(Pin(26))        # photoresistor on ADC pin
pir          = Pin(1, Pin.IN, Pin.PULL_DOWN)  # PIR sensor

# RGB LED outputs (PWM for brightness control)
led_r = PWM(Pin(2))
led_g = PWM(Pin(3))
led_b = PWM(Pin(4))
led_r.freq(2000)
led_g.freq(2000)
led_b.freq(2000)

def set_rgb(r, g, b):
    # Set LED brightness (0=off, 65535=full on)
    led_r.duty_u16(r)
    led_g.duty_u16(g)
    led_b.duty_u16(b)

DARK_THRESHOLD = 35000    # ADC value below this = room is dark (0=bright, 65535=dark)

print("Motion + light sensor active.")
print("The LED lights up when motion is detected AND the room is dark.")

while True:
    light_level = light_sensor.read_u16()    # higher = darker
    motion      = pir.value()               # 1 = motion detected, 0 = no motion

    print(f"Light: {light_level}  Motion: {motion}")

    if motion == 1 and light_level > DARK_THRESHOLD:
        set_rgb(65535, 65535, 65535)        # white light — motion in the dark!
    else:
        set_rgb(0, 0, 0)                    # off

    sleep(0.1)
```

### What Each Line Does

1. `ADC(Pin(26))` — reads a voltage from the photoresistor using Analog-to-Digital Conversion.
2. `Pin(1, Pin.IN, Pin.PULL_DOWN)` — sets the PIR pin as an input with an internal pull-down resistor.
3. `pir.value()` — returns 1 when motion is detected, 0 when still.
4. `light_level > DARK_THRESHOLD` — the photoresistor gives a higher ADC value when it is darker.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    The PIR sensor has a warm-up period of about 30 seconds after you plug it in. During that time it may trigger randomly. Wait for it to settle before testing.

## Lab 3: Stoplight with Countdown Timer

This project combines the TM1637 display and three LEDs to make a working stoplight. The red light shows a 30-second countdown, then the yellow light flashes briefly, then the green light stays on for 10 seconds.

**Wiring:**

1. TM1637: CLK → **GPIO 1**, DIO → **GPIO 0**.
2. Red LED → **GPIO 0** (through 330Ω resistor to GND).
3. Yellow LED → **GPIO 1** (through 330Ω resistor to GND).
4. Green LED → **GPIO 2** (through 330Ω resistor to GND).

```python
import tm1637
from machine import Pin
from utime import sleep

tm    = tm1637.TM1637(clk=Pin(1), dio=Pin(0))

red    = Pin(0, Pin.OUT)
yellow = Pin(1, Pin.OUT)
green  = Pin(2, Pin.OUT)

def all_off():
    red.value(0)
    yellow.value(0)
    green.value(0)

while True:
    # Red phase — count down from 30 seconds
    all_off()
    red.value(1)                           # red light on
    for countdown in range(30, 0, -1):     # count from 30 down to 1
        tm.number(countdown)               # show the count on the display
        sleep(1)                           # wait one second

    # Yellow phase — flash three times
    all_off()
    for _ in range(5):
        yellow.value(1)
        sleep(0.3)
        yellow.value(0)
        sleep(0.3)

    # Green phase — 10 seconds
    all_off()
    green.value(1)
    tm.number(10)
    sleep(10)
```

### What Each Line Does

1. `for countdown in range(30, 0, -1)` — counts from 30 down to 1 (stepping by -1 each loop).
2. `tm.number(countdown)` — shows the current countdown value on the 4-digit display.
3. `sleep(1)` — waits exactly one second between each countdown step.

## Lab 4: Police Car Lights

This fun project uses a PWM buzzer and an RGB LED to imitate a police car's flashing lights and siren.

**Wiring:**

1. RGB LED: red → **GPIO 4**, green → **GPIO 3**, blue → **GPIO 2** (each through 330Ω).
2. Buzzer → **GPIO 15**.

```python
from machine import Pin, PWM
from utime import sleep

led_r   = PWM(Pin(4))
led_g   = PWM(Pin(3))
led_b   = PWM(Pin(2))
buzzer  = PWM(Pin(15))

led_r.freq(2000)
led_g.freq(2000)
led_b.freq(2000)
buzzer.duty_u16(1000)    # set a low volume

try:
    while True:
        # Blue flash with low tone
        buzzer.freq(750)
        led_r.duty_u16(0)
        led_g.duty_u16(0)
        led_b.duty_u16(65535)    # blue light
        sleep(0.23)

        # Red flash with high tone
        buzzer.freq(1550)
        led_r.duty_u16(65535)    # red light
        led_g.duty_u16(0)
        led_b.duty_u16(0)
        sleep(0.1)

except KeyboardInterrupt:
    buzzer.duty_u16(0)           # always silence the buzzer on Ctrl-C
    print("Siren off")
```

### What Each Line Does

1. `buzzer.duty_u16(1000)` — sets the buzzer to a low volume (1000 out of 65535).
2. `buzzer.freq(750)` — sets the low tone for the siren sweep.
3. `buzzer.freq(1550)` — sets the high tone for the siren sweep.
4. `except KeyboardInterrupt` — catches Ctrl-C and silences the buzzer cleanly.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Always silence the buzzer before your program ends. If you do not set `buzzer.duty_u16(0)`, the tone keeps playing until you unplug the Pico. Use `try/except KeyboardInterrupt` to catch Ctrl-C.

## Experiments

1. In Lab 1, display the current time using `tm.numbers(hours, minutes)`. Set the starting hours and minutes as variables at the top of the program and increment them using a loop.
2. In Lab 2, add the TM1637 display and show the light sensor reading on screen. This turns it into a simple light meter.
3. In Lab 3, change the 30-second countdown to count faster — try `sleep(0.5)` instead of `sleep(1)`.
4. In Lab 4, add a second alternating pattern: green-blue instead of red-blue.

!!! mascot-celebration "Advanced Kit Complete!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You have used five different components from the Elecrow Advanced Kit! You can now combine these into your own projects — a light-activated alarm, a countdown game timer, or a color-changing lamp. Great work, coder!
