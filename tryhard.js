//-------------------------------LOAD WINDOW-------------------------------
// Wait for the window to fully load before running the script
window.addEventListener("load", () => {
  // Load the face-api models
  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  ]).then(startVideo);
});

//-------------------------------SET UP-------------------------------
function startVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: {} })
    .then((stream) => (video.srcObject = stream))
    .catch((err) => console.error("Error accessing the camera: ", err));
}
const video = document.getElementById("video");
(randomizeMood);
//-------------------------------FILTERS-------------------------------

//-------------------------------ARTIST BOT-------------------------------
let sadArtist, happyArtist, angryArtist, misArtist, benArtist, impatientArtist;
let comment = document.getElementById("artist-comment");
let moodTimeout;
let mood; // Global variable to store the current mood

function preload() {
  //IMAGES FOR THE ARTIST EMOTIONS
  sadArtist = loadImage(
    "images/artist-sad.PNG",
    () => console.log("Sad image loaded."),
    () => console.error("Failed to load sad image.")
  );
  happyArtist = loadImage(
    "images/artist-happy.PNG",
    () => console.log("Happy image loaded."),
    () => console.error("Failed to load happy image.")
  );
  angryArtist = loadImage(
    "images/artist-angry.PNG",
    () => console.log("Angry image loaded."),
    () => console.error("Failed to load angry image.")
  );
  misArtist = loadImage(
    "images/artist-mis.PNG",
    () => console.log("Mischievous image loaded."),
    () => console.error("Failed to load mischievous image.")
  );
  benArtist = loadImage(
    "images/artist-ben.PNG",
    () => console.log("Benevolent image loaded."),
    () => console.error("Failed to load benevolent image.")
  );
  impatientArtist = loadImage(
    "images/artist-impatient.PNG",
    () => console.log("Impatient image loaded."),
    () => console.error("Failed to load impatient image.")
  );
}

const videoElement = document.getElementById("video");

//-------------------------------FACE API-------------------------------

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  const videoContainer = document.getElementById("video-container");
  videoContainer.append(canvas); // Append canvas inside video container

  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    if (detections.length > 0) {
      const emotions = detections[0].expressions;
      const maxEmotion = Object.keys(emotions).reduce((a, b) =>
        emotions[a] > emotions[b] ? a : b
      );

      // Randomize mood and get the mode
      randomizeMood(); // Call randomizeMood here
      const mode = mood; // Use the mood set by randomizeMood

      // Function to generate art based on emotion and mode
      generateArt(maxEmotion, mode);

    }
  }, 100);
});


//-------------------------------ART GENERATION BASED ON USER MOOD-------------------------------

function randomizeMood() {
  let randomizedMood = Math.floor(Math.random() * 15); 

//set mood based on the randomized number
  if (randomizedMood <= 2) {
      mood = "bene";
  } else if (randomizedMood <= 5) {
      mood = "misc";
  } else if (randomizedMood <= 8) {
      mood = "normal";
  } 
  }

// Function to generate art based on emotion and mode
function generateArt(emotion, mode) {
  if (mode === "bene") {
    switch (emotion) {
      case "happy":
        drawHappyGoodArt();
        break;
      case "sad":
        drawSadGoodArt();
        break;
      case "angry":
        drawAngryGoodArt();
        break;
      // Add more cases for other emotions
    }
  } else if (mode === "misc") {
    switch (emotion) {
      case "happy":
        drawHappyBadArt();
        break;
      case "sad":
        drawSadBadArt();
        break;
      case "angry":
        drawAngryBadArt();
        break;
      // Add more cases for other emotions
    }
  } else if (mode === "normal") {
    switch (emotion) {
      case "happy":
        drawHappyNeutralArt();
        break;
      case "sad":
        drawSadNeutralArt();
        break;
      case "angry":
        drawAngryNeutralArt();
        break;
    }
  }
}

//-------------------------------NORMAL ART-------------------------------
// Placeholder functions for neutral art generation
function drawHappyNeutralArt() {
  console.log("Drawing normal happy art");
  document.getElementById("happy-image").style.display = "block";
}

function drawSadNeutralArt() {
  console.log("Drawing normal sad art");
  document.getElementById("sad-image").style.display = "block";
}

function drawAngryNeutralArt() {
  console.log("Drawing normal angry art");
  document.getElementById("angry-image").style.display = "block"; 
}

//-------------------------------BENE ART-------------------------------
// Placeholder functions to draw the specific art based on emotion and mode
function drawHappyGoodArt() {
  console.log("Drawing happy art in bene mode");
  document.getElementById("happy-image").style.display = "block";
}

function drawSadGoodArt() {
  console.log("Drawing sad art in bene mode");
  document.getElementById("sad-image").style.display = "block";
}


function drawAngryGoodArt() {
  console.log("Drawing angry art in bene mode");
  document.getElementById("angry-image").style.display = "block";
}

//-------------------------------MISC ART-------------------------------
function drawHappyBadArt() {
  console.log("Drawing happy art in misc mode");
  document.getElementById("happy-image").style.display = "block";
}

function drawSadBadArt() {
  console.log("Drawing sad art in misc mode");
  document.getElementById("sad-image").style.display = "block";
}

function drawAngryBadArt() {
  console.log("Drawing angry art in misc mode");
  document.getElementById("mischievous-image").style.display = "block";
}
