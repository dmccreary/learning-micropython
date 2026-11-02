// I2C Two Sensors in a Maze MicroSim
// CANVAS_HEIGHT: 675
// A robot drives around a maze. The CPU reads an accelerometer (MPU-6050, 0x68)
// and then a second sensor over the SAME two wires: either the gyroscope inside the
// MPU-6050 (also 0x68, different registers) or an HMC5883L compass (0x1E).
// I2C has one conversation at a time, so the reads are taken in turns - the
// timeline strip shows the blocks never overlap. The reads-per-second slider shows
// how a slower poll rate misses quick changes.
// Bloom level: Understand (explain, compare) - exploration with a rate control.
// MicroSim template version 2026.03

// global variables for width and height
let containerWidth;
let canvasWidth = 400;
let drawHeight = 590;
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

// ---- the maze and the robot's route (cell coordinates) ----
const GRID_COLS = 9;
const GRID_ROWS = 5;
const ROUTE = [[1, 1], [3, 1], [3, 3], [5, 3], [5, 1], [7, 1], [7, 3]];
const CELL_M = 0.30;   // metres per maze cell
const ACC = 1.0;       // m/s^2 (about 0.1 g)
const VMAX = 0.5;      // m/s
const TURN_T = 1.0;    // seconds for a 90 degree pivot turn
let phases = [];
let TOTAL = 1;

// ---- run state ----
let isRunning = false;   // MicroSims open paused
let tMs = 0;             // simulation clock in milliseconds
let nextPollAt = 0;
let txns = [];           // bus transactions {lane, t0, t1, sample}
let histA = [];          // accelerometer samples that have arrived at the CPU
let histB = [];          // second-sensor samples
let lastA = null, lastB = null;
let lastTxnText = 'Press Start: the CPU will read the accelerometer, then the second sensor.';
let trail = [];

// ---- controls ----
let startButton, resetButton, rateSlider, modeSelect;
let mode = 'gyro';       // 'gyro' | 'compass'

const AX_SCALE = 16384;  // LSB per g at +/-2 g
const GY_SCALE = 131;    // LSB per deg/s at +/-250 deg/s
const MAG_SCALE = 1090;  // LSB per gauss (HMC5883L default gain)

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, totalHeight());
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  buildPhases();

  startButton = createButton('Start');
  startButton.parent(mainElement);
  startButton.mousePressed(toggleRun);

  resetButton = createButton('Reset');
  resetButton.parent(mainElement);
  resetButton.mousePressed(resetSim);

  rateSlider = createSlider(1, 25, 5, 1);
  rateSlider.parent(mainElement);

  modeSelect = createSelect();
  modeSelect.parent(mainElement);
  modeSelect.option('Gyroscope (MPU-6050, 0x68)', 'gyro');
  modeSelect.option('Compass (HMC5883L, 0x1E)', 'compass');
  modeSelect.selected('gyro');
  modeSelect.changed(onModeChange);

  layoutControls();
  resetSim();

  describe('A robot drives around a maze while a CPU reads an MPU-6050 accelerometer and then a gyroscope or HMC5883L compass over one shared I2C bus. Two panels show raw bytes, values and charts for each sensor, and a timeline shows the two reads taking turns on the bus, never overlapping.', LABEL);
}

// ---------- controls ----------

function layoutControls() {
  let dh = drawAreaHeight();
  let row1 = dh + 8;
  startButton.position(10, row1);
  resetButton.position(70, row1);
  rateSlider.position(sliderLeftMargin, row1 + 2);
  rateSlider.size(max(60, canvasWidth - sliderLeftMargin - margin));
  modeSelect.position(150, dh + 46);
}

function toggleRun() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function resetSim() {
  isRunning = false;
  startButton.html('Start');
  tMs = 0;
  nextPollAt = 0;
  txns = [];
  histA = [];
  histB = [];
  trail = [];
  lastTxnText = 'Press Start: the CPU will read the accelerometer, then the second sensor.';
  primePanels();
}

