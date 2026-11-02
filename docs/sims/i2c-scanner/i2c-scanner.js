// I2C Bus Scanner MicroSim
// CANVAS_HEIGHT: 690
// The CPU (controller) calls out every I2C address from 0x08 to 0x77 and listens
// for an ACK. Three devices are on the bus: an MPU-6050 (accelerometer + gyro,
// 0x68), an HMC5883L (compass, 0x1E) and an SSD1306 OLED display (0x3C).
// Devices never announce themselves - the CPU asks, and only the device that
// owns the address answers by pulling SDA low during the ACK clock pulse.
// Bloom level: Understand (explain, demonstrate) - step-through pattern.
// MicroSim template version 2026.03

// global variables for width and height
let containerWidth;
let canvasWidth = 400;
let drawHeight = 600;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 300;
let defaultTextSize = 16;

// The drawing is laid out for a 680 px wide design. Narrower containers shrink
// the picture uniformly; wider containers just get more room.
const DESIGN_W = 680;
let s = 1;    // uniform scale factor
let lw = 680; // logical width in design pixels

// I2C addresses a scan visits. 0x00-0x07 and 0x78-0x7F are reserved.
const FIRST_ADDR = 0x08;
const LAST_ADDR = 0x77;

// The devices on the bus, left to right
let devices = [
  { name: 'MPU-6050', role: 'accelerometer + gyro', addr: 0x68, col: 'steelblue', plugged: true },
  { name: 'HMC5883L', role: 'compass', addr: 0x1E, col: 'seagreen', plugged: true },
  { name: 'SSD1306', role: 'OLED display', addr: 0x3C, col: 'darkorange', plugged: true }
];

// scan state
let scanState = 'idle';   // 'idle' | 'scanning' | 'done'
let isRunning = false;    // MicroSims open paused
let stepMode = false;     // run exactly one address, then pause
let scanIdx = 0;          // index of the address being asked
let phaseP = 0;           // 0..1 progress through the current address
let holdElapsed = 0;      // ms spent showing the ACK bubble
let ackNow = false;       // did the current address get an ACK?
let cellState = new Array(128).fill(0); // 0 not asked, 1 NACK, 2 ACK
let cellOwner = new Array(128).fill(-1);
let consoleLines = [];
let staleNote = false;

// controls
let startButton, stepButton, resetButton, speedSlider;
let mpuBox, hmcBox, oledBox, pauseAckBox;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, totalHeight());
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  startButton = createButton('Start');
  startButton.parent(mainElement);
  startButton.mousePressed(onStart);

  stepButton = createButton('Step');
  stepButton.parent(mainElement);
  stepButton.mousePressed(onStep);

  resetButton = createButton('Reset');
  resetButton.parent(mainElement);
  resetButton.mousePressed(onReset);

  speedSlider = createSlider(1, 10, 3, 1);
  speedSlider.parent(mainElement);

  mpuBox = createCheckbox(' MPU-6050', true);
  mpuBox.parent(mainElement);
  mpuBox.changed(() => { devices[0].plugged = mpuBox.checked(); onPlugChange(); });
  hmcBox = createCheckbox(' HMC5883L', true);
  hmcBox.parent(mainElement);
  hmcBox.changed(() => { devices[1].plugged = hmcBox.checked(); onPlugChange(); });
  oledBox = createCheckbox(' SSD1306', true);
  oledBox.parent(mainElement);
  oledBox.changed(() => { devices[2].plugged = oledBox.checked(); onPlugChange(); });
  pauseAckBox = createCheckbox(' Pause at each ACK', false);
  pauseAckBox.parent(mainElement);

  layoutControls();
  updateStartLabel();

  describe('An I2C bus with a CPU and three devices: an MPU-6050 at address 0x68, an HMC5883L compass at 0x1E and an SSD1306 display at 0x3C. The CPU asks each address from 0x08 to 0x77 and a device answers with an ACK only when its own address is called. An address map fills in and a console prints the devices found.', LABEL);
}

// ---------- controls ----------

function layoutControls() {
  let dh = drawAreaHeight();
  // row 1: buttons and the speed slider
  let row1 = dh + 8;
  startButton.position(10, row1);
  stepButton.position(104, row1);
  resetButton.position(158, row1);
  speedSlider.position(sliderLeftMargin, row1 + 2);
  speedSlider.size(max(60, canvasWidth - sliderLeftMargin - margin));
  // row 2: plug-in checkboxes spread across the width
  let row2 = dh + 44;
  let slot = max(120, (canvasWidth - 20) / 4);
  mpuBox.position(10, row2);
  hmcBox.position(10 + slot, row2);
  oledBox.position(10 + slot * 2, row2);
  pauseAckBox.position(10 + slot * 3, row2);
}

