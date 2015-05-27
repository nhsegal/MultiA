var zoomIn; //The number of paths, set by the slider
var situation = 0;  //Indicates what choice is select from the scenario drop down
var hBarSlider;
var spacingSlider;
var scan;

var hBar = 1/5000;
var reset;
var arrows = [];

var paths = [];
var pathNumber = 11;

var startX;
var startY;
var endX;
var endY;

var scanLineX;
var scanLineY;

//node positions
var end1x = 0;
var end1y = 0;
var midx = 200;
var midy = 200;
var end2x = 700;
var end2y = 300;

var spacing = 8;

var arrowLen = 6;
var increaseLen;
var decreaseLen;

var scan = [];
var scanMax = 0;
var oldPathNum= 8;
/*
To do:
    
*/

function setup() {
  var cnv = createCanvas(1200, 400);
  cnv.parent("myContainer");
  textSize(16);
  textFont("Consolas");
  textStyle(NORMAL);

  zoomIn = createButton('Zoom In', 1);
  zoomIn.parent("myContainer");//("zoomin");
  zoomIn.position(1022,232);
  zoomIn.mousePressed(function(){arrowLen = arrowLen*1.1});
  zoomIn.style("background-color", "turquoise");

  zoomOut = createButton('Zoom Out', 1);
  zoomOut.parent("myContainer");//("zoomout");
  zoomOut.position(1112,232);
  zoomOut.mousePressed(function(){arrowLen = arrowLen/1.1});
  zoomOut.style("background-color", "beige");


  scan = createButton('&nbsp Scan &nbsp', 1);
  scan.parent("buttonholder2");
  scan.mousePressed(takeScan);
  scan.style("background-color", "deepskyblue");

  reset = createButton('&nbsp Reset &nbsp', 1);
  reset.parent("buttonholder");
  //reset.position = (0,0);
  reset.mousePressed(resetPaths);
  reset.style("background-color", "chartreuse");
  resetPaths();

  hBarSlider = createSlider(5, 20, 14);
  hBarSlider.parent("sliderPos2");
  hBarSlider.size(240);

  spacingSlider = createSlider(1, 20, 8);
  spacingSlider.parent("sliderPos3");
  spacingSlider.size(240);
}

