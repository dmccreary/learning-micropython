// I2C Start Bit and Address Framing MicroSim
// CANVAS_HEIGHT: 700
// One controller, two devices: an EEPROM at 0x50 and an LCD backpack at 0x27.
// Step through a real transaction (write a 16-bit memory address, then read
// one byte back) and watch which device is "listening" at each moment.
// Teaches: the start bit (and repeated start) is the ONLY moment a device
// checks the address byte against its own ID. Every byte after that is just
// data to whichever device already matched -- so the EEPROM's two address
// bytes can never be mistaken for the LCD's address, even if the numbers
// happened to collide, because the LCD stopped listening after step 2.
// Bloom level: Understand (explain) - step-through with concrete bus state,
// not continuous animation, per the instructional-design checkpoint.
// MicroSim template version 2026.03

// global variables for width and height
let containerWidth;
let canvasWidth = 400;
let drawHeight = 582;
let controlHeight = 92;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 280;
let defaultTextSize = 16;

// laid out for a 680 px wide design; narrower containers scale the picture down
const DESIGN_W = 680;
let s = 1;
let lw = 680;

const EEPROM_ADDR = 0x50;
const LCD_ADDR = 0x27;
const MEM_HI = 0x12;
const MEM_LO = 0x34;
const DATA_BYTE = 0x7F;
const hx = (n) => '0x' + n.toString(16).toUpperCase().padStart(2, '0');

// ---- the 13 bus frames, one per step (index 0..12) ----
const FRAMES = [
  { label: 'S', cap: 'start', kind: 'M' },
  { label: hx(EEPROM_ADDR) + ' W', cap: 'addr + write (' + hx(EEPROM_ADDR << 1) + ')', kind: 'C' },
  { label: 'ACK', cap: 'EEPROM acks', kind: 'A' },
  { label: hx(MEM_HI), cap: 'mem addr hi', kind: 'T' },
  { label: 'ACK', cap: 'EEPROM acks', kind: 'A' },
  { label: hx(MEM_LO), cap: 'mem addr lo', kind: 'T' },
  { label: 'ACK', cap: 'EEPROM acks', kind: 'A' },
  { label: 'Sr', cap: 'repeated start', kind: 'M' },
  { label: hx(EEPROM_ADDR) + ' R', cap: 'addr + read (' + hx((EEPROM_ADDR << 1) | 1) + ')', kind: 'C' },
  { label: 'ACK', cap: 'EEPROM acks', kind: 'A' },
  { label: hx(DATA_BYTE), cap: 'data byte', kind: 'T' },
  { label: 'NACK', cap: 'we stop here', kind: 'N' },
  { label: 'P', cap: 'stop', kind: 'M' }
];

// ---- the "what the driver does on the wire" pseudocode, one line per step ----
const CODE_LINES = [
  'send_start()                      # S  - every transaction begins here',
  'send_byte(0x50 << 1 | 0)          # -> 0xA0  address + WRITE bit',
  'wait_for_ack()                    # EEPROM pulls SDA low: "that\'s me!"',
  'send_byte(0x12)                   # high byte of a 16-bit memory address',
  'wait_for_ack()                    # just confirms the byte, no address check',
  'send_byte(0x34)                   # low byte of the memory address',
  'wait_for_ack()                    # EEPROM now knows which byte we want',
  'send_start()                      # Sr - repeated start, no stop in between',
  'send_byte(0x50 << 1 | 1)          # -> 0xA1  same address + READ bit',
  'wait_for_ack()',
  'byte = read_byte()                # EEPROM drives SDA with the data',
  'send_nack()                       # "that\'s all I need" - 1 byte only',
  'send_stop()                       # P  - bus goes idle'
];

