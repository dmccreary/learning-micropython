# References: Digital Input, Output, and Interrupts

1. [General-purpose input/output](https://en.wikipedia.org/wiki/General-purpose_input/output) - Wikipedia - Explains GPIO pins and how software reads and writes them. Directly supports this chapter's LED-output and button-input work.

2. [Interrupt](https://en.wikipedia.org/wiki/Interrupt) - Wikipedia - Describes how hardware signals pause normal code to handle urgent events. Background for the chapter's interrupt and ISR section.

3. [Pull-up resistor](https://en.wikipedia.org/wiki/Pull-up_resistor) - Wikipedia - Covers pull-up and pull-down resistors that keep a floating input at a known level. Reinforces the chapter's button-wiring and debouncing topics.

4. Get Started with MicroPython on Raspberry Pi Pico - Gareth Halfacree & Ben Everard - Raspberry Pi Press - The official book's I/O chapters cover blinking LEDs and reading buttons with the exact `machine.Pin` patterns used here.

5. Programming the Raspberry Pi Pico/W in MicroPython - Harry Fairhead & Mike James - I/O Press - A deeper treatment of GPIO, pull resistors, and interrupts that extends the concepts introduced in this chapter.

6. [machine.Pin](https://docs.micropython.org/en/latest/library/machine.Pin.html) - MicroPython - Official reference for configuring pins as input or output, setting pull resistors, and attaching interrupts. The authoritative companion to this chapter's code.

7. [Pull-up Resistors](https://learn.sparkfun.com/tutorials/pull-up-resistors) - SparkFun - A clear tutorial on why floating inputs are a problem and how pull resistors fix them. Reinforces the chapter's button-input wiring.

8. [Writing Interrupt Handlers](https://docs.micropython.org/en/latest/reference/isr_rules.html) - MicroPython - Official rules for writing safe, short interrupt service routines. Essential reading for the chapter's interrupt examples.

9. [Raspberry Pi Pico External Interrupts](https://randomnerdtutorials.com/raspberry-pi-pico-external-interrupts-micropython/) - Random Nerd Tutorials - A hands-on Pico interrupt tutorial with wiring and MicroPython code. Great practice for the chapter's IRQ section.

10. [Interrupts](https://www.geeksforgeeks.org/interrupts/) - GeeksforGeeks - Explains interrupt types and how processors service them. Provides additional background for the chapter's interrupt-driven input.
