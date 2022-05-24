let video, features, knn;

/* For Car */
// Variables for sizes:
let carWidth = 50, carHeight = 75, carX = 250, carY = 380;

// Variables for Logic
let recordsNum = 0;
let platform, car, obs; // Objects
let carImg, truckImg01, truckImg02, truckImg03, pedestImg01, pedestImg02, bikeImg01, treeImg01, explosion, bushImg; //  Images
let dist = -100;  //  Where the platform blocks will start
let millage = 0;  //  Increasing with dist

// Variables for Recognition
let classifier; 
//let audioResult = '';
// let video, features, knn;
let userModel = true;
let resArr = ['Background Noise', 'Up', 'Down', 'Left',  'Right'];

/* For Snake */
let snake, food;

// Video recognition
features = ml5.featureExtractor('MobileNet', ()=>console.log("model is ready"));
knn = ml5.KNNClassifier();

function startTraining(){
    video = createCapture(VIDEO);
    video.size(900,450);
    [...document.querySelectorAll('.header button')].forEach(btn=>{
        btn.style.display = 'none';
    })
    document.querySelector('.trainingBtns').style.display = 'flex';
    document.querySelectorAll('.trainingBtns button')
      .forEach(element => element.addEventListener('click', (e)=>{
        record(e.target.innerHTML);
      }));
  
    document.querySelector('.startCar').addEventListener('click', (e)=>{
      //knn.save('model.json');

        document.querySelector('.startBtns').style.display = 'none';
        document.querySelector('.trainingBtns').style.display = 'none';
      startCarGame();
    })
  
    document.querySelector('.startSnake').addEventListener('click', (e)=>{
      //knn.save('model.json');
        document.querySelector('.startBtns').style.display = 'none';
        document.querySelector('.trainingBtns').style.display = 'none';
      startSnakeGame();
    })
  }

  function record(label){
    //Wait for 2 seconds -> record every 0.1 sec for 3 sec.
    setTimeout(() => {
      let t = setInterval(()=>{
        const logits = features.infer(video);
        knn.addExample(logits, label);
        document.getElementById('recordCount').innerHTML = "Recording for " + label;
        console.log('added for', label);
      }, 100);
      setTimeout(() => {
        clearInterval(t);
      }, 3000);
    }, 2000);
  }





  
function draw() {

    if(car){
        background(200);

      //  Either side of the platform
      fill('#72CC50');
      rect(0,0,100,500);
      rect(400,0,100,500);
      
      //  Objects to move.
      platform.move();
      car.build();
      obs.build();
    
      //  Enabling ontinuous keys:
      //  keyPressed();
    
      //  Gameplay
      if(car.pos.x < 110 || car.pos.x > (390-carWidth)){
        // Hitting the Platforms
       car.collided();
      }else if((obs.obsRy >= carY && obs.obsRy <= carY + carHeight) || (obs.obsRy + obs.obsRh >= carY && obs.obsRy+obs.obsRh <= carY + carHeight)){
        // Hitting the obstacles
        if(obs.collision(car.pos.x+5, car.pos.x+45)){
          // 5 is to compensate for the png's padding.
          car.collided();
        }
      }
      //  Shows millage
      textSize(20);
      text((millage*0.01).toFixed(1),5,70);

    } else if(snake){
        background(50);

        snake.show();
        food.show();
        
        if((snake.x <= 0 || snake.x + snake.xLen >= 300)
          || (snake.y <= 0 || snake.y + snake.yLen >= 300)){
            snake.collided();
          }
    }
}

  
// Video Recognition
function classifyVideo(){
    const logits = features.infer(video);
    knn.classify(logits, gotResults);
}

function gotResults(err,res){
if(err) console.error(err);
else{
    console.log(res.label);
    if(userModel){
        if(car) driveByVideo(res.label);
        else contByVideo(res.label);
    }else{
        if(car) driveByVideo(resArr[res.label]);
        else contByVideo(resArr[res.label]);
    }
    classifyVideo();
}
}

function useModel(gameName){
    video = createCapture(VIDEO);
    video.size(900,450);
    userModel = false;
    knn.load("model.json", function() {
          console.log('model is loaded');
          if(gameName === 'car')startCarGame();
            else if(gameName === 'snake')startSnakeGame();
  })  
  }

  function keyPressed(){
    if(car){
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
          }
    } else {
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
    
  }