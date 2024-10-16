// Wait for the window to fully load before running the script
window.addEventListener("load", () => {
    // Load the face-api models
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"), // Load landmark model
    ]).then(startVideo);
  });
  
  // Start video stream from webcam
  function startVideo() {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => (video.srcObject = stream))
      .catch((err) => console.error("Error accessing the camera: ", err));
    randomizeMood();
  }
  
  const video = document.getElementById("video");
  
  // Arrays for different eyes and other features
  let happyEyesArray = [];
  let happyMouthArray = [];
  let noseArray = [];
  
  // Happy eyes
  const eyeNormal = new Image();
  eyeNormal.src = "images/eye-normal.PNG";
  const eyeRound = new Image();
  eyeRound.src = "images/eye-round.PNG";
  const eyeSmile = new Image();
  eyeSmile.src = "images/eye-smile.PNG";
  happyEyesArray = [eyeNormal, eyeRound, eyeSmile];
  
  // Noses
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
  
  // Happy mouth
  const lipKiss = new Image();
  lipKiss.src = "images/lip-kiss.PNG"; 
  const lipEdge = new Image();
  lipEdge.src = "images/lip-edge.PNG"; 
  const lipTounge = new Image();
  lipTounge.src = "images/lip-tounge.PNG"; 
  happyMouthArray = [lipKiss, lipEdge, lipTounge];
  
  // Set up canvas and Face API detection
  video.addEventListener("play", () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    const videoContainer = document.getElementById("video-container");
    videoContainer.append(canvas);
  
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);
  
    // Select random images ONCE when the video starts
    const randomEyeImage = happyEyesArray[Math.floor(Math.random() * happyEyesArray.length)];
    const randomNoseImage = noseArray[Math.floor(Math.random() * noseArray.length)];
    const randomMouthImage = happyMouthArray[Math.floor(Math.random() * happyMouthArray.length)];
  
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
  
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  
      if (resizedDetections.length > 0) {
        const landmarks = resizedDetections[0].landmarks;
  
        // Get the eye positions
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
  
        // Get the nose position
        const nose = landmarks.getNose();
  
        // Get the mouth position
        const mouth = landmarks.getMouth();
  
        // Positions for eyes
        const eyeWidth = 90;
        const eyeHeight = 40;
        const leftEyePosition = { x: leftEye[3].x - eyeWidth / 2, y: leftEye[3].y - eyeHeight / 2 };
        const rightEyePosition = { x: rightEye[3].x - eyeWidth / 2, y: rightEye[3].y - eyeHeight / 2 };
  
        // Position for nose
        const noseWidth = 40;
        const noseHeight = 40;
        const nosePosition = { x: nose[3].x - noseWidth / 2, y: nose[3].y - noseHeight / 2 };
  
        // Position for mouth
        const mouthWidth = 60;
        const mouthHeight = 40;
        const mouthPosition = { x: mouth[0].x - mouthWidth / 2, y: mouth[3].y - mouthHeight / 2 };
  
        const canvasCtx = canvas.getContext("2d");
  
        // Draw the SAME images over the detected positions in every frame
        canvasCtx.drawImage(randomEyeImage, leftEyePosition.x, leftEyePosition.y, eyeWidth, eyeHeight);
        canvasCtx.drawImage(randomEyeImage, rightEyePosition.x, rightEyePosition.y, eyeWidth, eyeHeight);
        canvasCtx.drawImage(randomNoseImage, nosePosition.x, nosePosition.y, noseWidth, noseHeight);
        canvasCtx.drawImage(randomMouthImage, mouthPosition.x, mouthPosition.y, mouthWidth, mouthHeight);
      }
    }, 100);
  });
  
/*
//Connects emotion of the user and the mood of the artist and randomises images from that
function emotionAndMood(){
    if (emotion === emotion.happy && artistMood === normal){
       
    } else if (emotion === emotion.happy && artistMood === mischievous) {

    } else if (emotion === emotion.happy && artistMood === mischievous) {

    }
}
*/