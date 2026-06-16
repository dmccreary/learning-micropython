// Resistor Color Code Calculator MicroSim
// CANVAS_HEIGHT: 540
// Students pick the color of each of the four bands on a resistor and watch
// the resistance value update live, shown in ohms, kilo-ohms, and mega-ohms.

// Canvas dimensions - responsive width, fixed height
let canvasWidth = 400;          // Initial width (reset to container width each frame)
let drawHeight = 210;           // Drawing area: resistor + value readout (top ~39%)
let controlHeight = 330;        // Control area: four radio-button bands (bottom ~61%)
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

// --- Color reference tables ----------------------------------------------
// digit:      the number the color represents (bands 1 and 2)
// multiplier: the power-of-ten multiplier (band 3)
// tol:        the tolerance percentage (band 4)
// css:        a named CSS color used both for the canvas band and the HTML swatch
// label:      the text shown on the radio option (value-first, e.g. "0 - Black")

const DIGIT_COLORS = [
  { name: 'Black',  digit: 0, css: 'black',      label: '0 - Black' },
  { name: 'Brown',  digit: 1, css: 'saddlebrown', label: '1 - Brown' },
  { name: 'Red',    digit: 2, css: 'red',        label: '2 - Red' },
  { name: 'Orange', digit: 3, css: 'orange',     label: '3 - Orange' },
  { name: 'Yellow', digit: 4, css: 'yellow',     label: '4 - Yellow' },
  { name: 'Green',  digit: 5, css: 'green',      label: '5 - Green' },
  { name: 'Blue',   digit: 6, css: 'blue',       label: '6 - Blue' },
  { name: 'Violet', digit: 7, css: 'darkviolet', label: '7 - Violet' },
  { name: 'Gray',   digit: 8, css: 'gray',       label: '8 - Gray' },
  { name: 'White',  digit: 9, css: 'white',      label: '9 - White' }
];

const MULT_COLORS = [
  { name: 'Black',  multiplier: 1,       css: 'black',      label: '×1 - Black' },
  { name: 'Brown',  multiplier: 10,      css: 'saddlebrown', label: '×10 - Brown' },
  { name: 'Red',    multiplier: 100,     css: 'red',        label: '×100 - Red' },
  { name: 'Orange', multiplier: 1000,    css: 'orange',     label: '×1k - Orange' },
  { name: 'Yellow', multiplier: 10000,   css: 'yellow',     label: '×10k - Yellow' },
  { name: 'Green',  multiplier: 100000,  css: 'green',      label: '×100k - Green' },
  { name: 'Blue',   multiplier: 1000000, css: 'blue',       label: '×1M - Blue' },
  { name: 'Gold',   multiplier: 0.1,     css: 'gold',       label: '×0.1 - Gold' },
  { name: 'Silver', multiplier: 0.01,    css: 'silver',     label: '×0.01 - Silver' }
];

const TOL_COLORS = [
  { name: 'Brown',  tol: 1,  css: 'saddlebrown', label: '±1% - Brown' },
  { name: 'Red',    tol: 2,  css: 'red',         label: '±2% - Red' },
  { name: 'Gold',   tol: 5,  css: 'gold',        label: '±5% - Gold' },
  { name: 'Silver', tol: 10, css: 'silver',      label: '±10% - Silver' }
];

// Radio controls for the four bands
let band1Radio, band2Radio, band3Radio, band4Radio;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Band 1 and Band 2 are digits; Band 3 is the multiplier; Band 4 is tolerance.
  band1Radio = buildBandRadio(DIGIT_COLORS, 'Brown');   // 1
  band2Radio = buildBandRadio(DIGIT_COLORS, 'Black');   // 0
  band3Radio = buildBandRadio(MULT_COLORS, 'Red');      // x100
  band4Radio = buildBandRadio(TOL_COLORS, 'Gold');      // +/-5%
  // Default: Brown-Black-Red-Gold = 10 x 100 = 1000 ohms = 1 kilo-ohm, +/-5%

  positionControls();

  describe('A horizontal resistor with four colored bands. Radio buttons below ' +
           'let you choose the color of each band, and the resistance value ' +
           'updates live in ohms, kilo-ohms, and mega-ohms.', LABEL);
}

// Create a vertical radio group whose option labels carry a colored swatch.
function buildBandRadio(colorList, defaultName) {
  let r = createRadio();
  for (let c of colorList) {
    r.option(c.name, c.label);   // value stays the color name; label shows the value first
  }
  r.selected(defaultName);

  // Add a color swatch to each option and stack the options vertically.
  let labels = r.elt.querySelectorAll('label');
  labels.forEach((label, i) => {
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.fontSize = '16px';
    label.style.margin = '4px 0';
    label.style.cursor = 'pointer';
    let input = label.querySelector('input');
    let swatch = document.createElement('span');
    swatch.style.display = 'inline-block';
    swatch.style.width = '18px';
    swatch.style.height = '18px';
    swatch.style.background = colorList[i].css;
    swatch.style.border = '1px solid dimgray';
    swatch.style.borderRadius = '3px';
    swatch.style.margin = '0 6px';
    input.insertAdjacentElement('afterend', swatch);
  });
  return r;
}

