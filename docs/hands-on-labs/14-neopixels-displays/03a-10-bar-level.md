# Ten Bar Level Voltage Meter with a LM3914

!!! mascot-welcome "Welcome to the Level Meter Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will build a voltage meter that lights up an LED bar graph! Turn a knob and watch the bar grow and shrink in real time. Let's build something amazing!

## What This Project Does

This project reads a voltage from a potentiometer (a knob you can turn). It then shows the voltage level on a 10-segment LED bar graph. The more you turn the knob, the more LEDs light up.

A **potentiometer** is a variable resistor. Think of it like a volume knob on a speaker — turning it changes the resistance and changes the voltage the Pico reads.

The **LM3914** is a special chip that reads a voltage and automatically lights up the right number of LEDs. You only need to send it a signal — it handles the rest.

## Components Needed

- Raspberry Pi Pico
- LM3914 LED bar/dot display driver chip
- 10-segment LED bar graph (or 10 individual LEDs)
- 10 kΩ potentiometer
- 1 kΩ resistor for LM3914 current limiting
- Breadboard and jumper wires
- Micro USB cable for programming the Pico

## Circuit Description

The circuit has three main parts:

1. **Potentiometer input** — connects to the Analog-to-Digital Converter (ADC) pin GPIO26 on the Pico
2. **Raspberry Pi Pico** — reads the analog value and sends a signal to the LM3914
3. **LM3914 display driver** — controls the 10-segment LED bar graph

An **Analog-to-Digital Converter (ADC)** turns a changing voltage (like the output of a potentiometer) into a number your code can read.

### Breadboard Layout

#### 1. Power Rails

1. Connect 3.3V from the Pico to the breadboard power rail.
2. Connect GND from the Pico to the breadboard ground rail.

#### 2. Potentiometer

1. Connect one outer pin of the potentiometer to 3.3V.
2. Connect the other outer pin to GND.
3. Connect the middle pin (the wiper) to GPIO26 (ADC0) on the Pico.

#### 3. LM3914 Connections

1. Connect Pin 1 (LED1) to the first LED in the bar graph.
2. Connect Pins 2–9 to the matching LEDs in the bar graph.
3. Connect Pin 10 (LED10) to the last LED in the bar graph.
4. Connect Pin 11 (V-) to GND.
5. Connect Pin 12 (SIG) to GPIO16 on the Pico (this carries the Pulse Width Modulation (PWM) signal).
6. Leave Pin 13 (REF OUT) unconnected.
7. Connect Pin 14 (REF ADJ) to GND through a 1 kΩ resistor.
8. Connect Pin 15 (MODE) to 3.3V for bar mode (all LEDs below the level stay on).
9. Connect Pin 16 (V+) to 3.3V.
10. Connect Pin 17 (RHI) to 3.3V.
11. Connect Pin 18 (RLO) to GND.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Pulse Width Modulation (PWM) is a way to fake an analog voltage using digital signals. The Pico sends a fast on/off signal. The LM3914 sees the average voltage and lights up the right number of LEDs.

## How The Level Meter Works

### Circuit Operation

1. The potentiometer acts as a **voltage divider**. It gives a voltage between 0 V and 3.3 V to GPIO26 on the Pico.
2. The Pico's ADC converts this voltage to a number between 0 and 65535.
3. The MicroPython code reads this number and maps it to a PWM duty cycle.
4. The PWM signal from GPIO16 goes to the SIG pin (pin 12) of the LM3914.
5. The LM3914 compares this signal to its internal reference voltage. It then lights up the right number of LEDs.
6. Turning the potentiometer changes how many LEDs are lit.

## Sample MicroPython Code

