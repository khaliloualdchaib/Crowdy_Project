const express = require('express');
const { Observable } = require('rxjs');
const { bufferTime, map } = require('rxjs/operators');

const port = process.env.PORT;
const app = express();

app.use(express.json());

let totalCount = 0;


const TotalheadCount$ = new Observable((observer) => {
    app.post("/crowdy/global/count", async (req, res) => {
        const count = req.body.count;
        console.log(`Received head count update: ${count}`);
        observer.next(count);
        res.status(200).json({ status: "success" });
    });
});

const headCountStream$ = TotalheadCount$.pipe(
    bufferTime(30000), // Buffer data for 30 seconds
    map(dataArray => dataArray.reduce((acc, count) => acc + count, 0))
);

headCountStream$.subscribe(async (count) =>{
    totalCount += count
    console.log('Total Count:', totalCount);
});

/* 
// Periodically send the aggregated head count data to a hypothetical frontend
interval(5000).subscribe(() => {
    const now = new Date();
    console.log(`Sending aggregated head count data at ${now}`);
    // In a real scenario, you would send this data to your frontend using a WebSocket or another real-time communication method.
});
*/

app.listen(port, () => {
    console.log(`Global head counting server running on port ${port}`);
});