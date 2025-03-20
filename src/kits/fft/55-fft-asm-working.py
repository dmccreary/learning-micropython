# Sound Spectrum Analyzer with direct use of assembler FFT
# Combines INMP441 I2S microphone with SSD1306 OLED display
from machine import I2S, Pin, SPI
import ssd1306
import math
import struct
import time
import array

print("Importing FFT modules...")
try:
    # Try to import the direct assembler FFT function
    import dft
    print("FFT module imported successfully")
except ImportError as e:
    print(f"Could not import FFT module: {e}")

# OLED Display configuration
SCL = Pin(2)  # SPI Clock
SDA = Pin(3)  # SPI Data
RES = Pin(4)  # Reset
DC = Pin(5)   # Data/Command
CS = Pin(6)   # Chip Select

# Initialize SPI and OLED
print("Initializing OLED display...")
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
print("Initializing I2S microphone...")
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
FFT_SIZE = 256

# Create a Hanning window function
def hanning(x, length):
    return 0.5 - 0.5 * math.cos(2 * math.pi * x / (length - 1))

# Check if we have the direct FFT assembler function
have_asm_fft = hasattr(dft, 'fft')

# Create the control structure for the FFT assembler function
if have_asm_fft:
    print("Setting up direct assembler FFT...")
    try:
        # Create arrays for real and imaginary data
        fft_re = array.array('f', [0] * FFT_SIZE)
        fft_im = array.array('f', [0] * FFT_SIZE)
        
        # Calculate bits for FFT size
        bits = int(math.log2(FFT_SIZE))
        
        # Create control array
        # ctrl[0] = length of data array
        # ctrl[1] = no. of bits to represent the length
        # ctrl[2] = Address of real data array
        # ctrl[3] = Address of imaginary data array
        # ctrl[4] = Byte Offset into entry 0 of complex roots of unity
        # ctrl[5] = Address of scratchpad for use by fft code
        from uctypes import addressof
        ctrl = array.array('i', [0] * 6)
        ctrl[0] = FFT_SIZE
        ctrl[1] = bits
        ctrl[2] = addressof(fft_re)
        ctrl[3] = addressof(fft_im)
        
        # Create complex scratchpad and roots of unity
        COMPLEX_NOS = 7
        ROOTSOFFSET = COMPLEX_NOS * 2
        cmplx = array.array('f', [0.0] * ((bits + 1 + COMPLEX_NOS) * 2))
        ctrl[4] = COMPLEX_NOS * 8  # Byte offset
        ctrl[5] = addressof(cmplx)
        
        # Initialize u value
        cmplx[0] = 1.0
        cmplx[1] = 0.0
        
        # Add scaling factor
        cmplx[12] = 1.0 / FFT_SIZE
        cmplx[13] = 0.0
        
        # Calculate roots of unity
        i = ROOTSOFFSET
        creal = -1
        cimag = 0
        cmplx[i] = creal
        cmplx[i + 1] = cimag
        i += 2
        
        for x in range(bits):
            cimag = math.sqrt((1.0 - creal) / 2.0)
            creal = math.sqrt((1.0 + creal) / 2.0)
            cmplx[i] = creal
            cmplx[i + 1] = cimag
            i += 2
        
        print("Direct assembler FFT setup successful")
        using_asm_fft = True
    except Exception as e:
        print(f"Error setting up direct assembler FFT: {e}")
        have_asm_fft = False
        using_asm_fft = False
else:
    using_asm_fft = False

# If assembler FFT isn't available, create arrays for Python implementation
if not using_asm_fft:
    print("Using Python FFT implementation")
    fft_re = array.array('f', [0] * FFT_SIZE)
    fft_im = array.array('f', [0] * FFT_SIZE)

# Define FFT constants
FORWARD = 1  # Forward transform
REVERSE = 0  # Inverse transform

