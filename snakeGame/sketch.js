let snake, food;
let eaten = false;

function setup() {
  createCanvas(300, 300);
  noStroke();
  snake = new Snake();
  food = new Food();
  
  setInterval(()=>{snake.cont()}, 500);
}

function draw() {
  background(150);
  snake.show();
  food.show();
  
  if((snake.x <= 0 || snake.x + snake.xLen >= 300)
    || (snake.y <= 0 || snake.y + snake.yLen >= 300)){
      snake.collided();
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
    fill(200);
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
    ellipse(this.x, this.y, 10,10);
    noLoop();
  }
}

function Food(){
  this.show = function(){
    fill(100);
    rect(this.x, this.y, 10,10);
  }
  this.randomize = function(){
    this.x = random(20,280);
    this.y = random(20,280);
    this.vertices = [[this.x, this.y], [this.x+10, this.y], [this.x, this.y+10], [this.x+10, this.y+10]];
  }
  this.randomize();
}