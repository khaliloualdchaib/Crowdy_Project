const fs = require('fs');
const path = require('path');
const { interval  } = require('rxjs');
const { switchMap, map } = require('rxjs/operators');
const axios = require('axios');
const FormData = require('form-data');

const imageUrl = 'http://localhost:30180/crowdy/image/upload';
const imagesDirectory = path.join(__dirname, 'images_test');
const sendImage = async (cameraId, image) => {
  try {
    const formData = new FormData();
    formData.append('imageFileField',  fs.createReadStream(image));
    formData.append('camera', cameraId);
    const res = await axios.post(imageUrl, formData)
    console.log(res.data)
  } catch (error) {
    console.error(`Error while sending image for Camera ${cameraId}:`, error.message);
  }
};

const getImagePaths = () => {
  const files = fs.readdirSync(imagesDirectory);
  return files.map((file) => `${imagesDirectory}/${file}`);
};

const getRandomImage = () => {
  const imagePaths = getImagePaths();
  const randomIndex = Math.floor(Math.random() * imagePaths.length);
  return imagePaths[randomIndex];
};

const camera1$ = interval(10000).pipe(
  map(() => ({ cameraId: 1, image: getRandomImage() })),
  switchMap(({ cameraId, image }) => sendImage(cameraId, image))
);

const camera2$ = interval(30000).pipe(
  map(() => ({ cameraId: 2, image: getRandomImage() })),
  switchMap(({ cameraId, image }) => sendImage(cameraId, image))
);

const camera3$ = interval(5000).pipe(
  map(() => ({ cameraId: 3, image: getRandomImage() })),
  switchMap(({ cameraId, image }) => sendImage(cameraId, image))
);

const camera4$ = interval(60000).pipe(
  map(() => ({ cameraId: 4, image: getRandomImage() })),
  switchMap(({ cameraId, image }) => sendImage(cameraId, image))
);

// Subscribe to the observables (simulating the continuous operation)
camera1$.subscribe();
camera2$.subscribe();
camera3$.subscribe();
camera4$.subscribe();