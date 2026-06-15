# Quiz: Applied Learning and Capstone Projects

Test your understanding of capstone project design, computational thinking, state machines, and applied MicroPython with these questions.

---

#### 1. What is the Maker Pi RP2040 board, and why is it useful for capstone projects?

<div class="upper-alpha" markdown>
1. A sensor breakout board that adds 16 extra ADC channels to the standard Pico
2. An integrated educational robotics board that combines the RP2040 processor with motor drivers, NeoPixels, a buzzer, and Grove connectors on one board
3. A wireless module that adds Bluetooth to a standard Raspberry Pi Pico
4. A display board with a built-in 2.4" TFT screen and four capacitive touch buttons
</div>

??? question "Show Answer"
    The correct answer is **B**. The Maker Pi RP2040 from Cytron integrates a dual DC motor driver (DRV8833), 2 servo connectors, 18 NeoPixel LEDs, a passive buzzer, 4 push buttons, Grove connectors for sensors, and status LEDs — all on one $11 board. This all-in-one design eliminates wiring complexity, making it ideal for first robot capstone projects.

    **Concept Tested:** Maker Pi RP2040 / Educational Robot Hardware

---

#### 2. What are the four pillars of computational thinking?

<div class="upper-alpha" markdown>
1. Variables, loops, functions, and classes
2. Decomposition, pattern recognition, abstraction, and algorithm design
3. Input, processing, output, and storage
4. Hardware, software, firmware, and middleware
</div>

??? question "Show Answer"
    The correct answer is **B**. Computational thinking is a problem-solving approach with four core skills: (1) Decomposition — breaking a big problem into smaller parts; (2) Pattern Recognition — finding similarities and repeated structures; (3) Abstraction — focusing on essential details and hiding complexity (e.g., using a function instead of repeating code); (4) Algorithm Design — creating step-by-step instructions to solve the problem.

    **Concept Tested:** Computational Thinking / Problem Decomposition

---

#### 3. In the 7-step project design process, what should you do BEFORE writing any code?

<div class="upper-alpha" markdown>
1. Write all the code first, then document what you built
2. Define the problem clearly, list required components in a Bill of Materials, and draw a wiring diagram
3. Order all possible parts online so they arrive before you start planning
4. Search for existing code online and modify it to fit your project
</div>

??? question "Show Answer"
    The correct answer is **B**. The project design process begins with: (1) define the problem and goals, (2) research components, (3) create a BOM (Bill of Materials), (4) draw the wiring diagram, and only then (5) write and test code. Starting with code before understanding the hardware and requirements leads to wasted effort when you discover a component does not work as expected or is missing from your kit.

    **Concept Tested:** Project Design Process / Bill of Materials

---

#### 4. A Larson Scanner project lights up individual NeoPixels in sequence, creating a "Knight Rider" bouncing light effect. What data structure is most useful for storing the pixel positions and brightnesses in the trail?

<div class="upper-alpha" markdown>
1. A single integer variable storing the current peak LED position
2. A list of brightness values (one per LED) that decays from full brightness at the peak to dim at the tail
3. A dictionary mapping LED colors to their physical positions in the strip
4. A string of hex color codes separated by commas
</div>

??? question "Show Answer"
    The correct answer is **B**. The Larson Scanner effect requires each LED in the trailing wake to be dimmer than the previous one. A list `brightness[i]` where index 0 is the peak and higher indices are dimmer tail positions lets you calculate each LED's color by scaling the base color by the brightness factor. As the peak moves, you shift the list and apply each brightness to the corresponding pixel.

    **Concept Tested:** Larson Scanner / NeoPixel Pattern / List Data Structure

---

#### 5. A NeoPixel Rotary project uses a rotary encoder to select a color on the color wheel and a push button to apply it. What is this kind of input-driven interaction called?

<div class="upper-alpha" markdown>
1. Interrupt-driven serial communication
2. Event-driven programming — the system responds to user events (rotation, button press) rather than running on a fixed schedule
3. Real-time operating system scheduling
4. Direct memory access control
</div>

??? question "Show Answer"
    The correct answer is **B**. Event-driven programming structures code around responding to events — things that happen (button pressed, encoder turned, timer fired) — rather than constantly looping through fixed steps. The encoder generates an "event" when turned; the button generates an "event" when pressed. The program waits for events and responds to each one appropriately, making the interface feel immediate and responsive.

    **Concept Tested:** Event-Driven Programming

---

#### 6. In the Spectrum Analyzer capstone project, what does the FFT output represent?

<div class="upper-alpha" markdown>
1. The raw audio waveform from the microphone plotted over time
2. The amplitude (energy level) at each frequency band in the audio signal, enabling visualization of bass, midrange, and treble separately
3. The MIDI note values of the sounds detected by the microphone
4. The time delay between the microphone input and the speaker output
</div>

