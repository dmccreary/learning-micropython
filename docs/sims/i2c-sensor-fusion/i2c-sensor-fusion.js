// I2C Five-Device Sensor Fusion MicroSim
// CANVAS_HEIGHT: 754
// Five devices share one I2C bus: an accelerometer and gyroscope (both inside the
// MPU-6050 at 0x68), a VL53L0X distance sensor (0x29), an INA219 battery monitor
// (0x40) and an SSD1306 OLED display (0x3C). The CPU runs one main loop that takes
// turns talking to each device. Every transaction lasts exactly as long as its
// bits take on the wire (9 bits per byte), so the 1 KB display frame hogs the bus.
// The accelerometer and gyroscope readings are fused with a complementary filter.
// Bloom level: Analyze (compare, examine) - bus-speed and display-rate experiments.
// MicroSim template version 2026.03

// global variables for width and height
let containerWidth;
let canvasWidth = 400;
let drawHeight = 664;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 400;
let defaultTextSize = 16;

// laid out for a 680 px wide design; narrower containers scale the picture down
const DESIGN_W = 680;
let s = 1;
let lw = 680;

// ---- the six lanes of the timeline, one per device plus the CPU's own math ----
const LANES = [
  { key: 'accel', name: 'Accelerometer', chip: 'MPU-6050', addr: 0x68, col: 'tomato' },
  { key: 'gyro', name: 'Gyroscope', chip: 'MPU-6050', addr: 0x68, col: 'mediumpurple' },
  { key: 'dist', name: 'Distance', chip: 'VL53L0X', addr: 0x29, col: 'seagreen' },
  { key: 'batt', name: 'Battery', chip: 'INA219', addr: 0x40, col: 'goldenrod' },
  { key: 'oled', name: 'Display', chip: 'SSD1306', addr: 0x3C, col: 'darkorange' },
  { key: 'cpu', name: 'CPU math', chip: '', addr: 0, col: 'slategray' }
];

// ---- run state ----
let isRunning = false;     // MicroSims open paused
let simMs = 0;             // simulated time in milliseconds (runs slower than real time)
let cpuFreeAt = 0;         // when the CPU finishes its current job
let busHz = 400000;
let bumpUntil = -1;
let blocks = [];           // {lane, t0, t1}
let waits = [];            // {lane, t0, t1}: a job that was due but had to wait
let chartPts = [];         // {t, truth, acc, gyro, fused}
let imuStarts = [];
let imuLates = [];
let lastTxn = 'Press Start: the CPU main loop will begin talking to the five devices.';
let activeFlash = [0, 0, 0, 0, 0]; // real-time stamp of each device's last activity

// what the CPU currently knows (its variables)
let cpu = { angle: 0, gyroAngle: 0, fused: 0, accAngle: 0, mm: null, volts: null, pct: null, lastImu: -1, started: false };
let devData = {};          // last raw bytes + decoded text per device card
let screenText = null;     // what the OLED is showing right now
let screenQueue = [];      // frames still travelling over the wire

// the main loop, in the order the code checks them
let tasks = [
  { id: 'imu', period: 10, due: 0, enabled: true },
  { id: 'dist', period: 50, due: 0, enabled: true },
  { id: 'batt', period: 250, due: 0, enabled: true },
  { id: 'oled', period: 100, due: 0, enabled: true }
];

const ALPHA = 0.98;        // complementary filter: trust the gyro 98 %, the accelerometer 2 %
const GYRO_BIAS = 6;       // deg/s of zero-rate error (the MPU-6050 can be off by up to +/-20)
const DISPLAY_BITS = 9 * 1026 + 3 + 6 * 30; // address + control byte + 1024 pixel bytes + 6 setup commands

// controls
let startButton, resetButton, bumpButton, speedSlider, busSelect, oledSelect;

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

  bumpButton = createButton('Bump the robot!');
  bumpButton.parent(mainElement);
  bumpButton.mousePressed(() => { bumpUntil = simMs + 250; });

  speedSlider = createSlider(2, 50, 10, 1);
  speedSlider.parent(mainElement);

  busSelect = createSelect();
  busSelect.parent(mainElement);
  busSelect.option('400 kHz', '400000');
  busSelect.option('100 kHz', '100000');
  busSelect.selected('400000');
  busSelect.changed(() => { busHz = int(busSelect.selected()); });

  oledSelect = createSelect();
  oledSelect.parent(mainElement);
  oledSelect.option('Off', '0');
  oledSelect.option('5 per second', '200');
  oledSelect.option('10 per second', '100');
  oledSelect.option('20 per second', '50');
  oledSelect.selected('100');
  oledSelect.changed(applyDisplayRate);

  layoutControls();
  resetSim();

  describe('Five I2C devices share one bus: an accelerometer and a gyroscope in an MPU-6050, a VL53L0X distance sensor, an INA219 battery monitor and an SSD1306 display. A robot rocks on a platform. A timeline drawn to scale shows each bus transaction taking its turn, with the display frame taking far longer than any sensor read. A chart compares accelerometer-only, gyroscope-only and fused tilt angles.', LABEL);
}

