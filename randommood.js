// Wait for the window to fully load before running the script
window.addEventListener("load", () => {
    // Load the face-api models
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"), // Load landmark model
    ]).then(startVideo);
  });

  //-------------------------------SET UP-------------------------------
  // Start video stream from webcam
  function startVideo() {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => (video.srcObject = stream))
      .catch((err) => console.error("Error accessing the camera: ", err));
      randomizeMood();
  }


    let sadArtist, happyArtist, angryArtist, misArtist, benArtist, impatientArtist;
    let mood = "happy";
    let comment = document.getElementById("artist-comment");
    let moodTimeout;
    let happyEyesArray = [];
    let angryEyesArray = [];
    let sadEyesArray = [];
    let happyMouthArray = [];
    let angryMouthArray = [];
    let sadMouthArray = [];
    let noseArray = [];
    
     
const lipBiteImg = document.getElementById("lip-bite"); 
  const video = document.getElementById("video");

  function preload() {

    //the artist mood images
    sadArtist = loadImage("images/artist-sad.PNG", () => console.log("Sad image loaded."), () => console.error("Failed to load sad image."));
    happyArtist = loadImage("images/artist-happy.PNG", () => console.log("Happy image loaded."), () => console.error("Failed to load happy image."));
    angryArtist = loadImage("images/artist-angry.PNG", () => console.log("Angry image loaded."), () => console.error("Failed to load angry image."));
    misArtist = loadImage("images/artist-mis.PNG", () => console.log("Mischievous image loaded."), () => console.error("Failed to load mischievous image."));
    benArtist = loadImage("images/artist-ben.PNG", () => console.log("Benevolent image loaded."), () => console.error("Failed to load benevolent image."));
    impatientArtist = loadImage("images/artist-impatient.PNG", () => console.log("Impatient image loaded."), () => console.error("Failed to load impatient image."));

    //sad eyes
    const eyeDrip = new Image();
    eyeDrip.src = "images/eye-drip.PNG"; 
    const eyeShiny = new Image();
    eyeShiny.src = "images/eye-shiny.PNG"; 
    const eyeCry = new Image();
    eyeCry.src = "images/eye-cry.PNG"; 
    sadEyesArray = [eyeDrip, eyeShiny, eyeCry];

    //happy eyes
    const eyeNormal = new Image();
    eyeNormal.src = "images/eye-normal.PNG"; 
    const eyeRound = new Image();
    eyeRound.src = "images/eye-round.PNG"; 
    const eyeSmile = new Image();
    eyeSmile.src = "images/eye-smile.PNG"; 
    happyEyesArray = [eyeNormal, eyeRound, eyeSmile];

    //angry eyes
    const eyeMad = new Image();
    eyeMad.src = "images/eye-mad.PNG"; 
    const eyeClose = new Image();
    eyeClose.src = "images/eye-close.PNG"; 
    const eyeZombie = new Image();
    eyeZombie.src = "images/eye-zombie.PNG"; 
    happyEyesArray = [eyeMad, eyeClose, eyeZombie];


    //nose array
    const noseSeptum = new Image();
    noseSeptum.src = "images/nose-septum.PNG"; 
    const nosePig = new Image();
    nosePig.src = "images/nose-pig.PNG"; 
    const noseFat = new Image();
    noseFat.src = "images/nose-fat.PNG"; 
    const noseRound = new Image();
    noseRound.src = "images/nose-round.PNG"; 
    const noseWings = new Image();
    noseWings.src = "images/nose-wings.PNG"; 
    noseArray = [noseSeptum, nosePig, noseFat, noseRound, noseWings];

    //sad lip
    const lipBite = new Image();
    lipBite.src = "images/lip-bite.PNG"; 
    const lipFrown= new Image();
    lipFrown.src = "images/lip-frown.PNG"; 
    const lipSad = new Image();
    lipSad.src = "images/lip-sad.PNG"; 
    sadLipArray = [lipBite, lipFrown, lipSad];

    //happy lip
    const lipKiss = new Image();
    lipKiss.src = "images/lip-kiss.PNG"; 
    const lipEdge = new Image();
    lipEdge.src = "images/lip-edge.PNG"; 
    const lipTounge = new Image();
    lipTounge.src = "images/lip-tounge.PNG"; 
    happyLipArray = [lipKiss, lipEdge, lipTounge];

    //angry lip
    const lipWide = new Image();
    lipWide.src = "images/lip-wide.PNG"; 
    const lipCrooked = new Image();
    lipCrooked.src = "images/lip-crooked.PNG"; 
    const lipOpen = new Image();
    lipOpen.src = "images/lip-open.PNG"; 
    angryLipArray = [lipWide, lipCrooked, lipOpen];
    
  }

    //-------------------------------ARTIST BOT-------------------------------

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

  //-------------------------------FACE-------------------------------
  //used help from ChatGPT to get this part to work: begins here
