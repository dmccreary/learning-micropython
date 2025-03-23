# Tone Generator with a Potentiometer

## Setup

- connect the tap of the potentiometer to ADC0 pin 26
- connect the ends of the potentiometer to GND and 3.3VREF
- make sure to use the GND pin that is isolated
- connect the speaker between GND and pin 15 in the lower left corner

Then load and run the code

## Tone Generator Code

```python
import machine
import time

# Configure the potentiometer on ADC pin
# Choose a suitable ADC pin - let's use pin 26
pot = machine.ADC(26)

# Configure the PWM output for the speaker
# Choose a suitable pin - let's use pin 15
speaker_pin = machine.Pin(15)
speaker_pwm = machine.PWM(speaker_pin)

# Enable the PWM
speaker_pwm.duty_u16(32768)  # 50% duty cycle (32768 is half of 65535)

# Frequency range (in Hz)
MIN_FREQ = 100
MAX_FREQ = 2000

try:
    while True:
        # Read the potentiometer value (0-65535)
        pot_value = pot.read_u16()
        
        # Map potentiometer value to frequency range
        frequency = MIN_FREQ + (pot_value / 65535) * (MAX_FREQ - MIN_FREQ)
        
        # Set the PWM frequency
        speaker_pwm.freq(int(frequency))
        
        # Small delay to prevent excessive updates
        time.sleep(0.01)
        
except KeyboardInterrupt:
    # Clean up on exit
    speaker_pwm.deinit()
    print("Program terminated")
```

Note that the try/except is key so that whn you stop the program the PWM signal does not continue to generate sound.

## Code Explanation

1.  We set up an ADC pin to read the potentiometer value.
2.  We configure a PWM output pin connected to your speaker.
3.  We set a 50% duty cycle for the PWM, which creates a square wave.
4.  In the main loop, we:
    -   Read the current value from the potentiometer
    -   Map this value to a frequency range (100Hz to 2000Hz, but you can adjust this)
    -   Update the PWM frequency
    -   Add a small delay to prevent excessive updates

When you turn the potentiometer, it changes the voltage at the ADC pin, which we read and convert to a frequency value for the PWM output.

!!! challenges
    1. Try to change the maximum frequency to be 4000Hz.
    2. What is the highest frequency that you can hear?
    3. Hook a display up to provide a visual model of a sine wave that changes the frequency