function onModeChange() {
  mode = modeSelect.selected();
  histB = [];
  txns = txns.filter((x) => x.lane === 0);
  primePanels();
  lastTxnText = 'Second sensor changed. ' + (mode === 'gyro'
    ? 'The gyroscope lives in the same chip: same address 0x68, different registers.'
    : 'The compass is a different chip with its own address, 0x1E.');
}

// show resting values in the panels before the first read
function primePanels() {
  lastA = sampleAccel(0);
  lastB = sampleB(0);
}

function pollPeriod() {
  return 1000 / rateSlider.value();
}

// ---------- the robot's route ----------

function driveProfile(L) {
  let ta = VMAX / ACC;
  let da = 0.5 * ACC * ta * ta;
  let v = VMAX, tc = 0;
  if (2 * da >= L) {
    ta = Math.sqrt(L / ACC);
    v = ACC * ta;
    da = 0.5 * ACC * ta * ta;
  } else {
    tc = (L - 2 * da) / VMAX;
  }
  return { ta: ta, tc: tc, v: v, da: da, T: 2 * ta + tc };
}

function buildPhases() {
  phases = [];
  let t = 0;
  let psi = 90; // facing east; psi is degrees clockwise from north (up on screen)
  let cx = ROUTE[0][0], cy = ROUTE[0][1];
  phases.push({ type: 'dwell', t0: t, dur: 0.8, xc: cx, yc: cy, psi: psi });
  t += 0.8;
  for (let i = 0; i < ROUTE.length - 1; i++) {
    let dx = ROUTE[i + 1][0] - ROUTE[i][0];
    let dy = ROUTE[i + 1][1] - ROUTE[i][1];
    let heading = (degrees(Math.atan2(dx, -dy)) + 360) % 360;
    if (i > 0) {
      let delta = ((heading - psi + 540) % 360) - 180;
      phases.push({ type: 'turn', t0: t, dur: TURN_T, xc: ROUTE[i][0], yc: ROUTE[i][1], psi0: psi, delta: delta });
      t += TURN_T;
      psi = heading;
    }
    let cells = abs(dx) + abs(dy);
    let prof = driveProfile(cells * CELL_M);
    phases.push({ type: 'drive', t0: t, dur: prof.T, xc: ROUTE[i][0], yc: ROUTE[i][1],
      dirx: Math.sign(dx), diry: Math.sign(dy), psi: psi, prof: prof });
    t += prof.T;
    cx = ROUTE[i + 1][0];
    cy = ROUTE[i + 1][1];
    phases.push({ type: 'dwell', t0: t, dur: 0.25, xc: cx, yc: cy, psi: psi });
    t += 0.25;
  }
  phases.push({ type: 'dwell', t0: t, dur: 1.5, xc: cx, yc: cy, psi: psi });
  t += 1.5;
  TOTAL = t;
}

// robot state at time t (seconds). a = forward acceleration (m/s^2),
// w = turn rate in degrees/s, positive when turning clockwise (a right turn).
function robotState(t) {
  let tau = t % TOTAL;
  let ph = phases[phases.length - 1];
  for (let i = 0; i < phases.length; i++) {
    if (tau < phases[i].t0 + phases[i].dur) { ph = phases[i]; break; }
  }
  let u = tau - ph.t0;
  if (ph.type === 'dwell') {
    return { xc: ph.xc, yc: ph.yc, psi: ph.psi, v: 0, a: 0, w: 0 };
  }
  if (ph.type === 'turn') {
    let f = u / ph.dur;
    let psi = ph.psi0 + ph.delta * (f - Math.sin(TWO_PI * f) / TWO_PI);
    let w = ph.delta / ph.dur * (1 - Math.cos(TWO_PI * f));
    return { xc: ph.xc, yc: ph.yc, psi: psi, v: 0, a: 0, w: w };
  }
  let p = ph.prof;
  let sM, v, a;
  if (u < p.ta) {
    a = ACC; v = ACC * u; sM = 0.5 * ACC * u * u;
  } else if (u < p.ta + p.tc) {
    a = 0; v = p.v; sM = p.da + p.v * (u - p.ta);
  } else {
    let ud = min(u - p.ta - p.tc, p.ta);
    a = -ACC; v = p.v - ACC * ud; sM = p.da + p.v * p.tc + p.v * ud - 0.5 * ACC * ud * ud;
  }
  let sc = sM / CELL_M;
  return { xc: ph.xc + ph.dirx * sc, yc: ph.yc + ph.diry * sc, psi: ph.psi, v: v, a: a, w: 0 };
}

