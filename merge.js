
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

  //-------------------------------FILTERS-------------------------------

  let headFilterArray = [];
  let browsFilterArray = [];
  let eyesFilterArray = [];
  let noseFilterArray = [];
  let lipFilterArray = [];
  let filtersShowing = []; 

//   //FILTERS FOR EACH MOOD
//   const filters = {
//     benevolent: [
//         "brightness(1.2) contrast(1.1) saturate(1.5) blur(0px)",
//         "brightness(1.3) contrast(1.2) saturate(1.8) blur(0px)",
//         "brightness(1.1) contrast(1.3) saturate(2) blur(1px)"
//     ],
//     mischievous: [
//         "hue-rotate(60deg) contrast(0.8) saturate(2) blur(2px)",
//         "hue-rotate(90deg) contrast(1.1) saturate(1.5) blur(1px)",
//         "hue-rotate(45deg) contrast(0.7) saturate(2.5) blur(3px)"
//     ],
//     angry: [
//         "hue-rotate(-60deg) contrast(1.5) saturate(0.5) blur(4px)",
//         "hue-rotate(-90deg) contrast(1.8) saturate(0.4) blur(5px)",
//         "hue-rotate(-30deg) contrast(1.3) saturate(0.6) blur(3px)"
//     ],
//     sad: [
//         "grayscale(1) contrast(0.8) blur(3px)",
//         "grayscale(0.9) contrast(0.7) blur(4px)",
//         "grayscale(1) contrast(0.6) blur(5px)"
//     ],
//     happy: [
//         "brightness(1.4) contrast(1.2) saturate(1.8)",
//         "brightness(1.5) contrast(1.3) saturate(2)",
//         "brightness(1.3) contrast(1.1) saturate(1.6)"
//     ]
// };

// function applyRandomFilterForMood() {
//     let selectedFilter;

//     // Check the current mood and select a random filter from the corresponding category
//     if (mood === "benevolent") {
//         selectedFilter = filters.benevolent[Math.floor(Math.random() * filters.benevolent.length)];
//     } else if (mood === "mischievous") {
//         selectedFilter = filters.mischievous[Math.floor(Math.random() * filters.mischievous.length)];
//     } else if (mood === "angry") {
//         selectedFilter = filters.angry[Math.floor(Math.random() * filters.angry.length)];
//     } else if (mood === "sad") {
//         selectedFilter = filters.sad[Math.floor(Math.random() * filters.sad.length)];
//     } else if (mood === "happy") {
//         selectedFilter = filters.happy[Math.floor(Math.random() * filters.happy.length)];
//     } else if (mood === "impatient") {
//         selectedFilter = filters.impatient[Math.floor(Math.random() * filters.impatient.length)];
//     }

