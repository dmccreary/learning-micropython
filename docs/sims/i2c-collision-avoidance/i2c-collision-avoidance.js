// I2C Collision-Avoidance Robot MicroSim
// CANVAS_HEIGHT: 677
// A robot drives around a rectangular arena (top view) with ONE sensor: a VL53L0X
// distance sensor on the I2C bus at address 0x29. The Pico reads the sensor again
// and again. When the distance is 15 cm or less, the robot backs up 20 cm, flips a
// coin, and turns left or right. The I2C bytes and distance values are shown live.
// Same logic as the book's Maker Pi RP2040 collision-avoidance robot:
//   if distance < TURN_DIST: reverse(); sleep(REVERSE_TIME); turn right or left
// Bloom level: Apply (use, predict) - read rate and speed sliders.
// MicroSim template version 2026.03

// global variables for width and height
let containerWidth;
let canvasWidth = 400;
let drawHeight = 592;
let controlHeight = 85;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 330;
let defaultTextSize = 16;

// laid out for a 680 px wide design; narrower containers scale the picture down
const DESIGN_W = 680;
let s = 1;
let lw = 680;

// ---- the world (everything in centimeters) ----
const ARENA_W = 100;      // arena width in cm
const ARENA_H = 70;       // arena height in cm
const ROBOT_L = 14;       // robot length in cm
const ROBOT_W = 11;       // robot width in cm
const TRIGGER_CM = 15;    // back up when the sensor reads this close or closer
const BACKUP_CM = 20;     // how far to back up
const TURN_DEG = 90;      // size of each turn
const TURN_RATE = 120;    // degrees per second while turning
const CONE_DEG = 12.5;    // the sensor sees a narrow cone, about 25 degrees wide
const MAX_MM = 1200;      // our lab caps the raw reading at 1200 mm

// pixel layout of the arena inside its panel
const PX_PER_CM = 3.5;
const ARENA_X = 25;
const ARENA_Y = 78;

// ---- robot state ----
let robot = { x: 28, y: 30, heading: 25 }; // heading in degrees, 0 = east, clockwise on screen
let mode = 'forward';     // 'forward' | 'backup' | 'turn'
let backedCm = 0;         // how far we have backed up this time
let turnLeft = 0;         // degrees still to turn
let turnDir = 0;          // +1 = right, -1 = left
let lastCoin = '';        // result of the last coin flip
let bumpFlash = 0;        // seconds left to show "BUMP!"
let trail = [];
let counts = { reads: 0, backups: 0, left: 0, right: 0, bumps: 0 };

// ---- run state ----
let isRunning = false;    // MicroSims open paused
let tMs = 0;              // simulation clock in milliseconds
let nextPollAt = 0;
let txns = [];            // I2C transactions {t0, t1, mm, hi, lo, done, decided}
let readingHistory = [];         // {t, cm, mode} for the chart
let busLog = [];          // lines for the console panel
let lastRead = null;      // latest completed reading {mm, hi, lo}

// ---- controls ----
let startButton, resetButton, rateSlider, speedSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, totalHeight());
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  startButton = createButton('Start');
  startButton.parent(mainElement);
  startButton.mousePressed(toggleRun);

  resetButton = createButton('Reset');
  resetButton.parent(mainElement);
  resetButton.mousePressed(resetSim);

  rateSlider = createSlider(1, 30, 10, 1);
  rateSlider.parent(mainElement);

  speedSlider = createSlider(10, 40, 20, 1);
  speedSlider.parent(mainElement);

  layoutControls();
  resetSim();

  describe('A top view of a small robot driving inside a rectangular arena. A single VL53L0X distance sensor on the I2C bus measures the distance ahead. When the reading is 15 centimeters or less, the robot backs up 20 centimeters, then flips a coin and turns left or right. Panels show the I2C bus transaction bytes, the distance value, a chart of recent readings and a log of reads.', LABEL);
}

// ---------- controls ----------

