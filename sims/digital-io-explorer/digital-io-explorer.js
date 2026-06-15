// Digital I/O Debounce Explorer MicroSim
// CANVAS_HEIGHT: 460
// Students press a button and watch a noisy bounce signal travel through a
// software debounce timer to a clean LED output. A slider sets the debounce time
// and a mode toggle switches between software debouncing and a hardware RC curve.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 380;
let controlHeight = 80;   // 2 control rows
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 200;
let defaultTextSize = 16;

// State machine
let outputState = false;  // clean LED state
let targetState = false;  // state we are switching toward
let phase = 'idle';       // 'idle' | 'bouncing' | 'settling'
let animClock = 0;        // real ms since press
let SLOWDOWN = 45;        // real ms per model ms (slows the animation to be visible)
let bounceModel = 5;      // model ms of bounce
let settleStartModel = 0;
let history = [];         // {t, v} samples of the raw signal
let jitterVal = 0;

// Controls
let debounceTime = 30;
let mode = 'Software';
let pressButton, debounceSlider, modeSelect;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  pressButton = createButton('Press Button');
  pressButton.position(10, drawHeight + 8);
  pressButton.mousePressed(triggerPress);

  modeSelect = createSelect();
  modeSelect.option('Software');
  modeSelect.option('Hardware');
  modeSelect.selected('Software');
  modeSelect.position(135, drawHeight + 8);

  debounceSlider = createSlider(10, 100, 30, 5);
  debounceSlider.position(sliderLeftMargin, drawHeight + 46);
  debounceSlider.size(canvasWidth - sliderLeftMargin - margin);

  describe('A digital input debounce explorer. Pressing the button creates a ' +
    'noisy bounce signal on the left. A debounce timer in the center waits for ' +
    'the signal to settle, then the output LED on the right changes cleanly. A ' +
    'slider sets the debounce time and a toggle switches between software and ' +
    'hardware (RC) debouncing.', LABEL);
}

function triggerPress() {
  targetState = !outputState;
  animClock = 0;
  history = [];
  phase = (mode === 'Hardware') ? 'settling' : 'bouncing';
  settleStartModel = 0;
}

function draw() {
  updateCanvasSize();

  // Backgrounds
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  debounceTime = debounceSlider.value();
  mode = modeSelect.value();

  // Advance the animation only while an event is in progress (idle = static)
  if (phase !== 'idle') animClock += min(deltaTime, 50);
  let modelMs = animClock / SLOWDOWN;

  let startLevel = outputState ? 1 : 0;
  let targetLevel = targetState ? 1 : 0;
  let raw = outputState ? 1 : 0;
  let timerFrac = 0;

  if (phase === 'bouncing') {
    if (frameCount % 3 === 0) jitterVal = (random() < 0.5) ? 0 : 1;
    raw = jitterVal;
    timerFrac = 0;
    if (modelMs >= bounceModel) { phase = 'settling'; settleStartModel = modelMs; }
  } else if (phase === 'settling') {
    if (mode === 'Hardware') {
      let f = constrain(modelMs / debounceTime, 0, 1);
      raw = startLevel + (targetLevel - startLevel) * (1 - exp(-3.2 * f));
      timerFrac = f;
    } else {
      raw = targetLevel;
      timerFrac = constrain((modelMs - settleStartModel) / debounceTime, 0, 1);
    }
    if (timerFrac >= 1) { outputState = targetState; phase = 'idle'; }
  }

  if (phase !== 'idle') history.push({ t: modelMs, v: raw });

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Button Debounce: Input → Logic → Output', canvasWidth / 2, 8);

  let buttonPressed = (phase !== 'idle');
  drawButton(canvasWidth * 0.16, 92, buttonPressed);
  drawWaveform(margin, 150, canvasWidth * 0.30, 150, raw);
  drawDebounceBlock(canvasWidth * 0.37, 130, canvasWidth * 0.26, 130, timerFrac);
  drawLED(canvasWidth * 0.84, 175, outputState);

  // Flow arrows
  drawFlowArrow(margin + canvasWidth * 0.30 + 4, 200, canvasWidth * 0.37 - 4, 200);
  drawFlowArrow(canvasWidth * 0.63 + 4, 200, canvasWidth * 0.78, 200);

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Debounce time: ' + debounceTime + ' ms', 10, drawHeight + 56);
}

