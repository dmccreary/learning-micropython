// Python Data Type Explorer MicroSim
// CANVAS_HEIGHT: 480
// Students classify a mystery Python value as Integer, Float, String, or Boolean
// by clicking the matching type box. Immediate feedback explains the reason and
// a running score is kept.

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 430;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// Data types (classification targets)
let types = [
  { name: 'Integer', color: 'royalblue',    desc: 'Whole number — no decimal' },
  { name: 'Float',   color: 'seagreen',     desc: 'Number with a decimal point' },
  { name: 'String',  color: 'darkorange',   desc: 'Text inside quotation marks' },
  { name: 'Boolean', color: 'mediumpurple', desc: 'Only True or False' }
];

// Mystery values and their correct types
let values = [
  { literal: '42',      type: 'Integer' },
  { literal: '3.14',    type: 'Float' },
  { literal: '"hello"', type: 'String' },
  { literal: 'True',    type: 'Boolean' },
  { literal: '-7',      type: 'Integer' },
  { literal: "'Pico'",  type: 'String' },
  { literal: 'False',   type: 'Boolean' },
  { literal: '0.5',     type: 'Float' },
  { literal: '100',     type: 'Integer' },
  { literal: '"GP15"',  type: 'String' },
  { literal: '-2.71',   type: 'Float' }
];

let currentIndex = 0;
let answeredCorrectly = false;
let feedbackMsg = 'Click the data type that matches the value above.';
let feedbackColor = 'black';
let score = 0;
let attempts = 0;

// Animation feedback
let shakeBox = -1;
let shakeTimer = 0;
let glowBox = -1;

let nextButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  nextButton = createButton('Next Value');
  nextButton.position(10, drawHeight + 10);
  nextButton.mousePressed(nextValue);

  currentIndex = Math.floor(random(values.length));

  describe('A Python data type classifier. A mystery value is shown and the student ' +
    'clicks one of four type boxes (Integer, Float, String, Boolean) to classify it. ' +
    'Feedback explains the reason and a running score is kept.', LABEL);
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
  textSize(24);
  text('Python Data Type Explorer', canvasWidth / 2, 12);

  // Instruction / mystery prompt
  textSize(15);
  fill('dimgray');
  text('What type is this value?', canvasWidth / 2, 44);

  // Type boxes (clickable classification targets)
  let boxGap = 12;
  let boxY = 70;
  let boxH = 100;
  let boxW = (canvasWidth - 2 * margin - 3 * boxGap) / 4;
  for (let i = 0; i < types.length; i++) {
    let bx = margin + i * (boxW + boxGap);
    // shake offset for an incorrect click
    let dx = 0;
    if (shakeBox === i && shakeTimer > 0) {
      dx = sin(frameCount * 0.9) * 4;
    }
    // glow for the correct box
    if (glowBox === i) {
      stroke('gold');
      strokeWeight(4);
    } else {
      stroke('white');
      strokeWeight(2);
    }
    fill(types[i].color);
    rect(bx + dx, boxY, boxW, boxH, 8);
    noStroke();
    fill('white');
    textAlign(CENTER, TOP);
    textSize(16);
    textStyle(BOLD);
    text(types[i].name, bx + dx, boxY + 8, boxW);
    textStyle(NORMAL);
    textSize(12);
    text(types[i].desc, bx + dx + 4, boxY + 34, boxW - 8);
  }
  if (shakeTimer > 0) shakeTimer--;
  else if (shakeBox !== -1) shakeBox = -1;

  // Mystery value card
  let cardW = min(360, canvasWidth - 2 * margin);
  let cardX = (canvasWidth - cardW) / 2;
  let cardY = 186;
  let cardH = 76;
  fill(255, 255, 255, 235);
  stroke('silver');
  strokeWeight(1);
  rect(cardX, cardY, cardW, cardH, 10);
  noStroke();
  fill('navy');
  textFont('monospace');
  textAlign(CENTER, CENTER);
  textSize(38);
  text(values[currentIndex].literal, canvasWidth / 2, cardY + cardH / 2);
  textFont('Arial');

  // Feedback message
  fill(feedbackColor);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16);
  text(feedbackMsg, margin, cardY + cardH + 16, canvasWidth - 2 * margin);

  // Running score
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16);
  textStyle(BOLD);
  text(score + ' correct out of ' + attempts + ' attempts', canvasWidth / 2, 372);
  textStyle(NORMAL);
}

function mousePressed() {
  // Only the type boxes are handled here; the Next Value button has its own handler
  if (answeredCorrectly) return;
  let boxGap = 12;
  let boxY = 70;
  let boxH = 100;
  let boxW = (canvasWidth - 2 * margin - 3 * boxGap) / 4;
  if (mouseY < boxY || mouseY > boxY + boxH) return;
  for (let i = 0; i < types.length; i++) {
    let bx = margin + i * (boxW + boxGap);
    if (mouseX >= bx && mouseX <= bx + boxW) {
      checkAnswer(i);
      return;
    }
  }
}

function checkAnswer(i) {
  attempts++;
  let v = values[currentIndex];
  if (types[i].name === v.type) {
    score++;
    answeredCorrectly = true;
    glowBox = i;
    shakeBox = -1;
    feedbackColor = 'green';
    feedbackMsg = 'Correct! ' + v.literal + ' is ' + article(v.type) + ' ' +
      v.type + ' ' + reasonFor(v.type);
  } else {
    glowBox = -1;
    shakeBox = i;
    shakeTimer = 20;
    feedbackColor = 'firebrick';
    feedbackMsg = 'Not quite — look for quotation marks, a decimal point, or True/False.';
  }
}

function nextValue() {
  let next = currentIndex;
  if (values.length > 1) {
    while (next === currentIndex) next = Math.floor(random(values.length));
  }
  currentIndex = next;
  answeredCorrectly = false;
  glowBox = -1;
  shakeBox = -1;
  shakeTimer = 0;
  feedbackColor = 'black';
  feedbackMsg = 'Click the data type that matches the value above.';
}

function article(typeName) {
  return (typeName === 'Integer') ? 'an' : 'a';
}

function reasonFor(typeName) {
  switch (typeName) {
    case 'Integer': return 'because it has no decimal point and no quotation marks.';
    case 'Float':   return 'because it has a decimal point.';
    case 'String':  return 'because it is wrapped in quotation marks.';
    case 'Boolean': return 'because it is either True or False.';
  }
  return '';
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
