

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/vF-sPGy3/";

let model, webcam, labelContainer, maxPredictions;
let predictionArray = [[], [], [], []];
let recording = false;

let confidenceBars = document.getElementsByClassName('confidencebar');

function classify(){
    recording = true;
    predictionArray = [[], [], [], []];

    setTimeout(()=>{
        recording = false;
        let finalPredictions = [0, 0, 0, 0]

        for(let i = 0; i < predictionArray.length; i++){
            for(let j = 0; j < predictionArray[i].length; j++){
                finalPredictions[i] += predictionArray[i][j];
            }
        }

        let maxIndex = -1;
        let maxValue = -1;
        for(let i = 0; i<finalPredictions.length; i++){
            if(maxValue < finalPredictions[i]){
                maxIndex = i;
                maxValue = finalPredictions[i]
            }
        }

        manageBins(maxIndex);
    }, 2000);


    setTimeout(()=>{
        closeBins();
    }, 4000)



}

function manageBins(index){
    let bintopsimages = document.getElementsByClassName('bintoppic');
    
    if(bintopsimages[index].classList.contains('closingbin')){
      bintopsimages[index].classList.remove('closingbin')
    }
    bintopsimages[index].classList.add('openingbin');
}

function closeBins(){
    let bintopsimages = document.getElementsByClassName('bintoppic');

    for(let i = 0; i<bintopsimages.length; i++){
        if(bintopsimages[i].classList.contains('openingbin')){
            bintopsimages[i].classList.remove('openingbin');
            bintopsimages[i].classList.add('closingbin');
        }
    }
}

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const flip = true; // whether to flip the webcam
  webcam = new tmImage.Webcam(400, 400, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append elements to the DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas);

  /*
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement("div"));
  }
  */
}

async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    //labelContainer.childNodes[i].innerHTML = classPrediction;

    let confidence = parseFloat(prediction[i].probability.toFixed(2));
    let newWidth = Math.max(confidence*400, 70)

    confidenceBars[i].style.width = newWidth+"px";

    if(recording){
        predictionArray[i].push(parseFloat(prediction[i].probability.toFixed(2)));
    }
  }
}

let rbtn = document.getElementById('recordbutton');
rbtn.click();
rbtn.style.display = 'None';