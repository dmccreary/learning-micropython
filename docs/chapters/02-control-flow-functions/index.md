---
title: Collections, Control Flow, Functions, and Error Handling
description: Python lists, dictionaries, tuples, if-else statements, for and while loops, functions, modules, and try-except blocks for MicroPython beginners.
generated_by: claude skill chapter-content-generator
date: 2026-06-12 21:50:00
version: 0.09
---

# Collections, Control Flow, Functions, and Error Handling

## Summary

Building on the variables and data types from Chapter 1, this chapter introduces Python's collection types (lists, dictionaries, and tuples) and the control flow tools that make programs truly powerful: conditionals, loops, and functions. You will learn how to repeat actions with for and while loops, make decisions with if-else statements, organize code into reusable functions, import modules, and catch errors gracefully with try-except blocks. These skills are used in every MicroPython program you will write throughout the rest of the course.

## Concepts Covered

This chapter covers the following 15 concepts from the learning graph:

1. List
2. Dictionary
3. Tuple
4. Conditional Statement
5. If-Else Statement
6. For Loop
7. While Loop
8. Function Definition
9. Function Call
10. Return Value
11. Module Import
12. Input Validation
13. Error and Exception
14. Try-Except Block
15. Logical Operators

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Python Basics — Programs, Variables, Data Types, and Operators](../01-python-basics/index.md)

---

