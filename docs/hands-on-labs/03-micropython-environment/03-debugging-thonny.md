# Debugging with Thonny

!!! mascot-welcome "Welcome to Debugging!"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Bugs are just puzzles waiting to be solved! In this lab, you will use Thonny's built-in debugger to pause your program, look inside it, and find exactly where something goes wrong.

Every programmer runs into bugs. A **bug** is a mistake in your code that makes it behave in an unexpected way. Instead of reading every line looking for the mistake, you can use a **debugger** — a tool that lets you pause your program and inspect it while it runs.

Thonny has a powerful debugger built right in. You do not need to install anything extra.

## What Is a Breakpoint?

A **breakpoint** is a marker you place on a line of code. When your program reaches that line, it pauses and waits for you. You can then look at the values of your variables at that exact moment.

Think of it like a pause button on a video. You press pause, look at the screen, then press play again.

## Lab 1: Setting Your First Breakpoint

Type this short program into Thonny:

```python
y = 0                   # start with y equal to zero
for i in range(10):     # count from 0 to 9
    x = i * 10         # multiply i by 10
    y = x * 2          # multiply x by 2 to get y
    print("i=", i)     # print the current value of i
```

### How to Set a Breakpoint

1. Click on the **line number** next to the `x = i * 10` line. A red dot appears — that is your breakpoint.
2. Press **F5** (or click the debug bug icon) to start the debugger instead of running normally.
3. The program will pause on the breakpoint line. A yellow arrow shows where it stopped.
4. Look at the **Variables panel** on the right side of Thonny. You can see the current value of `i`, `x`, and `y`.
5. Press **F6** to step forward one line at a time.
6. Press **F8** to continue running until the next breakpoint.

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The Variables panel updates every time you step forward. Watch `x` and `y` change as `i` increases.

## Lab 2: Inspecting Variables with a Moving Average

This program calculates the average of a moving list of numbers. It is a common pattern in sensor code.

```python
# collect a running average of the last 5 values
window = []            # start with an empty list
window_size = 5        # how many values to keep at a time

for i in range(20):    # loop 20 times
    window.append(i)   # add the new value to the list
    if len(window) > window_size:
        window.pop(0)  # remove the oldest value when the list is full
    avg = sum(window) / len(window)   # calculate the average
    print(f"i={i}  window={window}  avg={avg:.1f}")
```

### What Each Line Does

1. `window = []` — creates an empty list to hold recent values.
2. `window.append(i)` — adds the current value `i` to the right end of the list.
3. `window.pop(0)` — removes the oldest value (at position 0) when the list gets too long.
4. `avg = sum(window) / len(window)` — adds up all values and divides by how many there are.

Set a breakpoint on the `avg = ...` line. Each time the program pauses, check the `window` list in the Variables panel. Watch it grow from one element to five.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    You can hover your mouse over any variable name in the code editor while paused — Thonny shows a tooltip with its current value.

## Lab 3: Inspecting the Call Stack

The **call stack** shows you which functions called which other functions. This helps you understand how your program got to its current position.

```python
def multiply(a, b):
    result = a * b      # calculate the product
    return result       # send the answer back

def add_then_multiply(x, y, z):
    total = x + y       # add x and y first
    product = multiply(total, z)   # then multiply by z
    return product      # return the final answer

answer = add_then_multiply(3, 4, 5)   # should give (3+4)*5 = 35
print("answer:", answer)
```

### How to See the Stack

1. Set a breakpoint inside the `multiply` function on the `result = a * b` line.
2. Start the debugger.
3. When the program pauses, look at the **Stack panel** in Thonny. You will see:
   - `multiply` at the top (where you are now)
   - `add_then_multiply` below it (the function that called `multiply`)
   - The main program at the bottom (where everything started)
4. Click on `add_then_multiply` in the stack panel. The Variables panel switches to show `x`, `y`, `z`, and `total` in that function.

The call stack is like a trail of breadcrumbs showing how your program got here.

!!! mascot-encourage "You Can Do This!"
    ![Monty encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    Navigating the call stack can feel confusing at first. That is completely normal — just click around and watch the Variables panel change. You'll get it, coder!

## Lab 4: Checking Memory Usage

MicroPython runs on a microcontroller with very little memory. Unlike a laptop, your Pico has only 264 KB of RAM (Random Access Memory). Knowing how much memory your program uses helps you avoid crashes.

```python
import gc                           # import the garbage collector module

# Create some objects with references
list1 = [1, 2, 3]                  # a small list
list2 = list1                       # list2 points to the SAME list as list1
list3 = list1[:]                    # list3 is a COPY of list1

dict1 = {'a': list1, 'b': list2}  # a dictionary holding two references

# Check memory before cleaning up
before = gc.mem_free()             # how many bytes are free right now
print("Free memory before gc.collect():", before, "bytes")

gc.collect()                        # run the garbage collector to free unused memory

after = gc.mem_free()              # check again after collecting
print("Free memory after  gc.collect():", after, "bytes")
print("Memory freed:", after - before, "bytes")
```

### What Each Line Does

1. `import gc` — loads MicroPython's built-in garbage collector.
2. `gc.mem_free()` — returns the number of bytes of RAM that are currently free.
3. `gc.collect()` — scans memory and frees any objects that nothing points to anymore.

### Sample Output

```
Free memory before gc.collect(): 183264 bytes
Free memory after  gc.collect(): 184816 bytes
Memory freed: 1552 bytes
```

Run this at the start of your program and again after creating large objects (like image buffers or long lists) to see how much memory you are using.

!!! mascot-warning "Watch Out!"
    ![Monty warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    If `gc.mem_free()` returns a very small number (less than 10,000 bytes), your program is about to run out of memory. Simplify your data structures or call `gc.collect()` more often.

## Thonny Debugger Keyboard Shortcuts

| Key | Action |
|-----|--------|
| F5 | Start debugging (instead of normal run) |
| F6 | Step over — run one line, stay at the same level |
| F7 | Step into — go inside a function call |
| F8 | Continue — run until the next breakpoint |
| Shift+F5 | Stop the program |

## Experiments

1. Add a second breakpoint later in the loop in Lab 1. Press F8 to jump from one breakpoint to the next without stepping through every line.
2. In Lab 3, add a third function that calls `add_then_multiply`. Step into it and watch the call stack grow to three levels.
3. In Lab 4, create a large list (`big = list(range(10000))`) and check the memory before and after. Then delete the list (`del big`) and call `gc.collect()`. How much memory came back?

!!! mascot-celebration "You Found the Bug!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You now know how to set breakpoints, inspect variables, read the call stack, and check memory. These skills will save you hours of guessing. In the next lab, you will connect your Pico to a display for the first time!
