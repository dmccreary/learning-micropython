---
title: Timers, Timing Functions, and Multi-Core Programming
description: Hardware timers and callbacks, periodic vs one-shot, non-blocking timing with ticks_ms/ticks_diff, RP2040 dual-core with _thread module, shared memory, and garbage collection.
generated_by: claude skill chapter-content-generator
date: 2026-06-13 00:50:00
version: 0.09
---

# Timers, Timing Functions, and Multi-Core Programming

## Summary

Many real projects need to do several things at once — blink an LED while reading a sensor, or update a display while checking for button presses. This chapter introduces three approaches to concurrent-feeling programs: hardware timers that fire callback functions at regular intervals, non-blocking timing with `utime.ticks_ms()` and `ticks_diff()`, and true parallel execution using the RP2040's second processor core and the `_thread` module. You will learn when to use each technique, how to avoid the timing bugs that plague beginners, and how to share data safely between two cores.

## Concepts Covered

This chapter covers the following 19 concepts from the learning graph:

1. Timer Class
2. machine.Timer
3. Timer Callback
4. Periodic vs One-Shot Timer
5. Non-Blocking Programming
6. Blocking vs Non-Blocking
7. machine.time_pulse_us()
8. utime.sleep()
9. utime.ticks_ms()
10. utime.ticks_diff()
11. Multi-Core Programming
12. _thread Module
13. Core 0 and Core 1
14. Shared Memory Between Cores
15. Memory Management
16. Garbage Collection
17. gc Module
18. Heap Memory
19. Stack Memory

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: MicroPython Environment and Development Tools](../03-micropython-environment/index.md)

---

