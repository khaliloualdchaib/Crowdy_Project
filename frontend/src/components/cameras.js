import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function Cameras() {
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const socket = io('http://global-head-count-service:8003');

        socket.on('totalCountUpdate', (newTotalCount) => {
            setTotalCount(newTotalCount);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return <div className='text bg-dark' style={{ height: '100%' }}>
        Total Count: {totalCount}
    </div>;
}

export default Cameras;
