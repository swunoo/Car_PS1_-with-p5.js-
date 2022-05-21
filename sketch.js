
// Variables for sizes:
let carWidth = 50, carHeight = 75, carX = 250, carY = 380;

// Variables for Logic

let game = false, recordsNum = 0;
let platform, car, obs; // Objects
let carImg, truckImg01, truckImg02, truckImg03, pedestImg01, pedestImg02, bikeImg01, treeImg01, explosion, bushImg; //  Images
let dist = -100;  //  Where the platform blocks will start
let millage = 0;  //  Increasing with dist

// Variables for Recognition
let classifier; 
//let audioResult = '';
let video, features, knn;

function preload(){
  // Pre-loading images
  carImg = loadImage('images/CarOptions/car03.png');
  truckImg01 = loadImage('images/Obstacles/t01.png');
  truckImg02 = loadImage('images/Obstacles/t02.png');
  truckImg03 = loadImage('images/Obstacles/t03.png');
  pedestImg01 = loadImage('images/Obstacles/p01.png');
  bikeImg01 = loadImage('images/Obstacles/b01.png');
  explosionImg = loadImage('images/damage.png');
  bushImg = loadImage('images/Obstacles/others/o01.png');
  // Audio Recognition
  // classifier = ml5.soundClassifier('https://teachablemachine.withgoogle.com/models/-73qW3w-_/model.json');

  // Image Recognition
  //classifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/llp0Pt4jj/model.json');
}

function startGame(){
  video.hide();
  document.querySelector('.trainingBtns').style.display = 'none';
  document.querySelector('.start').style.display = 'none';
  document.querySelector('main').style.display = 'block';
  noStroke();
  platform = new Platform();
  car = new Car();
  obs = new Obs();

  game = true;
  classifyVideo();
}

function startTraining(){
  video = createCapture(VIDEO);
  video.size(900,450);
  document.querySelector('.header button').style.display = 'none';
  document.querySelector('.trainingBtns').style.display = 'flex';
  document.querySelectorAll('.trainingBtns button')
    .forEach(element => element.addEventListener('click', (e)=>{
      record(e.target.innerHTML);
    }));

  document.querySelector('.start').addEventListener('click', (e)=>{
    startGame();
  })
}



function setup() {
  createCanvas(500, 500);

  // Audio recognition
  //classifyAudio();

  // Video recognition
  
  features = ml5.featureExtractor('MobileNet', ()=>console.log("ready"));
  knn = ml5.KNNClassifier();
  // classifyVideo();

}

function record(label){
  recordsNum++;
  //Wait for 2 seconds -> record every 0.1 sec for 3 sec.
  setTimeout(() => {
    let t = setInterval(()=>{
      const logits = features.infer(video);
      knn.addExample(logits, label);
      console.log('added for', label);
    }, 100);
    setTimeout(() => {
      clearInterval(t);
    }, 3000);
  }, 2000);
  if(recordsNum >= 4)document.querySelector('.start').style.display = 'block';
}

function draw() {
  
  if(game){
    background(200);
    //image(video,0,0);
    //video.hide();
    
    //Either side of the platform
    fill(150);
    rect(0,0,100,500);
    rect(400,0,100,500);
    
    //Platform
    platform.move();
    
    //Player's Car
    car.build();
    
    //Obstacles
    obs.build();
  
    //To enable continuous keys:
    keyPressed();
  
    //Gameplay
    if(car.pos.x < 110 || car.pos.x > (390-carWidth)){
      // Hitting the Platforms
     collided();
    }else if((obs.obsRy >= carY && obs.obsRy <= carY + carHeight) || (obs.obsRy + obs.obsRh >= carY && obs.obsRy+obs.obsRh <= carY + carHeight)){
      // Hitting the obstacles
      if(obs.collision(car.pos.x+5, car.pos.x+45)){
        // 5 to compensate for the png's padding.
        collided();
      }
    }
    //Shows millage
    textSize(20);
    text((millage*0.01).toFixed(1),5,70);
    //console.log(millage);
  
  }

  
}


function collided(){
  // fill(0);
  // ellipse(car.pos.x, car.pos.y, 30,30);
  
  playAudio('explosion01');
  image(explosionImg, car.pos.x, car.pos.y, carHeight, carHeight);
  //game = false;
  //noLoop();
}