// ---------- the sensors ----------

function toRaw(value, lsbPerUnit) {
  return constrain(Math.round(value * lsbPerUnit), -32768, 32767);
}

function sampleAccel(tSec) {
  let st = robotState(tSec);
  let moving = st.v > 0.02 || abs(st.a) > 0.01;
  let sd = moving ? 0.010 : 0.003;
  let vib = moving ? 0.012 * Math.sin(TWO_PI * 23 * tSec) : 0;
  let ax = st.a / 9.81 + vib + randomGaussian(0, sd);
  let ay = 0.004 + randomGaussian(0, sd);
  let az = 1.0 + randomGaussian(0, sd);
  return { t: tSec, raw: [toRaw(ax, AX_SCALE), toRaw(ay, AX_SCALE), toRaw(az, AX_SCALE)],
    phys: [ax, ay, az] };
}

function sampleGyro(tSec) {
  let st = robotState(tSec);
  // z gyro is positive counter-clockwise, so a right (clockwise) turn is negative
  let gz = -st.w + 0.8 + randomGaussian(0, 0.5);
  let gx = -0.3 + randomGaussian(0, 0.5);
  let gy = 0.2 + randomGaussian(0, 0.5);
  return { t: tSec, raw: [toRaw(gx, GY_SCALE), toRaw(gy, GY_SCALE), toRaw(gz, GY_SCALE)],
    phys: [gx, gy, gz] };
}

function sampleCompass(tSec) {
  let st = robotState(tSec);
  let psi = radians(st.psi);
  let x = 0.22 * Math.cos(psi) * MAG_SCALE + randomGaussian(0, 3);
  let y = -0.22 * Math.sin(psi) * MAG_SCALE + randomGaussian(0, 3);
  let z = 0.42 * MAG_SCALE + randomGaussian(0, 3);
  let xr = Math.round(x), yr = Math.round(y), zr = Math.round(z);
  let heading = (degrees(Math.atan2(-yr, xr)) + 360) % 360;
  // the HMC5883L sends its bytes in X, Z, Y order
  return { t: tSec, raw: [xr, zr, yr], phys: [xr / MAG_SCALE, zr / MAG_SCALE, yr / MAG_SCALE],
    heading: heading };
}

function sampleB(tSec) {
  return mode === 'gyro' ? sampleGyro(tSec) : sampleCompass(tSec);
}

// ---------- the CPU polling loop ----------

function txnDuration() {
  return min(120, 0.35 * pollPeriod());
}

function runPolling() {
  let d = txnDuration();
  while (nextPollAt <= tMs) {
    let t0 = nextPollAt;
    let gap = 0.1 * d;
    txns.push({ lane: 0, t0: t0, t1: t0 + d, sample: sampleAccel(t0 / 1000), done: false });
    txns.push({ lane: 1, t0: t0 + d + gap, t1: t0 + 2 * d + gap, sample: sampleB((t0 + d + gap) / 1000), done: false });
    nextPollAt += pollPeriod();
  }
  for (let i = 0; i < txns.length; i++) {
    let x = txns[i];
    if (!x.done && tMs >= x.t1) {
      x.done = true;
      if (x.lane === 0) { lastA = x.sample; histA.push(x.sample); }
      else { lastB = x.sample; histB.push(x.sample); }
    }
    if (!x.started && tMs >= x.t0) {
      x.started = true;
      lastTxnText = txnText(x.lane);
    }
  }
  // forget old history
  txns = txns.filter((x) => x.t1 > tMs - 4000);
  histA = histA.filter((x) => x.t > tMs / 1000 - 14);
  histB = histB.filter((x) => x.t > tMs / 1000 - 14);
}

