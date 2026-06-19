# OLED Patterns

!!! mascot-welcome "Welcome to Math Patterns"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab, you will use simple math equations to create beautiful repeating patterns on your OLED screen. Let's build something amazing!

In this lesson, you will write a pattern into the display's framebuffer using a simple math equation. The `oled.show()` function then sends the pattern to the display.

This lesson was suggested by Parker Erickson.

## Math Functions

You will use two unusual math operations to create repeating patterns:

1. **Modulo (%)** — returns the remainder after division. For example, `7 % 3` is 1, because 7 divided by 3 leaves a remainder of 1. And `7 % 4` is 3.
2. **Bitwise AND (&)** — compares two numbers bit by bit. A bit in the result is 1 only if both matching bits are 1.

The **power** function raises a number to an exponent. In Python it is written as `pow(x, y)`. For example, `pow(7, 2)` is seven squared = 49.

The bitwise AND is written as `x & y`.

Here is an example of bitwise AND with the number 13:

```py
for i in range(8):    # loop through numbers 0 to 7
    print(13 & i)     # print 13 AND i for each value
```

| Function | Returns |
|---|---|
| 13 & 0 | 0 |
| 13 & 1 | 1 |
| 13 & 2 | 0 |
| 13 & 3 | 1 |
| 13 & 4 | 4 |
| 13 & 5 | 5 |
| 13 & 6 | 4 |
| 13 & 7 | 5 |
| 13 & 8 | 8 |
| 13 & 9 | 9 |
| 13 & 10 | 8 |
| 13 & 11 | 9 |
| 13 & 12 | 12 |

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    The modulo (%) and bitwise AND (&) operations both produce repeating patterns because their outputs cycle. This is why they make great pixel patterns — the screen looks like it tiles or repeats in interesting ways.

## Some Sample Equations

Try these equations where `x` is the column (0–127) and `y` is the row (0–63):

1. `x & y`
1. `x % y`
1. `(x ^ y) % 9`
1. `(x ^ y) % 5`
1. `(x ^ y) % 17`
1. `(x ^ y) % 33`
1. `(x * y) & 64`
1. `(x * y) & 24`
1. `(x * y) & 47`
1. `(x * 2) % y`
1. `(x * 64) % y`
1. `(x * 31) % y`
1. `((x-128) * 64) % (y-128)`
1. `(x % y) % 4`
1. `(y % x) % 20`
1. `40 % (x % y)`

Note: some equations that use `pow(x, y)` or `**` (exponentiation) do not work reliably on MicroPython.

## Sample Code

This program evaluates the equation `x % (y+1)` for every pixel on the screen. If the result is non-zero, the pixel turns off. If the result is zero, the pixel turns on.

**File name:** draw-patterns-ssd1306-spi.py

```py
import machine   # import hardware control tools
import ssd1306   # import the display driver

# display size in pixels
WIDTH  = 128
HEIGHT = 64

# set up the SPI display connection
spi_sck = machine.Pin(2)   # SPI clock wire on GP2
spi_tx  = machine.Pin(3)   # SPI data wire on GP3
spi     = machine.SPI(0, baudrate=100000, sck=spi_sck, mosi=spi_tx)
CS      = machine.Pin(1)   # chip select pin
DC      = machine.Pin(4)   # data/command pin
RES     = machine.Pin(5)   # reset pin

oled = ssd1306.SSD1306_SPI(WIDTH, HEIGHT, spi, DC, RES, CS)  # create the display object

oled.fill(0)   # clear the display to black

# loop through every pixel on the screen
for x in range(WIDTH):
    for y in range(HEIGHT):
        if x % (y + 1):          # if the equation gives a non-zero result
            oled.pixel(x, y, 0)  # turn the pixel off (black)
        else:
            oled.pixel(x, y, 1)  # turn the pixel on (white)

oled.show()   # send the finished pattern to the screen
```

**What each line does:**

1. `for x in range(WIDTH)` — loops through every column from 0 to 127.
2. `for y in range(HEIGHT)` — loops through every row from 0 to 63.
3. `if x % (y + 1)` — evaluates the math equation for pixel (x, y). We use `y+1` to avoid dividing by zero when y is 0.
4. `oled.pixel(x, y, 0)` — turns the pixel off if the equation is non-zero.
5. `oled.pixel(x, y, 1)` — turns the pixel on if the equation is zero.
6. `oled.show()` — sends the complete pattern to the screen all at once.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Drawing patterns takes a few seconds because the Pico calculates 8,192 pixel values (128 x 64). Be patient — the screen will update when all the calculations are done!

## Adding a List of Patterns

### The Eval Function

The `eval()` function takes a string and runs it as Python code. You can store math equations as strings in a list and then use `eval()` to run each one.

