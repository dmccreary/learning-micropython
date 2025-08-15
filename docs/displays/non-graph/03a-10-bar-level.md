# Ten Bar Level Voltage Meter with a LM3914

Here is a MicroPython project for reading a potentiometer value and displaying it on a 10-segment LED bar using the LM3914 chip with a Raspberry Pi Pico. Let's break this down into the circuit description and code implementation.

## Raspberry Pi Pico 

This project uses a Raspberry Pi Pico to read an analog voltage from a potentiometer and display the voltage level on a 10-segment LED bar graph controlled by an LM3914 display driver chip.

## Components Needed

- Raspberry Pi Pico
- LM3914 LED bar/dot display driver IC
- 10-segment LED bar graph (or 10 individual LEDs)
- 10kΩ potentiometer
- 1kΩ resistor for LM3914 current limiting
- Breadboard and jumper wires
- Micro USB cable for programming the Pico

## Circuit Description

The circuit consists of three main parts:

1. **Potentiometer Input**: Connected to the ADC0 pin (GPIO26) of the Raspberry Pi Pico
2. **Raspberry Pi Pico**: Reads the analog value and controls the LM3914
3. **LM3914 Display Driver**: Controls the 10-segment LED bar graph

### Breadboard Layout

#### 1. Power Rails

- Connect 3.3V from Pico to the breadboard power rail
- Connect GND from Pico to the breadboard ground rail

#### 2. Potentiometer

- Connect the outer pins to 3.3V and GND respectively
- Connect the middle pin (wiper) to GPIO26 (ADC0) on the Pico

#### 3. LM3914 Connections

- Pin 1 (LED1): Connect to first LED in the bar graph
- Pin 2-9: Connect to respective LEDs in the bar graph
- Pin 10 (LED10): Connect to the last LED in the bar graph
- Pin 11 (V-): Connect to GND
- Pin 12 (SIG): Connect to GPIO16 (used as PWM output from Pico)
- Pin 13 (REF OUT): Not connected
- Pin 14 (REF ADJ): Connect to GND through a 1kΩ resistor for current limiting
- Pin 15 (MODE): Connect to 3.3V for bar graph display mode (or to GND for dot mode)
- Pin 16 (V+): Connect to 3.3V
- Pin 17 (RHI): Connect to 3.3V
- Pin 18 (RLO): Connect to GND

## How The Level Meter Works

### Circuit Operation

1. The potentiometer acts as a voltage divider, providing a variable voltage between 0V and 3.3V to the ADC0 pin of the Raspberry Pi Pico.

2. The Pico's ADC converts this analog voltage to a digital value (0-65535 for 16-bit resolution).

3. The MicroPython code reads this value and maps it to a PWM duty cycle.

4. The PWM output from GPIO16 is connected to the SIG pin (pin 12) of the LM3914.

5. The LM3914 compares this signal voltage to its internal reference voltage and lights up the appropriate number of LEDs in the bar graph.

6. With proper calibration, turning the potentiometer will cause the LED bar to display the corresponding voltage level.

## Sample MicroPython Code

Here's the MicroPython code to read the potentiometer value and control the LM3914:

```py
from machine import Pin, ADC, PWM
import time

# Configuration
POT_PIN = 26  # ADC0 - GPIO26
PWM_PIN = 16  # PWM output to LM3914 SIG pin

# Setup the ADC for potentiometer reading
pot = ADC(Pin(POT_PIN))

# Setup PWM for the LM3914
# The LM3914 expects an analog voltage at the SIG pin
# We'll use PWM with a low-pass filter to generate this voltage
pwm = PWM(Pin(PWM_PIN))
pwm.freq(10000)  # Set PWM frequency to 10kHz

def map_value(value, in_min, in_max, out_min, out_max):
    """Map value from one range to another"""
    return (value - in_min) * (out_max - out_min) // (in_max - in_min) + out_min

def read_voltage():
    """Read the voltage from potentiometer and return a value between 0 and 3.3V"""
    # Read ADC (0-65535) and convert to voltage (0-3.3V)
    raw_value = pot.read_u16()
    voltage = raw_value * 3.3 / 65535
    return voltage

def set_bar_level(level):
    """Set the level on the LM3914 bar graph (0-65535)"""
    pwm.duty_u16(level)

print("LM3914 Voltage Meter starting...")
print("Turn the potentiometer to see the LED bar change")

try:
    while True:
        # Read voltage from potentiometer
        voltage = read_voltage()
        
        # Map the voltage (0-3.3V) to PWM duty cycle (0-65535)
        pwm_value = map_value(int(voltage * 1000), 0, 3300, 0, 65535)
        
        # Set the bar graph level
        set_bar_level(pwm_value)
        
        # Print the current voltage for debugging
        print(f"Voltage: {voltage:.2f}V, PWM: {pwm_value}")
        
        # Small delay
        time.sleep(0.1)
        
except KeyboardInterrupt:
    # Turn off PWM on exit
    pwm.duty_u16(0)
    print("Program terminated")
```

### Code Explanation

- We use the ADC (Analog-to-Digital Converter) on GPIO26 to read the potentiometer value.
- We use PWM (Pulse Width Modulation) on GPIO16 to generate an analog-like voltage for the LM3914's SIG pin.
- The `map_value()` function converts the voltage reading range to the PWM duty cycle range.
- The main loop continuously reads the potentiometer value, updates the PWM duty cycle, and displays debugging information.

## Additional Notes

1. **Filtering**: You might want to add a small capacitor (e.g., 0.1µF) between the PWM output and the LM3914 SIG pin to smooth out the PWM signal.

2. **Mode Selection**: The LM3914 can operate in either "bar" mode or "dot" mode:
   - Connect pin 15 to 3.3V for bar mode (multiple LEDs lit)
   - Connect pin 15 to GND for dot mode (only one LED lit)

3. **Current Limiting**: The 1kΩ resistor connected to pin 14 limits the current through the LEDs. Adjust this value to change the LED brightness.

4. **Alternatives**: If you don't have an LM3914, you could directly control 10 LEDs from 10 GPIO pins of the Pico, but the LM3914 approach is more elegant and uses fewer pins.

This project demonstrates how to interface analog components with the Raspberry Pi Pico using MicroPython, combining ADC input, PWM output, and external display driver circuits.
## References

[LM3914](https://www.youtube.com/watch?v=DvmW-cX00Kg)