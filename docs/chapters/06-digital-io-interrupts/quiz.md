# Quiz: Digital Input, Output, and Interrupts

Test your understanding of GPIO control, button reading, debouncing, and interrupt handlers with these questions.

---

#### 1. What are the only two possible states for a GPIO pin in digital mode?

<div class="upper-alpha" markdown>
1. On and Off
2. HIGH (3.3 V) and LOW (0 V)
3. Positive and Negative
4. Read and Write
</div>

??? question "Show Answer"
    The correct answer is **B**. In digital electronics, a GPIO pin is either HIGH (at or near 3.3 V on the Pico) or LOW (at or near 0 V / GND). There are no in-between states in digital mode. This binary language of HIGH and LOW is how every LED, button, switch, and digital sensor communicates with the Pico.

    **Concept Tested:** HIGH and LOW States / Digital Signal

---

#### 2. Which MicroPython code creates a GPIO output pin on GP15?

<div class="upper-alpha" markdown>
1. `led = Pin(15, Pin.IN)`
2. `led = Pin.output(15)`
3. `led = Pin(15, Pin.OUT)`
4. `led = GPIO.write(15)`
</div>

??? question "Show Answer"
    The correct answer is **C**. `Pin(15, Pin.OUT)` creates a `Pin` object for GPIO 15 in output mode. The first argument is the GPIO number, and `Pin.OUT` sets the direction as output so your code can drive the pin HIGH or LOW. `Pin.IN` would make it an input for reading, not controlling.

    **Concept Tested:** machine.Pin Class / Pin.OUT Mode

---

#### 3. What does `led.toggle()` do?

<div class="upper-alpha" markdown>
1. Turns the LED on if it is off, or off if it is on
2. Gradually fades the LED brightness up and down
3. Checks whether the LED is currently on or off
4. Disconnects the LED from the GPIO pin in software
</div>

??? question "Show Answer"
    The correct answer is **A**. `pin.toggle()` flips the current output state — if the pin is HIGH it becomes LOW, and if it is LOW it becomes HIGH. This is useful in blinking loops where you do not need to track the current state — just call `toggle()` and the LED switches between on and off each time.

    **Concept Tested:** Pin.value() Method / LED Blink Program

---

#### 4. A button is wired between GP14 and GND with `Pin.PULL_UP` active. What does `button.value()` return when the button is NOT pressed?

<div class="upper-alpha" markdown>
1. 0 (LOW), because the pull-up connects the pin to GND
2. 1 (HIGH), because the pull-up holds the pin at 3.3 V
3. -1, indicating no voltage
4. None, because nothing is connected to the pin
</div>

??? question "Show Answer"
    The correct answer is **B**. With `Pin.PULL_UP`, the internal pull-up resistor connects the pin to 3.3 V. When the button is not pressed, no other connection exists, so the pull-up holds the pin at 3.3 V, and `button.value()` returns `1` (HIGH). When the button is pressed, it connects the pin to GND, overcoming the pull-up and pulling the reading to `0` (LOW).

    **Concept Tested:** Button Input / Pull-Up Resistor

---

#### 5. What is contact bounce, and why is it a problem?

<div class="upper-alpha" markdown>
1. The Pico bouncing between two programs when a button is held
2. Rapid HIGH/LOW voltage fluctuations from mechanical button contacts settling after a press
3. An LED flashing when a button is connected nearby due to electromagnetic interference
4. A programming error that causes the button check to run twice per loop
</div>

??? question "Show Answer"
    The correct answer is **B**. When you press a mechanical button, the metal contacts physically bounce before settling, creating dozens of rapid HIGH/LOW transitions in just a few milliseconds. The Pico reads all of these as separate presses. Without debouncing, one button press can register as many button presses, causing unpredictable behavior.

    **Concept Tested:** Button Debouncing

---

#### 6. How does software debouncing work?

