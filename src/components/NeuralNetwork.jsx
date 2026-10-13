import { useState } from "react";
import { makeCircles, makeMoons, makeTwoBlobs, makeXor } from "../ml/datasets";
import { accuracy, createNetwork, loss, predictProba, trainStep } from "../ml/neuralNetwork";
import { createRng, randomSeed } from "../ml/random";
import { useTrainer } from "../hooks/useTrainer";
import Plot from "./ui/Plot";
import { classFill } from "./ui/plotMath";
import { DataToolbar, Slider, TrainControls, TrainingStatus } from "./ui/Controls";
import { LossChart, Metrics } from "./ui/Metrics";
import PageHeader from "./ui/PageHeader";
import { fmt, int, pct } from "./ui/format";

const GENERATORS = {
  xor: (seed) => makeXor(seed),
  circles: (seed) => makeCircles(seed),
  moons: (seed) => makeMoons(seed),
  blobs: (seed) => makeTwoBlobs(seed, { spread: 1 }),
};

const LEARNING_RATES = [0.03, 0.1, 0.3, 1, 3];

const newNet = (hidden) => createNetwork(hidden, createRng(randomSeed()));

function NetworkDiagram({ net }) {
  const H = net.W2.length;
  const W = 320;
  const HEIGHT = 230;
  const inputs = [
    { x: 40, y: 80, label: "x" },
    { x: 40, y: 150, label: "y" },
  ];
  const hidden = net.W2.map((_, j) => ({ x: 160, y: 22 + ((HEIGHT - 44) * (j + 0.5)) / H }));
  const out = { x: 280, y: 115 };
  const edge = (w) => ({
    stroke: w >= 0 ? "var(--accent)" : "var(--model-alt)",
    strokeDasharray: w >= 0 ? undefined : "4 3",
    strokeWidth: 0.6 + Math.min(4, Math.abs(w) * 0.8),
    strokeOpacity: 0.85,
  });
  return (
    <svg
      className="net-diagram"
      viewBox={`0 0 ${W} ${HEIGHT}`}
      role="img"
      aria-label={`Network with 2 inputs, ${H} tanh hidden units and 1 sigmoid output. Line thickness shows weight magnitude.`}
    >
      {inputs.map((inp, i) =>
        hidden.map((h, j) => <line key={`i${i}h${j}`} x1={inp.x} y1={inp.y} x2={h.x} y2={h.y} {...edge(net.W1[j][i])} />),
      )}
      {hidden.map((h, j) => (
        <line key={`h${j}o`} x1={h.x} y1={h.y} x2={out.x} y2={out.y} {...edge(net.W2[j])} />
      ))}
      {inputs.map((inp) => (
        <g key={inp.label}>
          <circle className="net-node" cx={inp.x} cy={inp.y} r={13} />
          <text className="net-label" x={inp.x} y={inp.y + 4} textAnchor="middle">
            {inp.label}
          </text>
        </g>
      ))}
      {hidden.map((h, j) => (
        <circle key={j} className="net-node" cx={h.x} cy={h.y} r={9} />
      ))}
      <circle className="net-node" cx={out.x} cy={out.y} r={13} />
      <text className="net-label" x={out.x} y={out.y + 4} textAnchor="middle">
        σ
      </text>
    </svg>
  );
}

