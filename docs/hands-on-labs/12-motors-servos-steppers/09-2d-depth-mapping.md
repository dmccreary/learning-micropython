# 2D Depth Mapping with Servos and a ToF Sensor

!!! mascot-welcome "Welcome to Depth Mapping!"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab you will build a simple 3D scanner! Two servos will sweep a laser distance sensor across a scene, and your Pico will record how far away each point is. You will turn those distances into a 2D depth map. Let's build something amazing!

A **depth map** is a grid of distance measurements. Each cell in the grid stores how far away something is at that angle. By sweeping a sensor in two directions — left-right and up-down — you can create a picture where near objects are represented by small numbers and far objects by large numbers.

This technique is used in robots, self-driving cars, and 3D cameras.

## Parts You Need

- Raspberry Pi Pico
- 2 standard servo motors (SG90 or similar)
- VL53L0X Time-of-Flight (ToF) distance sensor
- Pan-tilt bracket or homemade cardboard mount
- 5 jumper wires
- Breadboard

## How It Works

A **Time-of-Flight (ToF)** sensor shoots a tiny laser pulse and measures how long it takes to bounce back. Since light travels at a known speed, the time gives you the distance. The VL53L0X measures distances from about 5 cm to 200 cm.

Two servos move the sensor:
- The **horizontal servo** sweeps left and right (X axis).
- The **vertical servo** tilts up and down (Y axis).

The Pico moves the sensor to each position, waits a moment, reads the distance, and records it. After the full sweep, you have a grid of distances.

## Wiring Steps

### Servos

Servo wires are usually brown (GND), red (5V), and orange or yellow (signal).

1. Connect both servo **GND** wires to any **GND** pin on the Pico.
2. Connect both servo **VCC** wires to the **VBUS (5V)** pin on the Pico.
3. Connect the **horizontal servo signal** wire to **GPIO 14**.
4. Connect the **vertical servo signal** wire to **GPIO 15**.

### VL53L0X Sensor

5. Connect **VCC** to the Pico's **3.3V** pin.
6. Connect **GND** to any **GND** pin on the Pico.
7. Connect **SDA** to **GPIO 0** on the Pico.
8. Connect **SCL** to **GPIO 1** on the Pico.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Servo motors can draw a lot of current. Power them from VBUS (5V from USB), not from the 3.3V pin. Using 3.3V to power servos can crash your Pico.

## Installing the Driver

Copy `VL53L0X.py` from `src/drivers/` to the root folder on your Pico. This is the driver for the distance sensor.

## Lab 1: Testing the Distance Sensor

Before scanning, test that the VL53L0X is working on its own.

```python
import machine
import VL53L0X

# Set up I2C for the distance sensor
sda = machine.Pin(0)
scl = machine.Pin(1)
i2c = machine.I2C(0, sda=sda, scl=scl, freq=400000)

# Create the sensor object and start it
tof = VL53L0X.VL53L0X(i2c)
tof.start()

print("Distance sensor ready. Hold objects in front of it.")

while True:
    dist = tof.read()                    # read distance in millimeters
    print("Distance:", dist, "mm")
    import time
    time.sleep(0.2)
```

Hold your hand at different distances from the sensor. You should see values change smoothly.

## Lab 2: Testing Servo Movement

Before scanning, test that both servos move correctly.

```python
from machine import Pin, PWM
from time import sleep

# Set up both servo PWM signals at 50 Hz (the standard servo frequency)
horizontal = PWM(Pin(14))
horizontal.freq(50)

vertical = PWM(Pin(15))
vertical.freq(50)

# PWM duty cycle values for servo positions
# duty_u16 range: 0 to 65535
# Typical servo range: ~3000 (one extreme) to ~9000 (other extreme)
CENTER = 6000       # roughly center position

print("Moving horizontal servo left to right...")
for pos in range(3000, 9000, 100):     # sweep from left to right
    horizontal.duty_u16(pos)
    sleep(0.02)

print("Moving vertical servo up to down...")
for pos in range(7500, 9000, 50):      # sweep down
    vertical.duty_u16(pos)
    sleep(0.02)

for pos in range(9000, 7500, -50):     # sweep back up
    vertical.duty_u16(pos)
    sleep(0.02)
```

