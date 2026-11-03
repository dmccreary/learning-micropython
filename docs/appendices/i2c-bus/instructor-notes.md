---
title: "Appendix A: Instructor Notes for the I2C Bus"
description: A teaching guide for the I2C appendix, with a 45-minute lesson script, misconception probes, hardware setup, and an assessment rubric.
---

# Appendix A: Instructor Notes for the I2C Bus

These notes are for the person teaching [Appendix A: The I2C Bus](index.md).
The student appendix stands on its own, so you can also hand it out as self-paced
reading. This page gives you a lesson script, the misconceptions to watch for, and
what to do with real hardware.

The appendix is much longer than a chapter on purpose. It is a reference that goes
deeper than [Chapter 8](../../chapters/08-communication-protocols/index.md). You do not
need to teach all of it in one sitting. The lesson below uses three of the four MicroSims
and the two short code listings. The fourth is an optional extension.

## What Students Will Be Able to Do

| MicroSim | Bloom level | Students will be able to... |
|----------|-------------|-----------------------------|
| [I2C Bus Scanner](../../sims/i2c-scanner/index.md) | Understand | explain how a scan finds chips: the controller asks, and only the owner of the address answers with an ACK |
| [I2C Collision-Avoidance Robot](../../sims/i2c-collision-avoidance/index.md) | Apply | predict how the read rate and the robot's speed change how close the robot gets to a wall before it reacts, and read two data bytes as millimeters |
| [I2C Two Sensors in a Maze](../../sims/i2c-two-sensors-maze/index.md) | Understand | explain why two sensors on one bus are read in turns, and what an accelerometer and a gyroscope or compass each measure |
| [I2C Five-Device Sensor Fusion](../../sims/i2c-sensor-fusion/index.md) | Analyze | work out transaction times from byte counts, explain how a display update delays sensor reads, and explain why sensors are fused |

The two code listings add Python practice. `pretend_bus.py` uses a dictionary and a
loop. `braking_bug.py` uses shifts, OR and two's complement. Both run on the Pico (in
Thonny) or on any computer with Python.

## Hardware and Part Choices

The appendix uses these parts. You do **not** need any of them to teach it, because every
idea is in the MicroSims.

| Function | Part | Address | Notes |
|----------|------|---------|-------|
| Accelerometer and gyroscope | MPU-6050 (GY-521 board) | `0x68` | one chip, one address; powers up asleep. See [Chapter 10](../../chapters/10-motion-light-sensors/index.md) |
| Compass | HMC5883L (GY-271 board) | `0x1E` | the chip is discontinued; many boards carry a QMC5883L clone at `0x0D`. See the [compass page](../../sensors/11-compass.md) |
| Distance | VL53L0X | `0x29` | needs the book's `VL53L0X.py` driver. See the [VL53L0X page](../../sensors/07-VL53L0X_GY.md) |
| Battery monitor | INA219 | `0x40` | reports volts and amps, not percent, so students convert |
| Display | SSD1306 128x64 OLED | `0x3C` | some boards use `0x3D`. See [Chapter 15](../../chapters/15-oled-setup/index.md) |

With every board on the bus, the real scanner prints (in decimal) `30, 41, 60, 64, 104`.
In hex that is `0x1e, 0x29, 0x3c, 0x40, 0x68`.

**The compass clone is a gift.** Say a student's scan shows `0x0D`, not `0x1E`. They have
a QMC5883L. Do not fix it for them. Ask: "What does the scan tell us? What is different
about this chip?" It is a real engineering moment. It also shows that the address is how
you tell what is on the bus. If their board is a combo board (GY-86 or GY-87), the compass
hides behind the MPU-6050 until bypass mode is on (register `0x37`, bit 1).

**Safety.** The INA219 sits between a battery and the load. Keep students on USB power for
the bus exercises. If a LiPo battery is used, an adult makes the connections. Bare battery
wires must never touch.

## A 45-Minute Lesson

| Time | Activity | Materials |
|------|----------|-----------|
| 0-8 min | **Human bus** (no screens) | name cards with addresses |
| 8-18 min | Scanner MicroSim and pretend bus | MicroSim 1, `pretend_bus.py` |
| 18-28 min | Bytes to numbers, then two sensors | `braking_bug.py`, MicroSim 2 |
| 28-42 min | Five devices: break it, then fix it | MicroSim 3 |
| 42-45 min | Exit ticket | three questions below |