function layoutControls() {
  let dh = drawAreaHeight();
  let row1 = dh + 8;
  startButton.position(10, row1);
  resetButton.position(70, row1);
  rateSlider.position(sliderLeftMargin, row1 + 2);
  rateSlider.size(max(60, canvasWidth - sliderLeftMargin - margin));
  speedSlider.position(sliderLeftMargin, dh + 46);
  speedSlider.size(max(60, canvasWidth - sliderLeftMargin - margin));
}

function toggleRun() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function resetSim() {
  isRunning = false;
  startButton.html('Start');
  robot = { x: 28, y: 30, heading: 25 };
  mode = 'forward';
  backedCm = 0;
  turnLeft = 0;
  turnDir = 0;
  lastCoin = '';
  bumpFlash = 0;
  trail = [];
  counts = { reads: 0, backups: 0, left: 0, right: 0, bumps: 0 };
  tMs = 0;
  nextPollAt = 0;
  txns = [];
  readingHistory = [];
  busLog = [];
  // show the first reading before the learner presses Start
  lastRead = makeReading(readSensorMm());
}

function pollPeriod() {
  return 1000 / rateSlider.value();
}

function robotSpeed() {
  return speedSlider.value();   // cm per second
}

// ---------- geometry and the distance sensor ----------

function sensorPos() {
  let a = radians(robot.heading);
  return { x: robot.x + Math.cos(a) * ROBOT_L / 2, y: robot.y + Math.sin(a) * ROBOT_L / 2 };
}

// distance from a point to the arena walls along one direction (cm)
function castRay(px, py, angDeg) {
  let dx = Math.cos(radians(angDeg)), dy = Math.sin(radians(angDeg));
  let best = 1e9;
  if (dx > 1e-9) best = Math.min(best, (ARENA_W - px) / dx);
  if (dx < -1e-9) best = Math.min(best, (0 - px) / dx);
  if (dy > 1e-9) best = Math.min(best, (ARENA_H - py) / dy);
  if (dy < -1e-9) best = Math.min(best, (0 - py) / dy);
  return Math.max(0, best);
}

// the sensor reports the closest thing inside its cone
function trueDistanceCm() {
  let p = sensorPos();
  let d = castRay(p.x, p.y, robot.heading);
  d = Math.min(d, castRay(p.x, p.y, robot.heading - CONE_DEG));
  d = Math.min(d, castRay(p.x, p.y, robot.heading + CONE_DEG));
  return d;
}

// what the VL53L0X would send back: millimeters, with a little noise
function readSensorMm() {
  let mm = trueDistanceCm() * 10 + randomGaussian(0, 3);
  return constrain(Math.round(mm), 30, MAX_MM);
}

function makeReading(mm) {
  return { mm: mm, hi: (mm >> 8) & 0xFF, lo: mm & 0xFF };
}

// ---------- the simulation: one time step ----------

function advanceWorld(dtSec) {
  tMs += dtSec * 1000;
  runPolling();
  moveRobot(dtSec);
  bumpFlash = max(0, bumpFlash - dtSec);
  // keep a short trail of where the robot has been
  let last = trail[trail.length - 1];
  if (!last || dist(last.x, last.y, robot.x, robot.y) > 1.2) {
    trail.push({ x: robot.x, y: robot.y });
    if (trail.length > 260) trail.shift();
  }
}

function txnDuration() {
  return min(120, 0.4 * pollPeriod());
}

function runPolling() {
  // start any reads that are due
  while (nextPollAt <= tMs) {
    let mm = readSensorMm();
    txns.push({ t0: nextPollAt, t1: nextPollAt + txnDuration(), mm: mm, done: false });
    nextPollAt += pollPeriod();
  }
  // finish reads whose bytes have arrived
  for (let i = 0; i < txns.length; i++) {
    let x = txns[i];
    if (!x.done && tMs >= x.t1) {
      x.done = true;
      finishRead(x);
    }
  }
  txns = txns.filter((x) => x.t1 > tMs - 3000);
}

