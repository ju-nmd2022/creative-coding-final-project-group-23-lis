window.addEventListener("load", () => {
  const video = document.getElementById("video");
  const lipBiteImg = document.getElementById("lip-bite"); // Reference to the image

  // Load the models after the window is fully loaded
  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
  ]).then(startVideo);

  function startVideo() {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => (video.srcObject = stream))
      .catch((err) => console.error("Error accessing the camera: ", err));
  }

  video.addEventListener("play", () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
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
});