# Define a faster FFT implementation for fallback
def cooley_tukey_fft(real, imag, inverse=False):
    """Optimized FFT implementation as fallback"""
    n = len(real)
    if n <= 1:
        return
    
    # Bit-reverse permutation
    j = 0
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        
        if i < j:
            real[i], real[j] = real[j], real[i]
            imag[i], imag[j] = imag[j], imag[i]
    
    # Cooley-Tukey FFT implementation
    step = 2
    while step <= n:
        half_step = step // 2
        angle_step = (-2 if inverse else 2) * math.pi / step
        
        # Process each group of butterflies
        for m in range(0, n, step):
            # Process each butterfly pair
            for k in range(half_step):
                # Calculate twiddle factor
                angle = k * angle_step
                cos_val = math.cos(angle)
                sin_val = math.sin(angle)
                
                # Get indices for butterfly operation
                idx1 = m + k
                idx2 = idx1 + half_step
                
                # Get butterfly values
                a_re = real[idx1]
                a_im = imag[idx1]
                b_re = real[idx2]
                b_im = imag[idx2]
                
                # Calculate butterfly
                t_re = b_re * cos_val - b_im * sin_val
                t_im = b_re * sin_val + b_im * cos_val
                
                # Store results
                real[idx2] = a_re - t_re
                imag[idx2] = a_im - t_im
                real[idx1] = a_re + t_re
                imag[idx1] = a_im + t_im
        
        step *= 2
    
    # Scale if inverse
    if inverse:
        for i in range(n):
            real[i] /= n
            imag[i] /= n

# Convert to polar coordinates
def to_polar(real, imag):
    """Convert complex values to polar (magnitude, phase)"""
    n = len(real)
    for i in range(n):
        magnitude = math.sqrt(real[i]*real[i] + imag[i]*imag[i])
        phase = math.atan2(imag[i], real[i])
        real[i] = magnitude
        imag[i] = phase

# Raw audio buffer for incoming samples
raw_samples = bytearray(FFT_SIZE * 4)  # 32-bit samples = 4 bytes each

def capture_audio_samples():
    """Capture audio samples and populate the FFT input arrays"""
    try:
        # Read samples from I2S microphone
        num_bytes_read = audio_in.readinto(raw_samples)
        
        if num_bytes_read == 0:
            return False
        
        # Process raw samples
        samples_count = num_bytes_read // 4
        format_str = "<{}i".format(samples_count)
        samples = struct.unpack(format_str, raw_samples[:num_bytes_read])
        
        # Clear arrays
        for i in range(FFT_SIZE):
            fft_im[i] = 0.0
        
        # Populate the real array, apply windowing
        sample_count = min(len(samples), FFT_SIZE)
        for i in range(sample_count):
            # Need to shift right by 8 bits for INMP441 (24-bit samples in 32-bit words)
            # Apply Hanning window
            fft_re[i] = (samples[i] >> 8) * hanning(i, FFT_SIZE)
        
        # Zero-pad if we didn't fill the array
        for i in range(sample_count, FFT_SIZE):
            fft_re[i] = 0.0
        
        return True
    except Exception as e:
        print(f"Error in capture_audio_samples: {e}")
        return False

def process_fft():
    """Process the FFT with appropriate implementation"""
    try:
        start_time = time.ticks_ms()
        
        if using_asm_fft:
            # Run the FFT with the assembler function
            dft.fft(ctrl, FORWARD)
            
            # Convert to polar manually
            to_polar(fft_re, fft_im)
        else:
            # Use the Python FFT implementation
            cooley_tukey_fft(fft_re, fft_im)
            to_polar(fft_re, fft_im)
        
        end_time = time.ticks_ms()
        elapsed = time.ticks_diff(end_time, start_time)
        # print(f"FFT processing time: {elapsed} ms")
        
        return True
    except Exception as e:
        print(f"Error in process_fft: {e}")
        return False

