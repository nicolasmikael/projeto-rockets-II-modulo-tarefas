import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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

const QuoteChart = ({ data }) => {
  const chartData = {
    labels: data.map((quote) => quote.currency.toUpperCase()),
    datasets: [
      {
        label: "Preço em reais",
        data: data.map((quote) => quote.price),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Preços de criptomoedas em Reais",
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default QuoteChart;