function onStart() {
  if (scanState === 'done') {
    startNewScan();
    isRunning = true;
  } else {
    if (scanState === 'idle') beginScan();
    isRunning = !isRunning;
  }
  stepMode = false;
  updateStartLabel();
}

function onStep() {
  if (scanState === 'done') startNewScan();
  if (scanState === 'idle') beginScan();
  if (isRunning) return;
  if (phaseP >= 1) {
    // the ACK bubble is showing - skip straight to the next address
    holdElapsed = 1e9;
  }
  stepMode = true;
  isRunning = true;
  updateStartLabel();
}

function onReset() {
  scanState = 'idle';
  isRunning = false;
  stepMode = false;
  scanIdx = 0;
  phaseP = 0;
  holdElapsed = 0;
  ackNow = false;
  cellState.fill(0);
  cellOwner.fill(-1);
  consoleLines = [];
  staleNote = false;
  updateStartLabel();
}

function onPlugChange() {
  // plugging or unplugging mid-scan takes effect on the next address asked
  if (scanState === 'done') staleNote = true;
}

function updateStartLabel() {
  if (scanState === 'done') startButton.html('Scan again');
  else if (isRunning) startButton.html('Pause');
  else if (scanState === 'scanning') startButton.html('Resume');
  else startButton.html('Start');
}

// ---------- scan logic ----------

function currentAddr() {
  return FIRST_ADDR + scanIdx;
}

function msPerAddress() {
  // speed 1 = 2000 ms per address (bits easy to follow), speed 10 = about 30 ms
  return 2000 * Math.pow(0.6, speedSlider.value() - 1);
}

function beginScan() {
  scanState = 'scanning';
  scanIdx = 0;
  phaseP = 0;
  holdElapsed = 0;
  ackNow = false;
  staleNote = false;
  consoleLines = ['>>> %Run i2c-scanner.py', 'Scanning I2C bus...'];
}

function startNewScan() {
  cellState.fill(0);
  cellOwner.fill(-1);
  beginScan();
}

function deviceAt(addr) {
  for (let i = 0; i < devices.length; i++) {
    if (devices[i].plugged && devices[i].addr === addr) return i;
  }
  return -1;
}

function holdTime() {
  return ackNow ? max(700, msPerAddress() * 1.2) : 0;
}

function advanceScan(dt) {
  if (scanState !== 'scanning') return;
  if (phaseP < 1) {
    phaseP += dt / msPerAddress();
    if (phaseP >= 1) {
      phaseP = 1;
      resolveCurrent();
    }
  } else {
    holdElapsed += dt;
    if (holdElapsed >= holdTime()) nextAddress();
  }
}

function resolveCurrent() {
  let a = currentAddr();
  let owner = deviceAt(a);
  ackNow = owner >= 0;
  cellState[a] = ackNow ? 2 : 1;
  cellOwner[a] = owner;
  holdElapsed = 0;
  if (ackNow && pauseAckBox.checked() && !stepMode) {
    isRunning = false;
    holdElapsed = holdTime(); // continue straight on when Resume is pressed
    updateStartLabel();
  }
}

function nextAddress() {
  scanIdx++;
  phaseP = 0;
  holdElapsed = 0;
  ackNow = false;
  if (currentAddr() > LAST_ADDR) {
    finishScan();
    return;
  }
  if (stepMode) {
    stepMode = false;
    isRunning = false;
    updateStartLabel();
  }
}

function finishScan() {
  scanState = 'done';
  isRunning = false;
  stepMode = false;
  scanIdx = LAST_ADDR - FIRST_ADDR; // the last address asked stays on screen
  phaseP = 1;
  let found = foundList();
  if (found.length === 0) {
    consoleLines.push('No I2C devices found. Check your wiring!');
  } else {
    for (let i = 0; i < found.length; i++) {
      consoleLines.push('Found device at ' + hex2(found[i]) + ' = ' + found[i]);
    }
    consoleLines.push(found.length + ' device(s) found.');
  }
  updateStartLabel();
}