def draw_spectrum():
    """Draw the frequency spectrum on the OLED display"""
    try:
        # Clear the display
        oled.fill(0)
        
        # Number of frequency bins to display
        num_bins = 64
        
        # Calculate the frequency range being displayed
        nyquist_freq = SAMPLE_RATE / 2
        bin_freq_width = nyquist_freq / (FFT_SIZE // 2)
        freq_end = int(bin_freq_width * (FFT_SIZE // 2))
        
        # Combine frequency bins to fit display
        display_bins = array.array('f', [0] * num_bins)
        bin_width = (FFT_SIZE // 2) // num_bins
        
        # Simple averaging of bins, focusing on lower frequencies
        for i in range(num_bins):
            start_idx = i * bin_width
            end_idx = min((i + 1) * bin_width, FFT_SIZE // 2)
            
            # Fast averaging
            bin_sum = 0
            for j in range(start_idx, end_idx):
                bin_sum += fft_re[j]  # Magnitudes are in the real array after polar conversion
            display_bins[i] = bin_sum / (end_idx - start_idx) if end_idx > start_idx else 0
        
        # Find maximum value for scaling (avoid division by zero)
        max_magnitude = 1.0
        for mag in display_bins:
            if mag > max_magnitude:
                max_magnitude = mag
        
        # Reserve top row for frequency labels
        top_margin = 8
        
        # Use display height minus top margin
        display_height = 54  # 64 - top margin - 2
        baseline = 63        # Start from the bottom of the screen
        scaling_factor = 1.0  # Adjust scaling to distribute bars
        
        # Find the frequency bin with the highest magnitude
        max_idx = 0
        max_val = 0
        for i in range(FFT_SIZE // 2):
            if fft_re[i] > max_val:
                max_val = fft_re[i]
                max_idx = i
        
        # Calculate the peak frequency in Hz
        peak_freq = int(max_idx * bin_freq_width)
        
        # Display peak frequency on the left and max range on the right
        oled.text(f"{peak_freq}", 0, 0, 1)
        end_text = f"{freq_end}"
        # Position end frequency text right-aligned
        end_x = 128 - (len(end_text) * 8)  # Each character is ~8 pixels wide
        oled.text(end_text, end_x, 0, 1)
        
        # Draw the spectrum - each bin takes 2 pixels width
        for i in range(len(display_bins)):
            # Apply sqrt scaling for more balanced distribution
            normalized = display_bins[i] / max_magnitude
            # Use sqrt scaling for better visual distribution
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
        return True
    except Exception as e:
        print(f"Error in draw_spectrum: {e}")
        # Try to show error on display
        try:
            oled.fill(0)
            oled.text("FFT Error", 0, 0, 1)
            oled.text(str(e)[:16], 0, 10, 1)
            oled.show()
        except:
            pass
        return False

try:
    print("\n" + "="*40)
    print("Sound Spectrum Analyzer")
    print("="*40)
    
    # Welcome message on OLED
    oled.fill(0)
    oled.text("FFT Analyzer", 0, 0, 1)
    if using_asm_fft:
        oled.text("Using ASM FFT", 0, 10, 1)
    else:
        oled.text("Using Python FFT", 0, 10, 1)
    oled.text("Starting...", 0, 20, 1)
    oled.show()
    time.sleep(1)
    
    # Calculate and print frequency range information
    nyquist_freq = SAMPLE_RATE / 2
    bin_freq_width = nyquist_freq / (FFT_SIZE // 2)
    max_freq = int(bin_freq_width * (FFT_SIZE // 2))
    
    print("\nAnalyzer configuration:")
    print(f"- Using assembler FFT: {using_asm_fft}")
    print(f"- Frequency resolution: {bin_freq_width:.2f} Hz per bin")
    print(f"- Display frequency range: 0 Hz to {max_freq} Hz")
    print(f"- FFT size: {FFT_SIZE}")
    print(f"- Sample rate: {SAMPLE_RATE} Hz")
    print("\nStarting main loop...")
    
    # Performance monitoring variables
    frame_count = 0
    start_time = time.ticks_ms()
    
    # Main processing loop
    while True:
        # Capture audio samples
        if capture_audio_samples():
            # Process FFT
            if process_fft():
                # Draw the spectrum
                draw_spectrum()
                
                # Performance monitoring
                frame_count += 1
                if frame_count >= 10:
                    current_time = time.ticks_ms()
                    elapsed = time.ticks_diff(current_time, start_time)
                    fps = frame_count * 1000 / elapsed
                    # print(f"FPS: {fps:.1f}")
                    frame_count = 0
                    start_time = current_time
        
        # Small delay to avoid hammering the CPU
        # time.sleep(0.01)

except KeyboardInterrupt:
    print("Monitoring stopped by user")
except Exception as e:
    print(f"Fatal error: {e}")
finally:
    # Clean up
    try:
        audio_in.deinit()
    except:
        pass
    print("Program terminated")