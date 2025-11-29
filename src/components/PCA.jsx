import React, { useState } from "react";

export default function PCA() {
  const [angle, setAngle] = useState(0);

  const points = [
    { x: 2, y: 2 }, { x: 4, y: 3 }, { x: 6, y: 5 }, { x: 8, y: 8 }
  ];

  const rad = (angle * Math.PI) / 180;

  const projected = points.map(p => ({
    x: p.x * Math.cos(rad) + p.y * Math.sin(rad),
    y: 0
  }));

  return (
    <div style={{ textAlign: "center" }}>
      <h3>PCA Dimensionality Reduction</h3>

      <svg width="300" height="200" style={{ background: "#202020", borderRadius: "8px" }}>
        
        {/* Original points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x * 20} cy={200 - p.y * 20} r="5" fill="#4dabf7" />
        ))}

        {/* Projected points */}
        {projected.map((p, i) => (
          <circle key={i} cx={p.x * 20} cy={180} r="6" fill="#f39c12" />
        ))}

        {/* PCA axis */}
        <line
          x1="0"
          y1={200 - 100 * Math.tan(rad)}
          x2="300"
          y2={200 + 100 * Math.tan(rad)}
          stroke="#a020f0"
          strokeWidth="3"
        />
      </svg>

      <p>Rotation angle: {angle}°</p>
      <input
        type="range"
        min="-89"
        max="89"
        value={angle}
        onChange={(e) => setAngle(parseFloat(e.target.value))}
      />
    </div>
  );
}