function foundList() {
  let found = [];
  for (let a = FIRST_ADDR; a <= LAST_ADDR; a++) {
    if (cellState[a] === 2) found.push(a);
  }
  return found;
}

function hex2(n) {
  return '0x' + n.toString(16).padStart(2, '0');
}

// ---------- main draw loop ----------

function draw() {
  updateCanvasSize();
  s = min(1, canvasWidth / DESIGN_W);
  lw = canvasWidth / s;

  // drawing region and control region
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawAreaHeight());
  fill('white');
  rect(0, drawAreaHeight(), canvasWidth, ctrlHeight());

  if (isRunning) advanceScan(min(deltaTime, 100));

  push();
  scale(s);
  drawTitle();
  drawBus();
  drawWaveformPanel();
  drawAddressGrid();
  drawScanCodePanel();
  drawConsole();
  pop();

  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(22);
  text('I2C Bus Scanner', lw / 2, 5);
  textSize(14);
  fill('dimgray');
  text(statusText(), lw / 2, 31);
}

function statusText() {
  let a = currentAddr();
  if (scanState === 'idle') {
    return 'Paused: press Start to scan 0x08 to 0x77, or Step to go one address at a time.';
  }
  if (scanState === 'done') {
    let found = foundList();
    let list = '[' + found.join(', ') + ']';
    if (staleNote) return 'Devices changed. Press "Scan again" to see the new result.';
    return 'Scan complete. i2c.scan() returns ' + list + ' (decimal) = ' + found.map(hex2).join(', ');
  }
  let slot = slotNow();
  if (phaseP >= 1) {
    if (ackNow) return 'ACK! The ' + devices[cellOwner[a]].name + ' owns ' + hex2(a) + ', so it pulled SDA low.';
    return 'NACK: nobody pulled SDA low, so nobody lives at ' + hex2(a) + '.';
  }
  if (!isRunning) return 'Paused at ' + hex2(a) + '. Press Resume or Step.';
  if (slot < 1) return 'CPU: START - SDA falls while SCL is high.';
  if (slot < 8) return 'CPU sends address bit A' + (7 - slot) + ' of ' + hex2(a) + ' = ' + bin7(a) + '.';
  if (slot < 9) return 'CPU sends the R/W bit: 0 means "I want to write to you".';
  if (slot < 10) return 'ACK clock pulse: does any device pull SDA low?';
  return 'CPU: STOP - SDA rises while SCL is high.';
}

function bin7(n) {
  return n.toString(2).padStart(7, '0');
}

// ---------- the bus diagram ----------

let CPU_X = 14, CPU_Y = 70, CPU_W = 118, CPU_H = 86;
let SCL_Y = 100, SDA_Y = 128;
let DEV_Y = 176, DEV_H = 64;

function devCenterX(i) {
  let left = CPU_X + CPU_W + 24;
  let colW = (lw - left - 10) / 3;
  return left + colW * i + colW / 2;
}

function devWidth() {
  let left = CPU_X + CPU_W + 24;
  return (lw - left - 10) / 3 - 14;
}

function drawBus() {
  let busStart = CPU_X + CPU_W;
  let busEnd = lw - 12;
  let a = currentAddr();
  let slot = slotNow();
  let sdaLevel = sdaNow();

  // pull-up resistors from the 3.3 V rail
  let railY = 62;
  let r1 = busStart + 28; // SCL pull-up
  let r2 = busStart + 62; // SDA pull-up
  stroke('firebrick');
  strokeWeight(2);
  line(busStart + 8, railY, r2 + 14, railY);
  noStroke();
  fill('firebrick');
  textSize(12);
  textAlign(LEFT, CENTER);
  text('3.3 V', r2 + 20, railY);
  drawResistor(r1, railY, SCL_Y);
  drawResistor(r2, railY, SDA_Y);
  fill('dimgray');
  textAlign(LEFT, CENTER);
  text('pull-up resistors', r2 + 66, railY + 22);

  // the two bus wires
  strokeWeight(3);
  stroke(scanState === 'scanning' ? 'purple' : 'mediumpurple');
  line(busStart, SCL_Y, busEnd, SCL_Y);
  stroke(sdaLevel === 0 ? 'navy' : 'royalblue');
  line(busStart, SDA_Y, busEnd, SDA_Y);
  noStroke();
  fill('purple');
  textAlign(RIGHT, CENTER);
  textSize(13);
  text('SCL clock', busEnd, SCL_Y - 11);
  fill('navy');
  text('SDA data', busEnd, SDA_Y + 11);

  // bit packet travelling along SDA while the address is clocked out
  if (scanState === 'scanning' && phaseP < 1 && slot >= 1 && slot < 9) {
    let frac = tNow() - floor(tNow());
    let bit = bitForSlot(a, slot);
    let px = lerp(busStart + 4, busEnd - 70, frac);
    stroke('navy');
    strokeWeight(2);
    fill(bit ? 'navy' : 'white');
    circle(px, SDA_Y, 13);
  }

  // CPU
  drawCpu(a);

  // devices
  for (let i = 0; i < devices.length; i++) drawDevice(i, a, slot);
}

