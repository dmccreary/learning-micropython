# Sensors

Here is a list of sensors that we have been using or we are considering using

## In Use

### VL530X Time-of-Flight Distance Sensor

[Tutorial and Sample Code](../sensors/07-VL53L0X_GY.md)

## Considering Using

### TMF8820 Distance Sensor

The [SparkFun Qwiic dToF Imager - TMF8820](https://www.sparkfun.com/sparkfun-qwiic-dtof-imager-tmf8820.html) is a direct time-of-flight sensor that sells for $14.95. Our current VL53L0X costs about $2.

#### How It Compares to the VL53L0X

| Feature | VL53L0X | TMF8820 |
|---|---|---|
| Price | About $2 | $14.95 (SparkFun) |
| Zones | 1 | 3x3 (9 zones), with more than one object detected per zone |
| Range | Up to about 2 m (our lab caps the raw reading at 1200) | 10 mm to 5000 mm |
| Field of view | About 25° | Adjustable up to 63° diagonally |
| Read rate | | Up to 30 Hz |
| Sunlight handling | Basic | On-chip histogram processing and sunlight rejection |
| Output | Raw distance (we calibrate with `ZERO_DIST` and `SCALE_DIST`) | Distance in millimeters plus a confidence value |
| Connector | Header pins | Two Qwiic connectors plus 0.1-inch header pins, I2C address 0x41 |
| Power | Low | 57 mA active, 8 µA standby |
| MicroPython driver | Working driver in this repo | None found yet. SparkFun only offers an Arduino library. |

**Pros:** The 9 zones let a robot tell whether an obstacle is to its left, straight ahead, or to its right without turning to scan. It also has longer range, a wider field of view, better accuracy in bright rooms, and solderless Qwiic wiring.

**Cons:** It costs about 7 times as much per sensor, which adds up across a classroom. It draws more current on battery robots. And it needs a microcontroller with enough flash. As far as we know, the TMF882x family also needs a firmware image loaded onto the sensor at startup, so a MicroPython driver will take real porting work.

#### Price Search (October 16, 2026)

We searched eBay and AliExpress for cheaper TMF8820 or TMF8821 boards. We did not find any lower-cost clone boards, unlike the VL53L0X.

- **eBay:** The only real match was an open-box [AMS TMF882X-SHIELDA evaluation kit](https://www.ebay.com/itm/257265162301) for $125.00 plus $12.10 shipping. The other results were unrelated parts.
- **AliExpress:** The only real match was a resold SparkFun Qwiic Mini TMF8820 board for $133.79 plus $72.17 express shipping. A search for TMF8821 found no boards.

**Conclusion:** SparkFun's $14.95 board is by far the cheapest source today. We will keep the VL53L0X as the default kit sensor and consider the TMF8820 for an advanced robot kit.

#### TODO

- [ ] Buy one SparkFun TMF8820 board for testing
- [ ] Find or port a MicroPython driver for the TMF882x (including the firmware download at startup) and test it on a Raspberry Pi Pico
- [ ] Write a multi-zone obstacle-avoidance lab for the stem-robots kits
- [ ] Re-check eBay and AliExpress every few months for lower-cost clone boards

