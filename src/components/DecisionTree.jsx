import React, { useState } from "react";

function gini(groups, classes) {
  let nInstances = groups[0].length + groups[1].length;
  let g = 0.0;

  groups.forEach(group => {
    let size = group.length;
    if (size === 0) return;

    let score = 0.0;
    classes.forEach(cls => {
      let p = group.filter(x => x.label === cls).length / size;
      score += p * p;
    });

    g += (1 - score) * (size / nInstances);
  });

  return g;
}

export default function DecisionTree() {
  const [threshold, setThreshold] = useState(5);

  const data = [
    { x: 2, label: "A" },
    { x: 4, label: "A" },
    { x: 6, label: "B" },
    { x: 7, label: "B" },
    { x: 3, label: "A" },
    { x: 9, label: "B" }
  ];

  const left = data.filter(d => d.x < threshold);
  const right = data.filter(d => d.x >= threshold);

  const g = gini([left, right], ["A", "B"]).toFixed(3);

  return (
    <div style={{ textAlign: "center" }}>
      <h3 style={{ marginBottom: "10px" }}>Decision Tree Split Visualizer</h3>

      <p>Threshold: {threshold}</p>
      <input
        type="range"
        min="1"
        max="10"
        value={threshold}
        onChange={(e) => setThreshold(parseInt(e.target.value))}
      />

      <h4 style={{ marginTop: "20px" }}>Gini Impurity: {g}</h4>

      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
        <div>
          <h4>Left Group</h4>
          {left.map((d, i) => <p key={i}>{d.x} → {d.label}</p>)}
        </div>
        <div>
          <h4>Right Group</h4>
          {right.map((d, i) => <p key={i}>{d.x} → {d.label}</p>)}
        </div>
      </div>
    </div>
  );
}
