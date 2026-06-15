// OLED Wiring Guide MicroSim
// CANVAS_HEIGHT: 470
// Students see how each OLED pin connects to a Pico pin for both I2C and SPI,
// with color-coded wires (red=power, black=GND, yellow=data, blue=clock) and
// hover tooltips. A button toggles between I2C and SPI wiring.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

let mode = 'I2C';
let modeButton;

let wiringI2C = [
  { oled: 'VCC', pico: '3V3', color: 'red',        note: 'VCC → 3V3 (power)' },
  { oled: 'GND', pico: 'GND', color: 'black',      note: 'GND → GND (ground)' },
  { oled: 'SDA', pico: 'GP0', color: 'gold',       note: 'SDA → GP0 (I2C0 SDA, data)' },
  { oled: 'SCL', pico: 'GP1', color: 'royalblue',  note: 'SCL → GP1 (I2C0 SCL, clock)' }
];
let wiringSPI = [
  { oled: 'VCC',  pico: '3V3', color: 'red',        note: 'VCC → 3V3 (power)' },
  { oled: 'GND',  pico: 'GND', color: 'black',      note: 'GND → GND (ground)' },
  { oled: 'SCK',  pico: 'GP2', color: 'royalblue',  note: 'SCK → GP2 (SPI0 clock)' },
  { oled: 'MOSI', pico: 'GP3', color: 'gold',       note: 'MOSI → GP3 (SPI0 data)' },
  { oled: 'CS',   pico: 'GP5', color: 'magenta',    note: 'CS → GP5 (chip select)' },
  { oled: 'DC',   pico: 'GP4', color: 'darkorange', note: 'DC → GP4 (data / command)' },
  { oled: 'RES',  pico: 'GP6', color: 'teal',       note: 'RES → GP6 (reset)' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  modeButton = createButton('Switch to SPI mode');
  modeButton.position(10, drawHeight + 10);
  modeButton.mousePressed(() => {
    mode = (mode === 'I2C') ? 'SPI' : 'I2C';
    modeButton.html(mode === 'I2C' ? 'Switch to SPI mode' : 'Switch to I2C mode');
  });

  describe('An OLED wiring guide. An OLED module on the left connects to a Pico on ' +
    'the right with color-coded wires. A button toggles between I2C wiring (4 wires) ' +
    'and SPI wiring (7 wires). Hovering a wire shows which OLED pin connects to which ' +
    'Pico pin.', LABEL);
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

  let wiring = (mode === 'I2C') ? wiringI2C : wiringSPI;
  let n = wiring.length;

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('OLED Wiring Guide — ' + mode + ' mode', canvasWidth / 2, 8);

  let top = 70;
  let bot = 350;
  let pitch = (bot - top) / n;
  let oledRight = 130;
  let picoLeft = canvasWidth - 130;

  // Modules
  drawOLED(30, top - 20, oledRight - 30, bot - top + 40);
  drawPico(picoLeft, top - 20, canvasWidth - 30 - picoLeft, bot - top + 40);

  // Wires
  let hovered = -1;
  for (let i = 0; i < n; i++) {
    let y = top + i * pitch + pitch / 2;
    if (abs(mouseY - y) < 8 && mouseX > oledRight && mouseX < picoLeft) hovered = i;
  }
  for (let i = 0; i < n; i++) {
    let w = wiring[i];
    let y = top + i * pitch + pitch / 2;
    stroke(w.color);
    strokeWeight(hovered === i ? 6 : 3);
    line(oledRight, y, picoLeft, y);
    // pin pads
    noStroke();
    fill(w.color);
    ellipse(oledRight, y, 9, 9);
    ellipse(picoLeft, y, 9, 9);
    // pin labels
    fill('black');
    textAlign(LEFT, CENTER);
    textSize(12);
    text(w.oled, oledRight + 6, y - 10);
    textAlign(RIGHT, CENTER);
    text(w.pico, picoLeft - 6, y - 10);
  }

  // Legend
  drawLegend(bot + 24);

  // Tooltip
  if (hovered >= 0) {
    let w = wiring[hovered];
    let tw = 240, th = 26;
    let tx = constrain(mouseX + 10, 0, canvasWidth - tw);
    let ty = constrain(mouseY - 30, 0, drawHeight - th);
    fill('black');
    noStroke();
    rect(tx, ty, tw, th, 5);
    fill('white');
    textAlign(LEFT, CENTER);
    textSize(13);
    text(w.note, tx + 8, ty + th / 2);
  } else {
    fill('dimgray');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(12);
    text('Hover a wire to see the connection', canvasWidth / 2, 50);
  }
}

function drawOLED(x, y, w, h) {
  fill('dimgray');
  stroke('black');
  strokeWeight(1);
  rect(x, y, w, h, 6);
  // screen
  fill(30, 60, 120);
  noStroke();
  rect(x + 8, y + 10, w - 16, h * 0.4, 3);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(11);
  text('OLED', x + w / 2, y + 10 + h * 0.2);
  textSize(12);
  fill('white');
  textAlign(CENTER, BOTTOM);
  text('SSD1306', x + w / 2, y + h - 4);
}

function drawPico(x, y, w, h) {
  fill('#2e5d34');
  stroke('darkgreen');
  strokeWeight(1);
  rect(x, y, w, h, 6);
  fill('white');
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(12);
  text('Pico', x + w / 2, y + h - 4);
}

function drawLegend(y) {
  let items = [
    ['red', 'power'], ['black', 'GND'], ['gold', 'data'], ['royalblue', 'clock']
  ];
  let x = margin;
  textAlign(LEFT, CENTER);
  textSize(12);
  for (let it of items) {
    stroke(it[0]);
    strokeWeight(4);
    line(x, y, x + 22, y);
    noStroke();
    fill('black');
    text(it[1], x + 28, y);
    x += 100;
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
