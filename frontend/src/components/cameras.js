import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function Cameras() {
    const [totalCount, setTotalCount] = useState(0);
    console.log(process.env)
    const elp  = process.env["NODEJS_K8_CLUSTER_SERVICE_SERVICE_HOST"]
    const port = process.env["GLOBAL_HEAD_COUNT_APP_CLUSTERIP_SERVICE_PORT"]
    console.log(elp)
    console.log(port)
    const socket = io.connect(`http://${elp}:${port}`);
    useEffect(() => {
        console.log('tgest')
        socket.on('totalCountUpdate', (newTotalCount) => {
            console.log(newTotalCount)
            setTotalCount(newTotalCount);
        });
    }, [socket]);

    return <div className='text bg-dark' style={{ height: '100%' }}>
        Total Count: {totalCount}
    </div>;
}

export default Cameras;
