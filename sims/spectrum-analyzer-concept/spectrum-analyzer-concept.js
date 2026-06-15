// Spectrum Analyzer Concept MicroSim
// CANVAS_HEIGHT: 535
// Students build a composite audio waveform with sliders (a low component, a high
// component, and noise) and watch how the FFT turns the time-domain waveform (top)
// into a frequency-domain spectrum of color-coded bars (bottom).

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 420;
let controlHeight = 115;  // 3 slider rows
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 220;
let defaultTextSize = 16;

// Controls
let lowSlider, highSlider, noiseSlider;

let nBars = 20;
let fMin = 50, fMax = 10000;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  lowSlider = createSlider(50, 200, 100, 5);
  lowSlider.position(sliderLeftMargin, drawHeight + 8);
  lowSlider.size(canvasWidth - sliderLeftMargin - margin);

  highSlider = createSlider(2000, 8000, 4000, 100);
  highSlider.position(sliderLeftMargin, drawHeight + 43);
  highSlider.size(canvasWidth - sliderLeftMargin - margin);

  noiseSlider = createSlider(0, 50, 0, 1);
  noiseSlider.position(sliderLeftMargin, drawHeight + 78);
  noiseSlider.size(canvasWidth - sliderLeftMargin - margin);

  describe('A spectrum analyzer concept. Three sliders set a low-frequency ' +
    'component, a high-frequency component, and a noise level. The top shows the ' +
    'combined waveform in the time domain; an FFT arrow points down to a ' +
    'frequency-domain bar graph showing the energy in each band.', LABEL);
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

  let fLow = lowSlider.value();
  let fHigh = highSlider.value();
  let noiseLevel = noiseSlider.value();

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('From Waveform to Spectrum (FFT)', canvasWidth / 2, 8);

  // ---- Time-domain oscilloscope (top) ----
  let oscX = margin, oscY = 42, oscW = canvasWidth - 2 * margin, oscH = 150;
  drawOscilloscope(oscX, oscY, oscW, oscH, fLow, fHigh, noiseLevel);

  // ---- FFT arrow ----
  let arrowY = oscY + oscH + 10;
  stroke('black');
  strokeWeight(3);
  fill('black');
  line(canvasWidth / 2, arrowY, canvasWidth / 2, arrowY + 26);
  triangle(canvasWidth / 2, arrowY + 32, canvasWidth / 2 - 7, arrowY + 22, canvasWidth / 2 + 7, arrowY + 22);
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(15);
  text('FFT', canvasWidth / 2 + 14, arrowY + 14);
  textStyle(NORMAL);
  textSize(11);
  fill('dimgray');
  text('(splits the signal into frequencies)', canvasWidth / 2 + 14, arrowY + 30);

  // ---- Frequency-domain spectrum (bottom) ----
  let specX = margin, specY = arrowY + 44, specW = canvasWidth - 2 * margin, specH = drawHeight - specY - 28;
  drawSpectrum(specX, specY, specW, specH, fLow, fHigh, noiseLevel);

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Low frequency: ' + fLow + ' Hz', 10, drawHeight + 18);
  text('High frequency: ' + fHigh + ' Hz', 10, drawHeight + 53);
  text('Noise: ' + noiseLevel + ' %', 10, drawHeight + 88);
}

function drawOscilloscope(x, y, w, h, fLow, fHigh, noiseLevel) {
  fill(20, 30, 25);
  stroke('gray');
  strokeWeight(1);
  rect(x, y, w, h, 6);
  // center line
  stroke(60, 90, 70);
  line(x, y + h / 2, x + w, y + h / 2);
  noStroke();
  fill('lightgreen');
  textAlign(LEFT, TOP);
  textSize(11);
  text('Time domain (oscilloscope)', x + 6, y + 4);

  let cyclesLow = map(fLow, 50, 200, 1, 4);
  let cyclesHigh = map(fHigh, 2000, 8000, 9, 28);
  let ampLow = 0.45, ampHigh = 0.28;
  let nAmp = (noiseLevel / 100) * 0.4;

  stroke('springgreen');
  strokeWeight(2);
  noFill();
  beginShape();
  for (let px = 0; px <= w - 8; px += 2) {
    let t = px / (w - 8);
    let val = ampLow * sin(TWO_PI * cyclesLow * t)
            + ampHigh * sin(TWO_PI * cyclesHigh * t)
            + nAmp * (noise(px * 0.25) - 0.5) * 2;
    let yy = y + h / 2 - val * (h / 2 - 12);
    vertex(x + 6 + px, yy);
  }
  endShape();
  noStroke();
}

function drawSpectrum(x, y, w, h, fLow, fHigh, noiseLevel) {
  // background
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(x, y, w, h, 6);
  noStroke();
  fill('dimgray');
  textAlign(LEFT, TOP);
  textSize(11);
  text('Frequency domain (spectrum)', x + 6, y + 4);

  let baseY = y + h - 18;
  let barGap = 3;
  let barW = (w - 12 - (nBars - 1) * barGap) / nBars;
  let logMin = Math.log(fMin), logMax = Math.log(fMax);

  for (let i = 0; i < nBars; i++) {
    let frac = i / (nBars - 1);
    let fc = Math.exp(logMin + frac * (logMax - logMin));
    // energy contributions
    let lowE = 1.0 * Math.exp(-Math.pow((Math.log(fc) - Math.log(fLow)) / 0.20, 2));
    let highE = 0.75 * Math.exp(-Math.pow((Math.log(fc) - Math.log(fHigh)) / 0.20, 2));
    let noiseE = (noiseLevel / 100) * (0.15 + 0.35 * noise(i * 0.7 + 10));
    let v = constrain(lowE + highE + noiseE, 0, 1);

    let bx = x + 6 + i * (barW + barGap);
    let bh = v * (baseY - y - 22);
    // color by band
    let col;
    if (fc < 250) col = 'crimson';
    else if (fc < 2000) col = 'mediumseagreen';
    else col = 'royalblue';
    fill(col);
    rect(bx, baseY - bh, barW, bh, 2);
  }

  // axis labels
  fill('dimgray');
  textAlign(CENTER, TOP);
  textSize(10);
  let ticks = [50, 250, 1000, 4000, 10000];
  for (let t of ticks) {
    let frac = (Math.log(t) - logMin) / (logMax - logMin);
    let tx = x + 6 + frac * (w - 12);
    text(t >= 1000 ? (t / 1000) + 'k' : t, tx, baseY + 2);
  }
  // band legend
  textAlign(LEFT, CENTER);
  textSize(11);
  fill('crimson'); text('bass', x + 8, y + h - 4);
  fill('mediumseagreen'); text('mid', x + 52, y + h - 4);
  fill('royalblue'); text('treble', x + 92, y + h - 4);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  lowSlider.size(canvasWidth - sliderLeftMargin - margin);
  highSlider.size(canvasWidth - sliderLeftMargin - margin);
  noiseSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