function txnText(lane) {
  if (lane === 0) {
    return 'Read accelerometer: START, 0x68 + W, register 0x3B, restart, 0x68 + R, 6 data bytes, STOP';
  }
  if (mode === 'gyro') {
    return 'Read gyroscope: START, 0x68 + W, register 0x43, restart, 0x68 + R, 6 data bytes, STOP';
  }
  return 'Read compass: START, 0x1E + W, register 0x03, restart, 0x1E + R, 6 data bytes, STOP';
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

  if (isRunning) {
    tMs += min(deltaTime, 100);
    runPolling();
    let st = robotState(tMs / 1000);
    trail.push({ x: st.xc, y: st.yc });
    if (trail.length > 400) trail.shift();
    if (tMs / 1000 % TOTAL < 0.05) trail = [];
  }

  push();
  scale(s);
  drawTitle();
  drawMaze();
  drawRobotInfo();
  drawBusDiagram();
  drawSensorPanel(14, 286, (lw - 42) / 2, 196, 0);
  drawSensorPanel(28 + (lw - 42) / 2, 286, (lw - 42) / 2, 196, 1);
  drawTimeline();
  pop();

  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(22);
  text('Two I2C Sensors, One Bus, One Robot', lw / 2, 4);
  textSize(14);
  fill('dimgray');
  let msg;
  if (!isRunning && tMs === 0) msg = 'Paused: press Start to send the robot through the maze.';
  else msg = 'The CPU asks one sensor, waits for the answer, then asks the next. Never both at once.';
  text(msg, lw / 2, 30);
}

// ---------- maze and robot ----------

let MAZE_X = 14, MAZE_Y = 54, CELL = 36;

function isPathCell(cx, cy) {
  for (let i = 0; i < ROUTE.length - 1; i++) {
    let x0 = min(ROUTE[i][0], ROUTE[i + 1][0]), x1 = max(ROUTE[i][0], ROUTE[i + 1][0]);
    let y0 = min(ROUTE[i][1], ROUTE[i + 1][1]), y1 = max(ROUTE[i][1], ROUTE[i + 1][1]);
    if (cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1) return true;
  }
  return false;
}

function drawMaze() {
  for (let cy = 0; cy < GRID_ROWS; cy++) {
    for (let cx = 0; cx < GRID_COLS; cx++) {
      let x = MAZE_X + cx * CELL, y = MAZE_Y + cy * CELL;
      stroke('lightgray');
      strokeWeight(1);
      if (isPathCell(cx, cy)) fill('white');
      else fill('slategray');
      rect(x, y, CELL, CELL);
    }
  }
  // start and goal
  let sx = ROUTE[0][0], sy = ROUTE[0][1];
  let gx = ROUTE[ROUTE.length - 1][0], gy = ROUTE[ROUTE.length - 1][1];
  noStroke();
  fill('lightyellow');
  rect(MAZE_X + sx * CELL + 1, MAZE_Y + sy * CELL + 1, CELL - 2, CELL - 2);
  fill('palegreen');
  rect(MAZE_X + gx * CELL + 1, MAZE_Y + gy * CELL + 1, CELL - 2, CELL - 2);
  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(13);
  text('S', MAZE_X + sx * CELL + 4, MAZE_Y + sy * CELL + 2);
  text('G', MAZE_X + gx * CELL + 4, MAZE_Y + gy * CELL + 2);

  // trail
  noFill();
  stroke('lightskyblue');
  strokeWeight(3);
  beginShape();
  for (let i = 0; i < trail.length; i++) {
    vertex(MAZE_X + (trail[i].x + 0.5) * CELL, MAZE_Y + (trail[i].y + 0.5) * CELL);
  }
  endShape();

  // robot
  let st = robotState(tMs / 1000);
  let px = MAZE_X + (st.xc + 0.5) * CELL;
  let py = MAZE_Y + (st.yc + 0.5) * CELL;
  push();
  translate(px, py);
  rotate(radians(st.psi - 90));
  stroke('midnightblue');
  strokeWeight(1);
  fill('dimgray');
  rect(-8, -11, 14, 4, 1);
  rect(-8, 7, 14, 4, 1);
  fill('dodgerblue');
  rect(-11, -8, 22, 16, 4);
  fill('gold');
  noStroke();
  triangle(11, 0, 4, -5, 4, 5);
  pop();
}

