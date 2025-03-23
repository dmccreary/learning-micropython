import machine
import time

# Configure the potentiometer on ADC pin
# Choose a suitable ADC pin - let's use pin 26
pot = machine.ADC(26)

# Configure the PWM output for the speaker
# Choose a suitable pin - let's use pin 15 on the lower left corner
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