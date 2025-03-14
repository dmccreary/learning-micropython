from machine import ADC
from utime import sleep
import array

# GPIO 26 is ADC0 on row 10 right
sensor = ADC(26)

# Configuration parameters
SAMPLE_RATE = 1000  # Hz (1ms between samples)
BUFFER_SIZE = 100   # Number of samples to collect before averaging
PLOT_WINDOW = 65535 # Y-axis range in plotter
SMOOTHING_FACTOR = 0.2 # For exponential smoothing (0 to 1)

# Global variables
min_val = 32000
max_val = 0
last_smoothed = 0

def normalize_signal(val, min_v, max_v):
    """Normalize signal to use full plot window"""
    range_v = max_v - min_v
    if range_v == 0:
        return 0
    return int(((val - min_v) / range_v) * PLOT_WINDOW)

def main():
    global min_val, max_val, last_smoothed
    
    # For calculating moving average
    buffer = array.array('H', [0] * BUFFER_SIZE)
    buffer_index = 0
    
    # Auto-calibration phase
    print("Calibrating (make some noise)...")
    for i in range(500):  # Collect samples for half a second
        val = sensor.read_u16()
        if val < min_val:
            min_val = val
        if val > max_val:
            max_val = val
        sleep(0.001)
    
    print(f"Calibration complete: min={min_val}, max={max_val}")
    print("Starting data collection...")
    
    # Different visualization options - uncomment the one you want to use
    while True:
        # Read sensor
        val = sensor.read_u16()
        
        # Update min and max values (with slower adaptation)
        if val < min_val:
            min_val = val
        elif val > max_val:
            max_val = val
        
        # Option 1: Raw value (centered around zero)
        # print(val - ((max_val + min_val) // 2))
        
        # Option 2: Normalized to plot window
        normalized = normalize_signal(val, min_val, max_val)
        
        # Option 3: Moving average for smoothing
        #buffer[buffer_index] = val
        #buffer_index = (buffer_index + 1) % BUFFER_SIZE
        #avg_val = sum(buffer) // BUFFER_SIZE
        # print(normalize_signal(avg_val, min_val, max_val))
        
        # Option 4: Exponential smoothing
        smoothed = SMOOTHING_FACTOR * val + (1 - SMOOTHING_FACTOR) * last_smoothed
        # last_smoothed = smoothed
        # print(normalize_signal(int(smoothed), min_val, max_val))
        
        # Option 5: Multi-channel plotting (raw and smoothed)
        print(f"{normalized},{normalize_signal(int(smoothed), min_val, max_val)}")
        
        # Keep consistent timing
        sleep(1/SAMPLE_RATE)

# This allows us to stop the sound by doing a Stop or Control-C which is a keyboard interrupt
try:
    main()
except KeyboardInterrupt:
    print('Got ctrl-c')
    print(f'min_val: {min_val}, max_val: {max_val}, range: {max_val - min_val}')
finally:
    print('done')