# Peak Frequency

!!! prompt
    Please display the frequency that has the highest value on the upper left.  Don't display the "Hz", just the number.

I'll modify the display to show the frequency with the highest value in the upper left instead of 0Hz, and remove the "Hz" from both labels to keep them clean and simple.

Optimized FFT Implementation for MicroPython

I've updated the display to show the peak frequency in the upper left corner instead of 0Hz, and I've removed the "Hz" label from both numbers as requested.

Here's what the new code does:

1.  **Finds the peak frequency:**
```python
# Find the frequency bin with the highest magnitude
max_idx = 0
max_val = 0
for i in range(lower_freq_focus):
    if i < len(magnitudes) and magnitudes[i] > max_val:
        max_val = magnitudes[i]
        max_idx = i
```

2.  **Calculates the actual frequency in Hz:**
    ```python


    `# Calculate the peak frequency in Hzpeak_freq =int(max_idx * bin_freq_width)`

    ```

3.  **Displays only the numbers without "Hz":**

```python
# Sound Spectrum Analyzer with FFT - Optimized for MicroPython
# Combines INMP441 I2S microphone with SSD1306 OLED display and performs FFT
from machine import I2S, Pin, SPI
import ssd1306
import math
import struct
import time
import array

# OLED Display configuration
SCL = Pin(2)  # SPI Clock
SDA = Pin(3)  # SPI Data
RES = Pin(4)  # Reset
DC = Pin(5)   # Data/Command
CS = Pin(6)   # Chip Select

# Initialize SPI and OLED
spi = SPI(0, sck=SCL, mosi=SDA)
oled = ssd1306.SSD1306_SPI(128, 64, spi, DC, RES, CS)

# I2S Microphone configuration
SCK_PIN = 10  # Serial Clock
WS_PIN = 11   # Word Select
SD_PIN = 12   # Serial Data

# I2S configuration parameters
I2S_ID = 0
SAMPLE_SIZE_IN_BITS = 32
FORMAT = I2S.MONO
SAMPLE_RATE = 16000
BUFFER_LENGTH_IN_BYTES = 40000

# Initialize I2S for microphone
audio_in = I2S(
    I2S_ID,
    sck=Pin(SCK_PIN),
    ws=Pin(WS_PIN),
    sd=Pin(SD_PIN),
    mode=I2S.RX,
    bits=SAMPLE_SIZE_IN_BITS,
    format=FORMAT,
    rate=SAMPLE_RATE,
    ibuf=BUFFER_LENGTH_IN_BYTES,
)

# FFT size (must be a power of 2)
FFT_SIZE = 512

# Precompute the Hanning window coefficients
hanning_window = array.array('f', [0] * FFT_SIZE)
for i in range(FFT_SIZE):
    hanning_window[i] = 0.5 * (1 - math.cos(2 * math.pi * i / (FFT_SIZE - 1)))

# Precompute bit-reversal table - MicroPython compatible version
def bit_reverse(n, bits):
    result = 0
    for i in range(bits):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result

bit_reverse_table = array.array('H', [0] * FFT_SIZE)
bits = int(math.log2(FFT_SIZE))
for i in range(FFT_SIZE):
    bit_reverse_table[i] = bit_reverse(i, bits)