Adjust the range values until each servo moves through the angle you want to scan.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Servo positions differ between motors and brackets. Start with small ranges and widen them slowly to avoid forcing the servo against a hard stop, which can damage the gears.

## Lab 3: Running a Full 2D Scan

This program sweeps the sensor across a grid and prints the depth map as a Python list. You can then copy and paste that list into a visualization script on your computer.

```python
import machine
import VL53L0X
from machine import Pin, PWM
from time import sleep

# Set up the distance sensor
sda = machine.Pin(0)
scl = machine.Pin(1)
i2c = machine.I2C(0, sda=sda, scl=scl, freq=400000)
tof = VL53L0X.VL53L0X(i2c)
tof.start()

# Set up both servo motors
hpwm = PWM(Pin(14))     # horizontal (left-right)
hpwm.freq(50)
vpwm = PWM(Pin(15))     # vertical (up-down)
vpwm.freq(50)

# Scan boundaries — adjust these for your setup
HORZ_MIN   = 3000       # leftmost horizontal position
HORZ_MAX   = 4000       # rightmost horizontal position
VERT_TOP   = 7500       # highest vertical position (top of scan)
VERT_BOT   = 9000       # lowest vertical position (bottom of scan)
STEP       = 25         # how many PWM steps between measurements

H_DELAY = 0.05          # wait time (seconds) after moving horizontal servo
V_DELAY = 0.04          # wait time (seconds) after moving vertical servo
UP_DELAY = 0.01         # fast return delay when resetting vertical position

def read_distance():
    dist = tof.read() - 20            # subtract 20 mm sensor offset
    return max(0, dist)               # never return a negative distance

print("depth = [")                    # start of Python list output

for h_pos in range(HORZ_MIN, HORZ_MAX, STEP):
    hpwm.duty_u16(h_pos)             # move to this horizontal position
    sleep(H_DELAY)                   # wait for servo to settle

    print("[", end="")               # start a new row in the list
    first = True
    for v_pos in range(VERT_TOP, VERT_BOT, STEP):
        vpwm.duty_u16(v_pos)         # move to this vertical position
        sleep(V_DELAY)
        dist = read_distance()       # read the distance

        if first:
            first = False
        else:
            print(", ", end="")
        print(dist, end="")          # print the distance value

    # Check if this is the last row
    if h_pos + STEP >= HORZ_MAX:
        print("]")                   # last row, no trailing comma
    else:
        print("],")                  # more rows coming, add comma

    # Return the vertical servo to the top quickly
    for v_pos in range(VERT_BOT, VERT_TOP, -STEP):
        vpwm.duty_u16(v_pos)
        sleep(UP_DELAY)

print("]")                           # close the outer list
print("Scan complete!")
```

### What Each Section Does

1. **Outer loop** (`h_pos`) — moves the horizontal servo one step at a time.
2. **Inner loop** (`v_pos`) — sweeps the vertical servo down for each horizontal position.
3. `read_distance()` — reads the sensor and subtracts a small offset to improve accuracy.
4. **Return sweep** — after each vertical column, the vertical servo quickly returns to the top.

The output looks like a Python list of lists. Copy it from the Thonny console and paste it into a Python script on your computer to visualize it.

## Visualizing the Depth Map

After the scan, the Pico prints a `depth` variable. Run this on your regular computer (not the Pico) to see a simple ASCII visualization:

```python
# Run this on your computer, not on the Pico
# Paste your depth array here
depth = [
    [120, 115, 110, 108],
    [125, 118, 112, 105],
    [130, 122, 115, 108],
]

for row in depth:
    for val in row:
        # Scale 0–500 mm to a character: near = #, far = space
        scaled = max(0, min(9, (val // 50)))
        chars = " .:-=+*#%@"
        print(chars[9 - scaled], end="")
    print()                          # new line after each row
```

## Experiments

1. Change `STEP` from 25 to 50. The scan takes half as long but has lower resolution.
2. Scan a room corner. The distance should increase as the sensor moves away from the corner toward open space.
3. Scan a person sitting in a chair. Can you see the shape of their head and shoulders in the depth values?
4. Add a progress indicator: print a dot every time a row completes so you know the scan is running.

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You just built a 3D scanner with two servos and a distance sensor! The same principle is used in LIDAR systems on robots and self-driving cars. Next, you will combine a motor, distance sensor, and display in one project.
