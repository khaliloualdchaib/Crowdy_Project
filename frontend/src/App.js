import React from 'react';
import './App.css';
import Navigationbar from './components/navbar';
import { Route, Routes } from 'react-router-dom';
import MyChart from './components/chart';
import Cameras from './components/cameras';
function App() {
  return (
    <div className="bg-dark" style={{ height: '100vh' }}>
      <Navigationbar />
      <Routes>
        <Route path="/" element={<MyChart />} />
        <Route path="/Cameras" element={<Cameras />} />
      </Routes>
    </div>
  );
}

export default App;
