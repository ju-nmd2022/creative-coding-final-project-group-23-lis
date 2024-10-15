window.addEventListener("load", () => {
  const video = document.getElementById("video");

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
        document.getElementById("emotion").textContent = `${maxEmotion} (${(
          emotions[maxEmotion] * 100
        ).toFixed(2)}%)`;
      }
    }, 100);
  });
});
