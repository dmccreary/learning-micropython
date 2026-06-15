// Ohm's Law LED Resistor Calculator MicroSim
// CANVAS_HEIGHT: 515
// Students set supply voltage, LED forward voltage, and LED current; the sim
// calculates the current-limiting resistor R = (Vs - Vf) / I, snaps to the
// nearest E12 standard value, shows power, and animates current around the loop.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 115;  // 3 slider rows
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 240;
let defaultTextSize = 16;

// Inputs
let supplyV = 3.3;
let ledV = 2.0;
let ledCurrent = 20; // mA

let supplySlider, ledVSlider, currentSlider;
let mouseOverCanvas = false;
let flowOffset = 0;

// E12 standard resistor series (one decade); scaled across decades when matching
let e12 = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);

  supplySlider = createSlider(1, 5, supplyV, 0.1);
  supplySlider.position(sliderLeftMargin, drawHeight + 8);
  supplySlider.size(canvasWidth - sliderLeftMargin - margin);

  ledVSlider = createSlider(1.5, 3.5, ledV, 0.1);
  ledVSlider.position(sliderLeftMargin, drawHeight + 43);
  ledVSlider.size(canvasWidth - sliderLeftMargin - margin);

  currentSlider = createSlider(5, 30, ledCurrent, 1);
  currentSlider.position(sliderLeftMargin, drawHeight + 78);
  currentSlider.size(canvasWidth - sliderLeftMargin - margin);

  describe("An Ohm's Law calculator for choosing an LED resistor. Three sliders " +
    "set supply voltage, LED forward voltage, and LED current. A circuit diagram " +
    "with animated current shows the result, and a panel displays the calculated " +
    "and standard resistor values plus power.", LABEL);
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

  supplyV = supplySlider.value();
  ledV = ledVSlider.value();
  ledCurrent = currentSlider.value();

  // Compute
  let Vr = supplyV - ledV;            // voltage across resistor
  let I = ledCurrent / 1000;          // amps
  let valid = Vr > 0;
  let R = valid ? Vr / I : 0;         // ohms
  let Rstd = valid ? nearestE12(R) : 0;
  let P_mW = valid ? Vr * ledCurrent : 0; // mW (Vr * I, I in mA already gives mW)

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text("Ohm's Law: LED Resistor Calculator", canvasWidth / 2, 8);

  // ----- Circuit diagram (left half) -----
  let lx = margin + 45;
  let rx = canvasWidth * 0.5 - 30;
  let topY = 80;
  let botY = 330;
  let midX = (lx + rx) / 2;
  let midY = (topY + botY) / 2;

  if (mouseOverCanvas && valid) flowOffset += map(ledCurrent, 5, 30, 0.002, 0.012);

  // Wires
  stroke('dimgray');
  strokeWeight(3);
  noFill();
  line(lx, botY, lx, topY);   // left
  line(lx, topY, rx, topY);   // top
  line(rx, topY, rx, botY);   // right
  line(rx, botY, lx, botY);   // bottom

  // Animated current arrows along the loop
  if (valid) drawCurrentFlow(lx, rx, topY, botY);

  // Battery / supply symbol on left wire
  drawBattery(lx, midY, supplyV);

  // Resistor on top wire
  drawResistor(midX, topY, Rstd, valid);

  // LED on right wire
  drawLED(rx, midY);

  // ----- Data panel (right half) -----
  drawPanel(canvasWidth * 0.52, supplyV, ledV, Vr, ledCurrent, R, Rstd, P_mW, valid);

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Supply Voltage: ' + supplyV.toFixed(1) + ' V', 10, drawHeight + 18);
  text('LED Forward Voltage: ' + ledV.toFixed(1) + ' V', 10, drawHeight + 53);
  text('LED Current: ' + ledCurrent + ' mA', 10, drawHeight + 88);
}

function drawBattery(x, y, v) {
  // Battery symbol: long plate (+) above, short plate (-) below, crossing the wire
  stroke('white');
  strokeWeight(6);
  line(x, y - 14, x, y + 6);   // mask the wire between the plates
  stroke('dimgray');
  strokeWeight(3);
  line(x - 11, y - 8, x + 11, y - 8);  // long plate (+)
  line(x - 6, y + 2, x + 6, y + 2);    // short plate (-)
  noStroke();
  fill('black');
  textAlign(RIGHT, CENTER);
  textSize(13);
  text(v.toFixed(1) + ' V', x - 16, y - 3);
}

