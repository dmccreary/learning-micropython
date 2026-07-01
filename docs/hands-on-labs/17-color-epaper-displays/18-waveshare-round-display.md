# Waveshare Round LCD Display (1.28 inch)

!!! mascot-welcome "Welcome to Round Display Programming!"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Not all displays are rectangles! In this lab you will program the Waveshare RP2040-LCD-1.28 — a beautiful round 240×240 color LCD. It even has a built-in IMU sensor so you can tilt it and see the screen react! Let's build something amazing!

The **Waveshare RP2040-LCD-1.28** is a complete development board with a round 240×240 pixel IPS LCD display built in. It also includes:

- A **QMI8658 IMU** (Inertial Measurement Unit) — measures acceleration and rotation
- A USB-C connector for programming
- A built-in lithium battery charging circuit
- The RP2040 microcontroller (the same chip as in the Raspberry Pi Pico)

The display driver is the **GC9A01** chip, which drives the round LCD through an SPI bus.

## Parts You Need

- Waveshare RP2040-LCD-1.28 board
- USB-C cable for programming

No external wiring is needed — the display, IMU, and Pico are all on one board.

## Loading the Driver

The driver for this display is a custom class called `LCD_1inch28`. Copy the file `LCD_1inch28.py` from `src/displays/waveshare-round/` to the root of the board's filesystem using Thonny.

This driver works like the standard MicroPython `FrameBuffer` — you draw on it using the same `text()`, `fill_rect()`, `fill()`, and `show()` methods you already know.

## Pin Assignments

The display pins are fixed on the board (you cannot change them):

| Signal | GPIO Pin |
|--------|----------|
| SPI Clock (SCK) | 10 |
| SPI Data (MOSI) | 11 |
| Display Reset (RST) | 12 |
| Data/Command (DC) | 8 |
| Chip Select (CS) | 9 |
| Backlight (PWM) | 25 |

The IMU uses I2C:

| Signal | GPIO Pin |
|--------|----------|
| I2C SDA | 6 |
| I2C SCL | 7 |

## Lab 1: Drawing Text and Shapes

This program draws text and colored rectangles on the round display.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    The round display uses 16-bit RGB565 color, not the 1-bit (on/off) color of OLED displays. Colors are stored as 16-bit numbers. `lcd.white` gives you white, `lcd.red` gives red, `lcd.blue` gives blue, and `lcd.green` gives green.

```python
from machine import Pin, I2C, SPI, PWM
from LCD_1inch28 import LCD_1inch28    # import the round display driver
import time

# Create the display object (all pins are set inside the driver class)
lcd = LCD_1inch28()

# Turn on the backlight to full brightness
lcd.set_bl_pwm(65535)             # 65535 = maximum brightness

# Clear the display to white
lcd.fill(lcd.white)

# Draw a red banner across the top
lcd.fill_rect(0, 0, 240, 50, lcd.red)
lcd.text("RP2040-LCD-1.28", 40, 20, lcd.white)   # white text on red

# Draw a blue banner across the bottom
lcd.fill_rect(0, 190, 240, 50, lcd.blue)
lcd.text("MicroPython", 65, 210, lcd.white)

# Draw a colored box in the middle left
lcd.fill_rect(0, 50, 120, 140, 0x1805)            # dark teal color
lcd.text("Hello!", 20, 115, lcd.white)

# Draw a colored box in the middle right
lcd.fill_rect(120, 50, 120, 140, 0xF073)           # pink color
lcd.text("World!", 130, 115, lcd.white)

# Send the frame buffer to the display
lcd.show()

print("Display test complete!")
```

### What Each Line Does

1. `LCD_1inch28()` — sets up SPI, initializes the display controller, and creates the FrameBuffer.
2. `lcd.set_bl_pwm(65535)` — sets the backlight brightness with PWM. Values from 0 (off) to 65535 (full on).
3. `lcd.fill(lcd.white)` — fills the entire 240×240 buffer with white.
4. `lcd.fill_rect(x, y, w, h, color)` — draws a filled rectangle.
5. `lcd.show()` — sends the buffer to the physical display over SPI.

## Lab 2: Reading the IMU (Accelerometer and Gyroscope)

The QMI8658 IMU measures how fast the board is moving (accelerometer) and how fast it is rotating (gyroscope). You can use this to detect tilting, shaking, or dropping.

