---
title: Robots and Mobile Systems
description: Differential-drive chassis, forward/backward/turn motion, line following with IR sensors, collision avoidance, motor deadband calibration, and ping-servo obstacle scanning.
generated_by: claude skill chapter-content-generator
date: 2026-06-12 23:40:00
version: 0.09
---

# Robots and Mobile Systems

## Summary

This chapter combines motors, sensors, and programming logic to build robots that move through the world on their own. You will start with a differential-drive chassis — two motors that steer by spinning at different speeds — and write programs for forward, backward, left, and right motion. Then you will add intelligence: a line sensor that keeps the robot on a track, a distance sensor that stops it before hitting a wall, and a ping-servo scanner that sweeps a sensor from side to side to map obstacles. You will also learn to calibrate motors and tune speed so your robot moves straight and reliably.

## Concepts Covered

This chapter covers the following 14 concepts from the learning graph:

1. Robot Chassis
2. Differential Drive
3. Forward/Backward Motion
4. Left/Right Turn Control
5. Line Follower Robot
6. Line Sensor (IR)
7. Collision Avoidance Robot
8. Obstacle Detection
9. Robot Calibration
10. Motor Deadband
11. Robot Speed Tuning
12. Ping-Servo Scanner
13. MicroSwitch Bumper Bot
14. Collision Avoidance Logic

## Prerequisites

This chapter builds on concepts from:

- [Chapter 9: Temperature, Humidity, and Distance Sensors](../09-temp-distance-sensors/index.md)
- [Chapter 12: Motors, Servos, and Stepper Motor Control](../12-motors-servos-steppers/index.md)

---