// the Pico has the two bytes: decode them and decide what to do
function finishRead(x) {
  lastRead = makeReading(x.mm);
  counts.reads++;
  let cm = x.mm / 10;
  let tag = 'forward';
  if (mode === 'backup') tag = 'backing up';
  if (mode === 'turn') tag = 'turning';
  if (mode === 'forward' && x.mm <= TRIGGER_CM * 10) {
    tag = 'TOO CLOSE!';
    startBackup();
  }
  readingHistory.push({ t: x.t1 / 1000, cm: cm, mode: mode === 'backup' || tag === 'TOO CLOSE!' ? 'backup' : mode });
  readingHistory = readingHistory.filter((h) => h.t > tMs / 1000 - 12);
  busLog.push({ t: x.t1 / 1000, hi: lastRead.hi, lo: lastRead.lo, mm: x.mm, tag: tag });
  if (busLog.length > 40) busLog.shift();
}

function startBackup() {
  mode = 'backup';
  backedCm = 0;
  counts.backups++;
}

function startTurn() {
  mode = 'turn';
  // flip a coin, like the book's code: if urandom.random() < .5 turn right, else left
  if (Math.random() < 0.5) {
    turnDir = 1;
    lastCoin = 'RIGHT';
    counts.right++;
  } else {
    turnDir = -1;
    lastCoin = 'LEFT';
    counts.left++;
  }
  turnLeft = TURN_DEG;
}

function moveRobot(dtSec) {
  let a = radians(robot.heading);
  if (mode === 'forward') {
    let stepCm = robotSpeed() * dtSec;
    // stop at the wall: the front of the robot cannot pass it
    let ahead = castRay(sensorPos().x, sensorPos().y, robot.heading);
    if (ahead <= stepCm + 0.4) {
      counts.bumps++;
      bumpFlash = 0.8;
      startBackup();
      return;
    }
    robot.x += Math.cos(a) * stepCm;
    robot.y += Math.sin(a) * stepCm;
  } else if (mode === 'backup') {
    let stepCm = min(robotSpeed() * dtSec, BACKUP_CM - backedCm);
    robot.x -= Math.cos(a) * stepCm;
    robot.y -= Math.sin(a) * stepCm;
    backedCm += stepCm;
    // a wall behind the robot also stops it
    let hitBack = robot.x < ROBOT_L / 2 || robot.x > ARENA_W - ROBOT_L / 2 || robot.y < ROBOT_L / 2 || robot.y > ARENA_H - ROBOT_L / 2;
    robot.x = constrain(robot.x, ROBOT_L / 2, ARENA_W - ROBOT_L / 2);
    robot.y = constrain(robot.y, ROBOT_L / 2, ARENA_H - ROBOT_L / 2);
    if (backedCm >= BACKUP_CM - 1e-6 || hitBack) startTurn();
  } else if (mode === 'turn') {
    let stepDeg = min(TURN_RATE * dtSec, turnLeft);
    robot.heading += turnDir * stepDeg;
    turnLeft -= stepDeg;
    if (turnLeft <= 1e-6) {
      robot.heading = ((robot.heading % 360) + 360) % 360;
      mode = 'forward';
    }
  }
}

// ---------- main draw loop ----------

function draw() {
  updateCanvasSize();
  s = min(1, canvasWidth / DESIGN_W);
  lw = canvasWidth / s;

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawAreaHeight());
  fill('white');
  rect(0, drawAreaHeight(), canvasWidth, ctrlHeight());

  if (isRunning) advanceWorld(min(deltaTime, 100) / 1000);

  push();
  scale(s);
  drawTitle();
  drawArena(14, 52, 372, 277);
  drawBrainPanel(396, 52, lw - 410, 277);
  drawBusPanel(14, 338, lw - 28, 118);
  drawChart(14, 464, 372, 120);
  drawLogPanel(396, 464, lw - 410, 120);
  pop();

  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(22);
  text('I2C Collision-Avoidance Robot', lw / 2, 4);
  textSize(14);
  fill('dimgray');
  let msg;
  if (!isRunning && tMs === 0) msg = 'Paused: press Start. One distance sensor on the I2C bus steers the whole robot.';
  else if (!isRunning) msg = 'Paused. Press Resume to keep driving.';
  else if (mode === 'forward') msg = 'Driving forward. The Pico reads the sensor ' + rateSlider.value() + ' times a second.';
  else if (mode === 'backup') msg = 'Too close! Backing up ' + BACKUP_CM + ' cm.';
  else msg = 'Coin flip says ' + lastCoin + '. Turning ' + lastCoin.toLowerCase() + '.';
  text(msg, lw / 2, 30);
}

