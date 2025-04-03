# Raspberry Pi Pico OLED Display and PWM Lab Manual

## Introduction

This lab manual guides instructors through a series of exercises using the Raspberry Pi Pico microcontroller, focusing on working with OLED displays and pulse-width modulation (PWM). These exercises are designed to teach fundamental concepts in embedded systems programming using MicroPython.

## Hardware Requirements

- Raspberry Pi Pico microcontroller
- 128x64 OLED display (SSD1306)
- External LED
- Potentiometer
- Breadboard and jumper wires
- USB cable for programming the Pico

## Software Requirements

- MicroPython firmware installed on the Raspberry Pi Pico
- SSD1306 library for the OLED display
- Python IDE (Thonny recommended)

## Pin Connections

Based on the code examples, here's the wiring configuration:

### OLED Display
- Clock (SCK): GPIO 2
- Data (MOSI): GPIO 3
- Reset (RES): GPIO 4
- Data/Command (DC): GPIO 5
- Chip Select (CS): GPIO 6

### External Components
- External LED: GPIO 18 (for PWM examples)
- Potentiometer: ADC pin 26

## Lab Exercises

### Exercise 1: Blinking the Onboard LED

**File: 01-blink.py**

This introductory exercise teaches students how to blink the Pico's onboard LED. This establishes a fundamental understanding of digital output pins.

**Key Concepts:**
- Setting up a GPIO pin as output
- Using toggle() function
- Implementing timing with sleep()

### Exercise 2: Reading Analog Input

**File: 01-pot-print.py**

Students learn to read analog values from a potentiometer using the Pico's ADC.

**Key Concepts:**
- Analog-to-Digital Conversion (ADC)
- Reading analog input values
- Serial output for debugging

### Exercise 3: Controlling an External LED

**File: 02-external-blink.py**

Building on Exercise 1, students connect and control an external LED.

**Key Concepts:**
- External circuit connections
- Digital output control

### Exercise 4: LED Fading with PWM

**File: 03-external-led-fader.py**

Introduction to Pulse Width Modulation (PWM) to control LED brightness.

**Key Concepts:**
- PWM basics
- Duty cycle control
- Creating fade effects

### Exercise 5: Basic OLED Display

**File: display-test-47.py**

Students learn to use the OLED display to show text.

**Key Concepts:**
- SPI communication
- Display initialization
- Text rendering on OLED
- Display refresh cycle

### Exercise 6: Potentiometer Bar Graph

**File: 03-display-pot-bar.py**

This exercise combines analog input with graphical output, displaying the potentiometer value as a horizontal bar.

**Key Concepts:**
- Value mapping between ranges
- Drawing shapes on OLED
- Real-time visualization

### Exercise 7: PWM Visualization

**File: display-pwm.py**

Students create a visual representation of a PWM signal on the OLED display.

**Key Concepts:**
- Square wave representation
- Advanced drawing functions
- Duty cycle visualization

### Exercise 8: LED Dimmer with Potentiometer

**File: 05-pot-led-dimmer.py**

Control the brightness of an LED using a potentiometer.

**Key Concepts:**
- Using potentiometer as a control input
- Applying PWM for brightness control
- Real-time adjustment

### Exercise 9: Complete PWM System

**File: main.py or 10-display-pwm-fade-led.py**

The culminating exercise combines all previous concepts into a complete system that:
- Reads potentiometer input
- Controls LED brightness with PWM
- Visualizes the duty cycle on the OLED display

**Key Concepts:**
- System integration
- Visual feedback
- Hardware/software interaction

## Teaching Tips

### Understanding the Map Function

All projects using the potentiometer implement a `map()` function to convert values from one range to another. Make sure students understand this concept:

```python
def map(value, istart, istop, ostart, ostop):
  if (istop - istart) == 0:
      return ostop
  else:
      return int(ostart + (ostop - ostart) * ((value - istart) / (istop - istart)))
```

This function takes a value from one range (`istart` to `istop`) and maps it to a corresponding value in another range (`ostart` to `ostop`).

### PWM Concepts

Ensure students understand that:
- PWM frequency (`pwm.freq()`) determines how fast the signal cycles
- Duty cycle (`pwm.duty_u16()`) controls the percentage of time the signal is high
- The perceived LED brightness is proportional to the duty cycle

### OLED Display Functions

Key display functions include:
- `oled.fill(0)` - Clear the display buffer
- `oled.text('string', x, y)` - Draw text at position (x,y)
- `oled.fill_rect(x, y, width, height, color)` - Draw a filled rectangle
- `oled.hline(x, y, width, color)` - Draw a horizontal line
- `oled.vline(x, y, height, color)` - Draw a vertical line
- `oled.show()` - Update the physical display with the buffer contents

### Understanding the Draw Pulse Wave Function

The `draw_pulse_wave()` function in several examples creates a visual representation of a PWM signal:

```python
def draw_pulse_wave(dutyCycle, yOffset):
    pulses = 5
    square_wave_height = 20
    sq_wave_period = WIDTH // pulses
    high_length = int(dutyCycle * sq_wave_period / 100)
    
    for i in range(0,pulses+1):
        # top bar
        oled.hline(i*sq_wave_period, yOffset-square_wave_height, high_length, 1)
        # down line
        oled.vline(i*sq_wave_period + high_length, yOffset-square_wave_height, square_wave_height, 1)
        # up line
        oled.vline(i*sq_wave_period + yOffset-square_wave_height-2, yOffset-square_wave_height+1, square_wave_height, 1)
        # bottem bar 
        oled.hline(i*sq_wave_period - (sq_wave_period - high_length), yOffset, sq_wave_period-high_length, 1)
```

This function:
1. Calculates how many pulses to draw
2. Determines the period of each square wave
3. Calculates high time based on duty cycle
4. Draws the square wave components

## Troubleshooting

### Common Issues and Solutions

1. **Display not showing anything**
   - Check SPI connections
   - Verify the correct pins are used
   - Ensure the display is powered properly

2. **LED not responding to PWM**
   - Verify the LED is connected correctly with the right polarity
   - Check that the correct GPIO pin is being used
   - Make sure the PWM frequency is appropriate

3. **Potentiometer readings inconsistent**
   - Check for loose connections
   - Ensure the potentiometer is connected to the correct ADC pin
   - Verify the ground connection is secure

## Assessment Ideas

1. Have students modify the code to add additional features:
   - Add a second LED controlled by another potentiometer
   - Display numerical values for potentiometer readings
   - Create custom animations on the OLED display

2. Challenge students to optimize the code:
   - Improve the efficiency of the drawing functions
   - Reduce power consumption with sleep modes
   - Implement interrupt-driven input instead of polling

3. Integration project:
   - Create a simple oscilloscope using the potentiometer as input
   - Build a reaction time game with the LED and OLED
   - Design a digital thermostat with temperature sensor input and PWM control

## Extension Activities

1. Add a second potentiometer to control PWM frequency
2. Implement button inputs to switch between different display modes
3. Create a data logger that stores and displays potentiometer readings over time
4. Add a servo motor controlled by the potentiometer

## Conclusion

This lab introduces students to fundamental concepts in embedded systems, including digital and analog I/O, PWM control, and graphical displays. The progressive nature of the exercises builds knowledge incrementally while reinforcing previous concepts.

The combination of hardware control and visual feedback provides an engaging learning experience that bridges theoretical concepts with practical applications in the field of embedded systems programming.