// Place the four radio groups in four evenly spaced columns.
function positionControls() {
  let colW = canvasWidth / 4;
  let topY = drawHeight + 48;   // leave room for the column headers
  let radios = [band1Radio, band2Radio, band3Radio, band4Radio];
  for (let i = 0; i < radios.length; i++) {
    radios[i].position(i * colW + 14, topY);
    radios[i].style('width', (colW - 20) + 'px');
  }
}

function draw() {
  updateCanvasSize();

  // Drawing region (top) and control region (bottom)
  stroke('silver');
  fill('aliceblue');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke();
  fill('black');
  textSize(22);
  textAlign(CENTER, TOP);
  text('Resistor Color Code Calculator', canvasWidth / 2, 8);

  // Read the current band selections
  let d1 = lookup(DIGIT_COLORS, band1Radio.value(), 'digit');
  let d2 = lookup(DIGIT_COLORS, band2Radio.value(), 'digit');
  let multiplier = lookup(MULT_COLORS, band3Radio.value(), 'multiplier');
  let tol = lookup(TOL_COLORS, band4Radio.value(), 'tol');
  let ohms = (d1 * 10 + d2) * multiplier;

  // Draw the resistor with the four selected band colors
  drawResistor(canvasWidth / 2, 80,
    colorCss(DIGIT_COLORS, band1Radio.value()),
    colorCss(DIGIT_COLORS, band2Radio.value()),
    colorCss(MULT_COLORS, band3Radio.value()),
    colorCss(TOL_COLORS, band4Radio.value()));

  // Value readout
  let v = formatResistance(ohms);
  textAlign(CENTER, TOP);
  noStroke();
  fill('black');
  textSize(28);
  text(v.big, canvasWidth / 2, 130);
  textSize(16);
  fill('navy');
  text(v.full, canvasWidth / 2, 164);
  textSize(15);
  fill('dimgray');
  text(v.raw + ' ohms  ·  ±' + tol + '% tolerance', canvasWidth / 2, 184);

  // Column headers for the control region
  drawColumnHeaders();

  // Restore defaults
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

// Draw a horizontal resistor centered at (cx, cy) with four band colors.
function drawResistor(cx, cy, c1, c2, c3, c4) {
  let bodyW = min(canvasWidth * 0.5, 320);
  let bodyH = 88;
  let bodyX = cx - bodyW / 2;
  let bodyY = cy - bodyH / 2;

  // Leads (wires) extending to the left and right
  stroke('gray');
  strokeWeight(5);
  line(margin, cy, bodyX + 6, cy);
  line(bodyX + bodyW - 6, cy, canvasWidth - margin, cy);
  strokeWeight(1);

  // Resistor body
  stroke('peru');
  fill('wheat');
  rect(bodyX, bodyY, bodyW, bodyH, 10);

  // Four bands: bands 1-3 grouped on the left, tolerance band on the right
  let bandW = bodyW * 0.07;
  let bandY = bodyY + 3;
  let bandH = bodyH - 6;
  let positions = [0.16, 0.30, 0.44, 0.82];   // fractions across the body
  let colors = [c1, c2, c3, c4];
  noStroke();
  for (let i = 0; i < 4; i++) {
    let bx = bodyX + bodyW * positions[i] - bandW / 2;
    fill(colors[i]);
    rect(bx, bandY, bandW, bandH, 2);
  }
  strokeWeight(1);
}

// Draw the four column headers in the control region.
function drawColumnHeaders() {
  let colW = canvasWidth / 4;
  let headers = [
    ['Band 1', '1st digit'],
    ['Band 2', '2nd digit'],
    ['Band 3', 'multiplier'],
    ['Band 4', 'tolerance']
  ];
  textAlign(CENTER, TOP);
  for (let i = 0; i < 4; i++) {
    let cx = i * colW + colW / 2;
    noStroke();
    fill('black');
    textSize(16);
    text(headers[i][0], cx, drawHeight + 8);
    fill('dimgray');
    textSize(13);
    text(headers[i][1], cx, drawHeight + 28);
  }
}

// --- Helpers --------------------------------------------------------------

// Look up a numeric property (digit/multiplier/tol) for a color name in a table.
function lookup(table, name, prop) {
  for (let c of table) {
    if (c.name === name) return c[prop];
  }
  return table[0][prop];
}

// Look up the CSS color for a color name in a table.
function colorCss(table, name) {
  for (let c of table) {
    if (c.name === name) return c.css;
  }
  return table[0].css;
}

// Format ohms into familiar units with both abbreviation and full name.
function formatResistance(ohms) {
  let big, full;
  if (ohms >= 1e6) {
    let val = ohms / 1e6;
    big = trimNum(val) + ' MΩ';
    full = trimNum(val) + ' mega-ohm' + (val === 1 ? '' : 's');
  } else if (ohms >= 1e3) {
    let val = ohms / 1e3;
    big = trimNum(val) + ' kΩ';
    full = trimNum(val) + ' kilo-ohm' + (val === 1 ? '' : 's');
  } else {
    big = trimNum(ohms) + ' Ω';
    full = trimNum(ohms) + ' ohm' + (ohms === 1 ? '' : 's');
  }
  return { big: big, full: full, raw: formatWithCommas(ohms) };
}

// Drop trailing zeros: 1 -> "1", 4.70 -> "4.7", 0.10 -> "0.1"
function trimNum(n) {
  return parseFloat(n.toFixed(2)).toString();
}

// Add thousands separators, keeping any fractional part readable.
function formatWithCommas(n) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
}