function drawRobotInfo() {
  let st = robotState(tMs / 1000);
  let dirName = compassName(st.psi);
  let y = MAZE_Y + GRID_ROWS * CELL + 8;
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  let verb = 'stopped';
  if (st.w !== 0 && abs(st.w) > 1) verb = 'turning ' + (st.w > 0 ? 'right' : 'left');
  else if (st.v > 0.02) verb = 'driving ' + dirName;
  text('Robot: ' + verb + '   speed ' + st.v.toFixed(2) + ' m/s', MAZE_X, y);
  fill('dimgray');
  text('push ' + nfs(st.a / 9.81, 1, 2) + ' g forward   turn rate ' + nfs(-st.w, 1, 0) + ' deg/s', MAZE_X, y + 17);
}

function compassName(psi) {
  let names = ['north', 'east', 'south', 'west'];
  return names[round(((psi % 360) + 360) % 360 / 90) % 4];
}

// ---------- bus diagram ----------

function drawBusDiagram() {
  let x0 = MAZE_X + GRID_COLS * CELL + 22;   // left edge of the bus area
  let x1 = lw - 14;
  let sclY = 86, sdaY = 108;
  let cpuW = 58;
  let busL = x0 + cpuW;

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  text('One shared pair of wires', x0, 50);

  // wires
  strokeWeight(3);
  stroke('purple');
  line(busL, sclY, x1, sclY);
  stroke('navy');
  line(busL, sdaY, x1, sdaY);
  noStroke();
  fill('purple');
  textSize(12);
  textAlign(RIGHT, BOTTOM);
  text('SCL', x1, sclY - 4);
  fill('navy');
  textAlign(RIGHT, TOP);
  text('SDA', x1, sdaY + 4);

  // CPU
  stroke('midnightblue');
  strokeWeight(2);
  fill('lavender');
  rect(x0, 72, cpuW, 50, 8);
  noStroke();
  fill('midnightblue');
  textAlign(CENTER, CENTER);
  textSize(14);
  text('CPU', x0 + cpuW / 2, 90);
  textSize(12);
  fill('dimgray');
  text('Pico', x0 + cpuW / 2, 106);

  // devices
  let mpuX = busL + 14, mpuW = 124;
  let hmcX = mpuX + mpuW + 12, hmcW = x1 - hmcX;
  let top = 132;

  let aActive = activeLane(0);
  let bActive = activeLane(1);

  // MPU-6050: one chip, two functions
  drawChipBox(mpuX, top, mpuW, 106, 'MPU-6050  0x68', 'steelblue', true);
  drawFunctionBlock(mpuX + 8, top + 26, mpuW - 16, 36, 'Accelerometer', 'regs 0x3B-0x40', 'tomato', aActive, true);
  drawFunctionBlock(mpuX + 8, top + 66, mpuW - 16, 36, 'Gyroscope', 'regs 0x43-0x48', 'mediumpurple', bActive && mode === 'gyro', mode === 'gyro');
  tap(mpuX + 16, sclY, mpuX + 34, sdaY, top, aActive || (bActive && mode === 'gyro'));

  // HMC5883L: a separate chip
  drawChipBox(hmcX, top, hmcW, 66, 'HMC5883L 0x1E', 'seagreen', mode === 'compass');
  drawFunctionBlock(hmcX + 8, top + 26, hmcW - 16, 34, 'Compass', 'regs 0x03-0x08', 'seagreen', bActive && mode === 'compass', mode === 'compass');
  tap(hmcX + 16, sclY, hmcX + 34, sdaY, top, bActive && mode === 'compass');

  // packet travelling along SDA
  for (let i = 0; i < txns.length; i++) {
    let x = txns[i];
    if (tMs >= x.t0 && tMs < x.t1) {
      let f = (tMs - x.t0) / (x.t1 - x.t0);
      let targetX = x.lane === 0 ? mpuX + 34 : (mode === 'gyro' ? mpuX + 34 : hmcX + 34);
      let px;
      if (f < 0.4) {
        px = lerp(busL + 6, targetX, f / 0.4);
        stroke('navy');
        strokeWeight(2);
        fill('white');
      } else {
        px = lerp(targetX, busL + 6, (f - 0.4) / 0.6);
        stroke('darkgreen');
        strokeWeight(2);
        fill('limegreen');
      }
      circle(px, sdaY, 13);
    }
  }

  // transaction caption
  noStroke();
  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(12);
  text(lastTxnText, x0, top + 112, x1 - x0, 36);
}

