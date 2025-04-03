# Tone Generator

<iframe width="560" height="315" src="https://www.youtube.com/embed/UjPiuIwZOPM?si=9B76kU9xEW-aH6qW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Components

- Raspberry Pi Pico ($4.00)
- Breadboard ($1.75)
- Potentiometer (20K ohm) ($0.50)
- Piezoelectric Speaker (0.50)
- 4-digit 7-segment Display ($2.00)

The total cost for the parts is under $10.0

## Lab 1: Hardware Configuration

[Lab 1 Config File](./lab-1.md)

## Lab 2: Testing the Potentiometer

[Lab 2: Pot](./lab-2-pot.md)

## Lab 3: Testing the Speaker

## Lab 4: Testing the Display

## Sample Code

There is a full source code here:

[https://github.com/dmccreary/learning-micropython/tree/main/src/kits/tone-generator](https://github.com/dmccreary/learning-micropython/tree/main/src/kits/tone-generator)

Here is the main loop of the program:

```python
while True:
    # Read potentiometer value and convert to frequency
    frequency = read_pot_value()

    # Skip update if frequency hasn't changed significantly
    # Using a small threshold to reduce display flicker
    if abs(frequency - last_frequency) < 5:
        sleep(0.05)
        continue
        
    last_frequency = frequency

    # Update the speaker
    update_speaker(frequency)

    # update the display
    update_display(frequency)

    # Print to console for debugging
    print(f"Frequency: {frequency} Hz")

    # Short delay
    sleep(0.1)
```

```python
# TM1650 Potentiometer Display and Speaker Control
# Reads potentiometer and maps value to 0-2000 Hz for speaker
# and displays frequency on 4-digit display

from machine import Pin, I2C, ADC, PWM
import config
from utime import sleep

# Configure I2C
sda = Pin(config.I2C_SDA_PIN)
scl = Pin(config.I2C_SCL_PIN)
i2c = I2C(config.I2C_BUS, sda=sda, scl=scl, freq=50000)  # 50 kHz

# Configure ADC for potentiometer
potentiometer = ADC(Pin(config.POTENTIOMETER_PIN))

# Configure PWM for speaker
speaker = PWM(Pin(config.SPEAKER_PIN))
speaker.duty_u16(0)  # Start with no sound

# Use EXACTLY the same address definitions as tm1650-test-36.py
DISPLAY_ADDR = [0x24, 0x25, 0x26, 0x27]  # Display registers
CONTROL_ADDR = 0x34  # Main control register
POSITION2_CONTROL_ADDR = [0x35, 0x36, 0x37]  # Additional control addresses

# Segment patterns 
SEGMENT_PATTERNS = {
    0: 0x3F,
    1: 0x06,
    2: 0x5B,
    3: 0x4F,
    4: 0x66,
    5: 0x6D,
    6: 0x7D,
    7: 0x07,
    8: 0x7F,
    9: 0x6F,
    'F': 0x71  # Used for initial pattern
}

def reset_display():
    """Reset the display - exactly as in test-36.py"""
    for addr in [0x34, 0x35, 0x36, 0x37]:
        i2c.writeto(addr, b'\x00')
    sleep(0.1)

def read_pot_value():
    """Read potentiometer and convert to 0-2000 range for frequency"""
    # Read the raw ADC value (0-65535)
    raw_value = potentiometer.read_u16()
    
    # Convert to 0-2000 Hz scale
    frequency = round((raw_value / 65535) * 2000)
    
    # Ensure within range
    frequency = max(0, min(2000, int(frequency)))
    
    return frequency

def update_speaker(frequency):
    """Update the speaker frequency"""
    if frequency < 10:  # Handle very low frequencies - RP2040 has minimum frequency limit
        # If frequency is too low, turn off sound
        speaker.duty_u16(0)
    else:
        # Set the frequency
        speaker.freq(frequency)
        # Use 10% duty cycle for cleaner sound (not too loud)
        speaker.duty_u16(6553)  # 10% of 65535

def display_and_play():
    """Display frequency and play tone based on potentiometer value"""
    print("Starting potentiometer frequency control (0-2000 Hz)...")
    
    # Initial setting of all positions to 'F'
    for addr in DISPLAY_ADDR:
        i2c.writeto(addr, bytes([SEGMENT_PATTERNS['F']]))
    
    # Keep track of last frequency to reduce unnecessary updates
    last_frequency = -1
    
    try:
        while True:
            # Read potentiometer value and convert to frequency
            frequency = read_pot_value()
            
            # Skip update if frequency hasn't changed significantly
            # Using a small threshold to reduce display flicker
            if abs(frequency - last_frequency) < 5:
                sleep(0.05)
                continue
                
            last_frequency = frequency
            
            # Update the speaker
            update_speaker(frequency)
            
            # Calculate digits for 0-2000
            thousands = (frequency // 1000) % 10
            hundreds = (frequency // 100) % 10
            tens = (frequency // 10) % 10
            ones = frequency % 10
            
            # Set control values for full 4-digit display
            # Positions: 0      1        2      3
            #           [1000s] [100s]  [10s]  [1s]
            
            # Set the pattern for each digit
            # For values < 1000, we'll show leading zeros
            i2c.writeto(CONTROL_ADDR, bytes([SEGMENT_PATTERNS[thousands]]))
            i2c.writeto(0x35, bytes([SEGMENT_PATTERNS[hundreds]]))
            i2c.writeto(0x36, bytes([SEGMENT_PATTERNS[tens]]))
            i2c.writeto(0x37, bytes([SEGMENT_PATTERNS[ones]]))
            
            # Print to console for debugging
            print(f"Frequency: {frequency} Hz")
            
            # Short delay
            sleep(0.1)
            
    except KeyboardInterrupt:
        print("\nProgram stopped by user")
        # Turn off speaker when stopping
        speaker.duty_u16(0)

# Main program 
print("TM1650 Potentiometer Frequency Control (0-2000 Hz)")
print("Press Ctrl+C to exit")

try:
    # Reset display ONCE at the beginning
    reset_display()
    
    # Initial setting of segment patterns to 'F'
    for addr in DISPLAY_ADDR:
        i2c.writeto(addr, bytes([SEGMENT_PATTERNS['F']]))
    
    # Run the display and speaker control loop
    display_and_play()
    
except KeyboardInterrupt:
    print("\nTest interrupted by user")
finally:
    # Reset display on exit
    reset_display()
    # Make sure speaker is off
    speaker.duty_u16(0)
    speaker.deinit()
    print("\nTest completed")
```