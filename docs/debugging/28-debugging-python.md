# Getting Information about Your Builtin Libraries

The official documentation on the MicroPython libraries is located
here:

[https://docs.micropython.org/en/latest/](https://docs.micropython.org/en/latest/)

This documentation is very good and it should be your first place to check
the libraries you need that are builtin to the MicroPython runtime.

However, sometimes you might need to verify that the version that you
are using has the correct models and functions.

## Listing the Building MicroPython Modules

Here is the function you can put into the console to list the current modules
in your MicroPython runtime:

```py
help('modules')
```

Result:

```txt
__main__          gc                uasyncio/funcs    uos
_boot             machine           uasyncio/lock     urandom
_onewire          math              uasyncio/stream   ure
_rp2              micropython       ubinascii         uselect
_thread           onewire           ucollections      ustruct
_uasyncio         rp2               uctypes           usys
builtins          uasyncio/__init__ uhashlib          utime
ds18x20           uasyncio/core     uio               uzlib
framebuf          uasyncio/event    ujson
Plus any modules on the filesystem
```

## Listing Instance Variables and Methods

```python
# For any built-in module, first import it
import machine

# Then use dir() to list all attributes
print(dir(machine))
```

```python
# First import the Pin class from machine
from machine import Pin

# We can look at the Pin class itself
print("Pin class attributes and methods:")
print(dir(Pin))

# We can also look at a specific pin instance
led = Pin(25, Pin.OUT)  # Example using Pico's onboard LED pin
print("\nPin instance attributes and methods:")
print(dir(led))
```

Sample Response:

```python
# Pin class attributes and methods:
['IN', 'IRQ_FALLING', 'IRQ_RISING', 'OPEN_DRAIN', 'OUT', 'PULL_DOWN', 'PULL_UP', '__class__', '__name__', 'init', 'value']

# Pin instance attributes and methods:
['__class__', 'init', 'irq', 'off', 'on', 'toggle', 'value']
```

The output shows:

Class-level attributes like IN, OUT, PULL_UP, etc. which are used for pin configuration
Instance methods like value(), on(), off(), toggle() that you can use to control the pin
Special attributes like __class__ which are part of Python's object system

This is particularly useful when you're working with different MicroPython boards or versions, as it helps you discover what functionality is available on your specific platform.

## Micropython Issues

If you have questions, one of the best places to go is to the 
MicroPython Discussion area:

[MicroPython Discussion](https://github.com/orgs/micropython/discussions)

I strongly suggest posting questions here before you create an issue on the issue log.

If you have a question that is specific to the Raspberry Pi Pico you can
get the RP2 documentation here:

[https://docs.micropython.org/en/latest/rp2/quickref.html](https://docs.micropython.org/en/latest/rp2/quickref.html)