// ---------- arena and robot (top view) ----------

function arenaPx(xCm, yCm) {
  return { x: ARENA_X + xCm * PX_PER_CM, y: ARENA_Y + yCm * PX_PER_CM };
}

function drawArena(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Top view (' + ARENA_W + ' x ' + ARENA_H + ' cm)', x + 10, y + 5);
  fill('dimgray');
  textSize(12);
  textAlign(RIGHT, TOP);
  text('dashed arc = the ' + TRIGGER_CM + ' cm line', x + w - 10, y + 6);

  // floor and walls
  let a0 = arenaPx(0, 0);
  stroke('slategray');
  strokeWeight(5);
  fill('whitesmoke');
  rect(a0.x, a0.y, ARENA_W * PX_PER_CM, ARENA_H * PX_PER_CM);

  // trail
  noFill();
  stroke('lightskyblue');
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < trail.length; i++) {
    let p = arenaPx(trail[i].x, trail[i].y);
    vertex(p.x, p.y);
  }
  endShape();

  // sensor cone, 15 cm danger arc and the measured hit point
  let sp = sensorPos();
  let sp0 = arenaPx(sp.x, sp.y);
  let dCenter = castRay(sp.x, sp.y, robot.heading);
  let dLeft = castRay(sp.x, sp.y, robot.heading - CONE_DEG);
  let dRight = castRay(sp.x, sp.y, robot.heading + CONE_DEG);
  let hit = arenaPx(sp.x + Math.cos(radians(robot.heading)) * dCenter, sp.y + Math.sin(radians(robot.heading)) * dCenter);
  let hitL = arenaPx(sp.x + Math.cos(radians(robot.heading - CONE_DEG)) * dLeft, sp.y + Math.sin(radians(robot.heading - CONE_DEG)) * dLeft);
  let hitR = arenaPx(sp.x + Math.cos(radians(robot.heading + CONE_DEG)) * dRight, sp.y + Math.sin(radians(robot.heading + CONE_DEG)) * dRight);
  noStroke();
  fill(255, 99, 71, 45);
  triangle(sp0.x, sp0.y, hitL.x, hitL.y, hitR.x, hitR.y);
  stroke('tomato');
  strokeWeight(1.5);
  line(sp0.x, sp0.y, hit.x, hit.y);
  noStroke();
  fill('crimson');
  circle(hit.x, hit.y, 7);

  // dashed arc 15 cm in front of the sensor
  push();
  translate(sp0.x, sp0.y);
  rotate(radians(robot.heading));
  noFill();
  stroke('firebrick');
  strokeWeight(2);
  drawingContext.setLineDash([5, 4]);
  arc(0, 0, TRIGGER_CM * PX_PER_CM * 2, TRIGGER_CM * PX_PER_CM * 2, radians(-35), radians(35));
  drawingContext.setLineDash([]);
  pop();

  drawRobot();

  // the distance label near the sensor, on the side of the arena center
  if (lastRead) {
    let label = (lastRead.mm / 10).toFixed(1) + ' cm';
    textSize(13);
    let tw = textWidth(label) + 12;
    let lx = constrain(hit.x - tw / 2, a0.x + 4, a0.x + ARENA_W * PX_PER_CM - tw - 4);
    let ly = constrain(hit.y - 28, a0.y + 4, a0.y + ARENA_H * PX_PER_CM - 24);
    fill(255, 255, 255, 235);
    stroke('crimson');
    strokeWeight(1);
    rect(lx, ly, tw, 20, 6);
    noStroke();
    fill('crimson');
    textAlign(CENTER, CENTER);
    text(label, lx + tw / 2, ly + 10);
  }

  // BUMP flash
  if (bumpFlash > 0) {
    noStroke();
    fill('crimson');
    textAlign(CENTER, CENTER);
    textSize(22);
    text('BUMP!', a0.x + ARENA_W * PX_PER_CM / 2, a0.y + 24);
  }

}

