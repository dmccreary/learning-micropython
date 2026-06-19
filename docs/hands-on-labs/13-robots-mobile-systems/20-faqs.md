# Robots Frequently Asked Questions

!!! mascot-welcome "Got Questions? Monty Has Answers!"
    ![Monty waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Building robots brings up a lot of great questions. Here are answers to the ones students ask most often.

## Why do we use a two-motor, three-wheel robot instead of a four-motor, four-wheel robot?

We tested both designs. A two-motor, three-wheel robot has two powered wheels at the back and one free-rolling caster wheel at the front. A four-motor, four-wheel robot has power on all four wheels. We found that the two-motor design teaches all the same ideas and costs less. It is also easier to build and has plenty of power for our projects. The simpler design means you spend more time coding and less time debugging hardware.

## Why do we use the L293D instead of the L298N motor driver?

The L293D and the L298N are both popular motor driver chips (a chip is a small electronic component that controls current). Both can drive two motors. The L293D costs less and has plenty of power for the small motors in our robot kit. We focus on teaching ideas with low-cost parts, so the L293D is a better fit. If you would like to compare them in detail, there is a side-by-side breakdown [here](https://www.etechnophiles.com/l293d-vs-l298n-motor-driver-differences-specifications-and-pinouts/).

!!! mascot-thinking "Key Idea"
    ![Monty thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    A motor driver chip sits between the Pico and the motors. The Pico sends tiny signals, and the motor driver uses battery power to spin the motors. The Pico alone is not strong enough to drive a motor directly.

## Why don't we build a remote control robot?

Remote control cars are very fun. But our goal is to teach you how to write programs that make decisions. A remote control car just does what you tell it with a joystick — it does not make any choices on its own. When your robot avoids a wall by itself, that is your *code* making a decision. That is a much more powerful skill to learn. We do have some wireless robot labs in the advanced section if you want to try remote control after you have learned the basics.

## Why do the motors keep running after I stop my program?

The Pico uses a separate built-in processor to generate the PWM (Pulse Width Modulation) signals that control the motors. PWM is a way to control motor speed using rapid on/off pulses. When your main program stops, the PWM signals keep going because that separate processor does not know to stop. You need to run a short "stop all motors" program to cut the power to all four motor pins. Keep that file open in a second tab in Thonny so you can run it quickly.

## The robot bumps into walls even though the distance sensor is working. What is wrong?

This usually means the `TURN_THRESHOLD` value is set too low. The threshold is the distance (in millimeters) at which the robot decides to turn. If it is too small, the robot gets very close before it reacts. Try raising the value in steps of 50 until the robot turns comfortably before hitting the wall. Also check that the sensor is pointing straight forward and is not tilted.

## The sensor gives strange readings when the batteries are low. Is that normal?

Yes. When batteries run low, the voltage drops. The distance sensor needs a steady 3.3 volts to work well. As the voltage drops, the sensor can give incorrect readings. Replace the batteries when the robot starts acting strangely. Fresh batteries fix this problem almost every time.

!!! mascot-tip "Monty's Tip"
    ![Monty giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Always keep a fresh set of batteries nearby when you are testing your robot. Weak batteries cause many mystery bugs that disappear as soon as you swap them out.

## Can I use rechargeable batteries?

Yes! Rechargeable AA batteries work well. Make sure they are fully charged before testing. Rechargeable batteries are also better for the environment because you use them over and over instead of throwing them away.

## How do I make the robot go faster or slower?

Change the `POWER_LEVEL` value in your code. The value ranges from 0 (stopped) to 65025 (full speed). A good range for most robots is 20000 to 50000. Very high speeds can make the robot hard to control and more likely to crash. Very low speeds may not be enough to overcome friction and the robot will not move.

## Why does "Right" mean the left side when the robot is facing me?

"Right" and "Left" always refer to the robot's own point of view — as if you were sitting inside the robot, looking forward. When the robot faces you, its right side is on your left. This is the same as how "passenger side" and "driver side" work in a car. Once you get used to thinking from the robot's point of view, it becomes natural.

!!! mascot-celebration "Keep Asking Great Questions!"
    ![Monty celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Every good engineer asks lots of questions. If you have a question that is not answered here, try it out on your robot and see what happens. Experimenting is the best way to learn!
