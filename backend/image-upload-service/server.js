const express = require('express');
const axios = require('axios');
const multer = require('multer');
const { Observable } = require('rxjs');
const FormData = require('form-data');
const fs = require('fs');

const port = process.env.PORT;
const app = express();
const upload = multer({ dest: 'uploads/' });

const imageUpload$ = new Observable((observer) => {
    app.post('/crowdy/image/upload', upload.single('imageFileField'), async (req, res) => {
        const camera = req.body.camera;
        const fileContent = fs.readFileSync(req.file.path);
        observer.next({
            camera,
            fileContent,
            originalname: req.file.originalname,
        });
        res.status(200).json({ status: 'success' });
    });
});

imageUpload$.subscribe(async (imageData) => {
    try {
        const { camera, fileContent, originalname } = imageData;
        const headcountURL = "http://head-count-service:8002/crowdy/image/count";
        const formData1 = new FormData();
        formData1.append('imageFileField', fileContent, { filename: originalname });
        const response1 = await axios.post(headcountURL, formData1);
        const countValue = response1.data.count;
        const globalheadcountURL = "http://global-head-count-service:8003/crowdy/global/count";
        const response2 = await axios.post(globalheadcountURL, { count: countValue });
        const specificheadcountURL = "http://specific-head-count-service:8004/crowdy/specific/count";
        const formData2 = new FormData();
        formData2.append("cameraId", camera)
        formData2.append("count", countValue)
        formData2.append('imageFileField', fileContent, { filename: originalname });
        const response3 = await axios.post(specificheadcountURL, formData2)
        console.log(`Image processed for camera ${camera}`);
    } catch (error) {
        console.error(error.message);
    }
})

app.listen(port, () => {
    console.log(`Image uploading server running on port ${port}`);
});