```py
equations = ["x+y", "x-y", "x*y", "x % (y+1)"]   # a list of equations as strings

for i in range(0, 4):               # loop through each equation
    print(equations[i], ': ', sep='', end='')
    for x in range(5):              # try x values 0–4
        for y in range(5):          # try y values 0–4
            print(eval(equations[i]), '', end='')   # evaluate and print the result
    print('')
```

Output:

```data
x+y: 0 1 2 3 4 1 2 3 4 5 2 3 4 5 6 3 4 5 6 7 4 5 6 7 8 
x-y: 0 -1 -2 -3 -4 1 0 -1 -2 -3 2 1 0 -1 -2 3 2 1 0 -1 4 3 2 1 0 
x*y: 0 0 0 0 0 0 1 2 3 4 0 2 4 6 8 0 3 6 9 12 0 4 8 12 16 
x % (y+1): 0 0 0 0 0 0 1 1 1 1 0 0 2 2 2 0 1 0 3 3 0 0 1 0 4 
```

## The Command Design Pattern

The **command pattern** stores a list of actions in an array and runs them one after another. Here, each action is a math equation. The program steps through the list and displays each pattern on the OLED for 5 seconds.

```py
import machine
import ssd1306
from utime import sleep, time   # import sleep and time functions

# display size in pixels
WIDTH  = 128
HEIGHT = 64

# set up the SPI display connection
spi_sck = machine.Pin(2)
spi_tx  = machine.Pin(3)
spi     = machine.SPI(0, baudrate=100000, sck=spi_sck, mosi=spi_tx)
CS      = machine.Pin(1)
DC      = machine.Pin(4)
RES     = machine.Pin(5)
oled    = ssd1306.SSD1306_SPI(WIDTH, HEIGHT, spi, DC, RES, CS)

# list of equations to display — each one makes a different pattern
equations = [
    '(x * y) & 24',
    '(x * y) & 47',
    '(x * y) & 64',
    'x & y',
    'x % y',
    '(x % y) % 4',
    '40 % (x % y+1)'
]

# display each equation's pattern in turn
for eqn_index in range(0, len(equations)):
    start_time = time()    # record when we started drawing this pattern

    # show the equation name while the pattern is calculating
    oled.fill(0)
    oled.text('calculating', 0, 0, 1)           # tell the user the Pico is working
    oled.text(equations[eqn_index], 0, 10, 1)  # show which equation is running
    oled.show()

    # draw the pattern pixel by pixel
    for x in range(WIDTH):
        for y in range(1, HEIGHT):   # start y at 1 to avoid division by zero
            if eval(equations[eqn_index]):   # run the equation string as code
                oled.pixel(x, y, 0)          # non-zero result: pixel off
            else:
                oled.pixel(x, y, 1)          # zero result: pixel on

    oled.show()    # show the completed pattern
    sleep(5)       # display the pattern for 5 seconds

    end_time = time()
    duration = str(end_time - start_time)    # calculate how long it took
    print(equations[eqn_index])
    print(duration, ' seconds')              # print the time in the console

# show a completion message
oled.text('done', 0, 0, 1)
oled.show()
print('done')
```

**What each section does:**

1. `equations = [...]` — a list of 7 math equations stored as strings.
2. `for eqn_index in range(0, len(equations))` — loops through all 7 equations.
3. `oled.text('calculating', 0, 0, 1)` — shows a message so the user knows the Pico is busy.
4. `eval(equations[eqn_index])` — runs the equation string as real Python code using the current x and y values.
5. `sleep(5)` — shows each pattern for 5 seconds before moving to the next.
6. `print(duration, ' seconds')` — shows in the Thonny console how long each pattern took to draw.

!!! mascot-encourage "You Can Do This!"
    ![Monty encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    Some patterns take many seconds to appear. That is normal — the Pico is doing thousands of math calculations! Try adding your own equation to the list and see what pattern it makes.

## Sample Screen Images

### X Modulo Y
`x % y`
![x modulo y pattern on OLED display](../../img/pattern6.jpg)


### (x % y) % 4
![(x percent y) percent 4 pattern on OLED display](../../img/pattern5.jpg)

## Sierpinski Triangles (x & y)
[Sierpinski Triangles](https://en.wikipedia.org/wiki/Sierpi%C5%84ski_triangle)
Bitwise AND of x and y.
![Sierpinski triangle pattern formed by bitwise AND of x and y](../../img/pattern1.jpg)

## (x * y) & 24
![(x times y) bitwise AND 24 pattern on OLED display](../../img/pattern2.jpg)

## (x * y) & 64
![(x times y) bitwise AND 64 pattern on OLED display](../../img/pattern3.jpg)

## 40 % x % (y+1)
![40 modulo x modulo (y+1) pattern on OLED display](../../img/pattern4.jpg)


## Reference

[Martin Kleppe Post on Twitter](https://twitter.com/aemkei/status/1378106731386040322)

!!! mascot-celebration "Great Work!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You used math equations to generate beautiful geometric patterns! You have now completed the OLED drawing and animation labs. You are ready to build your own creative displays!