function drawRobot() {
  let c = arenaPx(robot.x, robot.y);
  let L = ROBOT_L * PX_PER_CM, Wd = ROBOT_W * PX_PER_CM;
  push();
  translate(c.x, c.y);
  rotate(radians(robot.heading));
  // wheels
  stroke('black');
  strokeWeight(1);
  fill('dimgray');
  rect(-L * 0.32, -Wd / 2 - 3, L * 0.4, 7, 2);
  rect(-L * 0.32, Wd / 2 - 4, L * 0.4, 7, 2);
  // body
  stroke('midnightblue');
  fill(mode === 'backup' ? 'orange' : (mode === 'turn' ? 'mediumpurple' : 'dodgerblue'));
  rect(-L / 2, -Wd / 2, L, Wd, 6);
  // the Pico on top
  noStroke();
  fill('seagreen');
  rect(-L * 0.35, -Wd * 0.25, L * 0.45, Wd * 0.5, 2);
  // the distance sensor at the front
  fill('teal');
  stroke('midnightblue');
  rect(L / 2 - 6, -Wd * 0.28, 7, Wd * 0.56, 2);
  // an arrow showing which way is forward
  noStroke();
  fill('gold');
  triangle(L * 0.2, 0, L * 0.02, -5, L * 0.02, 5);
  pop();
}

// ---------- the robot brain panel ----------

function drawBrainPanel(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  let ix = x + 12, iw = w - 24;
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  text('What the robot is doing', ix, y + 7);

  // state pill
  let col = mode === 'forward' ? 'seagreen' : (mode === 'backup' ? 'darkorange' : 'mediumpurple');
  let label = mode === 'forward' ? 'FORWARD' : (mode === 'backup' ? 'BACKING UP' : 'TURNING ' + lastCoin);
  fill(col);
  rect(ix, y + 30, iw, 34, 17);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(17);
  text(label, ix + iw / 2, y + 47);

  // progress line
  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(12);
  if (mode === 'forward') {
    text('Driving at ' + robotSpeed() + ' cm per second', ix, y + 70);
  } else if (mode === 'backup') {
    text('Backed up ' + backedCm.toFixed(1) + ' of ' + BACKUP_CM + ' cm', ix, y + 70);
    drawBar(ix, y + 86, iw, 8, backedCm / BACKUP_CM, 'darkorange');
  } else {
    text('Coin flip: ' + lastCoin + '. Turned ' + (TURN_DEG - turnLeft).toFixed(0) + ' of ' + TURN_DEG + ' degrees', ix, y + 70);
    drawBar(ix, y + 86, iw, 8, (TURN_DEG - turnLeft) / TURN_DEG, 'mediumpurple');
  }

  // distance reading
  fill('dimgray');
  textSize(12);
  text('The distance sensor says:', ix, y + 104);
  let mm = lastRead ? lastRead.mm : 0;
  let tooClose = mm <= TRIGGER_CM * 10;
  fill(tooClose ? 'crimson' : 'black');
  textSize(34);
  textAlign(LEFT, TOP);
  text((mm / 10).toFixed(1) + ' cm', ix, y + 118);
  fill('dimgray');
  textSize(12);
  text('= ' + mm + ' millimeters', ix + 140, y + 138);

  // gauge from 0 to 100 cm with the 15 cm line
  let gy = y + 164;
  noStroke();
  fill('mistyrose');
  rect(ix, gy, iw * TRIGGER_CM / 100, 14);
  fill('honeydew');
  rect(ix + iw * TRIGGER_CM / 100, gy, iw * (100 - TRIGGER_CM) / 100, 14);
  noFill();
  stroke('silver');
  rect(ix, gy, iw, 14);
  stroke('crimson');
  strokeWeight(2);
  line(ix + iw * TRIGGER_CM / 100, gy - 3, ix + iw * TRIGGER_CM / 100, gy + 17);
  let mx = ix + iw * constrain(mm / 10, 0, 100) / 100;
  noStroke();
  fill(tooClose ? 'crimson' : 'midnightblue');
  triangle(mx, gy - 2, mx - 5, gy - 9, mx + 5, gy - 9);
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, TOP);
  text('0', ix, gy + 17);
  textAlign(RIGHT, TOP);
  text('100 cm', ix + iw, gy + 17);
  fill('crimson');
  textAlign(CENTER, TOP);
  text('15', ix + iw * TRIGGER_CM / 100 + 6, gy + 17);

  // the rule and the counters
  fill('black');
  textAlign(LEFT, TOP);
  textSize(12);
  text('if distance <= ' + TRIGGER_CM + ' cm:  back up ' + BACKUP_CM + ' cm,', ix, y + 210);
  text('flip a coin, turn left or right.', ix, y + 224);
  fill('dimgray');
  text('Reads: ' + counts.reads + '    Back-ups: ' + counts.backups + '    Bumps: ' + counts.bumps, ix, y + 242);
  text('Left turns: ' + counts.left + '    Right turns: ' + counts.right, ix, y + 258);
}