function drawResistor(x, y1, y2) {
  stroke('firebrick');
  strokeWeight(2);
  noFill();
  line(x, y1, x, y1 + 8);
  beginShape();
  vertex(x, y1 + 8);
  vertex(x - 5, y1 + 11);
  vertex(x + 5, y1 + 15);
  vertex(x - 5, y1 + 19);
  vertex(x + 5, y1 + 23);
  vertex(x, y1 + 26);
  endShape();
  line(x, y1 + 26, x, y2);
  noStroke();
  fill('firebrick');
  circle(x, y2, 7);
  circle(x, y1, 7);
}

function drawCpu(a) {
  stroke('midnightblue');
  strokeWeight(2);
  fill('lavender');
  rect(CPU_X, CPU_Y, CPU_W, CPU_H, 8);
  noStroke();
  fill('midnightblue');
  textAlign(CENTER, TOP);
  textSize(15);
  text('CPU (Pico)', CPU_X + CPU_W / 2, CPU_Y + 5);
  textSize(12);
  fill('dimgray');
  text('controller', CPU_X + CPU_W / 2, CPU_Y + 23);
  if (scanState === 'idle') {
    fill('dimgray');
    textSize(13);
    text('ready', CPU_X + CPU_W / 2, CPU_Y + 52);
  } else if (scanState === 'done') {
    let n = foundList().length;
    fill('darkgreen');
    textSize(15);
    text('Scan done', CPU_X + CPU_W / 2, CPU_Y + 44);
    fill('black');
    textSize(13);
    text(n + (n === 1 ? ' device' : ' devices') + ' found', CPU_X + CPU_W / 2, CPU_Y + 64);
  } else {
    fill('black');
    textSize(12);
    text('Is anyone at', CPU_X + CPU_W / 2, CPU_Y + 38);
    textSize(22);
    textFont('monospace');
    text(hex2(a), CPU_X + CPU_W / 2, CPU_Y + 52);
    textFont('sans-serif');
    textSize(11);
    fill('dimgray');
    text('= ' + a + ' decimal', CPU_X + CPU_W / 2, CPU_Y + 74 - 2);
  }
}

