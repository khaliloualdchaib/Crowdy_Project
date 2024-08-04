const express = require('express');
const multer = require('multer');
const { Observable } = require('rxjs');
const port = process.env.PORT || 3000;  // Default to 3000 if PORT is not set
const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const cameraDataMap = new Map();
let totalCount = 0;

const CameraCount$ = new Observable((observer) => {
    app.post("/crowdy/count", upload.single('imageFileField'), async (req, res) => {
        const { cameraId, count } = req.body;
        
        const fileContent = req.file.buffer;
        observer.next({
            cameraId,
            fileContent,
            count: parseInt(count, 10),  // Ensure count is treated as a number
        });
        res.status(200).json({ status: "success" });
    });
});

CameraCount$.subscribe(async (imageData) => {
    const { cameraId, fileContent, count } = imageData;
    cameraDataMap.set(cameraId, { photo: fileContent, count });
    totalCount += count;
    console.log(imageData);
    console.log(`Total Count: ${totalCount}`);
});

// Endpoint to retrieve the current total count
app.get("/crowdy/totalcount", (req, res) => {
    res.status(200).json({ totalCount });
});

app.listen(port, () => {
    console.log(`database server running on port ${port}`);
});
