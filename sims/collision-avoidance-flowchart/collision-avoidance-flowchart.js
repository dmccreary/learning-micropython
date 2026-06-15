// Collision Avoidance Flowchart MicroSim
// CANVAS_HEIGHT: 510
// Students set a distance reading and trace the active path through a collision
// avoidance flowchart (Read → Compare → Forward or Stop+Turn). A top-down robot
// performs the chosen action so cause and effect are visible.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 80;  // distance + speed sliders
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 200;
let defaultTextSize = 16;

let THRESHOLD = 20;
let distSlider, speedSlider;
let mouseOverCanvas = false;
let robotY, robotAngle = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);

  distSlider = createSlider(0, 100, 50, 1);
  distSlider.position(sliderLeftMargin, drawHeight + 8);
  distSlider.size(canvasWidth - sliderLeftMargin - margin);

  speedSlider = createSlider(1, 10, 4, 1);
  speedSlider.position(sliderLeftMargin, drawHeight + 46);
  speedSlider.size(canvasWidth - sliderLeftMargin - margin);

  robotY = 380;

  describe('A collision avoidance flowchart. A distance slider sets the sensor ' +
    'reading. The flowchart highlights the active path (Move Forward if the path ' +
    'is clear, Stop and Turn if an obstacle is within 20 cm), and a top-down robot ' +
    'performs the chosen action.', LABEL);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  let distance = distSlider.value();
  let speed = speedSlider.value();
  let clear = distance > THRESHOLD;

  let cx = canvasWidth / 2;

  // Title + distance readout
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Collision Avoidance: Trace the Path', cx, 8);
  textSize(15);
  fill(clear ? 'darkgreen' : 'firebrick');
  text('Distance reading: ' + distance + ' cm   (threshold ' + THRESHOLD + ' cm)', cx, 34);

  // ----- Flowchart -----
  // Read box
  drawBox(cx, 78, 180, 34, 'Read distance sensor', true, 'steelblue');
  // arrow to diamond
  drawArrow(cx, 95, cx, 116, true);
  // diamond
  drawDiamond(cx, 148, 152, 64, 'distance > ' + THRESHOLD + ' cm ?', true);
  // True branch (right) to Move Forward
  drawArrow(cx + 76, 148, cx + 106, 148, clear);
  drawBranchLabel('Yes', cx + 91, 136);
  drawBox(cx + 176, 148, 140, 44, 'Move\nForward', clear, clear ? 'mediumseagreen' : 'lightgray');
  // False branch (left) to Stop & Turn
  drawArrow(cx - 76, 148, cx - 106, 148, !clear);
  drawBranchLabel('No', cx - 91, 136);
  drawBox(cx - 176, 148, 140, 44, 'Stop &\nTurn', !clear, !clear ? 'crimson' : 'lightgray');

  // ----- Robot arena (bottom) -----
  let aTop = 232, aBot = 418, aL = margin, aR = canvasWidth - margin;
  drawArena(aL, aTop, aR - aL, aBot - aTop, distance, clear, speed);

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Distance reading: ' + distance + ' cm', 10, drawHeight + 18);
  text('Robot speed: ' + speed, 10, drawHeight + 56);
}

function drawBox(cx, cy, w, h, label, active, col) {
  rectMode(CENTER);
  stroke(active ? 'green' : 'silver');
  strokeWeight(active ? 3 : 1.5);
  fill(col);
  rect(cx, cy, w, h, 8);
  rectMode(CORNER);
  noStroke();
  fill(active && col !== 'lightgray' ? 'white' : 'dimgray');
  if (col === 'steelblue') fill('white');
  textAlign(CENTER, CENTER);
  textSize(14);
  // support a manual line break
  let lines = label.split('\n');
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], cx, cy - (lines.length - 1) * 8 + i * 16);
  }
}

function drawDiamond(cx, cy, w, h, label, active) {
  stroke(active ? 'green' : 'silver');
  strokeWeight(active ? 3 : 1.5);
  fill(active ? 'honeydew' : 'white');
  quad(cx, cy - h / 2, cx + w / 2, cy, cx, cy + h / 2, cx - w / 2, cy);
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(13);
  text(label, cx - w / 2 + 14, cy - h / 2, w - 28, h);
}

function drawArrow(x1, y1, x2, y2, active) {
  stroke(active ? 'green' : 'silver');
  strokeWeight(active ? 3 : 1.5);
  fill(active ? 'green' : 'silver');
  line(x1, y1, x2, y2);
  let ang = atan2(y2 - y1, x2 - x1);
  push();
  translate(x2, y2);
  rotate(ang);
  noStroke();
  triangle(0, 0, -8, -4, -8, 4);
  pop();
}

function drawBranchLabel(txt, x, y) {
  noStroke();
  fill('dimgray');
  textAlign(CENTER, CENTER);
  textSize(12);
  text(txt, x, y);
}

function drawArena(x, y, w, h, distance, clear, speed) {
  fill(245, 245, 235);
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 6);
  noStroke();
  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(12);
  text('Robot (top-down view)' + (mouseOverCanvas ? '' : ' — hover to run'), x + 6, y + 4);

  let cx = x + w / 2;

  // obstacle bar near the top, gap proportional to distance
  let gap = map(constrain(distance, 0, 100), 0, 100, 18, h - 70);
  let obsY = y + 24;
  fill('indianred');
  rect(x + 12, obsY, w - 24, 14, 3);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(11);
  text('obstacle', cx, obsY + 7);

  // robot motion
  if (mouseOverCanvas) {
    if (clear) {
      robotY -= speed * 0.8;
      if (robotY < obsY + 40) robotY = y + h - 24;
      robotAngle = 0;
    } else {
      robotAngle += speed * 0.04;
    }
  }
  robotY = constrain(robotY, obsY + 40, y + h - 24);

  // draw robot
  push();
  translate(cx, robotY);
  rotate(robotAngle);
  fill(clear ? 'seagreen' : 'crimson');
  stroke('black');
  strokeWeight(1);
  ellipse(0, 0, 40, 40);
  // heading arrow (points up = forward)
  stroke('white');
  strokeWeight(4);
  line(0, 6, 0, -16);
  noStroke();
  fill('white');
  triangle(0, -20, -6, -10, 6, -10);
  pop();

  // action label
  noStroke();
  fill(clear ? 'darkgreen' : 'firebrick');
  textAlign(CENTER, BOTTOM);
  textSize(14);
  textStyle(BOLD);
  text(clear ? 'ACTION: Move Forward' : 'ACTION: Stop & Turn', cx, y + h - 4);
  textStyle(NORMAL);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  distSlider.size(canvasWidth - sliderLeftMargin - margin);
  speedSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
