// ADC Potentiometer Explorer MicroSim
// CANVAS_HEIGHT: 480
// Students drag a rotary knob (the potentiometer), read the raw 16-bit ADC value,
// and watch it scale to volts, percent, and a user-defined target range shown as
// a bar graph. The scaling formula updates live.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;  // 2 slider rows
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 200;
let defaultTextSize = 16;

// State
let frac = 0.5;          // knob fraction 0..1
let dragging = false;
let history = [];        // recent raw readings
let lastSample = 0;
let mouseOverCanvas = false;

// Controls
let minSlider, maxSlider;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);

  minSlider = createSlider(0, 1000, 0, 10);
  minSlider.position(sliderLeftMargin, drawHeight + 8);
  minSlider.size(canvasWidth - sliderLeftMargin - margin);

  maxSlider = createSlider(0, 1000, 100, 10);
  maxSlider.position(sliderLeftMargin, drawHeight + 46);
  maxSlider.size(canvasWidth - sliderLeftMargin - margin);

  describe('An ADC potentiometer explorer. Drag the rotary knob on the left to ' +
    'change the reading. The center shows the raw 16-bit value, voltage, percent, ' +
    'and a scaled value using a formula. The right shows a bar graph of the scaled ' +
    'value within a target range set by two sliders.', LABEL);
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

  let rangeMin = minSlider.value();
  let rangeMax = maxSlider.value();

  let raw = Math.round(frac * 65535);
  let voltage = frac * 3.3;
  let percent = frac * 100;
  let scaled = frac * (rangeMax - rangeMin) + rangeMin;

  // Sample history (every 50 ms) while interacting
  if (mouseOverCanvas && millis() - lastSample > 50) {
    history.push(raw);
    if (history.length > 40) history.shift();
    lastSample = millis();
  }

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('ADC Potentiometer Explorer', canvasWidth / 2, 8);

  // Knob (left)
  let knobX = canvasWidth * 0.20;
  let knobY = 150;
  let knobR = 58;
  drawKnob(knobX, knobY, knobR);

  // Waveform under knob
  drawWaveform(margin, 248, canvasWidth * 0.36, 120);

  // Readouts (center)
  drawReadouts(canvasWidth * 0.42, raw, voltage, percent, scaled, rangeMin, rangeMax);

  // Bar graph (right)
  drawBar(canvasWidth * 0.80, scaled, rangeMin, rangeMax);

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Target range min: ' + rangeMin, 10, drawHeight + 18);
  text('Target range max: ' + rangeMax, 10, drawHeight + 56);
}

function drawKnob(cx, cy, r) {
  // arc track
  noFill();
  stroke('lightgray');
  strokeWeight(10);
  arc(cx, cy, r * 2 + 16, r * 2 + 16, radians(135), radians(135 + 270));
  // filled portion up to current fraction
  stroke('royalblue');
  arc(cx, cy, r * 2 + 16, r * 2 + 16, radians(135), radians(135 + 270 * frac));

  // knob body
  noStroke();
  fill(dragging ? 'gainsboro' : 'white');
  stroke('gray');
  strokeWeight(2);
  ellipse(cx, cy, r * 2, r * 2);

  // pointer
  let a = radians(135 + 270 * frac);
  let px = cx + cos(a) * (r - 8);
  let py = cy + sin(a) * (r - 8);
  stroke('crimson');
  strokeWeight(4);
  line(cx, cy, px, py);
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(13);
  text('Potentiometer', cx, cy + r + 6);
  textSize(11);
  fill('dimgray');
  text('(drag to turn)', cx, cy + r + 22);
}

