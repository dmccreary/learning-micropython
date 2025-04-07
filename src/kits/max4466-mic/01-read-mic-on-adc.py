import machine
import utime

# Configure the ADC pin for the MAX4466 microphone
MAX4466_PIN = 26
adc = machine.ADC(MAX4466_PIN)

# No need to set width - Pico ADC is fixed at 12-bit resolution (0-4095)

print("Starting microphone monitoring on ADC pin", MAX4466_PIN)
print("Press Ctrl+C to stop")

try:
    while True:
        # Read analog value from microphone
        mic_value = adc.read_u16()
        
        # Print the value to console
        print(mic_value)
        
        # Small delay to avoid flooding the console
        utime.sleep_ms(100)
        
except KeyboardInterrupt:
    print("Monitoring stopped")