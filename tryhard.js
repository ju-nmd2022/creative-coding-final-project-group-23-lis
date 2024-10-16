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
    randomizeMood();  // Randomize mood right after models are loaded
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

//-------------------------------ARTIST BOT-------------------------------
let sadArtist, happyArtist, angryArtist, misArtist, benArtist, impatientArtist;
let comment = document.getElementById("artist-comment");
let moodTimeout;
let mood = "normal";  // Default mood is set to "normal"

let previousEmotion = null; // Global variable to store the previously detected emotion


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
  previousEmotion = null;
  updateMoodImages(null, mood);

  moodTimeout = setTimeout(() => {
    randomizeMood();
  }, 10000);
}


let lastInteractionTime = Date.now();
const impatienceThreshold = 5000;

//-------------------------------FACE API-------------------------------

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  const videoContainer = document.getElementById("video-container");
  videoContainer.append(canvas); 

  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  let lastEmotionDetection = Date.now();
  const emotionDetectionInterval = 1000; 
  
  setInterval(async () => {
    if (Date.now() - lastEmotionDetection > emotionDetectionInterval) {
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

        if (maxEmotion !== previousEmotion) {
          previousEmotion = maxEmotion; 
          generateArt(maxEmotion, mood); 
        }
      }
  
      lastEmotionDetection = Date.now();
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

function generateArt(emotion, mode) {
  if (emotion === "neutral") {
    comment.innerHTML = "You are not displaying any emotion. The artist is waiting for some emotion."; // Display a neutral comment
    document.getElementById("benevolent-image").style.display = "block"; // Show neutral image
    video.style.filter ="";
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


//-------------------------------NORMAL ART-------------------------------
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
function drawHappyBeneArt() {
  console.log("Drawing happy art in bene mode");
  document.getElementById("happy-image").style.display = "block";
  comment.innerHTML = getRandomBeneComment("happy"); 
}

function drawSadBeneArt() {
  console.log("Drawing sad art in bene mode");
  document.getElementById("sad-image").style.display = "block";
  comment.innerHTML = getRandomBeneComment("sad"); 
}


function drawAngryBeneArt() {
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
function drawHappyMiscArt() {
  console.log("Drawing happy art in misc mode");
  document.getElementById("happy-image").style.display = "block";
  comment.innerHTML = getRandomMischievousComment("happy"); 
  video.style.filter = getRandomMiscFilter("happy");
}

function drawSadMiscArt() {
  console.log("Drawing sad art in misc mode");
  document.getElementById("sad-image").style.display = "block";
  comment.innerHTML = getRandomMischievousComment("sad"); 
  video.style.filter = getRandomMiscFilter("happy");
}

function drawAngryMiscArt() {
  console.log("Drawing angry art in misc mode");
  document.getElementById("mischievous-image").style.display = "block";
  comment.innerHTML = getRandomMischievousComment("angry");  
  video.style.filter = getRandomMiscFilter("happy");
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

let miscFilter = {
  happy: [
    "brightness(1.5) saturate(1.5)",        // Filter 1
    "brightness(1.7) saturate(1.6)",        // Filter 2
    "sepia(0.5) contrast(1.2)",             // Filter 3
  ],
  sad: [
    "grayscale(1) brightness(0.7)",         // Filter 1
    "grayscale(1) brightness(0.7)",         // Filter 2
    "grayscale(1) brightness(0.5) contrast(1.3)",  // Filter 3
  ],
  angry: [
    "contrast(1.5) saturate(2)",            // Filter 1
    "contrast(1.8) saturate(2)",            // Filter 2
    "contrast(1.5) saturate(2) hue-rotate(180deg)", 
  ]
};

function getRandomMiscFilter(emotion){
  const filters = miscFilter[emotion];
  const randomIndex = Math.floor(Math.random() * filters.length);
  return filters[randomIndex];
}

// Function to get a random comment for a given emotion
function getRandomMischievousComment(emotion) {
  const comments = mischievousComments[emotion];
  const randomIndex = Math.floor(Math.random() * comments.length);
  return comments[randomIndex];
}


//-------------------------------UPDATE ARTIST IMAGE LOGIC-------------------------------
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
  // Clear all images
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
      // Display image based on the current emotion
      switch (emotion) {
          case "happy":
              document.getElementById("happy-image").style.display = "block";
              comment.innerHTML = getRandomComment(emotion, mode); 
              break;
          case "sad":
              document.getElementById("sad-image").style.display = "block";
              comment.innerHTML = getRandomComment(emotion, mode); 
              break;

          case "angry":
              document.getElementById("angry-image").style.display = "block";
              comment.innerHTML = getRandomComment(emotion, mode); 
              break;
          case "mischievous":
              document.getElementById("mischievous-image").style.display = "block";
              comment.innerHTML = getRandomComment(emotion, mode); 
              break;
          default:
              console.log("Emotion not handled:", emotion);
            
      }
  }
  displayCurrentMood(mode);
}

function getRandomComment(emotion, mode) {
  let comments = [];
  
  if (mode === "bene") {
    comments = beneComments[emotion];
  } else if (mode === "misc") {
    comments = mischievousComments[emotion];
  } else if (mode === "normal") {
    comments = neutralComments[emotion];
  }

  const randomIndex = Math.floor(Math.random() * comments.length);
  return comments[randomIndex];
}

function hideAllImages() {
  document.getElementById("sad-image").style.display = "none";
  document.getElementById("angry-image").style.display = "none";
  document.getElementById("mischievous-image").style.display = "none";
  document.getElementById("benevolent-image").style.display = "none";
  document.getElementById("happy-image").style.display = "none";
  document.getElementById("impatient-image").style.display = "none";
}
