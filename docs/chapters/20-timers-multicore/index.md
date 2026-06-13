# Timers, Timing Functions, and Multi-Core Programming

## Summary

Many real projects need to do several things at once — blink an LED while reading a sensor, or update a display while checking for button presses. This chapter introduces three approaches to concurrent-feeling programs: hardware timers that fire callback functions at regular intervals, non-blocking timing with utime.ticks_ms() and ticks_diff(), and true parallel execution using the RP2040's second processor core and the _thread module. You will learn when to use each technique, how to avoid the timing bugs that plague beginners, and how to share data safely between two cores.

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

TODO: Generate Chapter Content
