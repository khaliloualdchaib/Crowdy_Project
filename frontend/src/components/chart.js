import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarController, BarElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarController, BarElement);

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [8, 15, 6, 9, 10, 5, 12],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false, 
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
  scales: {
    x: {
      type: 'category',
      labels: labels,
    },
    y: {
      beginAtZero: true,
    },
  },
};

function MyChart() {
  return (
    <div className='text' style={{ height: '96vh', width: '50vw' }}>
      <Bar data={data} options={options}/>
    </div>
  );
}

export default MyChart;
