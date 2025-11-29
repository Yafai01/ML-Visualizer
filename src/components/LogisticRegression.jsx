import React, { useState } from "react";

export default function LogisticRegression() {
  const [slope, setSlope] = useState(1);
  const [bias, setBias] = useState(0);

  const points = [
    { x: 1, y: 1, label: 0 },
    { x: 2, y: 1.5, label: 0 },
    { x: 3, y: 2, label: 0 },
    { x: 6, y: 5, label: 1 },
    { x: 7, y: 6, label: 1 },
    { x: 8, y: 7, label: 1 }
  ];

  return (
    <div style={{ textAlign: "center" }}>
      <h3>Logistic Regression Decision Boundary</h3>

      <svg width="300" height="300" style={{ background: "#181818", borderRadius: "8px" }}>
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x * 30}
            cy={300 - p.y * 30}
            r="6"
            fill={p.label === 1 ? "#ff4d4d" : "#4dabf7"}
          />
        ))}

        <line
          x1="0"
          y1={300 - (slope * 0 + bias) * 30}
          x2="300"
          y2={300 - (slope * 10 + bias) * 30}
          stroke="#a020f0"
          strokeWidth="3"
        />
      </svg>

      <p>Slope: {slope}</p>
      <input type="range" min="-3" max="3" step="0.1" value={slope} onChange={(e) => setSlope(parseFloat(e.target.value))} />

      <p>Bias: {bias}</p>
      <input type="range" min="-5" max="5" step="0.1" value={bias} onChange={(e) => setBias(parseFloat(e.target.value))} />
    </div>
  );
}