function drawDevice(i, a, slot) {
  let d = devices[i];
  let cx = devCenterX(i);
  let w = devWidth();
  let x = cx - w / 2;
  let sclTapX = cx - 18;
  let sdaTapX = cx + 18;
  let responding = scanState === 'scanning' && ackNow && cellOwner[a] === i && (phaseP >= 1 || slot >= 9);
  // during the ACK slot itself the matching device already answers
  let listening = scanState === 'scanning' && d.plugged && phaseP < 1 && slot >= 1 && slot < 9;

  // taps from the bus wires
  if (d.plugged) {
    stroke(responding ? 'limegreen' : 'dimgray');
    strokeWeight(responding ? 4 : 2);
    line(sclTapX, SCL_Y, sclTapX, DEV_Y);
    line(sdaTapX, SDA_Y, sdaTapX, DEV_Y);
    noStroke();
    fill('purple');
    circle(sclTapX, SCL_Y, 8);
    fill('navy');
    circle(sdaTapX, SDA_Y, 8);
  } else {
    stroke('silver');
    strokeWeight(2);
    drawingContext.setLineDash([4, 4]);
    line(sclTapX, SCL_Y, sclTapX, DEV_Y);
    line(sdaTapX, SDA_Y, sdaTapX, DEV_Y);
    drawingContext.setLineDash([]);
  }

  // device body
  if (d.plugged) {
    stroke(responding ? 'limegreen' : d.col);
    strokeWeight(responding ? 4 : 2);
    fill('white');
  } else {
    stroke('silver');
    strokeWeight(2);
    drawingContext.setLineDash([5, 4]);
    fill('whitesmoke');
  }
  rect(x, DEV_Y, w, DEV_H, 8);
  drawingContext.setLineDash([]);

  noStroke();
  fill(d.plugged ? d.col : 'silver');
  rect(x + 1, DEV_Y + 1, w - 2, 21, 7, 7, 0, 0);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(14);
  text(d.name, cx, DEV_Y + 12);

  fill(d.plugged ? 'dimgray' : 'silver');
  textSize(12);
  text(d.role, cx, DEV_Y + 32);
  fill(d.plugged ? 'black' : 'silver');
  textSize(15);
  textFont('monospace');
  text(hex2(d.addr) + ' (' + d.addr + ')', cx, DEV_Y + 51);
  textFont('sans-serif');

  // speech bubble under the device
  let by = DEV_Y + DEV_H + 5;
  textSize(13);
  textAlign(CENTER, TOP);
  if (!d.plugged) {
    fill('darkgray');
    text('unplugged', cx, by);
  } else if (responding) {
    stroke('limegreen');
    strokeWeight(2);
    fill('honeydew');
    rect(cx - w / 2, by - 2, w, 19, 9);
    noStroke();
    fill('darkgreen');
    textSize(13);
    text('ACK! That is me.', cx, by);
  } else if (listening) {
    fill('gray');
    text('listening...', cx, by);
  } else if (scanState === 'scanning' && phaseP >= 1) {
    fill('darkgray');
    text('not me', cx, by);
  }
  if (responding && phaseP < 1 || (responding && phaseP >= 1)) {
    // green arrow: device pulls SDA low
    stroke('limegreen');
    strokeWeight(3);
    noFill();
    let ay = DEV_Y - 6;
    line(sdaTapX + 8, DEV_Y - 2, sdaTapX + 8, SDA_Y + 8);
    line(sdaTapX + 8, SDA_Y + 8, sdaTapX + 3, SDA_Y + 16);
    line(sdaTapX + 8, SDA_Y + 8, sdaTapX + 13, SDA_Y + 16);
    noStroke();
    fill('darkgreen');
    textAlign(LEFT, CENTER);
    textSize(12);
    text('pulls SDA low', sdaTapX + 17, SDA_Y + 30);
  }
}

// ---------- waveform ----------

const T_MIN = -0.4;
const T_MAX = 11.4;

function tNow() {
  return lerp(T_MIN, T_MAX, phaseP);
}

function slotNow() {
  if (scanState === 'idle') return -1;
  return floor(tNow());
}

function bitForSlot(addr, slot) {
  if (slot >= 1 && slot <= 7) return (addr >> (7 - slot)) & 1; // A6 first
  return 0; // R/W bit = 0 (write)
}

function sclAt(t) {
  if (t < 0) return 1;
  let k = floor(t);
  let f = t - k;
  if (k === 0) return f < 0.6 ? 1 : 0;
  if (k >= 1 && k <= 9) return f < 0.5 ? 0 : 1;
  return f < 0.3 ? 0 : 1;
}

function sdaAt(t, addr, ack) {
  if (t < 0.3) return 1;
  let k = floor(t);
  let f = t - k;
  if (k === 0) return f < 0.3 ? 1 : 0;
  if (k >= 1 && k <= 8) return bitForSlot(addr, k);
  if (k === 9) return ack ? 0 : 1;
  return f < 0.6 ? 0 : 1; // slot 10: master pulls low, then STOP releases it
}

function sdaNow() {
  if (scanState !== 'scanning') return 1;
  return sdaAt(tNow(), currentAddr(), cellOwner[currentAddr()] >= 0 || deviceAt(currentAddr()) >= 0);
}

