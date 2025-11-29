import React, { useState } from "react";

export default function NeuralNetwork() {
  // simple 2-input -> 3-hidden -> 1-output network
  const [input1, setInput1] = useState(0.5);
  const [input2, setInput2] = useState(0.8);
  const [output, setOutput] = useState(null);

  // random weights
  const weightsIH = [
    [0.4, -0.2, 0.1],   // input1 → hidden 1,2,3
    [0.3, 0.6, -0.4]    // input2 → hidden 1,2,3
  ];

  const weightsHO = [0.7, -0.1, 0.5];  // hidden → output

  const activate = (x) => 1 / (1 + Math.exp(-x)); // sigmoid

  const forwardPass = () => {
    const h1 = activate(input1 * weightsIH[0][0] + input2 * weightsIH[1][0]);
    const h2 = activate(input1 * weightsIH[0][1] + input2 * weightsIH[1][1]);
    const h3 = activate(input1 * weightsIH[0][2] + input2 * weightsIH[1][2]);

    const out =
      activate(h1 * weightsHO[0] + h2 * weightsHO[1] + h3 * weightsHO[2]);

    setOutput(out.toFixed(4));
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "22px" }}>Neural Network Forward Pass</h3>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "120px" }}>
        
        {/* INPUT LAYER */}
        <div>
          <h4>Inputs</h4>
          <div>
            <label>Input 1: {input1}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              style={{ width: "120px" }}
              value={input1}
              onChange={(e) => setInput1(parseFloat(e.target.value))}
            />
          </div>

          <div style={{ marginTop: "20px" }}>
            <label>Input 2: {input2}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              style={{ width: "120px" }}
              value={input2}
              onChange={(e) => setInput2(parseFloat(e.target.value))}
            />
          </div>
        </div>

        {/* HIDDEN LAYER */}
        <div>
          <h4>Hidden Layer</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#f39c12" }}></div>
            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#f39c12" }}></div>
            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#f39c12" }}></div>  
          </div>
        </div>

        {/* OUTPUT LAYER */}
        <div>
          <h4>Output</h4>
          <div style={{
            marginTop: "40px",
            width: "40px",
            height: "40px",
            background: "#9b59b6",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px"
          }}>
            {output ?? "?"}
          </div>
        </div>
      </div>

      <button
        onClick={forwardPass}
        style={{ marginTop: "40px", padding: "10px 22px", background: "#a020f0", borderRadius: "10px", color: "white" }}
      >
        Run Forward Pass
      </button>
    </div>
  );
}
