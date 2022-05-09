
const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const demosSection = document.getElementById('demos');
const enableWebcamButton = document.getElementById('webcamButton');

const img = document.getElementById('img');
const predElem = document.getElementById('prediction');

// Check if webcam access is supported.
function getUserMediaSupported() {
    return !!(navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia);
}

// If webcam supported, add event listener to button for when user
// wants to activate it to call enableCam function which we will 
// define in the next step.
if (getUserMediaSupported()) {
enableWebcamButton.addEventListener('click', enableCam);
} else {
console.warn('getUserMedia() is not supported by your browser');
}

// Enable the live webcam view and start classification.
function enableCam(event) {
    // Only continue if the model has finished loading.
    if (!model) {
      return;
    }
    
    // Hide the button once clicked.
    //event.target.classList.add('removed');  
    event.target.style.display='none'; 
    
    // getUsermedia parameters to force video but not audio.
    const constraints = {
      video: true
    };
  
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      video.srcObject = stream;
      video.addEventListener('loadeddata', predictWebcam);
    });
}

// Store the resulting model in the global scope of our app.
var model = undefined;

// Before we can use the model we must wait for it to finish
// loading. Machine Learning models can be large and take a moment 
// to get everything needed to run.
mobilenet.load().then(async function (loadedModel) {
  model = loadedModel;
  predElem.innerText = "Modelo carregado";

  // Show demo section now model is ready to use.
  demosSection.classList.remove('invisible');
});




var children = [];

function predictWebcam() {
  // Now let's start classifying a frame in the stream.
  model.classify(video).then(function (predictions) {

    //console.log('Predictions: ', predictions); // <<<<<<<<<<<<<<<<<<<<<
    let className = predictions[0].className;
    let probability = (predictions[0].probability*100);
    if (probability > 40) {
      //predElem.innerText = `Parece que estou a reconhecer uma ${className}!`;
      predElem.innerText = `Parece que estou a reconhecer: ${className}, com probabilidade de ${probability.toFixed(0)}%`;
    } else {
        predElem.innerText = `Lamento, mas não estou a reconhecer nenhum objeto...`;
        //predElem.innerText = `talvez uma : ${className}, with ${probability.toFixed(0)}% probability`;
    }    

    // Call this function again to keep predicting when the browser is ready.
    window.requestAnimationFrame(predictWebcam);
  });
}



