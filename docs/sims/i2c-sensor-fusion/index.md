---
title: I2C Five-Device Sensor Fusion
description: Five I2C devices (accelerometer, gyroscope, VL53L0X distance sensor, INA219 battery monitor and SSD1306 display) share one bus while the Pico schedules them and fuses accelerometer and gyroscope data into one tilt angle.
image: /sims/i2c-sensor-fusion/i2c-sensor-fusion.png
og:image: /sims/i2c-sensor-fusion/i2c-sensor-fusion.png
twitter:image: /sims/i2c-sensor-fusion/i2c-sensor-fusion.png
social:
   cards: false
quality_score: 100
---

# I2C Five-Device Sensor Fusion

<iframe src="main.html" height="756px" width="100%" scrolling="no"></iframe>

[Run the I2C Five-Device Sensor Fusion MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

A robot rocks back and forth on a tilting platform. A distance sensor watches an
obstacle slide back and forth. The robot's battery slowly drains. One Pico runs the
whole robot over a single Inter-Integrated Circuit (I2C) bus. The bus has **five devices**:

| Device | Chip | Address | What the Pico does |
|--------|------|---------|--------------------|
| Accelerometer | MPU-6050 | `0x68` | reads 6 bytes every 10 ms |
| Gyroscope | MPU-6050 | `0x68` | reads 6 bytes every 10 ms |
| Distance | VL53L0X | `0x29` | reads 2 bytes every 50 ms |
| Battery monitor | INA219 | `0x40` | reads the 2-byte bus voltage every 250 ms, then turns volts into a percent |
| Display | SSD1306 | `0x3C` | draws text, then sends a 1,024-byte picture |

The accelerometer and the gyroscope are two sensors inside one chip.
So five devices need only four addresses.

The **timeline is drawn to scale**. Every transaction lasts as long as its bits take on
the wire. That is nine bits for each byte, at 100 kHz or 400 kHz.
A sensor read is a thin sliver. One display picture takes about 23 milliseconds at 400 kHz.
At 100 kHz it takes about 94 milliseconds. While the picture is on the wire, the Pico
cannot read any sensor. The red bars show reads that were due but had to wait.

The chart shows **sensor fusion**. The accelerometer alone is noisy. Press **Bump the robot!**
to see it jump. The gyroscope alone is smooth, but it drifts away because of a small error.
A *complementary filter* uses 98% gyroscope and 2% accelerometer. It keeps the best of both.

**Learning objective:** You will be able to analyze how several I2C devices share one bus.
You will explain how a display update delays sensor reads. You will explain why the Pico
fuses accelerometer and gyroscope readings.

- **Bloom's Taxonomy (2001):** Analyze - *compare, examine*
- **Interaction pattern:** controlled experiments (bus speed, display rate, bump) on a timeline drawn to scale

## How to Use

1. Press **Start**. Time runs at 10% speed so you can follow it.
2. Find the long orange **frame** blocks on the timeline. Find the red "due but had to wait" bars on the accelerometer lane.
3. Read **Bus busy** and **reads per second** in the bottom-right panel. The goal is 100 reads per second.
4. Set **Display** to *Off*. What happens to the reads per second?
5. Set **Bus speed** to *100 kHz* and **Display** to *20 per second*. Predict first, then watch the bus fill up and the sensor reads collapse.
6. Press **Bump the robot!**. Compare the red (accelerometer only), blue (gyroscope only) and green (fused) lines in the chart.

## What to Look For

- **One device at a time.** The timeline never shows two blocks at the same moment.
- **Wire time is arithmetic.** Bits = 9 x bytes, plus a few extra bits. Time = bits / bus speed. The display picture has about 500 times more bytes than a distance reading.
- **A slow device can delay a fast one.** The gyroscope needs a fresh reading every 10 ms. The display picture blocks the bus for more than twice that.
- **Raw bytes need decoding.** The INA219 sends a voltage register. Its last three bits are not voltage. The Pico shifts them away, multiplies by 4 millivolts, and looks up a battery percent.
- **Fusion beats either sensor alone.** The green fused line stays close to the black truth line, even during a bump.

## Embedding This MicroSim

You can add this MicroSim to any web page with this HTML:

```html
<iframe src="https://dmccreary.github.io/learning-micropython/sims/i2c-sensor-fusion/main.html"
        height="756px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Grade Level

Ages 11-18. Part of [Appendix A: The I2C Bus](../../appendices/i2c-bus/index.md).

### Duration

15-20 minutes

### Prerequisites

- The [I2C Bus Scanner](../i2c-scanner/index.md) and [I2C Two Sensors in a Maze](../i2c-two-sensors-maze/index.md) MicroSims
- [Chapter 9: Temperature and Distance Sensors](../../chapters/09-temp-distance-sensors/index.md)
- [Chapter 15: OLED Setup](../../chapters/15-oled-setup/index.md)

### Activities

1. **Predict the hog** (3 min): Before pressing Start, students guess which device will use the most bus time, and why.
2. **Measure the budget** (5 min): Students read the bus-busy percent with the display at 10 per second. Then they read it with the display off.
3. **Break the bus** (5 min): Students set 100 kHz and 20 display pictures per second. They explain in one sentence why the sensor reads collapse.
4. **Fix it** (4 min): Students find two ways to bring the sensor reads back to 100 per second.
5. **Fusion** (3 min): Students press Bump and explain which line to trust.

### Assessment

- The student works out the wire time of a transaction from its byte count.
- The student explains why a display update delays sensor reads, and names two fixes.
- The student explains why accelerometer and gyroscope readings are fused.

## References

1. [UM10204: I2C-bus specification and user manual, Rev. 7.0](https://www.nxp.com/docs/en/user-guide/UM10204.pdf) - NXP, 2021
2. [INA219 datasheet](https://www.ti.com/lit/ds/symlink/ina219.pdf) - Texas Instruments: registers, 4 mV bus-voltage step, address pins
3. [Pololu VL53L0X library](https://github.com/pololu/vl53l0x-arduino) - the model-ID register `0xC0` and the range register at `0x1E`
4. [SSD1306 datasheet](https://cdn-shop.adafruit.com/datasheets/SSD1306.pdf) - Solomon Systech
5. [Sensor fusion](https://en.wikipedia.org/wiki/Sensor_fusion) - Wikipedia
6. [Appendix A: The I2C Bus](../../appendices/i2c-bus/index.md) - the full explanation that goes with this MicroSim
7. [p5.js](https://p5js.org/) - the JavaScript library used to build this MicroSim
