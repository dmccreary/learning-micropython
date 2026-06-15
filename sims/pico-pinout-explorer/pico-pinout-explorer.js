// Raspberry Pi Pico Pinout Explorer MicroSim
// CANVAS_HEIGHT: 655
// Students explore the 40-pin Raspberry Pi Pico layout: pads are color-coded by
// function, hovering shows a tooltip, clicking updates a detail panel, and
// filter buttons highlight pin groups.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 605;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Pin data: [physicalNumber, name, altFunctions, category, (volt), (info)]
// Categories: gpio, adc, gnd, power (3V3 out), sys (VSYS/VBUS/RUN/EN/VREF)
let pinData = [
  [1, 'GP0', 'UART0 TX / I2C0 SDA / SPI0 RX', 'gpio'],
  [2, 'GP1', 'UART0 RX / I2C0 SCL / SPI0 CSn', 'gpio'],
  [3, 'GND', 'Ground', 'gnd'],
  [4, 'GP2', 'I2C1 SDA / SPI0 SCK', 'gpio'],
  [5, 'GP3', 'I2C1 SCL / SPI0 TX', 'gpio'],
  [6, 'GP4', 'UART1 TX / I2C0 SDA / SPI0 RX', 'gpio'],
  [7, 'GP5', 'UART1 RX / I2C0 SCL / SPI0 CSn', 'gpio'],
  [8, 'GND', 'Ground', 'gnd'],
  [9, 'GP6', 'I2C1 SDA / SPI0 SCK', 'gpio'],
  [10, 'GP7', 'I2C1 SCL / SPI0 TX', 'gpio'],
  [11, 'GP8', 'UART1 TX / I2C0 SDA / SPI1 RX', 'gpio'],
  [12, 'GP9', 'UART1 RX / I2C0 SCL / SPI1 CSn', 'gpio'],
  [13, 'GND', 'Ground', 'gnd'],
  [14, 'GP10', 'I2C1 SDA / SPI1 SCK', 'gpio'],
  [15, 'GP11', 'I2C1 SCL / SPI1 TX', 'gpio'],
  [16, 'GP12', 'UART0 TX / I2C0 SDA / SPI1 RX', 'gpio'],
  [17, 'GP13', 'UART0 RX / I2C0 SCL / SPI1 CSn', 'gpio'],
  [18, 'GND', 'Ground', 'gnd'],
  [19, 'GP14', 'I2C1 SDA / SPI1 SCK', 'gpio'],
  [20, 'GP15', 'I2C1 SCL / SPI1 TX', 'gpio'],
  [21, 'GP16', 'SPI0 RX / UART0 TX / I2C0 SDA', 'gpio'],
  [22, 'GP17', 'SPI0 CSn / UART0 RX / I2C0 SCL', 'gpio'],
  [23, 'GND', 'Ground', 'gnd'],
  [24, 'GP18', 'SPI0 SCK / I2C1 SDA', 'gpio'],
  [25, 'GP19', 'SPI0 TX / I2C1 SCL', 'gpio'],
  [26, 'GP20', 'I2C0 SDA', 'gpio'],
  [27, 'GP21', 'I2C0 SCL', 'gpio'],
  [28, 'GND', 'Ground', 'gnd'],
  [29, 'GP22', 'Digital only', 'gpio'],
  [30, 'RUN', 'Reset', 'sys', 'Logic-level', 'Pull LOW to reset the Pico'],
  [31, 'GP26', 'ADC0 / I2C1 SDA', 'adc'],
  [32, 'GP27', 'ADC1 / I2C1 SCL', 'adc'],
  [33, 'AGND', 'Analog ground', 'gnd'],
  [34, 'GP28', 'ADC2', 'adc'],
  [35, 'ADC_VREF', 'ADC reference', 'sys', '3.3 V', 'Reference voltage for the ADC'],
  [36, '3V3(OUT)', '3.3 V output', 'power'],
  [37, '3V3_EN', 'Regulator enable', 'sys', '3.3 V', 'Pull LOW to disable the 3.3 V regulator'],
  [38, 'GND', 'Ground', 'gnd'],
  [39, 'VSYS', 'System input', 'sys', '1.8–5.5 V', 'Main power input to the Pico'],
  [40, 'VBUS', 'USB 5 V', 'sys', '5 V', 'Comes straight from the USB connector']
];

