# Sensor and Parts Summary Table

This table lists the hardware parts already used across our MicroPython kit repos (learning-micropython, clocks-and-watches, robot-faces, stem-robots, moving-rainbow, thinking-spot-demos, fft-benchmarking, spectrum-analyzer, glo-coding-club and stem-classroom-admin). Prices come from the BOMs and procurement notes in those repos where available; prices marked with **~** are typical low-cost street prices (AliExpress or eBay) and are only approximate.

| Part Name | Part Type | Approx. Price | Description |
|-----------|-----------|---------------|-------------|
| Raspberry Pi Pico (RP2040) | Microcontroller | $4 | The standard $4 board used in nearly every lab and kit; see the [general kits](../kits/01-general-kits.md). |
| Raspberry Pi Pico W / Pico 2 W | Microcontroller | $6 | WiFi version of the Pico used for networked clocks, the wifi-bot and IoT labs in clocks-and-watches and stem-robots. |
| Cytron Maker Pi RP2040 | Microcontroller | $9.90 | Robot controller board with motor drivers, NeoPixels and Grove ports used in the [Maker Pi RP2040 robot kit](../kits/maker-pi-rp2040-robot/index.md) and stem-robots. |
| Cytron Maker Pi Pico / Maker Nano RP2040 | Microcontroller | ~$10 | Cytron carrier and Nano-format boards with built-in LEDs and buzzers; see [Maker Pi Pico](../kits/maker-pi-pico/index.md). |
| ESP32 boards (incl. LILYGO watch boards) | Microcontroller | ~$5 | Used for some wireless clocks and LILYGO smartwatch-style kits in clocks-and-watches. |
| RP2040-Zero | Microcontroller | ~$3 | Tiny RP2040 board used in compact LED and watch builds. |
| VL53L0X time-of-flight sensor | Distance sensor | $5 | Laser distance sensor (up to ~1.5 m) used in robot collision avoidance; see [VL53L0X](../sensors/07-VL53L0X_GY.md) and the [distance sensor kit](../kits/distance-sensor/index.md). |
| HC-SR04 ultrasonic sensor | Distance sensor | $1–$4 | Ultrasonic "ping" distance sensor used in the [ping lab](../sensors/03-ping.md) and the stem-robots ultrasonic-bot. |
| IR proximity sensor | Distance sensor | ~$0.60 (five for $3) | Adjustable IR obstacle sensor; see [IR distance sensor](../sensors/08-ir-distance-sensor.md). |
| TCRT5000 IR reflectance sensor | Distance sensor | ~$1 | Reflective IR sensor used by the stem-robots line-follower-bot. |
| SHT40 | Temperature/humidity sensor | $1.65 | Fast, accurate (±0.2 °C) I2C temperature/humidity sensor behind the Mood Ring kit; see [SHT40 kit](../kits/sht40-temp/index.md) and [SHT40 display kit](../kits/sht40-temp-display/index.md). |
| BME280 | Temperature/humidity/pressure sensor | $2–$4 | Bosch I2C environmental sensor; see [BME280](../sensors/09-bme280.md). |
| BMP280 | Temperature/pressure sensor | ~$1 | Pressure-and-temperature sibling of the BME280 mentioned in learning-micropython sensor labs. |
| DHT11 | Temperature/humidity sensor | $1 | Low-cost single-wire sensor; see [DHT11](../sensors/04-temp-dht11.md). |
| DHT22 | Temperature/humidity sensor | $2 | More accurate single-wire sensor; see [DHT11/DHT22](../sensors/dht11-temp-humidity.md). |
| DS18B20 | Temperature sensor | $1.50 | Waterproofable 1-Wire temperature probe; see [DS18B20](../sensors/05-temp-dsb20.md). |
| SCD40 | CO2 sensor | ~$15 | CO2 sensor referenced in learning-micropython sensor docs. |
| MPU6050 | Motion sensor (IMU) | ~$2 | 6-axis accelerometer/gyro used in the stem-robots imu-mpu6050 kit and [accelerometer lab](../sensors/06-accelerometer-compass.md). |
| MPU9250 | Motion sensor (IMU) | ~$5 | 9-DOF IMU used in the stem-robots 9-dof-imu kit. |
| LIS3DH | Motion sensor (accelerometer) | $5 | 3-axis accelerometer that drives the moving-rainbow 8x8 and 16x16 matrix-accel kits. |
| ADXL345 | Motion sensor (accelerometer) | ~$2 | 3-axis accelerometer referenced in learning-micropython and stem-robots. |
| HMC5883L / QMC5883L compass | Magnetometer | About $2 | Digital compass (GY-271) used in the stem-robots compass kits and the [compass lab](../sensors/11-compass.md). |
| APDS-9960 | Gesture/light sensor | ~$2 | Gesture, proximity and color sensor; see [gesture sensor](../sensors/13-gesture.md). |
| Photoresistor (LDR) | Light sensor | ~$0.10 | Light sensor used in the [photosensor lab](../sensors/02-photosensor.md) and moving-rainbow nightlights. |
| HC-SR501 PIR | Motion sensor | ~$1 | Passive infrared motion detector referenced in learning-micropython. |
| INA219 | Current sensor | ~$2 | I2C current/power monitor used for measuring robot and LED power. |
| TTP223 touch sensor | Input device | ~$0.30 | Capacitive touch switch; see [TTP223](../sensors/14-touch-ttp223.md). |
| RC522 RFID reader | Input device | ~$2 | 13.56 MHz RFID card reader; see [RFID RC522 kit](../kits/rfid-rc522/index.md). |
| Momentary push buttons | Input device | $0.20 | Tactile buttons used in nearly every kit; see [NeoPixel strip with two buttons](../kits/03-neopixel-strip-two-buttons.md). |
| Rotary encoder (KY-040) | Input device | $1 | Knob with push switch; see [rotary encoder](../sensors/10-rotary-encoder.md) and the [rotary NeoPixel kit](../kits/03-rotary-neopixel.md). |
| 10K potentiometer | Input device | $0.50 | Analog knob; see [potentiometer lab](../sensors/02-pot.md) and moving-rainbow led-dimmer. |
| Bump / limit switch | Input device | ~$0.30 | Collision switch used by the stem-robots bump-switch-bot. |
| INMP441 I2S microphone | Audio input | $3 | Digital MEMS microphone used for FFT and spectrum analyzers; see [INMP441](../sensors/15-inmp441.md) and spectrum-analyzer / fft-benchmarking. |
| MAX4466 microphone | Audio input | ~$2 | Analog electret mic amp; see [MAX4466 microphone kit](../kits/microphone-max4466/index.md). |
| MAX98357A I2S amplifier | Audio output | $1–$2 | 3 W class-D amp used in the stem-robots max98357a-amp and synth-sounds kits. |
| PCM5102 I2S DAC | Audio output | ~$3 | I2S stereo DAC used for audio labs in learning-micropython. |
| 8 Ω speaker (50 mm) | Audio output | $0.50 | Small speaker paired with the MAX98357A. |
| Piezo buzzer / speaker | Audio output | ~$0.30 | Tone output used in the [tone generator kit](../kits/tone-generator/index.md) and alarm clocks. |
| SSD1306 OLED (128×64) | Display | $3.50–$4 | The most popular I2C/SPI OLED, used in robot-faces, clocks-and-watches and many labs; used across many kits. |
| SH1106 OLED (1.3") | Display | ~$4 | Larger OLED used in the clocks-and-watches sh1106 kit. |
| SSD1322 OLED (256×64) | Display | ~$15 | Large grayscale OLED; see the oled-ssd1322 kit. |
| SSD1351 color OLED | Display | ~$10 | Small color OLED referenced in clocks-and-watches. |
| ST7735 TFT (1.8") | Display | about $3.50 | 160×128 color TFT used in the clocks-and-watches st7735 kit. |
| ST7789 TFT | Display | ~$4 | Color IPS TFT used in clocks-and-watches and the robot-faces rect displays. |
| ILI9341 TFT (2.8") | Display | about $9 | 320×240 color TFT used in the clocks-and-watches ili9341 kit. |
| GC9A01 round TFT | Display | about $5 | 240×240 round display used in clocks-and-watches gc9a01 and watch faces. |
| GC9B72 smartwatch display | Display | ~$10 | Smartwatch-style display used in robot-faces, clocks-and-watches and thinking-spot-demos sw-gc9b72 kits. |
| Waveshare / SSD1680 e-paper | Display | ~$10 | E-paper displays used in the clocks-and-watches e-paper kits. |
| LCD1602 character LCD (PCF8574 I2C) | Display | ~$3 | 16×2 character LCD used in the clocks-and-watches char-lcd-clock kit. |
| TM1637 4-digit LED | Display | $1 | Cheapest working clock display used in the clocks-and-watches tm1637 kit. |
| TM1650 4-digit LED | Display | ~$1 | LED clock display used in the clocks-and-watches tm1650-led-clock kit. |
| MAX7219 LED matrix / 7-segment | Display | ~$2 | SPI LED driver used in the clocks-and-watches max7219 kit. |
| 74HC595 shift register | Display driver | ~$0.20 | Shift register used in the clocks-and-watches shift-register-clock kit. |
| WS2812B NeoPixel strips, rings and matrices | LEDs | ~$3 per meter | Addressable RGB LEDs used throughout moving-rainbow and the [NeoPixel kit](../kits/neopixel/index.md). |
| SK6812 RGBW NeoPixels | LEDs | ~$5 per meter | RGBW variant of NeoPixels mentioned in moving-rainbow. |
| Single-color and RGB LEDs | LEDs | ~$0.05 | Basic LEDs used in the [PWM kit](../kits/pwm/index.md), [RGB box](../kits/rgb-box/index.md) and the Larson scanner kit. |
| DS3231 RTC | RTC module | $0.73–$3 | Accurate temperature-compensated real-time clock used in clocks-and-watches kits. |
| DS1307 RTC | RTC module | ~$1 | Older RTC that the clock kits are moving away from in favor of the DS3231. |
| DC gear motors (TT motors) | Actuator/motor | ~$2 | Drive motors for the stem-robots base-bot and other two-wheel robots. |
| DRV8833 motor driver | Actuator/motor driver | about $1–$2 | Dual H-bridge used in the stem-robots base-bot. |
| L298N / L293D motor driver | Actuator/motor driver | ~$2 | Older H-bridge drivers referenced in learning-micropython. |
| MX1508 motor driver | Actuator/motor driver | ~$1 | Low-cost dual H-bridge referenced in stem-robots. |
| SG90 micro servo | Actuator/motor | $2 | Small servo used in learning-micropython servo labs. |
| 28BYJ-48 stepper + ULN2003 driver | Actuator/motor | ~$2 | Low-cost stepper motor kit referenced in learning-micropython. |
