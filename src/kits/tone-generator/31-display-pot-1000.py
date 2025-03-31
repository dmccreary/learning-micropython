# TM1650 Potentiometer Display (0-9999)
# Reads potentiometer and maps value to 0-9999 range on 4-digit display

from machine import Pin, I2C, ADC
import config
from utime import sleep

# Configure I2C
sda = Pin(config.I2C_SDA_PIN)
scl = Pin(config.I2C_SCL_PIN)
i2c = I2C(config.I2C_BUS, sda=sda, scl=scl, freq=50000)  # 50 kHz

# Configure ADC for potentiometer
potentiometer = ADC(Pin(config.POTENTIOMETER_PIN))

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
    """Read potentiometer and convert to 0-9999 range"""
    # Read the raw ADC value (0-65535)
    raw_value = potentiometer.read_u16()
    
    # Convert to 0-9999 scale
    value = round((raw_value / 65535) * 9999)
    
    # Ensure within range
    value = max(0, min(9999, int(value)))
    
    return value

def display_pot_value():
    """Display potentiometer values from 0-9999 on 4-digit display"""
    print("Starting potentiometer display (0-9999)...")
    
    # Initial setting of all positions to 'F'
    for addr in DISPLAY_ADDR:
        i2c.writeto(addr, bytes([SEGMENT_PATTERNS['F']]))
    
    # Keep track of last value to reduce unnecessary updates
    last_value = -1
    
    try:
        while True:
            # Read potentiometer value
            value = read_pot_value()
            
            # Skip update if value hasn't changed
            if value == last_value:
                sleep(0.05)
                continue
                
            last_value = value
            
            # Calculate digits for 0-9999
            thousands = (value // 1000) % 10
            hundreds = (value // 100) % 10
            tens = (value // 10) % 10
            ones = value % 10
            
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
            print(f"Pot value: {value}")
            
            # Short delay
            sleep(0.1)
            
    except KeyboardInterrupt:
        print("\nProgram stopped by user")

# Main program 
print("TM1650 Potentiometer Display (0-9999)")
print("Press Ctrl+C to exit")

try:
    # Reset display ONCE at the beginning
    reset_display()
    
    # Initial setting of segment patterns to 'F'
    for addr in DISPLAY_ADDR:
        i2c.writeto(addr, bytes([SEGMENT_PATTERNS['F']]))
    
    # Run the display loop
    display_pot_value()
    
except KeyboardInterrupt:
    print("\nTest interrupted by user")
finally:
    # Reset display on exit
    reset_display()
    print("\nTest completed")