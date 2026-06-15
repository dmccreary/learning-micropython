# Quiz: Temperature, Humidity, and Distance Sensors

Test your understanding of DHT11/22, BME280, DS18B20, HC-SR04, VL53L0X, and IR sensors with these questions.

---

#### 1. What must you call before reading the temperature from a DHT22 sensor, and why?

<div class="upper-alpha" markdown>
1. `sensor.reset()` — to clear the last reading from memory
2. `sensor.measure()` — to trigger the sensor to take a new measurement
3. `sensor.calibrate()` — to compensate for temperature drift
4. `sensor.connect()` — to establish the communication link each time
</div>

??? question "Show Answer"
    The correct answer is **B**. The DHT22 does not take measurements continuously. You must call `sensor.measure()` to tell it to sample the temperature and humidity. After the measurement is complete, you can retrieve the values with `sensor.temperature()` and `sensor.humidity()`. Skipping `measure()` returns stale or invalid data.

    **Concept Tested:** DHT.measure() Method / DHT22 Sensor

---

#### 2. How long should you wait between DHT11 or DHT22 measurements?

<div class="upper-alpha" markdown>
1. At least 50 milliseconds
2. At least 1–2 seconds
3. At least 10 minutes
4. No wait is needed — read as fast as you want
</div>

??? question "Show Answer"
    The correct answer is **B**. DHT sensors need at least 1–2 seconds between measurements to stabilize their internal sensing elements. Calling `measure()` faster than this causes the sensor to return stale or invalid data. Use `utime.sleep(2)` in your loop to ensure reliable readings.

    **Concept Tested:** DHT11 Sensor / DHT22 Sensor

---

#### 3. The BME280 sensor measures which three environmental quantities?

<div class="upper-alpha" markdown>
1. Temperature, light level, and UV index
2. Temperature, humidity, and air pressure
3. Temperature, CO₂ level, and wind speed
4. Humidity, distance, and magnetic field
</div>

??? question "Show Answer"
    The correct answer is **B**. The BME280 from Bosch measures temperature (±1 °C), relative humidity (±3%), and atmospheric pressure (±1 hPa) in a single tiny package. Its pressure reading is particularly useful for calculating altitude above sea level, making it popular in weather stations.

    **Concept Tested:** BME280 Sensor

---

#### 4. What protocol does the DS18B20 waterproof temperature sensor use?

<div class="upper-alpha" markdown>
1. I2C with address 0x76
2. SPI at 10 MHz
3. 1-Wire — a single data wire with a pull-up resistor
4. UART at 9600 baud
</div>

??? question "Show Answer"
    The correct answer is **C**. The DS18B20 uses the 1-Wire protocol: one data wire plus GND, with a 4.7 kΩ pull-up resistor to 3.3 V. A unique feature is that multiple DS18B20 sensors can share the same single wire — each has a unique 64-bit ROM code so they can be addressed individually.

    **Concept Tested:** DS18B20 1-Wire Interface

---

#### 5. An HC-SR04 ultrasonic sensor returns an echo pulse duration of 580 µs. What is the distance to the object?

<div class="upper-alpha" markdown>
1. 10 cm
2. 20 cm
3. 580 cm
4. 5 cm
</div>

??? question "Show Answer"
    The correct answer is **A**. The formula for ultrasonic distance is `distance_cm = duration_µs / 58`. So `580 / 58 = 10 cm`. The denominator 58 accounts for the round-trip travel time (sound goes to the object and bounces back) and the speed of sound at roughly 343 m/s at room temperature.

    **Concept Tested:** HC-SR04 Ultrasonic Sensor / Ultrasonic Ranging Formula / Speed of Sound Calculation

---

#### 6. What is the purpose of the HC-SR04 trigger pin?

<div class="upper-alpha" markdown>
1. It receives the returning echo pulse from the object
2. It sends a 10 µs HIGH pulse to start a burst of ultrasonic sound
3. It provides the power supply voltage to the ultrasonic emitter
4. It outputs the measured distance as a PWM signal
</div>

