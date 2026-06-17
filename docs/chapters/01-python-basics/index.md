---
title: Python Basics — Programs, Variables, Data Types, and Operators
description: An introduction to computer programs, variables, data types, and Python operators for beginning MicroPython programmers.
generated_by: claude skill chapter-content-generator
date: 2026-06-12 21:27:41
version: 0.09
---

# Python Basics — Programs, Variables, Data Types, and Operators

## Summary

This chapter introduces the fundamental building blocks of every Python program: what a computer program is, how to store information in variables, and the core data types Python uses to represent numbers, text, and true/false values. You will learn Python's syntax rules, how indentation works, how to write helpful comments, and how to display output with the print statement. By the end of this chapter you will be able to write and run simple Python programs that store and display integers, floats, strings, and booleans.

## Concepts Covered

This chapter covers the following 15 concepts from the learning graph:

1. Computer Program
2. Source Code
3. Variable
4. Data Type
5. Integer
6. Float
7. String
8. Boolean
9. Python Syntax
10. Indentation in Python
11. Comment in Code
12. Print Statement
13. Arithmetic Operators
14. Comparison Operators
15. Assignment Operators

## Prerequisites

This chapter assumes only the prerequisites listed in the [course description](../../course-description.md).

---

!!! mascot-welcome "Hi! I'm Monty."
    ![Monty waves hello](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Welcome to **Learning MicroPython and Physical Computing**! I'm **Monty**, a cheerful Python snake who loves building things with code. I wear little round glasses and carry a tiny Raspberry Pi Pico badge on my chest — because that little computer is what this whole course is about. I'll be popping into every chapter to help you along, but I don't show up randomly. I have exactly **six jobs**, and you'll learn to recognize me by which one I'm doing:

    1. **Welcome you** at the start of every chapter — just like I'm doing right now.
    2. **Help you think** when a new idea needs a moment to sink in.
    3. **Give you tips** — the handy tricks that experienced coders use all the time.
    4. **Warn you gently** about the spots where beginners often get tripped up.
    5. **Encourage you** when something feels hard — because hard things are worth doing.
    6. **Celebrate with you** at the end of each chapter when you've earned it.

    That's it. If I'm not doing one of those six things, I'm not in the chapter. Let's build something amazing!

<iframe src="../../posters/python-vs-micropython/main.html" width="100%" height="800" scrolling="no"></iframe>

## What Is a Computer Program?

A **computer program** is a list of instructions for a computer to follow. Think of it like a recipe. A recipe tells a chef exactly what to do, step by step. A computer program tells a computer exactly what to do, one instruction at a time.

Every program you write starts as **source code** — the text you type in a code editor. The computer reads your source code and carries out each instruction. In this course, you will write source code in a language called **MicroPython**. MicroPython is a version of Python designed to run on tiny computers called microcontrollers.

The microcontroller we use is the **Raspberry Pi Pico**. It costs about four dollars and fits in the palm of your hand. When you load your source code onto the Pico, it follows your instructions instantly.

Here is the simplest MicroPython program you can write:

```python
# This program says hello to the world
print("Hello, world!")   # print() shows text on the screen
```

When you run this program, it shows:

```
Hello, world!
```

Here is what each part does:

1. `# This program says hello to the world` — a comment. Python ignores this line. It is a note for you to read.
2. `print("Hello, world!")` — tells Python to display the text inside the parentheses on the screen.
3. `# print() shows text on the screen` — another comment, explaining what that line does.

That is source code in action!

## Variables — Labeled Boxes for Information

A **variable** is a place in the computer's memory where you can store a piece of information. You give it a name so you can find it later. Think of it like a labeled box. You write a name on the outside of the box, and you put something inside.

!!! mascot-thinking "Key Idea: Variables Are Like Labeled Boxes"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Imagine a physical box with the word "age" written on the side. Right now the box holds the number 12. Later you can open the box, take out 12, and put in 13. The box — the variable — stays the same, but the value inside changes. That is exactly how variables work in Python.

In Python, you create a variable by choosing a name and then using the `=` sign to put a value inside it. The `=` sign in Python does not mean "equals" the way it does in math — it means "store this value in this variable."

```python
student_name = "Alex"    # store the text "Alex" in a variable called student_name
age = 12                 # store the number 12 in a variable called age
temperature = 23.5       # store the number 23.5 in a variable called temperature
```

Variable names should describe what they hold. `age` is a much better name than `a`. Anyone reading your code will immediately know what the variable is for.

You can change the value in a variable at any time:

```python
age = 12     # age now holds 12
age = 13     # age now holds 13 — the old value is replaced
```

## Data Types — What Kind of Information?

Every variable holds a specific **data type** — the kind of information stored inside. Python has four basic data types you will use in nearly every program.

### Integer — Whole Numbers

An **integer** is a whole number with no decimal point. Integers can be positive, negative, or zero.

```python
pico_cost = 4          # the Pico costs $4 — a whole number
num_leds = 8           # we have 8 LEDs on our breadboard
temperature_c = -5     # temperature is 5 degrees below zero
```

### Float — Decimal Numbers

A **float** is a number that has a decimal point. The name comes from the idea that the decimal point can "float" to different positions in the number.

```python
voltage = 3.3          # the Pico runs on 3.3 volts
sensor_reading = 24.7  # a temperature sensor reading in degrees Celsius
pi_value = 3.14159     # the mathematical constant pi
```

### String — Text

A **string** is a sequence of characters — letters, numbers, spaces, and symbols. You always put strings inside quotation marks. Single quotes and double quotes both work.

```python
greeting = "Hello, maker!"      # a string using double quotes
board_name = 'Raspberry Pi Pico' # a string using single quotes
pin_label = "GP15"              # strings can contain letters AND numbers
```

### Boolean — True or False

A **boolean** is either `True` or `False` — nothing else. Booleans are useful when you want to track whether something is on or off, yes or no.

```python
led_is_on = True       # the LED is currently turned on
button_pressed = False # the button has not been pressed yet
```

Notice that `True` and `False` start with capital letters. Python is strict about this. Writing `true` in all lowercase will give you an error.

The following table summarizes all four basic data types:

| Data Type | What It Stores | Example Value | Python Name |
|-----------|----------------|---------------|-------------|
| Integer | Whole numbers | `12` | `int` |
| Float | Decimal numbers | `3.14` | `float` |
| String | Text in quotes | `"Hello"` | `str` |
| Boolean | True or False | `True` | `bool` |

Now try classifying values yourself. The MicroSim below gives you a mystery value and asks you to pick the correct data type.

#### Diagram: Python Data Type Explorer

<iframe src="../../sims/python-data-type-explorer/main.html" width="100%" height="482px" scrolling="no"></iframe>

<details markdown="1">
<summary>Python Data Type Explorer MicroSim</summary>
Type: microsim
**sim-id:** python-data-type-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Understand (L2)
Bloom Verb: classify
Learning Objective: Students can classify a given Python value as integer, float, string, or boolean by examining its form.

Canvas layout:
- Top row: four labeled colored boxes representing the four data types (Integer = blue, Float = green, String = orange, Boolean = purple). Each box shows the type name and a one-line description.
- Center: a large "mystery value" card showing a Python literal in large monospace font.
- Bottom: a feedback message area and a "Next Value" button.

Visual elements:
- Integer box (blue): label "Integer", description "Whole number — no decimal"
- Float box (green): label "Float", description "Number with a decimal point"
- String box (orange): label "String", description "Text inside quotation marks"
- Boolean box (purple): label "Boolean", description "Only True or False"
- Mystery value card: shows values like `42`, `3.14`, `"hello"`, `True`, `-7`, `'Pico'`, `False`, `0.5`, `"GP15"`, `-2.71`

Interactive controls:
- Four clickable type boxes. On correct click: the box glows and a message says "Correct! [value] is an integer because it has no decimal point."
- On incorrect click: the box shakes gently and a message says "Not quite — look for quotation marks, a decimal point, or True/False."
- Button: "Next Value" — loads a new mystery value from the randomized list.
- Running score display: "X correct out of Y attempts."

Data Visibility Requirements:
- Stage 1: Mystery value shown in large font.
- Stage 2: After student clicks, show the correct type name and a one-sentence reason.
- Stage 3: Show running score.

Instructional Rationale: A classify interaction at Understand level is appropriate because students must distinguish four mutually exclusive categories. Immediate corrective feedback builds the mental model without passive animation.

Values to cycle through (randomized): `42`, `3.14`, `"hello"`, `True`, `-7`, `'Pico'`, `False`, `0.5`, `100`, `"GP15"`, `False`, `-2.71`

Implementation: p5.js. Four clickable rectangles for classification. createButton() for "Next Value". Feedback text rendered below the boxes. Score tracked in a variable.
</details>

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Not sure whether to use a float or an integer? Ask yourself: "Will this number ever have a decimal?" If the answer is yes — even sometimes — use a float. The Pico's voltage is always 3.3, never exactly 3, so `voltage = 3.3` is the right choice.

## Python Syntax — The Rules of the Language

Every programming language has **syntax** — the rules for how to write code correctly. Python's syntax rules are strict. If you break a rule, Python will refuse to run your code and show an error message.

Here are the most important Python syntax rules for beginners:

- Write one statement per line.
- Use parentheses `()` after `print` when you call it.
- Put all text strings inside quotation marks.
- Spell `True` and `False` with a capital first letter.
- Use underscores `_` instead of spaces in variable names: write `led_pin`, not `led pin`.

### Comments

A **comment** is a note you write in your code for yourself and other readers. Python ignores comments completely — they do not affect how your program runs. You create a comment by putting a `#` (hash symbol) at the start of the note.

```python
# This is a comment — Python skips this line entirely
temperature = 23.5   # you can also add a comment at the end of a line
```

Good comments explain WHY the code does something, not just WHAT it does. Get into the habit of writing comments now. Your future self will thank you.

### Indentation

**Indentation** means adding spaces at the beginning of a line to show that it belongs inside a group of code. Python uses indentation to understand your program's structure. This is different from most other programming languages.

Most code editors — including Thonny, the one we recommend — add four spaces automatically when you press the **Tab** key.

```python
# You will see indentation more in Chapter 2 — here is a preview
if temperature > 30:
    print("It is hot!")    # indented 4 spaces — inside the if block
    print("Stay cool!")    # also inside the if block
print("All done.")         # NOT indented — outside the if block
```

!!! mascot-warning "Watch Out for Indentation Errors!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    Python is very particular about indentation. If you mix spaces and tabs, or use the wrong number of spaces, you will get an `IndentationError`. Always use four spaces — or press Tab once in Thonny. Never mix tabs and spaces on the same line level.

## The `print()` Statement

The **print statement** (`print()`) is how you tell Python to show output on the screen. Put whatever you want to display inside the parentheses. You can print text, numbers, variables, or a mix of all three.

```python
print("Hello, maker!")          # prints text (a string)
print(42)                       # prints an integer
print(3.14)                     # prints a float
print(True)                     # prints a boolean
print("My age is", 12)          # prints text and a number together
```

Here is what each line above displays:

| Code | Output |
|------|--------|
| `print("Hello, maker!")` | `Hello, maker!` |
| `print(42)` | `42` |
| `print(3.14)` | `3.14` |
| `print(True)` | `True` |
| `print("My age is", 12)` | `My age is 12` |

You can also print the value stored in a variable:

```python
student_name = "Alex"
age = 12
print("Name:", student_name)   # prints: Name: Alex
print("Age:", age)             # prints: Age: 12
```

## Operators — Performing Actions on Values

An **operator** is a symbol that performs an action on one or more values. Python has three groups of operators you will use in almost every program.

### Arithmetic Operators

**Arithmetic operators** do math. Before you look at the table below, here is a quick note about the two less-familiar ones. **Floor division** (`//`) gives you the whole-number part of a division result. **Modulo** (`%`) gives you the remainder.

| Operator | Name | Example | Result |
|----------|------|---------|--------|
| `+` | Addition | `5 + 3` | `8` |
| `-` | Subtraction | `10 - 4` | `6` |
| `*` | Multiplication | `3 * 7` | `21` |
| `/` | Division | `15 / 4` | `3.75` |
| `//` | Floor Division | `15 // 4` | `3` |
| `%` | Modulo (remainder) | `15 % 4` | `3` |

Here is a practical example using floor division and modulo. Imagine you have 24 LEDs and you want to arrange them in rows of 8:

```python
total_leds = 24
leds_per_row = 8
num_rows = total_leds // leds_per_row   # 24 // 8 = 3 complete rows
leftover = total_leds % leds_per_row    # 24 % 8 = 0 leftover LEDs
print("Rows:", num_rows)                # prints: Rows: 3
print("Leftover LEDs:", leftover)       # prints: Leftover LEDs: 0
```

Try changing the numbers yourself using the MicroSim below. Adjust the two sliders and click an operator to see the result instantly.

#### Diagram: Arithmetic Operator Explorer

<iframe src="../../sims/arithmetic-operator-explorer/main.html" width="100%" height="497px" scrolling="no"></iframe>

<details markdown="1">
<summary>Arithmetic Operator Explorer MicroSim</summary>
Type: microsim
**sim-id:** arithmetic-operator-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Apply (L3)
Bloom Verb: calculate
Learning Objective: Students can apply the six Python arithmetic operators to compute results and predict outputs for given inputs.

Canvas layout:
- Top area: Two sliders labeled "Number A" (range 0–20, default 10) and "Number B" (range 1–20, default 3, minimum 1 to prevent division by zero).
- Middle area: A 2×3 grid of six operator buttons: `+`, `-`, `*`, `/`, `//`, `%`. The currently selected operator is highlighted in a bright accent color.
- Bottom area: A result card showing the full Python expression and computed result in large monospace font. Below the result: a one-sentence plain-English explanation of the operator. For `//` and `%`, also show a pizza-sharing analogy: "10 pizza slices shared by 3 people: each person gets 3 slices (//), with 1 left over (%)."

Interactive controls:
- createSlider() for Number A and Number B. Values update live as sliders move.
- createButton() for each operator. Clicking selects that operator and recalculates immediately.

Default state: A = 10, B = 3, operator = `+`, showing `10 + 3 = 13`.

Data Visibility Requirements:
- Stage 1: Show A, B, and the selected operator.
- Stage 2: Show the full Python expression: `A op B = result`.
- Stage 3: Show a plain-English explanation and (for `//`/`%`) the pizza analogy.

Instructional Rationale: Slider-driven Apply-level exploration lets students verify mental predictions immediately. Showing the expression alongside the plain-English explanation bridges symbolic notation and meaning. The pizza analogy makes floor division and modulo concrete for 10-year-olds.

Implementation: p5.js with createSlider() and createButton(). Result displayed as large centered text with explanation below. Operator buttons styled as colored rounded rectangles; selected one gets a distinct border highlight.
</details>

### Comparison Operators

**Comparison operators** compare two values and always produce a boolean result — either `True` or `False`. You will use comparison operators any time your program needs to make a decision.

Here is the key rule to remember before looking at the table: a comparison always produces exactly one of two answers, `True` or `False` — never a number or text.

| Operator | Meaning | Example | Result |
|----------|---------|---------|--------|
| `==` | Equal to | `5 == 5` | `True` |
| `!=` | Not equal to | `5 != 3` | `True` |
| `>` | Greater than | `10 > 7` | `True` |
| `<` | Less than | `3 < 1` | `False` |
| `>=` | Greater than or equal | `5 >= 5` | `True` |
| `<=` | Less than or equal | `4 <= 3` | `False` |

!!! mascot-encourage "You Can Do This!"
    ![Monty encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    The `==` operator trips up almost every beginner at least once. Remember: a single `=` stores a value in a variable (assignment), and a double `==` checks whether two values are equal (comparison). One equals sign stores; two equals signs compares. You'll get this, coder!

```python
temperature = 28
is_hot = temperature > 25      # is 28 greater than 25? Yes → True
is_freezing = temperature < 0  # is 28 less than 0? No → False
print(is_hot)                  # prints: True
print(is_freezing)             # prints: False
```

### Assignment Operators

You have already used the basic **assignment operator** (`=`) to store values in variables. Python also has a set of shortcut assignment operators that update a variable's value in place.

| Operator | Meaning | Example | Same as writing |
|----------|---------|---------|-----------------|
| `=` | Assign | `x = 5` | — |
| `+=` | Add and assign | `x += 3` | `x = x + 3` |
| `-=` | Subtract and assign | `x -= 2` | `x = x - 2` |
| `*=` | Multiply and assign | `x *= 4` | `x = x * 4` |
| `/=` | Divide and assign | `x /= 2` | `x = x / 2` |

These shortcuts are used constantly in hardware projects. For example, counting how many times a button has been pressed:

```python
button_count = 0        # start the counter at zero
button_count += 1       # button was pressed — add 1
button_count += 1       # button was pressed again — add 1 more
print(button_count)     # prints: 2
```

Using `button_count += 1` is shorter and easier to read than writing `button_count = button_count + 1` every time.

## Putting It All Together

Here is a short program that uses all 15 concepts from this chapter. Read each comment before you type it in — the comments are there to help you understand what every line does.

```python
# Chapter 1 Review Program
# This program stores microcontroller info and prints a report.

# --- Variables and data types ---
board_name = "Raspberry Pi Pico"   # string: name of our microcontroller
pin_number = 26                    # integer: which pin we are reading
voltage = 3.3                      # float: operating voltage
is_connected = True                # boolean: is the board plugged in?

# --- Arithmetic operators ---
reading = 512                       # raw ADC reading (0–65535 range)
max_reading = 65535                 # maximum possible ADC value
percent = reading / max_reading * 100  # calculate how full the range is

# --- print() statement ---
print("Board:", board_name)         # string variable
print("Pin: GP", pin_number)        # integer variable
print("Voltage:", voltage, "V")     # float variable
print("Connected:", is_connected)   # boolean variable
print("Reading:", reading)
print("Percentage:", percent)

# --- Comparison and assignment operators ---
is_high = reading > 32767           # is the reading above the halfway point?
print("Above halfway:", is_high)    # prints: False (512 < 32767)
reading += 100                      # add 100 to the reading using +=
print("New reading:", reading)      # prints: New reading: 612
```

When you run this program, you will see:

```
Board: Raspberry Pi Pico
Pin: GP 26
Voltage: 3.3 V
Connected: True
Reading: 512
Percentage: 0.781...
Above halfway: False
New reading: 612
```

## Key Takeaways

Before you move on to Chapter 2, make sure you can answer each of these questions:

- What is a **computer program**? A list of instructions for a computer to follow.
- What is **source code**? The text you type that the computer reads.
- What is a **variable**? A named place in memory that stores a value.
- What are the four basic **data types**? Integer, float, string, and boolean.
- What does `#` do in Python? It starts a comment — Python ignores it.
- What is the difference between `=` and `==`? `=` stores a value; `==` checks if two values are equal.

??? question "Quick Check: What data type is each value? (Click to reveal the answers)"
    - `42` → **integer** — a whole number with no decimal point
    - `3.14` → **float** — it has a decimal point
    - `"hello"` → **string** — it is text inside quotation marks
    - `True` → **boolean** — only `True` or `False` are booleans
    - `-7` → **integer** — whole numbers can be negative
    - `"42"` → **string** — the quotation marks make it text, not a number

!!! mascot-celebration "Great Work, Maker!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You just learned the foundation of every Python program — variables, data types, syntax, comments, print, and operators. These are the building blocks you will use in every single project in this course. In Chapter 2, you will put them to work with `if` statements and loops so your programs can make decisions and repeat actions. You've got this, coder!

## References

[See the Annotated References for this chapter](references.md)
