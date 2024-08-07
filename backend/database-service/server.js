const express = require("express");
const multer = require("multer");
const { Subject } = require("rxjs");
const { bufferTime } = require("rxjs/operators");
const port = process.env.PORT || 3000;
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize data structures
const cameraDataMap = new Map();
let totalCounts = [];
let totalCount = 0;

// Create HTTP server and Socket.io instance
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"], // Allow these HTTP methods
  },
});
app.use(cors());

// Create a Subject to handle camera count data
const cameraCountSubject = new Subject();

// Endpoint to handle incoming data
app.post(
  "/crowdy/count",
  upload.single("imageFileField"),
  (req, res) => {
    const { cameraId, count } = req.body;
    const fileContent = req.file.buffer;
    cameraCountSubject.next({
      cameraId,
      fileContent,
      count: parseInt(count, 10),
      timestamp: Date.now(),
    });
    res.status(200).json({ status: "success" });
  }
);

// Function to emit data to clients
const emitData = () => {
  const cameraDataObject = Object.fromEntries(cameraDataMap);
  io.emit("cameras", { cameraData: cameraDataObject, totalCount, totalCounts });
};

// Subscribe to the Subject and process real-time data
cameraCountSubject.subscribe(async (imageData) => {
  const { cameraId, fileContent, count } = imageData;
  // Check if the camera ID already exists in the map
  if (cameraDataMap.has(cameraId)) {
    // Update the existing data by adding the new count
    const existingData = cameraDataMap.get(cameraId);
    existingData.count += count;
    cameraDataMap.set(cameraId, existingData);
  } else {
    // If the camera ID is new, initialize it with the given count
    cameraDataMap.set(cameraId, { photo: fileContent, count });
  }
  // Update the total count
  totalCount += count;
  emitData(); // Emit real-time camera data and total count
});

// Buffer data for 30 seconds and process it
cameraCountSubject.pipe(bufferTime(30000)).subscribe(async (bufferedData) => {
  if (bufferedData.length > 0) {
    let intervalCount = 0;
    bufferedData.forEach((imageData) => {
      const { count } = imageData;
      intervalCount += count;
    });

    totalCounts.push(intervalCount);
    console.log(`Interval Count: ${intervalCount}`);
    console.log(`Total Counts: ${totalCounts}`);
    emitData(); // Emit the updated total count at 30-second intervals
  }
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle Socket.io connections
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
