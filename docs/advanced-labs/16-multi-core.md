# Multi-Core Programming with MicroPython

The Raspberry Pi Pico and the Pico W both come with two "Cores". In this section we will review
why microcontrollers have multiple cores and how they are used.

## Introduction

Having multiple processor cores is critical when you need to do
multiple tasks simultaneously.  Having two cores means we can run two different parts of our program at the same time - just like having two brains working on different tasks! This tutorial will help you understand how to use both cores effectively.

## Why Use a Second Core?

Imagine you're trying to pat your head and rub your stomach at the same time. It's tricky because you're trying to do two different tasks simultaneously. This is similar to what your Pico faces when it needs to:

- Read sensor data while updating a display
- Control a motor while monitoring buttons
- Play music while running LED animations
- Process incoming data while sending responses

Using the second core lets you handle these tasks properly without one task slowing down the other.
Having a second core matches the job of physical computing.  One core is used
to gather data and one core is used to analyze the data and log or display the data.

## Real-World Example: Display Updates and Sensor Reading

Let's look at a common problem: updating an OLED display while reading from a sensor. If we do both on one core, we might miss important sensor readings while the display is updating.

Here's a practical example showing how to use both cores.  In this
example we are trying to gather sensor data on our Analog-to-digital (ADC) input and update our
OLED display at the same time.

```python
import machine
import _thread
from time import sleep
from ssd1306 import SSD1306_I2C
import framebuf

# Setup I2C and Display
i2c = machine.I2C(0, sda=machine.Pin(0), scl=machine.Pin(1))
display = SSD1306_I2C(128, 64, i2c)

# Setup sensor (example using ADC)
sensor = machine.ADC(26)

# Shared variables between cores
sensor_value = 0
lock = _thread.allocate_lock()

def update_display_task():
    """
    Second core task: Handles display updates
    This runs on core 1 and updates the display every 0.1 seconds
    """
    global sensor_value
    
    while True:
        # Get the latest sensor value safely
        with lock:
            current_value = sensor_value
            
        # Clear the display
        display.fill(0)
        
        # Draw the value
        display.text(f"Sensor:", 0, 0)
        display.text(f"Value: {current_value}", 0, 20)
        
        # Update display
        display.show()
        
        # Small delay to prevent display flicker
        sleep(0.1)

# Main program (runs on core 0)
def main():
    global sensor_value
    
    # Start the second core number 1
    _thread.start_new_thread(update_display_task, ())
    
    # Main loop for sensor reading
    while True:
        # Read sensor
        reading = sensor.read_u16()
        
        # Safely update the shared variable
        with lock:
            sensor_value = reading
        
        # Read sensor as fast as possible
        sleep(0.001)

# Start the program
main()
```

In the example above, the key line is the following:

```python
# Start the second core
_thread.start_new_thread(update_display_task, ())
```

By default, the main() function is always started on the main core number 0.
This line starts the new task on the second core - core number 1

Let me break this down in a clear step-by-step way.

The line `_thread.start_new_thread(update_display_task, ())` is like hitting a "start" button for a second brain in your Pico. Let's understand it piece by piece:

1.  `_thread` is a special MicroPython module that lets us work with multiple cores. The underscore at the start just means it's a more technical, behind-the-scenes module.
2.  `start_new_thread` is a function that does exactly what its name suggests - it starts running code on a new thread. On the Pico, this new thread automatically runs on Core 1 (while your main program runs on Core 0).
3.  `update_display_task` is the name of the function we want to run on the second core. Notice there are no parentheses after it - we're just telling the system which function to run, not actually running it yet.
4.  The empty parentheses `()` at the end are where you'd put any arguments that your function needs. In our case, `update_display_task` doesn't need any arguments, so we leave them empty.

## Core-to-Core Communication

Here's how the cores communicate in our example:

```python
# Shared variables between cores
sensor_value = 0  # This variable can be seen by both cores
lock = _thread.allocate_lock()  # This helps cores share data safely

def update_display_task():
    while True:
        # Core 1 safely reads the shared variable
        with lock:
            current_value = sensor_value
        
        # Core 1 updates the display with this value
        display.text(f"Value: {current_value}", 0, 20)

def main():  # This runs on Core 0
    while True:
        reading = sensor.read_u16()
        # Core 0 safely updates the shared variable
        with lock:
            sensor_value = reading
```

Think of it like two people (cores) sharing a notepad (sensor\_value):

-   Core 0 writes new sensor readings to the notepad
-   Core 1 reads from the notepad to update the display
-   The `lock` is like a "do not disturb" sign - when one core is using the notepad, the other core has to wait

We know it's running on the second core because:

1.  The main program runs on Core 0 by default
2.  When we call `_thread.start_new_thread()`, the Pico automatically runs that function on Core 1
3.  Both functions keep running continuously (the `while True` loops) - this would be impossible if they were running on the same core

## LED Blink Rates on Multiple Cores

How do we know that the functions are running on different cores?
Let's create a simple test program that clearly demonstrates both cores running independently.

This program proves the cores are running independently in several ways:

1. **Different Blink Rates**: 
   - Core 0's LED blinks fast (every 0.25 seconds)
   - Core 1's LED blinks slow (every 1 second)
   - If they were running on the same core, you couldn't have different timing like this

2. **Print Statements**: 
   - You'll see "Core 0 blink" printing four times for every one "Core 1 blink"
   - The prints will interleave, showing both cores are running simultaneously

3. **Visual Proof**:
   - Connect two LEDs (with appropriate resistors) to pins 14 and 15
   - You'll see them blinking at different rates independently
   - If this was running on a single core, the blink rates would interfere with each other

To try this out:
1. Connect an LED + resistor (220Ω) to GPIO 15 (Core 0 LED)
2. Connect another LED + resistor to GPIO 14 (Core 1 LED)
3. Run the program
4. Watch the LEDs blink at different rates
5. Look at the print output in your console

Here's a diagram showing how to wire it up:

```
Pico GPIO 15 ---> 220Ω resistor ---> LED ---> Ground
Pico GPIO 14 ---> 220Ω resistor ---> LED ---> Ground
```

You can also modify the sleep times to see how changing one core's timing doesn't affect the other core. 
Try changing `time.sleep(1)` to `time.sleep(0.5)` in the `blink_core1` function - you'll see that LED change speed while the other LED keeps its original timing.

```python
import machine
import _thread
import time

# Set up two LEDs - one for each core
led_core0 = machine.Pin(15, machine.Pin.OUT)  # First LED
led_core1 = machine.Pin(14, machine.Pin.OUT)  # Second LED

# Variable to help us stop the program
running = True

def blink_core1():
    """
    This function will run on Core 1
    It blinks LED 1 every 1 second
    """
    print("Core 1 is starting!")
    
    while running:
        led_core1.high()
        time.sleep(1)
        led_core1.low()
        time.sleep(1)
        print("Core 1 blink")

def main():
    """
    This function runs on Core 0
    It blinks LED 0 every 0.25 seconds
    """
    global running
    
    print("Core 0 is starting!")
    
    # Start Core 1
    _thread.start_new_thread(blink_core1, ())
    
    # Now do Core 0's work
    try:
        while running:
            led_core0.high()
            time.sleep(0.25)
            led_core0.low()
            time.sleep(0.25)
            print("Core 0 blink")
            
    except KeyboardInterrupt:
        # Clean up when program is stopped
        running = False
        led_core0.low()
        led_core1.low()
        print("Program stopped!")

# Start the program
print("Starting dual core LED blink test...")
main()
```

## Understanding IRQs and PIOs on Multiple Cores

### Interrupts (IRQs)
Interrupts are special signals that can pause your program to handle important events. When using two cores, each core can handle its own interrupts independently. This means:

1. Core 0 can handle button presses without affecting display updates on Core 1
2. Each core can respond to time-critical events without waiting for the other core
3. You can prioritize which interrupts go to which core

Here's an example showing how to handle interrupts on different cores:

```python
import machine
import _thread
from time import sleep

# Setup LED and button
led = machine.Pin(25, machine.Pin.OUT)
button = machine.Pin(15, machine.Pin.IN, machine.Pin.PULL_UP)

# Shared variables
button_presses = 0
lock = _thread.allocate_lock()

def button_handler(pin):
    """Interrupt handler for button press"""
    global button_presses
    with lock:
        button_presses += 1

def core1_task():
    """
    Second core task: LED blinking pattern
    This keeps running even when button interrupts occur
    """
    while True:
        led.toggle()
        sleep(0.5)

# Main program (runs on core 0)
def main():
    # Setup button interrupt
    button.irq(trigger=machine.Pin.IRQ_FALLING, handler=button_handler)
    
    # Start LED control on second core
    _thread.start_new_thread(core1_task, ())
    
    # Main loop to display button presses
    while True:
        with lock:
            current_presses = button_presses
        print(f"Button has been pressed {current_presses} times")
        sleep(1)

# Start the program
main()
```

### PIO (Programmable Input/Output)

The Pico has special hardware called PIO (Programmable Input/Output) that can handle tasks like generating precise signals or reading sensor data. The great thing about PIO is that it works independently of both cores. This means:

1. You can set up a PIO program to handle precise timing tasks
2. Both cores can interact with the PIO programs
3. PIO can keep running even if both cores are busy

Here's a simple example using PIO with two cores:

```python
from machine import Pin
import rp2
import _thread
from time import sleep

# Define a PIO program to generate a square wave
@rp2.asm_pio(set_init=rp2.PIO.OUT_LOW)
def square_wave():
    wrap_target()
    set(pins, 1)
    nop() [31]  # Delay for 32 cycles
    set(pins, 0)
    nop() [31]  # Delay for 32 cycles
    wrap()

# Setup the state machine with the PIO program
sm = rp2.StateMachine(0, square_wave, freq=2000, set_base=Pin(16))

def core1_task():
    """
    Second core task: Monitors the square wave
    """
    # Setup an input pin to monitor the square wave
    monitor = Pin(17, Pin.IN)
    
    while True:
        # Count transitions for 1 second
        transitions = 0
        start = time.ticks_ms()
        last_value = monitor.value()
        
        while time.ticks_diff(time.ticks_ms(), start) < 1000:
            current_value = monitor.value()
            if current_value != last_value:
                transitions += 1
            last_value = current_value
            
        print(f"Frequency: {transitions/2} Hz")

# Main program (runs on core 0)
def main():
    # Start the PIO state machine
    sm.active(1)
    
    # Start monitoring on second core
    _thread.start_new_thread(core1_task, ())
    
    # Main core can do other tasks
    while True:
        print("Main core is free to do other work!")
        sleep(1)

# Start the program
main()
```

## Tips for Using Two Cores Effectively

1. **Use Locks for Shared Data**: Always use locks when both cores need to access the same variable
2. **Keep Tasks Independent**: Try to split your program so each core has separate responsibilities
3. **Avoid Printing from Both Cores**: The USB serial connection works best when only one core prints
4. **Mind Your Resources**: Remember both cores share the same memory and pins
5. **Start Simple**: Begin with basic two-core programs before trying complex applications

## Common Issues and Solutions

1. **Program Crashes**: Usually happens when both cores try to access the same resource. Use locks to prevent this.
2. **One Core Stops**: Check if your while loops have proper sleep() calls to prevent core lockups.
3. **Data Gets Mixed Up**: Always use locks when sharing data between cores.

## Conclusion

Using both cores of your Raspberry Pi Pico can make your projects much more capable. You can handle multiple tasks simultaneously without one task interfering with another. Remember to start simple and gradually build up to more complex applications as you get comfortable with dual-core programming.

Remember that practice makes perfect - try modifying the example programs to handle different tasks on each core and experiment with different ways of sharing data between them!

Would you like me to explain any part of this tutorial in more detail?

## References
[Circuit Digest](https://circuitdigest.com/microcontroller-projects/dual-core-programming-on-raspberry-pi-pico-using-micropython)