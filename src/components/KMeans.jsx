import React, { useState, useEffect } from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  PointElement,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(PointElement, LinearScale, Tooltip, Legend);

function generatePoints(n = 40) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    pts.push({
      x: Math.random() * 10,
      y: Math.random() * 10,
      cluster: null
    });
  }
  return pts;
}

function randomCentroids(k) {
  const arr = [];
  for (let i = 0; i < k; i++) {
    arr.push({
      x: Math.random() * 10,
      y: Math.random() * 10
    });
  }
  return arr;
}

function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export default function KMeans() {
  const [k, setK] = useState(3);
  const [points, setPoints] = useState(() => generatePoints());
  const [centroids, setCentroids] = useState(() => randomCentroids(k));
  const [autoRun, setAutoRun] = useState(false);

  // Assign clusters
  const assignClusters = () => {
    const newPts = points.map((p) => {
      let best = 0;
      let bestDist = distance(p, centroids[0]);

      for (let i = 1; i < k; i++) {
        const d = distance(p, centroids[i]);
        if (d < bestDist) {
          best = i;
          bestDist = d;
        }
      }

      return { ...p, cluster: best };
    });

    setPoints(newPts);
  };

  // Move centroids
  const updateCentroids = () => {
    const newC = centroids.map((c, i) => {
      const group = points.filter((p) => p.cluster === i);
      if (group.length === 0) return c;

      const avgX = group.reduce((a, b) => a + b.x, 0) / group.length;
      const avgY = group.reduce((a, b) => a + b.y, 0) / group.length;

      return { x: avgX, y: avgY };
    });

    setCentroids(newC);
  };

  const step = () => {
    assignClusters();
    updateCentroids();
  };

  useEffect(() => {
    if (!autoRun) return;

    const interval = setInterval(() => {
      step();
    }, 1000);

    return () => clearInterval(interval);
  });

  const chartData = {
    datasets: [
      ...[...Array(k)].map((_, i) => ({
        label: `Cluster ${i + 1}`,
        data: points.filter((p) => p.cluster === i),
        backgroundColor: ["#ff6b6b", "#4dabf7", "#69db7c", "#fbc531", "#e056fd"][i],
        pointRadius: 6
      })),
      {
        label: "Centroids",
        data: centroids,
        backgroundColor: "white",
        borderColor: "black",
        pointRadius: 10,
        pointStyle: "rectRot"
      }
    ]
  };

  return (
    <>
      <div className="chart-wrapper" style={{ marginBottom: "20px" }}>
        <Scatter
          data={chartData}
          options={{
            scales: {
              x: { min: 0, max: 10, grid: { color: "#444" } },
              y: { min: 0, max: 10, grid: { color: "#444" } }
            },
            plugins: {
              legend: { labels: { color: "#ddd" } }
            }
          }}
        />
      </div>

      <label>
        Number of clusters (k): {k}
      </label>
      <input
        type="range"
        min="2"
        max="5"
        value={k}
        style={{ width: "100%" }}
        onChange={(e) => {
          const newK = parseInt(e.target.value);
          setK(newK);
          setCentroids(randomCentroids(newK));
          setPoints(generatePoints());
        }}
      />

      <button onClick={step} style={{ marginTop: "10px" }}>
        Next Step
      </button>

      <button
        style={{ marginTop: "10px", marginLeft: "10px" }}
        onClick={() => setAutoRun(!autoRun)}
      >
        {autoRun ? "Stop" : "Auto Run"}
      </button>

      <button
        style={{ marginTop: "10px", marginLeft: "10px" }}
        onClick={() => {
          setPoints(generatePoints());
          setCentroids(randomCentroids(k));
        }}
      >
        Reset
      </button>
    </>
  );
}
