# Introduction to MicroPython

This lesson assumes that you have at least skimmed the [Getting Started](../chapters/03-micropython-environment/index.md) sections and have selected one of the MicroPython IDEs to write your code.

The lesson will introduce you to the basic concepts of using MicroPython using the $4 Raspberry Pi Pico or a similar microcontroller.

The first two examples just use the Raspberry Pi Pico and don't require a breadboard or wiring.  All the subsequent examples will require you to place components on a solderless breadboard.

## Basic Examples

1. [Blink the Onboard LED](01-blink.md) — Make the green LED on the Pico blink on and off every half second using just a USB cable and no extra parts.
2. [Internal Temperature Sensor](02-internal-temperature.md) — Read the Pico's built-in temperature sensor and print Celsius and Fahrenheit values to the console.
3. [Button](03-button.md) — Wire a momentary push button to the Pico and use it to toggle the built-in LED on and off.
4. [Potentiometer](03-potentiometer.md) — Turn a knob to control the blink speed of an LED, introducing analog-to-digital conversion.
5. [Fade In and Out](04-fade-in-and-out.md) — Use Pulse Width Modulation (PWM) to smoothly dim an LED to any brightness level.
6. [Motor](04-motor.md) — Drive a small DC motor using a transistor or motor driver chip to handle the extra current a motor needs.
7. [Servo](04-servo.md) — Control a servo motor with PWM signals to move it to a precise angle and hold it there.
8. [NeoPixels](05-neopixel.md) — Program colorful RGB NeoPixel LEDs using MicroPython's built-in NeoPixel library.
9. [Wireless](06-wireless.md) — Connect a Raspberry Pi Pico W to a WiFi network and explore basic wireless communication.
10. [Configuration File](10.config.md) — Store pin numbers in a single config file so all your example programs work without editing each one separately.