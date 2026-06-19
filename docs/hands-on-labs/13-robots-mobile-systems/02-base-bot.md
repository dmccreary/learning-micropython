# Raspberry Pi Pico MicroPython Base Robot

![Pico Bot](../imb/../../img/pico-bot.jpg)

!!! mascot-welcome "Welcome to the Base Bot Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    This is your first robot! You will wire up the parts, write a program, and watch your robot drive around on its own. Let's build it together!

In this lab you will build the base robot. All the other robot projects in this section build on top of what you make here. The robot is programmed entirely in Python, so it fits right in with the Python skills you are learning.

## Base Robot Design

Our goal is a robot platform for learning computational thinking. Computational thinking means breaking a big problem into small steps that a computer can follow. Here are the main design goals:

1. Low cost (under $25) so that most students can build their own robot.
2. Open platform so you can upgrade and swap parts easily.
3. Interchangeable parts that work with many different robots.
4. Very little soldering needed.

## Video

Here is a video of the collision avoidance robot in action:

<iframe width="560" height="315" src="https://www.youtube.com/embed/0d3tF1oXu90" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

[YouTube Video](https://youtu.be/0d3tF1oXu90)

You can see the forward speed and the turning distance in the video. The robot bumped a wall once — that happens when the turning threshold is set too high. You will learn how to fix that.

## Connection Diagram

Here is the connection diagram for the base robot. Use this diagram when you wire up your parts.

![Base Bot Connection Diagram](../../img/base-bot-connection-diagram.png)

## Power Regulation

The robot gets power from a battery pack at 6 volts. That power goes into the motor controller board. The motor controller has a voltage regulator inside it. A voltage regulator is a chip that turns one voltage into a lower, steady voltage. The motor controller turns 6–12 volts into a steady 5 volts. That 5 volts powers the Pico through the VSYS pin. The Pico has its own voltage regulator that brings the 5 volts down to 3.3 volts. The 3.3 volt output (the 3V3 OUT pin) powers the distance sensor.

!!! mascot-warning "Watch the Battery Level"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    When batteries get low, the voltage drops below 5 volts. Then the 3.3 volt output becomes unstable and the sensor gives bad readings. Replace your batteries if the robot starts behaving strangely.

## Hardware Description

Here is a summary of the main parts and their prices as of June 2021. Some parts ship from overseas and may take 2–3 weeks to arrive.

![Pico Bot Parts List](../../img/pico-bot-parts-list.png)

Here is a Google Sheet with all the parts:

[Detailed Parts List Google Sheet](https://docs.google.com/spreadsheets/d/1I6PwM470JuRHZVHkg1uiMuoXlsIpyv0Ak2ayZP8VWFc/edit?usp=sharing)

### Two Wheel Drive Smart Car Chassis

All robots in this course use a standard two-wheel drive (2WD) SmartCar Chassis. 2WD means two powered wheels and one free-rolling caster wheel. You can find these online from many sellers.

- [$5 Cytron 2WD Smart Car Chassis](https://www.cytron.io/p-2wd-smart-robot-car-chassis)
- [YouTube Video of Assembly](https://www.youtube.com/watch?v=H78t6dnSoG0) — Note: the video does not remove the backing paper from the plastic and mounts the battery on top. We prefer the battery on the bottom.

### Motor Driver

![Motor Driver](../../img/parts/motor-driver.png)

The motor driver is a board that takes small signals from the Pico and uses them to control the motors. The motors need more power than the Pico can deliver directly, so the motor driver acts as a power amplifier.

## Software

All software for this robot is written in MicroPython.

### Time-of-Flight Distance Sensor

![ToF Sensor](../../img/parts/tof-sensor-GYUN530K.jpg)

This robot uses the VL53L0X time-of-flight distance sensor. A time-of-flight sensor works by shooting a tiny laser pulse at an object and measuring how long it takes for the light to come back. This is very accurate and reliable. The sensor talks to the Pico using the I2C (Inter-Integrated Circuit) bus. I2C is a way to connect multiple devices to the Pico using just two wires — one for data and one for a clock signal.

After you wire up power (VCC to the 3.3 volt rail and GND to ground), connect the I2C data and clock pins:

```py
sda = machine.Pin(16)  # data wire — lower right corner of the Pico (USB on top)
scl = machine.Pin(17)  # clock wire — one pin up from the lower right corner
i2c = machine.I2C(0, sda=sda, scl=scl)  # set up the I2C bus using those pins
```

#### What each line does

- `sda = machine.Pin(16)` — names pin 16 as the data line (SDA stands for Serial Data)
- `scl = machine.Pin(17)` — names pin 17 as the clock line (SCL stands for Serial Clock)
- `i2c = machine.I2C(0, sda=sda, scl=scl)` — creates the I2C connection using those two pins

Older robots in this course used ultrasonic ping sensors. Ping sensors become unreliable when batteries run low, so we switched to the time-of-flight sensor.

### Testing the Sensor Connections with the I2C Scanner

Run this short program to check that the sensor is wired correctly:

```py
import machine

sda = machine.Pin(16)  # data wire pin
scl = machine.Pin(17)  # clock wire pin
i2c = machine.I2C(0, sda=sda, scl=scl)  # set up I2C bus

print("Device found at decimal", i2c.scan())  # print all I2C addresses found
```

#### What each line does

- `import machine` — loads the MicroPython library for hardware control
- `i2c.scan()` — checks the I2C bus and returns a list of device addresses
- `print(...)` — shows the result in the console

You should see a number printed in the console. The VL53L0X sensor normally shows up at address 41 (decimal), which is the same as 0x29 (hexadecimal).

### Download the VL53L0X Driver

The VL53L0X sensor needs a driver file saved on the Pico. A driver is a piece of code that knows how to talk to a specific piece of hardware.

Download the driver here: [VL53L0X.py](https://raw.githubusercontent.com/CoderDojoTC/micropython/main/src/drivers/VL53L0X.py)

Save that file as `VL53L0X.py` on your Pico using Thonny.

### Time-of-Flight Sensor Test

Once the driver file is saved on the Pico, run this test:

```py
import time
from machine import Pin, I2C
import VL53L0X  # the driver you just downloaded

sda = machine.Pin(16)  # data pin
scl = machine.Pin(17)  # clock pin
i2c = machine.I2C(0, sda=sda, scl=scl)  # set up I2C

tof = VL53L0X.VL53L0X(i2c)  # create the sensor object using the I2C bus
tof.start()  # tell the sensor to start measuring

while True:
    dist = tof.read()   # read the distance in millimeters
    print(dist)         # show the distance in the console
    time.sleep(0.1)     # wait 1/10 of a second before reading again
```

#### What each line does

- `tof = VL53L0X.VL53L0X(i2c)` — creates a sensor object so your code can talk to the sensor
- `tof.start()` — wakes up the sensor and tells it to start taking measurements
- `tof.read()` — returns the distance to the nearest object in millimeters
- `time.sleep(0.1)` — pauses for 0.1 seconds between readings

Numbers will appear in the console. About 30 means an object is very close. About 1300 means the object is about 1.3 meters away.

### Motor Drive Test

After you connect the four motor wires to the motor driver, run this test to check that each wheel spins in the right direction:

```py
from machine import Pin, PWM  # PWM = Pulse Width Modulation, used to control motor speed
import time

POWER_LEVEL = 65025  # maximum power — a number from 0 (off) to 65025 (full speed)

# Pin numbers for the four motor control signals
RIGHT_FORWARD_PIN = 21
RIGHT_REVERSE_PIN = 20
LEFT_FORWARD_PIN  = 18
LEFT_REVERSE_PIN  = 19

# Create a PWM object for each pin
right_forward = PWM(Pin(RIGHT_FORWARD_PIN))
right_reverse  = PWM(Pin(RIGHT_REVERSE_PIN))
left_forward   = PWM(Pin(LEFT_FORWARD_PIN))
left_reverse   = PWM(Pin(LEFT_REVERSE_PIN))

def spin_wheel(pwm):
    pwm.duty_u16(POWER_LEVEL)  # set the power level to spin the wheel
    time.sleep(3)              # spin for 3 seconds
    pwm.duty_u16(0)            # stop the wheel
    time.sleep(2)              # wait 2 seconds before the next test

while True:
    print('right forward')
    spin_wheel(right_forward)

    print('right reverse')
    spin_wheel(right_reverse)

    print('left forward')
    spin_wheel(left_forward)

    print('left reverse')
    spin_wheel(left_reverse)
```

#### What each line does

- `PWM(Pin(21))` — sets up Pulse Width Modulation on pin 21 (PWM lets you control speed)
- `duty_u16(POWER_LEVEL)` — sets the motor power from 0 (off) to 65025 (full)
- `duty_u16(0)` — stops the motor by setting power to zero

!!! mascot-tip "Right vs. Left — It's Confusing!"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    "Right" and "Left" mean the robot's right and left — as if you were sitting inside it facing forward. If the robot is facing you, its "right" wheel is on your left side. Think of it like driving a car.

Watch which wheels spin and in which direction. If a wheel spins backwards when you expect it to go forward, swap the wires for that wheel on the motor driver.

### Sample Drive and Turn Functions

Your robot needs five basic movements:

1. Forward — both wheels spin forward
2. Reverse — both wheels spin backward
3. Turn Right — right wheel goes backward, left wheel goes forward
4. Turn Left — left wheel goes backward, right wheel goes forward
5. Stop — all motors off

For each movement, you must set all four PWM signals. Never run a motor forward and backward at the same time.

```py
def turn_motor_on(pwm):
    pwm.duty_u16(POWER_LEVEL)  # set full power on this motor

def turn_motor_off(pwm):
    pwm.duty_u16(0)  # set power to zero (stop this motor)

def forward():
    turn_motor_on(right_forward)   # right wheel spins forward
    turn_motor_on(left_forward)    # left wheel spins forward
    turn_motor_off(right_reverse)  # make sure right is not in reverse
    turn_motor_off(left_reverse)   # make sure left is not in reverse

def reverse():
    turn_motor_on(right_reverse)   # right wheel spins backward
    turn_motor_on(left_reverse)    # left wheel spins backward
    turn_motor_off(right_forward)  # make sure right is not going forward
    turn_motor_off(left_forward)   # make sure left is not going forward

def turn_right():
    turn_motor_on(right_forward)   # right wheel goes forward
    turn_motor_on(left_reverse)    # left wheel goes backward — robot pivots right
    turn_motor_off(right_reverse)
    turn_motor_off(left_forward)

def turn_left():
    turn_motor_on(right_reverse)   # right wheel goes backward — robot pivots left
    turn_motor_on(left_forward)    # left wheel goes forward
    turn_motor_off(right_forward)
    turn_motor_off(left_reverse)

def stop():
    turn_motor_off(right_forward)  # stop all four motors
    turn_motor_off(right_reverse)
    turn_motor_off(left_forward)
    turn_motor_off(left_reverse)
```

### Turning Logic

This is the main decision loop. It reads the sensor and decides what to do:

```py
while True:
    dist = read_sensor()          # get the current distance reading
    if dist < TURN_THRESHOLD:     # if something is too close...
        print('object detected')
        reverse()                 # back up
        sleep(BACKUP_TIME)        # wait while backing up
        turn_right()              # turn to find a new path
        sleep(TURN_TIME)          # wait while turning
    else:
        forward()                 # nothing close — keep going forward
```

### Stop All Motors Program

PWM signals keep running on the Pico even after your main program stops. This is because the Pico uses a separate built-in processor to generate those signals. Save this as a separate file called `stop-all-motors.py` and keep it open in Thonny so you can run it quickly:

```py
from machine import Pin, PWM

# Same pin numbers as your main program
RIGHT_FORWARD_PIN = 19
RIGHT_REVERSE_PIN = 21
LEFT_FORWARD_PIN  = 18
LEFT_REVERSE_PIN  = 20

# Create PWM objects for each pin
right_forward = PWM(Pin(RIGHT_FORWARD_PIN))
right_reverse  = PWM(Pin(RIGHT_REVERSE_PIN))
left_forward   = PWM(Pin(LEFT_FORWARD_PIN))
left_reverse   = PWM(Pin(LEFT_REVERSE_PIN))

# Set all motor powers to zero
right_forward.duty_u16(0)
right_reverse.duty_u16(0)
left_forward.duty_u16(0)
left_reverse.duty_u16(0)
```

#### What each line does

- Each `PWM(Pin(...))` line reconnects to the motor control pin.
- Each `duty_u16(0)` line cuts the power to that motor.

### Collision Avoidance Logic

The full program combines the sensor and the motor functions. The robot reads the distance, and if something is too close it backs up and turns. Otherwise it drives forward.

## Final Program

To run the robot on battery power without a computer, save the program as `main.py` on the Pico. The Pico runs `main.py` automatically when it powers up.

!!! Note
    Make sure you have the VL53L0X distance sensor driver saved on the Pico before running this program.

```py
from machine import Pin, PWM
from utime import sleep
import VL53L0X
import machine

# On-board LED — used to show the robot's state
led_onboard = machine.Pin(25, machine.Pin.OUT)

# Driving parameters — change these to tune the robot's behavior
POWER_LEVEL      = 65025  # motor speed (20000 = slow, 65025 = full speed)
TURN_THRESHOLD   = 400    # distance (mm) at which the robot turns
TURN_TIME        = 0.25   # seconds the robot spends turning
BACKUP_TIME      = 0.75   # seconds the robot backs up before turning

# Motor pin numbers on the Pico
RIGHT_FORWARD_PIN = 21
RIGHT_REVERSE_PIN = 20
LEFT_FORWARD_PIN  = 18
LEFT_REVERSE_PIN  = 19

# Set up PWM on each motor pin
right_forward = PWM(Pin(RIGHT_FORWARD_PIN))
right_reverse  = PWM(Pin(RIGHT_REVERSE_PIN))
left_forward   = PWM(Pin(LEFT_FORWARD_PIN))
left_reverse   = PWM(Pin(LEFT_REVERSE_PIN))

# Set up the I2C bus for the distance sensor
sda = machine.Pin(16)
scl = machine.Pin(17)
i2c = machine.I2C(0, sda=sda, scl=scl)

# Create the sensor object
tof = VL53L0X.VL53L0X(i2c)

def turn_motor_on(pwm):
    pwm.duty_u16(POWER_LEVEL)  # set motor to full power

def turn_motor_off(pwm):
    pwm.duty_u16(0)  # stop the motor

def forward():
    turn_motor_on(right_forward)
    turn_motor_on(left_forward)
    turn_motor_off(right_reverse)
    turn_motor_off(left_reverse)

def reverse():
    turn_motor_on(right_reverse)
    turn_motor_on(left_reverse)
    turn_motor_off(right_forward)
    turn_motor_off(left_forward)

def turn_right():
    turn_motor_on(right_forward)
    turn_motor_on(left_reverse)
    turn_motor_off(right_reverse)
    turn_motor_off(left_forward)

def turn_left():
    turn_motor_on(right_reverse)
    turn_motor_on(left_forward)
    turn_motor_off(right_forward)
    turn_motor_off(left_reverse)

def stop():
    turn_motor_off(right_forward)
    turn_motor_off(right_reverse)
    turn_motor_off(left_forward)
    turn_motor_off(left_reverse)

def read_sensor_avg():
    """Read the sensor 10 times and return the average distance."""
    total = 0
    for i in range(10):          # take 10 readings
        total = total + tof.read()  # add each reading to the total
        sleep(0.01)              # short pause between readings
    return int(total / 10)       # return the average

tof.start()  # wake up the distance sensor

while True:
    dist = read_sensor_avg()  # get the average distance in mm
    print(dist)

    if dist < TURN_THRESHOLD:         # something is too close
        print('object detected')
        reverse()                     # back away from the object
        sleep(BACKUP_TIME)
        led_onboard.high()            # turn on the LED to show we detected something
        turn_right()                  # turn to find a clear path
        sleep(TURN_TIME)
    else:
        if dist > 1300:
            print('no signal')        # sensor got no echo — very far or no object
            led_onboard.low()
        else:
            print('Go forward')
            led_onboard.high()
        forward()                     # path is clear — drive forward
```

## More to Explore

1. Change the `POWER_LEVEL` value. What is the lowest value that still makes the robot move?
2. Change the `TURN_THRESHOLD`. What happens if you make it very small? What about very large?
3. Can you make the robot randomly turn left or right? Use `import random` and `random.randint(0, 1)`.
4. What other parameters would you like to be able to adjust? Think about how you would add them.

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You built and programmed your first robot! It can now drive around and avoid obstacles all by itself. Next, you will add LEDs and sensors to make it even smarter.