??? question "Show Answer"
    The correct answer is **B**. The FFT converts the time-domain audio buffer (thousands of samples showing air pressure over time) into a frequency-domain spectrum. Each output "bin" represents a specific frequency range. Bin 0 is DC/very low frequency, bin 1 is bass, higher bins are midrange and treble. The Spectrum Analyzer displays these bin amplitudes as a bar graph, typically on NeoPixels or an OLED, making sound frequencies visible.

    **Concept Tested:** Spectrum Analyzer / FFT Output Interpretation

---

#### 7. What is a state machine, and why is it useful for robot programming?

<div class="upper-alpha" markdown>
1. A machine that measures the current state of all hardware pins and logs them to a file
2. A programming pattern where the system is always in one defined state (e.g., FORWARD, TURN, STOP) and transitions between states based on sensor events — making complex behavior easier to design and debug
3. A hardware component that stores the last sensor reading in a register until it is read by the CPU
4. A Python class that automatically manages shared variables between Core 0 and Core 1
</div>

??? question "Show Answer"
    The correct answer is **B**. State machines model a system as a set of distinct states with rules for transitioning between them. A line-following robot might have states: FOLLOWING_LINE, TURNING_LEFT, TURNING_RIGHT, LOST_LINE. Each state defines what the motors do, and sensor readings trigger transitions. This is cleaner than a tangle of if/else checks — each state's behavior is isolated and easy to test individually.

    **Concept Tested:** State Machine / Robot Behavior Design

---

#### 8. An RFID RC522 reader reads a card and returns its UID as a list of bytes like `[0x04, 0xA3, 0x2B, 0x1C]`. A student wants to convert this to a readable hex string. What computational thinking skill does this require?

<div class="upper-alpha" markdown>
1. Decomposition — break the card scanning problem into hardware and software sub-problems
2. Abstraction — hide the complexity of the RFID protocol behind a simple `read_card()` function
3. Algorithm design — design a step-by-step process: for each byte, format as two hex digits, join all results into one string
4. Pattern recognition — notice that all card UIDs follow the same format structure
</div>

??? question "Show Answer"
    The correct answer is **C**. Converting a list of bytes to a hex string requires designing an algorithm: (1) iterate over each byte in the list, (2) format each byte as a 2-character uppercase hex string using `"{:02X}".format(byte)`, (3) join all results with `-` separators. This is algorithm design — creating a clear, repeatable procedure to transform data from one format to another.

    **Concept Tested:** Algorithm Design / RFID RC522 Reader

---

#### 9. A student finishes their capstone project and wants to share it with classmates who might want to build their own version. What should the shared project documentation include to be genuinely useful?

<div class="upper-alpha" markdown>
1. Only the Python code — classmates can figure out the wiring from the code comments
2. A bill of materials, wiring diagram, setup instructions (including driver installation), the Python code with comments, and a brief troubleshooting section for common issues
3. A video demonstration of the finished project — written documentation is unnecessary if the video is clear
4. Only the bill of materials — wiring and code are proprietary and should not be shared
</div>

??? question "Show Answer"
    The correct answer is **B**. Effective project documentation lets someone else replicate the project from scratch. The minimum useful set includes: what to buy (BOM), how to wire it (wiring diagram), how to set it up (installation steps), the code with enough comments to understand it, and what to do when things go wrong (troubleshooting). Missing any one of these forces the next person to reverse-engineer your project through trial and error.

    **Concept Tested:** Project Documentation / Knowledge Sharing

---

#### 10. You have built a working line-following robot with two IR sensors. Design an improvement: the robot must now stop when it reaches a T-junction (both sensors on the line simultaneously) and wait 3 seconds before continuing. What changes are needed?

<div class="upper-alpha" markdown>
1. Add a third IR sensor in the center and update the threshold value in the existing sensor logic
2. Add a new state (JUNCTION_STOP) to the state machine: when both sensors read ON-LINE simultaneously, transition to JUNCTION_STOP, run a 3-second timer, then transition back to FOLLOWING_LINE
3. Replace the IR sensors with ultrasonic sensors that can detect T-junction geometry
4. Set both motors to 50% speed when both sensors are ON-LINE so the robot slows down instead of stopping
</div>

??? question "Show Answer"
    The correct answer is **B**. This is a state machine extension. Add a new state `JUNCTION_STOP` with behavior: stop both motors. The transition rule into it is: both sensors read ON-LINE (currently handled as "go straight"). In `JUNCTION_STOP`, start a 3-second timer using `ticks_ms()`. When the timer expires, transition back to `FOLLOWING_LINE`. No new hardware is needed — the existing sensors already detect the T-junction condition.

    **Concept Tested:** State Machine Extension / Robot Behavior Design / Computational Thinking

---