!!! mascot-welcome "Welcome to Chapter 13"
    ![Monty waves hello](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Every concept you have learned so far comes together in this chapter. Motors, sensors, PWM, interrupts, and control logic combine to create a robot that navigates on its own. Whether you build a line follower, a wall avoider, or a bumper bot — you are about to make something that moves through the world by itself. This is one of the most exciting chapters in the entire course!

## The Robot Chassis — Differential Drive

A **robot chassis** is the physical platform that holds your Pico, motors, wheels, and battery. For beginners, a two-wheel **differential drive** chassis is the most common design.

**Differential drive** means the robot has two independently driven wheels (one on the left, one on the right). There is no steering axle — the robot turns by making the two wheels spin at different speeds or in opposite directions:

| Motion | Left wheel | Right wheel |
|--------|-----------|------------|
| Forward | Forward | Forward |
| Backward | Backward | Backward |
| Left turn | Stop or backward | Forward |
| Right turn | Forward | Stop or backward |
| Spin left (pivot) | Backward | Forward |
| Spin right (pivot) | Forward | Backward |

A small castor wheel or ball bearing at the front (or back) provides stability without adding a third driven wheel.

### Wiring Two Motors

Using a DRV8833 dual-channel motor driver (Chapter 12), connect each motor to one H-bridge channel:

```python
from machine import Pin, PWM

# Left motor
l_in1 = Pin(6,  Pin.OUT)
l_in2 = Pin(7,  Pin.OUT)
l_pwm = PWM(Pin(8));  l_pwm.freq(10000)

# Right motor  
r_in1 = Pin(10, Pin.OUT)
r_in2 = Pin(11, Pin.OUT)
r_pwm = PWM(Pin(12)); r_pwm.freq(10000)

def move(left_speed, right_speed):
    """Speed: -65535 (full reverse) to 65535 (full forward)."""
    for speed, in1, in2, pwm in [
        (left_speed,  l_in1, l_in2, l_pwm),
        (right_speed, r_in1, r_in2, r_pwm)
    ]:
        if speed > 0:
            in1.value(1); in2.value(0); pwm.duty_u16(speed)
        elif speed < 0:
            in1.value(0); in2.value(1); pwm.duty_u16(-speed)
        else:
            in1.value(0); in2.value(0); pwm.duty_u16(0)

move(40000, 40000)   # forward at ~60% speed
```

## Motor Calibration — Making the Robot Go Straight

Real DC motors are not perfectly identical. Even motors from the same batch spin at slightly different speeds with the same PWM duty cycle. Without calibration, your robot veers to one side.

**Robot calibration** compensates for this difference by measuring how far each side drifts and adjusting the duty cycle of the faster motor downward.

**Motor deadband** is the minimum PWM duty cycle at which a motor actually starts moving. Below this threshold, the motor stalls without turning. The deadband depends on the motor and load — typically 10–25% duty cycle. Always set your minimum speed above the deadband.

**Robot speed tuning** is the process of adjusting the duty cycle difference between left and right motors until the robot drives straight. A good starting approach:

1. Place the robot on a flat surface with a straight tape line.
2. Drive forward for 1 meter at 50% speed.
3. Measure how far off the line the robot ends up.
4. Reduce the faster motor's duty cycle by 5% and repeat.
5. When the robot reliably drives straight, record the calibration values.

```python
CALIBRATION = 0.92   # right motor is 8% faster than left — apply this factor
right_duty = int(base_duty * CALIBRATION)
```

## Line Follower Robot

A **line follower robot** uses one or more **IR line sensors** (Chapter 11) to detect the contrast between a dark line and a light floor. The sensor array feeds back information to the robot's control loop, which steers the robot to stay on the line.

A two-sensor line follower uses a simple if-elif logic:

- Both sensors see floor (no line) → drive straight.
- Left sensor sees line, right sees floor → line is to the left → turn left.
- Right sensor sees line, left sees floor → line is to the right → turn right.
- Both sensors see line → on a junction → continue straight.

```python
left_ir  = Pin(16, Pin.IN)   # 0 = on line (dark), 1 = on floor (light)
right_ir = Pin(17, Pin.IN)

while True:
    L = left_ir.value()
    R = right_ir.value()

    if L == 1 and R == 1:     # both on floor
        move(40000, 40000)    # go straight
    elif L == 0 and R == 1:   # left sees line → turn left
        move(0, 40000)
    elif L == 1 and R == 0:   # right sees line → turn right
        move(40000, 0)
    else:                     # both on line (junction)
        move(40000, 40000)    # continue straight
```

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    The line follower logic above is simple but jerky — it swings from full left to full right. For smoother following, try a proportional controller: measure how far off the line you are (the "error") and turn proportionally to the error. A PID controller (Proportional-Integral-Derivative) is the professional version of this idea and is used in everything from thermostats to self-driving cars.

## Collision Avoidance Robot

A **collision avoidance robot** uses a distance sensor to detect walls and objects, then steers around them. This is the foundation of autonomous vacuum cleaners, warehouse robots, and self-driving cars.

**Obstacle detection** is the process of determining that something is in the robot's path. Using an HC-SR04 ultrasonic sensor mounted on the front:

```python
SAFE_DISTANCE_CM = 20   # stop and turn if closer than 20 cm

while True:
    dist = read_distance()          # from HC-SR04 (Chapter 9)
    if dist > SAFE_DISTANCE_CM:
        move(40000, 40000)          # drive forward
    else:
        move(0, 0)                  # stop
        utime.sleep(0.3)
        move(-30000, 30000)         # spin right to avoid obstacle
        utime.sleep(0.5)
```

**Collision avoidance logic** for a more capable robot includes:

1. Stop when an obstacle is detected within threshold distance.
2. Back up a small amount.
3. Scan left and right (ping-servo scanner) to find the open direction.
4. Turn toward the most open direction.
5. Resume forward motion.

## Ping-Servo Scanner

A **ping-servo scanner** mounts a distance sensor on a servo motor. The servo sweeps the sensor from side to side, and the robot records the distance at each angle — building a map of nearby obstacles.

```python
from machine import Pin, PWM
import utime

servo = PWM(Pin(16))
servo.freq(50)

def scan():
    distances = []
    for angle in range(0, 181, 15):     # 0° to 180° in 15° steps
        set_angle(angle)                # from Chapter 12
        utime.sleep_ms(200)             # wait for servo to settle
        dist = read_distance()          # from HC-SR04
        distances.append((angle, dist))
    return distances

scan_data = scan()
# Find the direction with the most open space
best_angle, best_dist = max(scan_data, key=lambda x: x[1])
print(f"Most open: {best_angle}° at {best_dist:.1f} cm")
```

## MicroSwitch Bumper Bot

A **MicroSwitch bumper bot** uses physical bump switches instead of (or in addition to) distance sensors. When the robot runs into an object, the switch triggers, the robot backs up and turns. Bumper bots are robust — they work in darkness, with reflective or transparent objects, and with any surface that a distance sensor might miss.

```python
left_bump  = Pin(18, Pin.IN, Pin.PULL_UP)   # active LOW: 0 = bumped
right_bump = Pin(19, Pin.IN, Pin.PULL_UP)

while True:
    if left_bump.value() == 0:     # left side hit something
        move(-30000, -30000)       # back up
        utime.sleep(0.3)
        move(30000, -30000)        # turn right
        utime.sleep(0.5)
    elif right_bump.value() == 0:  # right side hit something
        move(-30000, -30000)       # back up
        utime.sleep(0.3)
        move(-30000, 30000)        # turn left
        utime.sleep(0.5)
    else:
        move(40000, 40000)         # forward
```

#### Diagram: Collision Avoidance Logic Flowchart

<iframe src="../../sims/collision-avoidance-flowchart/main.html" width="100%" height="440px" scrolling="no"></iframe>

<details markdown="1">
<summary>Collision Avoidance Logic Flowchart MicroSim</summary>
Type: diagram
**sim-id:** collision-avoidance-flowchart<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Analyze (L4)
Bloom Verb: trace
Learning Objective: Students can trace the control flow of a collision avoidance algorithm and predict the robot's behavior given a set of sensor inputs.

Canvas layout:
- Top: distance sensor reading display (draggable slider)
- Center: animated flowchart: Read distance → Compare to threshold → Forward or Stop+Turn
- Bottom: top-down robot animation showing the chosen action

Visual elements:
- Flowchart diamonds and rectangles; active path highlighted in green
- Robot icon at bottom responds to the decision (moves forward, backs up, turns)

Interactive controls:
- createSlider() for "Distance reading" (0–100 cm); threshold line at 20 cm
- Robot animation plays the corresponding movement automatically
- Speed slider controls how fast the robot moves in the animation

Instructional Rationale: Connecting the sensor value to the active flowchart path and the robot's visible movement gives students a clear cause-effect understanding of the control loop.

Implementation: p5.js. Flowchart static; active path redrawn based on slider; robot drawn as a circle with a direction arrow, animated with translate/rotate.
</details>

## Key Takeaways

- **Differential drive** steers by spinning left and right motors at different speeds; no steering axle needed.
- `move(left_speed, right_speed)` accepts values from −65535 to 65535.
- **Motor deadband** is the minimum duty cycle that actually turns the motor; always operate above it.
- **Calibration** corrects for motor speed differences by adjusting the faster motor's duty cycle downward.
- A **line follower** reads left and right IR sensors and steers proportionally to keep the dark line centered.
- **Collision avoidance** stops the robot, backs up, and turns when a distance sensor detects an obstacle.
- A **ping-servo scanner** sweeps a distance sensor on a servo to map nearby open directions.
- A **bumper bot** uses physical switches — robust for surfaces that confuse optical sensors.

??? question "Quick Check: In a differential drive, how do you make the robot turn left? (Click to reveal)"
    **Run the right motor forward at full speed while the left motor stops (or runs backward).** Current flows only through the right wheel, pivoting the robot to the left.

!!! mascot-celebration "Your Robot Lives!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You have built a robot that can follow a line, dodge walls, and scan its environment — entirely in MicroPython. Next, Chapter 14 lights things up brilliantly with NeoPixels and non-graphical displays. Your projects are about to become a lot more colorful!