// ---- per-step device state and narration ----
// eeprom/lcd: 'listening' | 'match' | 'ack' | 'rx' | 'tx' | 'ignoring' | 'idle'
const STEPS = [
  { eeprom: 'listening', lcd: 'listening', text: 'START condition (S). Every I2C transaction begins here. Both the EEPROM and the LCD start listening -- neither knows yet who this message is for.' },
  { eeprom: 'match', lcd: 'ignoring', text: '0x50 shifted left + the write bit = 0xA0. Every device compares this to its OWN address. 0x50 is the EEPROM\'s address, not the LCD\'s (0x27).' },
  { eeprom: 'ack', lcd: 'ignoring', text: 'MATCH! The EEPROM pulls SDA low for one clock pulse -- that\'s the ACK. The LCD\'s address did not match, so it releases the bus and stops listening until the next START.' },
  { eeprom: 'rx', lcd: 'ignoring', text: '0x12: the high byte of a 16-bit memory address. This is just DATA to the EEPROM, which already matched. The LCD never sees this as an address -- it isn\'t listening anymore.' },
  { eeprom: 'ack', lcd: 'ignoring', text: 'ACK. The EEPROM is only confirming it received the byte. There is no new address check here -- that only happens right after a start bit.' },
  { eeprom: 'rx', lcd: 'ignoring', text: '0x34: the low byte of the memory address. Together, 0x1234 tells the EEPROM exactly which of its bytes to read. Still just data -- still no address check.' },
  { eeprom: 'ack', lcd: 'ignoring', text: 'ACK. The EEPROM now knows precisely which byte the controller wants.' },
  { eeprom: 'listening', lcd: 'listening', text: 'Repeated START (Sr). No STOP happened -- the controller keeps the bus. This is the key moment: EVERY device resets and starts listening for an address again, including the LCD.' },
  { eeprom: 'match', lcd: 'ignoring', text: '0x50 shifted left + the read bit = 0xA1. The LCD compares this address too -- and again it is not 0x27, so it stays silent.' },
  { eeprom: 'ack', lcd: 'ignoring', text: 'ACK from the EEPROM. It already knows which byte to send, from the address bytes back in steps 4 and 6.' },
  { eeprom: 'tx', lcd: 'ignoring', text: 'The EEPROM drives SDA with the requested byte: 0x7F. The controller just reads now -- it does not send anything meaningful on SDA.' },
  { eeprom: 'idle', lcd: 'ignoring', text: 'NACK. The controller tells the EEPROM "that\'s all I need" -- no more bytes wanted this time.' },
  { eeprom: 'idle', lcd: 'idle', text: 'STOP condition (P). The bus goes idle. Every device -- EEPROM and LCD alike -- goes back to simply listening for the next START.' }
];

const N_STEPS = STEPS.length; // 13
let currentStep = -1; // -1 = idle, before the transaction; 0..12 = STEPS index
let isPlaying = false;
let msSincePlay = 0;
const PLAY_INTERVAL = 1600;

// ---- controls ----
let prevButton, nextButton, playButton, resetButton, stepSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, totalHeight());
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  textSize(defaultTextSize);

  prevButton = createButton('< Prev');
  prevButton.parent(mainElement);
  prevButton.mousePressed(stepPrev);

  nextButton = createButton('Next >');
  nextButton.parent(mainElement);
  nextButton.mousePressed(stepNext);

  playButton = createButton('Play');
  playButton.parent(mainElement);
  playButton.mousePressed(togglePlay);

  resetButton = createButton('Reset');
  resetButton.parent(mainElement);
  resetButton.mousePressed(resetSim);

  stepSlider = createSlider(-1, N_STEPS - 1, -1, 1);
  stepSlider.parent(mainElement);
  stepSlider.input(() => { currentStep = stepSlider.value(); isPlaying = false; playButton.html('Play'); });

  layoutControls();

  describe('A step-through diagram of an I2C bus transaction. A controller writes a 16-bit memory address to an EEPROM at address 0x50, then reads one byte back, while an LCD display at address 0x27 shares the same two wires. Each step highlights the active bus frame, the EEPROM and LCD listening state, and the matching line of driver pseudocode, with a caption explaining why the LCD never confuses the EEPROM data bytes with its own address.', LABEL);
}

// ---------- controls ----------

