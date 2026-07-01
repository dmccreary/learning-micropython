# MicroPython Project Kits

In this intelligent textbook, we define a "project kit" as a physical box that contains a set of electronic parts
that can be assembled together to make a fun project that teaches MicroPython and computational thinking.
Kits usually contain a microcontroller (that runs MicroPython), a breadboard, sensors and a display.
The kits usually have a solderless breadboard that allows various components to be placed on breadboard
without soldering. This allows the kit to use interchangeable sensors and displays.

## Target Audience

These kits are designed for students that are roughly in the age range of 10-16 that are interested
in learning more about how computers work.  Some of the kits like the [Red-Green-Blue
Box](./#red-green-blue-box) with three potentiometers can be used, with adult supervision, by kids as
young as five years old.  Some kits such as the Spectrum Analyzer kit are often used by
college students studying signal processing.

## Ready to Run Kits

Most project kits come with a numbered list of pre-loaded sample programs that can run one at a time
in increasing order of complexity.  The first program often just blinks the onboard LED and the
advanced programs often take advantage of many components in the kit.  Kits usually
are preloaded with many sample programs.
They have a default main.py program that is run when the microcontroller is first powered on.
The main.py demonstrates the features of the project kit and allows students to use
buttons to step through modes.  Look for a file called 'upload-code.sh' in the kit
source directory to reload all sample programs.

## Demonstration Kits

Many kits are custom designed to get students quickly engaged in learning STEM.
To do this we feel that hands-on project kit boxes are essential to give
potential students a quick exposure to the capabilities of these kits.
With this in mind, many of the kits are designed to be placed on
a desktop at STEM events and the students are invited to pick up a project
kit box and experiment with it.

Demonstration kits have some of the following characteristics:

1. The boxes are designed to set on a table at a STEM event
2. The boxes are in a clear plastic (polycarbonate) container with buttons on the side of the box.  Clear boxes are critical so that event participants can see the microcontroller on the breadboard and the sensor.
3. The boxes have their own internal power - usually a 3 AA battery pack.  Some boxes with motors or servos need 5V so they use a USB power bank.
4. The boxes have a toggle power switch on the right side with toggle switch guards so the switches do not get accidentally bumped in transport in a large plastic bin
5. The AA battery packs should have a month an date that the batteries were put in.  Batteries should be replaced every three years to avoid leakage.
6. On the bottom of the project kit can contain a description of the box and a QR code to see the project kit online documentation.


!!! note
    The toggle switch guards (also called anti-bump guards) are key for large events. They small vertical walls/brackets mounted around a toggle switch's actuator to prevent accidental flipping when the switch is bumped or jostled, like in a storage bin. In panel-mount/aviation contexts they're sometimes called switch roll bars.
    They are critical to make sure you don't arrive at an event with the batteries all drained.

## Kit Documentation Strategy

Our goal is to create low-cost affordable kits that have high utility.  
Kits sometimes have their own textbook and sometimes have a subsection
of an existing textbook.  Many kits also have "virtual simulations" (MicroSim)
that show you what the kit will do.  For example an kit with
an addressable LED strip has a MicroSims that show how the LED
patterns should look on the kit.

Most projects that end with the word "Box" come in a clear plastic box with
a power switch.  They can be easily picked up and the power switch turned on.
A power switch guard prevents accidental turning on when they are stored
in a large plastic bin.

Look for the path `{$BOOK}/docs/kits/{$KIT_NAME}` to find the documentation
for each kit.  Note that the code to upload into the kit is
stored in a separate source code directory at `{$BOOK}/src/kits/{$KIT_NAME}`.

## Kit Source Code

All the source code for kits are stored in `{$BOOK}/src/kits/{$KIT_NAME}` on
the GitHub repository for each textbook.  The source code directory
contains numbered sample programs to run as well as three important files:

1. config.py - hardware configuration
2. upload-code.sh - sample shell script (or PowerShell Script) to upload all source code into the microcontroller
3. main.py - the main program that is run at startup

The numbered programs often begin with a very simple test program to verify that
your programming tool such as `Thonny` is configured correctly.

## List of Kits

### Summary Table

|Kit Name            |Approximate Part Cost|Description|
|--------------------|----------------|-------------------------|
|Moving Rainbow      |$20|Learn to display patterns on an LED Strip|
|Red-Green-Blue Box  |$25|Adjust three potentiometers to control the red, green and blue colors on an LED strip|
|Rotary Spinner Box  |$25|Spin a rotary dial to change a pattern on an LED strip|
|Tone Generator Box  |$25|Turn a potentiometer and change the frequency of a tone|
|Distance Sensor Box |$25|A distance sensor that shows the distance from the box to your hand|
|STEM Robot (Base)   |$30|Collision avoidance robot|
|STEM Robot (Display)|$50|Collision avoidance robot with OLED display|
|Wireless STEM Robot |TBD|Collision avoidance robot with WiFi and Bluetooth|
|Basic Clock         |$29|Basic clock with no wireless|
|Smart Clock         |$30|Smart clock that connects to the internet|
|Smart Watch         |$20|Round color smart watch display|
|Spectrum Analyzer   |$35|Microphone with spectrum on a display|

### Moving Rainbow

The Moving Rainbow is one of the lowest-cost kits,  It contains:

1. A Raspberry Pi Pico
2. A 1/2 size breadboard
3. A 30-pixel LED strip
4. Two buttons
5. Hookup wire
6. USB cable

Some moving rainbow kits include a 3-terminal screw header for quickly swapping out the LED strip.
These kits can then connect to shorter or longer LED strips or NeoPixel Rings.

Some of the Moving Rainbow kits use a flexible LED strip designed for easy transport in a students backpack.
Some Moving Rainbow kits use a rigid backing for the LED strip so they sit on a desktop without curling.

The Moving Rainbow Kits have their own [intelligent textbook](https://dmccreary.github.io/moving-rainbow/)
that is separate from this Learning MicroPython textbook.

### Red Green Blue Box

This project box has three potentiometers that allow the user to change the color of the LED strip by adjusting the red, green and blue values.
The potentiometers are connected to the three analog to digital converters (ADC) on a Raspberry Pi Pico.

### Rotary Spinner Box

This project box adds a rotary encoder to a LED strip or LED ring.  Students can "Spin" the rotary encoder knob to change
a pattern.  This project also uses one button to move to the next pattern mode and one button to reverse the mode.
Because this is a handheld box used for demonstrations it comes with a 4-AA battery pack.

[Rotary Spinner Box](https://dmccreary.github.io/moving-rainbow/kits/rotary-spinner-box/)

### Tone Generator Box

This project box allows the user to turn a potentiometer to change the frequency of a tone using pulse-width modulation (PWM).
A seven-segment display shows the frequency and small piezo electric speaker plays the tone.
Because this is a handheld box used for demonstrations it comes with a 4-AA battery pack.

[Tone Generator](./tone-generator/index.md)

### Distance Sensor Box

This box has a distance sensor such as time-of-flight sensor or ultrasonic "ping" sensor that shows the distance of the
box from your hand or another object.  As you move your hand back and forth the display changes.  The display
can be a low-cost LED strip or an OLED display that has a history chart of the distance.

This kit is an important kit to demonstrate before the students get exposed to the Collision Avoidance STEM Robot.

### STEM Robot (Base)

This project kit is a collision avoidance robot built around a two wheel drive Smart Car Chassis and a Cytron Maker Pi motor controller board.

### STEM Robot (Display)

This project kit adds a 2.42" OLED display to each robot.

### Wireless STEM Robot

This project kit uses a Cytron motor controller board that adds WiFi and Bluetooth to a robot.  It is ideal for students that want to control
their robot from a web page or cell phone.  It also enables robots to communicate with each other and can be configured as a swarm of robots.

### Basic Clock
Simple clock with a real-time clock (RTC) chip to keep accurate time and an OLED display.  There are many variations.
The Basic Clock has its own textbook with many variations.

### Smart Clock

Clock with a wireless option to connect to the internet to get accurate time and weather as well as birthday reminders.

### Smart Watch

Smart watch kit using a circular color watch display.

### Spectrum Analyzer

Microphone that takes sound and displays the frequency spectrum of the sound using signal processing.

