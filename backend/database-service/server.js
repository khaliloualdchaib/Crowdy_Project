const express = require("express");
const multer = require("multer");
const { Observable } = require("rxjs");
const axios = require("axios");
const FormData = require("form-data");
const port = process.env.PORT || 3000;
const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const cameraDataMap = new Map();
let totalCount = 0;

const CameraCount$ = new Observable((observer) => {
  app.post(
    "/crowdy/count",
    upload.single("imageFileField"),
    async (req, res) => {
      const { cameraId, count } = req.body;
      const fileContent = req.file.buffer;
      observer.next({
        cameraId,
        fileContent,
        count: parseInt(count, 10),
      });
      res.status(200).json({ status: "success" });
    }
  );
});

CameraCount$.subscribe(async (imageData) => {
  const { cameraId, fileContent, count } = imageData;
  cameraDataMap.set(cameraId, { photo: fileContent, count });
  totalCount += count;

  const forwarder_ip = process.env["DATA_FORWARDER_LOAD_BALANCER_SERVICE_HOST"];
  const forwarder_port = process.env["DATA_FORWARDER_LOAD_BALANCER_SERVICE_PORT"];
  const forwarderURL = `http://${forwarder_ip}:${forwarder_port}/crowdy/forward`;

  const cameraDataObject = {};
  cameraDataMap.forEach((value, key) => {
    cameraDataObject[key] = value;
  });

  const form = new FormData();
  form.append("cameras", JSON.stringify(cameraDataObject));
  form.append("TotalCounter", totalCount);

  try {
    await axios.post(forwarderURL, form, {
      headers: form.getHeaders(),
    });
  } catch (error) {
    console.error("Error forwarding data:", error);
  }

  console.log(imageData);
  console.log(`Total Count: ${totalCount}`);
});

app.get("/crowdy/totalcount", (req, res) => {
  res.status(200).json({ totalCount });
});

app.listen(port, () => {
  console.log(`Database server running on port ${port}`);
});