function layoutControls() {
  let dh = drawAreaHeight();
  let row1 = dh + 8;
  prevButton.position(10, row1);
  nextButton.position(80, row1);
  playButton.position(150, row1);
  resetButton.position(210, row1);
  stepSlider.position(sliderLeftMargin, row1 + 4);
  stepSlider.size(max(80, canvasWidth - sliderLeftMargin - margin));
}

function stepNext() {
  isPlaying = false;
  playButton.html('Play');
  currentStep = min(N_STEPS - 1, currentStep + 1);
  stepSlider.value(currentStep);
}

function stepPrev() {
  isPlaying = false;
  playButton.html('Play');
  currentStep = max(-1, currentStep - 1);
  stepSlider.value(currentStep);
}

function togglePlay() {
  isPlaying = !isPlaying;
  playButton.html(isPlaying ? 'Pause' : 'Play');
  if (isPlaying && currentStep >= N_STEPS - 1) currentStep = -1;
  msSincePlay = 0;
}

function resetSim() {
  currentStep = -1;
  isPlaying = false;
  playButton.html('Play');
  stepSlider.value(currentStep);
}

// ---------- main draw loop ----------

function draw() {
  updateCanvasSize();
  s = min(1, canvasWidth / DESIGN_W);
  lw = canvasWidth / s;

  if (isPlaying) {
    msSincePlay += deltaTime;
    if (msSincePlay >= PLAY_INTERVAL) {
      msSincePlay = 0;
      currentStep++;
      if (currentStep >= N_STEPS) { currentStep = N_STEPS - 1; isPlaying = false; playButton.html('Play'); }
      stepSlider.value(currentStep);
    }
  }

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawAreaHeight());
  fill('white');
  rect(0, drawAreaHeight(), canvasWidth, ctrlHeight());

  push();
  scale(s);
  drawTitle();
  drawFramePanel(14, 42, lw - 28, 76);
  drawDevicePanels(14, 128, lw - 28, 96);
  drawCodePanel(14, 236, lw - 28, 236);
  drawCaptionPanel(14, 484, lw - 28, 90);
  pop();

  drawControlLabels();
}

function drawTitle() {
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(20);
  text('I2C Start Bit and Address Framing', lw / 2, 2);
  textSize(13);
  fill('dimgray');
  let msg = currentStep < 0
    ? 'Press Next or Play: a controller reads one byte from an EEPROM (0x50) while an LCD (0x27) shares the bus.'
    : 'Step ' + (currentStep + 1) + ' of ' + N_STEPS + ': ' + FRAMES[currentStep].cap;
  text(msg, lw / 2, 24);
}

// ---------- the bus frame strip ----------

function drawFramePanel(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  text('The bus frame (SDA)', x + 10, y + 5);

  let fills = { C: 'lightsteelblue', T: 'palegreen', M: 'khaki', A: 'wheat', N: 'lightpink' };
  let strokes = { C: 'steelblue', T: 'seagreen', M: 'darkgoldenrod', A: 'darkorange', N: 'crimson' };
  let total = FRAMES.reduce((a, b) => a + 46, 0) + 4 * (FRAMES.length - 1);
  let fx = x + (w - total) / 2, fy = y + 28, fh = 24, bw = 46;
  for (let i = 0; i < FRAMES.length; i++) {
    let b = FRAMES[i];
    let on = i <= currentStep;
    let active = i === currentStep;
    stroke(active ? 'darkorange' : strokes[b.kind]);
    strokeWeight(active ? 3 : 1.3);
    fill(on ? fills[b.kind] : 'whitesmoke');
    rect(fx, fy, bw, fh, 5);
    noStroke();
    fill(on ? 'black' : 'darkgray');
    textAlign(CENTER, CENTER);
    textFont('monospace');
    textSize(11);
    text(b.label, fx + bw / 2, fy + fh / 2);
    textFont('sans-serif');
    if (active) {
      fill('darkorange');
      textSize(10);
      textAlign(CENTER, TOP);
      text(b.cap, fx + bw / 2, fy + fh + 2);
    }
    fx += bw + 4;
  }
}

