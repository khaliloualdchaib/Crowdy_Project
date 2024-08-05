import React, { useEffect, useState } from 'react';
import './App.css';
import Navigationbar from './components/navbar';
import { Route, Routes } from 'react-router-dom';
import MyChart from './components/chart';
import Cameras from './components/cameras';
import socket from './socket';

function App() {
  const [data, setData] = useState({ cameras: {}, totalCount: 0 });

  useEffect(() => {
    socket.on('new_data', (newData) => {
      setData(newData);
    });

    // Clean up the socket connection
    return () => {
      socket.off('new_data');
    };
  }, []);

  return (
    <div className="bg-dark" style={{ height: '100vh' }}>
      <Navigationbar />
      <Routes>
        {/*<Route path="/" element={<MyChart data={data} />} />*/}
        <Route path="/Cameras" element={<Cameras totalCount={data.totalCount} />} />
      </Routes>
    </div>
  );
}

export default App;
