const express = require('express');
const axios = require('axios');
const multer = require('multer');
const { Observable } = require('rxjs');
const FormData = require('form-data');
const fs = require('fs');

const port = process.env.PORT;
console.log(process.env)
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
        const headcount_ip = process.env["HEAD_COUNT_APP_LOAD_BALANCER_SERVICE_HOST"]
        const headcount_port = process.env["HEAD_COUNT_APP_LOAD_BALANCER_SERVICE_PORT"]

        const global_headcount_ip = process.env["GLOBAL_HEAD_COUNT_APP_CLUSTERIP_SERVICE_HOST"]
        const global_headcount_port = process.env["GLOBAL_HEAD_COUNT_APP_CLUSTERIP_SERVICE_PORT"]

        const specific_headcount_ip = process.env["SPECIFIC_HEAD_COUNT_APP_CLUSTERIP_SERVICE_HOST"]
        const specific_headcount_port = process.env["SPECIFIC_HEAD_COUNT_APP_CLUSTERIP_SERVICE_PORT"]

        const headcountURL = `http://${headcount_ip}:${headcount_port}/crowdy/image/count`
        const formData1 = new FormData();
        formData1.append('imageFileField', fileContent, { filename: originalname });
        const response1 = await axios.post(headcountURL, formData1);
        const countValue = response1.data.count;
        const globalheadcountURL = `http://${global_headcount_ip}:${global_headcount_port}/crowdy/global/count`;
        const response2 = await axios.post(globalheadcountURL, { count: countValue });
        const specificheadcountURL = `http://${specific_headcount_ip}:${specific_headcount_port}/crowdy/specific/count`;
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