```python
from machine import Pin, ADC, PWM   # import ADC for reading voltage, PWM for output
import time                          # import time for delays

# Pin numbers
POT_PIN = 26   # ADC0 — reads the potentiometer voltage on GPIO26
PWM_PIN = 16   # sends the PWM signal to the LM3914 on GPIO16

# Set up the ADC to read the potentiometer
pot = ADC(Pin(POT_PIN))

# Set up PWM on GPIO16 to send a signal to the LM3914
pwm = PWM(Pin(PWM_PIN))
pwm.freq(10000)   # use 10,000 Hz — fast enough to smooth out the signal

def map_value(value, in_min, in_max, out_min, out_max):
    """Convert a number from one range to another range."""
    return (value - in_min) * (out_max - out_min) // (in_max - in_min) + out_min

def read_voltage():
    """Read the potentiometer and return a voltage between 0 V and 3.3 V."""
    raw_value = pot.read_u16()           # read a number from 0 to 65535
    voltage = raw_value * 3.3 / 65535   # convert the number to a voltage
    return voltage

def set_bar_level(level):
    """Set the LM3914 level by sending a PWM duty cycle value (0–65535)."""
    pwm.duty_u16(level)   # set how long the PWM signal stays HIGH each cycle

print("LM3914 Voltage Meter starting...")
print("Turn the potentiometer to see the LED bar change")

try:
    while True:
        voltage = read_voltage()   # read the current potentiometer voltage

        # Map the voltage (0–3.3 V) to a PWM value (0–65535)
        pwm_value = map_value(int(voltage * 1000), 0, 3300, 0, 65535)

        set_bar_level(pwm_value)   # send the PWM value to the LM3914

        # Print the voltage so you can see it in Thonny's console
        print(f"Voltage: {voltage:.2f}V, PWM: {pwm_value}")

        time.sleep(0.1)   # wait 100 ms before reading again

except KeyboardInterrupt:
    pwm.duty_u16(0)   # set PWM to 0 to turn off all LEDs when you stop the program
    print("Program stopped")
```

### What Each Line Does

| Line | Purpose |
|------|---------|
| `ADC(Pin(POT_PIN))` | Sets up GPIO26 to read an analog voltage |
| `PWM(Pin(PWM_PIN))` | Sets up GPIO16 to send a PWM signal |
| `pwm.freq(10000)` | Sets the PWM frequency to 10,000 Hz |
| `pot.read_u16()` | Reads the voltage as a number from 0 to 65535 |
| `raw_value * 3.3 / 65535` | Converts the raw number to a voltage in volts |
| `map_value(...)` | Converts the voltage range to the PWM range |
| `pwm.duty_u16(level)` | Sends the PWM duty cycle to the LM3914 |
| `except KeyboardInterrupt:` | Runs when you press Stop in Thonny |
| `pwm.duty_u16(0)` | Turns off the PWM signal cleanly on exit |

!!! mascot-encourage "You Can Do This!"
    ![Monty encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    The `map_value()` function can look tricky. Remember: it just converts a number from one range to another. If you turn the knob to the halfway point, it maps to the halfway PWM value, and about 5 LEDs light up. You've got this, coder!

## Additional Notes

1. **Filtering** — You can add a small capacitor (about 0.1 µF) between the PWM output and the LM3914 SIG pin. The capacitor smooths out the PWM signal and makes the LED bar steadier.

2. **Mode selection** — The LM3914 has two display modes:
   - Connect pin 15 to 3.3V for **bar mode** — all LEDs up to the level stay on
   - Connect pin 15 to GND for **dot mode** — only one LED lights up at the current level

3. **Current limiting** — The 1 kΩ resistor on pin 14 limits how much current flows through the LEDs. Use a smaller resistor to make the LEDs brighter. Use a larger resistor to make them dimmer.

4. **Simpler alternative** — If you do not have an LM3914 chip, you can connect 10 LEDs directly to 10 GPIO pins on the Pico. The lab called [10-Bar LED Graph](03-10-bar-leds.md) shows you how to do that.

## References

[LM3914 Video Tutorial on YouTube](https://www.youtube.com/watch?v=DvmW-cX00Kg)

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You built a real voltage meter that shows a reading on a bar graph! Next, try the 8×8 LED Matrix lab to show patterns and letters on a grid of LEDs.
