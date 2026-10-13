import { useState } from "react";
import { makeTwoBlobs } from "../ml/datasets";
import {
  accuracy,
  decision,
  initialModel,
  marginWidth,
  objective,
  pegasosStep,
  supportVectors,
} from "../ml/svm";
import { randomSeed } from "../ml/random";
import { useTrainer } from "../hooks/useTrainer";
import Plot from "./ui/Plot";
import { classFill, clipLine, scale } from "./ui/plotMath";
import { DataToolbar, Slider, TrainControls, TrainingStatus } from "./ui/Controls";
import { LossChart, Metrics } from "./ui/Metrics";
import PageHeader from "./ui/PageHeader";
import { fmt, int, pct } from "./ui/format";

const LAMBDAS = [0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1];
const SV_TOLERANCE = 0.05;

export default function SVM() {
  const [points, setPoints] = useState(() => makeTwoBlobs(randomSeed(), { spread: 0.8 }));
  const [tool, setTool] = useState("add-0");
  const [lambdaIndex, setLambdaIndex] = useState(2);
  const lambda = LAMBDAS[lambdaIndex];

  const trainer = useTrainer({
    createModel: initialModel,
    step: (m) => pegasosStep(m, points, lambda),
    loss: (m) => objective(m, points, lambda),
    stepsPerFrame: 10,
    maxEpochs: 2000,
    tol: 1e-7,
  });
  const model = trainer.model;
  const hasBoth = points.some((p) => p.label === 0) && points.some((p) => p.label === 1);
  const trained = trainer.epoch > 0;

  // Pegasos uses a decaying 1/(lambda * t) step size, so any change to the data
  // or to lambda restarts training from scratch instead of warm-starting.
  const edit = (next) => {
    setPoints(next);
    if (trained) trainer.reset(true);
  };

  const field = trained
    ? (x, y) => {
        const f = decision(model, x, y);
        return [f >= 0 ? "--class-b" : "--class-a", Math.min(1, Math.abs(f)) * 0.3];
      }
    : undefined;

  const [w0, w1] = model.w;
  const boundary = trained ? clipLine(w0, w1, model.b) : null;
  const marginPlus = trained ? clipLine(w0, w1, model.b - 1) : null;
  const marginMinus = trained ? clipLine(w0, w1, model.b + 1) : null;
  const sv = trained ? supportVectors(model, points, SV_TOLERANCE) : [];
  const reg = (lambda / 2) * (w0 ** 2 + w1 ** 2);
  const obj = objective(model, points, lambda);
  const width = marginWidth(model);

  return (
    <div className="page">
      <PageHeader eyebrow="Classification" title="Support vector machine">
        A linear soft-margin SVM trained in the browser with the Pegasos sub-gradient method. The
        boundary, the margins and the support vectors are all computed from the trained weights.
      </PageHeader>

      <div className="viz-grid">
        <section className="card" aria-labelledby="svm-plot">
          <h2 id="svm-plot" className="visually-hidden">
            Data, decision boundary and margins
          </h2>
          <DataToolbar
            tool={tool}
            onTool={setTool}
            labelled
            onRegenerate={() => {
              setPoints(makeTwoBlobs(randomSeed(), { spread: 0.8 }));
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
            label={`Two-class scatter plot with ${points.length} points${
              trained ? `, the SVM decision boundary, its margins and ${sv.length} support vectors` : ""
            }.`}
            hint="Pick a class, then click to add points. Drag to move, or use Erase to remove. Training restarts after each edit."
            under={
              <g aria-hidden="true">
                {marginPlus ? <line className="model-line-alt" {...marginPlus} /> : null}
                {marginMinus ? <line className="model-line-alt" {...marginMinus} /> : null}
              </g>
            }
            over={
              <g aria-hidden="true">
                {boundary ? <line className="model-line" {...boundary} /> : null}
                {sv.map((i) => (
                  <circle
                    key={i}
                    cx={scale.sx(points[i].x)}
                    cy={scale.sy(points[i].y)}
                    r={10}
                    fill="none"
                    stroke="var(--text)"
                    strokeWidth="1.5"
                  />
                ))}
              </g>
            }
          />
          <div className="legend">
            <span>
              <span className="line" /> w·x + b = 0
            </span>
            <span>
              <span className="line dashed" /> Margins w·x + b = ±1
            </span>
            <span>
              <svg width="14" height="14" aria-hidden="true">
                <circle cx="7" cy="7" r="5.5" fill="none" stroke="var(--text)" strokeWidth="1.5" />
              </svg>
              Support vectors (on or inside the margin)
            </span>
          </div>
        </section>

        <div className="stack">
          <section className="card" aria-labelledby="svm-train">
            <h2 id="svm-train">Training</h2>
            <div className="controls">
              <Slider
                label="Regularisation λ"
                min={0}
                max={LAMBDAS.length - 1}
                value={lambdaIndex}
                onChange={(i) => {
                  setLambdaIndex(i);
                  if (trained) trainer.reset(true);
                }}
                format={(i) => String(LAMBDAS[i])}
                help="Larger λ favours a wider margin and tolerates more violations (like a smaller C)."
              />
              <TrainControls trainer={trainer} disabled={!hasBoth} />
              <TrainingStatus status={trainer.status} />
              {!hasBoth ? <p className="notice">Add at least one point of each class to train.</p> : null}
            </div>
          </section>

          <section className="card" aria-labelledby="svm-metrics">
            <h2 id="svm-metrics">Metrics</h2>
            <Metrics
              items={[
                { label: "Iteration", value: int(trainer.epoch) },
                { label: "Objective", value: points.length ? fmt(obj, 4) : "-" },
                { label: "Mean hinge loss", value: points.length ? fmt(obj - reg, 4) : "-" },
                { label: "Train accuracy", value: trained && points.length ? pct(accuracy(model, points)) : "-" },
                { label: "Margin width", value: trained && Number.isFinite(width) ? fmt(width, 3) : "-" },
                { label: "Support vectors", value: trained ? int(sv.length) : "-" },
              ]}
            />
            <div style={{ marginTop: 16 }}>
              <LossChart history={trainer.history} label="Objective" xLabel="iteration" />
            </div>
          </section>
        </div>
      </div>

      <section className="card explainer" aria-labelledby="svm-how">
        <h2 id="svm-how">How it works</h2>
        <p>
          The objective is λ/2·‖w‖² + mean(max(0, 1 − yᵢ(w·xᵢ + b))). At iteration t, Pegasos takes a
          sub-gradient step of size 1/(λt) using every point that violates its margin, then projects w
          onto a ball of radius 1/√λ. The margin width is 2/‖w‖. Support vectors are the points with
          yᵢ·f(xᵢ) ≤ 1 (within a small tolerance, since sub-gradient methods converge approximately).
        </p>
      </section>
    </div>
  );
}