# Precompute twiddle factors (complex exponentials)
twiddle_factors_real = array.array('f', [0] * (FFT_SIZE // 2))
twiddle_factors_imag = array.array('f', [0] * (FFT_SIZE // 2))
for i in range(FFT_SIZE // 2):
    angle = -2 * math.pi * i / FFT_SIZE
    twiddle_factors_real[i] = math.cos(angle)
    twiddle_factors_imag[i] = math.sin(angle)

def capture_audio_samples():
    """Capture audio samples for FFT processing"""
    # For 32-bit samples, we need 4 bytes per sample
    NUM_SAMPLE_BYTES = FFT_SIZE * 4
    
    # Raw samples will be stored in this buffer (signed 32-bit integers)
    samples_raw = bytearray(NUM_SAMPLE_BYTES)
    
    # Read samples from I2S microphone
    num_bytes_read = audio_in.readinto(samples_raw)
    
    if num_bytes_read == 0:
        return None
    
    # Process raw samples
    format_str = "<{}i".format(num_bytes_read // 4)
    samples = struct.unpack(format_str, samples_raw[:num_bytes_read])
    
    # Convert to float array and apply windowing function
    # Reuse the same arrays to avoid memory allocation
    real = array.array('f', [0] * len(samples))
    imag = array.array('f', [0] * len(samples))
    
    for i in range(len(samples)):
        # Shift right by 8 bits for INMP441 and apply window
        real[i] = (samples[i] >> 8) * hanning_window[i]
        imag[i] = 0  # Imaginary part is zero for real input
    
    return (real, imag)

def iterative_fft(real, imag):
    """Compute FFT in-place using an iterative algorithm"""
    n = len(real)
    assert n == len(imag)
    assert n == FFT_SIZE, "FFT size must match precomputed tables"
    
    # Bit-reverse reordering
    for i in range(n):
        j = bit_reverse_table[i]
        if i < j:
            real[i], real[j] = real[j], real[i]
            imag[i], imag[j] = imag[j], imag[i]
    
    # Cooley-Tukey iterative FFT
    for stage in range(1, int(math.log2(n)) + 1):
        m = 2 ** stage  # Distance between butterflies
        m2 = m // 2     # Distance between butterfly pairs
        
        # Process each group of butterflies
        for k in range(0, n, m):
            # Process each butterfly pair
            for j in range(m2):
                # Get twiddle factor
                twiddle_idx = j * (n // m)
                wr = twiddle_factors_real[twiddle_idx]
                wi = twiddle_factors_imag[twiddle_idx]
                
                # Get indices for butterfly operation
                idx1 = k + j
                idx2 = idx1 + m2
                
                # Calculate butterfly
                tr = real[idx2] * wr - imag[idx2] * wi
                ti = real[idx2] * wi + imag[idx2] * wr
                
                # Store results
                real[idx2] = real[idx1] - tr
                imag[idx2] = imag[idx1] - ti
                real[idx1] = real[idx1] + tr
                imag[idx1] = imag[idx1] + ti
    
    return (real, imag)

def calculate_magnitudes(real, imag):
    """Calculate magnitude spectrum from complex FFT result"""
    # Only need the first half due to symmetry for real input
    mags = array.array('f', [0] * (FFT_SIZE // 2))
    
    # Use a fast approximation for magnitude calculation
    # |z| ≈ max(|Re(z)|, |Im(z)|) + 0.4 * min(|Re(z)|, |Im(z)|)
    for i in range(FFT_SIZE // 2):
        re_abs = abs(real[i])
        im_abs = abs(imag[i])
        if re_abs > im_abs:
            mags[i] = re_abs + 0.4 * im_abs
        else:
            mags[i] = im_abs + 0.4 * re_abs
    
    return mags

def draw_spectrum(magnitudes):
    """Draw the frequency spectrum on the OLED display with focus on lower frequencies"""
    # Clear the display
    oled.fill(0)
    
    # Number of frequency bins to display
    num_bins = 64
    
    # Focus on lower frequencies by only taking the first third of the spectrum
    # This will make whistling frequencies more visible across the display
    lower_freq_focus = len(magnitudes) // 3
    
    # Calculate the frequency range being displayed
    # Nyquist frequency is half the sample rate
    nyquist_freq = SAMPLE_RATE / 2
    # Each bin represents nyquist_freq/FFT_SIZE Hz
    bin_freq_width = nyquist_freq / (FFT_SIZE // 2)
    
    # Calculate frequency range start and end
    freq_start = 0  # Hz
    freq_end = int(bin_freq_width * lower_freq_focus)  # Hz
    
    # Combine frequency bins to fit display (use precomputed indexes)
    display_bins = array.array('f', [0] * num_bins)
    bin_width = lower_freq_focus // num_bins
    
    # Simple averaging of bins, focusing on lower frequencies
    for i in range(num_bins):
        start_idx = i * bin_width
        end_idx = min((i + 1) * bin_width, lower_freq_focus)
        if start_idx >= lower_freq_focus:
            break
            
        # Fast averaging
        bin_sum = 0
        for j in range(start_idx, end_idx):
            bin_sum += magnitudes[j]
        display_bins[i] = bin_sum / (end_idx - start_idx) if end_idx > start_idx else 0
    
    # Find maximum value for scaling (avoid division by zero)
    max_magnitude = 1
    for mag in display_bins:
        if mag > max_magnitude:
            max_magnitude = mag
    
    # Reserve top row for frequency labels
    top_margin = 8
    
    # Use display height minus top margin
    display_height = 54  # 64 - top margin - 2
    baseline = 63        # Start from the bottom of the screen
    scaling_factor = 0.5  # Adjust scaling to distribute bars
    
    # Find the frequency bin with the highest magnitude
    max_idx = 0
    max_val = 0
    for i in range(lower_freq_focus):
        if i < len(magnitudes) and magnitudes[i] > max_val:
            max_val = magnitudes[i]
            max_idx = i
    
    # Calculate the peak frequency in Hz
    peak_freq = int(max_idx * bin_freq_width)
    
    # Display peak frequency on the left and max range on the right
    oled.text("{}".format(peak_freq), 0, 0, 1)
    end_text = "{}".format(freq_end)
    # Position end frequency text right-aligned
    end_x = 128 - (len(end_text) * 8)  # Each character is ~8 pixels wide
    oled.text(end_text, end_x, 0, 1)
    
    # Draw the spectrum - each bin takes 2 pixels width
    for i in range(len(display_bins)):
        # Apply sqrt scaling for more balanced distribution
        normalized = display_bins[i] / max_magnitude
        # Use math.sqrt since we can't avoid it in MicroPython
        height = int(math.sqrt(normalized) * display_height * scaling_factor)
        
        # Draw vertical bar
        x = i * 2  # Each bar is 2 pixels wide
        for y in range(baseline, baseline - height, -1):
            if y >= top_margin:  # Ensure we don't write over the frequency text
                oled.pixel(x, y, 1)
                oled.pixel(x + 1, y, 1)  # Make bars 2 pixels wide
    
    # Draw baseline
    oled.hline(0, baseline, 128, 1)
    
    # Update the display
    oled.show()

try:
    print("Optimized Sound Spectrum Analyzer")
    print("Press Ctrl+C to stop")
    
    # Calculate and print frequency range information
    nyquist_freq = SAMPLE_RATE / 2
    bin_freq_width = nyquist_freq / (FFT_SIZE // 2)
    lower_freq_focus = (FFT_SIZE // 2) // 3
    max_freq = int(bin_freq_width * lower_freq_focus)
    
    print("Frequency resolution: {:.2f} Hz per bin".format(bin_freq_width))
    print("Display frequency range: 0 Hz to {} Hz".format(max_freq))
    print("FFT size: {}".format(FFT_SIZE))
    print("Sample rate: {} Hz".format(SAMPLE_RATE))
    
    # Allocate arrays once for reuse
    real_buffer = array.array('f', [0] * FFT_SIZE)
    imag_buffer = array.array('f', [0] * FFT_SIZE)
    
    # Main processing loop
    while True:
        # Capture audio samples
        samples = capture_audio_samples()
        
        if samples:
            # Get real and imaginary arrays
            fft_real, fft_imag = samples
            
            # Compute FFT in-place
            iterative_fft(fft_real, fft_imag)
            
            # Calculate magnitude spectrum
            magnitudes = calculate_magnitudes(fft_real, fft_imag)
            
            # Draw the spectrum
            draw_spectrum(magnitudes)

except KeyboardInterrupt:
    print("Monitoring stopped")
finally:
    # Clean up
    audio_in.deinit()
    print("Program terminated")
```

```
Optimized Sound Spectrum Analyzer
Press Ctrl+C to stop
Frequency resolution: 31.25 Hz per bin
Display frequency range: 0 Hz to 2656 Hz
FFT size: 512
Sample rate: 16000 Hz
```

This enhancement makes the display more informative for your demonstrations. As you whistle, the number on the upper left will update to show the exact frequency of your current pitch, while the number on the right shows the maximum frequency displayed on the screen.

This real-time peak frequency display is particularly useful for tuning instruments or demonstrating precise pitch control during your whistling demonstrations.