//     // Apply the selected filter to the element (assumed to be a video or an image)
//     video.style.filter = selectedFilter;
// }

  //-------------------------------ARTIST BOT-------------------------------
    let sadArtist, happyArtist, angryArtist, misArtist, benArtist, impatientArtist;
    let comment = document.getElementById("artist-comment");
    let moodTimeout; 


    function preload() {
    //IMAGES FOR THE ARTIST EMOTIONS
    sadArtist = loadImage("images/artist-sad.PNG", () => console.log("Sad image loaded."), () => console.error("Failed to load sad image."));
    happyArtist = loadImage("images/artist-happy.PNG", () => console.log("Happy image loaded."), () => console.error("Failed to load happy image."));
    angryArtist = loadImage("images/artist-angry.PNG", () => console.log("Angry image loaded."), () => console.error("Failed to load angry image."));
    misArtist = loadImage("images/artist-mis.PNG", () => console.log("Mischievous image loaded."), () => console.error("Failed to load mischievous image."));
    benArtist = loadImage("images/artist-ben.PNG", () => console.log("Benevolent image loaded."), () => console.error("Failed to load benevolent image."));
    impatientArtist = loadImage("images/artist-impatient.PNG", () => console.log("Impatient image loaded."), () => console.error("Failed to load impatient image."));
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
    // applyRandomFilterForMood();

    function updateMoodImages() {
        document.getElementById("sad-image").style.display = "none";
        document.getElementById("angry-image").style.display = "none";
        document.getElementById("mischievous-image").style.display = "none";
        document.getElementById("benevolent-image").style.display = "none";
        document.getElementById("happy-image").style.display = "none";
        document.getElementById("impatient-image").style.display = "none"; 
    
        const videoElement = document.getElementById("video");
        
        if (mood === "sad") {
            document.getElementById("sad-image").style.display = "block";
            comment.innerHTML = "Oh... I guess I could paint you blue :(";
            videoElement.style.filter = filters.sad;
        } else if (mood === "angry") {
            document.getElementById("angry-image").style.display = "block";
            comment.innerHTML = "AARRGH!!! Here you go stupid, I'll paint you in red >:(";
            videoElement.style.filter = filters.angry;
        } else if (mood === "mischievous") {
            document.getElementById("mischievous-image").style.display = "block";
            comment.innerHTML = "Look at you! Ridiculous. This is how you look, haha! >:)";
            videoElement.style.filter = filters.mischievous;
        } else if (mood === "benevolent") {
            document.getElementById("benevolent-image").style.display = "block";
            comment.innerHTML = "Aww, you look lovely today, let's make you look even cuter! :)";
            videoElement.style.filter = filters.benevolent;
        } else if (mood === "happy") {
            document.getElementById("happy-image").style.display = "block";
            comment.innerHTML = "Ah look, I can paint you in a lovely yellow shade :D";
            videoElement.style.filter = filters.happy;
        } else if (mood === "impatient") {
            document.getElementById("impatient-image").style.display = "block";
            comment.innerHTML = "I'm a little impatient, and this is boring. If you don't do something interesting soon, my mood will change.";
            videoElement.style.filter = filters.impatient;
        }
    }

    
    
    
    //ARTIST GETS IMPATIENT AFTER 20S IF NOTHING TRIGGERS AN EMOTION
    moodTimeout = setTimeout(() => {
        transitionToImpatient();
    }, 20000); 

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
function filterObject() {
    filtersShowing = [];

    let randomHead = headFilterArray[Math.floor(Math.random() * headFilterArray.length)];
    let randomBrows = browsFilterArray[Math.floor(Math.random() * browsFilterArray.length)];
    let randomEyes = eyesFilterArray[Math.floor(Math.random() * eyesFilterArray.length)];
    let randomNose = noseFilterArray[Math.floor(Math.random() * noseFilterArray.length)];
    let randomLips = lipFilterArray[Math.floor(Math.random() * lipFilterArray.length)];

    filtersShowing.push(randomHead, randomBrows, randomEyes, randomNose, randomLips);
}


  //-------------------------------FACE API-------------------------------

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

        if (detections.length > 0) {
            const emotions = detections[0].expressions;
            const maxEmotion = Object.keys(emotions).reduce((a, b) =>
              emotions[a] > emotions[b] ? a : b
            );
        
        
            // Display emotion in UI
            const box = detections[0].detection.box;
            const emotionBoxX = box.x + box.width / 2;
            const emotionBoxY = box.y - 10;
        
            document.getElementById("emotion").style.position = "absolute";
            document.getElementById("emotion").style.left = `${emotionBoxX}px`;
            document.getElementById("emotion").style.top = `${emotionBoxY}px`;
            document.getElementById("emotion").textContent = `${maxEmotion} (${(
              emotions[maxEmotion] * 100
            ).toFixed(2)}%)`;
            
        if (maxEmotion === "happy") {
        const moodRoute = Math.random(); // Random number to decide route
        let mood = "";
        let filters = [];
  
        if (moodRoute < 0.33) {
          // Benevolent route: vibrant, uplifting filters
          mood = "benevolent";
          filters = [
            "saturate(2)",      // Increase color saturation
            "brightness(1.5)",  // Make the image brighter
            "contrast(1.2)",    // Enhance contrast
            "hue-rotate(30deg)" // Add a warm color tone
          ];
          comment.innerHTML = "You're happy! Let me make you look even more amazing!";
        } else if (moodRoute >= 0.33 && moodRoute < 0.66) {
          // Mischievous route: darker, ruder filters
          mood = "mischievous";
          filters = [
            "invert(100%)",    // Invert the colors
            "brightness(0.6)", // Make it darker
            "contrast(200%)",  // High contrast for a harsh look
            "saturate(0.5)"    // Desaturate the colors
          ];
          comment.innerHTML = "Oh, you're happy? Let me add a little twist!";
        } else {
          // Normal route: semi-happy filter
          mood = "normal";
          filters = [
            "saturate(1.1)",    // Slightly increase saturation
            "brightness(1.1)",  // Slightly brighten
            "contrast(1.05)",   // A little contrast
          ];
          comment.innerHTML = "You're happy! Here’s a little something to match your vibe.";
        }
  
        // Apply the chosen filters to the video or artwork
        applyFilters(filters);
        updateMoodImages(mood);
      }

            // Trigger artist's mood based on user emotion
      }
      
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

      }
    }, 100);
  });
}

// Apply filters to the video
function applyFilters(filters) {
    // Apply all the filters passed to the function
    video.style.filter = filters.join(" ");
  }
  
  // Update the displayed mood images based on the current mood
  function updateMoodImages(mood) {
    // Hide all mood images first
    document.getElementById("benevolent-image").style.display = "none";
    document.getElementById("mischievous-image").style.display = "none";
    document.getElementById("normal-image").style.display = "none";
  
    // Show the correct image for the current mood
    if (mood === "benevolent") {
      document.getElementById("benevolent-image").style.display = "block";
    } else if (mood === "mischievous") {
      document.getElementById("mischievous-image").style.display = "block";
    } else if (mood === "normal") {
      document.getElementById("normal-image").style.display = "block";
    }
  }
