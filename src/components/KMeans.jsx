import { useState } from "react";
import { makeClusters } from "../ml/datasets";
import { assign, inertia, initPlusPlus, lloydStep } from "../ml/kmeans";
import { createRng, randomSeed } from "../ml/random";
import { useAnimationLoop } from "../hooks/useAnimationLoop";
import Plot from "./ui/Plot";
import { scale } from "./ui/plotMath";
import { DataToolbar, Slider } from "./ui/Controls";
import { LossChart, Metrics } from "./ui/Metrics";
import PageHeader from "./ui/PageHeader";
import { fmt, int } from "./ui/format";
import { PauseIcon, PlayIcon, ResetIcon, StepIcon } from "./Icons";

const color = (i) => `var(--c${i % 6})`;

function initialise(points, k) {
  const centroids = initPlusPlus(points, k, createRng(randomSeed()));
  const history = centroids.length
    ? [{ epoch: 0, loss: inertia(points, assign(points, centroids), centroids) }]
    : [];
  return { centroids, iteration: 0, converged: false, history };
}

export default function KMeans() {
  const [k, setK] = useState(3);
  const [points, setPoints] = useState(() => makeClusters(randomSeed(), { k: 3 }));
  const [run, setRun] = useState(() => initialise(points, k));
  const [auto, setAuto] = useState(false);
  const [tool, setTool] = useState("add");

  const { centroids, iteration, converged, history } = run;
  const ready = centroids.length > 0 && points.length > 0;
  const labels = ready ? assign(points, centroids) : points.map(() => 0);
  const currentInertia = ready ? inertia(points, labels, centroids) : NaN;

  const step = () => {
    if (!ready) return;
    const r = lloydStep(points, centroids);
    const nextIteration = iteration + 1;
    setRun({
      centroids: r.centroids,
      iteration: nextIteration,
      converged: r.converged,
      history: [...history, { epoch: nextIteration, loss: inertia(points, r.labels, r.centroids) }],
    });
    if (r.converged) setAuto(false);
  };

  useAnimationLoop(auto, step, 450);

  const reinitialise = (pts = points, kk = k) => {
    setRun(initialise(pts, kk));
    setAuto(false);
  };

  const edit = (next) => {
    setPoints(next);
    if (centroids.length < Math.min(k, next.length)) {
      setRun(initialise(next, k));
    } else if (converged) {
      setRun({ ...run, converged: false });
    }
  };

  const field = ready
    ? (x, y) => {
        let best = 0;
        let bestD = Infinity;
        centroids.forEach((c, i) => {
          const d = (c.x - x) ** 2 + (c.y - y) ** 2;
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        });
        return [`--c${best % 6}`, 0.13];
      }
    : undefined;

  const sizes = centroids.map((_, i) => labels.filter((l) => l === i).length);

  return (
    <div className="page">
      <PageHeader eyebrow="Clustering" title="k-means clustering">
        Lloyd&apos;s algorithm with k-means++ initialisation. Each iteration assigns every point to its
        nearest centroid, then moves each centroid to the mean of its points.
      </PageHeader>

      <div className="viz-grid">
        <section className="card" aria-labelledby="km-plot">
          <h2 id="km-plot" className="visually-hidden">
            Points, clusters and centroids
          </h2>
          <DataToolbar
            tool={tool}
            onTool={setTool}
            onRegenerate={() => {
              const next = makeClusters(randomSeed(), { k });
              setPoints(next);
              reinitialise(next, k);
            }}
            onClear={() => {
              setPoints([]);
              reinitialise([], k);
            }}
          />
          <Plot
            points={points}
            onPointsChange={edit}
            tool={tool}
            pointFill={(_, i) => color(labels[i])}
            field={field}
            label={`Scatter plot of ${points.length} points coloured by cluster, with ${centroids.length} centroids.`}
            hint="Click to add points, drag to move them. Centroids are drawn as crosses; the shading shows which centroid is nearest."
            over={
              <g aria-hidden="true">
                {centroids.map((c, i) => {
                  const x = scale.sx(c.x);
                  const y = scale.sy(c.y);
                  const d = `M${x - 8},${y - 8}L${x + 8},${y + 8}M${x + 8},${y - 8}L${x - 8},${y + 8}`;
                  return (
                    <g key={i}>
                      <path d={d} stroke="var(--plot-bg)" strokeWidth="7" strokeLinecap="round" />
                      <path d={d} stroke={color(i)} strokeWidth="3.5" strokeLinecap="round" />
                    </g>
                  );
                })}
              </g>
            }
          />
        </section>

        <div className="stack">
          <section className="card" aria-labelledby="km-train">
            <h2 id="km-train">Algorithm</h2>
            <div className="controls">
              <Slider
                label="Number of clusters (k)"
                min={2}
                max={6}
                value={k}
                onChange={(v) => {
                  setK(v);
                  reinitialise(points, v);
                }}
                help="Changing k re-runs k-means++ initialisation."
              />
              <div className="btn-row">
                {auto ? (
                  <button type="button" className="btn btn-primary" onClick={() => setAuto(false)}>
                    <PauseIcon size={16} /> Pause
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setAuto(true)}
                    disabled={!ready || converged}
                  >
                    <PlayIcon size={16} /> Run
                  </button>
                )}
                <button type="button" className="btn" onClick={step} disabled={!ready || auto || converged}>
                  <StepIcon size={16} /> Step
                </button>
                <button type="button" className="btn" onClick={() => reinitialise()} disabled={points.length === 0}>
                  <ResetIcon size={16} /> Re-initialise
                </button>
              </div>
              <span className={`status ${converged ? "status-converged" : auto ? "status-running" : ""}`} role="status">
                {converged
                  ? `Converged after ${iteration} iteration${iteration === 1 ? "" : "s"}`
                  : auto
                    ? "Running"
                    : iteration > 0
                      ? "Paused"
                      : "Initialised with k-means++"}
              </span>
              {!ready ? <p className="notice">Add some points to start clustering.</p> : null}
            </div>
          </section>

          <section className="card" aria-labelledby="km-metrics">
            <h2 id="km-metrics">Metrics</h2>
            <Metrics
              items={[
                { label: "Iteration", value: int(iteration) },
                { label: "Inertia (WCSS)", value: fmt(currentInertia, 2) },
                { label: "Points", value: int(points.length) },
                { label: "Cluster sizes", value: sizes.length ? sizes.join(", ") : "-" },
              ]}
            />
            <div style={{ marginTop: 16 }}>
              <LossChart history={history} label="Inertia" xLabel="iteration" format={(v) => v.toFixed(2)} />
            </div>
          </section>
        </div>
      </div>

      <section className="card explainer" aria-labelledby="km-how">
        <h2 id="km-how">How it works</h2>
        <p>
          Inertia is the within-cluster sum of squared distances to each centroid. Every Lloyd iteration
          can only lower it or leave it unchanged, so the algorithm always converges, but possibly to a
          local optimum: try Re-initialise to see different k-means++ starts give different results.
        </p>
      </section>
    </div>
  );
}