function drawBar(x, y, w, h, frac, col) {
  noStroke();
  fill('gainsboro');
  rect(x, y, w, h, 4);
  fill(col);
  rect(x, y, w * constrain(frac, 0, 1), h, 4);
}

// ---------- the I2C bus panel ----------

function frameBoxes(active, reached) {
  let src = active ? makeReading(active.mm) : lastRead;
  let hi = src ? src.hi : 0, lo = src ? src.lo : 0;
  let hx = (n) => n.toString(16).toUpperCase().padStart(2, '0');
  // bytes the Pico has not received yet show as ??
  let hiText = active && reached < 5 ? '??' : hx(hi);
  let loText = active && reached < 6 ? '??' : hx(lo);
  return [
    { label: 'S', cap: 'start', w: 44, kind: 'M' },
    { label: '0x29 W', cap: 'chip + write', w: 84, kind: 'C' },
    { label: 'reg 0x1E', cap: 'register', w: 78, kind: 'C' },
    { label: 'Sr', cap: 'restart', w: 44, kind: 'M' },
    { label: '0x29 R', cap: 'chip + read', w: 84, kind: 'C' },
    { label: hiText, cap: 'high byte', w: 84, kind: 'T' },
    { label: loText, cap: 'low byte', w: 84, kind: 'T' },
    { label: 'P', cap: 'stop', w: 44, kind: 'M' }
  ];
}