function activeLane(lane) {
  for (let i = 0; i < txns.length; i++) {
    let x = txns[i];
    if (x.lane === lane && tMs >= x.t0 && tMs < x.t1) return true;
  }
  return false;
}

function drawChipBox(x, y, w, h, label, col, used) {
  stroke(used ? col : 'silver');
  strokeWeight(2);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill(used ? col : 'silver');
  rect(x + 1, y + 1, w - 2, 20, 7, 7, 0, 0);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(12);
  text(label, x + w / 2, y + 11);
}

function drawFunctionBlock(x, y, w, h, name, regs, col, active, used) {
  stroke(active ? 'limegreen' : (used ? col : 'silver'));
  strokeWeight(active ? 4 : 1.5);
  fill(active ? 'honeydew' : (used ? 'white' : 'whitesmoke'));
  rect(x, y, w, h, 6);
  noStroke();
  fill(used ? col : 'darkgray');
  textAlign(CENTER, CENTER);
  textSize(13);
  text(name, x + w / 2, y + h * 0.35);
  fill(used ? 'dimgray' : 'darkgray');
  textSize(12);
  text(used ? regs : 'not read', x + w / 2, y + h * 0.72);
}

function tap(sclX, sclY, sdaX, sdaY, top, active) {
  stroke(active ? 'limegreen' : 'dimgray');
  strokeWeight(active ? 3 : 2);
  line(sclX, sclY, sclX, top);
  line(sdaX, sdaY, sdaX, top);
  noStroke();
  fill('purple');
  circle(sclX, sclY, 7);
  fill('navy');
  circle(sdaX, sdaY, 7);
}

// ---------- sensor panels ----------

function hexBytes(raw) {
  let v = raw & 0xFFFF;
  let h = (v >> 8).toString(16).toUpperCase().padStart(2, '0');
  let l = (v & 0xFF).toString(16).toUpperCase().padStart(2, '0');
  return h + ' ' + l;
}

function drawSensorPanel(x, y, w, h, which) {
  let isA = which === 0;
  let sample = isA ? lastA : lastB;
  let hist = isA ? histA : histB;
  let col, title, sub, labels, units;
  if (isA) {
    col = 'tomato';
    title = 'Accelerometer';
    sub = 'MPU-6050 at 0x68, registers 0x3B-0x40';
    labels = ['ax', 'ay', 'az'];
    units = 'g';
  } else if (mode === 'gyro') {
    col = 'mediumpurple';
    title = 'Gyroscope';
    sub = 'MPU-6050 at 0x68, registers 0x43-0x48';
    labels = ['gx', 'gy', 'gz'];
    units = 'deg/s';
  } else {
    col = 'seagreen';
    title = 'Compass';
    sub = 'HMC5883L at 0x1E, registers 0x03-0x08';
    labels = ['mx', 'mz', 'my'];
    units = 'gauss';
  }

  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill(col);
  textAlign(LEFT, TOP);
  textSize(15);
  text(title, x + 10, y + 6);
  fill('dimgray');
  textSize(12);
  text(sub, x + 10, y + 25);

  // table header
  textFont('monospace');
  textSize(11);
  fill('gray');
  text('axis    raw   bytes (H L)   value', x + 10, y + 43);
  // rows
  textSize(13);
  for (let i = 0; i < 3; i++) {
    let ry = y + 59 + i * 16;
    fill('black');
    textAlign(LEFT, TOP);
    text(labels[i], x + 10, ry);
    textAlign(RIGHT, TOP);
    text(sample ? nfs(sample.raw[i], 1, 0) : '--', x + 98, ry);
    textAlign(LEFT, TOP);
    fill('dimgray');
    text(sample ? hexBytes(sample.raw[i]) : '-- --', x + 112, ry);
    fill('black');
    textAlign(RIGHT, TOP);
    let phys = sample ? sample.phys[i] : 0;
    text(sample ? nfs(phys, 1, 2) + ' ' + units : '--', x + w - 10, ry);
  }
  textFont('sans-serif');
  if (!isA && mode === 'compass' && sample) {
    noStroke();
    fill('darkgreen');
    textAlign(RIGHT, TOP);
    textSize(13);
    text('heading ' + sample.heading.toFixed(0) + ' deg', x + w - 10, y + 6);
  }

  // chart
  drawPanelChart(x + 10, y + 112, w - 20, 74, which, hist, col);
}

