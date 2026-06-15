# Quiz: Collections, Control Flow, Functions, and Error Handling

Test your understanding of lists, loops, functions, and error handling with these questions.

---

#### 1. Which type of Python collection is created with square brackets and can be changed after it is created?

<div class="upper-alpha" markdown>
1. Tuple
2. Dictionary
3. List
4. String
</div>

??? question "Show Answer"
    The correct answer is **C**. A list uses square brackets `[ ]` and is mutable — you can add, remove, or change items after creating it. A tuple uses parentheses `()` and cannot be changed. A dictionary uses curly braces `{}` and maps keys to values. Strings use quotation marks and are not a collection in the same way.

    **Concept Tested:** List

---

#### 2. You have `notes = ["C", "D", "E"]`. What does `notes[0]` return?

<div class="upper-alpha" markdown>
1. `"D"`
2. `1`
3. `"E"`
4. `"C"`
</div>

??? question "Show Answer"
    The correct answer is **D**. Python uses zero-based indexing — the first item in a list is always at index 0. So `notes[0]` returns `"C"` (the first item), `notes[1]` returns `"D"`, and `notes[2]` returns `"E"`.

    **Concept Tested:** List

---

#### 3. What is the purpose of a tuple compared to a list?

<div class="upper-alpha" markdown>
1. Tuples can hold more items than lists
2. Tuples store key-value pairs; lists only store values
3. Tuples cannot be changed after creation; lists can
4. Tuples use less memory for text; lists use less memory for numbers
</div>

??? question "Show Answer"
    The correct answer is **C**. A tuple is like a list that is locked — once you create it, you cannot add, remove, or change any of its values. This makes tuples ideal for storing fixed constants like pin number pairs `(0, 1)` or RGB color values `(255, 0, 0)` that should never change in your program.

    **Concept Tested:** Tuple

---

#### 4. What will this code print?

```python
temp = 35
if temp > 30:
    print("Hot!")
else:
    print("Cool.")
```

<div class="upper-alpha" markdown>
1. `Cool.`
2. `Hot! Cool.`
3. Nothing — the code has an error
4. `Hot!`
</div>

??? question "Show Answer"
    The correct answer is **D**. The condition `temp > 30` checks whether 35 is greater than 30. Since it is, the condition is `True`, and Python runs the `if` block, printing `Hot!`. The `else` block is skipped entirely. Only one branch of an if-else runs per evaluation.

    **Concept Tested:** Conditional Statement / If-Else Statement

---

#### 5. How many times does this `for` loop run?

```python
for i in range(1, 6):
    print(i)
```

<div class="upper-alpha" markdown>
1. 4 times
2. 6 times
3. 5 times
4. 7 times
</div>

??? question "Show Answer"
    The correct answer is **C**. `range(1, 6)` generates the sequence `1, 2, 3, 4, 5` — it starts at 1 and stops before 6. That is five values, so the loop runs five times, printing 1 through 5. Remember: `range` always excludes the stop value.

    **Concept Tested:** For Loop

---

#### 6. What is the danger of a `while` loop whose condition never becomes `False`?

<div class="upper-alpha" markdown>
1. It runs exactly 100 times and then stops automatically
2. It causes a SyntaxError before the program starts
3. It runs forever and freezes your program or Pico
4. It skips the loop body every other iteration
</div>

??? question "Show Answer"
    The correct answer is **C**. A `while` loop with a condition that is always `True` creates an infinite loop — the code inside runs forever without stopping. On a Pico, this freezes the device. Always make sure your loop variable changes inside the loop so the condition eventually becomes `False`.

    **Concept Tested:** While Loop

---

#### 7. What keyword is used to define a function in Python?

<div class="upper-alpha" markdown>
1. `function`
2. `def`
3. `define`
4. `func`
</div>

??? question "Show Answer"
    The correct answer is **B**. In Python, `def` is the keyword that starts a function definition. After `def`, you write the function name, parentheses (with any parameters inside), and a colon. The function body is then indented below. Other languages use `function` or `func`, but Python always uses `def`.

    **Concept Tested:** Function Definition

---

#### 8. What does the `return` statement do inside a function?

<div class="upper-alpha" markdown>
1. Prints the result to the screen
2. Sends a result back to the code that called the function
3. Repeats the function from the beginning
4. Stops the whole program immediately
</div>

??? question "Show Answer"
    The correct answer is **B**. The `return` statement sends a value back to wherever the function was called from. For example, `celsius_to_fahrenheit(23.5)` uses `return` to give back the calculated Fahrenheit value. Without `return`, the function performs actions but gives nothing back to the caller.

    **Concept Tested:** Return Value

---

#### 9. Which line correctly imports only the `sleep_ms` function from the `utime` module?

<div class="upper-alpha" markdown>
1. `import sleep_ms from utime`
2. `include utime.sleep_ms`
3. `from utime import sleep_ms`
4. `using utime.sleep_ms`
</div>

??? question "Show Answer"
    The correct answer is **C**. The syntax `from module import name` lets you import a specific function from a module. After this line, you can call `sleep_ms(500)` directly without typing `utime.sleep_ms(500)`. Options A and D use incorrect syntax, and B is not valid Python at all.

    **Concept Tested:** Module Import

---

#### 10. What type of error does a `try-except ValueError` block catch?

<div class="upper-alpha" markdown>
1. Any error that occurs in the try block
2. Specifically errors caused by wrong value types, like converting `"abc"` to an integer
3. Only errors caused by dividing by zero
4. Hardware errors from the Pico's GPIO pins
</div>

??? question "Show Answer"
    The correct answer is **B**. A `ValueError` occurs when a function receives a value of the right type but an inappropriate value — for example, calling `int("abc")` gives a `ValueError` because `"abc"` cannot become an integer. The `except ValueError` block catches only that specific kind of error, while other error types would still crash the program.

    **Concept Tested:** Try-Except Block / Error and Exception

---
