# Instructor's Guide

Here are some key computational thinking concepts that we want to each
and examples of how they are used in our MicroPython programming:

### Abstraction

A cognitive process of reducing complexity by focusing on the essential features of a concept, system, or problem while omitting unnecessary details.

**Example:** In our example programs we hide the unnecessary details of the specific hardware
configuration of a project by putting all the hardware pin numbers in a config.py file.

### Algorithms

A step-by-step procedure or set of rules for solving a problem or accomplishing a task. 

In MicroPython, this includes both software algorithms and the logic for controlling hardware components.

### Decomposition

The process of breaking down complex problems into smaller, more manageable parts that can be solved independently. 

In MicroPython, this could involve separating hardware initialization, sensor reading, and display updating into distinct functions or modules.

### Pattern Recognition

The ability to identify similarities, differences, and patterns in problems or data. This is particularly important in MicroPython when dealing with sensor data patterns or implementing repeated behaviors in physical computing projects.


### Iteration

The process of repeating a set of instructions until a specific condition is met. Essential for MicroPython programs that need to continuously monitor sensors or update displays in a loop.

Our [NeoPixel labs](../basics/05-neopixel.md) are an excellent way to teach iteration.

### State Machines

A programming model where a system can be in one of several "states," with rules governing transitions between states. Particularly useful in MicroPython for managing device behavior and user interactions.

Many of our projects use a "mode" variable that contains the state of the program.  The mode
can be changed to change a pattern or function being used.

### Event-Driven Programming

A programming paradigm where program flow is determined by events (sensor readings, button presses, timer completions). This is fundamental to many MicroPython applications.

Our [Button Pressed](../basics/03-button.md) examples are excellent examples of event-driven programming.

### Debugging Strategies

Systematic approaches to finding and fixing errors in both software and hardware configurations, including using print statements, LED indicators, and serial monitoring.

### Variables and Memory Management

Understanding how to effectively use and manage limited memory resources on microcontrollers, including proper variable scope and garbage collection considerations.

### Real-Time Systems

Understanding how to work with time-critical operations and ensure reliable timing in physical computing applications.

### Data Flow

The movement of data through a system, including input processing, data transformation, and output generation. Essential for understanding how sensor data moves through a MicroPython system and are consolidated to create useful displays.

Our [Display of Time-Flight Sensor]()

## Summary

Although students will not be using MicroPython for their entire career, the computational thinking foundations students learning in the MicroPython class will be useful for many other areas. Each of these concepts is particularly relevant to physical computing and would help students better understand how to approach problem-solving in their projects.