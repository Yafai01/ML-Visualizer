import { useState } from "react";
import { makeTwoBlobs } from "../ml/datasets";
import { accuracy, gdStep, initialModel, logLoss, predictProba } from "../ml/logisticRegression";
import { randomSeed } from "../ml/random";
import { useTrainer } from "../hooks/useTrainer";
import Plot from "./ui/Plot";
import { classFill, clipLine } from "./ui/plotMath";
import { DataToolbar, Slider, TrainControls, TrainingStatus } from "./ui/Controls";
import { LossChart, Metrics } from "./ui/Metrics";
import PageHeader from "./ui/PageHeader";
import { fmt, int, pct } from "./ui/format";

const LEARNING_RATES = [0.01, 0.03, 0.1, 0.3, 1, 3];
const L2_VALUES = [0, 0.001, 0.01, 0.1, 0.5];
const LOGIT_75 = Math.log(3); // sigmoid(z) = 0.75 when z = ln 3

export default function LogisticRegression() {
  const [points, setPoints] = useState(() => makeTwoBlobs(randomSeed(), { spread: 1.1 }));
  const [tool, setTool] = useState("add-0");
  const [lrIndex, setLrIndex] = useState(3);
  const [l2Index, setL2Index] = useState(0);
  const lr = LEARNING_RATES[lrIndex];
  const l2 = L2_VALUES[l2Index];

  const trainer = useTrainer({
    createModel: initialModel,
    step: (m) => gdStep(m, points, lr, l2),
    loss: (m) => logLoss(m, points, l2),
    stepsPerFrame: 5,
    maxEpochs: 3000,
    tol: 1e-9,
  });
  const model = trainer.model;
  const hasBoth = points.some((p) => p.label === 0) && points.some((p) => p.label === 1);

  const edit = (next) => {
    setPoints(next);
    if (trainer.epoch > 0 && !trainer.running && trainer.status !== "diverged") trainer.play();
  };

  const field = (x, y) => {
    const q = predictProba(model, x, y);
    return q >= 0.5 ? ["--class-b", (q - 0.5) * 0.7] : ["--class-a", (0.5 - q) * 0.7];
  };
  const [w0, w1] = model.w;
  const boundary = clipLine(w0, w1, model.b);
  const c25 = clipLine(w0, w1, model.b + LOGIT_75);
  const c75 = clipLine(w0, w1, model.b - LOGIT_75);

  return (
    <div className="page">
      <PageHeader eyebrow="Classification" title="Logistic regression">
        Learns P(class B | x, y) = σ(w₁x + w₂y + b) by gradient descent on the cross-entropy
        (log) loss. The shading is the model&apos;s predicted probability at every location.
      </PageHeader>

      <div className="viz-grid">
        <section className="card" aria-labelledby="log-plot">
          <h2 id="log-plot" className="visually-hidden">
            Data and decision surface
          </h2>
          <DataToolbar
            tool={tool}
            onTool={setTool}
            labelled
            onRegenerate={() => {
              setPoints(makeTwoBlobs(randomSeed(), { spread: 1.1 }));
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
            label={`Two-class scatter plot with ${points.length} points, shaded by the predicted probability of class B.`}
            hint="Pick a class, then click to add points. Drag to move, or use Erase to remove."
            under={
              <g aria-hidden="true">
                {c25 ? <line className="model-line-alt" {...c25} /> : null}
                {c75 ? <line className="model-line-alt" {...c75} /> : null}
              </g>
            }
            over={boundary ? <line className="model-line" {...boundary} aria-hidden="true" /> : null}
          />
          <div className="legend">
            <span>
              <span className="swatch swatch-a" /> Class A (y = 0)
            </span>
            <span>
              <span className="swatch swatch-b" /> Class B (y = 1)
            </span>
            <span>
              <span className="line" /> p = 0.5 boundary
            </span>
            <span>
              <span className="line dashed" /> p = 0.25 / 0.75
            </span>
          </div>
        </section>

        <div className="stack">
          <section className="card" aria-labelledby="log-train">
            <h2 id="log-train">Training</h2>
            <div className="controls">
              <Slider
                label="Learning rate"
                min={0}
                max={LEARNING_RATES.length - 1}
                value={lrIndex}
                onChange={setLrIndex}
                format={(i) => String(LEARNING_RATES[i])}
              />
              <Slider
                label="L2 regularisation (λ)"
                min={0}
                max={L2_VALUES.length - 1}
                value={l2Index}
                onChange={setL2Index}
                format={(i) => String(L2_VALUES[i])}
                help="Penalises large weights, which keeps the probability surface softer."
              />
              <TrainControls trainer={trainer} disabled={!hasBoth} />
              <TrainingStatus status={trainer.status} />
              {!hasBoth ? <p className="notice">Add at least one point of each class to train.</p> : null}
            </div>
          </section>

          <section className="card" aria-labelledby="log-metrics">
            <h2 id="log-metrics">Metrics</h2>
            <Metrics
              items={[
                { label: "Epoch", value: int(trainer.epoch) },
                { label: "Log loss", value: points.length ? fmt(logLoss(model, points, l2), 4) : "-" },
                { label: "Train accuracy", value: points.length ? pct(accuracy(model, points)) : "-" },
                { label: "w₁", value: fmt(w0) },
                { label: "w₂", value: fmt(w1) },
                { label: "b", value: fmt(model.b) },
              ]}
            />
            <div style={{ marginTop: 16 }}>
              <LossChart history={trainer.history} label="Log loss" />
            </div>
          </section>
        </div>
      </div>

      <section className="card explainer" aria-labelledby="log-how">
        <h2 id="log-how">How it works</h2>
        <p>
          The model computes a weighted sum z = w₁x + w₂y + b and squashes it through the sigmoid
          σ(z) = 1 / (1 + e⁻ᶻ). Each epoch takes one full-batch gradient step on the average log loss.
          The solid line is where σ(z) = 0.5; on perfectly separable data the weights keep growing and
          the surface gets sharper unless L2 regularisation is applied.
        </p>
      </section>
    </div>
  );
}
