# Pong Game on OLED

!!! mascot-welcome "Welcome to Game Programming!"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    You are about to write a real video game! Pong is the classic table tennis game that started the video game industry in 1972. Your version will run on a tiny 128×64 pixel OLED screen with two potentiometer paddles. Let's build something amazing!

**Pong** is one of the best programs to learn game programming because it uses four core ideas:

1. **Game state** — variables that track where everything is (ball position, paddle positions, scores).
2. **Game loop** — a `while True:` loop that updates and redraws the screen as fast as possible.
3. **Collision detection** — checking if the ball has hit a paddle or a wall.
4. **Input reading** — reading potentiometers to control the paddles.

## Parts You Need

- Raspberry Pi Pico
- SSD1306 OLED display (128×64, I2C)
- 2 potentiometers (10kΩ)
- (Optional) small piezo buzzer for sound effects
- Jumper wires and breadboard

## Wiring Steps

### OLED Display (I2C)

1. Connect OLED **VCC** to Pico **3.3V**.
2. Connect OLED **GND** to Pico **GND**.
3. Connect OLED **SDA** to **GPIO 0**.
4. Connect OLED **SCL** to **GPIO 1**.

### Potentiometers (one for each player)

5. Connect each potentiometer: outer legs to **3.3V** and **GND**, middle (wiper) to an ADC pin.
6. Player 1 potentiometer center → **GPIO 27** (ADC1).
7. Player 2 potentiometer center → **GPIO 26** (ADC0).

### Buzzer (optional)

8. Connect buzzer **+** to **GPIO 16**.
9. Connect buzzer **–** to **GND**.

## How the Game Works

The **ball** moves diagonally across the screen. Each frame:
1. The ball moves one step in its current direction.
2. If the ball hits the top or bottom wall, it bounces (Y direction flips).
3. If the ball reaches a paddle, and the paddle is in the right place, it bounces back. Otherwise, the other player scores.
4. After a score, the ball resets to the center.
5. Both paddles follow the potentiometer positions.

## Full Game Code

