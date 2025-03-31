from machine import Pin, ADC
import config
from utime import sleep

# Get the potentiometer pin from config
POTENTIOMETER_PIN = config.POTENTIOMETER_PIN

# Create an ADC object for the potentiometer
potentiometer = ADC(Pin(POTENTIOMETER_PIN))

# MicroPython ADC has 16-bit resolution (0-65535)
max_value = 65535

print("Potentiometer Value Reader")
print("Press Ctrl+C to exit")
print("-----------------------")

try:
    while True:
        # Read the raw ADC value
        raw_value = potentiometer.read_u16()
        
        # Calculate percentage (0-100%)
        percentage = round((raw_value / max_value) * 100)
        
        # Calculate voltage (assuming 3.3V reference)
        voltage = (raw_value / max_value) * 3.3
        
        # Print the values
        print(f"Raw ADC: {raw_value}, Percentage: {percentage}%, Voltage: {voltage:.2f}V")
        
        # Sleep to avoid flooding the console
        sleep(0.1)
        
except KeyboardInterrupt:
    print("\nProgram stopped by user")