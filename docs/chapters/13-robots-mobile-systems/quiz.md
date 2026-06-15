# Quiz: Robots and Mobile Systems

Test your understanding of differential drive, line following, collision avoidance, and robot calibration with these questions.

---

#### 1. How does a differential drive robot turn left?

<div class="upper-alpha" markdown>
1. Both wheels spin backward at the same speed
2. The left wheel slows down or reverses while the right wheel continues forward
3. The front steering wheel rotates to the left using a servo
4. A third center wheel is raised to reduce friction
</div>

??? question "Show Answer"
    The correct answer is **B**. In differential drive, the robot turns by making the two wheels spin at different speeds or in different directions. To turn left: slow the left wheel (or run it backward) while the right wheel continues forward. The robot pivots to the left. A full pivot (spin in place) requires running one wheel forward and the other backward at the same speed.

    **Concept Tested:** Differential Drive / Left/Right Turn Control

---

#### 2. What table entry correctly describes the wheel commands for a differential drive robot spinning LEFT in place?

<div class="upper-alpha" markdown>
1. Left wheel forward, Right wheel forward
2. Left wheel backward, Right wheel backward
3. Left wheel backward, Right wheel forward
4. Left wheel stopped, Right wheel backward
</div>

??? question "Show Answer"
    The correct answer is **C**. To spin left in place (pivot), the right wheel runs forward and the left wheel runs backward simultaneously. Both wheels turn at the same speed but in opposite directions, causing the robot to rotate around its center point to the left. Running both wheels in the same direction produces forward or backward movement, not a pivot.

    **Concept Tested:** Differential Drive / Left/Right Turn Control

---

#### 3. What is the motor deadband, and how does it affect robot motion?

<div class="upper-alpha" markdown>
1. The maximum PWM duty cycle before the motor overheats
2. The speed range where both motors run at exactly the same rate
3. The minimum duty cycle at which a motor actually starts spinning — commands below this produce no movement
4. The delay time between reversing motor direction to protect the H-bridge
</div>

??? question "Show Answer"
    The correct answer is **C**. The motor deadband is the minimum duty cycle threshold where the motor overcomes its friction and actually starts turning. Below this value, the PWM signal turns on the transistors but the motor shaft does not rotate. Always set your minimum commanded speed above the deadband; otherwise your robot will sit still while the code "drives" it.

    **Concept Tested:** Motor Deadband / Robot Calibration

---

#### 4. A line-following robot's left IR sensor reads 0 (on the dark line) and the right sensor reads 1 (on the floor). What should the robot do?

<div class="upper-alpha" markdown>
1. Drive forward — the sensor pattern means the line is centered
2. Spin backward — the line is behind the robot
3. Turn left — the line is to the left, so steer toward it
4. Stop completely and wait for a new sensor reading
</div>

??? question "Show Answer"
    The correct answer is **C**. When the left sensor sees the dark line (reads 0) and the right sensor is on the floor (reads 1), the line is under the left sensor — meaning the robot has drifted too far right and the line is to its left. The robot must turn left to bring the line back to the center between the two sensors.

    **Concept Tested:** Line Follower Robot / Line Sensor (IR)

---

#### 5. A collision avoidance robot detects an obstacle at 15 cm using an HC-SR04, and its `SAFE_DISTANCE_CM` is set to 20 cm. What should the robot do?

<div class="upper-alpha" markdown>
1. Continue forward — 15 cm is a safe distance
2. Stop, back up, and turn to find an open path
3. Increase speed to pass the obstacle quickly
4. Switch to line-following mode to navigate around the object
</div>

??? question "Show Answer"
    The correct answer is **B**. The obstacle at 15 cm is closer than the 20 cm safe distance threshold. The collision avoidance logic should stop the motors, back up a short distance to create clearance, then turn away from the obstacle. A ping-servo scanner can help find the clearest direction before moving forward again.

    **Concept Tested:** Collision Avoidance Robot / Collision Avoidance Logic

---

#### 6. What does a ping-servo scanner do?