```python
from machine import Pin, PWM, I2C, ADC
import ssd1306
from utime import sleep
import random

# --- Display setup ---
i2c  = I2C(0, sda=Pin(0), scl=Pin(1))
oled = ssd1306.SSD1306_I2C(128, 64, i2c)

# --- Potentiometer inputs ---
pot1 = ADC(Pin(27))    # player 1 (left paddle)
pot2 = ADC(Pin(26))    # player 2 (right paddle)

# --- Optional buzzer ---
speaker = PWM(Pin(16))

# --- Screen dimensions ---
WIDTH  = 128
HEIGHT = 64

# --- Ball settings ---
BALL_SIZE = 3          # ball is a 3×3 square

# --- Paddle settings ---
PAD_W = 2              # paddle width in pixels
PAD_H = 8              # paddle height in pixels
HALF_PAD_H = PAD_H // 2

# --- ADC scaling constants ---
POT_MIN = 3000         # minimum ADC reading (not quite 0 due to potentiometer tolerance)
POT_MAX = 65534        # maximum ADC reading

# --- Starting game state ---
ball_x     = WIDTH  // 2    # ball starts in the center
ball_y     = HEIGHT // 2
ball_x_dir = 1              # ball moves right at the start
ball_y_dir = 1              # ball moves down at the start

l_score = 0                 # left (player 1) score
r_score = 0                 # right (player 2) score

def play_bounce_sound():
    speaker.duty_u16(1000)
    speaker.freq(900)
    sleep(0.03)
    speaker.duty_u16(0)

def play_score_sound():
    speaker.duty_u16(1000)
    speaker.freq(600)
    sleep(0.1)
    speaker.freq(800)
    sleep(0.1)
    speaker.duty_u16(0)

def valmap(value, in_min, in_max, out_min, out_max):
    # Scale a value from one range to another (like Arduino's map() function)
    return int(out_min + (out_max - out_min) * ((value - in_min) / (in_max - in_min)))

def read_paddles():
    # Read both potentiometers and convert to Y positions on screen
    raw1 = pot1.read_u16()
    raw2 = pot2.read_u16()
    y1 = valmap(raw1, POT_MIN, POT_MAX, HALF_PAD_H, HEIGHT - HALF_PAD_H - 2)
    y2 = valmap(raw2, POT_MIN, POT_MAX, HALF_PAD_H, HEIGHT - HALF_PAD_H - 2)
    return y1, y2

def draw_paddle(player, center_y):
    x = 0 if player == 1 else WIDTH - PAD_W        # left or right side
    y = center_y - HALF_PAD_H
    oled.fill_rect(x, y, PAD_W, PAD_H, 1)         # draw a filled rectangle

def reset_ball():
    global ball_x, ball_y, ball_x_dir, ball_y_dir
    ball_x = WIDTH  // 2
    ball_y = HEIGHT // 2
    # Give the ball a random starting direction
    ball_x_dir = random.choice([-1, 1])
    ball_y_dir = random.choice([-1, 1])

# --- Main game loop ---
while True:
    oled.fill(0)                               # clear the screen

    # Draw center dividing line
    oled.vline(WIDTH // 2, 0, HEIGHT, 1)

    # Read paddle positions
    p1_y, p2_y = read_paddles()
    draw_paddle(1, p1_y + HALF_PAD_H)         # draw left paddle
    draw_paddle(2, p2_y + HALF_PAD_H)         # draw right paddle

    # Draw the ball
    oled.fill_rect(ball_x, ball_y, BALL_SIZE, BALL_SIZE, 1)

    # Move the ball one step
    ball_x += ball_x_dir
    ball_y += ball_y_dir

    # Bounce off top and bottom walls
    if ball_y < 0:
        ball_y_dir = 1              # hit top — now move down
    if ball_y > HEIGHT - BALL_SIZE:
        ball_y_dir = -1             # hit bottom — now move up

    # Check left paddle collision
    if ball_x < PAD_W + 1:
        top_p1    = p1_y
        bottom_p1 = p1_y + PAD_H
        if top_p1 < ball_y < bottom_p1:
            ball_x_dir = 1          # hit the paddle — bounce right
            ball_x = PAD_W + 1     # move ball just past the paddle
            play_bounce_sound()
        else:
            r_score += 1            # missed — player 2 scores
            play_score_sound()
            reset_ball()
            sleep(0.3)

    # Check right paddle collision
    if ball_x > WIDTH - PAD_W - BALL_SIZE - 1:
        top_p2    = p2_y
        bottom_p2 = p2_y + PAD_H
        if top_p2 < ball_y < bottom_p2:
            ball_x_dir = -1         # hit the paddle — bounce left
            ball_x = WIDTH - PAD_W - BALL_SIZE - 1
            play_bounce_sound()
        else:
            l_score += 1            # missed — player 1 scores
            play_score_sound()
            reset_ball()
            sleep(0.3)

    # Draw scores
    oled.text(str(l_score), WIDTH // 2 - 20, 5, 1)   # left score
    oled.text(str(r_score), WIDTH // 2 + 5,  5, 1)   # right score

    oled.show()                     # update the display
```

## What Each Section Does

| Section | What it does |
|---------|-------------|
| `valmap()` | Scales ADC readings (0–65535) to screen pixel positions |
| `read_paddles()` | Reads both potentiometers and converts to Y positions |
| `draw_paddle()` | Draws a 2×8 pixel rectangle at the correct position |
| Ball movement | Adds `ball_x_dir` and `ball_y_dir` each frame |
| Wall bounce | Flips the Y direction when the ball hits top or bottom |
| Paddle collision | Checks if the ball Y is inside the paddle range before bouncing |
| Score display | `oled.text()` draws the score numbers near the center line |

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    A **game loop** runs as fast as the hardware allows. Every pass through the loop is one "frame." Clear the screen, update positions, check collisions, draw everything, then repeat.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    If the ball moves too fast, add a short `sleep(0.01)` at the end of the loop to slow it down. If it moves too slow, remove the sleep. Balancing game speed is part of good game design!

## Experiments

1. Change `BALL_SIZE` to 5 or to 1. How does the ball size affect how hard the game is?
2. After each score, increase the ball's movement speed by 1 pixel per frame. Reset the speed when the score resets.
3. Add a winning condition: when one player reaches 5 points, show "PLAYER 1 WINS!" or "PLAYER 2 WINS!" on screen and stop the game.
4. Remove the `random` import and always start the ball going right-down. How does that change the fairness of the game?

!!! mascot-celebration "You Made a Video Game!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You have written a complete two-player video game from scratch! You used a game loop, input reading, collision detection, and scoring. These exact patterns are in every game ever made — from Pong to Minecraft. Be proud, coder!
