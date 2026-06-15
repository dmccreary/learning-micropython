// NeoPixel Color Mixer MicroSim
// CANVAS_HEIGHT: 475
// Students mix a NeoPixel color with R, G, B sliders, see a live glowing preview
// and the MicroPython code, and try to match a random target color.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 360;
let controlHeight = 115;  // 3 slider rows
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 120;
let defaultTextSize = 16;

// Controls
let rSlider, gSlider, bSlider, targetButton;

// Target color (null until the student asks for one)
let target = null;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  rSlider = createSlider(0, 255, 0, 1);
  rSlider.position(sliderLeftMargin, drawHeight + 8);
  rSlider.size(canvasWidth - sliderLeftMargin - margin);
  rSlider.style('accent-color', 'red');

  gSlider = createSlider(0, 255, 150, 1);
  gSlider.position(sliderLeftMargin, drawHeight + 43);
  gSlider.size(canvasWidth - sliderLeftMargin - margin);
  gSlider.style('accent-color', 'green');

  bSlider = createSlider(0, 255, 255, 1);
  bSlider.position(sliderLeftMargin, drawHeight + 78);
  bSlider.size(canvasWidth - sliderLeftMargin - margin);
  bSlider.style('accent-color', 'blue');

  targetButton = createButton('New Target Color');
  targetButton.position(canvasWidth * 0.52, 250);
  targetButton.mousePressed(newTarget);

  describe('A NeoPixel color mixer. Three sliders set red, green, and blue from ' +
    '0 to 255. A large circle previews the mixed color and the MicroPython code ' +
    'np[0] = (R, G, B) updates live. A button sets a random target color to match.', LABEL);
}

function newTarget() {
  target = [Math.floor(random(256)), Math.floor(random(256)), Math.floor(random(256))];
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

  let r = rSlider.value();
  let g = gSlider.value();
  let b = bSlider.value();

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('NeoPixel Color Mixer', canvasWidth / 2, 8);

  // Preview circle (with glow)
  let pcx = canvasWidth * 0.27;
  let pcy = 180;
  let brightness = (r + g + b) / 765;
  noStroke();
  fill(r, g, b, 60 + brightness * 120);
  ellipse(pcx, pcy, 190, 190); // glow
  fill(r, g, b);
  stroke('gray');
  strokeWeight(1);
  ellipse(pcx, pcy, 130, 130);
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(14);
  text('Your color', pcx, pcy + 78);

  // Target swatch + match feedback
  if (target) {
    let tcx = canvasWidth * 0.55;
    let tcy = 150;
    fill(target[0], target[1], target[2]);
    stroke('gray');
    strokeWeight(1);
    ellipse(tcx, tcy, 84, 84);
    noStroke();
    fill('black');
    textAlign(CENTER, TOP);
    textSize(13);
    text('Target', tcx, tcy + 46);
    // match check
    let d = abs(r - target[0]) + abs(g - target[1]) + abs(b - target[2]);
    if (d === 0) { fill('green'); text('Perfect match!', tcx, tcy + 64); }
    else if (d < 45) { fill('darkgreen'); text('Very close!', tcx, tcy + 64); }
    else { fill('dimgray'); text('keep adjusting (off by ' + d + ')', tcx, tcy + 64); }
  } else {
    fill('dimgray');
    textAlign(CENTER, TOP);
    textSize(12);
    text('Press "New Target Color" to try a matching challenge', canvasWidth * 0.55, 150, canvasWidth * 0.4);
  }

  // Code snippet (right)
  let codeX = canvasWidth * 0.70;
  fill(245, 245, 250);
  stroke('silver');
  strokeWeight(1);
  rect(codeX, 290, canvasWidth - codeX - margin, 56, 6);
  noStroke();
  fill('navy');
  textFont('monospace');
  textAlign(LEFT, TOP);
  textSize(14);
  text('np[0] = (' + r + ', ' + g + ', ' + b + ')', codeX + 8, 298);
  text('np.write()', codeX + 8, 320);
  textFont('Arial');

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  fill('darkred');   text('Red: ' + r, 10, drawHeight + 16);
  fill('darkgreen'); text('Green: ' + g, 10, drawHeight + 51);
  fill('darkblue');  text('Blue: ' + b, 10, drawHeight + 86);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  rSlider.size(canvasWidth - sliderLeftMargin - margin);
  gSlider.size(canvasWidth - sliderLeftMargin - margin);
  bSlider.size(canvasWidth - sliderLeftMargin - margin);
  targetButton.position(canvasWidth * 0.52, 250);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
