// Serial Protocol Comparison MicroSim
// CANVAS_HEIGHT: 510
// Students switch between I2C, SPI, UART, 1-Wire, and I2S to compare bus signals
// (illustrative waveforms) and a summary panel of wires, speed, addressing, and
// best use. "Send data" sweeps a playhead across the waveform.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 80;  // tab row + send row
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

let order = ['I2C', 'SPI', 'UART', '1-Wire', 'I2S'];
let selected = 'I2C';

let protocols = {
  'I2C': {
    lines: [
      { name: 'SCL', bits: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], color: 'gray' },
      { name: 'SDA', bits: [1,1,0,1,0,0,1,0,1,1,0,0,1,0,1,0], color: 'royalblue' }
    ],
    highlight: { start: 1, end: 8, color: [186,104,200], label: 'address byte' },
    summary: { wires: '2  (SDA, SCL)', speed: '100 kHz – 1 MHz', addr: '7-bit address (~120 devices)', best: 'Many slow sensors sharing 2 pins' }
  },
  'SPI': {
    lines: [
      { name: 'SCK',  bits: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0], color: 'gray' },
      { name: 'MOSI', bits: [0,1,1,0,1,0,0,1,1,0,1,1,0,0,1,0], color: 'royalblue' },
      { name: 'MISO', bits: [0,0,1,1,0,1,1,0,0,1,0,1,1,0,0,0], color: 'teal' },
      { name: 'CS',   bits: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], color: 'crimson' }
    ],
    highlight: { start: 0, end: 1, color: [239,154,154], label: 'CS goes low' },
    summary: { wires: '4  (SCK, MOSI, MISO, CS)', speed: 'Up to tens of MHz', addr: 'One CS line per device', best: 'Fast displays and SD cards' }
  },
  'UART': {
    lines: [
      { name: 'TX', bits: [1,0,1,1,0,1,0,0,1,1,1,0,1,0,1,1], color: 'royalblue' },
      { name: 'RX', bits: [1,1,0,1,0,0,1,1,0,1,0,1,1,0,1,1], color: 'teal' }
    ],
    highlight: { start: 1, end: 2, color: [165,214,167], label: 'start bit' },
    summary: { wires: '2  (TX, RX)', speed: '9600 – 115200 baud', addr: 'Point-to-point (2 devices)', best: 'GPS, serial modules, debugging' }
  },
  '1-Wire': {
    lines: [
      { name: 'DQ', bits: [1,0,0,0,1,1,0,1,0,1,1,0,0,1,1,1], color: 'royalblue' }
    ],
    highlight: { start: 1, end: 4, color: [255,204,128], label: 'presence pulse' },
    summary: { wires: '1  (+ GND)', speed: '~16 kbps', addr: '64-bit ROM id (many devices)', best: 'DS18B20 temperature sensors' }
  },
  'I2S': {
    lines: [
      { name: 'BCLK', bits: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1], color: 'gray' },
      { name: 'WS',   bits: [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1], color: 'crimson' },
      { name: 'SD',   bits: [0,1,1,0,1,0,0,1,1,0,1,1,0,0,1,0], color: 'royalblue' }
    ],
    highlight: { start: 8, end: 9, color: [239,154,154], label: 'channel switch' },
    summary: { wires: '3  (BCLK, WS, SD)', speed: 'Audio sample rates', addr: 'Dedicated audio bus', best: 'Digital audio: mics and DACs' }
  }
};

let tabButtons = [];
let sendButton;
let isPlaying = false;
let playX = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  let bx = 10;
  for (let p of order) {
    let b = createButton(p);
    b.position(bx, drawHeight + 8);
    b.mousePressed(() => { selected = p; isPlaying = false; updateTabs(); });
    tabButtons.push({ name: p, btn: b });
    bx += (p.length > 4 ? 70 : 56);
  }
  updateTabs();

  sendButton = createButton('Send data');
  sendButton.position(10, drawHeight + 44);
  sendButton.mousePressed(() => { isPlaying = true; playX = 0; });

  describe('A serial protocol comparison. Tabs switch between I2C, SPI, UART, ' +
    '1-Wire, and I2S, each showing illustrative bus waveforms and a summary of ' +
    'wire count, speed, addressing, and best use. A Send data button sweeps a ' +
    'playhead across the waveform.', LABEL);
}

