# Chapters

This textbook is organized into 23 chapters covering 485 concepts across Python programming, electronics, sensors, displays, motors, robots, wireless networking, and project design.

## Chapter Overview

1. [Python Basics — Programs, Variables, Data Types, and Operators](01-python-basics/index.md) - The fundamental building blocks of every Python program: variables, data types, operators, syntax, and print statements.
2. [Collections, Control Flow, Functions, and Error Handling](02-control-flow-functions/index.md) - Lists, dictionaries, loops, conditionals, functions, modules, and how to handle errors gracefully.
3. [MicroPython Environment and Development Tools](03-micropython-environment/index.md) - Setting up Thonny, flashing firmware, using the REPL, transferring files, and the MicroPython standard library.
4. [Microcontrollers and Hardware Platforms](04-microcontrollers-hardware/index.md) - The Raspberry Pi Pico, RP2040, Pico W, ESP32, GPIO pins, power, logic levels, and onboard memory.
5. [Electronics Fundamentals](05-electronics-fundamentals/index.md) - Voltage, current, resistance, Ohm's law, LEDs, transistors, diodes, capacitors, breadboards, and wiring.
6. [Digital Input, Output, and Interrupts](06-digital-io-interrupts/index.md) - Controlling LEDs, reading buttons, debouncing, active-high/low logic, and interrupt service routines.
7. [Analog Signals, ADC, and Pulse-Width Modulation](07-analog-adc-pwm/index.md) - Analog signals, the ADC, potentiometers, light sensors, and PWM for fading LEDs and driving motors.
8. [Communication Protocols: I2C, SPI, and UART](08-communication-protocols/index.md) - The I2C, SPI, UART, 1-Wire, and I2S digital buses and MicroPython's machine classes for peripherals.
9. [Temperature, Humidity, and Distance Sensors](09-temp-distance-sensors/index.md) - DHT11, DHT22, BME280, DS18B20, HC-SR04 ultrasonic, VL53L0X time-of-flight, and IR distance sensors.
10. [Motion, Orientation, and Light Sensors](10-motion-light-sensors/index.md) - Accelerometers, gyroscopes, compass sensors, photoresistors, and gesture/color sensors using I2C.
11. [Rotary Encoders, Touch Sensors, and Audio Input](11-encoders-touch-audio/index.md) - Quadrature rotary encoders, capacitive touch sensors, digital microphones, and FFT concepts for audio.
12. [Motors, Servos, and Stepper Motor Control](12-motors-servos-steppers/index.md) - DC motors, H-bridge ICs, motor speed and direction with PWM, servo angle control, and stepper motors.
13. [Robots and Mobile Systems](13-robots-mobile-systems/index.md) - Differential-drive robots, line-following, collision avoidance, obstacle detection, and robot calibration.
14. [NeoPixels and Non-Graphical Displays](14-neopixels-displays/index.md) - WS2812B NeoPixel strips and matrices, RGB/HSV color models, 7-segment displays, LED arrays, and character LCDs.
15. [OLED Display Setup and Configuration](15-oled-setup/index.md) - OLED hardware, SSD1306 and SH1106 controllers, I2C/SPI interfaces, resolution options, and driver modules.
16. [OLED Drawing Methods, Framebuffer, and Animation](16-oled-drawing-animation/index.md) - OLED drawing APIs, the framebuf module, and animated projects like OLED Bounce and Pong.
17. [Color Displays and E-Paper Screens](17-color-epaper-displays/index.md) - Full-color TFT LCDs (ILI9341, ST7789V), color depth, custom drawing, and low-power e-paper displays.
18. [Sound, Music, and Audio Generation](18-sound-music-audio/index.md) - Buzzers, tone generation with PWM, musical note frequencies, melody playback, MIDI, DAC, and I2S audio.
19. [Wireless Connectivity and Internet of Things](19-wireless-iot/index.md) - Wi-Fi, HTTP, web servers, REST APIs, JSON, weather data, NTP time sync, and OTA updates.
20. [Timers, Timing Functions, and Multi-Core Programming](20-timers-multicore/index.md) - machine.Timer, non-blocking programming with ticks, precise timing, and RP2040 dual-core with _thread.
21. [File Systems, Audio Files, and Debugging](21-file-systems-debugging/index.md) - MicroPython file I/O, SD cards, WAV playback, I2S audio output, and systematic debugging strategies.
22. [Advanced Hardware Topics and AI-Assisted Coding](22-advanced-hardware-ai/index.md) - PIO state machines, FFT algorithms, DMA, watchdog timers, RTC, sleep modes, and AI prompt engineering.
23. [Applied Learning and Capstone Projects](23-applied-learning-projects/index.md) - Complete kit projects, computational thinking pillars, project design methodology, and a student capstone project.

## How to Use This Textbook

Start with Chapter 1 and work forward — each chapter builds on concepts introduced in earlier chapters. Chapters 1–5 give you the Python and electronics foundation you need for all hands-on labs. From Chapter 6 onward, every chapter includes working MicroPython programs you can run on your Raspberry Pi Pico. If you already know Python, you can skim Chapters 1–2 and start with Chapter 3.

---

**Note:** Each chapter lists every concept it covers. Complete the prerequisite chapters before moving to later ones — the dependency order is intentional and will make each new idea easier to understand.
