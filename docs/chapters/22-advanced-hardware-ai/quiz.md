# Quiz: Advanced Hardware Topics and AI-Assisted Coding

Test your understanding of PIO state machines, DMA, watchdog timers, sleep modes, and AI-assisted coding with these questions.

---

#### 1. What is the PIO (Programmable I/O) subsystem on the RP2040?

<div class="upper-alpha" markdown>
1. A set of pins permanently configured as outputs that cannot be changed in software
2. A set of small programmable state machines that handle precise timing-sensitive I/O protocols independently from the CPU
3. The primary I/O controller that manages USB communication between the Pico and the computer
4. A hardware module that automatically converts analog sensor readings to digital values
</div>

??? question "Show Answer"
    The correct answer is **B**. The RP2040 includes 2 PIO blocks, each with 4 state machines — 8 total. Each state machine runs its own tiny assembly program to generate or receive signals with cycle-accurate timing, completely independent of the CPU. This lets the Pico implement custom protocols like WS2812B NeoPixel control or quadrature decoding without any CPU involvement, freeing the CPU for other tasks.

    **Concept Tested:** PIO (Programmable I/O) / PIO State Machine

---

#### 2. What does DMA (Direct Memory Access) allow a microcontroller to do?

<div class="upper-alpha" markdown>
1. Access external DRAM memory chips that are larger than the RP2040's internal RAM
2. Transfer data between memory and peripherals without the CPU executing each transfer, freeing the CPU for other work
3. Directly read the program code from flash memory faster than normal instruction fetching
4. Allow two Pico boards to share memory over a USB cable
</div>

??? question "Show Answer"
    The correct answer is **B**. DMA (Direct Memory Access) is a hardware feature that moves blocks of data — for example, from an ADC buffer to RAM, or from RAM to the I2S peripheral — without the CPU reading and writing each byte individually. A DMA transfer that moves 1,024 audio samples runs entirely in hardware, allowing the CPU to execute your Python code in parallel instead of being tied up in data-copy loops.

    **Concept Tested:** DMA (Direct Memory Access)

---

#### 3. What is the watchdog timer, and what problem does it solve?

<div class="upper-alpha" markdown>
1. A timer that watches for I2C timeouts and automatically retries failed communications
2. A hardware timer that resets the Pico if the program stops feeding it (does not call `wdt.feed()` within the timeout period), recovering from software crashes or infinite loops
3. A timer that monitors battery voltage and shuts down the Pico before the battery dies
4. A debugging tool in Thonny that records how long each line of code takes to execute
</div>

??? question "Show Answer"
    The correct answer is **B**. The watchdog timer counts down from a set value (e.g., 5,000 ms). Your program must call `wdt.feed()` before the timer reaches zero. If a bug causes the program to hang in an infinite loop or crash silently, `wdt.feed()` never gets called, the timer expires, and the RP2040 automatically resets. This is critical for unattended devices like weather stations that must recover from software faults without human intervention.

    **Concept Tested:** Watchdog Timer / machine.WDT

---

#### 4. What is the difference between `lightsleep()` and `deepsleep()` on the Pico?

<div class="upper-alpha" markdown>
1. `lightsleep()` saves about 10% power; `deepsleep()` saves about 20% power — they are similar
2. `lightsleep()` suspends the CPU but keeps RAM and peripheral state, waking quickly; `deepsleep()` cuts nearly all power including RAM, requiring a full reboot on wake
3. `lightsleep()` is for display power management; `deepsleep()` is for wireless radio power management
4. `lightsleep()` requires a timer to wake up; `deepsleep()` wakes up from any GPIO pin change
</div>

??? question "Show Answer"
    The correct answer is **B**. `lightsleep()` pauses the CPU and many clocks while keeping RAM contents intact, so the program resumes from exactly where it left off when a wake trigger fires (pin change, timer, etc.). `deepsleep()` cuts power to nearly everything including RAM, so on wake the Pico performs a full cold reboot — your program starts from `main.py`. Deepsleep saves much more power (microamps vs. milliamps) at the cost of losing program state.

    **Concept Tested:** lightsleep() / deepsleep() / Power Management

---

#### 5. How does the VSYS voltage measurement work on the Pico?

<div class="upper-alpha" markdown>
1. Connect a voltmeter directly to the VSYS pin and read it with external hardware
2. Read ADC channel 3 (the internal ADC connected to VSYS through a voltage divider), then multiply by the divider ratio to get the actual VSYS voltage
3. Use the `machine.voltage()` function which directly returns the VSYS voltage in volts
4. The VSYS voltage cannot be measured in software — only external hardware can read it
</div>

??? question "Show Answer"
    The correct answer is **B**. The RP2040's ADC operates from 0–3.3 V but VSYS can be 1.8–5.5 V (higher than the ADC can read directly). The Pico board includes an internal 3:1 voltage divider connecting VSYS to ADC channel 3. To get the actual VSYS voltage: read ADC3, convert the 16-bit value to voltage (0–3.3 V), then multiply by 3. This tells you the battery or USB supply voltage.

    **Concept Tested:** VSYS Voltage Measurement / ADC Channel 3

---

