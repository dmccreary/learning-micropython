// Display Technology Comparison MicroSim
// CANVAS_HEIGHT: 480
// Students compare OLED, TFT, and E-Paper across five attributes (color-coded
// best/ok/worst), hover for exact figures, then check project requirements and
// press "Best match" to get a recommended display technology.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80;  // 2 rows of checkboxes + button
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

let displays = ['OLED', 'TFT', 'E-Paper'];
let attrs = ['Color', 'Power', 'Refresh rate', 'Outdoor', 'Typical use'];

// cell data: rating (g/y/r/n) + short label + figure
let data = {
  'Color': {
    'OLED':    ['y', 'Mono / color', '1-bit, or 65k on color models'],
    'TFT':     ['g', 'Full color', '65,536 colors'],
    'E-Paper': ['r', 'B/W or 3-color', 'Black/white (some 3-color)']
  },
  'Power': {
    'OLED':    ['g', 'Low', '~10-20 mA'],
    'TFT':     ['r', 'High', '50-150 mA (backlight)'],
    'E-Paper': ['g', 'Very low', 'µA idle; mA only on refresh']
  },
  'Refresh rate': {
    'OLED':    ['g', 'Fast', '60+ updates/sec'],
    'TFT':     ['g', 'Fast', '30-60 updates/sec'],
    'E-Paper': ['r', 'Very slow', '0.3-2 sec per refresh']
  },
  'Outdoor': {
    'OLED':    ['r', 'Dim', 'Washes out in sunlight'],
    'TFT':     ['y', 'OK', 'Needs a bright backlight'],
    'E-Paper': ['g', 'Excellent', 'Reflective, sunlight-readable']
  },
  'Typical use': {
    'OLED':    ['n', 'Wearables', 'Watches, small status displays'],
    'TFT':     ['n', 'Color UIs', 'Games, dashboards'],
    'E-Paper': ['n', 'Labels', 'E-readers, shelf labels, signs']
  }
};

let cbBattery, cbColor, cbFast, cbOutdoor, matchButton;
let recommended = null;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  cbBattery = createCheckbox(' Battery powered', false);
  cbBattery.position(10, drawHeight + 8);
  cbColor = createCheckbox(' Needs color', false);
  cbColor.position(200, drawHeight + 8);
  cbFast = createCheckbox(' Fast animation', false);
  cbFast.position(10, drawHeight + 44);
  cbOutdoor = createCheckbox(' Outdoor use', false);
  cbOutdoor.position(200, drawHeight + 44);

  matchButton = createButton('Best match');
  matchButton.position(390, drawHeight + 26);
  matchButton.mousePressed(computeMatch);

  describe('A display technology comparison matrix. Columns are OLED, TFT, and ' +
    'E-Paper; rows are color, power, refresh rate, outdoor visibility, and typical ' +
    'use, color-coded best to worst. Checkboxes set project requirements and a ' +
    'Best match button recommends a display technology.', LABEL);
}

function computeMatch() {
  let score = { 'OLED': 0, 'TFT': 0, 'E-Paper': 0 };
  if (cbBattery.checked()) { score['E-Paper'] += 2; score['OLED'] += 1; score['TFT'] -= 1; }
  if (cbColor.checked())   { score['TFT'] += 2; score['OLED'] += 0.5; score['E-Paper'] -= 2; }
  if (cbFast.checked())    { score['OLED'] += 1.5; score['TFT'] += 1.5; score['E-Paper'] -= 2; }
  if (cbOutdoor.checked()) { score['E-Paper'] += 2; score['TFT'] += 0.5; score['OLED'] -= 1; }

  let anyChecked = cbBattery.checked() || cbColor.checked() || cbFast.checked() || cbOutdoor.checked();
  if (!anyChecked) { recommended = null; return; }
  recommended = displays[0];
  for (let d of displays) if (score[d] > score[recommended]) recommended = d;
}

function ratingColor(r) {
  if (r === 'g') return 'palegreen';
  if (r === 'y') return 'lightyellow';
  if (r === 'r') return 'mistyrose';
  return 'whitesmoke';
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

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Display Technology Comparison', canvasWidth / 2, 8);

  let labelW = 120;
  let colW = (canvasWidth - 2 * margin - labelW) / 3;
  let headerTop = 40, headerH = 40;
  let rowsTop = 84, rowH = 54;

  // Column headers with mini icons
  for (let c = 0; c < 3; c++) {
    let x = margin + labelW + c * colW;
    let rec = (recommended === displays[c]);
    fill(rec ? 'gold' : 'gainsboro');
    stroke(rec ? 'darkorange' : 'silver');
    strokeWeight(rec ? 3 : 1);
    rect(x, headerTop, colW - 4, headerH, 6);
    // mini icon
    noStroke();
    let iconCol = c === 0 ? color(20, 20, 30) : (c === 1 ? color(60, 140, 220) : color(235, 235, 230));
    fill(iconCol);
    rect(x + 8, headerTop + 8, 22, 16, 2);
    fill('black');
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(15);
    text(displays[c], x + 38, headerTop + headerH / 2);
    textStyle(NORMAL);
  }

  // Hover detection
  let hoverCell = null;

  // Rows
  for (let r = 0; r < attrs.length; r++) {
    let y = rowsTop + r * rowH;
    // attribute label
    noStroke();
    fill('black');
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(13);
    text(attrs[r], margin, y + rowH / 2, labelW - 4);
    textStyle(NORMAL);
    for (let c = 0; c < 3; c++) {
      let x = margin + labelW + c * colW;
      let cell = data[attrs[r]][displays[c]];
      fill(ratingColor(cell[0]));
      stroke('white');
      strokeWeight(2);
      rect(x, y, colW - 4, rowH - 4, 4);
      noStroke();
      fill('black');
      textAlign(CENTER, CENTER);
      textSize(13);
      text(cell[1], x + 4, y + rowH / 2 - 2, colW - 12);
      if (mouseX > x && mouseX < x + colW - 4 && mouseY > y && mouseY < y + rowH - 4) {
        hoverCell = cell;
      }
    }
  }

  // Recommendation text
  noStroke();
  textAlign(CENTER, TOP);
  textSize(15);
  if (recommended) {
    fill('darkorange');
    textStyle(BOLD);
    text('Best match: ' + recommended, canvasWidth / 2, rowsTop + 5 * rowH + 4);
    textStyle(NORMAL);
  } else {
    fill('dimgray');
    text('Check requirements below, then press "Best match"', canvasWidth / 2, rowsTop + 5 * rowH + 4);
  }

  // Tooltip
  if (hoverCell) {
    let tw = 250, th = 26;
    let tx = constrain(mouseX + 10, 0, canvasWidth - tw);
    let ty = constrain(mouseY - 30, 0, drawHeight - th);
    fill('black');
    rect(tx, ty, tw, th, 5);
    fill('white');
    textAlign(LEFT, CENTER);
    textSize(12);
    text(hoverCell[2], tx + 8, ty + th / 2, tw - 16);
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
