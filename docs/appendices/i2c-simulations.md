---
title: I2C Simulations
description: The five interactive I2C MicroSims in one place - start bit and address framing, a bus scanner, a collision-avoidance robot, two sensors in a maze, and five devices with sensor fusion.
---

# I2C Simulations

These five MicroSims go with [Appendix A: The I2C Bus](i2c-bus/index.md). Do them in
order. Each one builds on the one before it.

<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:18px;margin-top:1.5em;">
  <a href="../../sims/i2c-start-bit-framing/" title="1. I2C Start Bit and Address Framing" style="display:block;border:1px solid #e3e7ec;border-radius:8px;overflow:hidden;text-decoration:none;color:inherit;box-shadow:0 1px 3px rgba(0,0,0,0.08);"><img src="../../sims/i2c-start-bit-framing/i2c-start-bit-framing.png" alt="I2C Start Bit and Address Framing MicroSim showing a step-through bus frame, two device listening-state panels and synchronized driver pseudocode" loading="lazy" style="width:100%;aspect-ratio:16/10;object-fit:cover;background:#f5f7fa;display:block;border-bottom:1px solid #eee;"><span style="display:block;padding:9px 11px;font-size:0.9rem;font-weight:600;line-height:1.3;">1. I2C Start Bit and Address Framing</span></a>
  <a href="../../sims/i2c-scanner/" title="2. I2C Bus Scanner" style="display:block;border:1px solid #e3e7ec;border-radius:8px;overflow:hidden;text-decoration:none;color:inherit;box-shadow:0 1px 3px rgba(0,0,0,0.08);"><img src="../../sims/i2c-scanner/i2c-scanner.png" alt="I2C Bus Scanner MicroSim showing a Pico, three chips, clock and data traces, and an address map" loading="lazy" style="width:100%;aspect-ratio:16/10;object-fit:cover;background:#f5f7fa;display:block;border-bottom:1px solid #eee;"><span style="display:block;padding:9px 11px;font-size:0.9rem;font-weight:600;line-height:1.3;">2. I2C Bus Scanner</span></a>
  <a href="../../sims/i2c-collision-avoidance/" title="3. I2C Collision-Avoidance Robot" style="display:block;border:1px solid #e3e7ec;border-radius:8px;overflow:hidden;text-decoration:none;color:inherit;box-shadow:0 1px 3px rgba(0,0,0,0.08);"><img src="../../sims/i2c-collision-avoidance/i2c-collision-avoidance.png" alt="I2C Collision-Avoidance Robot MicroSim showing a top view of a robot in an arena, the I2C frame and a distance chart" loading="lazy" style="width:100%;aspect-ratio:16/10;object-fit:cover;background:#f5f7fa;display:block;border-bottom:1px solid #eee;"><span style="display:block;padding:9px 11px;font-size:0.9rem;font-weight:600;line-height:1.3;">3. I2C Collision-Avoidance Robot</span></a>
  <a href="../../sims/i2c-two-sensors-maze/" title="4. I2C Two Sensors in a Maze" style="display:block;border:1px solid #e3e7ec;border-radius:8px;overflow:hidden;text-decoration:none;color:inherit;box-shadow:0 1px 3px rgba(0,0,0,0.08);"><img src="../../sims/i2c-two-sensors-maze/i2c-two-sensors-maze.png" alt="I2C Two Sensors in a Maze MicroSim showing a robot in a maze, sensor charts and a bus timeline" loading="lazy" style="width:100%;aspect-ratio:16/10;object-fit:cover;background:#f5f7fa;display:block;border-bottom:1px solid #eee;"><span style="display:block;padding:9px 11px;font-size:0.9rem;font-weight:600;line-height:1.3;">4. I2C Two Sensors in a Maze</span></a>
  <a href="../../sims/i2c-sensor-fusion/" title="5. I2C Five-Device Sensor Fusion" style="display:block;border:1px solid #e3e7ec;border-radius:8px;overflow:hidden;text-decoration:none;color:inherit;box-shadow:0 1px 3px rgba(0,0,0,0.08);"><img src="../../sims/i2c-sensor-fusion/i2c-sensor-fusion.png" alt="I2C Five-Device Sensor Fusion MicroSim showing five devices on one bus, a to-scale timeline and a tilt chart" loading="lazy" style="width:100%;aspect-ratio:16/10;object-fit:cover;background:#f5f7fa;display:block;border-bottom:1px solid #eee;"><span style="display:block;padding:9px 11px;font-size:0.9rem;font-weight:600;line-height:1.3;">5. I2C Five-Device Sensor Fusion</span></a>
</div>

## What Each MicroSim Shows

1. **I2C Start Bit and Address Framing.** Step through a real transaction byte by byte: a controller writes a 16-bit memory address to an EEPROM, then reads a byte back, while an LCD shares the same bus. See exactly when a device checks the bus for its own address, and why it can't be confused by another device's data bytes.
2. **I2C Bus Scanner.** The Pico asks every address, "is anyone there?" Chips answer with an ACK. Unplug a chip and scan again.
3. **I2C Collision-Avoidance Robot.** One distance sensor on the I2C bus steers a robot. Within 15 cm of a wall, the robot backs up 20 cm and flips a coin to turn left or right. Slow the reads down and watch it bump.
4. **I2C Two Sensors in a Maze.** A robot drives a maze. The Pico reads an accelerometer, then a gyroscope or a compass, taking turns on one bus.
5. **I2C Five-Device Sensor Fusion.** Five devices share one bus. See a display picture block the sensors. Then fuse the accelerometer and the gyroscope into one clean angle.
