// Interactive Conditional Flowchart MicroSim
// CANVAS_HEIGHT: 500
// Students move a sensor-reading slider and watch the active path through an
// if-elif-else chain light up green, with a live evaluation panel showing each
// condition's True/False result and which output fires.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 450;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 200;
let defaultTextSize = 16;

// Application
let reading = 512;
let readingSlider;
let mouseOverCanvas = false;
let pulsePhase = 0;

// Decision thresholds and output labels
let conditions = [
  { text: 'reading < 10000?', py: 'reading < 10000', threshold: 10000 },
  { text: 'reading < 30000?', py: 'reading < 30000', threshold: 30000 },
  { text: 'reading < 50000?', py: 'reading < 50000', threshold: 50000 }
];
let outputs = ['Very dark', 'Dim', 'Bright', 'Very bright'];

// Diamond geometry (y fixed, x responsive)
let dY = [80, 190, 300];
let oY4 = 398;
let dw = 150, dh = 62;
let ow = 122, oh = 44;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);

  readingSlider = createSlider(0, 65535, reading);
  readingSlider.position(sliderLeftMargin, drawHeight + 10);
  readingSlider.size(canvasWidth - sliderLeftMargin - margin);

  describe('An interactive flowchart of an if-elif-else chain. A slider sets a ' +
    'sensor reading from 0 to 65535. The path the program takes lights up green ' +
    'through the decision diamonds to the output that fires, and a panel shows ' +
    'each condition result.', LABEL);
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

  reading = readingSlider.value();
  if (mouseOverCanvas) pulsePhase += 0.08;

  // Determine the active branch index (which output fires)
  let fired = activeOutput(reading);

  // Layout positions (responsive)
  let dcx = max(100, canvasWidth * 0.17);
  let ocx = canvasWidth * 0.42;
  let dwLocal = min(dw, canvasWidth * 0.28);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(22);
  text('Conditional Flowchart: if / elif / else', canvasWidth * 0.40, 10);

  // ---- Connectors (drawn first, under nodes) ----
  // For each diamond: a True branch (right to output) and a False branch (down)
  for (let i = 0; i < 3; i++) {
    let reachedDiamond = (i === 0) || (fired >= i); // diamond i is evaluated if all previous were false
    let trueTaken = (fired === i);
    let falseTaken = (fired > i);
    // True branch -> output to the right
    drawArrow(dcx + dwLocal / 2, dY[i], ocx - ow / 2, dY[i], trueTaken, 'True');
    // False branch -> down
    if (i < 2) {
      drawArrow(dcx, dY[i] + dh / 2, dcx, dY[i + 1] - dh / 2, falseTaken, 'False');
    } else {
      drawArrow(dcx, dY[i] + dh / 2, dcx, oY4 - oh / 2, falseTaken, 'False');
    }
  }

  // ---- Decision diamonds ----
  for (let i = 0; i < 3; i++) {
    let evaluated = (i === 0) || (fired >= i);
    let active = evaluated;
    drawDiamond(dcx, dY[i], dwLocal, dh, conditions[i].text, active);
  }

  // ---- Output rectangles ----
  // True-branch outputs sit to the right of each diamond
  drawOutput(ocx, dY[0], outputs[0], fired === 0);
  drawOutput(ocx, dY[1], outputs[1], fired === 1);
  drawOutput(ocx, dY[2], outputs[2], fired === 2);
  // Else output sits below the last diamond
  drawOutput(dcx, oY4, outputs[3], fired === 3);

  // ---- Evaluation panel (right side) ----
  drawPanel(reading, fired);

  // ---- Hover tooltip on a diamond ----
  drawTooltip(dcx, dwLocal, reading);

  // Control label
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Sensor reading: ' + reading, 10, drawHeight + 22);
}

// Which output (0..3) fires for a given reading
function activeOutput(r) {
  if (r < 10000) return 0;
  if (r < 30000) return 1;
  if (r < 50000) return 2;
  return 3;
}

function drawDiamond(cx, cy, w, h, label, active) {
  if (active) {
    stroke('green');
    strokeWeight(3 + (active ? sin(pulsePhase) * 1.2 : 0));
    fill('honeydew');
  } else {
    stroke('silver');
    strokeWeight(1.5);
    fill('white');
  }
  quad(cx, cy - h / 2, cx + w / 2, cy, cx, cy + h / 2, cx - w / 2, cy);
  noStroke();
  fill(active ? 'darkgreen' : 'gray');
  textAlign(CENTER, CENTER);
  textSize(13);
  text(label, cx - w / 2 + 6, cy - h / 2, w - 12, h);
}