function drawWaveformPanel() {
  let px = 14, py = 270, pw = lw - 28, ph = 114;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(px, py, pw, ph, 8);

  let a = currentAddr();
  let showAddr = scanState === 'idle' ? FIRST_ADDR : a;
  let ack = deviceAt(showAddr) >= 0;

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Wires for ' + hex2(showAddr) + ' = ' + bin7(showAddr) + ' in binary, followed by a 0 write bit', px + 10, py + 5);

  // trace geometry
  let x0 = px + 54;
  let x1 = px + pw - 12;
  let slotW = (x1 - x0) / (T_MAX - T_MIN);
  let xOf = (t) => x0 + (t - T_MIN) * slotW;
  let sclHi = py + 32, sclLo = py + 50;
  let sdaHi = py + 72, sdaLo = py + 90;
  let tCur = scanState === 'idle' ? T_MIN : tNow();

  // row labels
  noStroke();
  fill('purple');
  textAlign(RIGHT, CENTER);
  textSize(13);
  text('SCL', x0 - 8, (sclHi + sclLo) / 2);
  fill('navy');
  text('SDA', x0 - 8, (sdaHi + sdaLo) / 2);

  // ACK slot highlight
  if (scanState !== 'idle' && tCur >= 9) {
    noStroke();
    fill(ack ? color(200, 245, 200) : color(255, 220, 220));
    rect(xOf(9), py + 26, slotW, 71);
  }

  // slot boundaries and labels
  let labels = ['S', 'A6', 'A5', 'A4', 'A3', 'A2', 'A1', 'A0', 'R/W', 'ACK?', 'P'];
  for (let k = 0; k <= 10; k++) {
    stroke('gainsboro');
    strokeWeight(1);
    line(xOf(k), py + 26, xOf(k), py + 97);
    noStroke();
    fill(k === slotNow() && phaseP < 1 ? 'black' : 'gray');
    textAlign(CENTER, TOP);
    textSize(12);
    text(labels[k], xOf(k + 0.5), py + 99);
  }
  // meaning of S and P under the first and last slots is in the labels row
  // bit values drawn on the SDA row
  if (scanState !== 'idle') {
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(13);
    for (let k = 1; k <= 8; k++) {
      if (tCur >= k + 0.5) {
        fill(k === 8 ? 'dimgray' : 'midnightblue');
        text(String(bitForSlot(showAddr, k)), xOf(k + 0.5), (sclLo + sdaHi) / 2);
      }
    }
    if (tCur >= 9.5) {
      fill(ack ? 'darkgreen' : 'firebrick');
      textSize(12);
      text(ack ? 'ACK (0)' : 'NACK (1)', xOf(9.5), (sclLo + sdaHi) / 2);
    }
  }

  // the traces, drawn up to the current time and faintly ahead of it
  drawTrace(xOf, T_MIN, T_MAX, (t) => sclAt(t), sclHi, sclLo, 'gainsboro', 1);
  drawTrace(xOf, T_MIN, T_MAX, (t) => sdaAt(t, showAddr, ack), sdaHi, sdaLo, 'gainsboro', 1);
  if (scanState !== 'idle') {
    drawTrace(xOf, T_MIN, tCur, (t) => sclAt(t), sclHi, sclLo, 'purple', 2.5);
    drawTrace(xOf, T_MIN, tCur, (t) => sdaAt(t, showAddr, ack), sdaHi, sdaLo, 'navy', 2.5);
    // moving cursor
    stroke('darkorange');
    strokeWeight(2);
    line(xOf(tCur), py + 24, xOf(tCur), py + 97);
  }

  if (scanState === 'idle') {
    noStroke();
    fill('gray');
    textAlign(CENTER, CENTER);
    textSize(14);
    text('Press Start or Step: the clock (SCL) and data (SDA) traces appear here.', px + pw / 2, py + 62);
  }
}

function drawTrace(xOf, tFrom, tTo, fn, yHi, yLo, col, wt) {
  stroke(col);
  strokeWeight(wt);
  noFill();
  beginShape();
  let dtStep = 0.02;
  for (let t = tFrom; t <= tTo; t += dtStep) {
    vertex(xOf(t), fn(t) ? yHi : yLo);
  }
  vertex(xOf(tTo), fn(tTo) ? yHi : yLo);
  endShape();
}

// ---------- address map ----------

let GRID_CW = 22, GRID_CH = 19;