function drawResistor(x, y, rstd, valid) {
  rectMode(CENTER);
  stroke('dimgray');
  strokeWeight(2);
  fill('burlywood');
  rect(x, y, 70, 22, 4);
  rectMode(CORNER);
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(13);
  text(valid ? rstd + ' Ω' : '— Ω', x, y);
}

function drawLED(x, y) {
  // Triangle (pointing down = current direction) + bar (cathode)
  stroke('dimgray');
  strokeWeight(2);
  fill('red');
  triangle(x - 12, y - 12, x + 12, y - 12, x, y + 8);
  strokeWeight(3);
  line(x - 12, y + 8, x + 12, y + 8);
  // light arrows
  stroke('orange');
  strokeWeight(2);
  line(x + 14, y - 8, x + 24, y - 16);
  line(x + 16, y - 2, x + 26, y - 10);
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(13);
  text('LED', x + 16, y + 14);
}

function drawCurrentFlow(lx, rx, topY, botY) {
  let W = rx - lx;
  let H = botY - topY;
  let total = 2 * (W + H);
  let nDots = 10;
  fill('royalblue');
  noStroke();
  for (let i = 0; i < nDots; i++) {
    let t = (i / nDots + flowOffset) % 1;
    let p = posOnLoop(t, lx, rx, topY, botY, W, H, total);
    push();
    translate(p.x, p.y);
    rotate(p.angle);
    triangle(5, 0, -4, -4, -4, 4);
    pop();
  }
}

function posOnLoop(t, lx, rx, topY, botY, W, H, total) {
  // Clockwise: BL -> TL (up) -> TR (right) -> BR (down) -> BL (left)
  let d = t * total;
  if (d < H) return { x: lx, y: botY - d, angle: -HALF_PI };
  d -= H;
  if (d < W) return { x: lx + d, y: topY, angle: 0 };
  d -= W;
  if (d < H) return { x: rx, y: topY + d, angle: HALF_PI };
  d -= H;
  return { x: rx - d, y: botY, angle: PI };
}

function drawPanel(px, vs, vf, vr, iMa, r, rstd, pmw, valid) {
  let pw = canvasWidth - px - margin;
  let py = 70;
  fill(255, 255, 255, 240);
  stroke('silver');
  strokeWeight(1);
  rect(px, py, pw, 200, 10);
  noStroke();

  fill('black');
  textAlign(LEFT, TOP);
  textSize(14);
  let ly = py + 12;
  let lh = 22;
  text('Supply voltage:  ' + vs.toFixed(1) + ' V', px + 12, ly); ly += lh;
  text('LED forward V:  ' + vf.toFixed(1) + ' V', px + 12, ly); ly += lh;
  text('Across resistor:  ' + vr.toFixed(1) + ' V', px + 12, ly); ly += lh;
  text('Current:  ' + iMa + ' mA', px + 12, ly); ly += lh;
  if (valid) {
    textFont('monospace');
    text('R = ' + vr.toFixed(1) + ' / ' + (iMa / 1000).toFixed(3), px + 12, ly); ly += lh;
    text('R = ' + Math.round(r) + ' Ω', px + 12, ly); ly += lh;
    textFont('Arial');
    text('Power: ' + pmw.toFixed(0) + ' mW', px + 12, ly);
  } else {
    fill('firebrick');
    text('Supply must be greater', px + 12, ly); ly += lh;
    text('than the LED voltage!', px + 12, ly);
  }

  // Result box (big) below the panel
  let ry = py + 210;
  if (valid) {
    fill('honeydew');
    stroke('green');
    strokeWeight(2);
    rect(px, ry, pw, 56, 10);
    noStroke();
    fill('darkgreen');
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(18);
    text('Use ' + rstd + ' Ω', px + pw / 2, ry + 20);
    textStyle(NORMAL);
    textSize(12);
    text('(nearest E12 standard value)', px + pw / 2, ry + 42);
  }
}

// Nearest standard E12 resistor value (in log space across decades)
function nearestE12(r) {
  if (r <= 0) return 0;
  let best = e12[0];
  let bestDiff = Infinity;
  for (let decade = 0; decade <= 6; decade++) {
    let scale = Math.pow(10, decade);
    for (let base of e12) {
      let val = base * scale;
      let diff = Math.abs(Math.log(val) - Math.log(r));
      if (diff < bestDiff) { bestDiff = diff; best = val; }
    }
  }
  // Tidy formatting: integer for < 1000
  return (best >= 1000) ? (best / 1000) + 'k' : Math.round(best);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  supplySlider.size(canvasWidth - sliderLeftMargin - margin);
  ledVSlider.size(canvasWidth - sliderLeftMargin - margin);
  currentSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