function drawOutput(cx, cy, label, active) {
  if (active) {
    stroke('green');
    strokeWeight(3);
    fill('palegreen');
  } else {
    stroke('silver');
    strokeWeight(1.5);
    fill('white');
  }
  rectMode(CENTER);
  rect(cx, cy, ow, oh, 8);
  rectMode(CORNER);
  noStroke();
  fill(active ? 'darkgreen' : 'dimgray');
  textAlign(CENTER, CENTER);
  textSize(14);
  textStyle(active ? BOLD : NORMAL);
  text(label, cx, cy);
  textStyle(NORMAL);
}

function drawArrow(x1, y1, x2, y2, active, lbl) {
  if (active) {
    stroke('green');
    strokeWeight(3);
    fill('green');
  } else {
    stroke('silver');
    strokeWeight(1.5);
    fill('silver');
  }
  line(x1, y1, x2, y2);
  // arrowhead
  let ang = atan2(y2 - y1, x2 - x1);
  push();
  translate(x2, y2);
  rotate(ang);
  triangle(0, 0, -8, -4, -8, 4);
  pop();
  // branch label
  noStroke();
  fill(active ? 'green' : 'gray');
  textAlign(CENTER, CENTER);
  textSize(12);
  let mx = (x1 + x2) / 2;
  let my = (y1 + y2) / 2;
  if (abs(x2 - x1) > abs(y2 - y1)) {
    text(lbl, mx, my - 10);
  } else {
    text(lbl, mx + 18, my);
  }
}

function drawPanel(r, fired) {
  let px = canvasWidth * 0.64;
  let pw = canvasWidth * 0.34;
  if (pw < 150) return; // too narrow to show panel
  let py = 70;
  let ph = 320;
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(px, py, pw, ph, 10);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(15);
  text('Trace the Path', px + 12, py + 10);
  textStyle(NORMAL);
  textSize(14);
  text('reading = ' + r, px + 12, py + 36);

  let lineY = py + 70;
  for (let i = 0; i < 3; i++) {
    let reached = (i === 0) || (fired >= i);
    let result = (r < conditions[i].threshold);
    let label;
    let col;
    if (!reached) {
      label = (i + 1) + ') not reached';
      col = 'silver';
    } else {
      label = (i + 1) + ') ' + r + ' < ' + conditions[i].threshold + '?  ' + (result ? 'True' : 'False');
      col = result ? 'green' : 'firebrick';
    }
    fill(col);
    text(label, px + 12, lineY, pw - 20);
    lineY += 44;
  }
  fill('darkgreen');
  textStyle(BOLD);
  textSize(15);
  text('Output: ' + outputs[fired], px + 12, lineY + 6, pw - 20);
  textStyle(NORMAL);
}

function drawTooltip(dcx, w, r) {
  // Show a Python tooltip when hovering over a diamond
  for (let i = 0; i < 3; i++) {
    if (insideDiamond(mouseX, mouseY, dcx, dY[i], w, dh)) {
      let result = (r < conditions[i].threshold);
      let line1 = 'if ' + conditions[i].py + ':';
      let line2 = '-> ' + (result ? 'True' : 'False');
      let tw = 200;
      let tx = constrain(mouseX + 12, 0, canvasWidth - tw - 4);
      let ty = constrain(mouseY + 12, 0, drawHeight - 56);
      fill('black');
      noStroke();
      rect(tx, ty, tw, 50, 6);
      fill('white');
      textAlign(LEFT, TOP);
      textFont('monospace');
      textSize(13);
      text(line1, tx + 8, ty + 6);
      text(line2, tx + 8, ty + 26);
      textFont('Arial');
      return;
    }
  }
}

function insideDiamond(mx, my, cx, cy, w, h) {
  // Diamond test: |dx|/(w/2) + |dy|/(h/2) <= 1
  let dx = abs(mx - cx) / (w / 2);
  let dy = abs(my - cy) / (h / 2);
  return (dx + dy) <= 1;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  readingSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
