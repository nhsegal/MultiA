var nodeNumSlider;

var pChoice0;
var pChoice1;
var pChoice2;
var pChoice3;
var pChoice4;
var pChoice5;

var nodes = [];


var potential = 1;
var nodeNum = 9;
var initialAction = 1;
var initialU = 1;
var initialK = 0;
var scaleFactor;
var most=100;
var K_;
var U_;
var reset;
var arrow;
var arrow_x = 100;
var arrow_y = 250;
var arrows = [];

var paths = [];
var pathNumber = 20;
var arrowEndx;
var arrowEndy;


function setup() {
  var cnv = createCanvas(800, 400);
  cnv.parent("myContainer");
  textSize(16);
  textFont("Consolas");
  textStyle(NORMAL);

  nodeNumSlider = createSlider(3,17,9);
  nodeNumSlider.parent("sliderPos");
  nodeNumSlider.size(240);  
  
  reset = createButton('Reset', 1);
  reset.parent("myContainer2");
  reset.mousePressed(resetPaths);
  stroke(100);
  noStroke();
  resetPaths();

  for (var i = 0; i<nodes.length; i++) {
    nodes[i].clickedOn();
    nodes[i].display();
    
    for (var k = 0; k< pathNumber; k++){
      paths[k][i].display();
    }
    if (i>0) {
      stroke(0);
      strokeWeight(2);
      line(nodes[i].x, nodes[i].y, nodes[i-1].x, nodes[i-1].y);
      for (var k = 0; k<pathNumber; k++){
         console.log(paths[k][i].x);
        line(paths[k][i].x, paths[k][i].y, paths[k][i-1].x, paths[k][i-1].y);
      }
    }
  }

  //initialU = calculateU();
  //initialK = calculateK();
  //initialAction = calculateK() - calculateU();  

  arrow = new actionArrow(arrow_x, arrow_y, 3, 20);
  arrowEndx = arrow.x + 10*sin(20);
  arrowEndy = arrow.y + 10*sin(20);


 
}

function draw() {
  
  background(255);
  strokeWeight(2);
  grid(true);
  myFunction();

  if (potential == 3) {
    strokeWeight(2);
    stroke(0, 250, 0);
    line(0, width/2+height/2, width/2+height/2, 0);
  }

  if (potential == 4) {
    fill(0, 255, 0);
    ellipse(width/2, height/2, 12, 12);
  }

  if (potential == 5) {
    strokeWeight(2);
    stroke(120);  
    for (var i = 0; i<height; i=i+10) {
      line(width/2, i, width/2, i+5);
    }
  }

  if (keyIsPressed===true) {
    optimizer();
  }

  nodeNumSlider.mouseReleased(numCheck);
  for (var i = 0; i<nodes.length; i++) {
    nodes[i].clickedOn();
   
    nodes[i].display();
    
    for (var k = 0; k< pathNumber; k++){
      paths[k][i].display();
    }
    if (i>0) {
      stroke(0);
      strokeWeight(2);
      line(nodes[i].x, nodes[i].y, nodes[i-1].x, nodes[i-1].y);
      for (var k = 0; k<pathNumber; k++){
        line(paths[k][i].x, paths[k][i].y, paths[k][i-1].x, paths[k][i-1].y);
      }
    }
  }
 
  arrow.angle = ( getAction(nodes) )/4000;
  arrows =[]
  arrows.push(arrow);

  var a = arrow;

  for (var q = 1; q<pathNumber; q++){
    arrows.push(new actionArrow(a.x+a.len*cos(a.angle), a.y+a.len*sin(a.angle), a.angle, a.len));
    arrows[q].angle = ( getAction(paths[q]) )/4000;
    a = arrows[q];
  }

  for (var j = 0; j < arrows.length; j++){
    arrows[j].display();
  }



  arrow.display();
}

function grid(y) {
  if (y == true) {
    strokeWeight(0.5);
    stroke(150);
    for (var i = 1; i<9*2; i++) {
      line(width, .5*i*height/9, 0, .5*i*height/9);
    }
    for (var i = 1; i<9*4; i++) {
      line(.5*i*height/9, 0, .5*i*height/9, height);
    }
  }
}

function Node(ix, iy) {
  this.x = ix;
  this.y = iy;
  this.selected = false;
  var selfX = this.x;
  var selfY = this.y;

  this.display = function() {
    noStroke();
    if (this.selected == false) {
      fill(0);
    }
    else {
      fill(255, 0, 0);
      this.x = mouseX;
      this.y = mouseY;
    }
    ellipse(this.x, this.y, 8, 8);
  }

  this.clickedOn = function() {
    if (this.selected == true) {
      this.x = mouseX;
      this.y = mouseY;
    }
  }
}


