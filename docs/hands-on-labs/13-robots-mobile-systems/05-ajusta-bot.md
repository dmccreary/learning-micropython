# Adjustable Parameter Bot (Ajusta Bot)

!!! mascot-welcome "Welcome to the Ajusta Bot Lab"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    In this lab you will add buttons and a knob to your robot so you can change its settings without rewriting your code. That is a big step toward building a truly interactive robot!

In the previous labs, you changed the robot's speed and turning distance by editing numbers in your code. Every time you changed a value, you had to save the file and restart the robot. This lab fixes that problem.

You will add two buttons and a rotary encoder to the Face Bot. A rotary encoder is a knob you can turn to increase or decrease a value. With these controls, you can adjust settings like forward speed and turning distance while the robot is running — no code changes needed.

## What You Need

| Part | Purpose |
|------|---------|
| Face Bot from the previous lab | Your base robot with the OLED display |
| 2 push buttons | Select which parameter to adjust |
| Rotary encoder | Turn the knob to increase or decrease the selected value |
| Breadboard and jumper wires | Connect everything together |

## What Parameters Can You Adjust?

The robot has several settings (called parameters) that control how it moves. These are the ones you will be able to change with the knob and buttons:

1. **Forward speed** — how fast the motors run when driving forward
2. **Turn threshold distance** — how close an obstacle must be before the robot turns
3. **Backup time** — how long the robot reverses before turning
4. **Turn time** — how long the robot turns before going straight again

## Connecting the Buttons

Connect two push buttons to the Pico:

1. Connect one leg of **Button A** to GPIO pin 14.
2. Connect the other leg of **Button A** to GND.
3. Connect one leg of **Button B** to GPIO pin 15.
4. Connect the other leg of **Button B** to GND.

```py
from machine import Pin

button_a = Pin(14, Pin.IN, Pin.PULL_UP)  # Button A on pin 14
button_b = Pin(15, Pin.IN, Pin.PULL_UP)  # Button B on pin 15
```

#### What each line does

- `Pin.IN` — sets the pin as an input (it reads a signal)
- `Pin.PULL_UP` — holds the pin at HIGH (1) until the button is pressed, then it goes LOW (0)

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    With PULL_UP, a button reads 1 when not pressed and 0 when pressed. This is opposite to what you might expect, but it is the most reliable way to wire a button without extra resistors.

## Connecting the Rotary Encoder

A rotary encoder has three pins for the rotation signal: a common ground (GND), a clock pin (CLK), and a data pin (DT). Connect them as follows:

1. Connect the encoder **GND** pin to the GND rail on the breadboard.
2. Connect the encoder **CLK** pin to GPIO pin 10.
3. Connect the encoder **DT** pin to GPIO pin 11.

```py
encoder_clk = Pin(10, Pin.IN, Pin.PULL_UP)  # clock signal from the encoder
encoder_dt  = Pin(11, Pin.IN, Pin.PULL_UP)  # data signal from the encoder
```

The encoder sends two signals as you turn the knob. By comparing those signals, your code can tell which direction the knob is turning.

## Selecting a Parameter with the Buttons

Button A moves to the next parameter. Button B moves to the previous parameter. The OLED display shows which parameter is selected and its current value.

```py
# List of adjustable parameters and their starting values
param_names  = ["Speed", "Turn Dist", "Backup Time", "Turn Time"]
param_values = [30000,   400,         0.75,          0.25]
param_index  = 0  # which parameter is selected right now

def next_param():
    """Move to the next parameter in the list."""
    global param_index
    param_index = (param_index + 1) % len(param_names)  # wrap around at the end

def prev_param():
    """Move to the previous parameter in the list."""
    global param_index
    param_index = (param_index - 1) % len(param_names)  # wrap around at the start
```

#### What each line does

- `param_names` — a list of the parameter names you will see on the display
- `param_values` — a list of the current values for each parameter
- `param_index` — tracks which parameter is currently selected
- `% len(param_names)` — wraps the index back to 0 when it reaches the end of the list

