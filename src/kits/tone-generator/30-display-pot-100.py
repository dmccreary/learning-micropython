# A minimal modification of the working TM1650 potentiometer display
# With right justification and minimal changes from the working version

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

# Segment patterns exactly as in test-36.py
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
    'F': 0x71
}

def reset_display():
    """Reset the display - exactly as in test-36.py"""
    for addr in [0x34, 0x35, 0x36, 0x37]:
        i2c.writeto(addr, b'\x00')
    sleep(0.1)

def read_pot_value():
    """Read potentiometer and convert to 0-100 range"""
    raw_value = potentiometer.read_u16()
    percentage = round((raw_value / 65535) * 100)
    return percentage

# Modified from the version that works
def pot_display_loop():
    """Display potentiometer value based on the working test logic"""
    print("Starting potentiometer display...")
    
    try:
        # Keep track of the last value to reduce flashing
        last_value = -1
        
        while True:
            # Read potentiometer value (0-100)
            value = read_pot_value()
            
            # Skip update if value hasn't changed
            if value == last_value:
                sleep(0.1)
                continue
                
            last_value = value
            

            
            # Set patterns on all positions - EXACTLY as in test_second_digit()
            for addr in DISPLAY_ADDR:
                i2c.writeto(addr, bytes([SEGMENT_PATTERNS['F']]))
            
            # Determine control values for RIGHT justified display
            # Positions:  0    1    2    3
            #           [d1] [d2] [d3] [d4]
            
            if value >= 100:
                # Display "100F" - use positions 0,1,2
                i2c.writeto(CONTROL_ADDR, bytes([SEGMENT_PATTERNS[1]]))
                i2c.writeto(0x35, bytes([SEGMENT_PATTERNS[0]]))
                i2c.writeto(0x36, bytes([SEGMENT_PATTERNS[0]]))
                # Position 3 stays as 'F'
            elif value >= 10:
                # Display "F42F" - use positions 1,2
                # Position 0 stays as 'F'
                i2c.writeto(0x35, bytes([SEGMENT_PATTERNS[value // 10]]))
                i2c.writeto(0x36, bytes([SEGMENT_PATTERNS[value % 10]]))
                # Position 3 stays as 'F'
            else:
                # Display "FF5F" - use position 2 only
                # Positions 0,1 stay as 'F'
                i2c.writeto(0x36, bytes([SEGMENT_PATTERNS[value]]))
                # Position 3 stays as 'F'
            
            # Print to console for debugging
            print(f"Pot value: {value}%")
            
            # Short delay to prevent flicker and reduce CPU usage
            sleep(0.1)
            
    except KeyboardInterrupt:
        print("\nProgram stopped by user")
    finally:
        # Reset display on exit
        reset_display()

# Main program - copied structure from test-36.py
print("TM1650 Potentiometer Display")
print("Press Ctrl+C to exit")

try:
    # First, reset the display
    reset_display()
    pot_display_loop()
except KeyboardInterrupt:
    print("\nTest interrupted by user")
finally:
    # Reset display
    reset_display()
    print("\nTest completed")