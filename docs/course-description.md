---
title: Course Description for Learning MicroPython and Physical Computing
description: A detailed course description for Learning MicroPython and Physical Computing including overview, topics covered and learning objectives in the format of the 2001 Bloom Taxonomy
quality_score: 97
---
# Learning MicroPython and Physical Computing

**Title:** Learning MicroPython and Physical Computing

**Target Audience:** Students aged 10–18 (5th through 12th grade) as the primary audience, with content written to be accessible to learners of all ages, including hobbyists, makers, parents, mentors, and adult continuing-education students.

**Prerequisites:** None required. No prior programming or electronics experience is assumed. Comfort with basic keyboard skills and reading at roughly a 5th-grade level is helpful. Access to a low-cost microcontroller (such as the $4 Raspberry Pi Pico) with at least 16 KB of RAM, a USB cable, a solderless breadboard, and a small set of inexpensive sensors, LEDs, and displays is needed for the hands-on labs.

## Course Overview

This course is a hands-on introduction to **MicroPython** and **physical computing** — writing Python programs that read sensors, light up displays, make sounds, and move motors on inexpensive microcontrollers. Using the $4 Raspberry Pi Pico (and compatible boards such as the Pico W and the ESP32), students learn to build real, working electronic projects that bridge the digital and physical worlds. The course progresses from blinking a single LED to building collision-avoidance robots, wireless sensor stations, and interactive sound-and-light displays.

Physical computing is one of the most engaging ways to learn computer science. When a program turns on a light, spins a motor, or reacts to a wave of the hand, abstract programming concepts become concrete and immediate. Because MicroPython runs an interactive interpreter directly on the microcontroller, students see results instantly, debug quickly, and stay motivated. The course deliberately uses low-cost, widely available hardware so that classrooms, coding clubs, and individual learners anywhere in the world can participate for under $20.

Beyond programming syntax, the course is designed to teach **computational thinking** — decomposition, pattern recognition, abstraction, and algorithm design — through the lens of tangible projects. Students finish the course able to read a wiring diagram, select appropriate components, write and debug MicroPython programs, combine multiple sensors and actuators into a single system, and design original projects of their own. The skills transfer directly to robotics competitions, science-fair projects, IoT prototyping, and further study in computer science and engineering.

## Main Topics Covered

- **Introduction to Physical Computing** — what MicroPython is, why it has become popular for microcontrollers, the history of the Raspberry Pi Pico, and how to choose and purchase microcontrollers and kits
- **Getting Started** — setting up an IDE (Thonny), flashing the MicroPython firmware, the REPL, transferring files, and using a solderless breadboard safely
- **MicroPython Language Basics** — variables, data types, loops, conditionals, functions, modules, and the `machine` library for hardware control
- **Digital and Analog I/O** — controlling LEDs, reading buttons, debouncing, pulse-width modulation (PWM) for fading and brightness, and reading analog values from potentiometers and light sensors
- **Sensors** — temperature/humidity (DHT11, BME280), distance (HC-SR04, VL53L0X time-of-flight), light, rotary encoders, accelerometers, gesture (APDS9960), and magnetic field/compass (HMC5883L) sensors using GPIO, ADC, I2C, and SPI
- **Motors and Robots** — transistor motor control, H-bridge drivers (L293D, DRV8833), DC motors, servos, stepper motors, and building line-following and collision-avoidance robots
- **Displays** — LEDs, NeoPixel strips and matrices, 7-segment and LED-matrix displays (MAX7219), character LCDs, and graphical OLED displays (SSD1306, SH1106)
- **Sound and Music** — generating tones with a buzzer, playing melodies, and producing more complex audio and sound effects
- **Wireless and IoT** — connecting the Pico W / ESP32 to Wi-Fi, building simple web servers, and sending and receiving data over a network
- **Educational Kits** — complete integrated projects using boards such as the Cytron Maker Pi RP2040
- **Debugging and Computational Thinking** — systematic troubleshooting of hardware and software, reading error messages, and problem-decomposition strategies
- **Using AI Tools** — effective prompting of generative-AI assistants (Claude, ChatGPT) to explain concepts, generate code, and debug MicroPython projects

## Topics Not Covered

- Standard desktop/server Python (CPython), web frameworks, and data-science libraries beyond what runs on a microcontroller
- The C/C++ Arduino toolchain and the Arduino IDE (the focus is exclusively MicroPython)
- Printed-circuit-board (PCB) design, soldering, and surface-mount assembly (all projects use solderless breadboards)
- Advanced electronics theory and circuit analysis (e.g., calculus-based circuit design, transistor physics)
- Single-board computers running full Linux (e.g., Raspberry Pi 4/5) and full-Python machine-learning/computer-vision projects — these are covered in companion courses such as the AI Racing League
- 3D modeling, CAD, and mechanical fabrication of robot chassis
- Industrial real-time operating systems and safety-critical embedded development

