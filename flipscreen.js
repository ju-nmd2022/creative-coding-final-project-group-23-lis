// Wait for the window to fully load before running the script
window.addEventListener("load", () => {
    // Load the face-api models
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]).then(startVideo);
  });

  //-------------------------------SET UP-------------------------------
  // Start video stream from webcam
  function startVideo() {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        video.srcObject = stream;
        video.style.transform = "scaleX(-1)"; // Invert the video
      })
      .catch((err) => console.error("Error accessing the camera: ", err));
    
    randomizeMood();
  }
  

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
  
  const video = document.getElementById("video");

  function preload() {

    //the artist mood images
    sadArtist = loadImage("images/artist-sad.PNG", () => console.log("Sad image loaded."), () => console.error("Failed to load sad image."));
    happyArtist = loadImage("images/artist-happy.PNG", () => console.log("Happy image loaded."), () => console.error("Failed to load happy image."));
    angryArtist = loadImage("images/artist-angry.PNG", () => console.log("Angry image loaded."), () => console.error("Failed to load angry image."));
    misArtist = loadImage("images/artist-mis.PNG", () => console.log("Mischievous image loaded."), () => console.error("Failed to load mischievous image."));
    benArtist = loadImage("images/artist-ben.PNG", () => console.log("Benevolent image loaded."), () => console.error("Failed to load benevolent image."));
    impatientArtist = loadImage("images/artist-impatient.PNG", () => console.log("Impatient image loaded."), () => console.error("Failed to load impatient image."));
  
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
    lipCrooked= loadImage("images/lip-crooked.PNG");
    lipOpen = loadImage("images/lip-open.PNG");
    lipFilterArray = [lipBite, lipCrooked, lipOpen];
  }

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
        comment.innerHTML = "AARRGH!!! Here you go stupid, I'll paint you in red >:(";
        filtersShowing = []; 
        filterObject();
    } else if (mood === "mischievous") {
        document.getElementById("mischievous-image").style.display = "block";
        comment.innerHTML = "Look at you! Ridicolous. This is how you look, haha! >:)";
        filtersShowing = []; 
        filterObject();
    } else if (mood === "benevolent") {
        document.getElementById("benevolent-image").style.display = "block";
        comment.innerHTML = "Aww, you look lovely today, let's make you look even cuter! :)";
        filtersShowing = []; 
        filterObject();
    } else if (mood === "happy") {
        document.getElementById("happy-image").style.display = "block";
        comment.innerHTML = "Ah look, I can paint you in a lovely yellow shade :D";
        filtersShowing = []; 
        filterObject();
    } else if (mood === "impatient") {
        document.getElementById("impatient-image").style.display = "block";
        comment.innerHTML = "I'm a little impatient, and this is boring. If you don't do something interesting soon, my mood will change.";
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
  //used help from ChatGPT to get this part to work: begins here
function filterObject() {
    filtersShowing = [];

    let randomHead = headFilterArray[Math.floor(Math.random() * headFilterArray.length)];
    let randomBrows = browsFilterArray[Math.floor(Math.random() * browsFilterArray.length)];
    let randomEyes = eyesFilterArray[Math.floor(Math.random() * eyesFilterArray.length)];
    let randomNose = noseFilterArray[Math.floor(Math.random() * noseFilterArray.length)];
    let randomLips = lipFilterArray[Math.floor(Math.random() * lipFilterArray.length)];

    filtersShowing.push(randomHead, randomBrows, randomEyes, randomNose, randomLips);
}

//display random facial features from the array
function displayFilter() {
    let xPositions = [300, 280, 320, 310, 300]; 
    let yPositions = [200, 160, 220, 240, 270];  

    for (let i = 0; i < filtersShowing.length; i++) {
        applyMoodColorFilter();
        image(filtersShowing[i], xPositions[i], yPositions[i], 200, 100); 
    }
    noTint();
}

function setup() {
    // Create a canvas (use the appropriate size based on your video element)
    let canvas = createCanvas(720, 480);
    canvas.parent("video-container");

    // Set color mode to HSB
    colorMode(HSB);
}
//ChatGPT help: ends here

function modelLoaded() {
    console.log("Model Loaded!");
}
video.addEventListener("play", () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    const videoContainer = document.getElementById("video-container");
    videoContainer.append(canvas); // Append canvas inside video container
  
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);
  
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();
  
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  
      if (resizedDetections.length > 0) {
        // Get the face with the highest confidence score
        const bestFace = resizedDetections.reduce((prev, current) =>
          prev.detection.score > current.detection.score ? prev : current
        );
  
        // Draw only the best face detection and its expressions
        faceapi.draw.drawDetections(canvas, [bestFace]);
        faceapi.draw.drawFaceExpressions(canvas, [bestFace]);
  
        // Display the primary emotion
        const emotions = bestFace.expressions;
        const maxEmotion = Object.keys(emotions).reduce((a, b) =>
          emotions[a] > emotions[b] ? a : b
        );
        document.getElementById("emotion").textContent = `${maxEmotion} (${(
          emotions[maxEmotion] * 100
        ).toFixed(2)}%)`;
      }
    }, 100);
  });
  
  