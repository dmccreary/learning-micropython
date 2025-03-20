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
SAMPLE_RATE = 8000
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
FFT_SIZE = 256  # Changed from 512 to 256

# Precompute the Hanning window coefficients - make sure to use the new FFT_SIZE
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

# Use the correct number of bits for FFT_SIZE=256 (8 bits instead of 9 for 512)
bits = int(math.log2(FFT_SIZE))
bit_reverse_table = array.array('H', [0] * FFT_SIZE)
for i in range(FFT_SIZE):
    bit_reverse_table[i] = bit_reverse(i, bits)

# Precompute twiddle factors (complex exponentials) - use the new FFT_SIZE
twiddle_factors_real = array.array('f', [0] * (FFT_SIZE // 2))
twiddle_factors_imag = array.array('f', [0] * (FFT_SIZE // 2))
for i in range(FFT_SIZE // 2):
    angle = -2 * math.pi * i / FFT_SIZE
    twiddle_factors_real[i] = math.cos(angle)
    twiddle_factors_imag[i] = math.sin(angle)

# Precompute display buffer for faster drawing
DISPLAY_WIDTH = 128
DISPLAY_HEIGHT = 64
NUM_BINS = 64  # Number of frequency bins to display
display_buffer = bytearray(DISPLAY_WIDTH * DISPLAY_HEIGHT // 8)

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
    """Compute FFT in-place using an optimized iterative algorithm"""
    n = len(real)
    assert n == len(imag)
    assert n == FFT_SIZE, "FFT size must match precomputed tables"
    
    # Bit-reverse reordering - optimized loop
    for i in range(1, n):  # Start from 1 since 0 is already in place
        j = bit_reverse_table[i]
        if i < j:
            real[i], real[j] = real[j], real[i]
            imag[i], imag[j] = imag[j], imag[i]
    
    # Cooley-Tukey iterative FFT - optimized version
    for stage in range(1, int(math.log2(n)) + 1):
        m = 2 ** stage
        m2 = m // 2
        
        # Process each group of butterflies
        for k in range(0, n, m):
            # Process each butterfly pair
            for j in range(m2):
                # Get twiddle factor - precomputed
                twiddle_idx = j * (n // m)
                wr = twiddle_factors_real[twiddle_idx]
                wi = twiddle_factors_imag[twiddle_idx]
                
                # Get indices for butterfly operation
                idx1 = k + j
                idx2 = idx1 + m2
                
                # Optimized butterfly calculation
                tr = real[idx2] * wr - imag[idx2] * wi
                ti = real[idx2] * wi + imag[idx2] * wr
                
                # Store results
                real[idx2] = real[idx1] - tr
                imag[idx2] = imag[idx1] - ti
                real[idx1] = real[idx1] + tr
                imag[idx1] = imag[idx1] + ti
    
    return (real, imag)

def calculate_magnitudes(real, imag):
    """Calculate magnitude spectrum from complex FFT result - optimized version"""
    # Only need the first half due to symmetry for real input
    mags = array.array('f', [0] * (FFT_SIZE // 2))
    
    # Fast magnitude approximation
    for i in range(FFT_SIZE // 2):
        re_abs = abs(real[i])
        im_abs = abs(imag[i])
        mags[i] = re_abs + 0.4 * im_abs if re_abs > im_abs else im_abs + 0.4 * re_abs
    
    return mags

def draw_spectrum(magnitudes):
    """Draw the frequency spectrum on the OLED display - optimized version"""
    # Clear the display
    oled.fill(0)
    
    # Calculate frequency range
    nyquist_freq = SAMPLE_RATE / 2
    bin_freq_width = nyquist_freq / (FFT_SIZE // 2)
    
    # Combine frequency bins to fit display
    display_bins = array.array('f', [0] * NUM_BINS)
    bin_width = (FFT_SIZE // 2) // NUM_BINS
    
    # Fast bin averaging
    for i in range(NUM_BINS):
        start_idx = i * bin_width
        end_idx = min((i + 1) * bin_width, FFT_SIZE // 2)
        bin_sum = 0
        for j in range(start_idx, end_idx):
            bin_sum += magnitudes[j]
        display_bins[i] = bin_sum / (end_idx - start_idx)
    
    # Find maximum value for scaling
    max_magnitude = 1
    for mag in display_bins:
        if mag > max_magnitude:
            max_magnitude = mag
    
    # Reserve top row for frequency labels
    top_margin = 8
    display_height = 54
    baseline = 63
    
    # Find peak frequency
    max_idx = 0
    max_val = 0
    for i in range(FFT_SIZE // 2):
        if magnitudes[i] > max_val:
            max_val = magnitudes[i]
            max_idx = i
    
    # Calculate peak frequency
    peak_freq = int(max_idx * bin_freq_width)
    
    # Draw frequency labels
    oled.text("{}".format(peak_freq), 0, 0, 1)
    end_text = "{}".format(int(nyquist_freq))
    end_x = 128 - (len(end_text) * 8)
    oled.text(end_text, end_x, 0, 1)
    
    # Draw spectrum bars - optimized drawing
    for i in range(NUM_BINS):
        normalized = display_bins[i] / max_magnitude
        height = int(math.sqrt(normalized) * display_height)
        
        # Draw vertical bar
        x = i * 2
        for y in range(baseline, baseline - height, -1):
            if y >= top_margin:
                oled.pixel(x, y, 1)
                oled.pixel(x + 1, y, 1)
    
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