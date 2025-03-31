# pot-display.py - Display potentiometer value on TM1650 display
# Reads potentiometer and displays value as 0-100 on 4-digit display

from machine import Pin, I2C, ADC
import config
from utime import sleep

# Configure I2C
sda = Pin(config.I2C_SDA_PIN)
scl = Pin(config.I2C_SCL_PIN)
i2c = I2C(config.I2C_BUS, sda=sda, scl=scl, freq=50000)  # 50 kHz

# Configure ADC for potentiometer
potentiometer = ADC(Pin(config.POTENTIOMETER_PIN))

# TM1650 Display addresses
DISPLAY_ADDR = [0x34, 0x35, 0x36, 0x37]  # Control registers for each digit

# Segment patterns for digits 0-9 and blank
# Note: bit 7 (0x80) controls the colon, making sure it's OFF
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
    ' ': 0x00  # Blank display
}

def init_display():
    """Initialize the display"""
    # First, make sure the display is completely reset
    for addr in [0x24, 0x25, 0x26, 0x27, 0x34, 0x35, 0x36, 0x37]:
        try:
            i2c.writeto(addr, b'\x00')  # Clear display
        except:
            pass  # Ignore if address doesn't exist
    sleep(0.1)
    
    # Enable display with basic control (like in tm1650-test-36.py)
    try:
        i2c.writeto(0x34, b'\x01')  # Turn on with minimal brightness
    except:
        pass
    sleep(0.1)
    
    # Now set each digit's brightness and ensure they're active
    for addr in DISPLAY_ADDR:
        i2c.writeto(addr, b'\x49')  # Turn on with brightness level
    sleep(0.1)

def display_value(value):
    """Display an integer value on the TM1650
    
    Args:
        value: Integer to display (0-100)
    """
    # Ensure value is within range
    value = max(0, min(100, int(value)))
    
    # First digit (leftmost) - always blank for this application
    i2c.writeto(DISPLAY_ADDR[0], bytes([SEGMENT_PATTERNS[' ']]))
    
    # Second digit (now blank if value < 100, otherwise shows "1")
    if value < 100:
        digit_pattern = SEGMENT_PATTERNS[' ']
    else:
        digit_pattern = SEGMENT_PATTERNS[1]  # Must be 1 for 100
    i2c.writeto(DISPLAY_ADDR[1], bytes([digit_pattern]))
    
    # Third digit - blank if value < 10, otherwise tens digit
    if value < 10:
        digit_pattern = SEGMENT_PATTERNS[' ']
    else:
        digit_pattern = SEGMENT_PATTERNS[(value // 10) % 10]
    i2c.writeto(DISPLAY_ADDR[2], bytes([digit_pattern]))
    
    # Fourth digit (rightmost) - always shows ones place
    digit_pattern = SEGMENT_PATTERNS[value % 10]
    i2c.writeto(DISPLAY_ADDR[3], bytes([digit_pattern]))

def read_pot_value():
    """Read potentiometer and convert to 0-100 range"""
    # Read the raw ADC value (0-65535)
    raw_value = potentiometer.read_u16()
    
    # Convert to 0-100 scale and round to nearest integer
    percentage = round((raw_value / 65535) * 100)
    
    return percentage

def main():
    print("Potentiometer Display (0-100)")
    print("Press Ctrl+C to exit")
    
    # Initialize the display
    init_display()
    
    try:
        while True:
            # Read potentiometer value (0-100)
            value = read_pot_value()
            
            # Display on TM1650
            display_value(value)
            
            # Also print to console for debugging
            print(f"Pot value: {value}%")
            
            # Short delay to prevent flicker and reduce CPU usage
            sleep(0.1)
            
    except KeyboardInterrupt:
        print("\nProgram stopped by user")
    finally:
        # Clear display on exit
        for addr in DISPLAY_ADDR:
            i2c.writeto(addr, b'\x00')

# Run the program
if __name__ == "__main__":
    main()