# Spectrum Analyzer Kit

This kits will displays a frequency spectrum from microphone input on the OLED display. This will involve reading from the ADC, performing an FFT, and displaying the results.

!!! Note
    This kit has been promoted to be an entire
    project with its own GitHub repository.

    See the New Book Here:
    
    [https://dmccreary.github.io/spectrum-analyzer/](https://dmccreary.github.io/spectrum-analyzer/)

## Components

1. Raspberry Pi Pico
2. Microphone
3. OLED Display
4. Breadboard
5. Wires

## Assembly

Connect the microphone between AGND and the analog-to-digital converter GPIO port 26.
Make sure to use the AGND to avoid the noise on the other GND pins.

Connect the OLED to pins 2 to 6 using the following table:

```python
SCL_PIN = 2 # SPI CLock
SDA_PIN =3 # SPI Data
RESET_PIN = 4 # Reset
DC_PIN = 5 # Data/command
CS_PIN = 6 # Chip Select
```

Or you can directly reference the Pin with the numbers:

```python
SCL=machine.Pin(2) # SPI CLock
SDA=machine.Pin(3) # SPI Data
RESET = machine.Pin(4) # Reset
DC = machine.Pin(5) # Data/command
CS = machine.Pin(6) # Chip Select
```


I've created a spectrum analyzer program that builds on the hello world example while adding the following features:

1.  ADC setup for the microphone on GPIO 29
2.  Sample collection at a fixed rate (10 kHz)
3.  FFT implementation using the Cooley-Tukey algorithm
4.  Spectrum visualization with 16 frequency bars

Key aspects of the program:

-   Uses the same [OLED]() display setup as the hello world example
-   Implements a basic [FFT]() algorithm since MicroPython doesn't have NumPy
-   Applies a [Hanning window]() to reduce spectral leakage
-   Normalizes the frequency magnitudes for better visualization
-   Averages frequency bins into 16 displayable bars
-   Updates continuously with a small delay to prevent display flicker

The program could be optimized further by:

1.  Using a lookup table for the window function
2.  Pre-computing the FFT twiddle factors
3.  Using fixed-point math instead of floating point



## The "FFT Twiddle Factors"

Let me explain FFT twiddle factors in detail.

Twiddle factors are the complex exponential terms used in the Fast Fourier Transform (FFT) algorithm. In our code, this appears in the line:

```python
t = odd[k]* math.exp(-2j* math.pi * k / n)
```

These factors are the complex roots of unity, specifically of the form:

$$
W_N^k = e^(-2πik/N)
$$

where:

-   N is the size of the FFT (in our case, SAMPLES = 128)
-   k is the index (0 to N-1)
-   i is the imaginary unit (written as j in Python)

The reason they're called "twiddle factors" is historical - the term was coined by IBM researchers in the 1960s who thought these complex exponential terms seemed to "twiddle" the bits around in the computation.

What makes twiddle factors important for optimization is that:

1.  They are expensive to compute (involving sin and cos calculations)
2.  For a given FFT size, they are constant and repeating
3.  They follow symmetry properties

In our current code, we're recalculating these factors every time, which is inefficient. We could optimize by pre-computing them once.

This optimization:

1.  Computes the twiddle factors once at startup
2.  Reuses them for every FFT computation
3.  Scales the twiddle factor index based on the current FFT size in the recursive calls

On a resource-constrained system like the Pico, this can significantly improve performance since we avoid repeatedly calculating expensive trigonometric functions. The trade-off is that we use more memory to store the pre-computed values, but for our 128-point FFT, this is a worthwhile optimization.

### The Hanning Window Function

The Hanning Window is key in spectral analysis.

In our code, we apply the Hanning window with these lines:

```python
# Apply Hanning windowfor i inrange(SAMPLES):    samples[i]*=0.5*(1- math.cos(2* math.pi * i /(SAMPLES -1)))`
```

The Hanning Window is a mathematical function that smoothly reduces the amplitude of the signal at the beginning and end of our sample window to zero. Here's why it's important:

1.  Without windowing, our FFT assumes the signal is perfectly periodic within our sample window. But in real signals (like audio), this is rarely true.
2.  When the signal isn't periodic in our window, we get what's called "spectral leakage" - frequencies appearing in our spectrum that weren't in the original signal.

Let me modify our code to show the difference with and without the window:


We have made two improvements:

1.  Pre-computed the window coefficients to improve performance
2.  Added the ability to toggle windowing on/off

The Hanning Window looks like this when plotted:

```
1.0 |     ****
    |   **    **
0.5 |  *        *
    | *          *
0.0 |*            *
    ----------------
    0   Samples   127
```

When we multiply our signal by this window:

-   The middle of our sample window is mostly unchanged
-   The edges are smoothly reduced to zero
-   This prevents discontinuities that would cause spectral leakage

In a real audio signal, you might see these differences:

-   Without window: Sharp peaks with "skirts" spreading into nearby frequencies
-   With window: Cleaner peaks that more accurately represent the true frequency content

The trade-off is that windowing reduces our frequency resolution slightly, but for a real-time spectrum analyzer, the benefits of reduced spectral leakage usually outweigh this cost.



