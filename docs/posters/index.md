# Infographic Posters for Learning MicroPython

These posters are designed for classroom display, science fairs, and textbook reference.
We use the `/verified-infographic-generator` skill to generate the image descriptions and then use OpenAI ChatGPT to render the infographics.

Each poster follows the same visual style: landscape 16:9, flat-design, off-white background (#F7F9FC), dark slate (#2A2E3A) text, and a palette of four accent colors drawn from the series palette below.

---

## Series Color Palette

| Role | Color | Hex |
|------|-------|-----|
| Raspberry Red | ![](https://placehold.co/20x20/C7164E/C7164E) | `#C7164E` |
| Magenta Pink | ![](https://placehold.co/20x20/E5398A/E5398A) | `#E5398A` |
| Deep Purple | ![](https://placehold.co/20x20/6A3FB5/6A3FB5) | `#6A3FB5` |
| Teal Blue | ![](https://placehold.co/20x20/1389A6/1389A6) | `#1389A6` |
| Forest Green | ![](https://placehold.co/20x20/2D8A4E/2D8A4E) | `#2D8A4E` |
| Warm Orange | ![](https://placehold.co/20x20/E07B39/E07B39) | `#E07B39` |

---

## Chapter 1 — Python Basics

1. [Python vs. MicroPython](./python-vs-micropython.md) — Side-by-side feature comparison for students switching from desktop Python

## Chapter 3 — MicroPython Environment

2. [MicroPython IDEs Compared](./ides.md) — Thonny, VS Code, Mu Editor, and Wokwi Simulator

## Chapter 4 — Microcontrollers & Hardware

3. [Microcontroller Boards Compared](./microncontrollers.md) — Pico, Pico W, Pico 2, ESP32

## Chapter 5 — Electronics Fundamentals

4. [Common Electronic Components](./electronic-components.md) — Visual ID guide to resistors, LEDs, capacitors, buttons, transistors, and potentiometers
5. [Resistor Color Codes](./resistor-color-codes.md) — 4-band color chart with mnemonic

## Chapter 6 — Digital I/O & Interrupts

6. [GPIO Pin Functions on the Pico](./gpio-functions.md) — Digital I/O, PWM, ADC, I2C, SPI, UART capabilities per pin type

## Chapter 7 — Analog, ADC & PWM

7. [Digital vs. Analog Signals](./digital-vs-analog.md) — Signal types, PWM as a bridge, and ADC conversion

## Chapter 8 — Communication Protocols

8. [Serial Protocols Compared: I2C vs. SPI vs. UART](./serial-protocols.md) — Wires, speed, addressing, full-duplex, and typical devices
9. [Communication Protocols Overview](./communication-protocols.md) — General-purpose and specialized protocols

## Chapter 9 — Temperature & Distance Sensors

10. [Temperature & Distance Sensors](./sensors.md) — DHT11/DHT22/BMP280 and HC-SR04/VL53L0X

## Chapter 10 — Motion & Light Sensors

11. [Motion & Light Sensors](./motion-light-sensors.md) — PIR, MPU-6050, LDR photoresistor, APDS-9960

## Chapter 12 — Motors, Servos & Steppers

12. [Motor Types Compared](./motor-types.md) — DC motor, servo motor, stepper motor
13. [Motor Driver ICs Compared](./motor-drivers.md) — L293D, DRV8833, TB6612FNG

## Chapter 13 — Robots & Mobile Systems

14. [Robot Drive Configurations](./robot-configurations.md) — Differential, 4WD, tricycle/Ackermann, mecanum, legged

## Chapter 14 — NeoPixels & Displays

15. [LED Types Compared](./led-types.md) — Single LED, RGB LED, NeoPixel/WS2812B, LED Matrix

## Chapters 15–17 — Displays

16. [Display Technologies Compared](./display-technologies.md) — OLED (SSD1306), TFT Color LCD (ILI9341), ePaper (SSD1680)

## Chapter 18 — Sound, Music & Audio

17. [Sound Output Methods](./sound-output.md) — Passive buzzer, active buzzer, speaker+PWM, I2S DAC+amp

## Chapter 19 — Wireless & IoT

18. [Wireless Technologies Compared](./wireless-technologies.md) — WiFi 802.11n, Bluetooth BLE 5.x, LoRa, Zigbee
19. [IoT Architecture Layers](./iot-architecture.md) — Perception → Network → Edge → Cloud → Application

## Chapter 20 — Timers & Multicore

20. [MicroPython Memory Types](./memory-types.md) — Internal flash, SRAM, microSD card, I2C EEPROM

## Chapter 21 — File Systems & Debugging

21. [Common MicroPython Errors](./micropython-errors.md) — Eight frequent exceptions with causes and fixes

## Chapter 6/11 — Input Devices

22. [Input Device Comparison](./input-devices.md) — Push button, potentiometer, rotary encoder, capacitive touch, keypad, joystick

## Chapter 22 — Advanced Hardware & AI

23. [Edge AI on Microcontrollers](./edge-ai.md) — MicroPython + TensorFlow Lite Micro + Edge Impulse comparison
