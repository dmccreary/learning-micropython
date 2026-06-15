// Arithmetic Operator Explorer MicroSim
// CANVAS_HEIGHT: 495
// Students pick two numbers and an operator and see the Python expression and
// result, with a plain-English explanation and a pizza analogy for // and %.

// Canvas dimensions
let canvasWidth = 400;       // responsive width
let drawHeight = 380;        // drawing/result area height
let controlHeight = 115;     // 3 rows of controls (slider A, slider B, operator buttons)
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 160;  // room for "Number B: 20" label + value
let defaultTextSize = 16;

// Application variables
let numA = 10;
let numB = 3;
let operators = ['+', '-', '*', '/', '//', '%'];
let selectedOp = '+';

// Controls
let sliderA, sliderB;
let opButtons = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  textSize(defaultTextSize);

  // Number A slider (row 0)
  sliderA = createSlider(0, 20, numA);
  sliderA.position(sliderLeftMargin, drawHeight + 5);
  sliderA.size(canvasWidth - sliderLeftMargin - margin);

  // Number B slider (row 1) - minimum 1 prevents division by zero
  sliderB = createSlider(1, 20, numB);
  sliderB.position(sliderLeftMargin, drawHeight + 40);
  sliderB.size(canvasWidth - sliderLeftMargin - margin);

  // Operator buttons (row 2)
  for (let i = 0; i < operators.length; i++) {
    let op = operators[i];
    let btn = createButton(op);
    btn.position(10 + i * 46, drawHeight + 78);
    btn.size(38, 28);
    btn.mousePressed(() => { selectedOp = op; updateButtonStyles(); });
    opButtons.push(btn);
  }
  updateButtonStyles();

  describe('An arithmetic operator explorer. Two sliders set Number A and Number B, ' +
    'six buttons choose a Python operator, and the result shows the full expression ' +
    'with a plain-English explanation.', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing region background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control region background
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  noStroke();

  // Read live slider values
  numA = sliderA.value();
  numB = sliderB.value();

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(24);
  text('Arithmetic Operator Explorer', canvasWidth / 2, 12);

  // Stage 1: show A, B, and the selected operator
  textSize(18);
  textAlign(CENTER, TOP);
  noStroke();
  fill('black');
  text('Number A = ' + numA + '     Number B = ' + numB, canvasWidth / 2, 56);
  text('Operator: ' + selectedOp, canvasWidth / 2, 82);

  // Stage 2: the full Python expression and result, in a result card
  let result = computeResult(numA, numB, selectedOp);
  let resultStr = formatResult(result, selectedOp);
  let expr = numA + ' ' + selectedOp + ' ' + numB + ' = ' + resultStr;

  let cardY = 115;
  let cardH = 70;
  fill(255, 255, 255, 230);
  stroke('silver');
  rect(margin, cardY, canvasWidth - 2 * margin, cardH, 10);
  noStroke();
  fill('navy');
  textFont('monospace');
  textAlign(CENTER, CENTER);
  textSize(30);
  text(expr, canvasWidth / 2, cardY + cardH / 2);
  textFont('Arial');

  // Stage 3: plain-English explanation
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16);
  text(explainOperator(selectedOp), margin, cardY + cardH + 18, canvasWidth - 2 * margin);

  // Pizza analogy for floor division and modulo
  if (selectedOp === '//' || selectedOp === '%') {
    let slices = Math.floor(numA / numB);
    let leftover = numA % numB;
    let pizza = numA + ' pizza slices shared by ' + numB + ' people: each person gets ' +
      slices + ' slices (//), with ' + leftover + ' left over (%).';
    fill('saddlebrown');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(15);
    text(pizza, margin, cardY + cardH + 70, canvasWidth - 2 * margin);
  }

  // Control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Number A: ' + numA, 10, drawHeight + 15);
  text('Number B: ' + numB, 10, drawHeight + 50);
}

// Highlight the selected operator button in a bright accent color
function updateButtonStyles() {
  for (let i = 0; i < opButtons.length; i++) {
    if (operators[i] === selectedOp) {
      opButtons[i].style('background-color', 'gold');
      opButtons[i].style('border', '2px solid darkorange');
      opButtons[i].style('font-weight', 'bold');
    } else {
      opButtons[i].style('background-color', 'white');
      opButtons[i].style('border', '1px solid gray');
      opButtons[i].style('font-weight', 'normal');
    }
  }
}

function computeResult(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return a / b;                 // Python true division -> float
    case '//': return Math.floor(a / b);    // floor division
    case '%': return a % b;                 // remainder
  }
  return 0;
}

// Format the result the way Python would display it
function formatResult(value, op) {
  if (op === '/') {
    // Show a float; trim to at most 4 decimals but keep .0 for whole numbers
    if (Number.isInteger(value)) return value.toFixed(1);
    return parseFloat(value.toFixed(4)).toString();
  }
  return value.toString();
}

function explainOperator(op) {
  switch (op) {
    case '+': return 'Addition adds the two numbers together.';
    case '-': return 'Subtraction takes Number B away from Number A.';
    case '*': return 'Multiplication adds Number A to itself Number B times.';
    case '/': return 'True division ( / ) always gives a decimal (float) answer.';
    case '//': return 'Floor division ( // ) keeps only the whole-number part.';
    case '%': return 'Modulo ( % ) gives the remainder left after dividing.';
  }
  return '';
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  sliderA.size(canvasWidth - sliderLeftMargin - margin);
  sliderB.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  canvasWidth = Math.floor(container.width);
}
