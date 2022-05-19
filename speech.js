/* P5.SPEECH */

// function setup(){
//     noCanvas();
//     let lang = navigator.language || 'en-US';
//     let speechRec = new p5.SpeechRec(lang, gotSpeech);
//     let continuous = false;
//     let interim = true;
//     speechRec.start(continuous, interim);

//     function gotSpeech(){
//         //console.log(speechRec);
//         console.log(speechRec.resultString);
//     }
// }


/* WEB SPEECH API */

// window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// const recognition = new window.SpeechRecognition();
// recognition.interimResults = true;
// recognition.continuous = false;

// recognition.addEventListener('result',e=>{
//     console.log(e.results[0][0].transcript);

//     if(e.results[0].isFinal){
//         console.log('');
//     }
// })

// recognition.addEventListener('end', ()=>{
//     recognition.start();
// })

// recognition.start();


/* TEACHABLE MACHINE */
let classifier;
let results = 'a';

function preload(){
    classifier = ml5.soundClassifier('https://teachablemachine.withgoogle.com/models/-73qW3w-_/model.json');
}

function setup(){
    createCanvas(300,300);
    classifyAudio();
}

function draw(){
    background(100);
    // console.log(results);
}

function classifyAudio(){
    classifier.classify(gotResults);
}

function gotResults(err,res){
    if(res !== results){
        results = res;
    }
   console.log(results[0].label);
}