function drawButton(cx, cy, pressed) {
  noStroke();
  fill('gray');
  ellipse(cx, cy + 4, 56, 46); // base
  fill(pressed ? 'firebrick' : 'crimson');
  ellipse(cx, cy + (pressed ? 2 : -2), 48, 40); // cap
  fill('black');
  textAlign(CENTER, TOP);
  textSize(13);
  text('Button (GP15)', cx, cy + 30);
  textSize(11);
  fill('dimgray');
  text(pressed ? 'pressed' : 'released', cx, cy + 46);
}

function drawWaveform(x, y, w, h, raw) {
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 6);
  noStroke();
  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(12);
  text(mode === 'Hardware' ? 'Raw input (RC smoothed)' : 'Raw input (bouncy)', x + 6, y + 4);

  // threshold line
  let topY = y + 26;
  let botY = y + h - 16;
  stroke('lightgray');
  strokeWeight(1);
  line(x + 6, (topY + botY) / 2, x + w - 6, (topY + botY) / 2);
  noStroke();
  fill('silver');
  textSize(10);
  text('1', x + 8, topY - 4);
  text('0', x + 8, botY - 6);

  // plot history
  let tMax = max(bounceModel + debounceTime + 2, 10);
  if (history.length > 1) {
    stroke('royalblue');
    strokeWeight(2);
    noFill();
    beginShape();
    for (let s of history) {
      let px = map(s.t, 0, tMax, x + 16, x + w - 8);
      let py = map(s.v, 0, 1, botY, topY);
      vertex(px, py);
    }
    endShape();
  } else {
    // idle: flat line at current output
    stroke('royalblue');
    strokeWeight(2);
    let py = map(raw, 0, 1, botY, topY);
    line(x + 16, py, x + w - 8, py);
  }
  noStroke();
}

function drawDebounceBlock(x, y, w, h, frac) {
  fill('lavender');
  stroke('mediumpurple');
  strokeWeight(2);
  rect(x, y, w, h, 8);
  noStroke();
  fill('indigo');
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(14);
  text(mode === 'Hardware' ? 'RC Filter' : 'Debounce Logic', x + w / 2, y + 8);
  textStyle(NORMAL);

  // timer bar
  let barX = x + 14;
  let barY = y + 42;
  let barW = w - 28;
  let barH = 22;
  fill('white');
  stroke('gray');
  strokeWeight(1);
  rect(barX, barY, barW, barH, 4);
  noStroke();
  fill('mediumseagreen');
  rect(barX, barY, barW * frac, barH, 4);
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(12);
  text(Math.round(frac * debounceTime) + ' / ' + debounceTime + ' ms', x + w / 2, barY + barH + 16);

  // status
  fill('dimgray');
  textSize(11);
  let status = (phase === 'bouncing') ? 'absorbing bounces...' :
               (phase === 'settling') ? 'timer running...' : 'stable';
  text(status, x + w / 2, barY + barH + 36);
}

function drawLED(cx, cy, on) {
  noStroke();
  if (on) {
    fill(255, 230, 120, 120);
    ellipse(cx, cy, 70, 70); // glow
  }
  fill(on ? 'gold' : 'darkgray');
  stroke('gray');
  strokeWeight(1);
  ellipse(cx, cy, 44, 44);
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(13);
  text('Output LED', cx, cy + 30);
  textSize(12);
  fill(on ? 'darkgoldenrod' : 'gray');
  text(on ? 'ON' : 'OFF', cx, cy + 48);
}

function drawFlowArrow(x1, y, x2, y2) {
  stroke('gray');
  strokeWeight(2);
  fill('gray');
  line(x1, y, x2, y);
  triangle(x2, y, x2 - 8, y - 4, x2 - 8, y + 4);
  noStroke();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  debounceSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