## Learning Outcomes

After completing this course, students will be able to:

### Remember
*Retrieving, recognizing, and recalling relevant knowledge from long-term memory.*

- Recall what MicroPython is and how it differs from standard Python and the Arduino C/C++ environment
- Identify common microcontrollers (Raspberry Pi Pico, Pico W, ESP32) and state their key specifications such as RAM, clock speed, and price
- Label the pins of a Raspberry Pi Pico, including power, ground, GPIO, ADC, I2C, and SPI pins
- Recognize common components: LEDs, resistors, buttons, potentiometers, sensors, motors, and displays
- Recall the basic MicroPython syntax for importing the `machine` module and creating `Pin`, `PWM`, `ADC`, and `I2C` objects
- List the standard wiring conventions and color codes used on a solderless breadboard

### Understand
*Constructing meaning from instructional messages, including oral, written, and graphic communication.*

- Explain the difference between digital and analog signals and when each is used
- Describe how pulse-width modulation (PWM) creates dimming, fading, and servo-control effects
- Explain how the I2C and SPI buses let a microcontroller communicate with multiple sensors and displays
- Summarize how a time-of-flight sensor, an ultrasonic sensor, and a light sensor each measure their environment
- Interpret a wiring diagram and predict how a circuit will behave
- Explain the four pillars of computational thinking and how they apply to a physical-computing project

### Apply
*Carrying out or using a procedure in a given situation.*

- Set up the MicroPython development environment, flash firmware, and use the REPL to run interactive commands
- Write a program that blinks an LED, fades it with PWM, and responds to a button press with debouncing
- Read analog values from a potentiometer or light sensor using the ADC and scale them to a useful range
- Connect an I2C sensor and an OLED display and print live sensor readings to the screen
- Drive a DC motor and a servo using an H-bridge or PWM control
- Connect a Pico W or ESP32 to Wi-Fi and serve a simple web page that displays sensor data

### Analyze
*Breaking material into constituent parts and determining how the parts relate to one another and to an overall structure or purpose.*

- Break a multi-sensor project (e.g., a robot) into independent subsystems and explain how they interact
- Diagnose why a circuit or program is not working by isolating hardware, wiring, and software causes
- Compare two sensors (e.g., HC-SR04 vs. VL53L0X) and analyze the trade-offs in accuracy, range, cost, and complexity
- Trace the flow of data from a sensor, through the microcontroller, to an actuator or display
- Examine a block of MicroPython code and identify the role of each function, loop, and hardware object
- Distinguish blocking from non-blocking timing approaches and analyze their effect on program responsiveness

### Evaluate
*Making judgments based on criteria and standards through checking and critiquing.*

- Select the most appropriate microcontroller and sensors for a given project based on cost, RAM, connectivity, and required features
- Critique a wiring layout or program for safety, reliability, and readability, and recommend improvements
- Judge whether a project's measured results are accurate and propose ways to calibrate or improve them
- Assess the quality and correctness of AI-generated MicroPython code before using it in a project
- Evaluate competing design solutions for a robot or display and justify a recommendation against stated criteria
- Review another student's project and provide constructive, criteria-based feedback

### Create
*Putting elements together to form a coherent or functional whole; reorganizing elements into a new pattern or structure.*

- Design and build an original multi-sensor project that combines input, processing, and output
- Develop a working robot (such as a line-follower or collision-avoidance robot) integrating motors, sensors, and a display
- Compose an interactive sound-and-light display using NeoPixels and a buzzer driven by sensor input
- Build a wireless IoT device that reports sensor data to a web page or another device
- Write reusable, well-commented MicroPython modules and share them with others
- **Capstone project:** Conceive, wire, program, debug, and document a complete physical-computing project of the student's own design, including a wiring diagram, annotated source code, and a demonstration

## Why This Course Matters

Physical computing turns programming from an abstract activity into a tangible, joyful experience — and that engagement is what keeps learners coming back. By starting with $4 hardware and free software, this course removes the cost barrier that once kept embedded programming out of reach for most classrooms and clubs. Students who complete it gain not only MicroPython fluency but also durable habits of computational thinking, systematic debugging, and hands-on problem solving that transfer to robotics, the Internet of Things, science fairs, and further study in computer science and engineering. The course's progressive, lab-driven structure means every learner — whether a 10-year-old in a coding club or an adult hobbyist — can start at the very beginning and build all the way up to original, working inventions of their own.
