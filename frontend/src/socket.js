import { io } from "socket.io-client";

const socket = io("http://localhost:8009"); // Adjust the port if necessary

export default socket;
