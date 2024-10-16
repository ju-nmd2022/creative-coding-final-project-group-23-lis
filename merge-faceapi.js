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
  randomizeMood();
}
const video = document.getElementById("video");

//-------------------------------ARTIST BOT-------------------------------
let sadArtist, happyArtist, angryArtist, misArtist, benArtist, impatientArtist;
let mood = "happy";
let comment = document.getElementById("artist-comment");
let moodTimeout;
let headFilterArray = [];
let browsFilterArray = [];
let eyesFilterArray = [];
let noseFilterArray = [];
let lipFilterArray = [];
let filtersShowing = [];

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

//RANDOMIZE ARTISTS MOOD
function randomizeMood() {
  let randomizedMood = Math.floor(Math.random() * 15);

  //SET MOOD BASED ON RANDOM NUMBER
  if (randomizedMood <= 2) {
    mood = "sad";
  } else if (randomizedMood <= 5) {
    mood = "angry";
  } else if (randomizedMood <= 8) {
    mood = "mischievous";
  } else if (randomizedMood <= 11) {
    mood = "benevolent";
  } else {
    mood = "happy";
  }

  updateMoodImages();

  //ARTIST GETS IMPATIENT AFTER 20S IF NOTHING TRIGGERS AN EMOTION
  moodTimeout = setTimeout(() => {
    transitionToImpatient();
  }, 20000);
}

//used the help och ChatGPT to get this impatient part to work
function transitionToImpatient() {
  mood = "impatient";
  updateMoodImages();

  //refresh the mood again after being impatient for 10 seconds
  moodTimeout = setTimeout(() => {
    randomizeMood();
  }, 10000);
}

//hide or display images and text based on the current mood
function updateMoodImages() {
  document.getElementById("sad-image").style.display = "none";
  document.getElementById("angry-image").style.display = "none";
  document.getElementById("mischievous-image").style.display = "none";
  document.getElementById("benevolent-image").style.display = "none";
  document.getElementById("happy-image").style.display = "none";
  document.getElementById("impatient-image").style.display = "none";

  //update the displayed image and comment based on the current mood
  //images from the array are cleared and then randomized with very mood
  if (mood === "sad") {
    document.getElementById("sad-image").style.display = "block";
    comment.innerHTML = "Oh... I guess I could paint you blue :(";
    filtersShowing = [];
    filterObject();
  } else if (mood === "angry") {
    document.getElementById("angry-image").style.display = "block";
    comment.innerHTML =
      "AARRGH!!! Here you go stupid, I'll paint you in red >:(";
    filtersShowing = [];
    filterObject();
  } else if (mood === "mischievous") {
    document.getElementById("mischievous-image").style.display = "block";
    comment.innerHTML =
      "Look at you! Ridicolous. This is how you look, haha! >:)";
    filtersShowing = [];
    filterObject();
  } else if (mood === "benevolent") {
    document.getElementById("benevolent-image").style.display = "block";
    comment.innerHTML =
      "Aww, you look lovely today, let's make you look even cuter! :)";
    filtersShowing = [];
    filterObject();
  } else if (mood === "happy") {
    document.getElementById("happy-image").style.display = "block";
    comment.innerHTML = "Ah look, I can paint you in a lovely yellow shade :D";
    filtersShowing = [];
    filterObject();
  } else if (mood === "impatient") {
    document.getElementById("impatient-image").style.display = "block";
    comment.innerHTML =
      "I'm a little impatient, and this is boring. If you don't do something interesting soon, my mood will change.";
  }
}
function filterObject() {
  filtersShowing = [];

  let randomHead =
    headFilterArray[Math.floor(Math.random() * headFilterArray.length)];
  let randomBrows =
    browsFilterArray[Math.floor(Math.random() * browsFilterArray.length)];
  let randomEyes =
    eyesFilterArray[Math.floor(Math.random() * eyesFilterArray.length)];
  let randomNose =
    noseFilterArray[Math.floor(Math.random() * noseFilterArray.length)];
  let randomLips =
    lipFilterArray[Math.floor(Math.random() * lipFilterArray.length)];

  filtersShowing.push(
    randomHead,
    randomBrows,
    randomEyes,
    randomNose,
    randomLips
  );
}

//-------------------------------FACE API-------------------------------