### Human Bus (8 minutes)

Pick three students to be chips. Give each a card with an address: `0x1E`, `0x3C`, `0x68`.
Everyone else watches. You are the controller. Call out addresses in order, fast:
"0x08? 0x09? 0x0A?..." The student whose card matches says "ACK". Nobody says anything
for the NACKs. That silence is the point. After a few rounds, ask:

- "Who talked first, me or the chips?"
- "How did you know when to answer?"
- "What happens if two students hold the same card?"

Then pick a fourth student to be the **pull-up resistor**. If nobody answers, they say
"high!" That makes the NACK something you can hear. It also explains why silence is an answer.

### Scanner and Pretend Bus (10 minutes)

1. Project the scanner MicroSim. Press **Step** a few times. Ask students to predict each result before the status line shows it.
2. Slow the speed slider to 1 and watch one address, bit by bit. Point out the START, the seven address bits, the write bit, and the ACK slot.
3. Turn on **Pause at each ACK** and let the scan run. Students shout when they see the first ACK.
4. Have students open `pretend_bus.py` in Thonny. Read the prediction question aloud before they run it.

### Bytes to Numbers and Two Sensors (10 minutes)

Do the bug-fix listing first. It takes about four minutes and sets up the maze. Students
now know a raw reading is two bytes and may be negative. Then project the maze MicroSim.
Ask students to predict the charts before pressing **Start**: "When will the gyroscope
spike? When will the accelerometer?"

Use the timeline to answer "are they read at the same time?" Switch the second sensor to
the compass. Ask what changed on the bus diagram (a different chip at a different address)
and what did not (the pattern of reads).

### Five Devices (14 minutes)

Run this as a series of one-line experiments on the projector:

| Try | Ask | What happens |
|-----|-----|--------------|
| defaults (400 kHz, display 10 per second) | which device uses the most time? | the display; the reads per second dip below 100 |
| display Off | what returns? | reads per second reach about 100 |
| 100 kHz, display 20 per second | predict the reads per second | the bus nears 100% busy and reads fall to about 10 |
| fix it with *one* change | which fix is cheapest? | display slower, or bus faster |
| **Bump the robot!** | which line do we trust? | the green fused line |

### Exit Ticket

1. Who starts every I2C conversation, and how does a chip say "I'm here"?
2. Two sensors seem to report at the same time. What is really happening?
3. Name one reason a screen update can make a sensor reading late.

### Optional Extension: Collision-Avoidance Robot (10 minutes)

Use this after the exit ticket, or as a follow-up lesson. It uses only one sensor, so it is
a good bridge to a real robot. The [collision-avoidance kit](../../kits/maker-pi-rp2040-robot/20-collision-avoidance-robot.md)
builds the same plan with motors.

1. Ask: "How many bumps will the robot make in one minute at the default settings?" (None.)
2. Press **Start**. Have students find the `TOO CLOSE!` line in the log and read its two bytes.
3. Set **Reads per second** to 1 and **Robot speed** to 40. Ask students to explain the bumps.
4. Ask for two fixes. (Read faster, drive slower, or raise the 15 cm limit in the code.)
5. After a minute, compare the left and right turn counts. They should be close, but not exactly equal.

## Misconceptions to Listen For

| Students say | What is going on | A question that helps |
|--------------|------------------|-----------------------|
| "The chips tell the Pico their address." | The Pico asks. The owner of the address answers with an ACK. | "In the scanner, who spoke first?" |
| "The sensors send data at the same time." | There is one conversation at a time. The reads are interleaved quickly. | "Can you find two blocks that overlap on the timeline?" |
| "`0x68` and 104 are different." | They are the same number in two bases. | "What does `hex(104)` print?" |
| "Two chips can share an address if they are different kinds." | The bus only sees the address, so both would answer. | "How would the Pico know which one replied?" |
| "A NACK means an error." | A NACK from a missing chip just means nobody is home. A controller's NACK ends a read on purpose. | "In the diagram, who sends the final NACK?" |
| "Averaging the sensors is fusion." | Fusion weights each sensor by what it is good at: quick changes from the gyroscope, long-term truth from the accelerometer. | "Why 98% and 2% and not 50% and 50%?" |
| "The robot always sees the wall." | It only knows the distance when a read finishes. Between reads it is driving blind. | "How far does the robot move between two reads?" |
| "A coin flip alternates left and right." | Each turn is a fresh 50/50 chance, so runs of the same direction happen. | "Can you find two left turns in a row?" |
| "A faster display is always better." | Each picture costs bus time that the sensors need. | "What did the display cost the gyroscope?" |