function drawPanelChart(cx, cy, cw, ch, which, hist, col) {
  let tNow = tMs / 1000;
  let tWin = 6;
  let tFrom = tNow - tWin;
  let yMin, yMax;
  if (which === 0) { yMin = -0.2; yMax = 0.2; }
  else if (mode === 'gyro') { yMin = -200; yMax = 200; }
  else { yMin = 0; yMax = 360; }
  let xOf = (t) => cx + (t - tFrom) / tWin * cw;
  let yOf = (v) => cy + ch - (constrain(v, yMin, yMax) - yMin) / (yMax - yMin) * ch;

  noStroke();
  fill('whitesmoke');
  rect(cx, cy, cw, ch);
  // zero line
  stroke('lightgray');
  strokeWeight(1);
  if (yMin < 0) line(cx, yOf(0), cx + cw, yOf(0));
  noStroke();
  fill('gray');
  textSize(12);
  textAlign(LEFT, TOP);
  let unitLabel = which === 0 ? 'g' : (mode === 'gyro' ? 'deg/s' : 'deg');
  text(yMax + ' ' + unitLabel, cx + 3, cy + 1);
  textAlign(LEFT, BOTTOM);
  text(yMin + ' ' + unitLabel, cx + 3, cy + ch - 1);

  // the truth (what the robot is really doing) as a faint line
  let channels = [];
  if (which === 0) {
    channels.push({ idx: 0, color: 'tomato', truthFn: (st) => st.a / 9.81, name: 'ax' });
    channels.push({ idx: 1, color: 'royalblue', truthFn: (st) => 0.004, name: 'ay' });
  } else if (mode === 'gyro') {
    channels.push({ idx: 2, color: 'mediumpurple', truthFn: (st) => -st.w + 0.8, name: 'gz' });
  } else {
    channels.push({ idx: -1, color: 'seagreen', truthFn: (st) => (st.psi % 360 + 360) % 360, name: 'heading' });
  }
  for (let c = 0; c < channels.length; c++) {
    let ch1 = channels[c];
    noFill();
    stroke('lightgray');
    strokeWeight(2);
    beginShape();
    for (let px = 0; px <= cw; px += 3) {
      let t = tFrom + px / cw * tWin;
      if (t < 0) continue;
      vertex(cx + px, yOf(ch1.truthFn(robotState(t))));
    }
    endShape();
  }
  // the readings the CPU actually received: held until the next read
  for (let c = 0; c < channels.length; c++) {
    let chn = channels[c];
    let pts = hist.filter((p) => p.t >= tFrom - 1);
    stroke(chn.color);
    strokeWeight(1.5);
    noFill();
    beginShape();
    for (let i = 0; i < pts.length; i++) {
      let v = chn.idx >= 0 ? pts[i].phys[chn.idx] : pts[i].heading;
      let xa = max(cx, xOf(pts[i].t));
      let xb = i + 1 < pts.length ? xOf(pts[i + 1].t) : xOf(tNow);
      vertex(xa, yOf(v));
      vertex(constrain(xb, cx, cx + cw), yOf(v));
    }
    endShape();
    noStroke();
    fill(chn.color);
    for (let i = 0; i < pts.length; i++) {
      let v = chn.idx >= 0 ? pts[i].phys[chn.idx] : pts[i].heading;
      if (xOf(pts[i].t) >= cx) circle(xOf(pts[i].t), yOf(v), 5);
    }
  }
  // legend
  noStroke();
  textAlign(RIGHT, TOP);
  textSize(12);
  let lx = cx + cw - 4;
  for (let c = channels.length - 1; c >= 0; c--) {
    fill(channels[c].color);
    text(channels[c].name, lx, cy + 2);
    lx -= textWidth(channels[c].name) + 10;
  }
  fill('darkgray');
  text('grey = truth', lx, cy + 2);

  if (hist.length === 0) {
    fill('gray');
    textAlign(CENTER, CENTER);
    textSize(13);
    text('Press Start to see readings arrive', cx + cw / 2, cy + ch / 2);
  }
  noFill();
  stroke('silver');
  strokeWeight(1);
  rect(cx, cy, cw, ch);
}