// ---------- controls ----------

function layoutControls() {
  let dh = drawAreaHeight();
  let row1 = dh + 8;
  startButton.position(10, row1);
  resetButton.position(70, row1);
  bumpButton.position(126, row1);
  if (isNarrow()) {
    // row 2: speed slider, row 3: the two drop-down menus
    speedSlider.position(150, dh + 48);
    speedSlider.size(max(60, canvasWidth - 150 - margin));
    busSelect.position(60, dh + 84);
    oledSelect.position(235, dh + 84);
  } else {
    speedSlider.position(sliderLeftMargin, row1 + 2);
    speedSlider.size(max(60, canvasWidth - sliderLeftMargin - margin));
    busSelect.position(100, dh + 46);
    oledSelect.position(max(420, canvasWidth - 190), dh + 46);
  }
}

function toggleRun() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function applyDisplayRate() {
  let v = int(oledSelect.selected());
  tasks[3].enabled = v > 0;
  if (v > 0) tasks[3].period = v;
}

function resetSim() {
  isRunning = false;
  startButton.html('Start');
  simMs = 0;
  cpuFreeAt = 0;
  bumpUntil = -1;
  blocks = [];
  waits = [];
  chartPts = [];
  imuStarts = [];
  imuLates = [];
  screenQueue = [];
  screenText = null;
  devData = {};
  activeFlash = [0, 0, 0, 0, 0];
  cpu = { angle: 0, gyroAngle: 0, fused: 0, accAngle: 0, mm: null, volts: null, pct: null, lastImu: -1, started: false };
  for (let i = 0; i < tasks.length; i++) tasks[i].due = 0;
  lastTxn = 'Press Start: the CPU main loop will begin talking to the five devices.';
  applyDisplayRate();
}

function timeScale() {
  return speedSlider.value() / 100;
}

// ---------- the world (pure functions of simulated time) ----------

function pitchTruth(tMs) {
  let t = tMs / 1000;
  return 18 * Math.sin(TWO_PI * t / 1.0) + 5 * Math.sin(TWO_PI * t / 0.43 + 1);
}

function pitchRate(tMs) {
  let t = tMs / 1000;
  return 18 * TWO_PI / 1.0 * Math.cos(TWO_PI * t / 1.0) + 5 * TWO_PI / 0.43 * Math.cos(TWO_PI * t / 0.43 + 1);
}

function obstacleMm(tMs) {
  return 300 + 180 * Math.sin(TWO_PI * (tMs / 1000) / 2.2);
}

function socTrue(tMs) {
  return max(8, 100 - 5 * tMs / 1000); // sped up so the battery visibly drains
}

// a typical single-cell LiPo discharge curve: [percent, volts]
const LIPO = [[100, 4.20], [90, 4.06], [80, 3.98], [70, 3.92], [60, 3.87], [50, 3.82],
  [40, 3.79], [30, 3.77], [20, 3.74], [10, 3.68], [5, 3.60], [0, 3.30]];

function lipoVolts(pct) {
  for (let i = 0; i < LIPO.length - 1; i++) {
    if (pct <= LIPO[i][0] && pct >= LIPO[i + 1][0]) {
      let f = (pct - LIPO[i + 1][0]) / (LIPO[i][0] - LIPO[i + 1][0]);
      return LIPO[i + 1][1] + f * (LIPO[i][1] - LIPO[i + 1][1]);
    }
  }
  return 3.3;
}

function lipoPercent(v) {
  if (v >= LIPO[0][1]) return 100;
  for (let i = 0; i < LIPO.length - 1; i++) {
    if (v <= LIPO[i][1] && v >= LIPO[i + 1][1]) {
      let f = (v - LIPO[i + 1][1]) / (LIPO[i][1] - LIPO[i + 1][1]);
      return LIPO[i + 1][0] + f * (LIPO[i][0] - LIPO[i + 1][0]);
    }
  }
  return 0;
}

// ---------- device models ----------

function toRaw(value, lsbPerUnit) {
  return constrain(Math.round(value * lsbPerUnit), -32768, 32767);
}

function bytesOf(raws) {
  let out = [];
  for (let i = 0; i < raws.length; i++) {
    let v = raws[i] & 0xFFFF;
    out.push((v >> 8) & 0xFF, v & 0xFF);
  }
  return out;
}