function drawAddressGrid() {
  let gx = 14 + 32;
  let gy = 420;
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  text('Address map (hex): who answered?', 14, 388);

  // column headers
  textAlign(CENTER, CENTER);
  textSize(12);
  fill('dimgray');
  for (let c = 0; c < 16; c++) {
    text(c.toString(16), gx + c * GRID_CW + GRID_CW / 2, gy - 8);
  }
  for (let r = 0; r < 8; r++) {
    textAlign(RIGHT, CENTER);
    text('0x' + (r * 16).toString(16).padStart(2, '0'), gx - 4, gy + r * GRID_CH + GRID_CH / 2 + 1);
  }

  let a = currentAddr();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 16; c++) {
      let addr = r * 16 + c;
      let x = gx + c * GRID_CW;
      let y = gy + r * GRID_CH;
      let reserved = addr < FIRST_ADDR || addr > LAST_ADDR;
      let st = cellState[addr];
      stroke('lightgray');
      strokeWeight(1);
      if (reserved) fill('gainsboro');
      else if (st === 2) fill(devices[cellOwner[addr]].col);
      else if (st === 1) fill('mistyrose');
      else fill('white');
      rect(x, y, GRID_CW, GRID_CH);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(12);
      if (reserved) {
        fill('darkgray');
        text('-', x + GRID_CW / 2, y + GRID_CH / 2 + 1);
      } else if (st === 2) {
        fill('white');
        text(addr.toString(16).padStart(2, '0'), x + GRID_CW / 2, y + GRID_CH / 2 + 1);
      } else if (st === 1) {
        fill('indianred');
        text(addr.toString(16).padStart(2, '0'), x + GRID_CW / 2, y + GRID_CH / 2 + 1);
      } else {
        fill('silver');
        text(addr.toString(16).padStart(2, '0'), x + GRID_CW / 2, y + GRID_CH / 2 + 1);
      }
    }
  }
  // current-address marker
  if (scanState === 'scanning') {
    let r = floor(a / 16), c = a % 16;
    noFill();
    stroke('darkorange');
    strokeWeight(3);
    rect(gx + c * GRID_CW, gy + r * GRID_CH, GRID_CW, GRID_CH);
  }

  // legend
  let ly = gy + 8 * GRID_CH + 8;
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(12);
  let lx = 14;
  lx = legendItem(lx, ly, 'white', 'not asked yet');
  lx = legendItem(lx, ly, 'mistyrose', 'NACK (no answer)');
  lx = legendItem(lx, ly, 'seagreen', 'ACK');
  lx = legendItem(lx, ly, 'gainsboro', 'reserved');
}

function legendItem(x, y, col, label) {
  stroke('lightgray');
  strokeWeight(1);
  fill(col);
  rect(x, y - 6, 12, 12);
  noStroke();
  fill('dimgray');
  textAlign(LEFT, CENTER);
  text(label, x + 16, y);
  return x + 16 + textWidth(label) + 14;
}

// ---------- what scan() does + console ----------

function panelX() {
  return 14 + 32 + 16 * GRID_CW + 14;
}

function drawScanCodePanel() {
  let x = panelX();
  let y = 388;
  let w = lw - x - 14;
  let h = 104;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);

  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  text('What i2c.scan() does', x + 10, y + 6);

  let slot = slotNow();
  let active = -1;
  if (scanState === 'scanning') {
    if (phaseP >= 1) active = ackNow ? 3 : 3;
    else if (slot < 1) active = 1;
    else if (slot < 9) active = 2;
    else if (slot < 10) active = 3;
    else active = 4;
  }
  let lines = [
    'for addr in range(0x08, 0x78):',
    '    START',
    '    send 7 address bits + W bit',
    '    ACK? (device pulls SDA low)',
    '    STOP'
  ];
  textFont('monospace');
  textSize(12);
  for (let i = 0; i < lines.length; i++) {
    let ly = y + 26 + i * 15;
    if (i === active) {
      fill('lightyellow');
      noStroke();
      rect(x + 5, ly - 1, w - 10, 15, 3);
    }
    fill(i === active ? 'black' : 'dimgray');
    text(lines[i], x + 10, ly);
  }
  textFont('sans-serif');
}

function drawConsole() {
  let x = panelX();
  let y = 500;
  let w = lw - x - 14;
  let h = 92;
  noStroke();
  fill('black');
  rect(x, y, w, h, 8);
  fill('palegreen');
  textAlign(LEFT, TOP);
  textFont('monospace');
  textSize(12);
  let shown = consoleLines.slice(-6);
  for (let i = 0; i < shown.length; i++) {
    text(shown[i], x + 8, y + 6 + i * 14, w - 12);
  }
  if (consoleLines.length === 0) {
    fill('gray');
    text('(output of i2c-scanner.py appears here)', x + 8, y + 6, w - 12);
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
  text('Speed: ' + speedSlider.value(), 216, dh + 20);
  fill('dimgray');
  textSize(13);
  text('Unplug a device (uncheck it), then scan again to see what changes.', 10, dh + 78);
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