!!! mascot-welcome "Welcome to Chapter 20"
    ![Monty waves hello](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Real projects need to juggle multiple tasks at once. In this chapter you will learn three powerful techniques: hardware timers that fire automatically, non-blocking timing so your main loop keeps running, and true two-core parallel execution unique to the RP2040. By the end, your Pico will genuinely do two things at the same time!

## The Problem: Blocking vs Non-Blocking Code

**Blocking** code pauses the entire program until the current operation finishes. `utime.sleep(5)` is the most common example — the Pico sits frozen for 5 seconds and cannot respond to anything.

**Non-blocking** code returns immediately and lets the main loop continue. Instead of sleeping, non-blocking code checks whether enough time has passed and only performs the action when it has.

Here is the same "blink every second" task written both ways:

```python
# BLOCKING — main loop cannot do anything else while sleeping
while True:
    led.toggle()
    utime.sleep(1)      # program is frozen here for 1 second

# NON-BLOCKING — main loop runs freely
import utime
last_blink = utime.ticks_ms()

while True:
    now = utime.ticks_ms()
    if utime.ticks_diff(now, last_blink) >= 1000:
        led.toggle()
        last_blink = now
    # ... other tasks run here without delay
```

## Non-Blocking Timing with ticks_ms and ticks_diff

The **`utime.ticks_ms()`** function returns the number of milliseconds since the Pico last reset (or overflows). It is a simple, fast counter.

The **`utime.ticks_diff(newer, older)`** function calculates the difference between two ticks values correctly, even if the counter has overflowed (wrapped around). Always use `ticks_diff` instead of simple subtraction (`newer - older`) to handle overflow safely.

```python
import utime

start = utime.ticks_ms()
# ... do some work ...
elapsed = utime.ticks_diff(utime.ticks_ms(), start)
print(f"Elapsed: {elapsed} ms")
```

The non-blocking pattern scales cleanly. You can maintain multiple independent timers in one loop:

```python
last_led  = utime.ticks_ms()
last_read = utime.ticks_ms()

while True:
    now = utime.ticks_ms()

    if utime.ticks_diff(now, last_led) >= 500:      # every 500 ms
        led.toggle()
        last_led = now

    if utime.ticks_diff(now, last_read) >= 2000:    # every 2 s
        sensor.measure()
        print(sensor.temperature())
        last_read = now
```

### machine.time_pulse_us()

**`machine.time_pulse_us(pin, pulse_level, timeout_us)`** measures the duration of a pulse on a pin in microseconds. This is used internally by the HC-SR04 ultrasonic sensor code from Chapter 9. You specify which pin to watch, which level to time (HIGH or LOW), and a timeout if no pulse arrives.

## Hardware Timers

A **hardware timer** is a silicon counter that counts independently of your program. When it reaches a preset value, it fires a **timer callback** function. The callback runs briefly (like an interrupt handler), then your main program continues.

**`machine.Timer`** is the MicroPython class for hardware timers.

```python
from machine import Timer

def blink_callback(timer):
    led.toggle()   # called automatically every 500 ms

timer = Timer()
timer.init(mode=Timer.PERIODIC,       # fire repeatedly
           period=500,                # every 500 ms
           callback=blink_callback)
```

**Periodic vs one-shot timer**:
- `Timer.PERIODIC` — fires the callback repeatedly at the given period.
- `Timer.ONE_SHOT` — fires once after the delay and stops.

```python
# One-shot: turn off after 3 seconds
def turn_off(timer):
    led.value(0)

timer = Timer()
timer.init(mode=Timer.ONE_SHOT, period=3000, callback=turn_off)
```

!!! mascot-warning "Keep Timer Callbacks Short!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Timer callbacks run at interrupt priority — the same rules as `Pin.irq()` handlers apply. Do NOT call `utime.sleep()`, print over serial, or perform lengthy operations inside a timer callback. Set a flag or toggle a pin, then return. The main loop handles the heavy work.

#### Diagram: Blocking vs Non-Blocking Timeline

<iframe src="../../sims/blocking-vs-nonblocking/main.html" width="100%" height="430px" scrolling="no"></iframe>

<details markdown="1">
<summary>Blocking vs Non-Blocking Timeline MicroSim</summary>
Type: diagram
**sim-id:** blocking-vs-nonblocking<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Understand (L2)
Bloom Verb: compare
Learning Objective: Students can explain why blocking code misses events and predict whether a non-blocking pattern will detect a button press during a timing gap.

Canvas layout:
- Left timeline: "Blocking" program — long gray blocks (sleep) alternating with short action blocks
- Right timeline: "Non-blocking" program — continuous green loop tick marks; action blocks at the right intervals
- Below timelines: a button press event marker that the user can drag left/right

Visual elements:
- Blocking: button press during a sleep block is shown as "MISSED" in red
- Non-blocking: button press between tick marks is detected within one loop cycle
- Comparison stat: max response latency shown for each approach

Interactive controls:
- createSlider() for "sleep duration" (100–2000 ms)
- createSlider() for "button press time" (drag to set when the button fires)
- "Play animation" button runs a 5-second simulation

Instructional Rationale: Seeing a missed button press in the blocking timeline makes the problem visceral rather than theoretical, motivating the non-blocking approach.

Implementation: p5.js. Two timeline tracks drawn as horizontal strips; sleep periods as gray rectangles; button press as a vertical arrow the user can drag.
</details>

## Multi-Core Programming with _thread

The RP2040 chip inside your Pico has two identical ARM Cortex-M0+ processor cores: **Core 0** and **Core 1**. Normally MicroPython runs only on Core 0. The **`_thread` module** lets you launch code on Core 1 simultaneously.

This is **true parallelism** — both cores execute code at the same time. Core 0 handles your main program; Core 1 handles a background task.

```python
import _thread
import utime
from machine import Pin

led = Pin(25, Pin.OUT)

def blink_task():
    """This function runs on Core 1, continuously."""
    while True:
        led.toggle()
        utime.sleep(0.5)

# Launch blink_task on Core 1
_thread.start_new_thread(blink_task, ())

# Core 0 continues here — both run simultaneously!
while True:
    print("Core 0 is running...")
    utime.sleep(2)
```

`_thread.start_new_thread(function, args)` launches `function` on Core 1 with the given arguments tuple. The function runs independently until it returns or the Pico resets.

### Shared Memory Between Cores

Both cores access the same RAM. This is convenient but dangerous. If Core 0 is writing a variable at the same moment Core 1 is reading it, the read may get a partially-written value — a **race condition**.

For simple cases (sharing a single integer), the risk is low because integer writes are atomic on the RP2040. For more complex data, use a flag pattern:

```python
import _thread

data_ready = False
shared_value = 0

def producer():
    global shared_value, data_ready
    while True:
        shared_value = read_sensor()    # Core 1 writes
        data_ready = True               # signal Core 0

_thread.start_new_thread(producer, ())

while True:                            # Core 0 reads
    if data_ready:
        print(shared_value)
        data_ready = False
```

## Memory Management — Heap, Stack, and Garbage Collection

The Pico has **264 KB of RAM**, split between **heap memory** and **stack memory**.

- **Stack memory** stores local variables and function call frames. It is fast and automatically managed — when a function returns, its stack frame is gone.
- **Heap memory** stores objects created with constructors (`bytearray()`, `list()`, string concatenation, etc.). Objects remain on the heap until nothing refers to them.

**Garbage collection (GC)** is the automatic process of finding heap objects that nothing refers to anymore and freeing their memory. MicroPython runs GC automatically, but you can trigger it manually:

```python
import gc

gc.collect()                    # run garbage collection now
print(gc.mem_free())            # bytes of heap memory available
print(gc.mem_alloc())           # bytes currently allocated on heap
```

In long-running programs, especially those that create many temporary strings or lists, GC pauses can cause occasional timing glitches. To reduce this:

- Reuse buffers (`bytearray`, `array`) instead of creating new ones.
- Avoid string concatenation in loops — use `format()` or pre-allocated buffers.
- Call `gc.collect()` proactively during non-time-critical parts of your loop.

!!! mascot-thinking "When to Use Each Concurrency Approach"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Use **non-blocking timing** (ticks_ms/ticks_diff) when you want the main loop to juggle multiple tasks with different timing intervals — it is the simplest approach and handles most cases. Use **hardware timers** when you need precise, jitter-free periodic callbacks independent of main loop timing. Use **`_thread`** (dual-core) when you have a task that genuinely needs to run continuously and cannot be interrupted — like streaming audio on Core 1 while Core 0 handles the user interface.

## Key Takeaways

- **Blocking code** (`utime.sleep()`) freezes the program — no button reads, sensor reads, or display updates during the sleep.
- **Non-blocking timing** uses `ticks_ms()` + `ticks_diff()` to check elapsed time without pausing.
- `utime.ticks_diff(newer, older)` handles counter overflow correctly; do not use plain subtraction.
- `machine.Timer(PERIODIC)` fires a callback every N milliseconds — keep callbacks short.
- The RP2040 has **two cores**; `_thread.start_new_thread(fn, ())` runs `fn` on Core 1 simultaneously with Core 0.
- Both cores share the same RAM — use flag variables to communicate safely between cores.
- **Heap memory** holds Python objects; **garbage collection** frees unused objects; call `gc.collect()` to avoid GC pauses in time-critical loops.

??? question "Quick Check: Why use ticks_diff(a, b) instead of (a - b) for measuring elapsed time? (Click to reveal)"
    Because `ticks_ms()` is a 30-bit counter that **wraps around** (overflows back to zero). After about 12 days of uptime, the counter resets. `ticks_diff()` handles this overflow correctly; plain subtraction `a - b` would give a wrong large negative number after the counter wraps.

!!! mascot-celebration "Two Cores, All Power!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Non-blocking patterns, hardware timers, and genuine dual-core parallelism — your concurrency toolkit is complete! Chapter 21 explores the Pico's file system, audio file storage, and systematic debugging techniques. You are in the home stretch of the course!
