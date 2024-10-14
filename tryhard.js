const videoElement = document.querySelector(".input_video");
const canvasElement = document.querySelector(".output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const loadingScreen = document.querySelector(".loading");
let predictions = [];
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

//-------------------------------------------------SET UPS-------------------------------------------------
// Function to handle setting up the camera stream
async function setupCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    return new Promise((resolve) => {
      videoElement.onloadedmetadata = () => {
        resolve(videoElement);
      };
    });
    colorMode(HSB);
  } catch (error) {
    console.error("Error accessing the camera: ", error);
    alert("Please allow camera access and reload the page.");
    throw error;
  }
}

function preload() {
  //the artist mood images
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

  //the facial features in the head array
  headHeart = loadImage("images/head-heart.PNG");
  headFeather = loadImage("images/head-feather.PNG");
  headBeret = loadImage("images/head-beret.PNG");
  headFilterArray = [headHeart, headFeather, headBeret];

  //the facial features in the brows array
  browsLift = loadImage("images/brows-lift.PNG");
  browsUni = loadImage("images/brows-uni.PNG");
  browsWitch = loadImage("images/brows-witch.PNG");
  browsFilterArray = [browsLift, browsUni, browsWitch];

  //the facial features in the eyes array
  eyesCross = loadImage("images/eyes-cross.PNG");
  eyesCute = loadImage("images/eyes-cute.PNG");
  eyesZombie = loadImage("images/eyes-zombie.PNG");
  eyesFilterArray = [eyesCross, eyesCute, eyesZombie];

  //the facial features in the nose array
  noseSeptum = loadImage("images/nose-septum.PNG");
  nosePig = loadImage("images/nose-pig.PNG");
  noseWings = loadImage("images/nose-wings.PNG");
  noseFilterArray = [noseSeptum, nosePig, noseWings];

  //the facial features in the lips array
  lipBite = loadImage("images/lip-bite.PNG");
  lipCrooked = loadImage("images/lip-crooked.PNG");
  lipOpen = loadImage("images/lip-open.PNG");
  lipFilterArray = [lipBite, lipCrooked, lipOpen];
}

//------------------------------------------------------FACE CALCULATIONS-----------------------------------------------------------
// Initialize MediaPipe FaceMesh
const faceMesh = new FaceMesh({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
});

// Set options for FaceMesh
faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

// Baseline for eyebrow, eye, and mouth distances
let baselineDistance = null;
let eyeBaseline = null;
let mouthBaseline = null;
let eyeClosedStart = null; // To track when eyes are first closed
let isEyebrowsRaised = false; // To track the raised eyebrow state

// Callback when FaceMesh results are ready
faceMesh.onResults((results) => {
  // Hide loading screen once results are processed
  document.body.classList.add("loaded");

  // Clear and draw the new frame with mirroring
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  canvasCtx.translate(canvasElement.width, 0); // Move the context's origin to the right edge
  canvasCtx.scale(-1, 1); // Flip horizontally

  // Draw the mirrored video frame
  canvasCtx.drawImage(
    videoElement,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    const landmarks = results.multiFaceLandmarks[0]; // Assume only 1 face

    // Get positions of key landmarks for eyebrows
    const leftEyebrow = landmarks[70]; // A point on the left eyebrow
    const rightEyebrow = landmarks[300]; // A point on the right eyebrow
    const leftLowerEyelid = landmarks[145]; // Bottom point of left eye
    const rightLowerEyelid = landmarks[374]; // Bottom point of right eye

    // Calculate the vertical distance between lower eyelids and eyebrows
    const leftLowerEyelidToEyebrow = Math.abs(
      leftEyebrow.y - leftLowerEyelid.y
    );
    const rightLowerEyelidToEyebrow = Math.abs(
      rightEyebrow.y - rightLowerEyelid.y
    );

    // Set baseline for eyebrows if it's the first frame
    if (!baselineDistance) {
      baselineDistance = {
        left: leftLowerEyelidToEyebrow,
        right: rightLowerEyelidToEyebrow,
      };
    }

    // Check if the eyebrows are raised by comparing the space between lower eyelids and eyebrows
    const raiseThreshold = 0.001; // Adjust this threshold based on testing
    const leftEyebrowRaised =
      leftLowerEyelidToEyebrow - baselineDistance.left > raiseThreshold;
    const rightEyebrowRaised =
      rightLowerEyelidToEyebrow - baselineDistance.right > raiseThreshold;

    if (leftEyebrowRaised && rightEyebrowRaised && !isEyebrowsRaised) {
      console.log("Eyebrows raised!");
      isEyebrowsRaised = true; // Set to true to prevent continuous logging
    } else if (!leftEyebrowRaised && !rightEyebrowRaised && isEyebrowsRaised) {
      isEyebrowsRaised = false; // Reset if eyebrows are not raised anymore
    }

    // Detect eye closure
    const leftUpperEyelid = landmarks[159]; // Top point of left eye
    const leftLowerEyelidHeight = landmarks[145]; // Bottom point of left eye
    const rightUpperEyelid = landmarks[386]; // Top point of right eye
    const rightLowerEyelidHeight = landmarks[374]; // Bottom point of right eye

    const leftEyeHeight = Math.abs(leftUpperEyelid.y - leftLowerEyelidHeight.y);
    const rightEyeHeight = Math.abs(
      rightUpperEyelid.y - rightLowerEyelidHeight.y
    );

    // Set baseline for eye open state in the first frame
    if (!eyeBaseline) {
      eyeBaseline = {
        left: leftEyeHeight,
        right: rightEyeHeight,
      };
    }

    const eyeClosedThreshold = 0.4; // Adjust this based on testing

    // Check if eyes are closed
    const eyesClosed =
      leftEyeHeight / eyeBaseline.left < eyeClosedThreshold &&
      rightEyeHeight / eyeBaseline.right < eyeClosedThreshold;

    if (eyesClosed) {
      if (!eyeClosedStart) {
        // If eyes are closed and it's the first time, record the start time
        eyeClosedStart = new Date();
      } else {
        const currentTime = new Date();
        const closedDuration = (currentTime - eyeClosedStart) / 1000; // Convert to seconds

        if (closedDuration >= 3) {
          console.log("You seem bored!");
        }
      }
    } else {
      // Reset the eyeClosedStart if eyes are open
      eyeClosedStart = null;
    }

    // Detect if the mouth is open wide
    const upperLip = landmarks[13]; // Upper lip point
    const lowerLip = landmarks[14]; // Lower lip point
    const mouthHeight = Math.abs(upperLip.y - lowerLip.y);

    // Set baseline for mouth in the first frame
    if (!mouthBaseline) {
      mouthBaseline = mouthHeight;
    }

    // Absolute threshold for detecting if the mouth is open wide
    const mouthOpenAbsoluteThreshold = 0.1; // Set this value based on testing

    if (mouthHeight - mouthBaseline > mouthOpenAbsoluteThreshold) {
      console.log("Mouth is open wide!");
    }

    // Draw facial landmarks
    drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {
      color: "#C0C0C070",
      lineWidth: 1,
    });
    drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {
      color: "#FF3030",
    });
    drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, {
      color: "#FF3030",
    });
    drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {
      color: "#30FF30",
    });
    drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, {
      color: "#30FF30",
    });
    drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {
      color: "#E0E0E0",
    });
    drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, { color: "#E0E0E0" });
  }

  canvasCtx.restore();
});