<div class="upper-alpha" markdown>
1. By using a hardware capacitor to absorb the bounce signal
2. By waiting 20–50 ms after detecting a change and then reading the button again
3. By attaching a pull-down resistor to slow the signal edge
4. By using two buttons wired in series so both must be pressed simultaneously
</div>

??? question "Show Answer"
    The correct answer is **B**. Software debouncing adds a short delay (typically 20–50 ms) after detecting a button state change. Then it reads the button again. If the button is still pressed after the delay, the press is considered real. This gives the contacts time to stop bouncing before accepting the input as valid.

    **Concept Tested:** Software Debouncing / Button Debouncing

---

#### 7. What is the difference between active HIGH and active LOW button wiring?

<div class="upper-alpha" markdown>
1. Active HIGH buttons use more power; active LOW buttons are more efficient
2. Active HIGH means the signal goes HIGH when triggered; active LOW means it goes LOW when triggered
3. Active HIGH uses a pull-up resistor; active LOW uses no resistor at all
4. They are the same thing — the terms are used interchangeably
</div>

??? question "Show Answer"
    The correct answer is **B**. Active HIGH: the input reads HIGH (1) when the event occurs, typically using `Pin.PULL_DOWN`. Active LOW: the input reads LOW (0) when the event occurs, typically using `Pin.PULL_UP` with the button connecting the pin to GND. Most buttons in this course use active LOW wiring, which is why checking for `button.value() == 0` means "pressed."

    **Concept Tested:** Active High vs Active Low

---

#### 8. What is an interrupt handler (interrupt service routine)?

<div class="upper-alpha" markdown>
1. A loop that constantly checks a pin value 1,000 times per second
2. A function that runs immediately when a specified pin event occurs, pausing the main program
3. A hardware chip that amplifies GPIO signals for faster detection
4. A Python error that occurs when you read a pin too quickly
</div>

??? question "Show Answer"
    The correct answer is **B**. An interrupt handler is a function that runs automatically when a hardware event (like a pin going HIGH or LOW) occurs. When the interrupt fires, the main program pauses, the handler runs, and then the main program continues exactly where it left off. This allows the Pico to react instantly to events without constantly checking in a loop.

    **Concept Tested:** Interrupt Handler / IRQ (Interrupt Request)

---

#### 9. Which `Pin.irq()` trigger fires when an active LOW button is pressed?

<div class="upper-alpha" markdown>
1. `Pin.IRQ_RISING` — because the pin voltage rises when pressed
2. `Pin.IRQ_HIGH` — because the pin stays HIGH while held
3. `Pin.IRQ_LOW` — because the pin is always LOW when a button is near
4. `Pin.IRQ_FALLING` — because the pin voltage falls from HIGH to LOW when pressed
</div>

??? question "Show Answer"
    The correct answer is **D**. With an active LOW button (using `PULL_UP`), pressing the button connects the pin to GND, causing the voltage to fall from 3.3 V (HIGH) to 0 V (LOW). This HIGH-to-LOW transition is called a falling edge, so you use `Pin.IRQ_FALLING`. For release detection, use `Pin.IRQ_RISING`.

    **Concept Tested:** Pin.irq() Method / IRQ

---

#### 10. Why should interrupt handler functions be kept very short?

<div class="upper-alpha" markdown>
1. Longer handlers use more flash memory and may not fit on the Pico
2. Python syntax only allows 5 lines inside an interrupt handler
3. Interrupt handlers run at high priority — long operations can cause unpredictable program behavior
4. Short handlers run at a higher PWM frequency for more precise timing
</div>

??? question "Show Answer"
    The correct answer is **C**. Interrupt handlers run at interrupt priority, pausing the entire main program. If the handler is long — for example, calling `sleep()`, printing over serial, or doing heavy math — the main program stays paused for that entire time, potentially missing other events. Best practice: set a flag or increment a counter in the handler, then let the main loop do the real work.

    **Concept Tested:** Interrupt Handler / IRQ

---