## Reading the Encoder Direction

This function reads the rotary encoder and returns +1 if you turned the knob clockwise, or -1 if you turned it counter-clockwise:

```py
last_clk = encoder_clk.value()  # save the starting state of the clock pin

def read_encoder():
    """Return +1 for clockwise turn, -1 for counter-clockwise, 0 for no movement."""
    global last_clk
    current_clk = encoder_clk.value()  # read the current state of the clock pin

    if current_clk != last_clk:        # the clock pin changed — knob is turning
        last_clk = current_clk
        if encoder_dt.value() != current_clk:
            return 1   # data pin differs from clock pin — clockwise turn
        else:
            return -1  # data pin matches clock pin — counter-clockwise turn

    return 0  # clock pin did not change — knob is not moving
```

#### What each line does

- `last_clk` — remembers the previous state of the clock pin
- `current_clk != last_clk` — checks if the clock pin changed (which means the knob moved)
- `encoder_dt.value() != current_clk` — compares the data and clock signals to find the direction

## Updating the Display

Show the selected parameter and its value on the OLED screen:

```py
from machine import I2C
from ssd1306 import SSD1306_I2C

i2c  = I2C(0, scl=Pin(1), sda=Pin(0))  # set up the I2C bus
oled = SSD1306_I2C(128, 64, i2c)       # create the display object

def update_display():
    """Show the current parameter and value on the OLED screen."""
    oled.fill(0)                                          # clear the screen
    oled.text("Ajusta Bot", 20, 0, 1)                    # title

    oled.text("Param:", 0, 20, 1)
    oled.text(param_names[param_index], 50, 20, 1)        # show the selected parameter name

    oled.text("Value:", 0, 35, 1)
    oled.text(str(param_values[param_index]), 50, 35, 1)  # show its current value

    oled.text("A=next  B=prev", 0, 52, 1)                 # button hint
    oled.show()                                            # send the drawing to the screen
```

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Keep the display update fast. If you call `oled.show()` too often in the main loop, it can slow down the motor control. Call it only when a value changes.

## Putting It All Together

Here is the main loop that reads buttons, reads the encoder, updates parameters, and drives the robot:

```py
import time

# How much each turn of the knob changes the selected value
param_steps = [1000, 10, 0.05, 0.05]

while True:
    # Check Button A — move to the next parameter
    if button_a.value() == 0:  # button is pressed (PULL_UP, so 0 = pressed)
        next_param()
        update_display()
        time.sleep(0.2)        # short pause to avoid detecting one press as many

    # Check Button B — move to the previous parameter
    if button_b.value() == 0:
        prev_param()
        update_display()
        time.sleep(0.2)

    # Check the encoder — change the selected parameter value
    direction = read_encoder()
    if direction != 0:
        step = param_steps[param_index]               # get the step size for this parameter
        param_values[param_index] += direction * step  # add or subtract one step
        update_display()

    # Use the current parameter values to drive the robot
    POWER_LEVEL    = param_values[0]  # forward speed
    TURN_THRESHOLD = param_values[1]  # turning distance
    BACKUP_TIME    = param_values[2]  # backup duration
    TURN_TIME      = param_values[3]  # turn duration

    # --- Collision avoidance logic ---
    dist = read_sensor_avg()
    if dist < TURN_THRESHOLD:
        reverse()
        time.sleep(BACKUP_TIME)
        turn_right()
        time.sleep(TURN_TIME)
    else:
        forward()
```

#### What each line does

- `param_steps` — each parameter changes by a different amount per knob click
- `param_values[param_index] += direction * step` — adds or subtracts one step from the selected value
- The last block uses the current parameter values to run the robot

!!! mascot-encourage "You Can Do This!"
    ![Monty encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    Tuning a robot's parameters can take many tries. Turn the knob a little, watch the robot, and adjust again. That is exactly what engineers do when they tune real robots!

!!! mascot-celebration "You Built a Tunable Robot!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You can now adjust your robot's behavior on the fly with buttons and a knob. You have built one of the most complete robots in this course — well done!
