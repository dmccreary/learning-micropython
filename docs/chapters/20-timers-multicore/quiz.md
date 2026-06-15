# Quiz: Timers, Timing Functions, and Multi-Core Programming

Test your understanding of non-blocking timing, machine.Timer, the _thread module, and multi-core programming with these questions.

---

#### 1. What is the difference between blocking and non-blocking code?

<div class="upper-alpha" markdown>
1. Blocking code runs faster; non-blocking code is more accurate
2. Blocking code pauses the program (e.g., with `time.sleep()`) until a task finishes; non-blocking code lets the program continue doing other things while waiting
3. Blocking code uses interrupts; non-blocking code uses polling loops
4. Blocking code can only run on Core 0; non-blocking code can run on both cores
</div>

??? question "Show Answer"
    The correct answer is **B**. `time.sleep(1)` is blocking — the entire program freezes for 1 second. During that second, the Pico cannot read sensors, update displays, or respond to button presses. Non-blocking code uses techniques like timing with `ticks_ms()` to check whether enough time has passed without ever stopping the main loop, keeping the program responsive at all times.

    **Concept Tested:** Blocking vs Non-Blocking Code

---

#### 2. What does `ticks_ms()` return?

<div class="upper-alpha" markdown>
1. The number of milliseconds since the Pico was last connected to a computer
2. The current time of day in milliseconds since midnight
3. The number of milliseconds elapsed since the Pico was powered on (or since the counter last wrapped)
4. The number of milliseconds remaining until the next scheduled timer callback
</div>

??? question "Show Answer"
    The correct answer is **C**. `time.ticks_ms()` returns a running count of milliseconds since boot. It is a fast, low-overhead way to get a timestamp. Because the counter eventually wraps around (overflows), always use `ticks_diff(end, start)` to calculate elapsed time safely — this handles the wrap-around correctly even when the counter resets to zero.

    **Concept Tested:** ticks_ms() Function / Non-Blocking Timing

---

#### 3. What is the correct way to measure elapsed time without being fooled by counter wrap-around?

<div class="upper-alpha" markdown>
1. `elapsed = ticks_ms() - start_time`
2. `elapsed = ticks_diff(ticks_ms(), start_time)`
3. `elapsed = ticks_ms() / start_time`
4. `elapsed = start_time - ticks_ms()`
</div>

??? question "Show Answer"
    The correct answer is **B**. `ticks_diff(newer, older)` is specifically designed to handle the wrap-around of the `ticks_ms()` counter. When the counter overflows and resets to 0, a simple subtraction (`ticks_ms() - start_time`) gives a huge wrong number. `ticks_diff()` accounts for the wrap-around and always returns the correct elapsed milliseconds, even across an overflow boundary.

    **Concept Tested:** ticks_diff() Function / ticks_ms() Function

---

#### 4. What does `machine.Timer` in PERIODIC mode do?

<div class="upper-alpha" markdown>
1. Runs a callback function exactly one time after a specified delay, then stops
2. Counts incoming electrical pulses on a GPIO pin and stores the total
3. Calls a specified callback function repeatedly at a fixed interval (e.g., every 1,000 ms)
4. Generates a PWM signal at a frequency set by the timer period
</div>

??? question "Show Answer"
    The correct answer is **C**. `machine.Timer(period=1000, mode=Timer.PERIODIC, callback=my_function)` calls `my_function` automatically every 1,000 milliseconds — regardless of what the main program loop is doing. This is perfect for tasks that need to happen at regular intervals, like sampling a sensor, blinking an LED, or updating a display, without interrupting the main program flow.

    **Concept Tested:** machine.Timer / Timer PERIODIC Mode

---

#### 5. The RP2040 chip in the Pico has two processor cores. What does this mean for MicroPython programs?

<div class="upper-alpha" markdown>
1. One core runs MicroPython; the other runs the C firmware — you cannot use both in Python
2. You can run two separate Python functions simultaneously — one on each core — using the `_thread` module
3. The second core is reserved for USB communication and cannot be used in user programs
4. Both cores run the same code at the same time, making the program twice as fast automatically
</div>

??? question "Show Answer"
    The correct answer is **B**. MicroPython's `_thread` module lets you start a function running on Core 1 while your main code continues on Core 0. This is true parallel execution — both cores run simultaneously. For example, Core 0 can handle sensor reading and display updates while Core 1 continuously monitors a button or runs a PID control loop.

    **Concept Tested:** Dual-Core RP2040 / _thread Module

---

#### 6. What is a race condition in multi-core programming?