!!! mascot-welcome "Welcome to Chapter 2"
    ![Monty waves hello](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Great work finishing Chapter 1, coder! Now you know variables and data types. In this chapter you will learn to *collect* data, *make decisions*, *repeat actions*, and *organize code into functions*. These four skills are the engine of every MicroPython project you will build. Let's build something amazing!

## Storing Multiple Values with Collections

In Chapter 1, each variable held exactly one value. Sometimes you need to store many values together — like a list of LED brightness levels, or a table of note names and their frequencies. Python gives you three built-in **collection types** for this.

### Lists

A **list** is an ordered collection of values. You create a list by placing values inside square brackets `[]`, separated by commas. Lists can hold any data type, and you can change them after you create them.

```python
notes = ["C", "D", "E", "F", "G"]   # a list of five string values
delays = [100, 200, 300, 400]        # a list of four integers (milliseconds)
```

You access individual items using an **index** — a number that counts from zero:

```python
print(notes[0])   # prints: C  (first item, index 0)
print(notes[2])   # prints: E  (third item, index 2)
print(notes[-1])  # prints: G  (last item, index -1 means last)
```

You can add items with `.append()` and find the length with `len()`:

```python
notes.append("A")      # adds "A" to the end
print(len(notes))      # prints: 6
```

### Dictionaries

A **dictionary** maps **keys** to **values** — like a real dictionary that maps words to definitions. You create a dictionary with curly braces `{}`.

```python
# Map note names to their frequencies in Hz
note_freq = {
    "C4": 261,
    "D4": 294,
    "E4": 330
}

print(note_freq["C4"])   # prints: 261
note_freq["A4"] = 440    # add a new entry any time
```

### Tuples

A **tuple** is like a list, but you cannot change it after you create it. Use parentheses `()`. Use a tuple for values that should never change — for example, the pin numbers of your I2C bus.

```python
i2c_pins = (0, 1)        # SDA = pin 0, SCL = pin 1 — never changes
rgb_red  = (255, 0, 0)   # the RGB color red — a fixed constant
```

The following table summarizes the three collection types:

| Type | Brackets | Changeable? | Best used for |
|------|----------|-------------|---------------|
| List | `[ ]` | Yes | Growing collections: readings, queues |
| Dictionary | `{ }` | Yes | Lookups: name → value mappings |
| Tuple | `( )` | No | Fixed groups: pin pairs, RGB constants |

## Making Decisions with Conditional Statements

A **conditional statement** lets your program choose between two paths. Python checks a condition that evaluates to `True` or `False`, then runs only the matching block.

The **if-else statement** is the most common form:

```python
temperature = 35

if temperature > 30:             # is temperature greater than 30?
    print("It is hot outside!")  # runs only when True
else:
    print("Nice weather today.") # runs only when False
```

You can chain multiple conditions with `elif`:

```python
reading = 512   # ADC value from a light sensor (0–65535)

if reading < 10000:
    print("Very dark")
elif reading < 30000:
    print("Dim")
elif reading < 50000:
    print("Bright")
else:
    print("Very bright")
```

### Logical Operators

**Logical operators** combine two or more conditions. There are three: `and`, `or`, and `not`.

- `and` — both conditions must be True
- `or` — at least one condition must be True
- `not` — flips True to False, and False to True

```python
temp  = 28
humid = 85

if temp > 25 and humid > 80:
    print("Hot and humid — water your plants!")

is_connected = False
if not is_connected:
    print("No Wi-Fi — reconnecting...")
```

!!! mascot-thinking "Key Idea: Colons and Indentation Define Blocks"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Every `if`, `elif`, and `else` line ends with a colon `:`. The indented lines below it are the *block* that runs when that branch is chosen. When indentation returns to the original level, you are back to code that always runs.

#### Diagram: Interactive Conditional Flowchart

<iframe src="../../sims/conditional-flowchart/main.html" width="100%" height="440px" scrolling="no"></iframe>

<details markdown="1">
<summary>Interactive Conditional Flowchart MicroSim</summary>
Type: microsim
**sim-id:** conditional-flowchart<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Understand (L2)
Bloom Verb: explain
Learning Objective: Students can trace the execution path of an if-elif-else chain for a given input value.

Canvas layout:
- Left 65%: flowchart with four decision diamonds and four output rectangles
- Right 35%: slider for the input value and a result display

Visual elements:
- Diamonds: "reading < 10000?", "reading < 30000?", "reading < 50000?"
- Rectangle outputs: "Very dark", "Dim", "Bright", "Very bright"
- Active path highlighted in green; inactive paths in gray

Interactive controls:
- Slider: "Sensor reading" (0–65535, default 512). As the slider moves, the active path animates.
- Hover any diamond for a tooltip showing the Python condition and its True/False result.

Data Visibility Requirements:
- Show current value, condition checked, result (True/False), and which output fires.

Instructional Rationale: Live slider lets students see routing through an if-elif-else chain as a directed path rather than a code listing, making control flow concrete.

Implementation: p5.js. Diamonds/rectangles drawn with quad/rect; active path redrawn on slider change; createSlider() for input.
</details>

## Repeating Actions with Loops

A **loop** runs a block of code multiple times.

### For Loops

A **for loop** repeats once for each item in a collection. Think of it as: "for every item on the list, do this."

```python
notes = ["C", "D", "E", "F", "G"]

for note in notes:           # note takes each value in turn
    print("Playing:", note)  # runs 5 times, once per note
```

You can also loop over a range of numbers:

```python
for i in range(5):           # i = 0, 1, 2, 3, 4
    print("Step:", i)

for i in range(1, 11):       # 1 through 10
    print(i)
```

### While Loops

A **while loop** keeps running as long as a condition is True. Use it when you do not know in advance how many times to loop.

```python
count = 0

while count < 5:             # repeat while count is less than 5
    print("Count:", count)
    count += 1               # MUST change count — or the loop runs forever!
```

!!! mascot-warning "Infinite Loops!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A while loop whose condition never becomes False runs forever and freezes your Pico. Always change the loop variable inside the loop. If your Pico freezes, hold the `BOOTSEL` button while plugging in USB to recover.

## Organizing Code with Functions

A **function** is a named block of code that you can run whenever you need it. Write it once; call it many times. Think of a function as a recipe card — you write the recipe once, then follow it whenever you want that dish.

A **function definition** uses `def`, then the name, then parentheses, then a colon:

```python
def blink_led():             # define a function called blink_led
    print("LED on")          # indented code is the function body
    print("LED off")
```

A **function call** runs the function:

```python
blink_led()                  # runs the body once
blink_led()                  # runs it again
```

### Parameters and Return Values

Functions become more powerful with **parameters** (inputs) and a **return value** (output).

```python
def celsius_to_fahrenheit(celsius):   # celsius is the parameter
    fahrenheit = celsius * 9 / 5 + 32
    return fahrenheit                 # return sends the result back

temp_c = 23.5
temp_f = celsius_to_fahrenheit(temp_c)   # store the return value
print(temp_f)                            # prints: 74.3
```

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Name your functions clearly. `celsius_to_fahrenheit` is perfect — you know exactly what it does. `do_stuff` or `func1` tells you nothing. Good names let you read code like a sentence.

## Importing Modules

A **module** is a file of ready-made functions. Instead of writing everything yourself, you **import** a module and use what is inside.

```python
import utime           # import the MicroPython time module

utime.sleep(1)         # pause for 1 second
utime.sleep_ms(500)    # pause for 500 milliseconds
```

You can import just the parts you need:

```python
from utime import sleep_ms   # import only sleep_ms

sleep_ms(250)                # call it without the module prefix
```

The `machine` module gives you access to the Pico's hardware:

```python
from machine import Pin      # import the Pin class

led = Pin(25, Pin.OUT)       # create a Pin object for the onboard LED
led.value(1)                 # turn the LED on
```

## Input Validation and Error Handling

Real programs receive input from sensors or users. That input is not always correct. **Input validation** means checking a value before you use it.

```python
def set_brightness(level):
    if level < 0 or level > 100:      # check the allowed range
        print("Brightness must be 0–100")
        return                         # exit early without crashing
    print("Brightness:", level)
```

Even with validation, things go wrong. An **error (exception)** is what Python raises when something unexpected happens. A **try-except block** catches it so your program keeps running.

```python
try:
    value = int("abc")          # "abc" cannot be converted to int
except ValueError:
    print("Not a number — using default 0")
    value = 0

print("Value:", value)         # prints: Value: 0
```

The following table shows the most common exceptions you will encounter:

| Exception | When it happens |
|-----------|----------------|
| `ValueError` | Wrong value type: `int("hello")` |
| `TypeError` | Wrong type for the operation: `"hi" + 5` |
| `ZeroDivisionError` | Dividing by zero: `10 / 0` |
| `OSError` | File or hardware I/O problem |

## Putting It All Together

```python
# Chapter 2 Review Program
import utime                                    # Module Import

note_freq = {"C4": 261, "D4": 294, "E4": 330}  # Dictionary
melody    = ["C4", "E4", "D4", "C4"]           # List
tempo     = (120,)                              # Tuple

def bpm_to_ms(bpm):                            # Function Definition
    return int(60000 / bpm)                    # Return Value

beat_ms = bpm_to_ms(tempo[0])                 # Function Call

for note in melody:                            # For Loop
    if note in note_freq:                      # Conditional Statement
        freq = note_freq[note]
        print(f"Play {note} at {freq} Hz for {beat_ms} ms")
    else:
        print(f"{note} not in dictionary")

user_bpm = "fast"
try:                                           # Try-Except Block
    beats = int(user_bpm)
except ValueError:
    print("BPM must be a number — using 120")
    beats = 120
```

## Key Takeaways

- A **list** can change; a **tuple** cannot; a **dictionary** maps keys to values.
- `if / elif / else` let your program choose between paths.
- `and`, `or`, `not` combine conditions into one expression.
- A **for loop** runs once per item; a **while loop** runs until its condition is False.
- A **function** groups code so you can reuse it by name.
- `try / except` catches errors before they crash your program.

??? question "Quick Check: What does this code print? (Click to reveal)"
    ```python
    values = [10, 20, 30]
    total = 0
    for v in values:
        total += v
    print(total)
    ```
    **Answer:** `60` — the loop adds 10 + 20 + 30 to the running total.

!!! mascot-celebration "Excellent Work, Maker!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You now have the full Python toolkit: collections, decisions, loops, functions, modules, and error handling. Every MicroPython program in this course is built from exactly these pieces. In Chapter 3 you will install the tools that let you run your code on a real Pico. You are a coder!
