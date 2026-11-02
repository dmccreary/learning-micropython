---
title: I2C Two Sensors in a Maze
description: A robot drives a maze while the Pico takes turns reading an accelerometer and a gyroscope (or an HMC5883L compass) over one shared I2C bus.
image: /sims/i2c-two-sensors-maze/i2c-two-sensors-maze.png
og:image: /sims/i2c-two-sensors-maze/i2c-two-sensors-maze.png
twitter:image: /sims/i2c-two-sensors-maze/i2c-two-sensors-maze.png
social:
   cards: false
quality_score: 100
---

# I2C Two Sensors in a Maze

<iframe src="main.html" height="677px" width="100%" scrolling="no"></iframe>

[Run the I2C Two Sensors in a Maze MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A robot drives from START to GOAL through a maze. Two sensors tell the Pico what
the robot is doing. Both sensors use the **same two wires**.

- The **accelerometer** in the MPU-6050 (address `0x68`) feels the robot speed up and brake.
- The second sensor is your choice. It is either the **gyroscope** in the same MPU-6050 (also `0x68`, but different registers) or the **HMC5883L compass** (address `0x1E`, a separate chip).
  The gyroscope feels the robot turn. The compass shows which way the robot faces.

It looks like both sensors send their numbers at the same time. They cannot.
An Inter-Integrated Circuit (I2C) bus has room for only one conversation at a time.
The Pico asks the accelerometer for six bytes. It waits. Then it asks the second sensor.
The timeline at the bottom stretches those reads so you can see them take turns.
The reads never overlap.

The **Reads per second** slider shows what happens when the Pico asks less often.
The dots spread out, and quick changes fall between them.

**Learning objective:** You will be able to explain why two I2C sensors on one bus
are read one after the other. You will also be able to say what an accelerometer
and a gyroscope (or compass) each tell the robot.

- **Bloom's Taxonomy (2001):** Understand - *explain, compare*
- **Interaction pattern:** exploration with a read-rate slider and a sensor selector

## How to Use

1. Press **Start**. The robot drives the maze and the Pico starts reading.
2. Watch the **Accelerometer** chart. It bumps up when the robot speeds up and down when it brakes.
3. Watch the **Gyroscope** chart. It stays flat until the robot turns. Right turns and left turns spike in opposite directions.
4. Look at the **timeline**. Red blocks (accelerometer) and purple blocks (gyroscope) take turns. They never overlap.
5. Drag **Reads per second** down to 1 or 2. Which events does the Pico miss?
6. Change **Second sensor** to the compass. The gyroscope box turns gray. The HMC5883L lights up as a different chip with a different address.

## What to Look For

- **One chip, two sensors.** The MPU-6050 box holds the accelerometer and the gyroscope. They share address `0x68`. The Pico picks one by its register number (`0x3B` or `0x43`).
- **Readings are bytes.** Each axis arrives as two bytes, high byte first. The table shows the number, the two bytes in hex, and the value in real units.
- **The compass sends X, then Z, then Y.** The HMC5883L uses that odd order.
- **Reading less often loses detail.** The gray line is the truth. The colored dots are what the Pico knows. The chart holds each dot until the next read.

## Embedding This MicroSim

You can add this MicroSim to any web page with this HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/i2c-two-sensors-maze/main.html"
        height="677px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level

Ages 10-18. Part of [Appendix A: The I2C Bus](../../appendices/i2c-bus/index.md).

### Duration

10-15 minutes

### Prerequisites

- The [I2C Bus Scanner](../i2c-scanner/index.md) MicroSim (addresses and ACKs)
- [Chapter 10: Motion and Light Sensors](../../chapters/10-motion-light-sensors/index.md)
- The [Accelerometer Axes Explorer](../accelerometer-axes/index.md) MicroSim helps too

### Activities

1. **Predict the spikes** (4 min): Before pressing Start, students sketch both charts for one lap.
2. **Take turns** (3 min): Students find where the accelerometer read ends and the gyroscope read begins. They explain why the reads cannot overlap.
3. **Reading rate** (4 min): Students set 2 reads per second and describe what the chart no longer shows.
4. **Swap the sensor** (4 min): Students switch to the compass. They compare it with the gyroscope: same chip or different chip, same address or different?

### Assessment

- The student explains why the two readings are taken in turns.
- The student matches each chart feature to a robot motion (speeding up, braking, turning).
- The student explains why a slow read rate can miss a quick event.

## References

1. [UM10204: I2C-bus specification and user manual, Rev. 7.0](https://www.nxp.com/docs/en/user-guide/UM10204.pdf) - NXP, 2021
2. [HMC5883L 3-Axis Digital Compass IC datasheet](https://cdn-shop.adafruit.com/datasheets/HMC5883L_3-Axis_Digital_Compass_IC.pdf) - Honeywell
3. [MPU-6050 on the Arduino Playground](https://www.arduino.cc/playground/Main/MPU-6050/) - register map pointers for the accelerometer and gyroscope
4. [Appendix A: The I2C Bus](../../appendices/i2c-bus/index.md) - the full explanation that goes with this MicroSim
5. [p5.js](https://p5js.org/) - the JavaScript library used to build this MicroSim
