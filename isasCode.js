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

//-------------------------------ARTIST BOT-------------------------------
let sadArtist, happyArtist, angryArtist, misArtist, benArtist, impatientArtist;
let comment = document.getElementById("artist-comment");
let moodTimeout;
let mood = "normal"; // Default mood is set to "normal"

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
    comment.innerHTML =
      "You are not displaying any emotion. The artist is waiting for some emotion.";
    document.getElementById("neutral-image").style.display = "block";
    video.style.filter = "";
    ctxx.clearRect(0, 0, canvas2.width, canvas2.height);
    stopRainEffect();
    stopFloatingHearts();
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

//------------------------------------------------------------------------
//-------------------------------NORMAL ART-------------------------------
//------------------------------------------------------------------------
const canvas2 = document.getElementById("artCanvas2");
const ctxx = canvas2.getContext("2d"); // Define it once for global access
// Get the canvas element



//-------------------------------FUNCTIONS FOR CANVAS ART-----------------

// Get the canvas element
function applyScreenGlitchEffect() {
  let glitchTimeouts = [];

  // Glitch function for the entire screen
  function glitch() {
    // Randomly translate the screen
    document.body.style.transform = `translate(${Math.random() * 20 - 10}px, ${
      Math.random() * 20 - 10
    }px)`;

    // Apply random hue rotation and contrast to the whole screen
    document.body.style.filter = `hue-rotate(${Math.random() * 360}deg) contrast(${Math.random() * 2 + 1})`;

    // Random opacity effect
    document.body.style.opacity = Math.random() * 0.3 + 0.9;

    // Reset the transformations after a random period
    glitchTimeouts.push(
      setTimeout(() => {
        document.body.style.transform = "";
        document.body.style.filter = "";
        document.body.style.opacity = 1;
      }, Math.random() * 500 + 50)
    );
  }

  // Glitch interval for continuous effect
  const glitchInterval = setInterval(glitch, Math.random() * 300 + 100);

  // Stop the glitch effect after 2 seconds
  setTimeout(() => {
    clearInterval(glitchInterval);
    glitchTimeouts.forEach(clearTimeout);
    document.body.style.transform = "";
    document.body.style.filter = "";
    document.body.style.opacity = 1;
  }, 2000); // Glitch for 2 seconds
}