//-------------------------------------------------ARTIST BOT-------------------------------------------------
//function to randomize the artist's mood
function randomizeMood() {
  let randomizedMood = Math.floor(Math.random() * 15);

  //set mood based on the randomized number
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

  //changing the mood to "impatient" after 20 seconds
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

let moodColor = [60, 100, 100];

//changes the color of the facial features based on the mood in HSB
//the mood is a variable because we dont want the color to change with the impatient mood
function applyMoodColorFilter() {
  if (mood === "sad") {
    moodColor = [240, 100, 67];
    tint(...moodColor);
  } else if (mood === "angry") {
    moodColor = [0, 100, 100];
    tint(...moodColor);
  } else if (mood === "mischievous") {
    moodColor = [266, 100, 50];
    tint(...moodColor);
  } else if (mood === "benevolent") {
    moodColor = [327, 100, 100];
    tint(...moodColor);
  } else if (mood === "happy") {
    moodColor = [50, 100, 100];
    tint(...moodColor);
  } else if (mood === "impatient") {
    tint(...moodColor);
  }
}

//-------------------------------------------------FACE ADD-ONS-------------------------------------------------
//used help from ChatGPT to get this part to work: begins here
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

//display random facial features from the array
function displayFilter() {
  let xPositions = [300, 280, 320, 310, 300];
  let yPositions = [200, 160, 220, 240, 270];

  // Ensure the filters array has been populated before trying to display them
  if (filtersShowing.length > 0) {
    for (let i = 0; i < filtersShowing.length; i++) {
      if (filtersShowing[i]) {
        // Ensure each image is defined
        applyMoodColorFilter();
        image(filtersShowing[i], xPositions[i], yPositions[i], 200, 100);
      }
    }
  }
  noTint(); // Reset any color tint after filters
}

let videoReady = false; // To check if video is ready

function draw() {
  // Clear the canvas first
  clear();

  // Ensure video is ready before drawing it
  if (videoReady) {
    // First, draw the video on the canvas
    image(videoElement, 0, 0, 740, 580);

    // Then, draw the filters on top of the video
    displayFilter(); // Call your filter display logic after the video is rendered
  }
}

//-------------------------------------------------CAMERA SETUP-------------------------------------------------

// Start camera and run faceMesh
setupCamera()
  .then((video) => {
    video.play();
    const detectFaces = async () => {
      await faceMesh.send({ image: video });

      // Continue the video and face detection even if no face is detected
      requestAnimationFrame(detectFaces);
    };
    detectFaces();
    randomizeMood();
  })
  .catch((error) => {
    console.error("Camera setup failed:", error);
  });
