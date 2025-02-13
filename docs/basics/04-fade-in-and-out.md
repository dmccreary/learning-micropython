# Fade an LED in and Out 

In the prior Blink lab, we turned an LED on an off at different speeds.
But what if we want to slowly turn on our LED on and off?  
In this lab we will show you how to dim your LED to any brightness level you want.

## Using Pulse Width Modulation (PWM)

![PWM Duty Cycle](../img/PWM-duty-cycle.png)

Although digital computers are good at quickly turning signals on and off, they don't really allow us to easily set an output to a given voltage level without complex circuits.  But there is an easier way to adjust the brightness of an LED!  We can quickly turn the signal to the LED on and off.  We can do this so quickly that you can't even see it flicker.  Controlling the amount of time a signal is on is all about controlling the width of the ON pulse.  That is why this is called Pulse Width Modulation or PWM for short.

With a PWM design there are two things we need to tell the microcontroller:

1. How often do you want a square wave to go on and off?
2. How wide should the on part of the pulse be (relative to the total width).  This is called the duty cycle.

The rate of change of the pulse is call the frequency.  You can set the frequency to be 1,000 changes per second (1K), which is much faster than the human eye can detect.  This is done using the following line:

```py
pwm.freq(1000)
```


Note that we can slow the frequency way down and the dimming effect will still work.  As an experiment you can change the PWM frequency to around 20 and you will see a distinct flicker as the LED turns on.

Using a 1K frequency is a good practice when you are using LEDs.  If you use a very low frequency of around 20 chances per second the human eye will start to see flicker.  Keeping the frequency well above 20 is a good idea
and using frequency higher that 1K will not help and can cause additional noise in your system.


Here is the sample program that will slowly dim the builtin LED that is on pin 25:

```python
from machine import Pin, PWM
from time import sleep

pwm = PWM(Pin(25))

# use a 1K frequency to avoid flicker
pwm.freq(1000)

while True:
    for duty in range(65025):
        pwm.duty_u16(duty)
        sleep(0.0001)
	for duty in range(65025, 0, -1):
		pwm.duty_u16(duty)
		sleep(0.0001)
```

Note that the duty cycle starts at 0 (always off) and moves slowly up to 65,025 (always on).  It then does the reverse and slowly dims the LED and then repeats.  There is only a 1/10,000 of a delay between these changes so the LED will completely turn on in about six seconds before it starts to dim again.

## PWM Functions

Here is a list of the PWM functions.

```python
from machine import Pin, PWM

pwm0 = PWM(Pin(0))      # create PWM object from a pin
pwm0.freq()             # get current frequency
pwm0.freq(1000)         # set frequency (1000 cycles per minute)
pwm0.duty_u16()         # get current duty cycle, range 0-65535
pwm0.duty_u16(200)      # set duty cycle, range 0-65535
pwm0.deinit()           # turn off PWM on the pin
```

## PWM Cleanup

If you are using PWM to control sound and motors, make sure you ```deinit()``` to de-initialize the PWM controller after you are done.  You may have to trap the stop to do this.  For example if a PWM is driving motors, your Stop must send ```deinit()``` to each motor controller.  See the [Interrupt Handlers](../advanced-labs/02-interrupt-handlers.md) for details.

```python
from machine import Pin, PWM

PWM_PIN = 15

# Create PWM instance
my_pwm = PWM(Pin(PWM_PIN))  # Example using GPIO 15

def main():
    # main code loop here

# This allows us to stop the sound by doing a Stop or Control-C which is a keyboard intrrup
try:
    main()
except KeyboardInterrupt:
    print('Got ctrl-c')
finally:
    # Cleanup PWM
    print('turning off sound')
    my_pwm.duty_u16(0)
    my_pwm.deinit()
```

## Full PWM Example with Init and Cleanup

If you have many PWM objects then you can centralize all the hardware
initialization and cleanup functions so they are created and shut
down in a consistent way.

```python
from machine import Pin, PWM

# Constants
PWM_PIN = 15

# Global PWM objects (since we need to access in cleanup)
pwm_objects = []

def init_hardware():
    """Initialize hardware and store PWM objects for cleanup"""
    pwm = PWM(Pin(PWM_PIN))
    pwm_objects.append(pwm)
    return pwm

def cleanup():
    """Cleanup function to ensure all PWM objects are properly shut down"""
    print('Cleaning up hardware...')
    for pwm in pwm_objects:
        pwm.duty_u16(0)
        pwm.deinit()
    print('Cleanup complete')

def main():
    """Main program loop"""
    # Initialize hardware
    my_pwm = init_hardware()
    
    try:
        while True:
            # Main code loop here
            pass
            
    except Exception as e:
        print(f'Program error: {e}')
        raise  # Re-raise the exception after printing

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('\nGot ctrl-c')
    finally:
        cleanup()
```


## Suggested Exercises

1. Change the frequency from 1,000 to 500, 100, 50, 40, 30, 25, 20, and 10.  When can you just barley see it flicker?  What does this tell you about the human eye?
2. Can you add a delay so that the LED stays on at full brightness for one second before it starts to dim again?
3. Can you add a delay so that the LED is completely off for five seconds and then goes to full brightness and off in one second?
4. What lights in your home would you like to see slowly dim on and off?  How could you modify a light (safely) so that it slowly dimmed on and off.  Would PWM work with all lightbulb types such as tungsten filament bulbs that take a long time to heat up and cool down?
5. Can you hook up a set of red, green and blue LEDs program them to fade in and out to display all the colors of the rainbow (red, orange, yellow, green, blue, indigo and violet)?
6. When you stop the program does the LED stop changing brightness?  Does it retain the value that it had when you pressed the Stop function?  What does that tell you about how main CPU and the role of PWM?  Note that we will cover up doing "cleanup" events that stop all PWM activity in our [Interrupt Handlers Lab](../advanced-labs/02-interrupt-handlers.md)

## References

### Pulse With Modulation

1. [Wikipedia Article on Pulse With Modulation](https://en.wikipedia.org/wiki/Pulse-width_modulation)