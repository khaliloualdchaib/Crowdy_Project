const express = require('express');
const multer = require('multer');
const { Observable } = require('rxjs');
const port = process.env.PORT;
const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const cameraDataMap = new Map();

const CameraCount$ = new Observable((observer) => {
    app.post("/crowdy/specific/count", upload.single('imageFileField'), async (req, res) => {
        const { cameraId, count } = req.body;
        
        const fileContent = req.file.buffer;
        observer.next({
            cameraId,
            fileContent,
            count,
        });    
        res.status(200).json({ status: "success" });
    });
});

CameraCount$.subscribe(async (imageData) => {
    const { cameraId, fileContent, count } = imageData;
    cameraDataMap.set(cameraId, { photo: fileContent, count });
    console.log(imageData)
})


/*
const cameraDataStream = cameraSubject.pipe(
    bufferTime(5000),
    filter(dataArray => dataArray.length > 0),
    mergeMap(dataArray => dataArray),
    scan((acc, data) => {
        acc.set(data.cameraId, { photo: data.photo, count: data.count });
        return acc;
    }, new Map())
);
*/
app.listen(port, () => {
    console.log(`specific head count server running on port ${port}`);
});