export default function NeuralNetwork() {
  const [dataset, setDataset] = useState("xor");
  const [points, setPoints] = useState(() => GENERATORS.xor(randomSeed()));
  const [tool, setTool] = useState("add-0");
  const [hidden, setHidden] = useState(5);
  const [lrIndex, setLrIndex] = useState(3);
  const lr = LEARNING_RATES[lrIndex];

  const trainer = useTrainer({
    createModel: () => newNet(hidden),
    step: (m) => trainStep(m, points, lr),
    loss: (m) => loss(m, points),
    stepsPerFrame: 10,
    maxEpochs: 5000,
    tol: 1e-9,
  });
  const net = trainer.model;
  const hasBoth = points.some((p) => p.label === 0) && points.some((p) => p.label === 1);

  const edit = (next) => {
    setPoints(next);
    if (trainer.epoch > 0 && !trainer.running && trainer.status !== "diverged") trainer.play();
  };

  const field = (x, y) => {
    const q = predictProba(net, x, y);
    return q >= 0.5 ? ["--class-b", (q - 0.5) * 0.7] : ["--class-a", (0.5 - q) * 0.7];
  };

  return (
    <div className="page">
      <PageHeader eyebrow="Deep learning" title="Neural network">
        A small multilayer perceptron (2 inputs → tanh hidden layer → sigmoid output) trained with
        backpropagation and full-batch gradient descent, entirely in your browser.
      </PageHeader>

      <div className="viz-grid">
        <section className="card" aria-labelledby="nn-plot">
          <h2 id="nn-plot" className="visually-hidden">
            Data and learned decision surface
          </h2>
          <DataToolbar
            tool={tool}
            onTool={setTool}
            labelled
            onRegenerate={() => {
              setPoints(GENERATORS[dataset](randomSeed()));
              trainer.reset(false);
            }}
            onClear={() => {
              setPoints([]);
              trainer.reset(false);
            }}
          />
          <Plot
            points={points}
            onPointsChange={edit}
            tool={tool}
            pointFill={classFill}
            field={field}
            label={`Two-class scatter plot with ${points.length} points, shaded by the network's predicted probability of class B.`}
            hint="Pick a class, then click to add points. Drag to move, or use Erase to remove."
          />
          <div className="legend">
            <span>
              <span className="swatch swatch-a" /> Class A
            </span>
            <span>
              <span className="swatch swatch-b" /> Class B
            </span>
            <span>Shading: predicted probability</span>
          </div>
        </section>

        <div className="stack">
          <section className="card" aria-labelledby="nn-train">
            <h2 id="nn-train">Training</h2>
            <div className="controls">
              <div className="field">
                <label htmlFor="nn-dataset" className="field-row">
                  Dataset
                </label>
                <select
                  id="nn-dataset"
                  value={dataset}
                  onChange={(e) => {
                    setDataset(e.target.value);
                    setPoints(GENERATORS[e.target.value](randomSeed()));
                    trainer.reset(false);
                  }}
                >
                  <option value="xor">XOR</option>
                  <option value="circles">Circles</option>
                  <option value="moons">Two moons</option>
                  <option value="blobs">Two blobs</option>
                </select>
              </div>
              <Slider
                label="Hidden units"
                min={2}
                max={8}
                value={hidden}
                onChange={(v) => {
                  setHidden(v);
                  trainer.reset(false, newNet(v));
                }}
                help="Changing the architecture re-initialises the weights."
              />
              <Slider
                label="Learning rate"
                min={0}
                max={LEARNING_RATES.length - 1}
                value={lrIndex}
                onChange={setLrIndex}
                format={(i) => String(LEARNING_RATES[i])}
              />
              <TrainControls trainer={trainer} disabled={!hasBoth} />
              <TrainingStatus status={trainer.status} />
              {!hasBoth ? <p className="notice">Add at least one point of each class to train.</p> : null}
            </div>
          </section>

          <section className="card" aria-labelledby="nn-metrics">
            <h2 id="nn-metrics">Metrics</h2>
            <Metrics
              items={[
                { label: "Epoch", value: int(trainer.epoch) },
                { label: "Cross-entropy", value: points.length ? fmt(loss(net, points), 4) : "-" },
                { label: "Train accuracy", value: points.length ? pct(accuracy(net, points)) : "-" },
                { label: "Parameters", value: int(hidden * 4 + 1) },
              ]}
            />
            <div style={{ marginTop: 16 }}>
              <LossChart history={trainer.history} label="Cross-entropy" />
            </div>
          </section>

          <section className="card" aria-labelledby="nn-arch">
            <h2 id="nn-arch">Weights</h2>
            <NetworkDiagram net={net} />
            <div className="legend">
              <span>
                <span className="line accent" /> Positive weight
              </span>
              <span>
                <span className="line dashed" /> Negative weight
              </span>
            </div>
          </section>
        </div>
      </div>

      <section className="card explainer" aria-labelledby="nn-how">
        <h2 id="nn-how">How it works</h2>
        <p>
          Inputs are scaled to roughly [−1, 1]. Each hidden unit computes tanh(w·x + b); the output is the
          sigmoid of a weighted sum of the hidden units. Every epoch runs a forward pass over all points,
          backpropagates the cross-entropy gradient through both layers and takes one gradient step. With
          only a few hidden units, or an unlucky initialisation, training can get stuck in a poor local
          minimum; use Reset model to try a new random start.
        </p>
      </section>
    </div>
  );
}
