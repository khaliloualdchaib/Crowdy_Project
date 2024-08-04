const express = require("express");
const { io } = require("socket.io-client");
const port = process.env.PORT;

const app = express();

const global_headcount_ip =
  process.env["GLOBAL_HEAD_COUNT_APP_CLUSTERIP_SERVICE_HOST"];
const global_headcount_port =
  process.env["GLOBAL_HEAD_COUNT_APP_CLUSTERIP_SERVICE_PORT"];

const specific_headcount_ip =
  process.env["SPECIFIC_HEAD_COUNT_APP_CLUSTERIP_SERVICE_HOST"];
const specific_headcount_port =
  process.env["SPECIFIC_HEAD_COUNT_APP_CLUSTERIP_SERVICE_PORT"];

// Connect to the original server
const socket = io(`http://${global_headcount_ip}:${global_headcount_port}`);

// Listen for the 'totalCountUpdate' event
socket.on("totalCountUpdate", (totalCount) => {
  console.log("Total Count from server:", totalCount);
});

socket.on("connect", () => {
  console.log("Connected to the original server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from the original server");
});

// Start the client server
app.listen(port, () => {
  console.log(`Client server running on port ${port}`);
});
