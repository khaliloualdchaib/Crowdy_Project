const express = require("express");
const multer = require("multer");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const port = process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"], // Allow these HTTP methods
  },
});

app.use(cors())

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 25 * 1024 * 1024, // 25 MB limit for field size
  },
});

app.post("/crowdy/forward", upload.none(), (req, res) => {
  const { cameras, TotalCounter } = req.body;
  const cameraData = JSON.parse(cameras);

  console.log("Received data:");
  console.log("Total Count:", TotalCounter);
  for (const [key, value] of Object.entries(cameraData)) {
    console.log(`Camera ID: ${key}, Data:`, value);
  }
  if(TotalCounter)
  io.emit("new_data", { cameras: cameraData, totalCount: TotalCounter });

  res.status(200).json({ status: "success" });
});

server.listen(port, () => {
  console.log(`Forwarder server running on port ${port}`);
});

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