function keyPressed(){
  if (keyCode === LEFT_ARROW && keyIsPressed){
    car.move(-5);
  } else if (keyCode === RIGHT_ARROW && keyIsPressed){
    car.move(5);
  }else if (keyCode === UP_ARROW && keyIsPressed){
    playAudio('accel');
    platform.speed += 0.1;
  }else if (keyCode === DOWN_ARROW && keyIsPressed){
    playAudio('decel');
    platform.speed -= 0.1;
  } else{
    return;
  }
}
function Car(){
  this.pos = createVector(carX,carY);
  
  this.build = function(){
    if(this.pos.x<=0 || this.pos.x>=width)this.pos.x = carX;
    
    image(carImg, this.pos.x, this.pos.y, carWidth, carHeight);
  }
  
  // For moving on the x-axis.
  this.move = function(mag){
      this.pos.x += mag;
  }
}

function Platform(){
  this.colorArr = [255,10];
  this. speed = 0;
  
  this.move = function(){
    for(let i = 0; i<20; i++){
      // Platform blocks
      fill(this.colorArr[i%2]);
      rect(100,i*30 + dist,10,30);
      rect(390,i*30 + dist,10,30);
      fill(255);
      rect(247,i*30 + dist,6,15);
      millage += (this.speed*0.1);

      // if(i%5 === 0){
      //   image(bushImg,100, i*30+dist,30,30)
      //   image(bushImg,300, i*30+dist,30,30)
      // }
    }
    if(dist > 0){
      dist = -120;
      // Kinda a 'magic number', maybe it is related to max_i being 20. 
      // Change it if you'd like to see why.
    }
    else if(dist <= 0){
      dist += this.speed;
    }
  }
}

function Obs () {
  
  this.offset = 0; // To build newObs based on millage.

  // Sees if any collision occured.
  this.collision = function(x1, x2){
    return (this.obsRx <= x1 && x1 <= this.obsRx+this.obsRw) || (this.obsRx <= x2 && x2 <= this.obsRx+this.obsRw);
}
  // Obstacles. Simple change the inner arrays for different images. Format is: ['imageVar', 'width', 'height'].
  this.obsArr = [
    [truckImg01,35,80], [truckImg02,40,100], [truckImg03,50,120], [pedestImg01,20,30], [bikeImg01,30,60]];
  
  
  this.newObs = function () {
      this.obsRx = random(110,360); 
      index = Math.floor(random(0,5));
      this.randObs = this.obsArr[index][0];
      this.obsRw = this.obsArr[index][1];
      this.obsRh = this.obsArr[index][2];
      this.offset = -millage;
      this.randSpeed = random(1,10); // Not working yet.
  }
  this.newObs(); // Calling once initialized.
  
  this.build = function () {
    this.obsRy = millage + this.offset; // 'Moves' the obstacle based on millage.
    if(this.obsRy >= 500){
      // If it went off-screen, a newObs is built.
      this.newObs();
    }else{
      image(this.randObs,this.obsRx, this.obsRy, this.obsRw, this.obsRh);
    }
  }
}

/* 
// Audio Recognition stuffs
function classifyAudio(){
  classifier.classify((err,res)=>{
    if(err){
      console.log(err);
    }else{
        audioResult = res[0].label;// The most-confident 'transcript'
        //console.log(audioResult);
        driveByAudio();
    }
  });
}

function driveByAudio(){
  //console.log(audioResult);
  if(audioResult === 'Up'){
    platform.speed += 1;
  }else if(audioResult === 'Down'){
    platform.speed -= 1;
  }else if(audioResult === 'Left'){
    car.move(-10);
  }else if(audioResult === 'Right'){
    car.move(10);
  }else{
    return;
  }
}
*/

// Video Stuff
function classifyVideo(){
  const logits = features.infer(video);
  knn.classify(logits, gotResults);
}
function gotResults(err,res){
  if(err) console.error(err);
  else{
    console.log(res.label);
   if(game){
     driveByVideo(res.label);
     classifyVideo();}
  }
}
function driveByVideo(videoRes){
  if(videoRes === 'Up'){
    platform.speed += 1;
  }else if(videoRes === 'Down'){
    platform.speed -= 1;
  }else if(videoRes === 'Left'){
    car.move(10); //Mirrored
  }else if(videoRes === 'Right'){
    car.move(-10); //Mirrored
  }else{
    return;
  }
}