```python
from machine import Pin, I2C, SPI, PWM, ADC
from LCD_1inch28 import LCD_1inch28, QMI8658
import time

# Create both the display and the IMU
lcd = LCD_1inch28()
lcd.set_bl_pwm(65535)
imu = QMI8658()                   # QMI8658 IMU on I2C

print("IMU ready. Tilt the board and watch the values change.")
print("Format: AX  AY  AZ  GX  GY  GZ")
print("  A = acceleration in g (1g = gravity), G = rotation in degrees/second")

while True:
    xyz = imu.Read_XYZ()          # returns [acc_x, acc_y, acc_z, gyro_x, gyro_y, gyro_z]

    acc_x  = xyz[0]               # acceleration left/right (in g)
    acc_y  = xyz[1]               # acceleration forward/back (in g)
    acc_z  = xyz[2]               # acceleration up/down (in g)
    gyro_x = xyz[3]               # rotation speed around X axis (degrees/second)
    gyro_y = xyz[4]               # rotation speed around Y axis
    gyro_z = xyz[5]               # rotation speed around Z axis

    print(f"ACC: {acc_x:+.2f}g {acc_y:+.2f}g {acc_z:+.2f}g  "
          f"GYRO: {gyro_x:+6.1f} {gyro_y:+6.1f} {gyro_z:+6.1f}")
    time.sleep(0.2)
```

### What Each Line Does

1. `QMI8658()` — creates the IMU object connected via I2C on GPIO 6 (SDA) and GPIO 7 (SCL).
2. `imu.Read_XYZ()` — reads all six values at once: three axes of acceleration and three axes of rotation.
3. `xyz[2]` — the Z axis acceleration. When the board is flat and still, this should be about ±1.0 (gravity).
4. `f"{acc_x:+.2f}g"` — formats the number with a sign (+/-), 2 decimal places, and the unit g.

## Lab 3: Tilt Display — Show IMU Data on Screen

This program combines the display and IMU. It shows the acceleration and gyroscope readings on screen, updating in real time.

```python
from machine import Pin, I2C, SPI, PWM, ADC
from LCD_1inch28 import LCD_1inch28, QMI8658
import time

lcd = LCD_1inch28()
lcd.set_bl_pwm(65535)
imu = QMI8658()

while True:
    xyz = imu.Read_XYZ()

    lcd.fill(lcd.white)            # clear to white each frame

    # Red header
    lcd.fill_rect(0, 0, 240, 40, lcd.red)
    lcd.text("RP2040-LCD-1.28", 40, 12, lcd.white)

    # Blue footer — show battery voltage
    lcd.fill_rect(0, 200, 240, 40, 0x180f)
    from machine import ADC
    vbat_pin = ADC(Pin(29))
    vbat = vbat_pin.read_u16() * 3.3 / 65535 * 2    # voltage divider on pin 29
    lcd.text(f"Vbat={vbat:.2f}V", 65, 212, lcd.white)

    # Left panel — accelerometer
    lcd.fill_rect(0, 40, 120, 160, 0x1805)           # dark teal
    lcd.text("ACC_X={:+.2f}".format(xyz[0]), 5, 75, lcd.white)
    lcd.text("ACC_Y={:+.2f}".format(xyz[1]), 5, 115, lcd.white)
    lcd.text("ACC_Z={:+.2f}".format(xyz[2]), 5, 155, lcd.white)

    # Right panel — gyroscope
    lcd.fill_rect(120, 40, 120, 160, 0xF073)         # pink
    lcd.text("GYR_X={:.1f}".format(xyz[3]), 125, 75, lcd.white)
    lcd.text("GYR_Y={:.1f}".format(xyz[4]), 125, 115, lcd.white)
    lcd.text("GYR_Z={:.1f}".format(xyz[5]), 125, 155, lcd.white)

    lcd.show()                     # send to display
    time.sleep(0.1)                # update 10 times per second
```

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    When the board is lying flat and still, `ACC_Z` should read about 1.0 (one unit of gravity pulling down). Tilt the board sideways and watch `ACC_X` or `ACC_Y` change. Shake the board and all three values spike.

## Understanding RGB565 Colors

The round display uses **RGB565** color format. Each pixel is a 16-bit number. The bits are divided:
- 5 bits for red (0–31)
- 6 bits for green (0–63)
- 5 bits for blue (0–31)

To make a custom color, use the formula: `(red << 11) | (green << 5) | blue`

Some examples:
- Pure red: `(31 << 11)` = `0xF800`
- Pure green: `(63 << 5)` = `0x07E0`
- Pure blue: `31` = `0x001F`
- White: `0xFFFF`
- Black: `0x0000`

## Experiments

1. Tilt the board to different angles. Can you detect when the board is exactly flat (`ACC_Z` near 1.0)?
2. Add a bubble-level indicator: draw a small circle that moves based on `ACC_X` and `ACC_Y`. When the board is flat, the circle is in the center.
3. Shake the board hard. What is the maximum `ACC_Z` value you can read during a shake?
4. Change the backlight brightness: use `lcd.set_bl_pwm(value)` with values like 10000, 30000, 65535 to see the difference.

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You have programmed a round full-color display and read live data from a motion sensor! These skills combine hardware, graphics, and physics in one project. Great work, coder — keep exploring!