function drawWaveform(x, y, w, h) {
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 6);
  noStroke();
  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(11);
  text('Last ~2 s of ADC samples', x + 6, y + 4);
  if (history.length > 1) {
    stroke('seagreen');
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < history.length; i++) {
      let px = map(i, 0, 39, x + 8, x + w - 8);
      let py = map(history[i], 0, 65535, y + h - 10, y + 22);
      vertex(px, py);
    }
    endShape();
    noStroke();
  } else {
    noStroke();
    fill('silver');
    textAlign(CENTER, CENTER);
    textSize(12);
    text('hover and drag the knob', x + w / 2, y + h / 2 + 6);
  }
}

function drawReadouts(x, raw, voltage, percent, scaled, rmin, rmax) {
  let w = canvasWidth * 0.34;
  textAlign(LEFT, TOP);
  let ly = 56;
  // four readouts
  readoutLine(x, ly, 'Raw ADC', raw + ' / 65535', 'navy'); ly += 40;
  readoutLine(x, ly, 'Voltage', voltage.toFixed(2) + ' V', 'darkgreen'); ly += 40;
  readoutLine(x, ly, 'Percent', percent.toFixed(0) + ' %', 'darkorange'); ly += 40;
  readoutLine(x, ly, 'Scaled', (rmax > rmin ? scaled.toFixed(0) : '—'), 'purple'); ly += 46;

  // formula
  fill('black');
  noStroke();
  textSize(12);
  textFont('monospace');
  text('scaled = raw / 65535', x, ly, w);
  text('   × (max - min) + min', x, ly + 18, w);
  textFont('Arial');
  if (rmax <= rmin) {
    fill('firebrick');
    textSize(12);
    text('Set max greater than min', x, ly + 44, w);
  }
}

function readoutLine(x, y, label, value, col) {
  fill('dimgray');
  noStroke();
  textSize(13);
  text(label, x, y);
  fill(col);
  textStyle(BOLD);
  textSize(20);
  text(value, x, y + 14);
  textStyle(NORMAL);
}

function drawBar(cx, scaled, rmin, rmax) {
  let barW = 46;
  let barTop = 70;
  let barBot = 350;
  let x = cx - barW / 2;
  // frame
  fill('white');
  stroke('gray');
  strokeWeight(1);
  rect(x, barTop, barW, barBot - barTop, 4);
  // fill
  if (rmax > rmin) {
    let fillY = map(scaled, rmin, rmax, barBot, barTop);
    fillY = constrain(fillY, barTop, barBot);
    noStroke();
    fill('mediumpurple');
    rect(x, fillY, barW, barBot - fillY, 4);
    // value label
    fill('black');
    textAlign(CENTER, BOTTOM);
    textSize(13);
    text(scaled.toFixed(0), cx, fillY - 4);
  }
  // min/max labels
  noStroke();
  fill('dimgray');
  textAlign(CENTER, TOP);
  textSize(12);
  text('max ' + rmax, cx, barTop - 18);
  text('min ' + rmin, cx, barBot + 4);
  fill('black');
  textSize(13);
  text('Scaled value', cx, barBot + 22);
}

// Map a mouse position over the knob to a fraction 0..1
function updateFracFromMouse(cx, cy) {
  let a = degrees(atan2(mouseY - cy, mouseX - cx));
  if (a < 0) a += 360;
  // valid sweep is 135 -> 405 (i.e. 135..360 and 0..45)
  let pos;
  if (a >= 135) pos = a - 135;
  else if (a <= 45) pos = a + 360 - 135;
  else { // dead zone at the bottom: clamp to nearest end
    pos = (a < 90) ? 270 : 0;
  }
  frac = constrain(pos / 270, 0, 1);
}

function mousePressed() {
  let knobX = canvasWidth * 0.20;
  let knobY = 150;
  if (dist(mouseX, mouseY, knobX, knobY) <= 70) {
    dragging = true;
    updateFracFromMouse(knobX, knobY);
  }
}

function mouseDragged() {
  if (dragging) {
    updateFracFromMouse(canvasWidth * 0.20, 150);
  }
}

function mouseReleased() {
  dragging = false;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  minSlider.size(canvasWidth - sliderLeftMargin - margin);
  maxSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