// ---------- bus timeline ----------

function drawTimeline() {
  let y = 490;
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Who is using the bus? (slow motion, the last 3 seconds)', 14, y);
  fill('dimgray');
  textSize(12);
  text('Real 6-byte reads take about 0.25 ms. They are stretched here so you can see them take turns.', 14, y + 18);

  let lx0 = 132;
  let lx1 = lw - 14;
  let lanes = [
    { name: 'Accelerometer', sub: '0x68', col: 'tomato' },
    { name: mode === 'gyro' ? 'Gyroscope' : 'Compass', sub: mode === 'gyro' ? '0x68' : '0x1E', col: mode === 'gyro' ? 'mediumpurple' : 'seagreen' }
  ];
  let tWin = 3000;
  let tFrom = tMs - tWin;
  let xOf = (t) => lx0 + (t - tFrom) / tWin * (lx1 - lx0);
  for (let i = 0; i < 2; i++) {
    let ly = y + 38 + i * 26;
    noStroke();
    fill(lanes[i].col);
    textAlign(LEFT, CENTER);
    textSize(13);
    text(lanes[i].name + ' ' + lanes[i].sub, 14, ly + 10);
    fill('whitesmoke');
    stroke('lightgray');
    strokeWeight(1);
    rect(lx0, ly, lx1 - lx0, 20);
  }
  // time grid
  for (let k = 0; k <= 3; k++) {
    let tx = lx1 - k * (lx1 - lx0) / 3;
    stroke('lightgray');
    strokeWeight(1);
    line(tx, y + 36, tx, y + 90);
    noStroke();
    fill('gray');
    textSize(12);
    textAlign(CENTER, TOP);
    text(k === 0 ? 'now' : '-' + k + ' s', tx, y + 91);
  }
  // blocks
  for (let i = 0; i < txns.length; i++) {
    let x = txns[i];
    let bx0 = max(lx0, xOf(x.t0));
    let bx1 = min(lx1, xOf(min(x.t1, tMs)));
    if (bx1 <= bx0 || x.t0 > tMs) continue;
    let ly = y + 38 + x.lane * 26;
    stroke('white');
    strokeWeight(1);
    fill(lanes[x.lane].col);
    rect(bx0, ly + 1, bx1 - bx0, 18, 2);
  }
  if (txns.length === 0) {
    noStroke();
    fill('gray');
    textAlign(CENTER, CENTER);
    textSize(13);
    text('Press Start: reads appear here, one after the other', (lx0 + lx1) / 2, y + 64);
  }
}

// ---------- control labels ----------

function drawControlLabels() {
  let dh = drawAreaHeight();
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Reads per second: ' + rateSlider.value(), 140, dh + 20);
  text('Second sensor:', 10, dh + 56);
  fill('dimgray');
  textSize(13);
  text('Slower reads miss quick changes.', 370, dh + 56);
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
