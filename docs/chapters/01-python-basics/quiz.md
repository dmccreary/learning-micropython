# Quiz: Python Basics — Programs, Variables, Data Types, and Operators

Test your understanding of Python programs, variables, data types, and operators with these questions.

---

#### 1. What does a computer program tell the computer to do?

<div class="upper-alpha" markdown>
1. Store files on the hard drive
2. Follow a list of instructions step by step
3. Connect to the internet automatically
4. Draw pictures on the screen
</div>

??? question "Show Answer"
    The correct answer is **B**. A computer program is a list of instructions for a computer to follow, similar to a recipe that tells a chef exactly what to do step by step. When you load a program onto your Pico, the microcontroller reads your source code and carries out each instruction in order.

    **Concept Tested:** Computer Program

---

#### 2. Which of the following is the best name for a variable that stores how many LEDs you have?

<div class="upper-alpha" markdown>
1. `x`
2. `n`
3. `num_leds`
4. `variable1`
</div>

??? question "Show Answer"
    The correct answer is **C**. Variable names should describe what they hold. `num_leds` tells anyone reading the code exactly what the variable stores — the number of LEDs. Short names like `x` or `n` tell you nothing, and generic names like `variable1` are equally unhelpful.

    **Concept Tested:** Variable

---

#### 3. What data type is the value `"Hello, Pico!"`?

<div class="upper-alpha" markdown>
1. Integer
2. Boolean
3. Float
4. String
</div>

??? question "Show Answer"
    The correct answer is **D**. A string is any sequence of characters placed inside quotation marks. The quotation marks around `"Hello, Pico!"` are the key clue — they make this value a string even though it contains letters, a comma, and a space.

    **Concept Tested:** String

---

#### 4. What value does the boolean variable `led_is_on = False` hold?

<div class="upper-alpha" markdown>
1. The number zero
2. The text "False"
3. The logical value False (off/no)
4. An empty string
</div>

??? question "Show Answer"
    The correct answer is **C**. A boolean holds exactly one of two logical values: `True` or `False`. It is not the number 0 or the text "False" — it is its own special data type used to represent on/off, yes/no, or true/false conditions. Notice that `False` must be spelled with a capital F.

    **Concept Tested:** Boolean

---

#### 5. What symbol starts a comment in Python?

<div class="upper-alpha" markdown>
1. `//`
2. `/*`
3. `#`
4. `--`
</div>

??? question "Show Answer"
    The correct answer is **C**. In Python, the hash symbol `#` marks the start of a comment. Python ignores everything after `#` on that line. Comments explain your code to human readers without affecting how the program runs.

    **Concept Tested:** Comment in Code

---

#### 6. Which line of code correctly prints the text `MicroPython` to the screen?

<div class="upper-alpha" markdown>
1. `print MicroPython`
2. `print("MicroPython")`
3. `display("MicroPython")`
4. `print[MicroPython]`
</div>

??? question "Show Answer"
    The correct answer is **B**. The `print()` function requires parentheses after it, and the text to display must be placed inside quotation marks within those parentheses. Option A is missing the parentheses. Option C uses the wrong function name. Option D uses square brackets instead of parentheses.

    **Concept Tested:** Print Statement

---

#### 7. What is the result of `15 % 4` in Python?

<div class="upper-alpha" markdown>
1. 3.75
2. 3
3. 60
4. 11
</div>

??? question "Show Answer"
    The correct answer is **B**. The `%` operator (modulo) returns the remainder after division. `15 ÷ 4 = 3` with a remainder of `3`. Think of it like sharing 15 pizza slices among 4 people — each person gets 3 slices, and 3 slices are left over. The remainder is 3, not the quotient.

    **Concept Tested:** Arithmetic Operators

---

#### 8. What is the difference between `=` and `==` in Python?

<div class="upper-alpha" markdown>
1. They do the same thing — both compare values
2. `=` stores a value in a variable; `==` checks if two values are equal
3. `==` stores a value in a variable; `=` checks if two values are equal
4. `=` only works with numbers; `==` works with all types
</div>

??? question "Show Answer"
    The correct answer is **B**. The single `=` is the assignment operator — it stores a value in a variable (e.g., `age = 12`). The double `==` is the comparison operator — it checks whether two values are equal and produces `True` or `False` (e.g., `age == 12` produces `True`). Mixing them up is one of the most common beginner mistakes.

    **Concept Tested:** Comparison Operators / Assignment Operators

---

#### 9. After running `count = 5` and then `count += 3`, what value does `count` hold?

<div class="upper-alpha" markdown>
1. 5
2. 3
3. 53
4. 8
</div>

??? question "Show Answer"
    The correct answer is **D**. The `+=` shortcut means "add to the current value and store the result." `count += 3` is the same as writing `count = count + 3`, so `5 + 3 = 8`. The original value of 5 is replaced by 8.

    **Concept Tested:** Assignment Operators

---

#### 10. What data type would you choose to store the voltage reading `3.3` from a Pico pin?

<div class="upper-alpha" markdown>
1. Boolean
2. String
3. Float
4. Integer
</div>

??? question "Show Answer"
    The correct answer is **C**. A float stores numbers that have a decimal point. Since `3.3` has a decimal part, it must be stored as a float. An integer can only hold whole numbers like `3`, not `3.3`. A string would store it as text, making math impossible, and a boolean can only be `True` or `False`.

    **Concept Tested:** Float / Data Type

---