//happy eyes
const eyeNormal = new Image();
eyeNormal.src = "images/eye-normal.PNG";
const eyeRound = new Image();
eyeRound.src = "images/eye-round.PNG";
const eyeSmile = new Image();
eyeSmile.src = "images/eye-smile.PNG";
happyEyesArray = [eyeNormal, eyeRound, eyeSmile];

// Happy images
const eyeImage = new Image();
eyeImage.src = "images/eye-round.png"; // Path to your image for the eyes
const noseImage = new Image();
noseImage.src = "images/nose-wings.png"; // Path to your image for the nose
const mouthImage = new Image();
mouthImage.src = "images/lip-bite.png"; // Path to your image for the mouth

// Sad images
const sadEyeImage = new Image();
sadEyeImage.src = "images/eye-shiny.png"; // Path to your sad image for the eyes
const sadNoseImage = new Image();
sadNoseImage.src = "images/nose-pig.png"; // Path to your sad image for the nose
const sadMouthImage = new Image();
sadMouthImage.src = "images/lip-crooked.png"; // Path to your sad image for the mouth

// Angry images
const angryEyeImage = new Image();
angryEyeImage.src = "images/eye-mad.png"; // Path to your angry image for the eyes
const angryNoseImage = new Image();
angryNoseImage.src = "images/nose-septum.png"; // Path to your angry image for the nose
const angryMouthImage = new Image();
angryMouthImage.src = "images/lip-open.png"; // Path to your angry image for the mouth

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  const videoContainer = document.getElementById("video-container");
  videoContainer.append(canvas); // Append canvas inside video container
  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  const canvasCtx = canvas.getContext("2d");

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    // Overlay image on top of the eyes
    if (resizedDetections.length > 0) {
      const landmarks = resizedDetections[0].landmarks;
      const emotions = resizedDetections[0].expressions;

      const happyThreshold = 0.5; // Adjust this value as needed
      if (emotions.happy > happyThreshold) {
        // Get the eye positions (unmirrored)
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();

        // Calculate positions to draw the image over the eyes
        const eyeWidth = 70; // Set the width for the image
        const eyeHeight = 50; // Set the height for the image
        const leftEyePosition = {
          x: leftEye[5].x - eyeWidth / 4, // Center image over the left eye
          y: leftEye[5].y - eyeHeight / 12,
        };
        const rightEyePosition = {
          x: rightEye[3].x - eyeWidth / 5, // Center image over the right eye
          y: rightEye[5].y - eyeHeight / 12,
        };

        // Draw the images over the eyes (unmirrored)
        canvasCtx.drawImage(
          eyeImage,
          leftEyePosition.x,
          leftEyePosition.y,
          eyeWidth,
          eyeHeight
        );
        canvasCtx.drawImage(
          eyeImage,
          rightEyePosition.x,
          rightEyePosition.y,
          eyeWidth,
          eyeHeight
        );

        // Get the nose position (unmirrored)
        const nose = landmarks.getNose();
        const noseWidth = 60; // Set the width for the image
        const noseHeight = 60; // Set the height for the image
        const nosePosition = {
          x: nose[3].x - noseWidth / 18, // Center image over the nose
          y: nose[3].y - noseHeight / 8,
        };

        // Draw the image over the nose (unmirrored)
        canvasCtx.drawImage(
          noseImage,
          nosePosition.x,
          nosePosition.y,
          noseWidth,
          noseHeight
        );

        // Get the mouth position (unmirrored)
        const mouth = landmarks.getMouth();
        const mouthWidth = 100; // Set the width for the image
        const mouthHeight = 80; // Set the height for the image
        const mouthPosition = {
          x: mouth[5].x - mouthWidth / 2.5, // Center image over the mouth
          y: mouth[5].y - mouthHeight / -6, // You may adjust this if needed
        };

        // Draw the image over the mouth (unmirrored)
        canvasCtx.drawImage(
          mouthImage,
          mouthPosition.x,
          mouthPosition.y,
          mouthWidth,
          mouthHeight
        );
      }
      const sadThreshold = 0.5; // Adjust this value as needed
      if (emotions.sad > sadThreshold) {
        // Get the eye positions (unmirrored)
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();

        // Calculate positions to draw the sad images over the eyes
        const sadEyeWidth = 80; // Set the width for the sad eye image
        const sadEyeHeight = 50; // Set the height for the sad eye image
        const sadLeftEyePosition = {
          x: leftEye[3].x - sadEyeWidth / 4, // Center image over the left eye
          y: leftEye[3].y - sadEyeHeight / 20,
        };
        const sadRightEyePosition = {
          x: rightEye[3].x - sadEyeWidth / 8, // Center image over the right eye
          y: rightEye[3].y - sadEyeHeight / 20,
        };

        // Draw the images over the eyes (unmirrored)
        canvasCtx.drawImage(
          sadEyeImage,
          sadLeftEyePosition.x,
          sadLeftEyePosition.y,
          sadEyeWidth,
          sadEyeHeight
        );
        canvasCtx.drawImage(
          sadEyeImage,
          sadRightEyePosition.x,
          sadRightEyePosition.y,
          sadEyeWidth,
          sadEyeHeight
        );

        // Get the nose position (unmirrored)
        const nose = landmarks.getNose();
        const sadNoseWidth = 70; // Set the width for the sad nose image
        const sadNoseHeight = 60; // Set the height for the sad nose image
        const sadNosePosition = {
          x: nose[3].x - sadNoseWidth / 20, // Center image over the nose
          y: nose[3].y - sadNoseHeight / 20,
        };

        // Draw the image over the nose (unmirrored)
        canvasCtx.drawImage(
          sadNoseImage,
          sadNosePosition.x,
          sadNosePosition.y,
          sadNoseWidth,
          sadNoseHeight
        );

        // Get the mouth position (unmirrored)
        const mouth = landmarks.getMouth();
        const sadMouthWidth = 100; // Set the width for the sad mouth image
        const sadMouthHeight = 60; // Set the height for the sad mouth image
        const sadMouthPosition = {
          x: mouth[0].x - sadMouthWidth / -6, // Center image over the mouth
          y: mouth[3].y - sadMouthHeight / -3, // You may adjust this if needed
        };

        // Draw the image over the mouth (unmirrored)
        canvasCtx.drawImage(
          sadMouthImage,
          sadMouthPosition.x,
          sadMouthPosition.y,
          sadMouthWidth,
          sadMouthHeight
        );
      }

      const angryThreshold = 0.5; // Adjust this value as needed
      if (emotions.angry > angryThreshold) {
        // Get the eye positions (unmirrored)
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();

        // Calculate positions to draw the angry images over the eyes
        const angryEyeWidth = 80; // Set the width for the angry eye image
        const angryEyeHeight = 60; // Set the height for the angry eye image
        const angryLeftEyePosition = {
          x: leftEye[3].x - angryEyeWidth / 3, // Center image over the left eye
          y: leftEye[3].y - angryEyeHeight / 4,
        };
        const angryRightEyePosition = {
          x: rightEye[3].x - angryEyeWidth / 5, // Center image over the right eye
          y: rightEye[3].y - angryEyeHeight / 4,
        };

        // Draw the images over the eyes (unmirrored)
        canvasCtx.drawImage(
          angryEyeImage,
          angryLeftEyePosition.x,
          angryLeftEyePosition.y,
          angryEyeWidth,
          angryEyeHeight
        );
        canvasCtx.drawImage(
          angryEyeImage,
          angryRightEyePosition.x,
          angryRightEyePosition.y,
          angryEyeWidth,
          angryEyeHeight
        );

        // Get the nose position (unmirrored)
        const nose = landmarks.getNose();
        const angryNoseWidth = 70; // Set the width for the angry nose image
        const angryNoseHeight = 60; // Set the height for the angry nose image
        const angryNosePosition = {
          x: nose[3].x - angryNoseWidth / 9, // Center image over the nose
          y: nose[3].y - angryNoseHeight / 4,
        };

        // Draw the image over the nose (unmirrored)
        canvasCtx.drawImage(
          angryNoseImage,
          angryNosePosition.x,
          angryNosePosition.y,
          angryNoseWidth,
          angryNoseHeight
        );

        // Get the mouth position (unmirrored)
        const mouth = landmarks.getMouth();
        const angryMouthWidth = 90; // Set the width for the angry mouth image
        const angryMouthHeight = 50; // Set the height for the angry mouth image
        const angryMouthPosition = {
          x: mouth[0].x - angryMouthWidth / -4.5, // Center image over the mouth
          y: mouth[3].y - angryMouthHeight / -2, // You may adjust this if needed
        };

        // Draw the image over the mouth (unmirrored)
        canvasCtx.drawImage(
          angryMouthImage,
          angryMouthPosition.x,
          angryMouthPosition.y,
          angryMouthWidth,
          angryMouthHeight
        );
      }
    }
  }, 100);
});