let pins = [];
let selectedNum = 1;
let activeFilter = 'all';

let btnAll, btnGpio, btnPower, btnI2c;

let padR = 7;
let boardW = 96;
let boardTop = 92;
let pitch = 20;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  // Build pin objects with side/row layout info
  for (let d of pinData) {
    let num = d[0];
    let side, row;
    if (num <= 20) { side = 'L'; row = num - 1; }      // left: 1..20 top->bottom
    else { side = 'R'; row = 40 - num; }               // right: 40 top -> 21 bottom
    pins.push({ num: num, name: d[1], alt: d[2], cat: d[3], volt: d[4], info: d[5], side: side, row: row });
  }

  btnAll = createButton('Show All');
  btnAll.position(10, drawHeight + 10);
  btnAll.mousePressed(() => activeFilter = 'all');
  btnGpio = createButton('GPIO');
  btnGpio.position(95, drawHeight + 10);
  btnGpio.mousePressed(() => activeFilter = 'gpio');
  btnPower = createButton('Power');
  btnPower.position(160, drawHeight + 10);
  btnPower.mousePressed(() => activeFilter = 'power');
  btnI2c = createButton('I2C pins');
  btnI2c.position(235, drawHeight + 10);
  btnI2c.mousePressed(() => activeFilter = 'i2c');

  describe('An interactive pinout of the Raspberry Pi Pico. Forty pads in two ' +
    'rows are color-coded by function. Hovering a pad shows a tooltip and ' +
    'clicking it shows full details. Filter buttons highlight GPIO, power, or ' +
    'I2C pins.', LABEL);
}

function catColor(cat) {
  switch (cat) {
    case 'gpio': return 'mediumseagreen';
    case 'adc': return 'orange';
    case 'gnd': return 'black';
    case 'power': return 'crimson';
    case 'sys': return 'goldenrod';
  }
  return 'gray';
}

function isHighlighted(p) {
  if (activeFilter === 'all') return true;
  if (activeFilter === 'gpio') return (p.cat === 'gpio' || p.cat === 'adc');
  if (activeFilter === 'power') return (p.cat === 'power' || p.cat === 'sys' || p.cat === 'gnd');
  if (activeFilter === 'i2c') return p.alt.indexOf('I2C') >= 0;
  return true;
}

function padCenter(p) {
  let cx = canvasWidth / 2;
  let x = (p.side === 'L') ? cx - boardW / 2 : cx + boardW / 2;
  let y = boardTop + 14 + p.row * pitch;
  return { x: x, y: y };
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

  let cx = canvasWidth / 2;

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(22);
  text('Raspberry Pi Pico Pinout Explorer', cx, 10);

  // Legend (row of swatches)
  drawLegend(cx);

  // Board body
  let boardH = 28 + 19 * pitch;
  fill('#2e5d34');
  stroke('darkgreen');
  strokeWeight(1);
  rectMode(CENTER);
  rect(cx, boardTop + boardH / 2, boardW, boardH, 8);
  rectMode(CORNER);
  // USB notch
  fill('silver');
  noStroke();
  rectMode(CENTER);
  rect(cx, boardTop - 4, 34, 14, 3);
  rectMode(CORNER);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(12);
  push();
  translate(cx, boardTop + boardH / 2);
  text('Pico', 0, 0);
  pop();

  // Pads and labels
  for (let p of pins) {
    let c = padCenter(p);
    let hot = isHighlighted(p);
    let isSel = (p.num === selectedNum);
    // pad
    if (isSel) { stroke('blue'); strokeWeight(3); }
    else { stroke('gray'); strokeWeight(1); }
    fill(hot ? catColor(p.cat) : 'gainsboro');
    ellipse(c.x, c.y, padR * 2, padR * 2);
    // label
    noStroke();
    fill(hot ? 'black' : 'silver');
    textSize(11);
    let label = p.num + '  ' + p.name;
    if (p.side === 'L') {
      textAlign(RIGHT, CENTER);
      text(label, c.x - padR - 4, c.y);
    } else {
      textAlign(LEFT, CENTER);
      text(label, c.x + padR + 4, c.y);
    }
  }

  // Detail panel (bottom of drawing area)
  drawDetailPanel(cx);

  // Hover tooltip
  drawTooltip();
}

