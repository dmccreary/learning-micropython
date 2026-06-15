// Accelerometer Axes MicroSim
// CANVAS_HEIGHT: 480
// Students tilt a board with two sliders and watch how the 1 g gravity vector
// distributes across the X, Y, and Z axes (shown as bar gauges), and how the
// tilt angle is recovered with atan2(X, Z).

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;  // 2 slider rows
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 200;
let defaultTextSize = 16;

// Controls
let pitchSlider, rollSlider;

let camRad;          // fixed viewing tilt for pseudo-3D
let boardCx, boardCy;
let viewScale = 1.0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  camRad = radians(-60);  // look down at the board like a table top; Z stands up

  pitchSlider = createSlider(-90, 90, 0, 1);
  pitchSlider.position(sliderLeftMargin, drawHeight + 8);
  pitchSlider.size(canvasWidth - sliderLeftMargin - margin);

  rollSlider = createSlider(-90, 90, 0, 1);
  rollSlider.position(sliderLeftMargin, drawHeight + 46);
  rollSlider.size(canvasWidth - sliderLeftMargin - margin);

  describe('An accelerometer axes explorer. Two sliders tilt a board forward/back ' +
    'and left/right. A pseudo-3D board with X, Y, Z axis arrows updates, and three ' +
    'bar gauges show how the 1 g gravity vector splits across the axes. The tilt ' +
    'angle is computed with atan2(X, Z).', LABEL);
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

  let pitch = pitchSlider.value();
  let roll = rollSlider.value();
  let pr = radians(pitch);
  let rr = radians(roll);

  // Gravity components in the board frame (magnitude 1 g)
  let ax = sin(pr);
  let ay = cos(pr) * sin(rr);
  let az = cos(pr) * cos(rr);

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Accelerometer: Gravity Across X, Y, Z', canvasWidth / 2, 8);

  // Board visualization (left)
  boardCx = canvasWidth * 0.26;
  boardCy = 170;
  viewScale = 1.0;
  drawBoard(pr, rr);

  // Bar gauges (right)
  let gx = canvasWidth * 0.50;
  let gw = canvasWidth * 0.45 - margin;
  drawGauge('X', ax, gx, 80, gw, 'crimson');
  drawGauge('Y', ay, gx, 145, gw, 'green');
  drawGauge('Z', az, gx, 210, gw, 'royalblue');

  // Readouts + formula (bottom of drawing area)
  let angle = degrees(atan2(ax, az));
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(15);
  text('X = ' + ax.toFixed(2) + ' g     Y = ' + ay.toFixed(2) + ' g     Z = ' + az.toFixed(2) + ' g',
    canvasWidth / 2, 300);
  textFont('monospace');
  textSize(15);
  fill('navy');
  text('tilt angle = atan2(X, Z) = ' + angle.toFixed(0) + '°', canvasWidth / 2, 330);
  textFont('Arial');
  fill('dimgray');
  textSize(12);
  text('When the board is flat, Z reads 1.0 g and X, Y read 0.', canvasWidth / 2, 358);

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Tilt forward/back: ' + pitch + '°', 10, drawHeight + 18);
  text('Tilt left/right: ' + roll + '°', 10, drawHeight + 56);
}

// 3D helpers
function rotY(p, a) { return { x: p.x * cos(a) + p.z * sin(a), y: p.y, z: -p.x * sin(a) + p.z * cos(a) }; }
function rotX(p, a) { return { x: p.x, y: p.y * cos(a) - p.z * sin(a), z: p.y * sin(a) + p.z * cos(a) }; }

function project(local, pr, rr) {
  let p = rotY(local, pr);   // pitch about Y
  p = rotX(p, rr);           // roll about X
  p = rotX(p, camRad);       // fixed camera tilt
  return { sx: boardCx + p.x * viewScale, sy: boardCy - p.y * viewScale };
}

function drawBoard(pr, rr) {
  let w = 78, h = 56, L = 78;
  // corners (board local plane z=0)
  let c1 = project({ x: -w, y: -h, z: 0 }, pr, rr);
  let c2 = project({ x: w, y: -h, z: 0 }, pr, rr);
  let c3 = project({ x: w, y: h, z: 0 }, pr, rr);
  let c4 = project({ x: -w, y: h, z: 0 }, pr, rr);

  // board face
  fill(180, 210, 245, 220);
  stroke('steelblue');
  strokeWeight(2);
  quad(c1.sx, c1.sy, c2.sx, c2.sy, c3.sx, c3.sy, c4.sx, c4.sy);

  // chip marker
  noStroke();
  fill(70, 90, 110);
  let m = project({ x: -w * 0.4, y: -h * 0.4, z: 0 }, pr, rr);
  rectMode(CENTER);
  rect(m.sx, m.sy, 14, 14);
  rectMode(CORNER);

  // axis arrows
  let o = project({ x: 0, y: 0, z: 0 }, pr, rr);
  let xT = project({ x: L, y: 0, z: 0 }, pr, rr);
  let yT = project({ x: 0, y: L, z: 0 }, pr, rr);
  let zT = project({ x: 0, y: 0, z: L }, pr, rr);
  drawAxis(o, xT, 'crimson', 'X');
  drawAxis(o, yT, 'green', 'Y');
  drawAxis(o, zT, 'royalblue', 'Z');
}

function drawAxis(o, tip, col, label) {
  stroke(col);
  strokeWeight(3);
  fill(col);
  line(o.sx, o.sy, tip.sx, tip.sy);
  let ang = atan2(tip.sy - o.sy, tip.sx - o.sx);
  push();
  translate(tip.sx, tip.sy);
  rotate(ang);
  noStroke();
  triangle(0, 0, -9, -4, -9, 4);
  pop();
  noStroke();
  fill(col);
  textAlign(CENTER, CENTER);
  textSize(14);
  textStyle(BOLD);
  text(label, tip.sx + (tip.sx - o.sx) * 0.12, tip.sy + (tip.sy - o.sy) * 0.12);
  textStyle(NORMAL);
}

function drawGauge(label, value, x, y, w, col) {
  let h = 26;
  let cx = x + w / 2;
  // frame
  fill('white');
  stroke('gray');
  strokeWeight(1);
  rect(x, y, w, h, 4);
  // center line (0 g)
  stroke('lightgray');
  line(cx, y, cx, y + h);
  // fill from center to value
  noStroke();
  fill(col);
  let vx = map(value, -1, 1, x + 2, x + w - 2);
  if (value >= 0) rect(cx, y + 3, vx - cx, h - 6);
  else rect(vx, y + 3, cx - vx, h - 6);
  // labels
  fill('black');
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(15);
  text(label, x - 18, y + h / 2);
  textStyle(NORMAL);
  textAlign(LEFT, BOTTOM);
  textSize(12);
  fill('dimgray');
  text('-1 g', x, y - 3);
  textAlign(CENTER, BOTTOM);
  text('0', cx, y - 3);
  textAlign(RIGHT, BOTTOM);
  text('+1 g', x + w, y - 3);
  // value
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(13);
  text(value.toFixed(2) + ' g', x + w + 6, y + h / 2);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  pitchSlider.size(canvasWidth - sliderLeftMargin - margin);
  rollSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
