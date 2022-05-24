
//  Note: innerHTML of the trainingBtns will be the label for which they train.

/*  
    Constructor Arguments
        trainingBtns = // A node list of buttons to click while training.
        startBtn = // A button to start the game.

        function startGame(){
            // Shows game screen and stuffs.
        }

        function applyGesture(videoRes){
            if(videoRes === 'Left'){
                // Go Left
            }else if(videoRes === 'Right'){
                // Go Right
            }else{
                return;
            }
        }
    Setter Arguments (Optional)
        time = // time to record.
        interval = // record an image in how many ms.
        delay = // wait how many ms before starting to record.
*/
// createCapture(VIDEO);

class ModelTraining{
    constructor(trainingBtns, startBtn, startingFunc, applyGesture){

        // Recognition stuffs
        this.video, this.knn, this.features;
        this.recordingTime = 3000;
        this.recordingInterval = 100;
        this.waitingTime = 2000;

        // Dom Elements
        this.trainingBtns = trainingBtns;
        this.startBtn = startBtn;

        // Functions
        this.startingFunc = startingFunc;
        this.applyGesture = applyGesture;

        // Initiating
        this.features = ml5.featureExtractor('MobileNet', ()=>console.log("model is ready"));
        this.knn = ml5.KNNClassifier();
    }
    setRecording(time, interval, delay){
        this.recordingTime = time;
        this.recordingInterval = interval;
        this.waitingTime = delay;
    }
    initiateTraining(){
        this.video = createCapture(VIDEO);
        this.video.size(900,450);
        this.trainingBtns.forEach(element => element.addEventListener('click', (e)=>{
            this.record(e.target.innerHTML);
          }));
      
        this.startBtn.addEventListener('click', (e)=>{
          //knn.save('model.json'); // uncomment to save the model.
          this.video.hide();
          this.classifyVideo();

          this.startingFunc();
          this.applyGesture();
        })
    }

    record(label){
        //Wait for 2 seconds -> record every 0.1 sec for 3 sec.
        setTimeout(() => {
            let t = setInterval(()=>{
            const logits = this.features.infer(this.video);
            this.knn.addExample(logits, label);
            console.log('added for', label);
            }, this.recordingInterval);
            setTimeout(() => {
            clearInterval(t);
            }, this.recordingTime);
        }, this.waitingTime);
    }

    // Video Recognition
    classifyVideo(){
        const logits = this.features.infer(this.video);
        this.knn.classify(logits,this.gotResults);
    }
    gotResults(err,res){
        if(err) console.error(err);
        else{
        console.log(res.label);

        this.classifyVideo();}
        }
}