function filterObject() {
    filtersShowing = [];

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

  //-------------------------------FACE API-------------------------------

function modelLoaded() {
    console.log("Model Loaded!");
}

const eyeImage = new Image();
eyeImage.src = "images/eyes-zombie.png"; // Path to your image (e.g., a sticker for the eyes)

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
        // Overlay image on top of the eyes
      if (resizedDetections.length > 0) {
        const landmarks = resizedDetections[0].landmarks;

        // Get the eye positions (unmirrored)
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();

        // Calculate positions to draw the image over the eyes
        const eyeWidth = 90; // Set the width for the image
        const eyeHeight = 40; // Set the height for the image
        const leftEyePosition = {
          x: leftEye[3].x - eyeWidth / 2, // Center image over the left eye
          y: leftEye[3].y - eyeHeight / 12,
        };
        const rightEyePosition = {
          x: rightEye[3].x - eyeWidth / 2, // Center image over the right eye
          y: rightEye[3].y - eyeHeight / 12,
        };
        const canvasCtx = canvas.getContext("2d");

        // Draw the images over the eyes
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
      }
      if (detections.length > 0) {
        const emotions = detections[0].expressions;
        const maxEmotion = Object.keys(emotions).reduce((a, b) =>
          emotions[a] > emotions[b] ? a : b
        );

        // Log when "sad" emotion is detected
        if (maxEmotion === "sad") {
          console.log("Emotion detected: Sad");
        }

        // Get the bounding box of the detected face
        const box = detections[0].detection.box;

        // Set the position of the emotion box based on the face box
        const emotionBoxX = box.x + box.width / 2; // Center the text on the face
        const emotionBoxY = box.y - 10; // Position above the face

        document.getElementById("emotion").style.position = "absolute";
        document.getElementById("emotion").style.left = `${emotionBoxX}px`;
        document.getElementById("emotion").style.top = `${emotionBoxY}px`;
        document.getElementById("emotion").textContent = `${maxEmotion} (${(
          emotions[maxEmotion] * 100
        ).toFixed(2)}%)`;

        // Draw the lip bite image on the canvas
        const imgWidth = 100; // Set the desired width of the image
        const imgHeight =
          (lipBiteImg.naturalHeight / lipBiteImg.naturalWidth) * imgWidth; // Maintain aspect ratio
        const imgX = box.x + box.width / 2 - imgWidth / 2; // Center the image on the face
        const imgY = box.y - imgHeight; // Position above the face

        const ctx = canvas.getContext("2d");
        ctx.drawImage(lipBiteImg, imgX, imgY, imgWidth, imgHeight);
      }
    }, 100);
  });
  
//Connects emotion of the user and the mood of the artist and randomises images from that
function emotionAndMood(){
    if (emotion === emotion.happy && artistMood === normal){
        filtersShowing = []; 
            filterObject();
    } else if (emotion === emotion.happy && artistMood === mischievous) {

    } else if (emotion === emotion.happy && artistMood === mischievous) {

    }
}






