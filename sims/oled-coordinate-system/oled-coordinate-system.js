// OLED Coordinate System MicroSim
// CANVAS_HEIGHT: 430
// Students explore the 128x64 OLED coordinate grid: a hover crosshair shows the
// (x, y) coordinate, clicking lights a pixel, and a panel shows the MicroPython
// drawing command for the selected mode at the hovered position.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 380;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

let OLED_W = 128, OLED_H = 64;
let litPixels = {};   // "x,y" -> true

let clearButton, modeSelect;

// computed each frame
let gridLeft = 36, gridTop = 64, pixelSize = 4;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  modeSelect = createSelect();
  ['pixel', 'text', 'line', 'rect'].forEach(o => modeSelect.option(o));
  modeSelect.selected('pixel');
  modeSelect.position(160, drawHeight + 10);

  clearButton = createButton('Clear');
  clearButton.position(290, drawHeight + 10);
  clearButton.mousePressed(() => { litPixels = {}; });

  describe('A 128 by 64 OLED coordinate grid. Moving the mouse shows a crosshair ' +
    'and the (x, y) coordinate. Clicking lights a pixel. A panel shows the ' +
    'MicroPython drawing command (pixel, text, line, or rect) for the hovered ' +
    'position, and a Clear button resets the display.', LABEL);
}

function computeGrid() {
  let panelLeft = canvasWidth * 0.72;
  let availW = panelLeft - gridLeft - 10;
  let ps = Math.floor(availW / OLED_W);
  let maxPs = Math.floor((drawHeight - gridTop - 26) / OLED_H);
  pixelSize = constrain(min(ps, maxPs), 2, 5);
}

function draw() {
  updateCanvasSize();
  computeGrid();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  let gridW = pixelSize * OLED_W;
  let gridH = pixelSize * OLED_H;

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('OLED 128 × 64 Coordinate System', canvasWidth * 0.42, 8);

  // OLED background (dark, like the screen)
  fill(10, 15, 30);
  noStroke();
  rect(gridLeft, gridTop, gridW, gridH);

  // grid lines every 8 px
  stroke(60, 70, 90);
  strokeWeight(1);
  for (let gx = 0; gx <= OLED_W; gx += 8) {
    let x = gridLeft + gx * pixelSize;
    line(x, gridTop, x, gridTop + gridH);
  }
  for (let gy = 0; gy <= OLED_H; gy += 8) {
    let y = gridTop + gy * pixelSize;
    line(gridLeft, y, gridLeft + gridW, y);
  }

  // lit pixels
  noStroke();
  fill('deepskyblue');
  for (let key in litPixels) {
    let parts = key.split(',');
    let px = int(parts[0]), py = int(parts[1]);
    rect(gridLeft + px * pixelSize, gridTop + py * pixelSize, pixelSize, pixelSize);
  }

  // axis labels
  noStroke();
  fill('black');
  textSize(12);
  textAlign(LEFT, BOTTOM);
  text('(0,0)', gridLeft, gridTop - 3);
  textAlign(RIGHT, BOTTOM);
  text('(127,0)', gridLeft + gridW, gridTop - 3);
  textAlign(LEFT, TOP);
  text('(0,63)', gridLeft, gridTop + gridH + 3);

  // crosshair
  let ox = Math.floor((mouseX - gridLeft) / pixelSize);
  let oy = Math.floor((mouseY - gridTop) / pixelSize);
  let inGrid = (ox >= 0 && ox < OLED_W && oy >= 0 && oy < OLED_H);
  if (inGrid) {
    stroke('yellow');
    strokeWeight(1);
    line(gridLeft, gridTop + oy * pixelSize + pixelSize / 2, gridLeft + gridW, gridTop + oy * pixelSize + pixelSize / 2);
    line(gridLeft + ox * pixelSize + pixelSize / 2, gridTop, gridLeft + ox * pixelSize + pixelSize / 2, gridTop + gridH);
    noStroke();
  }

  // Right panel
  drawPanel(canvasWidth * 0.74, inGrid ? ox : null, inGrid ? oy : null);

  // Control label
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Mode:', 110, drawHeight + 24);
}

function drawPanel(px, ox, oy) {
  let pw = canvasWidth - px - margin;
  let py = 64;
  fill(255, 255, 255, 240);
  stroke('silver');
  strokeWeight(1);
  rect(px, py, pw, 200, 10);
  noStroke();

  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Cursor position', px + 12, py + 12);
  fill('navy');
  textStyle(BOLD);
  textSize(22);
  text(ox === null ? '( –, – )' : '( ' + ox + ', ' + oy + ' )', px + 12, py + 28);
  textStyle(NORMAL);

  fill('dimgray');
  textSize(13);
  text('MicroPython command', px + 12, py + 70);
  fill('darkgreen');
  textFont('monospace');
  textSize(13);
  let cmd = codeFor(modeSelect.value(), ox, oy);
  text(cmd, px + 12, py + 90, pw - 20);
  textFont('Arial');

  fill('dimgray');
  textSize(12);
  text('Pixels lit: ' + Object.keys(litPixels).length, px + 12, py + 168);
}

function codeFor(mode, x, y) {
  if (x === null) return '(move over the grid)';
  switch (mode) {
    case 'pixel': return 'oled.pixel(' + x + ', ' + y + ', 1)';
    case 'text':  return 'oled.text("Hi", ' + x + ', ' + y + ')';
    case 'line':  return 'oled.line(' + x + ', ' + y + ', ' + min(x + 20, 127) + ', ' + y + ')';
    case 'rect':  return 'oled.rect(' + x + ', ' + y + ', 20, 10, 1)';
  }
  return '';
}

function mousePressed() {
  let ox = Math.floor((mouseX - gridLeft) / pixelSize);
  let oy = Math.floor((mouseY - gridTop) / pixelSize);
  if (ox >= 0 && ox < OLED_W && oy >= 0 && oy < OLED_H) {
    litPixels[ox + ',' + oy] = true;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