// ---------- the two device panels ----------

function deviceVisual(state) {
  // returns {label, fill, stroke, textCol}
  switch (state) {
    case 'listening': return { label: 'LISTENING for a start bit', fill: 'white', stroke: 'teal', textCol: 'teal' };
    case 'match': return { label: 'MATCH! comparing address...', fill: 'lemonchiffon', stroke: 'darkorange', textCol: 'darkorange' };
    case 'ack': return { label: 'ACK -- pulling SDA low', fill: 'honeydew', stroke: 'seagreen', textCol: 'seagreen' };
    case 'rx': return { label: 'receiving a data byte', fill: 'honeydew', stroke: 'seagreen', textCol: 'seagreen' };
    case 'tx': return { label: 'sending a data byte', fill: 'honeydew', stroke: 'seagreen', textCol: 'seagreen' };
    case 'ignoring': return { label: 'NOT ME -- ignoring the bus', fill: 'whitesmoke', stroke: 'darkgray', textCol: 'darkgray' };
    default: return { label: 'idle, waiting for a start bit', fill: 'white', stroke: 'silver', textCol: 'dimgray' };
  }
}

function drawDevicePanels(x, y, w, h) {
  let gap = 12, pw = (w - gap) / 2;
  drawOneDevice(x, y, pw, h, 'EEPROM', hx(EEPROM_ADDR), currentStep < 0 ? 'idle' : STEPS[currentStep].eeprom);
  drawOneDevice(x + pw + gap, y, pw, h, 'LCD backpack', hx(LCD_ADDR), currentStep < 0 ? 'idle' : STEPS[currentStep].lcd);
}

function drawOneDevice(x, y, w, h, name, addr, state) {
  let v = deviceVisual(state);
  stroke(v.stroke);
  strokeWeight(state === 'ignoring' ? 1.3 : 2.4);
  fill(v.fill);
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  text(name + '  (' + addr + ')', x + 10, y + 7);
  fill(v.textCol);
  textAlign(CENTER, CENTER);
  textSize(13);
  text(v.label, x + w / 2, y + h / 2 + 10);
}

// ---------- the code panel ----------

function drawCodePanel(x, y, w, h) {
  noStroke();
  fill('black');
  rect(x, y, w, h, 8);
  fill('skyblue');
  textAlign(LEFT, TOP);
  textFont('monospace');
  textSize(12);
  text('# what i2c.writeto()/readfrom() do on the wire', x + 10, y + 8);
  let lineH = (h - 30) / CODE_LINES.length;
  for (let i = 0; i < CODE_LINES.length; i++) {
    let ly = y + 26 + i * lineH;
    if (i === currentStep) {
      noStroke();
      fill(60, 90, 40);
      rect(x + 4, ly - 1, w - 8, lineH, 3);
    }
    noStroke();
    fill(i === currentStep ? 'palegreen' : (i < currentStep ? 'darkseagreen' : 'gray'));
    textSize(12);
    text(CODE_LINES[i], x + 10, ly);
  }
  textFont('sans-serif');
}

// ---------- the caption / "what just happened" panel ----------

function drawCaptionPanel(x, y, w, h) {
  stroke('silver');
  strokeWeight(1);
  fill('lightyellow');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  let msg = currentStep < 0
    ? 'The LCD only checks the byte right after a START or repeated-START. It ignores every other byte until the bus resets -- that is why the EEPROM\'s address bytes can never be mistaken for the LCD\'s address.'
    : STEPS[currentStep].text;
  text(msg, x + 10, y + 8, w - 20, h - 16);
}

// ---------- control labels ----------

function drawControlLabels() {
  let dh = drawAreaHeight();
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  let label = currentStep < 0 ? 'idle' : ('step ' + (currentStep + 1) + ' / ' + N_STEPS);
  text('Drag to scrub: ' + label, 10, drawAreaHeight() + 56);
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