function drawLegend(cx) {
  let items = [
    ['GPIO', 'gpio'], ['3V3', 'power'], ['GND', 'gnd'], ['ADC', 'adc'], ['VSYS/RUN', 'sys']
  ];
  let n = items.length;
  let spacing = min(120, (canvasWidth - 40) / n);
  let totalW = spacing * n;
  let startX = cx - totalW / 2 + 8;
  let y = 44;
  textAlign(LEFT, CENTER);
  textSize(12);
  for (let i = 0; i < n; i++) {
    let x = startX + i * spacing;
    fill(catColor(items[i][1]));
    stroke('gray');
    strokeWeight(1);
    ellipse(x, y, 12, 12);
    noStroke();
    fill('black');
    text(items[i][0], x + 10, y);
  }
}

function drawDetailPanel(cx) {
  let py = boardTop + 28 + 19 * pitch + 14;
  let panelTop = py;
  let panelH = drawHeight - panelTop - 10;
  if (panelH < 60) { panelTop = drawHeight - 96; panelH = 86; }
  fill(255, 255, 255, 240);
  stroke('silver');
  strokeWeight(1);
  rect(margin, panelTop, canvasWidth - 2 * margin, panelH, 10);
  noStroke();

  let p = pins.find(q => q.num === selectedNum);
  if (!p) return;
  let info = pinInfo(p);
  fill('navy');
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(16);
  text('Pin ' + p.num + ':  ' + p.name, margin + 14, panelTop + 8);
  textStyle(NORMAL);
  fill('black');
  textSize(13);
  text('Functions: ' + p.alt, margin + 14, panelTop + 30, canvasWidth - 2 * margin - 28);
  text('Voltage: ' + info.v, margin + 14, panelTop + 50);
  textFont('monospace');
  fill('dimgray');
  text(info.ex, margin + 14, panelTop + 68, canvasWidth - 2 * margin - 28);
  textFont('Arial');
}

function pinInfo(p) {
  if (p.cat === 'gnd') return { v: '0 V', ex: 'Connect to your circuit ground' };
  if (p.cat === 'power') return { v: '3.3 V output (~300 mA)', ex: 'Powers sensors and the breadboard rail' };
  if (p.cat === 'adc') { let n = p.name.slice(2); return { v: '0–3.3 V analog input', ex: 'adc = ADC(Pin(' + n + ')); adc.read_u16()' }; }
  if (p.cat === 'gpio') { let n = p.name.slice(2); return { v: '3.3 V digital logic', ex: 'p = Pin(' + n + ', Pin.OUT); p.value(1)' }; }
  return { v: p.volt || '', ex: p.info || '' };
}

function drawTooltip() {
  for (let p of pins) {
    let c = padCenter(p);
    if (dist(mouseX, mouseY, c.x, c.y) <= padR + 3) {
      let tw = 230, th = 44;
      let tx = constrain(mouseX + 12, 0, canvasWidth - tw - 2);
      let ty = constrain(mouseY - 10, 0, drawHeight - th);
      fill('black');
      noStroke();
      rect(tx, ty, tw, th, 6);
      fill('white');
      textAlign(LEFT, TOP);
      textStyle(BOLD);
      textSize(12);
      text('Pin ' + p.num + ': ' + p.name, tx + 8, ty + 5);
      textStyle(NORMAL);
      textSize(11);
      text(p.alt, tx + 8, ty + 23, tw - 16);
      return;
    }
  }
}

function mousePressed() {
  for (let p of pins) {
    let c = padCenter(p);
    if (dist(mouseX, mouseY, c.x, c.y) <= padR + 3) {
      selectedNum = p.num;
      return;
    }
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