??? question "Show Answer"
    The correct answer is **B**. The trigger pin is an input to the HC-SR04. You pulse it HIGH for 10 µs to command the sensor to fire eight 40 kHz ultrasonic pulses. The echo pin then goes HIGH when the pulses are sent and LOW when the echo returns — measuring the time between these events gives the distance.

    **Concept Tested:** HC-SR04 Trigger Pin / HC-SR04 Ultrasonic Sensor

---

#### 7. How does the VL53L0X measure distance differently from the HC-SR04?

<div class="upper-alpha" markdown>
1. VL53L0X uses radio waves; HC-SR04 uses ultrasound
2. VL53L0X bounces sound off the floor; HC-SR04 bounces light from the ceiling
3. VL53L0X emits a laser pulse and measures the time for light to return; HC-SR04 uses sound waves
4. VL53L0X measures temperature-corrected distance; HC-SR04 measures raw distance
</div>

??? question "Show Answer"
    The correct answer is **C**. The VL53L0X is a time-of-flight (ToF) laser sensor — it fires an infrared laser pulse and measures the tiny time (nanoseconds) for light to bounce back from an object. Because light travels much faster than sound, it can measure distances from 30–1,200 mm with ±3% accuracy on almost any surface, including fabric and glass.

    **Concept Tested:** VL53L0X Time-of-Flight Sensor / Time-of-Flight Measurement

---

#### 8. A digital IR distance sensor outputs LOW when an obstacle is close. What kind of output is this?

<div class="upper-alpha" markdown>
1. Analog output — the voltage drops proportionally to distance
2. Active LOW output — LOW means the event (obstacle detected) has occurred
3. Active HIGH output — HIGH indicates normal operation
4. Floating output — LOW means the pin is disconnected
</div>

??? question "Show Answer"
    The correct answer is **B**. When a sensor goes LOW to signal an event (like an obstacle being detected), it is called an active LOW output. This is the same pattern used by buttons with pull-ups. In your code, you check `if ir.value() == 0:` to detect the active LOW obstacle signal.

    **Concept Tested:** IR Distance Sensor / Active High vs Active Low

---

#### 9. Which sensor would you choose for a line-following robot that needs to detect the contrast between dark tape and a white floor?

<div class="upper-alpha" markdown>
1. BME280 — for its precise measurements
2. VL53L0X — for millimeter-accurate laser ranging
3. DS18B20 — for its ability to chain multiple sensors on one wire
4. IR digital sensor — for simple ON/OFF obstacle/line detection close to the floor
</div>

??? question "Show Answer"
    The correct answer is **D**. A digital IR sensor aimed at the floor detects the contrast between the dark tape (low reflectance, less light returns to the detector) and the white floor (high reflectance). Its simple ON/OFF output is exactly what a line-following robot needs. The other sensors measure temperature, pressure, or distance — not surface reflectance.

    **Concept Tested:** IR Distance Sensor / IR Emitter and Detector

---

#### 10. After calling `ds.convert_temp()` to start a DS18B20 measurement, why must you wait 750 ms before reading the result?

<div class="upper-alpha" markdown>
1. The 1-Wire protocol requires a mandatory 750 ms reset cycle between operations
2. The DS18B20 needs up to 750 ms to complete its internal analog-to-digital conversion
3. The MicroPython driver must verify the reading 10 times before it is considered reliable
4. Other devices on the 1-Wire bus need 750 ms to clear their buffers
</div>

??? question "Show Answer"
    The correct answer is **B**. The DS18B20 uses an internal analog-to-digital converter to measure temperature precisely. At 12-bit resolution (the default), this conversion takes up to 750 ms. Reading the temperature before the conversion finishes returns the previous measurement. Always use `utime.sleep_ms(750)` after `convert_temp()` before calling `read_temp()`.

    **Concept Tested:** DS18B20 Temperature Sensor / DS18B20 1-Wire Interface

---
