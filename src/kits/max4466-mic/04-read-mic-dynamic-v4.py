import machine
import utime

# Configure the ADC pin for the MAX4466 microphone
MAX4466_PIN = 26
adc = machine.ADC(MAX4466_PIN)

print("Starting microphone monitoring - press Ctrl+C to stop")

# Create a list to store the last samples
sample_history = []
max_samples = 100  # Use a manageable history size
calibration_samples = 50  # Collect this many samples before starting to print
sample_count = 0

# Initialize values
global_min = 65535
global_max = 0

try:
    # Initial calibration phase - collect samples without printing
    print("Calibrating... please wait")
    for i in range(calibration_samples):
        value = adc.read_u16()
        sample_history.append(value)
        # Update global stats
        if value < global_min:
            global_min = value
        if value > global_max:
            global_max = value
        utime.sleep_ms(20)
    
    print("Calibration complete - starting output")
    
    while True:
        # Read analog value from microphone
        current_value = adc.read_u16()
        
        # Update global min and max
        if current_value < global_min:
            global_min = current_value
        if current_value > global_max:
            global_max = current_value
        
        # Add to history, keeping only the most recent samples
        sample_history.append(current_value)
        if len(sample_history) > max_samples:
            sample_history.pop(0)  # Remove oldest sample
        
        # Calculate dynamic range based on history
        window_min = min(sample_history)
        window_max = max(sample_history)
        
        # Avoid division by zero
        if window_max > window_min:
            # Normalize to 0-1000 range for better visualization
            normalized_value = int(1000 * (current_value - window_min) / (window_max - window_min))
            
            # Limit the range to prevent occasional extreme values
            normalized_value = max(0, min(1000, normalized_value))
        else:
            normalized_value = 0
            
        # Print the normalized value for Thonny Plotter
        print(normalized_value)
        
        # Small delay
        # utime.sleep_ms(50)
        utime.sleep_ms(10)
        
except KeyboardInterrupt:
    print("Monitoring stopped")
    print(f"Global min value: {global_min}")
    print(f"Global max value: {global_max}")
    print(f"Global range: {global_max - global_min}")
    if sample_history:
        print(f"Final window min: {min(sample_history)}")
        print(f"Final window max: {max(sample_history)}")