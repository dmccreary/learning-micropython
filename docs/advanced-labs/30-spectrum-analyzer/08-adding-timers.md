# Adding Timers

!!! prompt
    I want to know how much time iit takes to capture_audio_samples(), run the fft and then draw_spectrum().  Please put in code so that it will display the average times for these components in the console using print().  Pick a counter of about 100 to average the times in various sections of the code.

## Cursor Response

I'll help you add timing measurements to analyze the performance of different components of your sound spectrum analyzer. I'll modify the code to measure and display average times for capturing audio samples, running the FFT, and drawing the spectrum.

I've modified the code to add timing measurements for each major component of the processing pipeline. Here's what I've added:

Let me edit the file to add timing measurements:

I've modified the code to add timing measurements for each major component of the processing pipeline. Here's what I've added

Three arrays to store timing measurements for 100 iterations:

```python
  # Initialize timing counters
    capture_times = array.array('f', [0] * 100)
    fft_times = array.array('f', [0] * 100)
    draw_times = array.array('f', [0] * 100)
    counter = 0
```

capture_times for audio capture

```python
capture_start = time.ticks_us()
samples = capture_audio_samples()
capture_end = time.ticks_us()
```

fft_times for FFT processing:

```pytyon
# Compute FFT in-place with timing
fft_start = time.ticks_us()
iterative_fft(fft_real, fft_imag)
fft_end = time.ticks_us()
```

draw_times for spectrum drawing

```python
# Draw the spectrum with timing
draw_start = time.ticks_us()
draw_spectrum(magnitudes)
draw_end = time.ticks_us()
```

Timing measurements using time.ticks_us() for microsecond precision:

Display all metrics in the console

```python
counter += 1
if counter >= 100:
    # Calculate averages
    avg_capture = sum(capture_times) / 100
    avg_fft = sum(fft_times) / 100
    avg_draw = sum(draw_times) / 100
    total_time = avg_capture + avg_fft + avg_draw
    
    print("\nPerformance Metrics (averaged over 100 iterations):")
    print(f"Capture time: {avg_capture:.2f} ms")
    print(f"FFT time: {avg_fft:.2f} ms")
    print(f"Draw time: {avg_draw:.2f} ms")
    print(f"Total processing time: {total_time:.2f} ms")
    print(f"Frames per second: {1000/total_time:.1f}")
    
    # Reset counter
    counter = 0
```
## Sample Results

```
Performance Metrics (averaged over 100 iterations):
Capture time: 6.97 ms
FFT time: 101.65 ms
Draw time: 33.58 ms
Total processing time: 142.20 ms
Frames per second: 7.0
```

Based on the timing results shown, I can analyze the performance of each component of your sound spectrum analyzer:
Audio Capture: 6.97 ms

Based on the timing results shown, I can analyze the performance of each component of your sound spectrum analyzer:

### 1.  Audio Capture: 6.97 ms

-   This is quite efficient, taking only about 7ms to capture the audio samples
-   This is good as it's a relatively small portion of the total processing time

### 1.  FFT Processing: 101.65 ms

-   This is the most time-consuming operation, taking about 102ms
-   This is expected as FFT is computationally intensive
-   It accounts for about 71% of the total processing time

### 1.  Drawing Spectrum: 33.58 ms

-   This is the second most time\-consuming operation
-   Takes about 34ms to draw the spectrum on the OLED display
-   Accounts for about 24% of the total processing time

1.  Total Processing: 142.20 ms

-   The entire processing pipeline takes about 142ms per frame
-   This results in approximately 7.0 frames per second (1000ms/142.20ms ≈ 7.0)

## Analysis and Potential Optimizations:

1.  The FFT is the main bottleneck. You could potentially optimize this by:

-   Further reducing the FFT size (though this would reduce frequency resolution)
-   Using a more optimized FFT implementation
-   Pre-computing more values if memory allows

1.  The drawing operation is also significant. You could potentially optimize by:

-   Reducing the number of pixels being drawn
-   Using a simpler visualization method
-   Only updating parts of the display that change

1.  The capture time is good and probably doesn't need optimization.

Would you like me to suggest specific code optimizations for any of these components?

## Full Code

```python
import time
import array
import math
import struct
from machine import I2S, Pin, SPI
import ssd1306

# ... existing code ...

try:
    print("Optimized Sound Spectrum Analyzer")
    print("Press Ctrl+C to stop")
    
    # Calculate and print frequency range information
    nyquist_freq = SAMPLE_RATE / 2
    bin_freq_width = nyquist_freq / (FFT_SIZE // 2)
    max_freq = int(bin_freq_width * (FFT_SIZE // 2))
    
    print("Frequency resolution: {:.2f} Hz per bin".format(bin_freq_width))
    print("Display frequency range: 0 Hz to {} Hz".format(max_freq))
    print("FFT size: {}".format(FFT_SIZE))
    print("Sample rate: {} Hz".format(SAMPLE_RATE))
    
    # Initialize timing counters
    capture_times = array.array('f', [0] * 100)
    fft_times = array.array('f', [0] * 100)
    draw_times = array.array('f', [0] * 100)
    counter = 0
    
    # Allocate arrays once for reuse
    real_buffer = array.array('f', [0] * FFT_SIZE)
    imag_buffer = array.array('f', [0] * FFT_SIZE)
    
    # Main processing loop
    while True:
        # Capture audio samples with timing
        capture_start = time.ticks_us()
        samples = capture_audio_samples()
        capture_end = time.ticks_us()
        
        if samples:
            # Get real and imaginary arrays
            fft_real, fft_imag = samples
            
            # Compute FFT in-place with timing
            fft_start = time.ticks_us()
            iterative_fft(fft_real, fft_imag)
            fft_end = time.ticks_us()
            
            # Calculate magnitude spectrum
            magnitudes = calculate_magnitudes(fft_real, fft_imag)
            
            # Draw the spectrum with timing
            draw_start = time.ticks_us()
            draw_spectrum(magnitudes)
            draw_end = time.ticks_us()
            
            # Record times
            capture_times[counter] = time.ticks_diff(capture_end, capture_start) / 1000  # Convert to ms
            fft_times[counter] = time.ticks_diff(fft_end, fft_start) / 1000  # Convert to ms
            draw_times[counter] = time.ticks_diff(draw_end, draw_start) / 1000  # Convert to ms
            
            # Calculate and display averages every 100 iterations
            counter += 1
            if counter >= 100:
                # Calculate averages
                avg_capture = sum(capture_times) / 100
                avg_fft = sum(fft_times) / 100
                avg_draw = sum(draw_times) / 100
                total_time = avg_capture + avg_fft + avg_draw
                
                print("\nPerformance Metrics (averaged over 100 iterations):")
                print(f"Capture time: {avg_capture:.2f} ms")
                print(f"FFT time: {avg_fft:.2f} ms")
                print(f"Draw time: {avg_draw:.2f} ms")
                print(f"Total processing time: {total_time:.2f} ms")
                print(f"Frames per second: {1000/total_time:.1f}")
                
                # Reset counter
                counter = 0

except KeyboardInterrupt:
    print("Monitoring stopped")
finally:
    # Clean up
    audio_in.deinit()
    print("Program terminated")
```