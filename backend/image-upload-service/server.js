const express = require('express');
const axios = require('axios');
const multer = require('multer');
const { Observable } = require('rxjs');
const FormData = require('form-data');
const fs = require('fs');
const exp = require('constants');

const port = process.env.PORT;
console.log(process.env)
const app = express();
app.use(express.json())
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

        const database_ip = process.env["DATABASE_APP_CLUSTERIP_SERVICE_HOST"]
        const database_port = process.env["DATABASE_APP_CLUSTERIP_SERVICE_PORT"]

        const headcountURL = `http://${headcount_ip}:${headcount_port}/crowdy/image/count`
        const formData1 = new FormData();
        formData1.append('imageFileField', fileContent, { filename: originalname });
        const response1 = await axios.post(headcountURL, formData1);
        const countValue = response1.data.count;
        const databaseURL = `http://${database_ip}:${database_port}/crowdy/count`;
        const formData2 = new FormData();
        formData2.append("cameraId", camera)
        formData2.append("count", countValue)
        formData2.append('imageFileField', fileContent, { filename: originalname });
        const response3 = await axios.post(databaseURL, formData2)
        console.log(`Image processed for camera ${camera}`);
    } catch (error) {
        console.error(error.message);
    }
})

app.listen(port, () => {
    console.log(`Image uploading server running on port ${port}`);
});
