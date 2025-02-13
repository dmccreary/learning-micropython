import machine
import ssd1306
import utime
import math
import array
# import micropython
from machine import ADC, Pin

# OLED Setup
SCL = machine.Pin(2)  # SPI Clock
SDA = machine.Pin(3)  # SPI Data
RES = machine.Pin(4)  # Reset
DC = machine.Pin(5)   # Data/Command
CS = machine.Pin(6)   # Chip Select
spi = machine.SPI(0, sck=SCL, mosi=SDA, baudrate=100000)
oled = ssd1306.SSD1306_SPI(128, 64, spi, DC, RES, CS)

# ADC Setup (Microphone on ADC pin 26)
adc = ADC(Pin(26))

# Sampling Parameters
SAMPLES = 128
SAMPLING_FREQ = 8000
buffer = array.array('h', [0] * SAMPLES)

# Function to sample microphone data
def sample_audio():
    for i in range(SAMPLES):
        buffer[i] = adc.read_u16() >> 8
        utime.sleep_us(int(1e6 / SAMPLING_FREQ))

# Simple FFT function for MicroPython
def fft_magnitude(samples):
    n = len(samples)
    real = samples[:]
    imag = array.array('h', [0] * n)
    
    # Compute FFT (Simple Radix-2 Decimation-In-Time Algorithm)
    step = 2
    while step <= n:
        half = step // 2
        for i in range(0, n, step):
            for j in range(half):
                k = i + j
                l = k + half
                angle = -2 * math.pi * j / step
                cos_angle = math.cos(angle)
                sin_angle = math.sin(angle)
                tr = real[l] * cos_angle - imag[l] * sin_angle
                ti = real[l] * sin_angle + imag[l] * cos_angle
                real[l] = real[k] - tr
                imag[l] = imag[k] - ti
                real[k] += tr
                imag[k] += ti
        step *= 2
    
    # Magnitude calculation
    magnitude = [math.sqrt(real[i]**2 + imag[i]**2) for i in range(n // 2)]
    return magnitude

# Function to display frequency spectrum
def display_spectrum(magnitude):
    oled.fill(0)
    scale = max(magnitude) or 1  # Avoid division by zero
    for i in range(min(128, len(magnitude))):
        height = int((magnitude[i] / scale) * 63)
        oled.rect(i, 63 - height, 1, height, 1)
    oled.show()

# Main Loop
while True:
    sample_audio()
    spectrum = fft_magnitude(buffer)
    display_spectrum(spectrum)
    utime.sleep(0.1)
