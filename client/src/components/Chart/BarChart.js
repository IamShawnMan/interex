import React from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

const labels = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun","Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];

const data = {
  labels: labels,
  datasets: [
    {
      label: "Buyurtmalari",
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132)",
      data: [0, 10, 5, 2, 20, 30, 45,50,55,60,50,70],
    },
  ],
};

const LineChart = () => {
  return (
    <div>
      <Line data={data}  />
    </div>
  );
};

export default LineChart;