<div class="upper-alpha" markdown>
1. A competition between two cores to complete a task first, improving performance
2. A bug where two cores read and write shared data simultaneously, causing unpredictable results
3. The delay between when a timer fires and when the callback function actually runs
4. The maximum speed difference allowed between Core 0 and Core 1 clock rates
</div>

??? question "Show Answer"
    The correct answer is **B**. A race condition occurs when two threads (or cores) try to read and modify the same variable at the same moment. For example, if Core 0 reads `sensor_value` while Core 1 is halfway through writing a new value to it, Core 0 gets corrupted data. Solutions include using locks (`_thread.allocate_lock()`) to ensure only one core accesses shared data at a time.

    **Concept Tested:** Race Condition / Shared Memory / Multi-Core Issues

---

#### 7. A student uses `_thread.start_new_thread(motor_control, ())` in their robot code. What happens?

<div class="upper-alpha" markdown>
1. A new Python file called `motor_control.py` is created and run as a subprocess
2. The `motor_control` function starts running on Core 1 in parallel with the main program on Core 0
3. The `motor_control` function pauses until the main program calls `_thread.join()` to synchronize
4. The Pico reboots and runs `motor_control` as the new main.py startup program
</div>

??? question "Show Answer"
    The correct answer is **B**. `_thread.start_new_thread(func, args)` launches `func` on the second core (Core 1) immediately. The main program continues running on Core 0 at the same time. The empty tuple `()` means no arguments are passed to `motor_control`. The two functions then run simultaneously and independently until the Pico is reset or one of them finishes.

    **Concept Tested:** _thread Module / _thread.start_new_thread()

---

#### 8. What does the `gc` module do, and why does it matter for long-running Pico programs?

<div class="upper-alpha" markdown>
1. The `gc` module controls GPIO pin configurations and clears them between uses
2. The `gc` (garbage collector) module frees RAM that is no longer needed by Python objects, preventing the Pico from running out of memory over time
3. The `gc` module communicates with ground control (gc) stations for satellite IoT projects
4. The `gc` module generates clock signals for synchronizing I2C and SPI devices
</div>

??? question "Show Answer"
    The correct answer is **B**. MicroPython's garbage collector (`gc`) automatically finds Python objects in RAM that are no longer referenced and frees their memory. In a long-running sensor loop, objects created thousands of times can accumulate and eventually cause an `OSError: memory allocation failed`. Calling `gc.collect()` manually at regular intervals reclaims unused memory and keeps the Pico running stably.

    **Concept Tested:** gc Module / Garbage Collection / Memory Management

---

#### 9. What is ONE_SHOT mode for `machine.Timer`, and when would you use it?

<div class="upper-alpha" markdown>
1. ONE_SHOT mode limits the timer to exactly one millisecond of precision
2. ONE_SHOT mode fires the callback once after the specified delay and then stops automatically
3. ONE_SHOT mode runs the callback on Core 1 instead of Core 0 for a single execution
4. ONE_SHOT mode bypasses the callback and directly sets a GPIO pin HIGH after the delay
</div>

??? question "Show Answer"
    The correct answer is **B**. `machine.Timer(period=5000, mode=Timer.ONE_SHOT, callback=my_func)` calls `my_func` exactly once — 5 seconds after the timer starts — and then the timer stops. This is useful for timeouts: "if the user doesn't press a button within 5 seconds, go to sleep mode." PERIODIC mode would keep calling the function every 5 seconds indefinitely.

    **Concept Tested:** Timer ONE_SHOT Mode / machine.Timer

---

#### 10. A student wants Core 0 to read a sensor value and store it in `shared_reading`, while Core 1 displays the value on an OLED. What problem might occur, and how can it be prevented?

<div class="upper-alpha" markdown>
1. The OLED cannot be accessed from Core 1 — all hardware must be controlled from Core 0
2. Core 1 might read `shared_reading` while Core 0 is partway through writing it, getting a corrupted value — use a lock to ensure only one core accesses the variable at a time
3. MicroPython variables are read-only on Core 1, so the student must use a file to pass the sensor value
4. The sensor sampling rate is always slower than the display refresh rate, so no problem occurs
</div>

??? question "Show Answer"
    The correct answer is **B**. This is a classic race condition. If Core 0 is writing a new sensor value at the exact moment Core 1 reads it, Core 1 may get a partial or inconsistent value. The solution is to use `lock = _thread.allocate_lock()` and wrap both the write and read operations with `lock.acquire()` and `lock.release()`, ensuring only one core accesses `shared_reading` at a time.

    **Concept Tested:** Race Condition / Shared Memory / Multi-Core Issues

---
