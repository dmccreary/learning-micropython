// REPL Workflow MicroSim
// CANVAS_HEIGHT: 510
// Students explore the Read-Evaluate-Print Loop as a four-step cycle, click each
// step for a concrete example, step through with "Next Step", and compare
// Interactive Mode vs Script Mode.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 460;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Cycle steps
let steps = [
  { name: '1. Read',     desc: 'You type a line and press Enter', example: '>>> 2 + 2' },
  { name: '2. Evaluate', desc: 'MicroPython runs the code',        example: 'MicroPython computes 2 + 2' },
  { name: '3. Print',    desc: 'The result appears',              example: '4' },
  { name: '4. Loop',     desc: 'The >>> prompt returns',          example: '>>> (ready for the next line)' }
];
let stepIndex = 0;     // highlighted step
let popupStep = -1;    // step whose example pop-up is shown (-1 = none)

let selectedMode = 'interactive';
let modes = {
  interactive: 'Type one line at a time at the >>> prompt. Great for quick tests. Nothing is saved.',
  script: 'Write many lines in a .py file and run them all at once. The program is saved and repeatable.'
};

let nextButton, interactiveButton, scriptButton;

// Cycle box geometry
let boxW = 160, boxH = 58;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  nextButton = createButton('Next Step');
  nextButton.position(10, drawHeight + 10);
  nextButton.mousePressed(() => { stepIndex = (stepIndex + 1) % 4; popupStep = -1; });

  interactiveButton = createButton('Interactive Mode');
  interactiveButton.position(110, drawHeight + 10);
  interactiveButton.mousePressed(() => { selectedMode = 'interactive'; });

  scriptButton = createButton('Script Mode');
  scriptButton.position(255, drawHeight + 10);
  scriptButton.mousePressed(() => { selectedMode = 'script'; });

  describe('A diagram of the Read-Evaluate-Print Loop. Four boxes form a cycle: ' +
    'Read, Evaluate, Print, Loop. Clicking a box reveals a concrete example, a ' +
    'Next Step button cycles the highlight, and two columns compare Interactive ' +
    'Mode with Script Mode.', LABEL);
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

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(22);
  text('The REPL: Read - Evaluate - Print - Loop', canvasWidth / 2, 10);

  // Cycle layout
  let cx = canvasWidth / 2;
  let R = min(195, canvasWidth * 0.28);
  let cy = 180;
  let pos = [
    { x: cx,     y: cy - 85 }, // Read (top)
    { x: cx + R, y: cy },      // Evaluate (right)
    { x: cx,     y: cy + 85 }, // Print (bottom)
    { x: cx - R, y: cy }       // Loop (left)
  ];

  // Arrows clockwise between adjacent boxes (drawn under the boxes)
  for (let i = 0; i < 4; i++) {
    let a = pos[i];
    let b = pos[(i + 1) % 4];
    let active = (i === stepIndex);
    drawCycleArrow(a, b, active);
  }

  // Cycle boxes
  for (let i = 0; i < 4; i++) {
    drawStepBox(pos[i].x, pos[i].y, steps[i], i === stepIndex);
  }

  // Mode comparison columns
  drawModeColumns();

  // Pop-up example (drawn last, on top, in the hollow center)
  if (popupStep >= 0) {
    drawPopup(cx, cy);
  }

  // Control labels (none needed beyond buttons)
}

function drawStepBox(x, y, step, active) {
  rectMode(CENTER);
  if (active) {
    stroke('teal');
    strokeWeight(3);
    fill('paleturquoise');
  } else {
    stroke('silver');
    strokeWeight(1.5);
    fill('white');
  }
  rect(x, y, boxW, boxH, 10);
  rectMode(CORNER);
  noStroke();
  fill(active ? 'teal' : 'dimgray');
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(15);
  text(step.name, x - boxW / 2, y - boxH / 2 + 6, boxW);
  textStyle(NORMAL);
  textSize(11);
  fill(active ? 'darkslategray' : 'gray');
  text(step.desc, x - boxW / 2 + 5, y - boxH / 2 + 26, boxW - 10);
}

function drawCycleArrow(a, b, active) {
  // Shorten the segment so the arrow sits between box edges
  let ang = atan2(b.y - a.y, b.x - a.x);
  let sx = a.x + cos(ang) * (boxW * 0.36);
  let sy = a.y + sin(ang) * (boxH * 0.7);
  let ex = b.x - cos(ang) * (boxW * 0.36);
  let ey = b.y - sin(ang) * (boxH * 0.7);
  if (active) { stroke('teal'); fill('teal'); strokeWeight(3); }
  else { stroke('silver'); fill('silver'); strokeWeight(1.5); }
  line(sx, sy, ex, ey);
  push();
  translate(ex, ey);
  rotate(ang);
  noStroke();
  triangle(0, 0, -9, -4, -9, 4);
  pop();
}

function drawModeColumns() {
  let gap = 20;
  let colW = (canvasWidth - 2 * margin - gap) / 2;
  let colY = 318;
  let colH = 128;
  let cols = [
    { key: 'interactive', title: 'Interactive Mode', x: margin },
    { key: 'script',      title: 'Script Mode',      x: margin + colW + gap }
  ];
  for (let c of cols) {
    let sel = (selectedMode === c.key);
    if (sel) { stroke('teal'); strokeWeight(3); fill('mintcream'); }
    else { stroke('silver'); strokeWeight(1.5); fill('white'); }
    rect(c.x, colY, colW, colH, 10);
    noStroke();
    fill(sel ? 'teal' : 'dimgray');
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    textSize(16);
    text(c.title, c.x, colY + 10, colW);
    textStyle(NORMAL);
    fill('black');
    textAlign(LEFT, TOP);
    textSize(14);
    text(modes[c.key], c.x + 12, colY + 40, colW - 24);
  }
}

function drawPopup(cx, cy) {
  let pw = 210, ph = 64;
  let px = cx - pw / 2;
  let py = cy - ph / 2;
  fill('black');
  noStroke();
  rect(px, py, pw, ph, 8);
  fill('aquamarine');
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(13);
  text(steps[popupStep].name, px, py + 7, pw);
  textStyle(NORMAL);
  fill('white');
  textFont('monospace');
  textSize(13);
  text(steps[popupStep].example, px + 8, py + 30, pw - 16);
  textFont('Arial');
}

function mousePressed() {
  // Check cycle boxes
  let cx = canvasWidth / 2;
  let R = min(195, canvasWidth * 0.28);
  let cy = 180;
  let pos = [
    { x: cx, y: cy - 85 }, { x: cx + R, y: cy },
    { x: cx, y: cy + 85 }, { x: cx - R, y: cy }
  ];
  for (let i = 0; i < 4; i++) {
    if (abs(mouseX - pos[i].x) <= boxW / 2 && abs(mouseY - pos[i].y) <= boxH / 2) {
      stepIndex = i;
      popupStep = i;
      return;
    }
  }
  // Click elsewhere in the drawing area dismisses the pop-up
  if (mouseY < drawHeight) popupStep = -1;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
