import React from "react";

export default function SVM() {
  const pointsA = [
    { x: 2, y: 2 }, { x: 3, y: 3 }, { x: 4, y: 2.5 }
  ];

  const pointsB = [
    { x: 7, y: 7 }, { x: 6, y: 8 }, { x: 8, y: 6 }
  ];

  return (
    <div style={{ textAlign: "center" }}>
      <h3>SVM Maximum Margin Visualizer</h3>

      <svg width="300" height="300" style={{ background: "#1a1a1a", borderRadius: "10px" }}>
        
        {/* Class A */}
        {pointsA.map((p, i) => (
          <circle key={i} cx={p.x * 30} cy={300 - p.y * 30} r="6" fill="#4dabf7" />
        ))}

        {/* Class B */}
        {pointsB.map((p, i) => (
          <circle key={i} cx={p.x * 30} cy={300 - p.y * 30} r="6" fill="#ff4444" />
        ))}

        {/* Decision boundary */}
        <line x1="0" y1="250" x2="300" y2="50" stroke="white" strokeWidth="3" />

        {/* Margins */}
        <line x1="0" y1="270" x2="300" y2="70" stroke="#a020f0" strokeDasharray="8" />
        <line x1="0" y1="230" x2="300" y2="30" stroke="#a020f0" strokeDasharray="8" />
      </svg>

      <p style={{ opacity: 0.7 }}>White line = decision boundary<br />
      Purple dashed lines = margins</p>
    </div>
  );
}
