# Quiz: File Systems, Audio Files, and Debugging

Test your understanding of MicroPython file I/O, SD cards, WAV playback, and debugging strategies with these questions.

---

#### 1. Which function lists the files and folders on the Pico's flash file system?

<div class="upper-alpha" markdown>
1. `os.listdir("/")`
2. `sys.files()`
3. `machine.storage()`
4. `flash.scan()`
</div>

??? question "Show Answer"
    The correct answer is **A**. `uos.listdir("/")` returns a list of filenames and directory names at the root of the Pico's file system. You can also pass a subdirectory path like `uos.listdir("/data")`. Import it with `import uos` in MicroPython. The equivalent in standard Python is `os.listdir("/")`.

    **Concept Tested:** uos.listdir() / MicroPython File System

---

#### 2. What does the following code do?

```python
with open("log.txt", "a") as f:
    f.write("Reading: 22.5\n")
```

<div class="upper-alpha" markdown>
1. Reads the file "log.txt" and prints each line that contains the word "Reading"
2. Creates or appends to "log.txt", adding "Reading: 22.5" on a new line without erasing existing content
3. Overwrites "log.txt" entirely with a single line containing "Reading: 22.5"
4. Reads "log.txt" in append mode and stores 22.5 as a floating-point value
</div>

??? question "Show Answer"
    The correct answer is **B**. Opening a file with mode `"a"` (append) adds new content to the end of the file without erasing what is already there. Mode `"w"` would overwrite. Mode `"r"` would read. The `with` statement ensures the file is properly closed after writing, even if an error occurs. The `\n` adds a newline so each log entry appears on its own line.

    **Concept Tested:** File Write / File Append Mode

---

#### 3. A traceback error ends with `ValueError: invalid literal for int() with base 10: 'abc'`. Where should you look first to fix the bug?

<div class="upper-alpha" markdown>
1. At the first line of the traceback — that is always where the error originates
2. At the bottom line of the traceback — that is the exact line of code that raised the error
3. In the MicroPython firmware — ValueError always means the firmware is corrupted
4. In the I2C device driver — ValueError only occurs during hardware communication failures
</div>

??? question "Show Answer"
    The correct answer is **B**. Python tracebacks show a call chain from top (oldest call) to bottom (newest/most recent). The bottom line is the exact line that crashed. In this case, `int('abc')` was called somewhere with a string that cannot be converted to an integer. Find that line, then check where the string `'abc'` came from — perhaps a sensor returned unexpected text data.

    **Concept Tested:** Reading Tracebacks / Python Error Messages

---

#### 4. Why is an SD card more useful than the Pico's built-in flash storage for data logging projects?

<div class="upper-alpha" markdown>
1. SD cards use I2C, which is faster than the SPI used by flash memory
2. SD cards can store gigabytes of data and are easily removed to read on a computer, while the Pico's flash has only about 2 MB available for files
3. SD cards run at lower voltage (1.8 V), protecting sensitive sensors from the Pico's 3.3 V signals
4. SD cards have built-in real-time clocks, eliminating the need for NTP time synchronization
</div>

??? question "Show Answer"
    The correct answer is **B**. The Pico has about 2 MB of total flash, and after MicroPython firmware and your code, only a fraction is available for data files. A 32 GB SD card provides roughly 16,000 times more storage. SD cards also allow easy data retrieval: remove the card, insert it into a computer, and open the CSV files in a spreadsheet — no USB cable or special tools needed.

    **Concept Tested:** SD Card vs Flash Storage

---

#### 5. When reading a WAV file for I2S playback, what does the chunk size parameter control?

<div class="upper-alpha" markdown>
1. The maximum file size that can be played — files larger than the chunk size are truncated
2. How many bytes are read from the file and written to the I2S buffer at one time, balancing RAM usage and playback smoothness
3. The sample rate — larger chunks increase the audio quality automatically
4. The number of audio channels — chunk size 1 is mono, chunk size 2 is stereo
</div>

??? question "Show Answer"
    The correct answer is **B**. The chunk size (e.g., 1024 or 4096 bytes) determines how many audio samples are loaded into RAM at once before being sent to the I2S peripheral. A very small chunk size causes frequent file reads that may stutter; a very large chunk size wastes scarce RAM. The chunk size does not affect sample rate or channel count — those are set by the I2S configuration.

    **Concept Tested:** WAV Audio Playback / I2S Audio Buffer

---

#### 6. A student's code prints sensor values that look correct but the OLED display shows nothing. What is the most logical first debugging step?

<div class="upper-alpha" markdown>
1. Replace the OLED display with a new one — the hardware must be faulty
2. Run `i2c.scan()` and print the result to verify the Pico can see the OLED at the expected I2C address
3. Increase the I2C clock frequency to 1 MHz to fix communication timing errors
4. Flash the latest MicroPython firmware because display bugs are always firmware issues
</div>

