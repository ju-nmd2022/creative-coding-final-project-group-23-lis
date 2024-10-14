const videoElement = document.querySelector(".input_video");
const canvasElement = document.querySelector(".output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const loadingScreen = document.querySelector(".loading");

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

const faceMesh = new FaceMesh({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
});

faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

let baselineDistance = null;
let eyeBaseline = null;
let mouthBaseline = null;

let eyesClosedTime = 0;
let isEyesClosed = false;

faceMesh.onResults((results) => {
  document.body.classList.add("loaded");

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  canvasCtx.translate(canvasElement.width, 0);
  canvasCtx.scale(-1, 1);

  canvasCtx.drawImage(
    videoElement,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    const landmarks = results.multiFaceLandmarks[0];

    const leftEye = landmarks[159];
    const rightEye = landmarks[386];
    const leftEyebrow = landmarks[70];
    const rightEyebrow = landmarks[300];

    const leftEyeToEyebrow = Math.abs(leftEyebrow.y - leftEye.y);
    const rightEyeToEyebrow = Math.abs(rightEyebrow.y - rightEye.y);

    if (!baselineDistance) {
      baselineDistance = {
        left: leftEyeToEyebrow,
        right: rightEyeToEyebrow,
      };
    }

    const raiseThreshold = 0.02;
    if (
      leftEyeToEyebrow - baselineDistance.left > raiseThreshold &&
      rightEyeToEyebrow - baselineDistance.right > raiseThreshold
    ) {
      console.log("Eyebrows raised");
    }

    const leftUpperEyelid = landmarks[159];
    const leftLowerEyelid = landmarks[145];
    const rightUpperEyelid = landmarks[386];
    const rightLowerEyelid = landmarks[374];

    const leftEyeHeight = Math.abs(leftUpperEyelid.y - leftLowerEyelid.y);
    const rightEyeHeight = Math.abs(rightUpperEyelid.y - rightLowerEyelid.y);

    if (!eyeBaseline) {
      eyeBaseline = {
        left: leftEyeHeight,
        right: rightEyeHeight,
      };
    }

    const eyeClosedThreshold = 0.4;

    if (
      leftEyeHeight / eyeBaseline.left < eyeClosedThreshold &&
      rightEyeHeight / eyeBaseline.right < eyeClosedThreshold
    ) {
      if (!isEyesClosed) {
        isEyesClosed = true;
        eyesClosedTime = 0;
      }

      eyesClosedTime += 1 / 30; // Assuming this function is called approximately every 30ms

      if (eyesClosedTime >= 5) {
        console.log("Boredom detected! Eyes have been closed for 5 seconds.");
        // ADD CODE HERE FOR BOREDOM EMOTION
      }
    } else {
      isEyesClosed = false;
      eyesClosedTime = 0;
    }

    const upperLip = landmarks[13];
    const lowerLip = landmarks[14];
    const mouthHeight = Math.abs(upperLip.y - lowerLip.y);

    if (!mouthBaseline) {
      mouthBaseline = mouthHeight;
    }

    const mouthOpenAbsoluteThreshold = 0.1;

    if (mouthHeight - mouthBaseline > mouthOpenAbsoluteThreshold) {
      console.log("Mouth is open!");
    }

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

setupCamera()
  .then((video) => {
    video.play();
    const detectFaces = async () => {
      await faceMesh.send({ image: video });

      requestAnimationFrame(detectFaces);
    };
    detectFaces();
  })
  .catch((error) => {
    console.error("Camera setup failed:", error);
  });
