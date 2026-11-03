---
title: I2C Collision-Avoidance Robot
description: A robot drives around a rectangular arena (top view) with one VL53L0X distance sensor on the I2C bus. Within 15 cm it backs up 20 cm, then flips a coin to turn left or right. The I2C bytes and distance values are shown live.
image: /sims/i2c-collision-avoidance/i2c-collision-avoidance.png
og:image: /sims/i2c-collision-avoidance/i2c-collision-avoidance.png
twitter:image: /sims/i2c-collision-avoidance/i2c-collision-avoidance.png
social:
   cards: false
quality_score: 100
---

# I2C Collision-Avoidance Robot

<iframe src="main.html" height="679px" width="100%" scrolling="no"></iframe>

[Run the I2C Collision-Avoidance Robot MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

This robot has **one sensor**: a VL53L0X distance sensor on the Inter-Integrated Circuit
(I2C) bus. The picture is a view from above. The robot drives around a rectangular
arena. The Pico asks the sensor "how far away is the wall?" again and again.

Here is the plan the robot follows:

1. Drive forward.
2. If the sensor says the wall is **15 cm away or closer**, stop going forward.
3. **Back up 20 cm.**
4. Flip a coin. Heads, turn right. Tails, turn left. (Each has a 50% chance.)
5. Drive forward again.

The MicroSim also shows what travels on the I2C bus. Each read is a short transaction:
START, the chip address, the register number, a restart, the address again, two data
bytes, and STOP. The two data bytes are the distance in millimeters. The bytes
`01 2C` mean 300 mm, which is 30.0 cm.

**Learning objective:** You will be able to predict how the read rate and the robot's
speed change how close the robot gets to a wall before it reacts.

- **Bloom's Taxonomy (2001):** Apply - *use, predict*
- **Interaction pattern:** two sliders (reads per second and robot speed) with live feedback

## How to Use

1. Press **Start**. The robot drives, and the Pico starts reading the sensor.
2. Watch the red cone. It shows what the sensor can see. The number on the wall is the latest reading.
3. Watch the **I2C bus** panel. Each read lights up the frame box by box, and the two data bytes appear last.
4. Look at the black log. Find the line marked `TOO CLOSE!` in red. That is the read that makes the robot back up.
5. Watch the **backing up** progress bar fill to 20 cm. Then watch the coin flip and the turn.
6. Let it run for a minute. Compare the **Left turns** and **Right turns** counts. They should end up close to equal.
7. Now try an experiment. Set **Reads per second** to 1 and **Robot speed** to 40 cm per second. Predict what will happen, then press Start.

## What to Look For

- **A read, then a decision.** The robot only knows the distance when a read finishes. Between reads it is driving blind.
- **Reaction distance.** Distance traveled between reads = speed divided by reads per second. At 20 cm per second and 10 reads per second, that is 2 cm. At 40 cm per second and 1 read per second, it is 40 cm, which is more than the whole safety gap. Then you will see **BUMP!**
- **The robot may stop a little inside 15 cm.** The 15 cm rule triggers on the first read at 15 cm *or less*. The robot keeps moving until the next read.
- **The coin flip is fair, but not exact.** After 10 turns you may see 7 left and 3 right. After hundreds, the counts get close to equal.
- **Only one device is on the bus.** The address is `0x29`, which is 41 in decimal.

## Embedding This MicroSim

You can add this MicroSim to any web page with this HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/i2c-collision-avoidance/main.html"
        height="679px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level

Ages 10-18. Part of [Appendix A: The I2C Bus](../../appendices/i2c-bus/index.md).

### Duration

10-15 minutes

### Prerequisites

- The [I2C Bus Scanner](../i2c-scanner/index.md) MicroSim
- [Chapter 9: Temperature and Distance Sensors](../../chapters/09-temp-distance-sensors/index.md)
- [Chapter 13: Robots and Mobile Systems](../../chapters/13-robots-mobile-systems/index.md)

### Activities

1. **Predict** (3 min): Before pressing Start, students guess how many times the robot will bump into a wall in one minute at the default settings. (Answer: none.)
2. **Follow one read** (3 min): Students find the read marked `TOO CLOSE!` and say which two bytes made the robot back up.
3. **Break it** (4 min): Students set 1 read per second and 40 cm per second. They count the bumps and explain why they happen.
4. **Fix it** (3 min): Students find two settings changes that stop the bumps.
5. **Check the coin** (2 min): After a minute, students compare the left and right turn counts.

### Assessment

- The student explains that the robot only knows the distance when a read finishes.
- The student predicts that a slower read rate or a faster robot gives more bumps.
- The student reads two data bytes (such as `00 96`) and says the distance in millimeters and centimeters.

## The Code Behind It

This is the same plan as the book's [Maker Pi RP2040 collision-avoidance robot](../../kits/maker-pi-rp2040-robot/20-collision-avoidance-robot.md).
The motor functions (`forward`, `reverse`, `turn_left`, `turn_right`) are on that page.

```python
# collision_avoidance.py: one I2C distance sensor steers the robot
from machine import Pin, I2C
from time import sleep
import urandom                         # random numbers for the coin flip
from VL53L0X import VL53L0X            # distance driver from src/drivers

TURN_DISTANCE_CM = 15                  # back up when the wall is this close
REVERSE_TIME = 1.0                     # seconds of reversing (about 20 cm; measure yours)
TURN_TIME = 0.75                       # seconds to turn about 90 degrees

i2c = I2C(0, sda=Pin(0), scl=Pin(1), freq=400000)   # the I2C bus
tof = VL53L0X(i2c)                     # the distance sensor, address 0x29
tof.start()                            # keep measuring

forward()                              # start driving
while True:
    distance_mm = tof.read()           # two bytes over I2C, as millimeters
    distance_cm = distance_mm / 10     # convert millimeters to centimeters
    if distance_cm <= TURN_DISTANCE_CM:
        reverse()                      # back away from the wall
        sleep(REVERSE_TIME)
        if urandom.random() < 0.5:     # a coin flip: half the time...
            turn_right()
        else:                          # ...and half the time
            turn_left()
        sleep(TURN_TIME)
        forward()                      # drive again
```

| Line | What it does |
|------|--------------|
| `tof = VL53L0X(i2c)` | Sets up the distance sensor on the I2C bus |
| `distance_mm = tof.read()` | Reads the two data bytes and turns them into millimeters |
| `distance_cm = distance_mm / 10` | Changes millimeters into centimeters |
| `if distance_cm <= TURN_DISTANCE_CM:` | Checks the 15 cm rule |
| `reverse()` and `sleep(REVERSE_TIME)` | Backs up. The time sets how far (about 20 cm) |
| `if urandom.random() < 0.5:` | The coin flip. `random()` gives a number from 0 up to 1 |
| `turn_right()` or `turn_left()` | Turns the robot, then `sleep(TURN_TIME)` waits for the turn |

## References

1. [Maker Pi RP2040 Collision Avoidance Robot](../../kits/maker-pi-rp2040-robot/20-collision-avoidance-robot.md) - the book's robot that uses the same plan
2. [VL53L0X Time-of-Flight Distance Sensor](../../sensors/07-VL53L0X_GY.md) - the sensor and its driver
3. [Pololu VL53L0X library](https://github.com/pololu/vl53l0x-arduino) - the range result is a 16-bit number at register `0x1E`
4. [UM10204: I2C-bus specification and user manual, Rev. 7.0](https://www.nxp.com/docs/en/user-guide/UM10204.pdf) - NXP, 2021
5. [Appendix A: The I2C Bus](../../appendices/i2c-bus/index.md) - the full explanation that goes with this MicroSim
6. [p5.js](https://p5js.org/) - the JavaScript library used to build this MicroSim
