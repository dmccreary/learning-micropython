# Pulse Width Modulation STEM Kit

<iframe width="560" height="315" src="https://www.youtube.com/embed/nNzxCF-I2EI?si=2i_snyAlxTA3Y1u-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Instructors Guide

[Instructors Guide](instructors-guide.md)

## Code

[Source Code Folder on GitHub](https://github.com/dmccreary/learning-micropython/tree/main/src/kits/pwm-display)

## Lesson Plan

# Pulse Width Modulation (PWM) STEM Kit: 9th Grade Lesson Plan

## Lesson Overview

* **Title**: Exploring Pulse Width Modulation
* **Grade Level**: 9th Grade
* **Duration**: 90 minutes
* **Subject Areas**: Electronics, Computer Science, Physics

## Learning Objectives

By the end of this lesson, students will be able to:

1. Explain the concept of Pulse Width Modulation (PWM)
2. Assemble a basic circuit on a breadboard
3. Program a Raspberry Pi Pico microcontroller
4. Understand the relationship between duty cycle and LED brightness
5. Analyze how PWM is used in everyday technology

## Materials Needed

* PWM STEM Kit (per student or group):
  * Raspberry Pi Pico ($4.00)
  * Breadboard ($1.75)
  * Potentiometer (20K ohm) ($0.50)
  * LED ($0.05)
  * 128x64 OLED Display ($13.00)
* Jumper wires
* USB cable for Raspberry Pi Pico
* Computer with Thonny Python IDE installed
* Student worksheets
* Multimeter (optional)

## Prior Knowledge Required

* Basic understanding of circuits
* Introduction to programming concepts
* Familiarity with variables and functions

## Preparation

1. Install Thonny Python IDE on classroom computers
2. Test all components before class
3. Prepare the Python code template for students
4. Print student worksheets

## Introduction (15 minutes)

1. Begin with a brief discussion: "What happens when you dim the lights in your home? How do you think electronic devices control power?"
2. Introduce the concept of Pulse Width Modulation:
   * Define PWM as a technique for controlling power delivery
   * Explain duty cycle as the ratio of "on time" to total time
   * Show examples of PWM in everyday devices (LED lights, motor speed control, audio synthesis)
3. Demonstrate a completed PWM circuit to the class

## Circuit Assembly (20 minutes)

1. Distribute the PWM STEM kits to students
2. Guide students through the following assembly steps:
   * Place the Raspberry Pi Pico on the breadboard
   * Connect the potentiometer to an analog input pin
   * Connect the LED to a PWM-capable pin (with appropriate resistor)
   * Wire the OLED display using I2C connection
3. Check each group's circuit before proceeding

## Programming the Microcontroller (25 minutes)

1. Provide students with the Python code template
2. Explain key sections of the code:
   * Setting up the PWM pin
   * Reading the potentiometer value
   * Converting analog reading to PWM duty cycle
   * Updating the OLED display
3. Have students complete sections of the code
4. Assist with uploading the code to the Raspberry Pi Pico

## Experimentation and Challenges (20 minutes)

1. Have students run their completed circuits
2. Direct students to complete the following challenges:
   * Turn the knob to achieve exactly 25% duty cycle
   * Find the point where pulse width equals spacing between pulses
   * Create a pattern of gradually increasing then decreasing brightness
3. Students should record observations in their worksheets

## Discussion and Connection to Real-World Applications (10 minutes)

1. Discuss findings as a class
2. Explore real-world applications of PWM:
   * Motor speed control in drones and robots
   * LED dimming in displays and lighting
   * Audio synthesis in music production
   * Power management in electronic devices

## Assessment and Wrap-Up (10 minutes)

1. Quick quiz to check understanding of key concepts
2. Have students explain how changing the duty cycle affects LED brightness
3. Collect student worksheets
4. Preview next lesson on advanced PWM applications

## Extensions and Homework

1. Research additional applications of PWM technology
2. Modify the code to create a "breathing" LED effect
3. Design a simple project that incorporates PWM control

## Appendix: Sample Code

```python
from machine import Pin, PWM, ADC, I2C
import ssd1306
import time

# Setup the PWM for the LED
led_pwm = PWM(Pin(15))
led_pwm.freq(1000)  # Set PWM frequency to 1kHz

# Setup the potentiometer
pot = ADC(Pin(26))

# Setup the OLED display
i2c = I2C(0, sda=Pin(0), scl=Pin(1), freq=400000)
display = ssd1306.SSD1306_I2C(128, 64, i2c)

while True:
    # Read potentiometer value (0-65535)
    pot_value = pot.read_u16()
    
    # Convert to duty cycle (0-65535)
    duty = pot_value
    
    # Set the PWM duty cycle
    led_pwm.duty_u16(duty)
    
    # Calculate duty cycle percentage (0-100%)
    duty_percent = duty / 65535 * 100
    
    # Update display
    display.fill(0)
    display.text("PWM Control", 10, 10, 1)
    display.text("Duty: {:.1f}%".format(duty_percent), 10, 30, 1)
    
    # Draw the PWM signal representation
    pulse_width = int(duty_percent / 100 * 80)
    display.rect(10, 45, 80, 10, 1)
    display.fill_rect(10, 45, pulse_width, 10, 1)
    
    display.show()
    time.sleep(0.1)
```

## Differentiation Strategies

* **For advanced students**: Challenge them to modify the code to implement multiple patterns or to control multiple LEDs with different effects
* **For struggling students**: Provide additional guidance with circuit assembly and work with them in smaller groups on programming concepts
* **For visual learners**: Include additional diagrams of circuit connections and PWM signals
* **For kinesthetic learners**: Provide physical models or animations demonstrating duty cycle concepts