#### 6. When asking an AI assistant to help you write MicroPython code, what information produces the best results?

<div class="upper-alpha" markdown>
1. Just say "write code for my project" — AI assistants already know every possible project
2. Specify the exact hardware (e.g., "Raspberry Pi Pico with SSD1306 OLED on I2C pins GP0/GP1"), what the code should do, and any constraints (e.g., "non-blocking, uses machine.Timer")
3. Describe the bug first — AI is better at fixing bugs than writing new code
4. Ask in the programming language closest to English (e.g., Ruby) and then convert the result to MicroPython manually
</div>

??? question "Show Answer"
    The correct answer is **B**. AI code generation works best with specific, concrete context. Vague prompts produce generic or incorrect code. A strong prompt gives: (1) the exact microcontroller and hardware modules with pin numbers, (2) the specific task in plain English, and (3) any important constraints like non-blocking design or specific libraries to use. The AI cannot read your mind about which Pico pins you used or which sensor model you have.

    **Concept Tested:** AI Prompt Engineering for Code Generation

---

#### 7. What is the key difference between CircuitPython and MicroPython?

<div class="upper-alpha" markdown>
1. CircuitPython only runs on ESP32; MicroPython only runs on the Pico
2. CircuitPython is maintained by Adafruit and focuses on beginner-friendly hardware libraries and USB drag-and-drop programming; MicroPython is the upstream project with broader hardware support
3. CircuitPython supports color graphics; MicroPython is limited to text output
4. MicroPython is open source; CircuitPython requires a paid license
</div>

??? question "Show Answer"
    The correct answer is **B**. CircuitPython is a fork of MicroPython created and maintained by Adafruit. Key differences: CircuitPython emphasizes ease of use (code runs by saving a file to the USB drive), has an extensive library ecosystem (CircuitPython libraries), and is optimized for Adafruit hardware. MicroPython is the upstream, more hardware-agnostic runtime. Both run Python 3-compatible code, but their library APIs differ.

    **Concept Tested:** CircuitPython vs MicroPython

---

#### 8. A PIO program generates the WS2812B NeoPixel signal instead of using the neopixel module. What advantage does this provide?

<div class="upper-alpha" markdown>
1. The PIO approach uses less RAM — the neopixel module stores all pixel colors in flash instead of RAM
2. PIO generates the timing-critical signal entirely in hardware, freeing the CPU completely and allowing NeoPixel updates to run in the background while Python code continues
3. The PIO approach supports more colors — up to 32 bits per pixel instead of 24 bits
4. PIO bypasses the GPIO pin voltage limit, allowing NeoPixels to be driven directly at 5 V
</div>

??? question "Show Answer"
    The correct answer is **B**. The WS2812B protocol requires bit-timing precision of ±150 ns — difficult to achieve reliably in Python. A PIO state machine generates every bit pulse with clock-cycle accuracy (at 125 MHz = 8 ns per cycle), completely independent of the CPU. The CPU just loads the color data into the PIO FIFO buffer and continues running Python. With the neopixel module, the CPU must bit-bang the entire signal, blocking other code during transmission.

    **Concept Tested:** PIO State Machine / WS2812B PIO Driver

---

#### 9. Evaluate the following practice: a student uses AI to generate all their code and submits it as their own work without understanding it. What is the most significant problem with this approach?

<div class="upper-alpha" markdown>
1. The AI-generated code always contains bugs that only the student can find
2. The student cannot debug, modify, or extend the code when it does not work as expected, because they do not understand how it functions
3. AI code uses too much memory for the Pico's 264 KB RAM limit
4. There is no problem — the goal of coding is working software, regardless of how it was produced
</div>

??? question "Show Answer"
    The correct answer is **B**. AI-generated code is a starting point, not a finished product. Real projects always need debugging, customization, and adaptation to the specific hardware and requirements. A student who does not understand the generated code cannot identify why an LED is not lighting up, why sensor readings are wrong, or how to add a new feature. Understanding the code — even if AI helped write it — is essential for building real physical computing projects.

    **Concept Tested:** AI-Assisted Coding / Critical Evaluation of AI Code

---

#### 10. A student wants to create an unattended weather station that runs for 6 months on a battery pack. Which combination of techniques gives the longest battery life?

<div class="upper-alpha" markdown>
1. Use a Pico W at full power, take readings every second, and upload to Wi-Fi every minute
2. Use `deepsleep()` between readings, wake via RTC every 15 minutes to take a reading and upload via Wi-Fi, then return to deepsleep immediately
3. Use `lightsleep()` continuously and reduce the CPU clock to 48 MHz
4. Disable all GPIO pins during sleep and use DMA to buffer sensor readings overnight
</div>

??? question "Show Answer"
    The correct answer is **B**. Deep sleep draws only a few microamps (compared to ~25 mA awake). Waking every 15 minutes means the Pico is asleep 99.9% of the time. The RTC (Real-Time Clock) can trigger wakeup from deepsleep without keeping the main CPU running. Uploading once per 15 minutes instead of every minute also reduces Wi-Fi radio active time — the Wi-Fi radio is the largest power consumer on the Pico W.

    **Concept Tested:** deepsleep() / Power Management / Battery Life Optimization

---