<div class="upper-alpha" markdown>
1. Sends a ping to each connected device to check if they are responsive
2. Mounts a distance sensor on a servo and sweeps it to map obstacles in multiple directions
3. Controls motor speed by reading PWM pulses from a remote control receiver
4. Uses a microphone to detect the distance to objects by measuring echo time
</div>

??? question "Show Answer"
    The correct answer is **B**. A ping-servo scanner mounts an ultrasonic or laser distance sensor on a servo motor. The servo sweeps from 0° to 180° in steps, and the robot records the distance at each angle. This builds a map of nearby obstacles so the robot can identify the direction with the most open space before choosing which way to turn.

    **Concept Tested:** Ping-Servo Scanner

---

#### 7. Why would a bumper bot with physical microswitches be more reliable than an ultrasonic sensor for certain environments?

<div class="upper-alpha" markdown>
1. Microswitches are faster to respond — they trigger in under 1 µs compared to 58 µs per cm for sound
2. Microswitches work in darkness and with transparent or sound-absorbing objects that confuse optical or acoustic sensors
3. Microswitches consume less power and allow the robot to run longer on batteries
4. Microswitches provide distance data in addition to simple contact detection
</div>

??? question "Show Answer"
    The correct answer is **B**. Ultrasonic sensors can be confused by soft, angled, or transparent surfaces that absorb or deflect sound. Optical IR sensors are affected by strong ambient light. A physical microswitch has no such limitations — it triggers when physically touched, regardless of surface material, color, or lighting conditions.

    **Concept Tested:** MicroSwitch Bumper Bot / Obstacle Detection

---

#### 8. During robot calibration, you discover your robot consistently drifts 10 cm to the right over a 1 m straight run. What adjustment should you make?

<div class="upper-alpha" markdown>
1. Increase the left motor's duty cycle to speed it up
2. Reduce the right motor's duty cycle by a small percentage to slow it down
3. Add a gyroscope to detect the drift and compensate in software
4. Swap the left and right motor connections in the code
</div>

??? question "Show Answer"
    The correct answer is **B**. The robot drifts right because the right motor is spinning slightly faster than the left. To correct this, reduce the right motor's duty cycle by a small percentage (apply a calibration factor less than 1.0) until the robot drives straight. Increasing the left motor's speed would also work but can cause the robot to exceed the intended speed.

    **Concept Tested:** Robot Calibration / Robot Speed Tuning

---

#### 9. A robot using two IR line sensors detects both sensors ON the dark line simultaneously. What does this indicate, and what should the robot do?

<div class="upper-alpha" markdown>
1. The robot is perfectly centered — continue straight at full speed
2. The robot is at a T-junction or crossing — continue straight as a default behavior
3. Both sensors have failed — stop and alert the user
4. The line is too wide for the sensor spacing — recalibrate the sensors
</div>

??? question "Show Answer"
    The correct answer is **B**. When both IR sensors simultaneously detect the dark line, the robot is at a wide section or a T-junction/crossing. For simple two-sensor line followers, the standard strategy is to continue forward through the junction. More advanced robots count junctions or use additional sensors to implement turn decisions at crossings.

    **Concept Tested:** Line Follower Robot / Collision Avoidance Logic

---

#### 10. In a `move(left_speed, right_speed)` function that accepts values from −65535 to 65535, what do negative values indicate?

<div class="upper-alpha" markdown>
1. An error — speed values must always be positive
2. A motor braking mode where the motor holds still
3. Reverse direction — the motor runs backward instead of forward
4. Percentage reduction from the maximum speed in forward direction
</div>

??? question "Show Answer"
    The correct answer is **C**. In the motor control function, positive values drive the motor forward and negative values drive it in reverse. For example, `move(-30000, 30000)` drives the left motor backward and the right motor forward, causing the robot to spin left. This sign convention makes it easy to express all six movement states (forward, backward, left, right, spin left, spin right) with a single function.

    **Concept Tested:** Forward/Backward Motion / Motor Direction Control

---