## Discussion Questions

1. Why do you think I2C uses wires that only pull down, with pull-up resistors, instead of letting chips push the wire high? (Safety when two chips talk at once, and the ACK trick.)
2. The MPU-6050 has a FIFO and an interrupt pin. How could those help the Pico in the five-device robot? (The chip collects samples by itself. The Pico reads a batch when the pin says so, instead of asking every 10 ms.)
3. Say the robot's display needs 20 pictures each second and its gyroscope needs 100 reads each second. What are two different designs that do both? (A second I2C bus for the display; or send only the changed part of the screen; or a faster clock.)
4. The battery chip only reports volts. Why is "percent" harder than it looks? (Voltage drops under load, and the discharge curve is not a straight line. That is why fuel-gauge chips exist.)

## Working with Real Hardware

1. Wire the bus exactly as in the appendix: SDA to GP0, SCL to GP1, 3.3 volts and ground to every board. Add one device at a time and scan after each one. Each new scan should show exactly one new address.
2. Ask students to predict the scan result before they plug anything in.
3. Use `i2c.scan()` in the Thonny shell first. Then run the longer scanner from the appendix. The [I2C scanner kit page](../../kits/maker-pi-rp2040-robot/09-i2c-scanner-test.md) has a shorter version.
4. When the bus works, read the identity registers: `WHO_AM_I` at `0x75` on the MPU-6050 (expect `0x68`), the model ID at `0xC0` on the VL53L0X (expect `0xEE`), and the three ID registers at `0x0A` to `0x0C` on a real HMC5883L (expect the letters "H43").
5. Optional: a cheap 8-channel USB logic analyzer and the free PulseView software include an I2C decoder. Showing the real START, address and ACK on a screen next to the MicroSim is a memorable demo.

If the scan finds nothing, work through the troubleshooting table in the appendix in
order: power first, then SDA and SCL swapped, then loose wires.

## Differentiation

- **Support:** Use only the scanner MicroSim and `pretend_bus.py`. Success is explaining ACK and NACK in their own words.
- **On level:** The full 45-minute lesson.
- **Extension:** Students work out the display picture time at 1 MHz (the SSD1306 may not support it, so ask why that matters). Or they change the filter constant `alpha` and describe the trade-off. Or they write the burst-read version of the motion loop.

## Assessment

Use the eight Quick Check questions at the end of the appendix (the answers are in the
collapsible boxes). Use this rubric for the experiments:

| Criterion | 4 - Exceeds | 3 - Meets | 2 - Approaching | 1 - Beginning |
|-----------|-------------|-----------|-----------------|---------------|
| Explains the scan | explains who asks, who answers and how, including NACK | explains ACK correctly | mentions addresses only | cannot explain |
| Converts bytes | handles negatives and units without a hint | converts with a hint | joins the bytes only | cannot join the bytes |
| Reasons about bus time | works out a time from bytes and speed, and proposes two fixes | explains why a picture blocks reads | notices the delay | does not notice |
| Explains fusion | explains both sensor flaws and how the filter cancels them | names one flaw of each sensor | says "it is more accurate" | cannot explain |

## What the MicroSims Simplify

Be honest with curious students about these simplifications:

- Bus times come from byte counts (nine bits for each byte, plus a few extra bits). Real MicroPython adds software time to each call, and chips can stretch the clock. So real reads take a bit longer.
- The VL53L0X's own measuring time (about 30 ms) is not shown. The book's `VL53L0X.py` driver also waits in a loop and checks a status register again and again. So a real `read()` can keep the Pico busy for up to about 30 ms.
- The battery drains far faster than a real one, so you can see it move.
- The noise on the accelerometer, gyroscope and compass is made up. The gyroscope's drift (a 6 degree per second error) is large on purpose. The MPU-6050 datasheet allows an uncalibrated offset of up to 20 degrees per second.
- Time in the five-device MicroSim runs in slow motion (10% by default) so students can follow it. The world, the Pico and the bus all slow down together.

See the [Annotated References](references.md) for the sources behind the numbers.
