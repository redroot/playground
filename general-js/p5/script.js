// thanks to: https://blog.kadenze.com/creative-technology/p5-js-crash-course-recreate-art-you-love/

var maxCircleSize = 20;
var numRows = 10, numCols = 10, numStrands = 2;
var phase = 0, speed = 0.03;
var colorA, colorB;

function setup() {
  createCanvas(500, 500);
  noStroke();
  colorA = color(253, 174, 120);
  colorB = color(226, 129, 161);
}

function draw() {
  background(4, 58, 74);
  // global framecount?
  phase = frameCount * speed;

  for(var strand = 0; strand < numStrands; strand += 1) {
    for(var col = 0; col < numCols; col += 1) {
      for(var row = 0; row < numRows; row += 1) {
        // lerpColour blends between two colours, using 0-1 amount param
        fill(lerpColor(colorA, colorB, row / numRows));
        // map remaps initial value from one range to another
        // in this case, column number to width of canva with 50px
        // padding
        var strandPhase = phase + map(strand, 0, numStrands, 0, TWO_PI);
        var x = map(col, 0, numCols, 50, width - 50);
        var colOffset = map(col, 0, numCols, 0, TWO_PI);
        var y = height/2 + row * 10 + sin(strandPhase + colOffset) * 50;
        var sizeOffset = (cos(strandPhase - (row / numRows) + colOffset) + 1) * 0.5;
        var circleSize = sizeOffset * maxCircleSize;
        ellipse(x, y, circleSize, circleSize);
      }
    }
  }
}