function draw() {
  background(255);
  grid(true);
  switch(situation){
    case '2': //Draw mirror
      noStroke();
      fill(100);
      rect(40, 370, 1000, 10);
    break;

    case '3': //Draw grating
      noStroke();
      fill(100);
      rect(40, 380, 900, 10);      
      for (var i = 0; i < paths.length; i++){
        if (typeof paths[i][1].x != 'undefined'){
          rect(paths[i][1].x-3, 370, 10, 10 );
        }
      }
    break;

    default:
    break;
  }

  spacingSlider.mouseReleased(function(){spacing = spacingSlider.value();});

  //Display each nonde in each path array in the paths array
  //and connect the nodes for with lines
  for (var i = 0; i<3; i++) {
    for (var k = 0; k<pathNumber; k++){  
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
 
  //Calculate the phase associated with each path
  //Push an arrow with that phase into the arrows array
  //Display the arrows tip to tail
  getAction();
  for (var j = 0; j < arrows.length; j++){
    arrows[j].display();
  } 
  strokeWeight(2);
  stroke(250,0,0);
  line(startX, startY, endX, endY);
  fill(10);

  if (scan.length > 0){
    strokeWeight(2);
    stroke(120);  

    if (situation == 2 || situation == 3){
      for (var i = 0; i<width; i=i+10) {
        line(i, scanLineY, i+5, scanLineY);       
      }
    }
    else {
      for (var i = 0; i<height; i=i+10) {
        line(scanLineX, i, scanLineX, i+5); 
      }
    }
   
    fill(200,0,0);
    stroke(200,0,0);
    for (var i = 0; i < scan.length; i++ ){
      if (situation == 2 || situation == 3){ //mirror or grating
        ellipse( i, map(scan[i], 0, scanMax, 0, height/4),        1,1);
        line( i, map(scan[i], 0, scanMax/100, 0, height), (i-1), map(scan[i-1], 0, scanMax/100, 0, height)  );     
      }
      else { 
        ellipse( map(scan[i], 0, scanMax, 0, width/5) , i, 1,1);  // map(scan[a], 0, max(scan), 0, 200)
        line( map(scan[i], 0, scanMax/40, 0, width), i, map(scan[i-1], 0, scanMax/40, 0, width), i-1  );   
      }
    }
  }
  stroke(100);
  line(1,1,1,height);
  line(width-200,1,width-200,height);
  line(width-1,1,width-1,height);
  line(1,1,width,1);
  line(1,height-1,width,height-1);
  strokeWeight(2);
  
}

function grid(y) {
  if (y == true) {
    strokeWeight(0.5);
    stroke(150);
    for (var i = 1; i<9*2; i++) {
      line(width-200, .5*i*height/9, 0, .5*i*height/9);
    }
    for (var i = 1; i<9*5; i++) {
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
      if (situation==2  && this.y == 370 && (end2x !== this.x || end1x !== this.x)){ //mirror
        this.x =mouseX;
      }
      else{
        this.x = mouseX;
        this.y = mouseY;
      }
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
  return K;
}


function numCheck(){
  scan.length =0;
  end1x = paths[0][0].x;
  end1y = paths[0][0].y;
  end2x = paths[0][2].x;
  end2y = paths[0][2].y; 
  
  console.log("oldPathNum/2 +1: " + Math.floor(oldPathNum/2 +1 ));
  console.log("paths.length: " + paths.length);
  midx = paths[Math.floor(oldPathNum/2)][1].x;
  midy = paths[Math.floor(oldPathNum/2)][1].y;
 
  paths.length = 0;


  for (var i = 0; i<pathNumber; i++) {
    paths.push([]);
  } 
  for (var i = 0; i<3; i++) {
    for (var k = 0; k< pathNumber; k++){
      if (i == 0){ //start of path
          paths[k].push(new Node(end1x, end1y));
        }
        if (i == 2){ //end of path
          paths[k].push(new Node(end2x, end2y));
        }
        if (i==1){  //middle of path
          if (situation == 2){ //Mirror
            paths[k].push(new Node(midx - (.5*spacing/2)*(pathNumber-1)+ .5*spacing*k, 370));
          }
          else if (situation == 3){ //Grating
               paths[k].push(new Node( (.15*width - 50 + k*5 + (Math.floor(k/4))*5*spacing)    , 370));
               //paths[k].push(new Node( (.15*width - 50 + k*5 + (Math.floor(k/3))*4*spacing)    , 370));
          }
          else {
            paths[k].push(new Node(midx, midy - (spacing/2)*(pathNumber-1)+ spacing*k));
          }
        }
      }
   }
  
}

function mouseClicked() {
  if (mouseButton == LEFT) {
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
      // }
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

function getSituation() {
  var e = document.getElementById("scenarioMenu");
  situation = e.options[e.selectedIndex].value;
  resetPaths();
}

function getPathNum() {
  oldPathNum = pathNumber;
  var e = document.getElementById("sliderPos");
  console.log("oldPathNum: " + oldPathNum);
  console.log("pathNumber: " + pathNumber);
  pathNumber = e.options[e.selectedIndex].value;
  console.log("oldPathNum: " +oldPathNum);
  console.log("pathNumber: "+ pathNumber);
  numCheck();
}

function resetPaths(){
  scan.length = 0;
  paths.length = 0;
  for (var j = 0; j<pathNumber; j++) {
      paths.push([]);
  } 
  for (var i = 0; i<3; i++) {
    for (var k = 0; k< pathNumber; k++){
       if (situation==1){ //double slit
        if (i==0){ //start of path
          paths[k].push(new Node(map(i, 0, 2, 80, .75*width), height/2));
        }
        else if (i == 1){ //middle of path
          if (k%2 == 0){
            paths[k].push(new Node(map(i, 0, 2, 80, width-280), height/2 - (spacing/2)*(pathNumber-1)+ spacing*k - 70));
          }
          else { 
             paths[k].push(new Node(map(i, 0, 2, 80, width-280), height/2 - (spacing/2)*(pathNumber-1)+ spacing*k + 70));
          }
        }
        else if (i == 2){
          paths[k].push(new Node(map(i, 0, 2, 80, .75*width), height/2));
        }
      }

      else if (situation==2){ //mirror
        if (i==0){
          paths[k].push(new Node(map(i, 0, 2, 80, .75*width), height/2));
        }
        else if (i == 1){
           paths[k].push(new Node(.35*width - 35 + k*spacing, 370));
        }
        else if (i == 2){
         
          paths[k].push(new Node(map(i, 0, 2, 80, .75*width), height/2));
        }
      }

      else if (situation==3){ //grating
        if (i==0){
          paths[k].push(new Node(map(i, 0, 2, 80, .75*width), height/2));
        }
        else if (i == 1){
           paths[k].push(new Node( (.15*width - 50 + k*5 + (Math.floor(k/3))*4*spacing)    , 370));
        }
        else if (i == 2){
          paths[k].push(new Node(map(i, 0, 2, 40, .75*width), height/2));
        }
      }

      else { 
        if (i == 0 || i == 2){
          paths[k].push(new Node(map(i, 0, 2, 80, width-280), height/2));
        }
        else{
            paths[k].push(new Node(map(i, 0, 2, 80, width-280), height/2 - (spacing/2)*(pathNumber-1)+ spacing*k));
        }
      }
    }
  }
}

function getAction(){
  arrows =[]
  for (var q = 0; q<pathNumber; q++){
    var phase = calculateK(paths[q])/(Math.pow(1000,hBarSlider.value()/10));
    if (q==0){
      arrows.push(new actionArrow(width*.92, height/2, phase, arrowLen)  );
      startX = width*.92;
      startY = height/2;
      endX = arrows[0].x+arrowLen*cos(arrows[0].angle);
      endY = arrows[0].y+arrowLen*sin(arrows[0].angle)
    }
    else {
      arrows.push(new actionArrow( arrows[q-1].x+arrowLen*cos(arrows[q-1].angle), arrows[q-1].y+arrowLen*sin(arrows[q-1].angle), phase, arrowLen));
      arrows[q].angle = ( calculateK(paths[q]) )/(Math.pow(1000,hBarSlider.value()/10));
      a = arrows[q];
      endX = arrows[q].x + arrowLen*cos(arrows[q].angle);
      endY = arrows[q].y + arrowLen*sin(arrows[q].angle);
    }
  }
}


function takeScan(){
  var oX = paths[0][2].x;
  var oY = paths[0][2].y;
  scan = [];
  scanLineX = paths[0][2].x;
  scanLineY = paths[0][2].y;
  if (situation == 2 || situation ==3){ // for reflection or diffraction scan across top
    for (var i = 0; i<width; i++){     
      for (var j=0; j<pathNumber; j++){
        paths[j][2].x = i;
      }
      getAction();   
      scan.push(dist(startX, startY, endX, endY)*dist(startX, startY, endX, endY));
    } 
  }

  else {
    for (var i = 0; i<height; i++){     
      for (var j=0; j<pathNumber; j++){
        paths[j][2].y = i;
      }
      getAction();
      scan.push(dist(startX, startY, endX, endY)*dist(startX, startY, endX, endY));
    } 
  }

  scanMax=0;
  for (var i=scan.length; i--;) {
    scanMax+=scan[i];
  }
  
   for (var k = 0; k< pathNumber; k++){  
      if (typeof paths[k][2] != 'undefined'){
        paths[k][2].x = oX;
        paths[k][2].y = oY;
        paths[k][2].display();
      }
    }
}