function hexList(bytes, maxCount) {
  let parts = [];
  for (let i = 0; i < min(bytes.length, maxCount); i++) {
    parts.push(bytes[i].toString(16).toUpperCase().padStart(2, '0'));
  }
  return parts.join(' ');
}

function readAccel(tMs) {
  let th = radians(pitchTruth(tMs));
  let n = 0.012 + (tMs < bumpUntil ? 0.35 : 0);
  let ax = Math.sin(th) + randomGaussian(0, n);
  let ay = 0.01 + randomGaussian(0, n);
  let az = Math.cos(th) + randomGaussian(0, n);
  let raws = [toRaw(ax, 16384), toRaw(ay, 16384), toRaw(az, 16384)];
  return { raws: raws, bytes: bytesOf(raws), g: [raws[0] / 16384, raws[1] / 16384, raws[2] / 16384] };
}

function readGyro(tMs) {
  let gy = pitchRate(tMs) + GYRO_BIAS + randomGaussian(0, 0.6);
  let raws = [toRaw(-0.3 + randomGaussian(0, 0.6), 131), toRaw(gy, 131), toRaw(0.2 + randomGaussian(0, 0.6), 131)];
  return { raws: raws, bytes: bytesOf(raws), dps: [raws[0] / 131, raws[1] / 131, raws[2] / 131] };
}

function readDistance(tMs) {
  let mm = Math.round(obstacleMm(tMs) + randomGaussian(0, 4));
  return { bytes: bytesOf([mm]), mm: mm };
}

function readBattery(tMs) {
  let v = lipoVolts(socTrue(tMs)) + randomGaussian(0, 0.006);
  let reg = (Math.round(v / 0.004) << 3) & 0xFFFF; // INA219: bus voltage in bits 15-3, 4 mV each
  return { bytes: bytesOf([reg]), reg: reg };
}

// ---------- bus timing ----------

function readBits(nBytes) {
  // START + address+W + register + restart + address+R + data bytes + STOP
  return 9 * (3 + nBytes) + 3;
}

function wireMs(bits) {
  return bits / busHz * 1000;
}

// ---------- the CPU main loop ----------

function addBlock(lane, t0, t1) {
  blocks.push({ lane: lane, t0: t0, t1: t1 });
}

function flash(i) {
  activeFlash[i] = millis();
}

function txnString(name, addr, reg, bytes, bits) {
  let ms = wireMs(bits);
  return 'Last: ' + name + ' (0x' + addr.toString(16) + ', reg 0x' + reg.toString(16).toUpperCase() + '): '
    + hexList(bytes, 8) + ' [' + bits + ' bits = ' + ms.toFixed(2) + ' ms at ' + (busHz / 1000) + ' kHz]';
}