function updateTabs() {
  for (let t of tabButtons) {
    if (t.name === selected) {
      t.btn.style('background-color', 'steelblue');
      t.btn.style('color', 'white');
      t.btn.style('font-weight', 'bold');
    } else {
      t.btn.style('background-color', 'white');
      t.btn.style('color', 'black');
      t.btn.style('font-weight', 'normal');
    }
  }
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

  let proto = protocols[selected];

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Serial Protocol Comparison', canvasWidth / 2, 8);
  fill('steelblue');
  textSize(16);
  textStyle(BOLD);
  text(selected, canvasWidth / 2, 36);
  textStyle(NORMAL);

  // Waveform region
  let waveLeft = 70;
  let waveRight = canvasWidth - margin;
  let waveTop = 66;
  let nBits = 16;
  let bitW = (waveRight - waveLeft) / nBits;
  let rowH = 46;

  // playhead advance
  if (isPlaying) {
    playX += (waveRight - waveLeft) / 60;
    if (playX >= (waveRight - waveLeft)) { playX = waveRight - waveLeft; isPlaying = false; }
  }
  let revealX = isPlaying ? (waveLeft + playX) : waveRight;

  // Highlight band (behind signals), spanning all rows
  let hl = proto.highlight;
  let totalH = proto.lines.length * rowH;
  noStroke();
  fill(hl.color[0], hl.color[1], hl.color[2], 90);
  rect(waveLeft + hl.start * bitW, waveTop - 6, (hl.end - hl.start) * bitW, totalH, 3);
  fill(hl.color[0] * 0.6, hl.color[1] * 0.6, hl.color[2] * 0.6);
  textAlign(LEFT, TOP);
  textSize(11);
  text(hl.label, waveLeft + hl.start * bitW, waveTop + totalH + 2);

  // Signals
  for (let i = 0; i < proto.lines.length; i++) {
    let sig = proto.lines[i];
    let yBase = waveTop + i * rowH;
    let yHigh = yBase + 6;
    let yLow = yBase + 32;
    // label
    noStroke();
    fill('black');
    textAlign(RIGHT, CENTER);
    textSize(13);
    text(sig.name, waveLeft - 8, (yHigh + yLow) / 2);
    // square wave
    stroke(sig.color);
    strokeWeight(2);
    noFill();
    let prevY = sig.bits[0] ? yHigh : yLow;
    let px = waveLeft;
    beginShape();
    vertex(px, prevY);
    for (let b = 0; b < nBits; b++) {
      let y = sig.bits[b] ? yHigh : yLow;
      let xStart = waveLeft + b * bitW;
      let xEnd = xStart + bitW;
      if (xStart > revealX) break;
      // vertical transition
      vertex(xStart, prevY);
      vertex(xStart, y);
      vertex(min(xEnd, revealX), y);
      prevY = y;
    }
    endShape();
    noStroke();
  }

  // playhead line
  if (isPlaying) {
    stroke('orangered');
    strokeWeight(1.5);
    line(revealX, waveTop - 6, revealX, waveTop + totalH);
    noStroke();
  }

  // Summary panel
  drawSummary(proto.summary, 300);

  // Control label
  fill('dimgray');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  text('← choose a protocol, then Send data', 110, drawHeight + 56);
}

function drawSummary(s, y) {
  fill(255, 255, 255, 240);
  stroke('silver');
  strokeWeight(1);
  rect(margin, y, canvasWidth - 2 * margin, 118, 10);
  noStroke();
  let rows = [
    ['Wires', s.wires],
    ['Speed', s.speed],
    ['Addressing', s.addr],
    ['Best for', s.best]
  ];
  let ly = y + 10;
  for (let r of rows) {
    fill('dimgray');
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(13);
    text(r[0] + ':', margin + 14, ly);
    textStyle(NORMAL);
    fill('black');
    text(r[1], margin + 120, ly, canvasWidth - 2 * margin - 130);
    ly += 26;
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
