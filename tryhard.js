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

//-------------------------------ARTIST BOT-------------------------------
let sadArtist, happyArtist, angryArtist, misArtist, benArtist, impatientArtist;
let comment = document.getElementById("artist-comment");
let moodTimeout;
let mood; // Global variable to store the current mood

function preload() {
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

//-------------------------------IMPATIENT MODE-------------------------------

function transitionToImpatient() {
  mood = "impatient";
  updateMoodImages(null, mood); // No specific emotion, just display the impatient image

  // After 10 seconds, return to a randomized mood
  moodTimeout = setTimeout(() => {
      randomizeMood();
  }, 10000);
}

let lastInteractionTime = Date.now(); // To track the last time an emotion or face was detected
const impatienceThreshold = 5000; // 5 seconds of no interaction before triggering impatience

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
      lastInteractionTime = Date.now(); // Update interaction time when a face is detected

      const emotions = detections[0].expressions;
      const maxEmotion = Object.keys(emotions).reduce((a, b) =>
        emotions[a] > emotions[b] ? a : b
      );

      // Randomize mood and get the mode
      randomizeMood();
      const mode = mood;

      // Function to generate art based on emotion and mode
      generateArt(maxEmotion, mode);
    }

    // Check if it's time to trigger impatience
    if (Date.now() - lastInteractionTime > impatienceThreshold) {
      transitionToImpatient(); // Call to transition to impatient mood
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
  //this is how it updates the artists emotions
  updateMoodImages(emotion, mode);
}

//-------------------------------NORMAL ART-------------------------------
// Placeholder functions for neutral art generation
function drawHappyNeutralArt() {
  console.log("Drawing normal happy art");
  document.getElementById("happy-image").style.display = "block";
  comment.innerHTML = getRandomNeuComment("happy"); 
}

function drawSadNeutralArt() {
  console.log("Drawing normal sad art");
  document.getElementById("sad-image").style.display = "block";
  comment.innerHTML = getRandomNeuComment("happy"); 
}

function drawAngryNeutralArt() {
  console.log("Drawing normal angry art");
  document.getElementById("angry-image").style.display = "block"; 
  comment.innerHTML = getRandomNeuComment("happy"); 
}

let neutralComments = {
  happy: [
    "You seem to be in a good mood! It’s nice to see some positivity. Keep going!",
    "It’s always great to feel happy! Let’s keep that vibe going. 😊",
    "I see that smile! It’s a good day, isn’t it? Keep enjoying the moment."
  ],
  sad: [
    "It looks like you're feeling a bit down. It’s okay, we all have those days.",
    "Sadness is just a part of life. Take your time, everything will be alright.",
    "It’s normal to feel sad sometimes. Things will look up soon."
  ],
  angry: [
    "I can see that you're feeling a bit frustrated. It's okay, take a moment for yourself.",
    "Anger is a powerful emotion. Take a deep breath, and let’s calm things down.",
    "I sense some tension. It’s alright to feel angry, but remember, things will improve."
  ]
};

function getRandomNeuComment(emotion) {
  const comments = neutralComments[emotion];
  const randomIndex = Math.floor(Math.random() * comments.length);
  return comments[randomIndex];
}

//-------------------------------BENE ART-------------------------------
function drawHappyGoodArt() {
  console.log("Drawing happy art in bene mode");
  document.getElementById("happy-image").style.display = "block";
  comment.innerHTML = getRandomBeneComment("happy"); 
}

function drawSadGoodArt() {
  console.log("Drawing sad art in bene mode");
  document.getElementById("sad-image").style.display = "block";
  comment.innerHTML = getRandomBeneComment("sad"); 
}


function drawAngryGoodArt() {
  console.log("Drawing angry art in bene mode");
  document.getElementById("angry-image").style.display = "block";
  comment.innerHTML = getRandomBeneComment("angry"); 
}