// run one task starting at time 'now'; returns the time the CPU is free again
function runTask(task, now) {
  let late = now - task.due;
  let t = now;
  if (task.id === 'imu') {
    imuStarts.push(now);
    imuLates.push({ t: now, late: max(0, late) });
    if (late > 0.5) waits.push({ lane: 0, t0: task.due, t1: now });
    let bits = readBits(6);
    let d = wireMs(bits);
    // accelerometer
    let a = readAccel(t);
    addBlock(0, t, t + d);
    flash(0);
    devData.accel = { bytes: a.bytes, text: 'tilt ' + nfs(degrees(Math.atan2(a.g[0], a.g[2])), 1, 1) + ' deg' };
    lastTxn = txnString('accelerometer', 0x68, 0x3B, a.bytes, bits);
    t += d;
    // gyroscope
    let g = readGyro(t);
    addBlock(1, t, t + d);
    flash(1);
    devData.gyro = { bytes: g.bytes, text: 'rate ' + nfs(g.dps[1], 1, 0) + ' deg/s' };
    t += d;
    // the CPU fuses the two readings
    let accAngle = degrees(Math.atan2(a.g[0], a.g[2]));
    let dt = cpu.lastImu < 0 ? 0.01 : (now - cpu.lastImu) / 1000;
    if (!cpu.started) {
      cpu.gyroAngle = accAngle;
      cpu.fused = accAngle;
      cpu.started = true;
    } else {
      cpu.gyroAngle += g.dps[1] * dt;
      cpu.fused = ALPHA * (cpu.fused + g.dps[1] * dt) + (1 - ALPHA) * accAngle;
    }
    cpu.accAngle = accAngle;
    cpu.lastImu = now;
    addBlock(5, t, t + 0.2);
    t += 0.2;
    chartPts.push({ t: now / 1000, truth: pitchTruth(now), acc: accAngle, gyro: cpu.gyroAngle, fused: cpu.fused });
  } else if (task.id === 'dist') {
    let bits = readBits(2);
    let d = wireMs(bits);
    let r = readDistance(t);
    addBlock(2, t, t + d);
    flash(2);
    t += d;
    addBlock(5, t, t + 0.05);
    t += 0.05;
    cpu.mm = r.mm;
    devData.dist = { bytes: r.bytes, text: r.mm + ' mm' };
    lastTxn = txnString('distance', 0x29, 0x1E, r.bytes, bits);
  } else if (task.id === 'batt') {
    let bits = readBits(2);
    let d = wireMs(bits);
    let r = readBattery(t);
    addBlock(3, t, t + d);
    flash(3);
    t += d;
    addBlock(5, t, t + 0.05);
    t += 0.05;
    cpu.volts = (r.reg >> 3) * 0.004;
    cpu.pct = lipoPercent(cpu.volts);
    devData.batt = { bytes: r.bytes, text: cpu.volts.toFixed(2) + ' V = ' + Math.round(cpu.pct) + '%' };
    lastTxn = txnString('battery voltage', 0x40, 0x02, r.bytes, bits);
  } else if (task.id === 'oled') {
    if (late > 0.5) waits.push({ lane: 4, t0: task.due, t1: now });
    // the CPU draws the text into its memory first, then sends the whole frame
    addBlock(5, t, t + 1.5);
    t += 1.5;
    let d = wireMs(DISPLAY_BITS);
    addBlock(4, t, t + d);
    flash(4);
    screenQueue.push({ t: t + d, lines: [
      'TILT ' + nfs(cpu.fused, 1, 1),
      'DIST ' + (cpu.mm === null ? '--' : cpu.mm + 'mm'),
      'BATT ' + (cpu.pct === null ? '--' : Math.round(cpu.pct) + '% ' + cpu.volts.toFixed(2) + 'V')
    ] });
    t += d;
    lastTxn = 'Last: display frame (0x3C), 1024 bytes [' + DISPLAY_BITS + ' bits = '
      + wireMs(DISPLAY_BITS).toFixed(1) + ' ms at ' + (busHz / 1000) + ' kHz]';
    devData.oled = { text: 'frame sent' };
  }
  task.due = now + task.period; // "last = now": the next job is due one period after this one started
  return t;
}

function loopOnce() {
  let now = cpuFreeAt;
  let ran = false;
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].enabled && now >= tasks[i].due) {
      now = runTask(tasks[i], now);
      ran = true;
    }
  }
  if (!ran) {
    // nothing is due: the CPU spins until the earliest due time
    let next = Infinity;
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].enabled) next = min(next, tasks[i].due);
    }
    now = max(now, next);
  }
  cpuFreeAt = now;
}

function advanceSim(target) {
  let guard = 0;
  while (cpuFreeAt <= target && guard++ < 4000) loopOnce();
  // frames that have finished crossing the wire appear on the OLED
  while (screenQueue.length > 0 && screenQueue[0].t <= target) {
    screenText = screenQueue.shift().lines;
  }
  // forget old history
  let cutoff = target - 1500;
  blocks = blocks.filter((b) => b.t1 > cutoff);
  waits = waits.filter((w) => w.t1 > cutoff);
  imuStarts = imuStarts.filter((x) => x > target - 1000);
  imuLates = imuLates.filter((x) => x.t > target - 1000);
  chartPts = chartPts.filter((p) => p.t > target / 1000 - 3);
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
    simMs += min(deltaTime, 100) * timeScale();
    advanceSim(simMs);
  }

  push();
  scale(s);
  drawTitle();
  drawScene(14, 52, 250, 172);
  drawFusionChart(272, 52, lw - 286, 172);
  drawBus();
  drawGantt(14, 428, lw - 28);
  drawCodePanel(14, 560, 322, 98);
  drawInfoPanel(344, 560, lw - 358, 98);
  pop();

  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(22);
  text('Five Devices, One Bus, One CPU', lw / 2, 4);
  textSize(14);
  fill('dimgray');
  let msg = (!isRunning && simMs === 0)
    ? 'Paused: press Start. Time runs in slow motion so you can see every transaction.'
    : 'The CPU talks to one device at a time. Watch what happens when the display frame is sent.';
  text(msg, lw / 2, 30);
}

// ---------- the robot scene ----------

