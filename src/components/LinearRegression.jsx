import React, { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

function generateData(n = 20) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    const x = Math.random() * 100;
    const y = 0.8 * x + 20 + (Math.random() * 20 - 10);
    arr.push({ x, y });
  }
  return arr;
}

export default function LinearRegression() {
  const [points, setPoints] = useState(() => generateData());
  const [slope, setSlope] = useState(0.8);
  const [intercept, setIntercept] = useState(20);

  const linePoints = useMemo(() => {
    const xs = points.map((p) => p.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);

    return [
      { x: minX, y: slope * minX + intercept },
      { x: maxX, y: slope * maxX + intercept }
    ];
  }, [points, slope, intercept]);

  const chartData = {
    datasets: [
      {
        label: "Data Points",
        data: points,
        pointRadius: 5,
        borderColor: "#4db8ff",
        backgroundColor: "#4db8ff",
        showLine: false
      },
      {
        label: "Regression Line",
        data: linePoints,
        borderColor: "#ff4d4d",
        borderWidth: 2,
        pointRadius: 0
      }
    ]
  };

  const options = {
    scales: {
      x: { type: "linear", position: "bottom", grid: { color: "#333" } },
      y: { grid: { color: "#333" } }
    },
    plugins: {
      legend: {
        labels: { color: "#ddd" }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <>
      <div className="chart-wrapper">
        <Line data={chartData} options={options} />
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>Slope: {slope.toFixed(2)}</label>
        <input
          type="range"
          min="-3"
          max="3"
          step="0.01"
          value={slope}
          onChange={(e) => setSlope(parseFloat(e.target.value))}
        />

        <br /><br />

        <label>Intercept: {intercept.toFixed(2)}</label>
        <input
          type="range"
          min="-100"
          max="100"
          step="0.5"
          value={intercept}
          onChange={(e) => setIntercept(parseFloat(e.target.value))}
        />

        <button onClick={() => setPoints(generateData())}>
          Generate Points
        </button>
      </div>
    </>
  );
}