let beneComments = {
  happy: [
    "I'm so glad to see you happy! Keep smiling, you're doing great! 😊",
    "Your happiness lights up the room! Let's make this moment even better! 🌟",
    "Ah, the joy in your face is contagious! Keep up the positivity! 😄"
  ],
  sad: [
    "I see you're feeling down, but I'm here to remind you that brighter days are ahead. 🌈",
    "It's okay to feel sad sometimes, but remember, you are strong and capable. 💪",
    "Take a deep breath, you're not alone. We'll get through this together. 💖"
  ],
  angry: [
    "I know you're upset, but take a moment to breathe. Everything will be okay. 🌻",
    "You're allowed to be angry, but remember, peace and calm will come soon. 🌸",
    "Anger is natural, but let's take a step back and let it go. You deserve happiness! 🌞"
  ]
};

function getRandomBeneComment(emotion) {
  const comments = beneComments[emotion];
  const randomIndex = Math.floor(Math.random() * comments.length);
  return comments[randomIndex];
}

//-------------------------------MISC ART-------------------------------
function drawHappyBadArt() {
  console.log("Drawing happy art in misc mode");
  document.getElementById("happy-image").style.display = "block";
  comment.innerHTML = getRandomMischievousComment("happy"); 
}

function drawSadBadArt() {
  console.log("Drawing sad art in misc mode");
  document.getElementById("sad-image").style.display = "block";
  comment.innerHTML = getRandomMischievousComment("sad"); 
}

function drawAngryBadArt() {
  console.log("Drawing angry art in misc mode");
  document.getElementById("mischievous-image").style.display = "block";
  comment.innerHTML = getRandomMischievousComment("angry");  
}


let mischievousComments = {
  happy: [
    "Oh, you're happy? Let’s see how long that lasts!",
    "You look so happy, but I know something’s up.",
    "Is this happiness, or are you just pretending? Let’s find out!"
  ],
  sad: [
    "Oh, feeling sad? You don’t fool me, I know you’re up to something.",
    "Sadness? Or maybe you're just faking it to get some attention?",
    "I see that frown. Let’s see what kind of mischief I can create from it!"
  ],
  angry: [
    "You’re angry, huh? Let me make this even more interesting.",
    "Oh, look at you! So mad, but I bet I can turn this into something fun.",
    "Anger? Let's see how long that lasts before something mischievous happens!"
  ]
};

// Function to get a random comment for a given emotion
function getRandomMischievousComment(emotion) {
  const comments = mischievousComments[emotion];
  const randomIndex = Math.floor(Math.random() * comments.length);
  return comments[randomIndex];
}


//-------------------------------UPDATE ARTIST IMAGE LOGIC-------------------------------
// Function to hide all images and display only the relevant one

document.getElementById("mood-text").innerHTML = "";

// Function to update the mood text
function displayCurrentMood(mode) {
  const moodTextElement = document.getElementById("mood-text");

  switch (mode) {
    case "bene":
      moodTextElement.innerHTML = "The artist is in Benevolent mode, spreading positivity!";
      break;
    case "misc":
      moodTextElement.innerHTML = "The artist is in Mischievous mode, watch out!";
      break;
    case "normal":
      moodTextElement.innerHTML = "The artist is in Neutral mode, keeping things balanced.";
      break;
    case "impatient":
      moodTextElement.innerHTML = "The artist is in Impatient mode, a bit annoyed!";
      break;
    default:
      moodTextElement.innerHTML = "The artist's mood is unknown.";
  }
}

function updateMoodImages(emotion, mode) {
  document.getElementById("sad-image").style.display = "none";
  document.getElementById("angry-image").style.display = "none";
  document.getElementById("mischievous-image").style.display = "none";
  document.getElementById("benevolent-image").style.display = "none";
  document.getElementById("happy-image").style.display = "none";
  document.getElementById("impatient-image").style.display = "none";

  if (mood === "impatient") {
      document.getElementById("impatient-image").style.display = "block";
      comment.innerHTML = "I'm a little impatient, and this is boring. Do something interesting!";
  } else {
      // If not impatient, display image based on detected emotion
      switch (emotion) {
          case "happy":
              document.getElementById("happy-image").style.display = "block";
              break;
          case "sad":
              document.getElementById("sad-image").style.display = "block";
              break;
          case "angry":
              document.getElementById("angry-image").style.display = "block";
              break;
          case "mischievous":
              document.getElementById("mischievous-image").style.display = "block";
              break;
          default:
              console.log("Emotion not handled:", emotion);
      }
  }
  displayCurrentMood(mode);
}