function drawScene(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  text('The real world', x + 10, y + 5);

  let tilt = pitchTruth(simMs);
  let d = obstacleMm(simMs);
  let px = x + 96, py = y + 118;

  // support
  noStroke();
  fill('lightgray');
  triangle(px - 16, py + 40, px + 16, py + 40, px, py + 6);

  // the wall (obstacle) that the VL53L0X looks at
  let wallX = px + 46 + d * 0.12;
  fill('slategray');
  rect(wallX, py - 68, 8, 98);

  // tilting platform, rover and sensor beam
  push();
  translate(px, py);
  rotate(radians(-tilt));
  fill('burlywood');
  stroke('sienna');
  strokeWeight(1);
  rect(-80, -4, 160, 8, 2);
  fill('dimgray');
  noStroke();
  circle(-28, -9, 13);
  circle(24, -9, 13);
  fill('dodgerblue');
  stroke('midnightblue');
  rect(-44, -34, 80, 26, 4);
  fill('tomato');
  noStroke();
  rect(-34, -29, 20, 13, 2);
  fill('seagreen');
  rect(36, -27, 8, 10, 1);
  stroke('crimson');
  strokeWeight(1.5);
  let beamLen = d * 0.12 / max(0.5, Math.cos(radians(tilt)));
  line(44, -22, 44 + beamLen, -22);
  pop();

  // labels
  noStroke();
  textSize(12);
  fill('tomato');
  textAlign(CENTER, TOP);
  text('MPU-6050', px - 30, py - 74);
  fill('seagreen');
  textAlign(LEFT, TOP);
  text('VL53L0X', px + 18, py - 62);

  // battery
  let bx = x + w - 64, by = y + 6;
  let soc = socTrue(simMs);
  stroke('dimgray');
  strokeWeight(1.5);
  fill('white');
  rect(bx, by, 40, 16, 3);
  rect(bx + 40, by + 4, 3, 8);
  noStroke();
  fill(soc > 30 ? 'limegreen' : 'orange');
  rect(bx + 2, by + 2, 36 * soc / 100, 12, 2);
  fill('dimgray');
  textSize(12);
  textAlign(CENTER, TOP);
  text('INA219', bx + 22, by + 19);

  // truth readouts
  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(12);
  text('true tilt ' + nfs(tilt, 1, 1) + ' deg', x + 10, y + h - 34);
  text('true distance ' + Math.round(d) + ' mm', x + 10, y + h - 18);
}

// ---------- sensor fusion chart ----------

function drawFusionChart(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Sensor fusion: tilt angle (degrees)', x + 10, y + 5);

  let cx = x + 34, cy = y + 40, cw = w - 46, ch = h - 50;
  let tWin = 1.6;
  let tNow = simMs / 1000;
  let tFrom = tNow - tWin;
  let yMax = 45;
  let xOf = (t) => cx + (t - tFrom) / tWin * cw;
  let yOf = (v) => cy + ch / 2 - constrain(v, -yMax, yMax) / yMax * (ch / 2);

  noStroke();
  fill('whitesmoke');
  rect(cx, cy, cw, ch);
  stroke('lightgray');
  strokeWeight(1);
  for (let v = -30; v <= 30; v += 30) line(cx, yOf(v), cx + cw, yOf(v));
  noStroke();
  fill('gray');
  textSize(12);
  textAlign(RIGHT, CENTER);
  for (let v = -30; v <= 30; v += 30) text(v, cx - 4, yOf(v));

  let pts = chartPts.filter((p) => p.t >= tFrom - 0.1);
  let series = [
    { key: 'acc', col: 'tomato', wt: 1.5, name: 'accelerometer only' },
    { key: 'gyro', col: 'royalblue', wt: 2, name: 'gyroscope only' },
    { key: 'fused', col: 'seagreen', wt: 3, name: 'fused' },
    { key: 'truth', col: 'black', wt: 1.5, name: 'truth' }
  ];
  for (let k = 0; k < series.length; k++) {
    noFill();
    stroke(series[k].col);
    strokeWeight(series[k].wt);
    beginShape();
    for (let i = 0; i < pts.length; i++) {
      vertex(max(cx, xOf(pts[i].t)), yOf(pts[i][series[k].key]));
    }
    endShape();
  }

  // legend with the current error of each method
  noStroke();
  textSize(12);
  textAlign(LEFT, TOP);
  let last = pts.length > 0 ? pts[pts.length - 1] : null;
  let lx = x + 10;
  let items = [
    { c: 'tomato', t: 'accel: ' + (last ? nfs(last.acc - last.truth, 1, 1) : '--') },
    { c: 'royalblue', t: 'gyro: ' + (last ? nfs(last.gyro - last.truth, 1, 1) : '--') },
    { c: 'seagreen', t: 'fused: ' + (last ? nfs(last.fused - last.truth, 1, 1) : '--') },
    { c: 'black', t: 'truth' }
  ];
  textSize(12);
  fill('dimgray');
  text('error (deg):', x + 10, y + 21);
  let lxx = x + 92;
  for (let i = 0; i < items.length; i++) {
    fill(items[i].c);
    rect(lxx, y + 24, 8, 8);
    fill('black');
    text(items[i].t, lxx + 11, y + 21);
    lxx += textWidth(items[i].t) + 24;
  }
  if (pts.length === 0) {
    fill('gray');
    textAlign(CENTER, CENTER);
    textSize(13);
    text('Press Start to see the four angle estimates', cx + cw / 2, cy + ch / 2);
  }
  noFill();
  stroke('silver');
  strokeWeight(1);
  rect(cx, cy, cw, ch);
}

