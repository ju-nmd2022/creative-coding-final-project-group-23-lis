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
      
        //set mood based on the randomized number
        if (randomizedMood <= 2) {
          mood = "benevolent";
        } else if (randomizedMood <= 5) {
          mood = "mischievous";
        } else if (randomizedMood <= 8) {
          mood = "normal";
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
/*
    // Update the displayed image and comment based on the current mood
    if (mood === "neutral") {
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
    */
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
  
    if (mode === "benevolent") {
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
    } else if (mood === "mischievous") {
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
    } else if (mood === "normal") {
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
  
    updateMoodImages(emotion, mood);
    displayCurrentMood(mood);
  }

  //-------------------------------NORMAL ART-------------------------------
  function drawHappyNeutralArt() {
    console.log("Drawing normal happy art");
    document.getElementById("happy-image").style.display = "block";
    comment.innerHTML = getRandomNeuComment("happy");
    generateDynamicArt("happy");
  }
  
  function drawSadNeutralArt() {
    console.log("Drawing normal sad art");
    document.getElementById("sad-image").style.display = "block";
    comment.innerHTML = getRandomNeuComment("sad");
    generateDynamicArt("sad");
  }
  
  function drawAngryNeutralArt() {
    console.log("Drawing normal angry art");
    document.getElementById("angry-image").style.display = "block";
    comment.innerHTML = getRandomNeuComment("angry");
    generateDynamicArt("angry");
  }
  
  let lastDrawnEmotion = null; // Variable to store the last drawn emotion
  
  function generateDynamicArt(emotion) {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
  
    // Avoid drawing again if the same emotion is displayed
    if (emotion === lastDrawnEmotion) return;
  
    const ctx = canvas.getContext("2d");
    //ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawing
  
    // Adjust canvas size to video size
    const videoElement = document.getElementById("video");
    const displaySize = {
      width: videoElement.videoWidth,
      height: videoElement.videoHeight,
    };
    faceapi.matchDimensions(canvas, displaySize);
  }



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
    video.style.filter = getRandomMiscFilter("sad");
  }
  
  function drawAngryMiscArt() {
    console.log("Drawing angry art in misc mode");
    document.getElementById("mischievous-image").style.display = "block";
    comment.innerHTML = getRandomMischievousComment("angry");
    video.style.filter = getRandomMiscFilter("angry");
  }
  
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
    happy: [
      "brightness(1.5) saturate(1.5)", // Filter 1
      "brightness(1.7) saturate(1.6)", // Filter 2
      "sepia(0.5) contrast(1.2)", // Filter 3
    ],
    sad: [
      "grayscale(1) brightness(0.7)", // Filter 1
      "grayscale(1) brightness(0.7)", // Filter 2
      "grayscale(1) brightness(0.5) contrast(1.3)", // Filter 3
    ],
    angry: [
      "contrast(1.5) saturate(2)", // Filter 1
      "contrast(1.8) saturate(2)", // Filter 2
      "contrast(1.5) saturate(2) hue-rotate(180deg)",
    ],
  };


function getRandomMiscFilter(emotion) {
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

// -----------------DRAWING THE IMAGES ON USER IF MOOD = NORMAL----------------

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
