# ToF Sensor + Motor + Potentiometer + Display

!!! mascot-welcome "Welcome to System Integration!"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    This is one of the most exciting labs in the course — you will combine four different components into one working system! A distance sensor, a motor, a knob, and a display all working together. Let's build something amazing!

**System integration** means making different parts work together as one. This lab is not about one new component — it is about making all the skills you have learned talk to each other.

Here is the system you will build:

- A **VL53L0X ToF sensor** measures how far away an obstacle is.
- A **potentiometer** (a knob) lets you control the motor speed by hand.
- A **DC motor** spins faster or slower based on the knob, and stops when an obstacle is too close.
- An **SSD1306 OLED display** shows the distance, speed, and status on screen.

## Parts You Need

- Raspberry Pi Pico
- VL53L0X Time-of-Flight distance sensor
- DC motor + L293D motor driver (or DRV8833)
- 10kΩ potentiometer
- SSD1306 OLED display (128×64, I2C)
- Jumper wires and breadboard

## Wiring Steps

### OLED Display (I2C)

1. Connect OLED **VCC** to Pico **3.3V**.
2. Connect OLED **GND** to Pico **GND**.
3. Connect OLED **SDA** to **GPIO 0**.
4. Connect OLED **SCL** to **GPIO 1**.

### ToF Distance Sensor (I2C — shares the same bus as OLED)

5. Connect sensor **VCC** to Pico **3.3V**.
6. Connect sensor **GND** to Pico **GND**.
7. Connect sensor **SDA** to **GPIO 0** (same wire as OLED SDA).
8. Connect sensor **SCL** to **GPIO 1** (same wire as OLED SCL).

### Potentiometer

9. Connect one outer leg of the potentiometer to **3.3V**.
10. Connect the other outer leg to **GND**.
11. Connect the middle (wiper) leg to **GPIO 26** (ADC0).

### Motor and Driver

12. Connect motor driver **IN1** to **GPIO 14**.
13. Connect motor driver **IN2** to **GPIO 15**.
14. Connect motor to the driver output terminals.
15. Power the motor driver from **VBUS (5V)**.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Two I2C devices (OLED and ToF sensor) can share the same SDA and SCL wires because each has a unique address. Make sure you do not connect a third I2C device with the same address as the OLED (0x3C) or the VL53L0X (0x29).

## Lab 1: Reading the Potentiometer

Start with just the potentiometer and test that you can read its value.

```python
from machine import ADC, Pin
from utime import sleep

pot = ADC(Pin(26))              # connect potentiometer to GPIO 26 (ADC0)

print("Turn the knob and watch the number change.")
print("Range: 0 (turned all the way left) to 65535 (all the way right)")

while True:
    raw = pot.read_u16()        # read a 16-bit value from the ADC
    # Scale from 0–65535 to 0–100 as a percentage
    percent = int(raw / 65535 * 100)
    print("Pot:", percent, "%")
    sleep(0.2)
```

Turn the knob slowly from one end to the other. The percentage should go smoothly from 0 to 100.

## Lab 2: Reading the Distance Sensor

Test the distance sensor on its own before combining everything.

```python
import machine
import VL53L0X
from utime import sleep

i2c = machine.I2C(0, sda=machine.Pin(0), scl=machine.Pin(1), freq=400000)
tof = VL53L0X.VL53L0X(i2c)
tof.start()

print("Distance sensor ready. Hold objects at different distances.")

while True:
    dist = tof.read()               # distance in millimeters
    print("Distance:", dist, "mm")
    sleep(0.2)
```

## Lab 3: The Full Integrated System

This program combines all four components. The motor speed follows the potentiometer, but automatically stops if an obstacle is closer than 20 cm (200 mm).

```python
import machine
import VL53L0X
from machine import ADC, Pin, PWM, I2C
from utime import sleep
import ssd1306

# --- Set up I2C bus (shared by OLED and ToF sensor) ---
i2c = I2C(0, sda=Pin(0), scl=Pin(1), freq=400000)

# --- Set up OLED display ---
oled = ssd1306.SSD1306_I2C(128, 64, i2c)

# --- Set up distance sensor ---
tof = VL53L0X.VL53L0X(i2c)
tof.start()

# --- Set up potentiometer ---
pot = ADC(Pin(26))

# --- Set up motor PWM outputs ---
motor_fwd = PWM(Pin(14))    # forward signal to motor driver
motor_fwd.freq(1000)        # 1 kHz PWM frequency for motor control

motor_rev = PWM(Pin(15))    # reverse signal to motor driver
motor_rev.freq(1000)
motor_rev.duty_u16(0)       # keep reverse off throughout this lab

STOP_DISTANCE = 200         # stop the motor if obstacle closer than 200 mm

def set_motor_speed(percent):
    # Convert 0–100 percent to 0–65535 PWM duty cycle
    duty = int(percent / 100 * 65535)
    motor_fwd.duty_u16(duty)

def update_display(dist, speed, stopped):
    oled.fill(0)                                      # clear the screen
    oled.text("ToF Motor Lab", 10, 0, 1)             # title at top

    oled.text(f"Dist: {dist} mm", 0, 16, 1)         # distance reading
    oled.text(f"Speed: {speed}%", 0, 30, 1)         # motor speed

    if stopped:
        oled.text("** STOPPED **", 0, 44, 1)        # obstacle warning
    else:
        oled.text("Running...", 0, 44, 1)

    oled.show()                                       # send to display

print("System running. Turn the knob to set speed.")
print("Move your hand in front of the sensor to stop the motor.")

while True:
    # Read the distance sensor
    distance = tof.read()

    # Read the potentiometer (0–65535) and convert to 0–100%
    pot_raw = pot.read_u16()
    speed_pct = int(pot_raw / 65535 * 100)

    # Decide whether to run or stop
    if distance < STOP_DISTANCE:
        set_motor_speed(0)           # obstacle too close — stop the motor
        stopped = True
    else:
        set_motor_speed(speed_pct)   # run the motor at the knob-set speed
        stopped = False

    # Update the OLED display
    update_display(distance, speed_pct, stopped)

    sleep(0.1)                       # update 10 times per second
```

### What Each Section Does

1. `I2C(0, ...)` — one I2C bus serves both the OLED and the distance sensor.
2. `set_motor_speed(percent)` — converts a 0–100% value into the PWM duty cycle the motor driver expects.
3. `if distance < STOP_DISTANCE` — the safety check. Below 200 mm (20 cm), the motor stops regardless of what the knob says.
4. `update_display(...)` — draws the current status on the OLED every cycle.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    This pattern — read sensors, make a decision, control outputs, update display — is the foundation of almost every robot and embedded system. You have just built a complete control loop.

## Experiments

1. Change `STOP_DISTANCE` to 100 mm. Does the motor stop earlier or later?
2. Add a second threshold: slow the motor to 30% when the obstacle is between 200 mm and 400 mm, stop completely below 200 mm.
3. Change the display to show a bar graph of the motor speed instead of a percentage number.
4. Add a buzzer on GPIO 16. Sound a brief beep each time the motor switches from running to stopped.

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You have built a complete integrated system — sensor, control, actuator, and display all working together. This is what real engineering looks like. Every robot in the next chapter uses this same pattern!
