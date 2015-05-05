var pathNumSlider;
var pChoice0;
var pChoice1;
var pChoice2;
var pChoice3;
var pChoice4;
var pChoice5;

var potential = 1;
var nodeNum = 3;
var initialAction = 1;
var initialU = 1;
var initialK = 0;
var scaleFactor;

var K_;
var U_;
var reset;
var arrows = [];

var paths = [];
var pathNumber = 11;

var startX;
var startY;
var endX;
var endY;

var end1x;
var end1y;
var end2x;
var end2y;

var spacing = 10;

/*
To do:
    add zoom button to phase arrow side that will change arrow length
    display numerical value of amplitude
    change drop down menu of potentials to something else - different initial conditions like reflection, refraction, etc
    maybe force pathnumber to be odd. No that would ruin two slit interference
    When path number is changed preserve the location of the end points.

*/




function setup() {
  var cnv = createCanvas(1000, 400);
  cnv.parent("myContainer");
  textSize(16);
  textFont("Consolas");
  textStyle(NORMAL);

  pathNumSlider = createSlider(1,27,11);
  pathNumSlider.parent("sliderPos");
  pathNumSlider.size(240);  
  
  reset = createButton('Reset', 1);
  reset.parent("myContainer2");
  reset.mousePressed(resetPaths);
  stroke(100);
  noStroke();
  resetPaths();

  for (var i = 0; i<3; i++) {
    for (var k = 0; k< pathNumber; k++){
      paths[k][i].display();
    }
    if (i>0) {
      stroke(0);
      strokeWeight(2);
      for (var k = 0; k<pathNumber; k++){
        line(paths[k][i].x, paths[k][i].y, paths[k][i-1].x, paths[k][i-1].y);
      }
    }
  }
}

function draw() {
  background(255);
  line(1,1,1,height);
  line(width-1,1,width-1,height);
  strokeWeight(2);
  grid(true);
  myFunction();

  if (potential == 3) {
    strokeWeight(2);
    stroke(0, 250, 0);
    line(0, (width-200)/2+height/2, (width-200)/2+height/2, 0);
  }

  if (potential == 4) {
    fill(0, 255, 0);
    ellipse((width-200)/2, height/2, 12, 12);
  }

  if (potential == 5) {
    strokeWeight(2);
    stroke(120);  
    for (var i = 0; i<height; i=i+10) {
      line((width-200)/2, i, (width-200)/2, i+5);
    }
  }

  if (keyIsPressed===true) {
    optimizer();
  }

  pathNumSlider.mouseReleased(numCheck);

  for (var i = 0; i<3; i++) {
    for (var k = 0; k< pathNumber; k++){  
      if (typeof paths[k][i] != 'undefined'){
        paths[k][i].display();
      }
    }
    if (i>0) {
      stroke(0);
      strokeWeight(2);
      for (var k = 0; k<pathNumber; k++){
        if (typeof paths[k][i] != 'undefined'){
          line(paths[k][i].x, paths[k][i].y, paths[k][i-1].x, paths[k][i-1].y);
        }
      }
    }
  }
 
  arrows =[]
  for (var q = 0; q<pathNumber; q++){
    var phase = getAction(paths[q])/4000;
    if (q==0){
      arrows.push(new actionArrow(875, height/2, phase, 10)  );
      startX = 875;
      startY = height/2;
    }
    else {
      arrows.push(new actionArrow( arrows[q-1].x+10*cos(arrows[q-1].angle), arrows[q-1].y+10*sin(arrows[q-1].angle), phase, 10));
      arrows[q].angle = ( getAction(paths[q]) )/4000;
      a = arrows[q];
      endX = arrows[q].x + 10*cos(arrows[q].angle);
      endY = arrows[q].y + 10*sin(arrows[q].angle);
    }
    for (var j = 0; j < arrows.length; j++){
      arrows[j].display();
    }
    if (q==pathNumber-1){
      strokeWeight(2);
      stroke(250,0,0);
      line(startX, startY, endX, endY);
    }
  }
}

function grid(y) {
  if (y == true) {
    strokeWeight(0.5);
    stroke(150);
    for (var i = 1; i<9*2; i++) {
      line(width-200, .5*i*height/9, 0, .5*i*height/9);
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
  return 2*K;
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
    return -(2500*q.y)/3 + 1500000/3;  //-(200/(nodeNum)*(q.y) -380000/(nodeNum)  
    
  case '2': 
    return -(2900*q.x)/3 + 1500000/3;      //(20000/(nodeNum*nodeNum)*(q.x) - 1900000/(nodeNum*nodeNum) );  
      
  case '3': 
    if (q.x + q.y > (width-200)/2 + height/2 ) {
      return -(2000000/3);
      }
      else {
        return 0;
      }
    break;

  case '4': 
    return -(76000000/3)*(1/(dist(q.x, q.y, (width-200)/2, height/2)));

  case '5':
    return (2.5/sqrt(3))*(sq(q.x-(width-200)/2));

  default:
    return 0;
  }
}

function numCheck(){
  if (pathNumber != pathNumSlider.value()){
    end1x = paths[0][0].x;
    end1y = paths[0][0].y;
    end2x = paths[0][2].x;
    end2y = paths[0][2].y; 
    paths = [];
    pathNumber = pathNumSlider.value();
    for (var i = 0; i<pathNumber; i++) {
      paths.push([]);
    } 
    for (var i = 0; i<3; i++) {
      for (var k = 0; k< pathNumber; k++){
        if (i == 0){
          paths[k].push(new Node(end1x, end1y));
        }
        else if (i == 2){
          paths[k].push(new Node(end2x, end2y));
        }
        else{
          paths[k].push(new Node(map(i, 0, 2, 80, width-280), height/2 - (spacing/2)*(pathNumber-1)+ spacing*k));
        }
      }
    }
  }
}

function mouseClicked() {
  if (mouseButton == LEFT) {
    console.log("here");
    for (var i =0; i < 3; i++){
      for (var k =0; k < pathNumber; k++){
        if (dist(mouseX, mouseY, paths[k][i].x, paths[k][i].y) < 5){
          paths[k][i].selected =  !paths[k][i].selected;
          for (var j = 0; j < 3; j++) {
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

function actionArrow(x_, y_, angle_, len_){
  this.x = x_;
  this.y = y_;
  this.angle = angle_;
  this.len = len_;
  this.display = function() {
    strokeWeight(1);
    stroke(0);   
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
  paths.length = 0;
  for (var i = 0; i<pathNumber; i++) {
      paths.push([]);
  } 
  for (var i = 0; i<3; i++) {
    for (var k = 0; k< pathNumber; k++){
      if (i == 0 || i == 2){
        paths[k].push(new Node(map(i, 0, 2, 80, width-280), height/2));
      }
      else{
          paths[k].push(new Node(map(i, 0, 2, 80, width-280), height/2 + 50-100*k/pathNumber ));
      }
    }
  }
}