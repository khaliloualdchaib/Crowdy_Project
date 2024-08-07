import React, { useEffect, useState } from "react";
import "./App.css";
import Navigationbar from "./components/navbar";
import { Route, Routes } from "react-router-dom";
import MyChart from "./components/chart";
import Cameras from "./components/cameras";
import socket from "./socket";
import axios from "axios";

function App() {
  const [cameras, setCameras] = useState({});
  const [totalCounts, setTotalCounts] = useState([]);
  const [globalCount, setGlobalCount] = useState(0);
  useEffect(() => {
    socket.on("cameras", (newData) => {
      console.log("totalCounts: ", newData.totalCounts);
      setCameras(newData.cameraData);
      setGlobalCount(newData.totalCount);
      setTotalCounts(newData.totalCounts);
    });
    return () => {
      socket.off("cameras");
    };
  }, []);

  return (
    <div className="bg-dark" style={{ height: "100vh" }}>
      <Navigationbar />
      <Routes>
        <Route path="/" element={<MyChart totalCounts={totalCounts} />} />
        <Route
          path="/Cameras"
          element={<Cameras cameras={cameras} globalCount={globalCount} />}
        />
      </Routes>
    </div>
  );
}

export default App;
