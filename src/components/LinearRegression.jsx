import { useState } from "react";
import { makeLinear } from "../ml/datasets";
import { fitOLS, gdStep, mse, predict, rSquared } from "../ml/linearRegression";
import { randomSeed } from "../ml/random";
import { useTrainer } from "../hooks/useTrainer";
import Plot from "./ui/Plot";
import { clipLine, scale } from "./ui/plotMath";
import { Checkbox, DataToolbar, Slider, TrainControls, TrainingStatus } from "./ui/Controls";
import { LossChart, Metrics } from "./ui/Metrics";
import PageHeader from "./ui/PageHeader";
import { fmt, int } from "./ui/format";

const LEARNING_RATES = [0.001, 0.003, 0.01, 0.02, 0.05, 0.1, 0.2];

export default function LinearRegression() {
  const [points, setPoints] = useState(() => makeLinear(randomSeed()));
  const [tool, setTool] = useState("add");
  const [lrIndex, setLrIndex] = useState(3);
  const [showOls, setShowOls] = useState(true);
  const lr = LEARNING_RATES[lrIndex];

  const trainer = useTrainer({
    createModel: () => ({ w: 0, b: 0 }),
    step: (m) => gdStep(m, points, lr),
    loss: (m) => mse(m, points),
    stepsPerFrame: 4,
    maxEpochs: 3000,
    tol: 1e-10,
  });
  const model = trainer.model;
  const ols = fitOLS(points);
  const enough = points.length >= 2;

  const edit = (next) => {
    setPoints(next);
    if (trainer.epoch > 0 && !trainer.running && trainer.status !== "diverged") trainer.play();
  };

  const line = clipLine(model.w, -1, model.b);
  const olsLine = ols ? clipLine(ols.w, -1, ols.b) : null;
  const r2 = rSquared(model, points);

  return (
    <div className="page">
      <PageHeader eyebrow="Regression" title="Linear regression">
        Fits y = w·x + b by batch gradient descent on the mean squared error, and compares the result
        with the exact least-squares solution.
      </PageHeader>

      <div className="viz-grid">
        <section className="card" aria-labelledby="lin-plot">
          <h2 id="lin-plot" className="visually-hidden">
            Data and fitted line
          </h2>
          <DataToolbar
            tool={tool}
            onTool={setTool}
            onRegenerate={() => {
              setPoints(makeLinear(randomSeed()));
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
            pointFill={() => "var(--class-a)"}
            label={`Scatter plot of ${points.length} points with the gradient-descent regression line.`}
            hint="Click to add a point, drag a point to move it. Thin lines show each residual."
            under={
              <g aria-hidden="true">
                {points.map((p, i) => (
                  <line
                    key={i}
                    className="residual"
                    x1={scale.sx(p.x)}
                    x2={scale.sx(p.x)}
                    y1={scale.sy(p.y)}
                    y2={scale.sy(Math.max(-6, Math.min(6, predict(model, p.x))))}
                  />
                ))}
                {showOls && olsLine ? <line className="model-line-alt" {...olsLine} /> : null}
              </g>
            }
            over={line ? <line className="model-line" {...line} aria-hidden="true" /> : null}
          />
          <div className="legend">
            <span>
              <span className="line" /> Gradient descent fit
            </span>
            {showOls ? (
              <span>
                <span className="line dashed" /> Least-squares solution
              </span>
            ) : null}
          </div>
        </section>

        <div className="stack">
          <section className="card" aria-labelledby="lin-train">
            <h2 id="lin-train">Training</h2>
            <div className="controls">
              <Slider
                label="Learning rate"
                min={0}
                max={LEARNING_RATES.length - 1}
                value={lrIndex}
                onChange={setLrIndex}
                format={(i) => String(LEARNING_RATES[i])}
                help="Too large a step makes gradient descent overshoot and diverge."
              />
              <Checkbox label="Show exact least-squares line" checked={showOls} onChange={setShowOls} />
              <TrainControls trainer={trainer} disabled={!enough} />
              <TrainingStatus status={trainer.status} />
              {!enough ? <p className="notice">Add at least two points to fit a line.</p> : null}
            </div>
          </section>

          <section className="card" aria-labelledby="lin-metrics">
            <h2 id="lin-metrics">Metrics</h2>
            <Metrics
              items={[
                { label: "Epoch", value: int(trainer.epoch) },
                { label: "MSE", value: enough ? fmt(mse(model, points), 4) : "-" },
                { label: "R²", value: r2 === null ? "-" : fmt(r2, 3) },
                { label: "Optimal MSE", value: ols ? fmt(mse(ols, points), 4) : "-" },
                { label: "Slope w", value: fmt(model.w) },
                { label: "Intercept b", value: fmt(model.b) },
                { label: "Exact w", value: ols ? fmt(ols.w) : "-" },
                { label: "Exact b", value: ols ? fmt(ols.b) : "-" },
              ]}
            />
            <div style={{ marginTop: 16 }}>
              <LossChart history={trainer.history} label="MSE" />
            </div>
          </section>
        </div>
      </div>

      <section className="card explainer" aria-labelledby="lin-how">
        <h2 id="lin-how">How it works</h2>
        <p>
          Each epoch computes the gradient of the mean squared error over all points and moves w and b
          a small step against it. The dashed line is the closed-form ordinary least-squares solution,
          so you can watch gradient descent approach it. Editing the data while a model exists resumes
          training from the current parameters.
        </p>
      </section>
    </div>
  );
}