// ---------- the bus and the five devices ----------

let CARD_TOP = 296, CARD_H = 130;

function cardGeom(i) {
  let dispW = 150;
  let w1 = (lw - 28 - dispW - 32) / 4;
  if (i < 4) return { x: 14 + i * (w1 + 8), w: w1 };
  return { x: 14 + 4 * (w1 + 8), w: dispW };
}

function drawBus() {
  let sclY = 242, sdaY = 258;
  noStroke();
  fill('midnightblue');
  textAlign(LEFT, CENTER);
  stroke('midnightblue');
  strokeWeight(2);
  fill('lavender');
  rect(14, 232, 60, 38, 8);
  noStroke();
  fill('midnightblue');
  textAlign(CENTER, CENTER);
  textSize(14);
  text('CPU', 44, 251);

  strokeWeight(3);
  stroke('purple');
  line(74, sclY, lw - 14, sclY);
  stroke('navy');
  line(74, sdaY, lw - 14, sdaY);
  noStroke();
  // labels sit in the gap between the Distance and Battery cards, clear of the taps
  let gapX = (cardGeom(2).x + cardGeom(2).w + cardGeom(3).x) / 2;
  fill('purple');
  textSize(12);
  textAlign(CENTER, BOTTOM);
  text('SCL clock', gapX, sclY - 2);
  fill('navy');
  textAlign(CENTER, TOP);
  text('SDA data', gapX, sdaY + 3);

  // shared MPU-6050 frame around the first two cards
  let g0 = cardGeom(0), g1 = cardGeom(1);
  stroke('steelblue');
  strokeWeight(2);
  noFill();
  rect(g0.x - 4, CARD_TOP - 18, g1.x + g1.w - g0.x + 8, CARD_H + 22, 8);
  noStroke();
  fill('steelblue');
  textSize(12);
  textAlign(LEFT, TOP);
  text('one chip, 0x68', g0.x + g0.w * 0.62 + 28, CARD_TOP - 15);

  for (let i = 0; i < 5; i++) drawCard(i);
}

function drawCard(i) {
  let g = cardGeom(i);
  let L = LANES[i];
  let age = millis() - activeFlash[i];
  let glow = isRunning || simMs > 0 ? constrain(1 - age / 200, 0, 1) : 0;

  // taps from the bus wires
  let sclX = g.x + g.w * 0.62, sdaX = g.x + g.w * 0.62 + 20;
  stroke(glow > 0.2 ? 'limegreen' : 'dimgray');
  strokeWeight(glow > 0.2 ? 3 : 2);
  line(sclX, 242, sclX, CARD_TOP);
  line(sdaX, 258, sdaX, CARD_TOP);
  noStroke();
  fill('purple');
  circle(sclX, 242, 7);
  fill('navy');
  circle(sdaX, 258, 7);

  // body
  stroke(glow > 0.2 ? 'limegreen' : L.col);
  strokeWeight(glow > 0.2 ? 4 : 2);
  fill(lerpColor(color('white'), color('honeydew'), glow));
  rect(g.x, CARD_TOP, g.w, CARD_H, 8);
  noStroke();
  fill(L.col);
  rect(g.x + 1, CARD_TOP + 1, g.w - 2, 20, 7, 7, 0, 0);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(13);
  text(L.name, g.x + g.w / 2, CARD_TOP + 11);

  let cxm = g.x + g.w / 2;
  fill('dimgray');
  textSize(12);
  text(L.chip, cxm, CARD_TOP + 31);
  fill('black');
  textFont('monospace');
  textSize(14);
  text('0x' + L.addr.toString(16).toUpperCase().padStart(2, '0'), cxm, CARD_TOP + 46);
  textFont('sans-serif');

  let spec = ['reg 0x3B, 6 bytes', 'reg 0x43, 6 bytes', 'reg 0x1E, 2 bytes', 'reg 0x02, 2 bytes', '1024-byte frame'][i];
  fill('dimgray');
  textSize(12);
  text(spec, cxm, CARD_TOP + 61);
  let rate = ['every 10 ms', 'every 10 ms', 'every 50 ms', 'every 250 ms', displayRateText()][i];
  text(rate, cxm, CARD_TOP + 75);

  let data = devData[L.key];
  if (i < 4) {
    textFont('monospace');
    textSize(11);
    fill('black');
    text(data && data.bytes ? hexList(data.bytes, 6) : '-- -- -- --', cxm, CARD_TOP + 92);
    textFont('sans-serif');
    textSize(12);
    fill(L.col);
    text(data ? data.text : 'waiting...', cxm, CARD_TOP + 111);
  } else {
    drawOledScreen(g.x + (g.w - 128) / 2, CARD_TOP + 84, 128, 42);
  }
}