??? question "Show Answer"
    The correct answer is **B**. Before replacing hardware or changing settings, confirm the software can communicate with the device at all. `i2c.scan()` returns a list of responding I2C addresses. If the list is empty or does not include `0x3C`, the problem is in the physical wiring — wrong pins, loose connection, or power issue. This is faster and more informative than any other first step.

    **Concept Tested:** I2C Debugging / i2c.scan() Troubleshooting

---

#### 7. What does the Thonny heap viewer show, and why is it useful for embedded projects?

<div class="upper-alpha" markdown>
1. It shows a visual map of RAM usage, helping you identify memory leaks or objects that are consuming too much memory
2. It shows the call stack of the current program, similar to a traceback but in real time
3. It shows the CPU temperature and warns when the RP2040 is running too hot
4. It shows the file sizes on the Pico's flash, helping you find files that are wasting storage space
</div>

??? question "Show Answer"
    The correct answer is **A**. Thonny's heap viewer displays a color-coded map of the Pico's RAM, showing which blocks are in use and which are free. This is valuable for embedded projects because the Pico has only 264 KB of RAM total. If the heap is nearly full and shrinking over time, your program has a memory leak — objects are being created but not garbage-collected. Run `gc.collect()` and check if free memory increases.

    **Concept Tested:** Thonny Heap Viewer / Memory Management

---

#### 8. A student wrote a data logger but finds the flash file system has become corrupted after unexpected power loss during a write. What strategy prevents this?

<div class="upper-alpha" markdown>
1. Open the log file in read mode (`"r"`) instead of write mode to prevent corruption
2. Use atomic writes — write to a temporary file first, then rename it over the target file so a power loss never leaves a half-written file
3. Disable the garbage collector during file writes using `gc.disable()`
4. Store all data in RAM variables and only write to flash when the Pico receives a safe shutdown signal
</div>

??? question "Show Answer"
    The correct answer is **B**. Atomic write patterns minimize corruption risk: write new data to a temporary file (e.g., `log_tmp.txt`), close it successfully, then use `uos.rename("log_tmp.txt", "log.txt")` to replace the old file. The rename operation is much faster than a full write, so the window for power-loss corruption is tiny. Option D is also reasonable but loses data if power fails before the shutdown signal arrives.

    **Concept Tested:** File System Reliability / Data Logging

---

#### 9. Evaluate this debugging approach: a student adds `print(f"temp={temp}, humid={humid}")` statements throughout their sensor code. What is the advantage and limitation of this approach?

<div class="upper-alpha" markdown>
1. Advantage: works without any tools. Limitation: print statements slightly slow down the code and must be removed before deploying, but they are still the most practical first-level debugging method
2. Advantage: print debugging catches hardware faults that software tools miss. Limitation: it only works when connected to a computer via USB
3. Advantage: print statements are permanent documentation. Limitation: they use too much flash memory
4. Advantage: no limitation — print debugging is equally good as all other methods
</div>

??? question "Show Answer"
    The correct answer is **A**. Print debugging is fast, requires no extra tools, and works in any environment — making it the most commonly used first debugging step. The limitations are real but manageable: each print takes a small amount of time (usually under 1 ms over USB serial) which rarely matters; and print statements should be commented out or wrapped in a debug flag before final deployment to keep output clean.

    **Concept Tested:** Print Debugging / Debugging Strategy

---

#### 10. A student's WAV playback code works perfectly when tested alone, but stutters when combined with sensor-reading code. What is the most likely cause and best solution?

<div class="upper-alpha" markdown>
1. The WAV file format is incompatible with I2S when sensors are active — use MP3 instead
2. The sensor code blocks the main loop too long between I2S buffer refills, causing audio gaps — move sensor reading to Core 1 using `_thread` so I2S gets continuous attention on Core 0
3. The I2C sensor bus interferes electrically with the I2S audio bus — add 10 kΩ resistors to the I2C lines
4. The Pico's ADC (used by analog sensors) shares a clock with I2S and must be disabled during playback
</div>

??? question "Show Answer"
    The correct answer is **B**. Audio playback requires the CPU to refill the I2S buffer every few milliseconds. If sensor code (especially blocking calls like DHT read delays or HC-SR04 echo timing) takes longer than the buffer duration, the I2S peripheral runs out of data and produces a glitch. Moving sensor reading to Core 1 gives Core 0 dedicated time to keep the I2S buffer full, eliminating the stutter.

    **Concept Tested:** Multi-Core Audio / WAV Audio Playback / Debugging Strategy

---
