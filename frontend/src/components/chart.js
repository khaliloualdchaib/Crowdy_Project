import React, { useEffect, useState } from 'react';
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, BarController, BarElement);

const dataFormat = (headcounts) => {
  const labels = Array.from({ length: headcounts.length }, (_, i) => i + 1);
  return {
    labels: labels,
    datasets: [
      {
        label: "Head Count",
        data: headcounts,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      type: "category",
      title: {
        display: true,
        text: "Every 30 Seconds",
        color: "black",
      },
      ticks: {
        color: "black",
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Head Count",
        color: "black",
      },
      ticks: {
        color: "black",
      },
    },
  },
};

function MyChart({ totalCounts }) {
  // Convert totalCounts to the format expected by Chart.js
  const chartData = dataFormat(totalCounts);

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="h-[90%] w-[90%]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

export default MyChart;
