# Button Callback Regular Expression

When a IRQ is called for a button press, we are passed
an event that tell us what pin gets called.  Unfortunately, 
MicroPython does not provide a method to just get
the integer of the pin, which we need of all our
buttons use a single IRQ function but need to do
different tasks based on which button is being used.

The pin number is buried within the GPIO string like this:


```
Pin(GPIO15, mode=IN, pull=PULL_UP)
```

We need to have a function that we can pass this string and it
will just return the integer of the GPIO.  It
does this using the regular expression (re) function within MicroPython.

```python
import re

def extract_gpio_pin(input_string):
    # Use a regular expression to find the GPIO number
    match = re.search(r"GPIO(\d+)", input_string)
    if match:
        # Convert the extracted number to an integer to remove leading zeros
        return int(match.group(1))
    else:
        # Return None if no match is found (or raise an exception if that's preferable)
        return None
```

```python
# Test the function with examples including if the returned values have leading zero
print(extract_gpio_pin("Pin(GPIO15, mode=IN, pull=PULL_UP)"))  # Output: 15
print(extract_gpio_pin("Pin(GPIO7, mode=IN, pull=PULL_UP)"))   # Output: 7
print(extract_gpio_pin("Pin(GPIO03, mode=IN, pull=PULL_UP)"))  # Output: 3
```

Here is the regular expression line

```python
match = re.search(r"GPIO(\d+)", input_string)
```

This function will look into the input_string for the letters "GPIO" followed by
a decimal digit.  It will then return that decimal digit as a string to the match variable.

It uses a regular expression pattern `r"GPIO(\d+)"` to find and extract the GPIO number:
-   `GPIO` matches the literal characters "GPIO"
-   `(\d+)` is a capturing group that matches one or more digits:
-   `\d` matches any digit (0-9)
-   `+` means "one or more times"
-   The parentheses `()` create a capturing group so we can extract just the number

The `re.search()` function looks for this pattern anywhere in the input string and returns a **match object** if found
a match.

If a match is found (`if match`):
-   `match.group(1)` gets the text from the first capturing group (the digits)
-   `int()` converts the string of digits to an integer
-   This automatically removes any leading zeros (so "03" becomes 3)

If no match is found, it returns None.
