import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ chartTotal }) => {
  const options = {
    maintainAspectRation: false,
    responsive: true,
    plugins: {
      responsive: true,
      legend: {
        labels: {
          fontSize: 0,
          fontFamily: "font-1",
        },
      },
    },
  };

  return <Bar data={chartTotal} options={options} />;
};

export default Chart;
