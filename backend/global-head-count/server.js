const express = require('express');
const { Observable } = require('rxjs');
const { bufferTime, map } = require('rxjs/operators');
const http = require('http');
const socketIo = require('socket.io');

const port = process.env.PORT;
console.log(process.env)
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(express.json());

let totalCount = 0;

const TotalheadCount$ = new Observable((observer) => {
    app.post("/crowdy/global/count", async (req, res) => {
        const count = req.body.count;
        console.log(`Received head count update: ${count}`);
        observer.next(count);
        res.status(200).json({ status: "success" });
        io.emit('totalCountUpdate', totalCount); // Emit the total count to all connected clients
    });
});

const headCountStream$ = TotalheadCount$.pipe(
    bufferTime(30000), // Buffer data for 30 seconds
    map(dataArray => dataArray.reduce((acc, count) => acc + count, 0))
);

headCountStream$.subscribe(async (count) => {
    totalCount += count
    console.log('Total Count:', totalCount);
});

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.emit('totalCountUpdate', totalCount);
});

server.listen(port, () => {
    console.log(`Global head counting server running on port ${port}`);
});