function displayRateText() {
  let v = int(oledSelect.selected());
  return v === 0 ? 'display off' : 'every ' + v + ' ms';
}

// the mock OLED shows only what has fully arrived over the wire
function drawOledScreen(x, y, w, h) {
  stroke('dimgray');
  strokeWeight(2);
  fill('black');
  rect(x, y, w, h, 3);
  noStroke();
  fill('cyan');
  textFont('monospace');
  textSize(10);
  textAlign(LEFT, TOP);
  if (screenText) {
    for (let i = 0; i < screenText.length; i++) text(screenText[i], x + 6, y + 3 + i * 12);
  } else {
    fill('gray');
    text(int(oledSelect.selected()) === 0 ? 'display is off' : 'blank screen', x + 6, y + 3);
  }
  textFont('sans-serif');
}

// ---------- the timeline, drawn to scale ----------

function drawGantt(x, y, w) {
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Bus timeline, drawn to scale: the last 200 milliseconds of simulated time', x, y);

  let lx0 = x + 108;
  let lx1 = x + w;
  let laneH = 15;
  let ly0 = y + 20;
  let tWin = 200;
  let tFrom = simMs - tWin;
  let xOf = (t) => lx0 + (t - tFrom) / tWin * (lx1 - lx0);

  for (let i = 0; i < LANES.length; i++) {
    let ly = ly0 + i * (laneH + 1);
    noStroke();
    fill(LANES[i].col);
    textAlign(LEFT, CENTER);
    textSize(12);
    text(LANES[i].name, x, ly + laneH / 2);
    fill('whitesmoke');
    stroke('lightgray');
    strokeWeight(1);
    rect(lx0, ly, lx1 - lx0, laneH);
  }
  // time grid every 20 ms
  for (let k = 0; k <= 10; k++) {
    let tx = lx1 - k * (lx1 - lx0) / 10;
    stroke('lightgray');
    strokeWeight(1);
    line(tx, ly0, tx, ly0 + 6 * (laneH + 1));
    if (k % 2 === 0 && k < 10) {
      noStroke();
      fill('gray');
      textSize(12);
      textAlign(CENTER, TOP);
      text(k === 0 ? 'now' : '-' + (k * 20) + ' ms', tx, ly0 + 6 * (laneH + 1) + 1);
    }
  }
  // waiting bars: the job was due but the bus was busy
  for (let i = 0; i < waits.length; i++) {
    let wv = waits[i];
    let ly = ly0 + wv.lane * (laneH + 1);
    let a = max(lx0, xOf(wv.t0)), b = min(lx1, xOf(min(wv.t1, simMs)));
    if (b > a) {
      noStroke();
      fill(255, 120, 120, 150);
      rect(a, ly + 3, b - a, laneH - 6);
    }
  }
  // transactions
  for (let i = 0; i < blocks.length; i++) {
    let b = blocks[i];
    if (b.t0 > simMs) continue;
    let a = max(lx0, xOf(b.t0));
    let e = min(lx1, xOf(min(b.t1, simMs)));
    if (e < lx0) continue;
    let ly = ly0 + b.lane * (laneH + 1);
    noStroke();
    fill(LANES[b.lane].col);
    rect(a, ly + 1, max(2, e - a), laneH - 2, 1);
    if (b.lane === 4) {
      let label = 'frame ' + (b.t1 - b.t0).toFixed(1) + ' ms';
      textSize(12);
      if (e - a > textWidth(label) + 8) {
        fill('white');
        textAlign(CENTER, CENTER);
        text(label, (a + e) / 2, ly + laneH / 2);
      }
    }
  }
  if (blocks.length === 0) {
    noStroke();
    fill('gray');
    textAlign(CENTER, CENTER);
    textSize(13);
    text('Press Start: each bus transaction appears here at its true length', (lx0 + lx1) / 2, ly0 + 3 * (laneH + 1));
  }
  // legend for the red bars
  noStroke();
  fill(255, 120, 120, 200);
  rect(x, ly0 + 6 * (laneH + 1) + 2, 12, 9);
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, TOP);
  text('= due but had to wait', x + 16, ly0 + 6 * (laneH + 1) + 1);
}