function calculateK(path_) {
  var K = 0;
  for (var i=0; i<path_.length; i++) {  
    if (i>0) {
      K = K + sq(dist(path_[i].x, path_[i].y, path_[i-1].x, path_[i-1].y));
    }
  }
  K = K*(nodeNum-1);
  return K;
}

function calculateU(path_) {
  var U = 0;
  for (var i=0; i<path_.length; i++) {  
    U = U + getPE(path_[i]);
  }
  return U;
}

function getAction(path_) {
    return calculateK(path_) - calculateU(path_);
}

function getPE(q) {
  switch (potential) {
  case '1': //linear grad upward
    return -(2500*q.y)/nodeNum + 1500000/nodeNum;  //-(200/(nodeNum)*(q.y) -380000/(nodeNum)  
    
  case '2': 
    return -(2900*q.x)/nodeNum + 1500000/nodeNum;      //(20000/(nodeNum*nodeNum)*(q.x) - 1900000/(nodeNum*nodeNum) );  
      
  case '3': 
    if (q.x + q.y > width/2 + height/2 ) {
      return -(2000000/nodeNum);
      }
      else {
        return 0;
      }
    break;

  case '4': 
    return -(76000000/nodeNum)*(1/(dist(q.x, q.y, width/2, height/2)));

  case '5':
    return (2.5/sqrt(nodeNum))*(sq(q.x-width/2));

  default:
    return 0;
  }
}

function numCheck(){
  if (nodeNum != nodeNumSlider.value()){
    nodes.length = 0;
    nodeNum = nodeNumSlider.value();
    for (var i = 0; i<nodeNum; i++) {
      nodes.push(new Node(map(i, 0, nodeNum-1, 30, width-80), height/2));
    } 
  }
}

function mouseClicked() {
  if (mouseButton == LEFT) {
    for (var i = 0; i < nodes.length; i++) {
      var p = nodes[i];
      if (dist(mouseX, mouseY, p.x, p.y) < 5) {
        nodes[i].selected =  !nodes[i].selected;
        for (var j = 0; j < nodes.length; j++) {
          if (j != i) {
            nodes[j].selected = false;
          }
        }
      }
      else {
        for (var k =0; k < pathNumber; k++){
          if (dist(mouseX, mouseY, paths[k][i].x, paths[k][i].y) < 5){
            paths[k][i].selected =  !paths[k][i].selected;
            for (var j = 0; j < nodes.length; j++) {
              for (var w = 0; w< paths.length; w++){
                if ((w != k) && (j != i)) {
                  paths[w][j].selected = false;
                }
              }
            }
          }
        }
      }
    }
  }
}

function optimizer() {
  var jump = 1;
  if (potential ==3){
    jump = 20;
  }
  for (var j = 0; j<400; j++) {
    for (var i = 1;  i<nodeNumSlider.value()-1; i++) {
      var oldAction = calculateK() - calculateU();
      var tempX = nodes[i].x;
      var tempY = nodes[i].y;
      nodes[i].x = nodes[i].x + randomGaussian()*jump;
      nodes[i].y = nodes[i].y + randomGaussian()*jump;
      if ( calculateK() - calculateU() > oldAction) {
        nodes[i].x  = tempX;
        nodes[i].y = tempY;
      }
    }
  }  
}

function splitter() {
  var jump = 10;
  for (var j = 0; j<4; j++) {
    for (var i = 1;  i<nodeNumSlider.value()-1; i++) {
      paths.push(new Path());
    } 
  }
}

function actionArrow(x_, y_, angle_, len_){
  this.x = x_;
  this.y = y_;
  this.angle = angle_;
  this.len = len_;
  
  this.display = function() {
  strokeWeight(2);
  stroke(0);
  //smooth();
    
  push();
    translate(this.x, this.y);
    rotate(this.angle);
    line(0, 0, this.len, 0);
    
    push();
      translate(this.len, 0);
      rotate(atan(PI/6));
      line(0,0, -this.len/10, 0);
    pop();
    
    push();
      translate(this.len, 0);
      rotate(atan(-PI/6));
      line(0,0, -this.len/10, 0);
    pop();
    
  pop(); 
  }
}

function myFunction() {
  var e = document.getElementById("menu1");
  potential = e.options[e.selectedIndex].value;
}

function resetPaths(){
  nodes.length = 0;  
  paths.length = 0;
  nodeNum = nodeNumSlider.value();
  for (var k = 0; k < pathNumber; k++){
    paths.push([]);
  }
    for (var i = 0; i<nodeNum; i++) {
      nodes.push(new Node(map(i, 0, nodeNum-1, 30, width-80), height/2));
      for (var k = 0; k< pathNumber; k++){
        if (i == 0 || i == nodeNum-1){
          paths[k].push(nodes[i]);
        }
        else{
          paths[k].push(new Node(nodes[i].x + 20*(random()-.5), nodes[i].y+ 20*(random()-.5)) );
        }
      }
    }
}

function displayPaths(){


}