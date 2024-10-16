//-------------------------------LOAD WINDOW-------------------------------
// Wait for the window to fully load before running the script
window.addEventListener("load", () => {
    // Load the face-api models
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    ]).then(() => {
      startVideo();
      randomizeMood(); // Randomize mood right after models are loaded
      displayCurrentMood(mood); // Display the current mood right after randomizing
    });
  });

  
//-------------------------------SET UP-------------------------------
function startVideo() {
    navigator.mediaDevices
        .getUserMedia({ video: {} })
        .then((stream) => (video.srcObject = stream))
        .catch((err) => console.error("Error accessing the camera: ", err));

}
const video = document.getElementById("video");
const videoElement = document.getElementById("video");

//-------------------------------IMPATIENT MODE-------------------------------

function transitionToImpatient() {
    mood = "impatient";
    previousEmotion = null;
    updateMoodImages(null, mood);
  
    moodTimeout = setTimeout(() => {
      randomizeMood();
    }, 10000);
  }
  
  let lastInteractionTime = Date.now();
  const impatienceThreshold = 5000;
  
//-------------------------------ARTIST BOT-------------------------------
let sadArtist, happyArtist, angryArtist, misArtist, benArtist, impatientArtist;
let mood = "normal";
let comment = document.getElementById("artist-comment");
let moodTimeout;
let previousEmotion = null; // Global variable to store the previously detected emotion

  
//RANDOMIZE ARTIST'S MOOD
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

// Transition artist to impatient mood
function transitionToImpatient() {
    mood = "impatient";
    updateMoodImages();

    //refresh the mood again after being impatient for 10 seconds
    moodTimeout = setTimeout(() => {
        randomizeMood();
    }, 10000);
}

// Hide or display images and text based on the current mood
function updateMoodImages() {
    document.getElementById("sad-image").style.display = "none";
    document.getElementById("angry-image").style.display = "none";
    document.getElementById("mischievous-image").style.display = "none";
    document.getElementById("benevolent-image").style.display = "none";
    document.getElementById("happy-image").style.display = "none";
    document.getElementById("impatient-image").style.display = "none";

    // Update the displayed image and comment based on the current mood
    if (mood === "sad") {
        document.getElementById("sad-image").style.display = "block";
        comment.innerHTML = "Oh... I guess I could paint you blue :(";
        
    } else if (mood === "angry") {
        document.getElementById("angry-image").style.display = "block";
        comment.innerHTML = "AARRGH!!! Here you go stupid, I'll paint you in red >:(";
        
    } else if (mood === "mischievous") {
        document.getElementById("mischievous-image").style.display = "block";
        comment.innerHTML = "Look at you! Ridiculous. This is how you look, haha! >:)";
        
    } else if (mood === "benevolent") {
        document.getElementById("benevolent-image").style.display = "block";
        comment.innerHTML = "Aww, you look lovely today, let's make you look even cuter! :)";
       
    } else if (mood === "happy") {
        document.getElementById("happy-image").style.display = "block";
        comment.innerHTML = "Ah look, I can paint you in a lovely yellow shade :D";
       
    } else if (mood === "impatient") {
        document.getElementById("impatient-image").style.display = "block";
        comment.innerHTML = "I'm a little impatient, and this is boring. If you don't do something interesting soon, my mood will change.";
    }
}

//-------------------------------FACE API-------------------------------
video.addEventListener("play", () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    const videoContainer = document.getElementById("video-container");
    videoContainer.append(canvas); // Append canvas inside video container

    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    const canvasCtx = canvas.getContext("2d");
    //let lastEmotionDetection = Date.now();
    //const emotionDetectionInterval = 1000;
    //i left out the code in setInterval from tryhard because I dont knwo what it does yet

    setInterval(async () => {
        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        // Handle face expressions and draw appropriate images over facial landmarks
        if (resizedDetections.length > 0) {
            const landmarks = resizedDetections[0].landmarks;
            const emotions = resizedDetections[0].expressions;

            const happyThreshold = 0.5; // Adjust this value as needed
            const sadThreshold = 0.5;
            const angryThreshold = 0.5;

            // Happy expression
            if (emotions.happy > happyThreshold) {
                drawFacialFeatures(landmarks, "happy");
            }
            // Sad expression
            else if (emotions.sad > sadThreshold) {
                drawFacialFeatures(landmarks, "sad");
            }
            // Angry expression
            else if (emotions.angry > angryThreshold) {
                drawFacialFeatures(landmarks, "angry");
            }
        }
    }, 100);
});


