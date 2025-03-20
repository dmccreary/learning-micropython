# Sound Spectrum Analyzer with FFT - Using Peter Hinch's optimized FFT
# Combines INMP441 I2S microphone with SSD1306 OLED display and performs FFT
from machine import Pin, I2S, SPI
from ssd1306 import SSD1306_SPI
import math
import struct
import time
import array
from lib.dftclass import DFT

# Constants
SAMPLE_RATE = 16000
FFT_SIZE = 256
DISPLAY_WIDTH = 128
DISPLAY_HEIGHT = 64
SCALE_FACTOR = 0.1

# Initialize I2S for microphone
i2s = I2S(0,
    sck=Pin(16),    # Serial clock
    ws=Pin(17),     # Word select
    sd=Pin(18),     # Serial data
    mode=I2S.RX,
    bits=32,
    format=I2S.MONO,
    rate=SAMPLE_RATE,
    ibuf=4096)

# Initialize SPI for OLED
spi = SPI(1,
    baudrate=1000000,
    polarity=1,
    phase=1,
    sck=Pin(14),
    mosi=Pin(13))
oled = SSD1306_SPI(DISPLAY_WIDTH, DISPLAY_HEIGHT, spi, Pin(12), Pin(11), Pin(10))

# Initialize DFT
dft = DFT(FFT_SIZE)

# Initialize arrays for audio processing
samples = bytearray(FFT_SIZE * 4)  # 32-bit samples
real = array('f', [0] * FFT_SIZE)
imag = array('f', [0] * FFT_SIZE)
magnitudes = array('f', [0] * (FFT_SIZE // 2))

def capture_audio_samples():
    i2s.readinto(samples)
    for i in range(FFT_SIZE):
        # Convert 32-bit sample to float
        sample = int.from_bytes(samples[i*4:(i+1)*4], 'little')
        real[i] = float(sample) / 0x7FFFFFFF  # Normalize to [-1, 1]
        imag[i] = 0.0

def calculate_magnitudes():
    # Use DFT's built-in magnitude calculation
    dft.run(real, imag, mode=DFT.POLAR)
    for i in range(FFT_SIZE // 2):
        magnitudes[i] = real[i]  # real array now contains magnitudes

def draw_spectrum():
    oled.fill(0)
    
    # Find maximum magnitude for scaling
    max_mag = max(magnitudes)
    if max_mag == 0:
        return
    
    # Draw frequency bars
    bar_width = DISPLAY_WIDTH // (FFT_SIZE // 2)
    for i in range(FFT_SIZE // 2):
        # Scale magnitude to display height
        height = int((magnitudes[i] / max_mag) * (DISPLAY_HEIGHT - 8))
        if height > 0:
            oled.hline(0, DISPLAY_HEIGHT - height, bar_width, 1)
    
    # Draw frequency labels
    oled.text("20Hz", 0, DISPLAY_HEIGHT - 8, 1)
    oled.text("20kHz", DISPLAY_WIDTH - 40, DISPLAY_HEIGHT - 8, 1)
    
    oled.show()

# Main loop
iteration = 0
capture_times = array('f', [0] * 100)
fft_times = array('f', [0] * 100)
draw_times = array('f', [0] * 100)

try:
    while True:
        # Capture audio samples
        t1 = time.ticks_us()
        capture_audio_samples()
        t2 = time.ticks_us()
        capture_times[iteration] = time.ticks_diff(t2, t1) / 1000  # Convert to ms
        
        # Perform FFT
        t3 = time.ticks_us()
        calculate_magnitudes()
        t4 = time.ticks_us()
        fft_times[iteration] = time.ticks_diff(t4, t3) / 1000  # Convert to ms
        
        # Draw spectrum
        t5 = time.ticks_us()
        draw_spectrum()
        t6 = time.ticks_us()
        draw_times[iteration] = time.ticks_diff(t6, t5) / 1000  # Convert to ms
        
        # Calculate and print average times every 100 iterations
        iteration += 1
        if iteration >= 100:
            avg_capture = sum(capture_times) / 100
            avg_fft = sum(fft_times) / 100
            avg_draw = sum(draw_times) / 100
            total_time = avg_capture + avg_fft + avg_draw
            fps = 1000 / total_time
            
            print("\nPerformance metrics:")
            print(f"Capture time: {avg_capture:.2f} ms")
            print(f"FFT time: {avg_fft:.2f} ms")
            print(f"Draw time: {avg_draw:.2f} ms")
            print(f"Total processing time: {total_time:.2f} ms")
            print(f"Frames per second: {fps:.1f}")
            
            iteration = 0  # Reset counter

except KeyboardInterrupt:
    print("Monitoring stopped")
finally:
    # Clean up
    i2s.deinit()
    print("Program terminated")