// ---------- the CPU's main loop code ----------

function currentTaskId() {
  if (simMs === 0 && blocks.length === 0) return null;
  for (let i = blocks.length - 1; i >= 0; i--) {
    let b = blocks[i];
    if (b.t0 <= simMs && simMs <= b.t1) {
      return b.lane <= 1 ? 'imu' : (b.lane === 2 ? 'dist' : (b.lane === 3 ? 'batt' : (b.lane === 4 ? 'oled' : lastBlockTask(i))));
    }
  }
  return 'idle';
}

// a CPU-math block belongs to the task that ran just before or after it
function lastBlockTask(i) {
  for (let j = i - 1; j >= 0; j--) {
    let l = blocks[j].lane;
    if (l <= 1) return 'imu';
    if (l === 2) return 'dist';
    if (l === 3) return 'batt';
  }
  return 'oled';
}

function drawCodePanel(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  text('The CPU main loop (MicroPython)', x + 10, y + 5);

  let lines = [
    { id: 'idle', t: 'while True:' },
    { id: 'imu', t: '  if due(IMU):  accel, gyro, fuse   # 0x68' },
    { id: 'dist', t: '  if due(DIST): read distance       # 0x29' },
    { id: 'batt', t: '  if due(BATT): read voltage        # 0x40' },
    { id: 'oled', t: '  if due(OLED): draw, send frame    # 0x3C' }
  ];
  let active = currentTaskId();
  textFont('monospace');
  textSize(11);
  for (let i = 0; i < lines.length; i++) {
    let ly = y + 24 + i * 14;
    if (lines[i].id === active) {
      noStroke();
      fill('lightyellow');
      rect(x + 5, ly - 1, w - 10, 14, 3);
    }
    noStroke();
    fill(lines[i].id === active ? 'black' : 'dimgray');
    text(lines[i].t, x + 10, ly);
  }
  textFont('sans-serif');
}

// ---------- statistics and the transaction inspector ----------

function drawInfoPanel(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  text('How busy is the bus?', x + 10, y + 5);

  // bus busy over the last 200 ms
  let busy = 0;
  let t0 = max(0, simMs - 200);
  for (let i = 0; i < blocks.length; i++) {
    let b = blocks[i];
    if (b.lane > 4) continue;
    let a = max(b.t0, t0), e = min(b.t1, simMs);
    if (e > a) busy += e - a;
  }
  let span = max(1, simMs - t0);
  let pct = constrain(busy / span * 100, 0, 100);
  let imuHz = imuStarts.length > 1 ? (imuStarts.length - 1) / ((imuStarts[imuStarts.length - 1] - imuStarts[0]) / 1000) : 0;
  let worst = 0;
  for (let i = 0; i < imuLates.length; i++) worst = max(worst, imuLates[i].late);

  textSize(12);
  fill('black');
  text('Bus busy: ' + nf(pct, 1, 0) + '%   (last 200 ms)', x + 10, y + 21);
  fill(imuHz > 0 && imuHz < 80 ? 'firebrick' : 'black');
  text('Gyro and accelerometer reads per second: ' + (imuHz > 0 ? nf(imuHz, 1, 0) : '--') + ' (goal 100)', x + 10, y + 35);
  fill(worst > 5 ? 'firebrick' : 'black');
  text('Longest wait for a sensor read: ' + nf(worst, 1, 1) + ' ms', x + 10, y + 49);
  fill('dimgray');
  textSize(12);
  text(lastTxn, x + 10, y + 65, w - 20, 34);
}

// ---------- control labels ----------

function drawControlLabels() {
  let dh = drawAreaHeight();
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  if (isNarrow()) {
    text('Time speed: ' + speedSlider.value() + '%', 10, dh + 58);
    text('Bus:', 10, dh + 94);
    text('Display:', 165, dh + 94);
  } else {
    text('Time speed: ' + speedSlider.value() + '%', 255, dh + 20);
    text('Bus speed:', 10, dh + 58);
    text('Display:', max(340, canvasWidth - 270), dh + 58);
    fill('dimgray');
    textSize(13);
    text('Try 100 kHz with the display at 20 per second.', 250, dh + 78);
  }
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

function isNarrow() {
  return canvasWidth < 640;
}

function ctrlHeight() {
  return isNarrow() ? 125 : controlHeight;   // three rows of controls when narrow
}

function totalHeight() {
  return drawAreaHeight() + ctrlHeight();
}
