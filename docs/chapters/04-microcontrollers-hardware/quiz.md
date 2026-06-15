# Quiz: Microcontrollers and Hardware Platforms

Test your understanding of the Raspberry Pi Pico, GPIO pins, power rails, and RP2040 features with these questions.

---

#### 1. How much RAM does the Raspberry Pi Pico's RP2040 chip have?

<div class="upper-alpha" markdown>
1. 2 MB
2. 264 KB
3. 4 GB
4. 1 MB
</div>

??? question "Show Answer"
    The correct answer is **B**. The RP2040 chip has 264 KB of RAM — temporary working memory used by your running program, its variables, and its call stack. The Pico also has 2 MB of flash memory (permanent storage for your programs), which students sometimes confuse with RAM.

    **Concept Tested:** RAM on Pico

---

#### 2. What does GPIO stand for?

<div class="upper-alpha" markdown>
1. Ground-to-Power Input-Output
2. General-Purpose Input/Output
3. Graphical Processing Interface Operation
4. Global Pin Interface Option
</div>

??? question "Show Answer"
    The correct answer is **B**. GPIO stands for General-Purpose Input/Output. These are the Pico's connection pins to the physical world — you can configure each one as either an input (to read sensors or buttons) or an output (to control LEDs or motors). The Pico has 26 usable GPIO pins labeled GP0 through GP28.

    **Concept Tested:** GPIO Pin

---

#### 3. What MicroPython code creates a GPIO pin on GP25 configured as an output?

<div class="upper-alpha" markdown>
1. `pin = Pin(25, Pin.READ)`
2. `pin = GPIO(25, OUTPUT)`
3. `pin = Pin(25, Pin.OUT)`
4. `pin = Pin.output(25)`
</div>

??? question "Show Answer"
    The correct answer is **C**. The `machine.Pin` class is used to control GPIO pins. The first argument is the GPIO number, and the second argument is the mode. `Pin.OUT` sets the pin as an output so you can drive it HIGH or LOW. `Pin.IN` would set it as an input for reading.

    **Concept Tested:** GPIO Numbering / Pin Modes

---

#### 4. What is the maximum voltage you should apply to a GPIO input pin on the Pico?

<div class="upper-alpha" markdown>
1. 5 V
2. 12 V
3. 1.8 V
4. 3.3 V
</div>

??? question "Show Answer"
    The correct answer is **D**. The Pico's GPIO pins operate at 3.3 V logic. Connecting a signal higher than 3.3 V — such as a 5 V signal from an Arduino — can permanently damage the RP2040 chip. If you need to connect a 5 V device, use a level shifter to convert the voltage down to 3.3 V first.

    **Concept Tested:** 3.3V Logic Level

---

#### 5. What does a pull-up resistor do to a GPIO input pin?

<div class="upper-alpha" markdown>
1. Pulls the pin voltage down to GND when nothing is connected
2. Increases the maximum current the pin can supply
3. Holds the pin at a HIGH (3.3 V) state when nothing is connected to it
4. Converts the pin from digital to analog mode
</div>

??? question "Show Answer"
    The correct answer is **C**. A pull-up resistor connects the pin to 3.3 V through a high-value resistor. When nothing else is connected, the pin reads HIGH. When a button connects the pin to GND, it reads LOW. This prevents the pin from being "floating" — having an unpredictable value — when no signal is applied.

    **Concept Tested:** Pull-Up Resistor

---

#### 6. What is the difference between the VBUS pin and the VSYS pin on the Pico?

<div class="upper-alpha" markdown>
1. VBUS powers the CPU; VSYS powers the GPIO pins
2. VBUS is the raw USB 5 V supply; VSYS is the main power input that also accepts batteries
3. VSYS is for 5 V components; VBUS is for 3.3 V components
4. They are identical — both provide 3.3 V
</div>

??? question "Show Answer"
    The correct answer is **B**. VBUS is directly connected to the USB 5 V supply — use it to power 5 V components. VSYS is the main power input rail that accepts USB power or an external battery (1.8–5.5 V). The Pico's onboard regulator takes VSYS voltage and steps it down to the 3.3 V that powers the chip and GPIO pins.

    **Concept Tested:** VSYS Pin / VBUS Pin / USB Power

---

#### 7. What is the RP2040's PIO (Programmable I/O) used for?

<div class="upper-alpha" markdown>
1. Saving programs to flash memory
2. Handling precise, high-speed digital signals in hardware without using the main CPU
3. Reading analog voltages from sensors
4. Managing Wi-Fi network connections
</div>

??? question "Show Answer"
    The correct answer is **B**. The RP2040's PIO subsystem contains eight tiny state machines that run their own programs in hardware, independently of the main processor cores. PIO is used for timing-critical tasks like driving WS2812B NeoPixels and generating custom communication protocols that would cause jitter if run from software.

    **Concept Tested:** RP2040 PIO (Programmable I/O)

---

#### 8. A beginner student connects a 5 V Arduino sensor signal directly to a Pico GPIO pin. What is most likely to happen?

<div class="upper-alpha" markdown>
1. The Pico automatically adjusts to handle 5 V signals
2. The sensor will read lower values than expected but still work
3. The RP2040 chip may be permanently damaged
4. The Pico will reboot and fix itself
</div>

??? question "Show Answer"
    The correct answer is **C**. The Pico's GPIO pins are rated for 3.3 V maximum input. Applying 5 V from an Arduino sensor directly to a GPIO pin can permanently destroy the RP2040 chip. Always use a logic level shifter when connecting 5 V devices to the Pico. Once the chip is damaged, it cannot be repaired.

    **Concept Tested:** 5V Logic Level / GPIO Pin

---

#### 9. What is the difference between flash memory and RAM on the Pico?

<div class="upper-alpha" markdown>
1. Flash stores programs permanently; RAM stores running data temporarily
2. Flash is faster; RAM is slower but holds more data
3. RAM stores programs permanently; flash stores sensor readings
4. They are the same thing, just different names used by different manufacturers
</div>

??? question "Show Answer"
    The correct answer is **A**. Flash memory (2 MB on the Pico) stores your programs permanently — files survive power cuts because flash is non-volatile. RAM (264 KB) is temporary working memory — it holds the running program's variables and call stack, but everything in RAM is erased when you unplug the Pico.

    **Concept Tested:** Flash Memory on Pico / RAM on Pico

---

#### 10. Which special feature of the RP2040 lets you run two separate programs truly simultaneously?

<div class="upper-alpha" markdown>
1. PIO (Programmable I/O) state machines
2. Dual ARM Cortex-M0+ processor cores
3. 2 MB of flash memory with dual-bank access
4. The ADC's four simultaneous input channels
</div>

??? question "Show Answer"
    The correct answer is **B**. The RP2040 has two ARM Cortex-M0+ processor cores — Core 0 and Core 1. Core 0 runs your main MicroPython program, and Core 1 can run a second program at exactly the same time. This is true parallelism, not time-sharing. The `_thread` module (Chapter 20) lets you put code on Core 1.

    **Concept Tested:** RP2040 Dual Core

---