function drawBusPanel(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  text('The I2C bus: the Pico reads the VL53L0X distance sensor', x + 10, y + 5);

  // current transaction (for the packet and the highlighted frame box)
  let active = null;
  for (let i = 0; i < txns.length; i++) {
    if (tMs >= txns[i].t0 && tMs < txns[i].t1) active = txns[i];
  }
  let prog = active ? (tMs - active.t0) / (active.t1 - active.t0) : -1;

  // Pico, wires and the sensor
  let cx = x + 14, sclY = y + 38, sdaY = y + 56;
  stroke('midnightblue');
  strokeWeight(2);
  fill('lavender');
  rect(cx, y + 28, 58, 38, 8);
  noStroke();
  fill('midnightblue');
  textAlign(CENTER, CENTER);
  textSize(13);
  text('Pico', cx + 29, y + 47);
  let devX = x + 270, devW = 124;
  strokeWeight(3);
  stroke('purple');
  line(cx + 58, sclY, devX, sclY);
  stroke('navy');
  line(cx + 58, sdaY, devX, sdaY);
  noStroke();
  fill('purple');
  textSize(12);
  textAlign(CENTER, BOTTOM);
  text('SCL clock', (cx + 58 + devX) / 2, sclY - 2);
  fill('navy');
  textAlign(CENTER, TOP);
  text('SDA data', (cx + 58 + devX) / 2, sdaY + 3);
  let busy = active !== null;
  stroke(busy ? 'limegreen' : 'teal');
  strokeWeight(busy ? 4 : 2);
  fill(busy ? 'honeydew' : 'white');
  rect(devX, y + 26, devW, 42, 8);
  noStroke();
  fill('teal');
  textAlign(CENTER, CENTER);
  textSize(14);
  text('VL53L0X', devX + devW / 2, y + 41);
  fill('black');
  textFont('monospace');
  textSize(14);
  text('0x29 (41)', devX + devW / 2, y + 57);
  textFont('sans-serif');
  // the packet
  if (active) {
    let tapX = devX - 6;
    let px, fillCol, strokeCol;
    if (prog < 0.4) {
      px = lerp(cx + 62, tapX, prog / 0.4);
      fillCol = 'white';
      strokeCol = 'navy';
    } else {
      px = lerp(tapX, cx + 62, (prog - 0.4) / 0.6);
      fillCol = 'limegreen';
      strokeCol = 'darkgreen';
    }
    stroke(strokeCol);
    strokeWeight(2);
    fill(fillCol);
    circle(px, sdaY, 13);
  }

  // what the last read said
  let mm = lastRead ? lastRead.mm : 0;
  let hx4 = (lastRead ? (lastRead.hi * 256 + lastRead.lo) : 0).toString(16).toUpperCase().padStart(4, '0');
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Last read: 0x' + hx4 + ' = ' + mm + ' mm = ' + (mm / 10).toFixed(1) + ' cm', x + 410, y + 28);
  fill('dimgray');
  textSize(12);
  text('2 bytes = 48 bits on the wire,', x + 410, y + 46);
  text('about 0.12 ms at 400 kHz', x + 410, y + 60);

  // the frame: S, address+W, register, Sr, address+R, two data bytes, P
  let reached = active ? floor(prog * 8) : 7;
  let boxes = frameBoxes(active, reached);
  let fx = x + 14, fy = y + 76, fh = 22;
  let total = boxes.reduce((a, b) => a + b.w, 0) + 6 * (boxes.length - 1);
  let startX = fx + ((w - 28) - total) / 2;
  let bx = startX;
  for (let i = 0; i < boxes.length; i++) {
    let b = boxes[i];
    let on = i <= reached;
    let fills = { C: 'lightsteelblue', T: 'palegreen', M: 'khaki' };
    let strokes = { C: 'steelblue', T: 'seagreen', M: 'darkgoldenrod' };
    stroke(active && i === reached ? 'darkorange' : strokes[b.kind]);
    strokeWeight(active && i === reached ? 3 : 1.5);
    fill(on ? fills[b.kind] : 'whitesmoke');
    rect(bx, fy, b.w, fh, 5);
    noStroke();
    fill(on ? 'black' : 'darkgray');
    textAlign(CENTER, CENTER);
    textFont('monospace');
    textSize(12);
    text(b.label, bx + b.w / 2, fy + fh / 2);
    textFont('sans-serif');
    fill('dimgray');
    textSize(12);
    textAlign(CENTER, TOP);
    text(b.cap, bx + b.w / 2, fy + fh + 1);
    bx += b.w + 6;
  }
}

// ---------- distance chart ----------