//-------------------------------ART GENERATION BASED ON USER MOOD-------------------------------
function generateArt(emotion, mode) {
    if (emotion === "neutral") {
      comment.innerHTML =
        "You are not displaying any emotion. The artist is waiting for some emotion."; // Display a neutral comment
      document.getElementById("benevolent-image").style.display = "block"; // Show neutral image
      video.style.filter = "";
      return;
    }
  
    if (mode === "bene") {
      switch (emotion) {
        case "happy":
          drawHappyBeneArt();
          break;
        case "sad":
          drawSadBeneArt();
          break;
        case "angry":
          drawAngryBeneArt();
          break;
      }
    } else if (mode === "misc") {
      switch (emotion) {
        case "happy":
          drawHappyMiscArt();
          break;
        case "sad":
          drawSadMiscArt();
          break;
        case "angry":
          drawAngryMiscArt();
          break;
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
  
    updateMoodImages(emotion, mode);
    displayCurrentMood(mode);
  }





function drawFacialFeatures(landmarks, emotion) {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    const eyeWidth = 80;
    const eyeHeight = 60;
    const noseWidth = 70;
    const noseHeight = 60;
    const mouthWidth = 100;
    const mouthHeight = 80;

    let eyeImage, noseImage, mouthImage;

    // Prevent drawing images if the artist's mood is NOT mischievous or benevolent
    if (mood !== "mischievous" && mood !== "benevolent") {
        return; // Exit the function early, no images will be drawn
    }

    // Load images based on the emotion (optional)
    if (emotion === "happy") {
        eyeImage = new Image();
        eyeImage.src = "images/eye-round.png";
        noseImage = new Image();
        noseImage.src = "images/nose-wings.png";
        mouthImage = new Image();
        mouthImage.src = "images/lip-bite.png";
        console.log("mood is happy.");
    } else if (emotion === "sad") {
        eyeImage = new Image();
        eyeImage.src = "images/eye-shiny.png";
        noseImage = new Image();
        noseImage.src = "images/nose-pig.png";
        mouthImage = new Image();
        mouthImage.src = "images/lip-crooked.png";
        console.log("mood is sad.");
    } else if (emotion === "angry") {
        eyeImage = new Image();
        eyeImage.src = "images/eye-mad.png";
        noseImage = new Image();
        noseImage.src = "images/nose-septum.png";
        mouthImage = new Image();
        mouthImage.src = "images/lip-open.png";
        console.log("mood is angry.");
    } 

    // Draw images over the eyes, nose, and mouth
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    const nose = landmarks.getNose();
    const mouth = landmarks.getMouth();

    // Eyes
    ctx.drawImage(eyeImage, leftEye[0].x - eyeWidth / 2, leftEye[0].y - eyeHeight / 2, eyeWidth, eyeHeight);
    ctx.drawImage(eyeImage, rightEye[0].x - eyeWidth / 2, rightEye[0].y - eyeHeight / 2, eyeWidth, eyeHeight);

    // Nose
    ctx.drawImage(noseImage, nose[3].x - noseWidth / 2, nose[3].y - noseHeight / 2, noseWidth, noseHeight);

    // Mouth
    ctx.drawImage(mouthImage, mouth[3].x - mouthWidth / 2, mouth[3].y - mouthHeight / 2, mouthWidth, mouthHeight);
}
