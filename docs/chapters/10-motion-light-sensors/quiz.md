# Quiz: Motion, Orientation, and Light Sensors

Test your understanding of accelerometers, gyroscopes, compass sensors, and light detection with these questions.

---

#### 1. What does an accelerometer measure?

<div class="upper-alpha" markdown>
1. The speed at which a surface is moving in a straight line
2. Acceleration forces along one or more axes, including Earth's gravitational pull
3. The rotation rate of an object around its center
4. The strength of a nearby magnetic field
</div>

??? question "Show Answer"
    The correct answer is **B**. An accelerometer measures acceleration forces — including the constant force of Earth's gravity (1 g = 9.81 m/s²). When a board sits flat on a table, the accelerometer reads approximately 1 g on the vertical Z axis because it senses gravity pushing up. This gravity response also enables tilt detection.

    **Concept Tested:** Accelerometer

---

#### 2. A flat ADXL345 accelerometer reads X=0 g, Y=0 g, Z=1 g. What does the Z reading of 1 g indicate?

<div class="upper-alpha" markdown>
1. The board is moving upward at one meter per second
2. The sensor is broken — all axes should read 0 g when stationary
3. The board is lying flat and the sensor is detecting Earth's gravitational acceleration in the vertical direction
4. The Z axis is twice as sensitive as the X and Y axes
</div>

??? question "Show Answer"
    The correct answer is **C**. When the board is perfectly flat and stationary, gravity (1 g) acts straight down on the Z axis. The accelerometer detects this as a 1 g force on Z, and 0 g on X and Y (no tilt in either horizontal direction). This is the expected "resting flat" reading, not an error.

    **Concept Tested:** Accelerometer X/Y/Z Axes / Tilt Detection

---

#### 3. What does a gyroscope measure that is different from what an accelerometer measures?

<div class="upper-alpha" markdown>
1. Magnetic field strength rather than gravity strength
2. Rotation rate (degrees per second) rather than acceleration forces
3. Linear velocity (meters per second) rather than force
4. Absolute position in space rather than relative movement
</div>

??? question "Show Answer"
    The correct answer is **B**. A gyroscope measures how fast the board is spinning around each axis, in degrees per second. An accelerometer measures forces (including gravity) that let you infer tilt angle. Together in an IMU (like the MPU6050), accelerometer data gives tilt position and gyroscope data gives spin rate — complementary information for complete motion tracking.

    **Concept Tested:** Gyroscope / IMU (Inertial Measurement Unit)

---

#### 4. What is an IMU?

<div class="upper-alpha" markdown>
1. An Infrared Measuring Unit that detects distance using light
2. An Inertial Measurement Unit that combines accelerometer and gyroscope data
3. An Integrated Motor Unit that controls motor speed and direction
4. An Interrupt Management Utility that handles hardware events
</div>

??? question "Show Answer"
    The correct answer is **B**. An IMU (Inertial Measurement Unit) combines an accelerometer and a gyroscope (and sometimes a magnetometer) in one package. The MPU6050 is a popular 6-axis IMU (3 accelerometer axes + 3 gyroscope axes). High-end IMUs add a compass for 9-axis sensing. IMUs are used in robots, drones, and game controllers.

    **Concept Tested:** IMU (Inertial Measurement Unit)

---

#### 5. Which sensor is a multifunction chip that can detect color, proximity, and gesture in one package?

<div class="upper-alpha" markdown>
1. ADXL345
2. HMC5883L
3. APDS9960
4. MPU6050
</div>

??? question "Show Answer"
    The correct answer is **C**. The APDS9960 from Broadcom integrates ambient light sensing, RGB color detection, proximity detection, and gesture detection (up, down, left, right swipes) all in one tiny chip. It communicates over I2C at address `0x39`. The other sensors listed measure acceleration, magnetic fields, or both.

    **Concept Tested:** APDS9960 Gesture Sensor / APDS9960 Color Detection

---

#### 6. How does a photoresistor (LDR) change when light hits it?

<div class="upper-alpha" markdown>
1. Its resistance increases as light increases
2. Its resistance decreases as light increases
3. It generates a voltage proportional to light intensity
4. It acts as a short circuit in bright light and an open circuit in darkness
</div>

??? question "Show Answer"
    The correct answer is **B**. A light-dependent resistor (LDR) has high resistance in darkness (up to several megaohms) and low resistance in bright light (a few hundred ohms). In a voltage divider circuit, this resistance change causes the voltage at the midpoint to change, which the ADC reads as a varying analog value — higher readings in brighter light.

    **Concept Tested:** Photoresistor (LDR) / Ambient Light Sensing

---

#### 7. A compass sensor reads X_mag = 100 µT and Y_mag = 0 µT. What heading does this indicate?

<div class="upper-alpha" markdown>
1. Due north (0°)
2. Due east (90°)
3. Due south (180°)
4. Due west (270°)
</div>

??? question "Show Answer"
    The correct answer is **A**. The heading formula is `atan2(Y, X) × 180/π`. With Y=0 and X=100, `atan2(0, 100) = 0 radians = 0°`. Zero degrees on a compass is due north. If Y were positive and X were 0, the heading would be 90° (east). Compass heading increases clockwise from north.

    **Concept Tested:** Compass Heading Calculation / HMC5883L Compass Sensor

---

#### 8. Why does a compass sensor need to be calibrated before use?

<div class="upper-alpha" markdown>
1. To set the correct I2C address for the local magnetic field strength
2. To remove constant magnetic offsets ("hard iron" errors) caused by nearby metal and electronics
3. To synchronize the compass with GPS satellites for accurate bearing
4. To set the sampling rate to match the gyroscope in the same IMU
</div>

??? question "Show Answer"
    The correct answer is **B**. Nearby metal objects (screws, motor magnets, power wires) create constant magnetic offsets called "hard iron" errors. These shift all readings by the same amount, making the compass point in the wrong direction consistently. Calibration measures the min/max values on each axis as the sensor rotates fully, then corrects for these offsets.

    **Concept Tested:** Compass Heading Calculation / Magnetic Field Sensing

---

#### 9. An ADXL345 accelerometer reads X=0.7 g. What does this tell you about the board's orientation?

<div class="upper-alpha" markdown>
1. The board is spinning clockwise at 0.7 radians per second
2. The board is tilted to the left or right — gravity has shifted 0.7 g onto the X axis
3. The battery voltage has dropped to 0.7 V
4. The sensor is warming up — 0.7 g is the initial calibration offset
</div>

??? question "Show Answer"
    The correct answer is **B**. When the board is flat, X and Y should read near 0 g. A non-zero X reading means the board is tilted — gravity's 1 g pull has shifted partially onto the X axis. A reading of 0.7 g on X means significant left/right tilt. The higher the X reading (toward 1 g), the closer to a 90° sideways tilt.

    **Concept Tested:** Tilt Detection / Accelerometer X/Y/Z Axes

---

#### 10. The APDS9960 proximity sensor returns a value of 255. What does this indicate?

<div class="upper-alpha" markdown>
1. No object is detected — 255 is the maximum "empty" reading
2. An object is very close to the sensor, almost touching it
3. The sensor has overloaded from too much ambient light
4. The I2C connection has been lost and 255 is the error code
</div>

??? question "Show Answer"
    The correct answer is **B**. The APDS9960 proximity reading ranges from 0 (far away) to 255 (very close, almost touching). The sensor uses an infrared LED and detector: when an object is close, more IR light reflects back to the detector, giving a higher reading. A reading near 0 means nothing is close; near 255 means an object is right at the sensor face.

    **Concept Tested:** APDS9960 Proximity Detection

---