function drawChart(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Distance readings (last 8 s)', x + 10, y + 4);

  let cx = x + 44, cy = y + 24, cw = w - 56, ch = h - 36;
  let tNow = tMs / 1000, tWin = 8, tFrom = tNow - tWin;
  let xOf = (t) => cx + (t - tFrom) / tWin * cw;
  let yOf = (v) => cy + ch - constrain(v, 0, 100) / 100 * ch;
  noStroke();
  fill('whitesmoke');
  rect(cx, cy, cw, ch);

  // shade the moments when the robot was backing up or turning
  let pts = readingHistory.filter((p) => p.t >= tFrom - 1);
  for (let i = 0; i < pts.length; i++) {
    if (pts[i].mode === 'forward') continue;
    let xa = max(cx, xOf(pts[i].t));
    let xb = i + 1 < pts.length ? xOf(pts[i + 1].t) : xOf(tNow);
    xb = constrain(xb, cx, cx + cw);
    fill(pts[i].mode === 'backup' ? color(255, 200, 120, 130) : color(200, 180, 240, 130));
    rect(xa, cy, max(1, xb - xa), ch);
  }

  // grid and the 15 cm line
  stroke('lightgray');
  strokeWeight(1);
  for (let v = 0; v <= 100; v += 50) line(cx, yOf(v), cx + cw, yOf(v));
  noStroke();
  fill('gray');
  textSize(12);
  textAlign(RIGHT, CENTER);
  for (let v = 0; v <= 100; v += 50) text(v, cx - 5, yOf(v));
  stroke('crimson');
  strokeWeight(1.5);
  drawingContext.setLineDash([5, 4]);
  line(cx, yOf(TRIGGER_CM), cx + cw, yOf(TRIGGER_CM));
  drawingContext.setLineDash([]);
  noStroke();
  fill('crimson');
  textAlign(LEFT, BOTTOM);
  text('15 cm', cx + 3, yOf(TRIGGER_CM) - 1);

  // the readings
  noFill();
  stroke('midnightblue');
  strokeWeight(1.5);
  beginShape();
  for (let i = 0; i < pts.length; i++) {
    if (xOf(pts[i].t) >= cx) vertex(xOf(pts[i].t), yOf(pts[i].cm));
  }
  endShape();
  noStroke();
  for (let i = 0; i < pts.length; i++) {
    if (xOf(pts[i].t) < cx) continue;
    fill(pts[i].cm <= TRIGGER_CM ? 'crimson' : 'midnightblue');
    circle(xOf(pts[i].t), yOf(pts[i].cm), 4);
  }
  if (pts.length === 0) {
    fill('gray');
    textAlign(CENTER, CENTER);
    textSize(13);
    text('Press Start to see readings arrive', cx + cw / 2, cy + ch / 2);
  }
  // legend
  fill('darkorange');
  rect(x + w - 156, y + 6, 10, 10);
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, CENTER);
  text('backing up', x + w - 142, y + 11);
  fill('mediumpurple');
  rect(x + w - 76, y + 6, 10, 10);
  fill('dimgray');
  text('turning', x + w - 62, y + 11);
  noFill();
  stroke('silver');
  strokeWeight(1);
  rect(cx, cy, cw, ch);
}

// ---------- the I2C read log ----------

function drawLogPanel(x, y, w, h) {
  noStroke();
  fill('black');
  rect(x, y, w, h, 8);
  fill('palegreen');
  textAlign(LEFT, TOP);
  textFont('monospace');
  textSize(11);
  text('tof.read()  # reg 0x1E, 2 bytes', x + 8, y + 6);
  fill('gray');
  text('time   bytes   mm    cm   robot', x + 8, y + 20);
  let shown = busLog.slice(-7);
  for (let i = 0; i < shown.length; i++) {
    let r = shown[i];
    let hx = (n) => n.toString(16).toUpperCase().padStart(2, '0');
    let line1 = r.t.toFixed(1).padStart(5, ' ') + 's ' + hx(r.hi) + ' ' + hx(r.lo) + ' '
      + String(r.mm).padStart(5, ' ') + ' ' + (r.mm / 10).toFixed(1).padStart(5, ' ') + '  ' + r.tag;
    fill(r.tag === 'TOO CLOSE!' ? 'tomato' : 'palegreen');
    text(line1, x + 8, y + 34 + i * 12);
  }
  if (shown.length === 0) {
    fill('gray');
    text('(reads appear here)', x + 8, y + 34);
  }
  textFont('sans-serif');
}

// ---------- control labels ----------

function drawControlLabels() {
  let dh = drawAreaHeight();
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Reads per second: ' + rateSlider.value(), 140, dh + 20);
  text('Robot speed: ' + speedSlider.value() + ' cm per second', 10, dh + 58);
}

// ---------- responsive helpers ----------

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, totalHeight());
  layoutControls();
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}

// The drawing shrinks with the container width, so the control row moves up with it
function drawAreaHeight() {
  return drawHeight * min(1, canvasWidth / DESIGN_W);
}

function ctrlHeight() {
  return controlHeight;
}

function totalHeight() {
  return drawAreaHeight() + ctrlHeight();
}