//-------------------------------FUNCTIONS FOR CANVAS ART-----------------
function drawSun() {
  // Clear the canvas
  ctxx.clearRect(0, 0, canvas2.width, canvas2.height);

  // Number of suns to draw
  const numberOfSuns = 5; // For example, let's draw 5 suns
  const spacingX = 200; // Horizontal spacing between suns
  const spacingY = 150; // Vertical spacing between suns

  for (let i = 0; i < numberOfSuns; i++) {
    let offsetX = (i % 2) * spacingX + 150; // Calculate X position (alternating between two columns)
    let offsetY = Math.floor(i / 2) * spacingY + 150; // Calculate Y position (rows)

    // Save the current context before applying transformations
    ctxx.save();

    // Draw the sun's body (a yellow circle)
    ctxx.fillStyle = "yellow";
    ctxx.beginPath();
    ctxx.arc(offsetX, offsetY, 50, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle
    ctxx.fill();

    // Draw the sun's rays
    ctxx.strokeStyle = "orange"; // Rays will be orange
    ctxx.lineWidth = 5; // Thickness of the rays
    const radius = 70; // Length of the rays

    for (let j = 0; j < 12; j++) {
      let angle = (j * Math.PI) / 6; // Dividing the full circle into 12 rays
      let startX = offsetX + Math.cos(angle) * 50; // Start at the edge of the sun
      let startY = offsetY + Math.sin(angle) * 50;
      let endX = offsetX + Math.cos(angle) * radius; // End point for the ray
      let endY = offsetY + Math.sin(angle) * radius;

      ctxx.beginPath();
      ctxx.moveTo(startX, startY); // Start at the edge of the sun
      ctxx.lineTo(endX, endY); // Draw the line outward
      ctxx.stroke(); // Draw the ray
    }

    // Restore the original context (before rotation)
    ctxx.restore();
  }

  // Add some text below the last sun
  ctxx.fillStyle = "black";
  ctxx.font = "30px Arial";
  ctxx.fillText("Shining Suns", 100, 400); // Adjusted position for the text
}


function happyNeutralArt1() {
  ctxx.clearRect(0, 0, canvas2.width, canvas2.height);
  ctxx.fillStyle = "yellow";
  ctxx.beginPath();
  ctxx.arc(150, 150, 50, 0, Math.PI * 2);
  ctxx.fill();
  ctxx.fillStyle = "black";
  ctxx.font = "30px Arial";
  ctxx.fillText("Smiling Sun", 100, 250);
}

function sadNeutralArt1() {
  ctxx.clearRect(0, 0, canvas2.width, canvas2.height);
  ctxx.fillStyle = "blue";
  ctxx.beginPath();
  ctxx.arc(150, 150, 50, 0, Math.PI * 2);
  ctxx.fill();
  ctxx.fillStyle = "black";
  ctxx.font = "30px Arial";
  ctxx.fillText("Raindrop", 110, 250);
}

function angryNeutralArt1() {
  ctxx.clearRect(0, 0, canvas2.width, canvas2.height);
  ctxx.fillStyle = "red";
  ctxx.beginPath();
  ctxx.arc(150, 150, 50, 0, Math.PI * 2);
  ctxx.fill();
  ctxx.fillStyle = "black";
  ctxx.font = "30px Arial";
  ctxx.fillText("Angry Flame", 90, 250);
}

//-------------------------------RAIN ANIMATION-------------------------------
const raindrops = [];
let isRaining = false; 

function stopRainEffect() {
  isRaining = false; 
  raindrops.length = 0; 
  ctxx.clearRect(0, 0, canvas2.width, canvas2.height); 
}

function startRainEffect() {
  if (!isRaining) {
    isRaining = true;
    createRaindrops(100);
    animateRain();
  }
}


function createRaindrops(numDrops) {
  for (let i = 0; i < numDrops; i++) {
    raindrops.push({
      x: Math.random() * canvas2.width,
      y: Math.random() * canvas2.height,
      length: Math.random() * 20 + 10,
      speed: Math.random() * 2 + 2 
    });
  }
}

function rainEffect() {
  ctxx.clearRect(0, 0, canvas2.width, canvas2.height); 

  if (isRaining) {
      raindrops.forEach((drop) => {
          ctxx.beginPath();
          ctxx.moveTo(drop.x, drop.y);
          ctxx.lineTo(drop.x, drop.y + drop.length);
          ctxx.strokeStyle = "rgba(173, 216, 230, 0.6)";
          ctxx.lineWidth = 2;
          ctxx.stroke();

          drop.y += drop.speed;

          if (drop.y > canvas2.height) {
              drop.y = 0; 
              drop.x = Math.random() * canvas2.width;
          }
      });
  }
}

function animateRain() {
  rainEffect(); 
  if (isRaining) {
    requestAnimationFrame(animateRain);
  }
}

//array for all emotions of neutral
let neutralArt = {
  happy: [happyNeutralArt1, drawSun, ],
  sad: [sadNeutralArt1, startRainEffect], 
  angry: [angryNeutralArt1, applyScreenGlitchEffect],
};

// the function for the array
function neutralArtGenerator(emotion) {
  const art = neutralArt[emotion];
  const randomIndex = Math.floor(Math.random() * art.length);
  const selectedArtFunction = art[randomIndex];

  selectedArtFunction();
}

//-------------------------------FUNCTIONS FOR DISPLAYING ALL NEUTRAL-------------------------------

function drawHappyNeutralArt() {
  console.log("Drawing normal happy art");
  document.getElementById("happy-image").style.display = "block";
  document.getElementById("neutral-image").style.display = "none";
  comment.innerHTML = getRandomNeuComment("happy");
  neutralArtGenerator("happy");
}

function drawSadNeutralArt() {
  console.log("Drawing normal sad art");
  document.getElementById("sad-image").style.display = "block";
  document.getElementById("neutral-image").style.display = "none";
  comment.innerHTML = getRandomNeuComment("sad");
  neutralArtGenerator("sad");
}

function drawAngryNeutralArt() {
  console.log("Drawing normal angry art");
  document.getElementById("angry-image").style.display = "block";
  document.getElementById("neutral-image").style.display = "none";
  comment.innerHTML = getRandomNeuComment("angry");
  neutralArtGenerator("angry");
}

//-------------------------------COMMENTS FOR NEUTRAL AND FUNCTION-------------------------------

let neutralComments = {
  happy: [
    "You seem to be in a good mood! It’s nice to see some positivity. Keep going!",
    "It’s always great to feel happy! Let’s keep that vibe going. 😊",
    "I see that smile! It’s a good day, isn’t it? Keep enjoying the moment.",
  ],
  sad: [
    "It looks like you're feeling a bit down. It’s okay, we all have those days.",
    "Sadness is just a part of life. Take your time, everything will be alright.",
    "It’s normal to feel sad sometimes. Things will look up soon.",
  ],
  angry: [
    "I can see that you're feeling a bit frustrated. It's okay, take a moment for yourself.",
    "Anger is a powerful emotion. Take a deep breath, and let’s calm things down.",
    "I sense some tension. It’s alright to feel angry, but remember, things will improve.",
  ],
};

function getRandomNeuComment(emotion) {
  const comments = neutralComments[emotion];
  const randomIndex = Math.floor(Math.random() * comments.length);
  return comments[randomIndex];
}

//----------------------------------------------------------------------
//-------------------------------BENE ART-------------------------------
//----------------------------------------------------------------------
let beneArt = {
  happy: [createFloatingHearts, drawSun, ],
  sad: [sadNeutralArt1, startRainEffect], 
  angry: [angryNeutralArt1, applyScreenGlitchEffect],
};

function beneArtGenerator(emotion) {
  const art = beneArt[emotion];
  const randomIndex = Math.floor(Math.random() * art.length);
  const selectedArtFunction = art[randomIndex];

  selectedArtFunction();
}
//-------------------------------FUNCTIONS FOR CANVAS ART-----------------
let floatingHeartsInterval;
let heartsArray = []; // Array to keep track of hearts

function createFloatingHearts() {
  // Function to create a new heart element
  function createHeart() {
    // Create the heart element
    const heart = document.createElement("div");
    heart.classList.add("floating-heart"); // Add a class to style hearts
    document.body.appendChild(heart);

    // Store the heart element in the array
    heartsArray.push(heart);

    // Randomly position the heart
    heart.style.left = `${Math.random() * 100}vw`; // 100vw allows it to be anywhere across the screen width
    heart.style.top = `${Math.random() * 100}vh`;  // 100vh allows it to be anywhere across the screen height

    // Set random size for the heart
    const size = Math.random() * 15 + 10; // Random size between 10px and 25px
    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;

    // Set animation duration for smooth floating
    const duration = Math.random() * 3 + 3; // Heart floats for 3-6 seconds
    heart.style.animationDuration = `${duration}s`;

    // Random opacity for a more ethereal look
    heart.style.opacity = Math.random() * 0.5 + 0.5; // Opacity between 0.5 and 1
  }

  // Create hearts at regular intervals
  floatingHeartsInterval = setInterval(createHeart, 500); // Create a new heart every 500ms

  // CSS to style the hearts and animation
  const style = document.createElement("style");
  style.innerHTML = `
    .floating-heart {
      position: absolute;
      width: 100px;
      height: 90px;
      background: transparent;
    }

    .floating-heart:before, .floating-heart:after {
      position: absolute;
      content: "";
      left: 50px;
      top: 0;
      width: 50px;
      height: 80px;
      background: red;
      border-radius: 50px 50px 0 0;
      transform: rotate(-45deg);
      transform-origin: 0 100%;
    }

    .floating-heart:after {
      left: 0;
      transform: rotate(45deg);
      transform-origin: 100% 100%;
    }

    @keyframes float {
      0% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-20px);
      }
      100% {
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}

// Function to stop all floating hearts and clear the interval
function stopFloatingHearts() {
  // Stop the interval for creating hearts
  clearInterval(floatingHeartsInterval);

  // Remove all heart elements from the screen
  heartsArray.forEach(heart => {
    heart.remove();
  });

  // Clear the array holding heart elements
  heartsArray = [];
}


const canvas3 = document.getElementById("artCanvas");
const ctx3 = canvas3.getContext("2d"); // Define it once for global access

function animateGradient(emotion) {
  let gradient = ctx3.createLinearGradient(0, 0, canvas3.width, canvas3.height);

  if (emotion === "happy") {
    gradient.addColorStop(0, "yellow");
    gradient.addColorStop(1, "orange");
  } else if (emotion === "sad") {
    gradient.addColorStop(0, "blue");
    gradient.addColorStop(1, "purple");
  } else if (emotion === "angry") {
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1, "black");
  }

  // Clear the canvas
  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);

  // Apply the gradient with transparency (so you can still see the video)
  ctx3.globalAlpha = 0.5;
  ctx3.fillStyle = gradient;
  ctx3.fillRect(0, 0, canvas3.width, canvas3.height);

  // Recursive animation
  requestAnimationFrame(() => animateGradient(emotion));
}

function drawHappyBeneArt() {
  console.log("Drawing happy art in bene mode");

  // Show the happy image and hide the neutral image
  document.getElementById("happy-image").style.display = "block";
  document.getElementById("neutral-image").style.display = "none";

  // Update the comment
  comment.innerHTML = getRandomBeneComment("happy");
  beneArtGenerator("happy");
  
}

function drawSadBeneArt() {
  console.log("Drawing sad art in bene mode");
  document.getElementById("sad-image").style.display = "block";
  document.getElementById("neutral-image").style.display = "none";
  comment.innerHTML = getRandomBeneComment("sad");
  beneArtGenerator("sad");
}

function drawAngryBeneArt() {
  console.log("Drawing angry art in bene mode");
  document.getElementById("angry-image").style.display = "block";
  document.getElementById("neutral-image").style.display = "none";
  comment.innerHTML = getRandomBeneComment("angry");
  beneArtGenerator("angry");
}

//-------------------------------COMMENTS FOR BENE AND FUNCTION-------------------------------
let beneComments = {
  happy: [
    "I'm so glad to see you happy! Keep smiling, you're doing great! 😊",
    "Your happiness lights up the room! Let's make this moment even better! 🌟",
    "Ah, the joy in your face is contagious! Keep up the positivity! 😄",
  ],
  sad: [
    "I see you're feeling down, but I'm here to remind you that brighter days are ahead. 🌈",
    "It's okay to feel sad sometimes, but remember, you are strong and capable. 💪",
    "Take a deep breath, you're not alone. We'll get through this together. 💖",
  ],
  angry: [
    "I know you're upset, but take a moment to breathe. Everything will be okay. 🌻",
    "You're allowed to be angry, but remember, peace and calm will come soon. 🌸",
    "Anger is natural, but let's take a step back and let it go. You deserve happiness! 🌞",
  ],
};

function getRandomBeneComment(emotion) {
  const comments = beneComments[emotion];
  const randomIndex = Math.floor(Math.random() * comments.length);
  return comments[randomIndex];
}

//----------------------------------------------------------------------
//-------------------------------MISC ART-------------------------------
//----------------------------------------------------------------------

//-------------------------------THE EFFECTS FOR MISC-------------------

//this is a glitch effect applied for happy
function applyGlitchEffect() {
  let glitchTimeouts = [];

  function glitch() {
    videoElement.style.transform = `translate(${Math.random() * 20 - 10}px, ${
      Math.random() * 20 - 10
    }px)`;
    videoElement.style.filter = `hue-rotate(${
      Math.random() * 360
    }deg) contrast(${Math.random() * 2 + 1})`;
    videoElement.style.opacity = Math.random() * 0.6 + 0.4;

    glitchTimeouts.push(
      setTimeout(() => {
        videoElement.style.transform = "";
        videoElement.style.filter = "";
        videoElement.style.opacity = 1;
      }, Math.random() * 500 + 50)
    );
  }

  const glitchInterval = setInterval(glitch, Math.random() * 300 + 100);

  setTimeout(() => {
    clearInterval(glitchInterval);
    glitchTimeouts.forEach(clearTimeout);
    videoElement.style.transform = "";
    videoElement.style.filter = "";
    videoElement.style.opacity = 1;
  }, 2000); // glitch for 2 seconds
}

//this is particle code for all the emotions on misc

const canvas4 = document.getElementById("artCanvas");
const ctx4 = canvas4.getContext("2d"); // Only define once here

let particles = [];

class Particle {
  constructor(x, y, velocityX, velocityY, color, size = 3) {
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.color = color;
    this.size = size;
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
    if (this.size < 5) this.size += 0.05;
  }

  draw(ctx4) {
    ctx4.fillStyle = this.color;
    ctx4.beginPath();
    ctx4.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx4.fill();
  }
}

function createParticles(emotion) {
  particles = [];
  const numParticles = 100;

  let color, speed, opacity;
  if (emotion === "happy") {
    color = "yellow";
    speed = 2;
    opacity = 1;
  } else if (emotion === "sad") {
    color = "blue";
    speed = 0.5;
    opacity = 0.8;
  } else if (emotion === "angry") {
    color = "red";
    speed = 4;
    opacity = 1;
  }

  for (let i = 0; i < numParticles; i++) {
    let x = Math.random() * canvas4.width;
    let y = Math.random() * canvas4.height;
    let velocityX = (Math.random() - 0.5) * speed;
    let velocityY = (Math.random() - 0.5) * speed;
    particles.push(new Particle(x, y, velocityX, velocityY, color, opacity));
  }

  requestAnimationFrame(animateParticles);
}

function animateParticles() {
  ctx4.clearRect(0, 0, canvas4.width, canvas4.height);

  particles.forEach((particle) => {
    particle.update();
    particle.draw(ctx4);
  });

  requestAnimationFrame(animateParticles);
}

//-------------------FUNCTIONS FOR DISPLAYING MISC-------------------
function drawHappyMiscArt() {
  console.log("Drawing happy art in misc mode");
  document.getElementById("happy-image").style.display = "block";
  document.getElementById("neutral-image").style.display = "none";
  comment.innerHTML = getRandomMischievousComment("happy");
  applyGlitchEffect();
  createParticles("happy");
}

function drawSadMiscArt() {
  console.log("Drawing sad art in misc mode");
  document.getElementById("sad-image").style.display = "block";
  document.getElementById("neutral-image").style.display = "none";
  comment.innerHTML = getRandomMischievousComment("sad");
  createParticles("sad");
}

function drawAngryMiscArt() {
  console.log("Drawing angry art in misc mode");
  document.getElementById("mischievous-image").style.display = "block";
  document.getElementById("neutral-image").style.display = "none";
  comment.innerHTML = getRandomMischievousComment("angry");
  video.style.filter = getRandomMiscFilter("angry");
  createParticles("angry");
}

//-------------------------COMMENTS FOR MISC AND FUNCTION--------------------------
let mischievousComments = {
  happy: [
    "Oh, you're happy? Let’s see how long that lasts!",
    "You look so happy, but I know something’s up.",
    "Is this happiness, or are you just pretending? Let’s find out!",
  ],
  sad: [
    "Oh, feeling sad? You don’t fool me, I know you’re up to something.",
    "Sadness? Or maybe you're just faking it to get some attention?",
    "I see that frown. Let’s see what kind of mischief I can create from it!",
  ],
  angry: [
    "You’re angry, huh? Let me make this even more interesting.",
    "Oh, look at you! So mad, but I bet I can turn this into something fun.",
    "Anger? Let's see how long that lasts before something mischievous happens!",
  ],
};

let miscFilter = {
  //not in use
  happy: [
    "brightness(1.5) saturate(1.5)",
    "brightness(2) saturate(1.6)",
    "sepia(0.5) contrast(1.2)",
  ],
  //not in use
  sad: [
    "grayscale(1) brightness(2)",
    "grayscale(1) brightness(0.7)",
    "grayscale(1) brightness(0.5) contrast(1.3)",
  ],
  angry: [
    "contrast(2) saturate(3)",
    "contrast(1) saturate(2) grayscale(1)",
    "contrast(4) saturate(2) hue-rotate(180deg)",
  ],
};

//random filter
function getRandomMiscFilter(emotion) {
  const filters = miscFilter[emotion];
  const randomIndex = Math.floor(Math.random() * filters.length);
  return filters[randomIndex];
}

// random comment
function getRandomMischievousComment(emotion) {
  const comments = mischievousComments[emotion];
  const randomIndex = Math.floor(Math.random() * comments.length);
  return comments[randomIndex];
}

//---------------------------------------------------------------------------------------
//-------------------------------UPDATE ARTIST IMAGE LOGIC-------------------------------
//---------------------------------------------------------------------------------------

document.getElementById("mood-text").innerHTML = "";

// Function to update the mood text
function displayCurrentMood(mode) {
  const moodTextElement = document.getElementById("mood-text");

  switch (mode) {
    case "bene":
      moodTextElement.innerHTML =
        "The artist is in Benevolent mode, spreading positivity!";
      break;
    case "misc":
      moodTextElement.innerHTML =
        "The artist is in Mischievous mode, watch out!";
      break;
    case "normal":
      moodTextElement.innerHTML =
        "The artist is in Neutral mode, keeping things balanced.";
      break;
    case "impatient":
      moodTextElement.innerHTML =
        "The artist is in Impatient mode, a bit annoyed!";
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
    comment.innerHTML =
      "I'm a little impatient, and this is boring. Do something interesting!";
  } else {
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
  document.getElementById("happy-image").style.display = "none";
  document.getElementById("impatient-image").style.display = "none";
}
