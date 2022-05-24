let snake, food, explo;
let knn, features, video;

let resArr = ['Background Noise', 'Up', 'Down', 'Left',  'Right'];

function preload(){
  explo = loadImage('damage.png');
}

function setup() {
  createCanvas(300, 300);
  noStroke();

    // Video recognition
    features = ml5.featureExtractor('MobileNet', ()=>console.log("model is ready"));
    knn = ml5.KNNClassifier();
  
}

function draw() {
  if(!snake) return;
  
  background(50);
  snake.show();
  food.show();
  
  if((snake.x <= 0 || snake.x + snake.xLen >= 300)
    || (snake.y <= 0 || snake.y + snake.yLen >= 300)){
      snake.collided();
    }
}

function startGame(){
  video.hide();

  snake = new Snake();
  food = new Food();
  setInterval(()=>{snake.cont()}, 500);

  classifyVideo();
}

// Video Recognition
function useModel(){
  video = createCapture(VIDEO);
  video.size(900,450);
  knn.load("model.json", function() {
        console.log('model is loaded');
        startGame();
})  
}

function classifyVideo(){
  const logits = features.infer(video);
  knn.classify(logits,gotResults);
}
function gotResults(err,res){
  if(err) console.error(err);
  else{
  contByVideo(resArr[res.label]);
  classifyVideo();
    }
  }

function contByVideo(videoRes){
  // Basically the same config from keyPressed.
  // Left and Right are mirrored.
  console.log(videoRes);
  if(snake.turning) return;
  if(videoRes === 'Up'){
    if(!snake.xAxis){
      snake.dir = -10;
    } else {
      snake.posChangeY = -10;
      turnSnakeX();
    }
  }else if(videoRes === 'Down'){
    if(!snake.xAxis){
      snake.dir = 10;
    } else {
      turnSnakeX();
    }
  }else if(videoRes === 'Right'){
    if(snake.xAxis) snake.dir = -10;
    else{
      snake.posChangeX = -10;
      turnSnakeY();
    }
  }else if(videoRes === 'Left'){
    if(snake.xAxis) snake.dir = 10;
    else{
      turnSnakeY();
    }
  }else{
    return;
  }
}


function keyPressed(){
  if (keyCode === LEFT_ARROW){
      if(snake.xAxis) snake.dir = -10;
      else{
        snake.posChangeX = -10;
        turnSnakeY();
      }
  } else if (keyCode === RIGHT_ARROW){
      if(snake.xAxis) snake.dir = 10;
      else{
        turnSnakeY();
      }
  } else if (keyCode === UP_ARROW){
      if(!snake.xAxis){
        snake.dir = -10;
      } else {
        snake.posChangeY = -10;
        turnSnakeX();
      }
  } else if (keyCode === DOWN_ARROW){
      if(!snake.xAxis){
        snake.dir = 10;
      } else {
        turnSnakeX();
      }
  }
}

function turnSnakeX(){
    // this.posChangeY/X account for the change in "y/x".
    // this.lenChange is pretty much universal.
    if(snake.dir > 0){
        snake.turnX = snake.x + snake.xLen - 10;
        snake.posChangeX = 10;
    }else{
        snake.turnX = snake.x;
        snake.posChangeX = 0;
    }
    snake.turnY = snake.y + snake.posChangeY;
    snake.turnLenX = 10;
    snake.lenChange = 10;
    snake.turnPt = false; // From axisX = false, else true.
    snake.turning = true;
}

function turnSnakeY(){
    if(snake.dir < 0){
        snake.turnY = snake.y;
        snake.posChangeY = 0;
    }else{
        snake.turnY = snake.y + snake.yLen - 10;
        snake.posChangeY = 10;
    }
    snake.turnX = snake.x + snake.posChangeX;
    snake.turnLenY = 10;
    snake.lenChange = 10;
    snake.turnPt = true;
    snake.turning = true;
} 

function Snake(){

//  Main variables
  this.x = random(100,200);
  this.y = random(100,200);
  this.xLen = 50;
  this.yLen = 10;

//  Turning
    this.turnX = 0;
    this.turnY = 0;
    this.turnLenX = 10;
    this.turnLenY = 10;
    this.lenChange = 10;
    this.posChangeY = 0;
    this.posChangeX = 0;
    this.turnPt;

//  Speed and direction
  this.xAxis = true;
  this.dir = 10;
  this.turning = false;
  
  
  this.show = function(){
    fill('#32cd32');
    rect(this.x, this.y, this.xLen, this.yLen);
    if(this.turning) {
      rect(this.turnX,this.turnY,this.turnLenX,this.turnLenY);
    }
  }
  this.cont = function(){
    this.checkForPts();
    if(this.turning) this.rotate();
      else if(this.xAxis) this.x += this.dir;
        else this.y += this.dir;
  }
  this.rotate = function(){
    if(!this.turnPt){
        this.turnY += this.posChangeY;
        this.turnLenY += this.lenChange;  

        this.x += this.posChangeX;
        this.xLen -= 10;
        if(this.xLen <= 10){
            this.y = this.turnY;
            this.yLen = this.turnLenY;
            this.dir = this.posChangeY? -10 : 10;

            snake.posChangeX = 0;
            snake.posChangeY = 0;
            this.xAxis = false;
            this.turning = false;
        }
    } else {
        this.turnX += this.posChangeX;
        this.turnLenX += this.lenChange;  

        this.y += this.posChangeY;
        this.yLen -= 10;
        if(this.yLen <= 10){
            this.x = this.turnX;
            this.xLen = this.turnLenX;
            this.dir = this.posChangeX? -10 : 10;

            snake.posChangeX = 0;
            snake.posChangeY = 0;
            this.xAxis = true;
            this.turning = false;
        }
      }
  }
  this.checkForPts = function(){
      for(let i = 0; i<4; i++){
        if((food.vertices[i][0] >= snake.x && food.vertices[i][0] <= snake.x + snake.xLen) && (food.vertices[i][1] >= snake.y && food.vertices[i][1] <= snake.y + snake.yLen)){
          snake.grow();
          food.randomize();
          console.log('met');
          return;
        }
      }
    }
  this.grow = function(){
    console.log("growing")
    if(this.xAxis) this.xLen+=10;
      else this.yLen+=10;
  }
  this.collided = function(){
    fill(255);
    image(explo, this.x, this.y, 50, 50);
    noLoop();
  }
}

function Food(){
  this.show = function(){
    fill('#d3f150');
    ellipse(this.x, this.y, 10,10);
  }
  this.randomize = function(){
    this.x = random(20,280);
    this.y = random(20,280);
    this.vertices = [[this.x+5, this.y], [this.x, this.y+5], [this.x-5, this.y], [this.x, this.y-5]];
  }
  this.randomize();
}