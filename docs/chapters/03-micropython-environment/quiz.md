# Quiz: MicroPython Environment and Development Tools

Test your understanding of MicroPython setup, the REPL, file transfer, and standard library modules with these questions.

---

#### 1. What is MicroPython?

<div class="upper-alpha" markdown>
1. A special robot programming language unrelated to Python
2. A version of Python 3 designed to run on tiny microcontrollers with very little RAM
3. A graphical programming tool similar to Scratch
4. A Python library for controlling LEDs
</div>

??? question "Show Answer"
    The correct answer is **B**. MicroPython is a compact, efficient version of Python 3 built specifically for microcontrollers like the Raspberry Pi Pico, which has only 264 KB of RAM. It leaves out desktop-only features while keeping everything needed for hardware control, making full Python programming possible on tiny devices.

    **Concept Tested:** MicroPython

---

#### 2. What is the first step to flash MicroPython firmware onto a Raspberry Pi Pico?

<div class="upper-alpha" markdown>
1. Open Thonny and click File → Flash Firmware
2. Run `pip install micropython` in a terminal
3. Hold the BOOTSEL button while plugging in the USB cable
4. Connect the Pico via Bluetooth and use the wireless flash tool
</div>

??? question "Show Answer"
    The correct answer is **C**. To enter bootloader mode on the Pico, you must hold the BOOTSEL button while connecting the USB cable to your computer. This makes the Pico appear as a USB drive called RPI-RP2, where you then drag the `.uf2` firmware file. Without holding BOOTSEL first, the Pico will not enter the flashing mode.

    **Concept Tested:** Flashing Firmware

---

#### 3. What does REPL stand for, and what does it let you do?

<div class="upper-alpha" markdown>
1. Remote Embedded Programming Library — run programs stored on a server
2. Read-Evaluate-Print Loop — run one Python command at a time and see the result immediately
3. Rapid Execution Programming Layer — compile programs before running them
4. Real-time Error and Print Logger — display error messages from your Pico
</div>

??? question "Show Answer"
    The correct answer is **B**. REPL stands for Read-Evaluate-Print Loop. When you see the `>>>` prompt in Thonny's bottom panel, you are in the REPL. You type one Python command, press Enter, the Pico evaluates it, prints the result, and the prompt returns. This lets you test ideas and explore hardware instantly without saving a file first.

    **Concept Tested:** MicroPython REPL / Interactive Mode

---

#### 4. What is the difference between interactive mode and script mode in MicroPython?

<div class="upper-alpha" markdown>
1. Interactive mode only works with sensors; script mode works with displays
2. Interactive mode runs one command at a time in the REPL; script mode runs a complete saved program
3. Interactive mode is faster; script mode is more accurate
4. Interactive mode requires Wi-Fi; script mode works offline
</div>

??? question "Show Answer"
    The correct answer is **B**. In interactive mode (the REPL), you type individual commands and see results immediately — great for quick experiments. In script mode, you write a complete program in the editor, save it, and run it all at once. Script mode is how you write real projects that do many things in sequence.

    **Concept Tested:** Interactive Mode / Script Mode

---

#### 5. Which file on the Pico runs automatically every time the device powers on and is used for hardware setup?

<div class="upper-alpha" markdown>
1. `setup.py`
2. `config.py`
3. `main.py`
4. `boot.py`
</div>

??? question "Show Answer"
    The correct answer is **D**. `boot.py` runs first, every time the Pico powers on. It is the right place for hardware initialization, Wi-Fi connection setup, and configuration that must happen before your main program starts. After `boot.py` finishes, MicroPython automatically runs `main.py`.

    **Concept Tested:** Boot.py File

---

#### 6. Which tool lets you copy files to the Pico using a drag-and-drop interface inside Thonny?

<div class="upper-alpha" markdown>
1. mpremote
2. rshell
3. Thonny File Manager
4. pip
</div>

??? question "Show Answer"
    The correct answer is **C**. Thonny's File Manager (opened from View → Files) shows two panels: your computer on the left and the Pico on the right. You can drag files between the panels to copy them. mpremote and rshell are command-line tools that do the same job but require typing commands in a terminal.

    **Concept Tested:** Thonny File Manager / File Transfer to Pico

---

#### 7. What does `utime.sleep_ms(500)` do?

<div class="upper-alpha" markdown>
1. Waits for a sensor reading for up to 500 microseconds
2. Pauses the program for 500 milliseconds (half a second)
3. Pauses the program for 500 seconds
4. Measures how many milliseconds have passed since startup
</div>

??? question "Show Answer"
    The correct answer is **B**. The `utime` module's `sleep_ms()` function pauses the program for the specified number of milliseconds. 500 milliseconds equals half a second. For a full-second pause, use `utime.sleep(1)`. For microsecond-level delays, use `utime.sleep_us()`.

    **Concept Tested:** utime Module

---

#### 8. What does `uos.listdir()` return?

<div class="upper-alpha" markdown>
1. A list of all installed Python packages
2. A list of files and folders stored on the Pico
3. A list of all GPIO pin numbers available
4. A list of connected I2C devices
</div>

??? question "Show Answer"
    The correct answer is **B**. The `uos` module provides file system operations. `uos.listdir()` returns a Python list of the files and directories on the Pico's flash storage — for example, `['boot.py', 'main.py']`. It works like the `ls` command in a terminal, showing what is stored on the Pico.

    **Concept Tested:** uos Module

---

#### 9. Why do most MicroPython programs on the Pico use an infinite `while True:` loop?

<div class="upper-alpha" markdown>
1. Python requires all programs to end with `while True:`
2. The Pico crashes if the program ends without a loop
3. The Pico has one job and should keep doing it until unplugged
4. The REPL only works inside an infinite loop
</div>

??? question "Show Answer"
    The correct answer is **C**. Unlike programs on a laptop that finish and exit, a Pico is an embedded device with a dedicated job — keep blinking an LED, keep reading a sensor, keep controlling motors. An infinite `while True:` loop keeps the program running until the Pico is unplugged or reset, which is exactly the right behavior for a hardware controller.

    **Concept Tested:** Main.py File / MicroPython Interpreter

---

#### 10. What information does `sys.platform` provide when printed on a Pico?

<div class="upper-alpha" markdown>
1. The version of Python installed on your laptop
2. The name of the operating system on the Pico (returns `'rp2'`)
3. The current Wi-Fi network name
4. The amount of available flash storage
</div>

??? question "Show Answer"
    The correct answer is **B**. The `sys` module's `platform` attribute returns a string identifying the hardware platform running MicroPython. On a Raspberry Pi Pico (RP2040 chip), it returns `'rp2'`. This is useful when writing code that should behave differently on different microcontrollers.

    **Concept Tested:** sys Module

---
