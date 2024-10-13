const videoElement = document.querySelector(".input_video");
const canvasElement = document.querySelector(".output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const loadingScreen = document.querySelector(".loading");

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
  } catch (error) {
    console.error("Error accessing the camera: ", error);
    alert("Please allow camera access and reload the page.");
    throw error;
  }
}

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
    const leftEye = landmarks[159]; // A point on the left eye
    const rightEye = landmarks[386]; // A point on the right eye
    const leftEyebrow = landmarks[70]; // A point on the left eyebrow
    const rightEyebrow = landmarks[300]; // A point on the right eyebrow

    // Calculate the vertical distance between eyes and eyebrows
    const leftEyeToEyebrow = Math.abs(leftEyebrow.y - leftEye.y);
    const rightEyeToEyebrow = Math.abs(rightEyebrow.y - rightEye.y);

    // Set baseline for eyebrows if it's the first frame
    if (!baselineDistance) {
      baselineDistance = {
        left: leftEyeToEyebrow,
        right: rightEyeToEyebrow,
      };
    }

    // Check if the eyebrows are raised (by comparing with the baseline)
    const raiseThreshold = 0.02; // Adjust this threshold based on testing
    if (
      leftEyeToEyebrow - baselineDistance.left > raiseThreshold &&
      rightEyeToEyebrow - baselineDistance.right > raiseThreshold
    ) {
      console.log("Eyebrows raised!");
    }

    // Detect eye closure
    const leftUpperEyelid = landmarks[159]; // Top point of left eye
    const leftLowerEyelid = landmarks[145]; // Bottom point of left eye
    const rightUpperEyelid = landmarks[386]; // Top point of right eye
    const rightLowerEyelid = landmarks[374]; // Bottom point of right eye

    const leftEyeHeight = Math.abs(leftUpperEyelid.y - leftLowerEyelid.y);
    const rightEyeHeight = Math.abs(rightUpperEyelid.y - rightLowerEyelid.y);

    // Set baseline for eye open state in the first frame
    if (!eyeBaseline) {
      eyeBaseline = {
        left: leftEyeHeight,
        right: rightEyeHeight,
      };
    }

    // Threshold for detecting if the eye is closed
    const eyeClosedThreshold = 0.4; // Adjust this based on testing

    if (
      leftEyeHeight / eyeBaseline.left < eyeClosedThreshold &&
      rightEyeHeight / eyeBaseline.right < eyeClosedThreshold
    ) {
      console.log("Eyes are closed!");
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
  })
  .catch((error) => {
    console.error("Camera setup failed:", error);
  });
