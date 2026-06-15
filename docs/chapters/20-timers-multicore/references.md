# References: Timers, Timing Functions, and Multi-Core Programming

1. [Timer](https://en.wikipedia.org/wiki/Timer) - Wikipedia - Explains hardware timers and how they trigger actions at set intervals. Directly supports this chapter's `machine.Timer` examples.

2. [Multi-core processor](https://en.wikipedia.org/wiki/Multi-core_processor) - Wikipedia - Describes how multiple CPU cores run code at the same time. Background for the RP2040's dual-core work in this chapter.

3. [Thread (computing)](https://en.wikipedia.org/wiki/Thread_(computing)) - Wikipedia - Covers threads as independent paths of execution, the model behind running code on a second core. Reinforces the chapter's `_thread` section.

4. Programming the Raspberry Pi Pico/W in MicroPython - Harry Fairhead & Mike James - I/O Press - A deeper treatment of timers, interrupts, and multi-core programming that extends this chapter's topics.

5. Programming with MicroPython - Nicholas H. Tollervey - O'Reilly Media - Explains timing and scheduling patterns in MicroPython that complement this chapter.

6. [machine.Timer](https://docs.micropython.org/en/latest/library/machine.Timer.html) - MicroPython - Official reference for periodic and one-shot timers with callbacks. The authoritative companion to the chapter's timer code.

7. [_thread](https://docs.micropython.org/en/latest/library/_thread.html) - MicroPython - Reference for starting code on the RP2040's second core. Directly supports the chapter's multi-core examples.

8. [time](https://docs.micropython.org/en/latest/library/time.html) - MicroPython - Reference for `sleep`, `ticks_ms`, and `ticks_diff` used for non-blocking timing. Supports the chapter's timing-function section.

9. [asyncio](https://docs.micropython.org/en/latest/library/asyncio.html) - MicroPython - Reference for cooperative multitasking as an alternative to threads. Expands the chapter's coverage of doing several things at once.

10. [RP2040 Datasheet](https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf) - Raspberry Pi - The official datasheet detailing the dual cores and hardware timers. Authoritative background for the chapter's multi-core hardware.
