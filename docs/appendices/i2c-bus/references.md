---
title: "Appendix A: Annotated References for the I2C Bus"
description: Annotated sources for the I2C appendix, including the I2C specification, MicroPython documentation and the datasheets for the MPU-6050, HMC5883L, VL53L0X, INA219 and SSD1306.
---

# Appendix A: Annotated References

The numbers in the appendix and the MicroSims come from these sources.

## The Bus Itself

1. [UM10204: I2C-bus specification and user manual, Rev. 7.0](https://www.nxp.com/docs/en/user-guide/UM10204.pdf) - NXP Semiconductors, 1 October 2021.
   The official definition of I2C. Revision 7.0 replaced "master/slave" with "controller/target". It lists the reserved addresses (`0000 XXX` and `1111 XXX`). It gives the bit rates: 100 kbit/s standard mode, 400 kbit/s fast mode and 1 Mbit/s fast-mode plus.
2. [I2C (Wikipedia)](https://en.wikipedia.org/wiki/I%C2%B2C) - a readable overview of the history, the open-drain design and the protocol.
3. [I2C tutorial (SparkFun)](https://learn.sparkfun.com/tutorials/i2c) - a beginner-friendly walk through START, addresses, ACKs and pull-ups.

## Programming the Bus

4. [machine.I2C (MicroPython documentation)](https://docs.micropython.org/en/latest/library/machine.I2C.html) - defines `I2C(id, scl=, sda=, freq=400000)`, `scan()` (all addresses from `0x08` to `0x77`; a device responds if it pulls SDA low after its address and write bit), `readfrom_mem()` and `writeto_mem()`.
5. [Raspberry Pi Pico Python SDK](https://datasheets.raspberrypi.com/pico/raspberry-pi-pico-python-sdk.pdf) - the Pico's two I2C controllers and which pins they can use.

## The Devices

6. MPU-6000 and MPU-6050 Register Map and Descriptions (document RM-MPU-6000A-00, Rev. 4.2) - InvenSense.
   The registers used here: `PWR_MGMT_1` (`0x6B`), `WHO_AM_I` (`0x75`), `ACCEL_XOUT_H` (`0x3B`), `GYRO_XOUT_H` (`0x43`) and `INT_PIN_CFG` (`0x37`). The maker no longer hosts it at its old address, so search for the document number. A practical summary is on the [Arduino Playground MPU-6050 page](https://www.arduino.cc/playground/Main/MPU-6050/).
7. [HMC5883L 3-Axis Digital Compass IC datasheet](https://cdn-shop.adafruit.com/datasheets/HMC5883L_3-Axis_Digital_Compass_IC.pdf) - Honeywell.
   7-bit address `0x1E` (8-bit `0x3C` write and `0x3D` read). Data registers `0x03` to `0x08` in X, Z, Y order with the high byte first. Default gain of 1,090 counts per gauss. Default mode is single measurement.
8. [GY-271 module is not the HMC5883L (Arduino Forum)](https://forum.arduino.cc/t/resolved-problem-with-gy-271-compass-module-hmc5883l-qmc5883l/498978) - a user finds out by scanning that a "GY-271" board answers at `0x0D`, because it carries a QMC5883L.
9. [Pololu VL53L0X library](https://github.com/pololu/vl53l0x-arduino) - open-source driver code. It shows the identification register (`0xC0`, value `0xEE`) and the 16-bit range result read from register `0x14 + 10 = 0x1E`. Also see the [Adafruit VL53L0X guide](https://learn.adafruit.com/adafruit-vl53l0x-micro-lidar-distance-sensor-breakout).
10. [INA219 datasheet](https://www.ti.com/lit/ds/symlink/ina219.pdf) - Texas Instruments.
    Default address `0x40` (A0 and A1 grounded). Shunt voltage is 10 microvolts per step. Bus voltage is 4 millivolts per step in bits 15 to 3 (shift right by 3 first). The [Adafruit INA219 guide](https://learn.adafruit.com/adafruit-ina219-current-sensor-breakout) covers the breakout board and its address jumpers.
11. [SSD1306 datasheet](https://cdn-shop.adafruit.com/datasheets/SSD1306.pdf) - Solomon Systech. The OLED controller, including the I2C control byte (`0x00` for commands, `0x40` for pixel data) and the page-based memory behind the 1,024-byte picture.

## Sensor Fusion

12. [Sensor fusion (Wikipedia)](https://en.wikipedia.org/wiki/Sensor_fusion) - why and how measurements from several sensors are combined.
13. [Kalman filter (Wikipedia)](https://en.wikipedia.org/wiki/Kalman_filter) - the more powerful relative of the complementary filter used in this appendix.

## Related Pages in This Book

- [Appendix A: The I2C Bus](index.md) - the student appendix
- [Instructor Notes](instructor-notes.md) - lesson script and misconceptions
- [Chapter 8: Communication Protocols](../../chapters/08-communication-protocols/index.md) - the first look at I2C, SPI and UART
- [Chapter 9: Temperature and Distance Sensors](../../chapters/09-temp-distance-sensors/index.md), [Chapter 10: Motion and Light Sensors](../../chapters/10-motion-light-sensors/index.md) and [Chapter 15: OLED Setup](../../chapters/15-oled-setup/index.md)
- [I2C Bus Scanner](../../sims/i2c-scanner/index.md), [I2C Two Sensors in a Maze](../../sims/i2c-two-sensors-maze/index.md) and [I2C Five-Device Sensor Fusion](../../sims/i2c-sensor-fusion/index.md) - the three MicroSims
