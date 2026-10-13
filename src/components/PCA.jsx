import { useState } from "react";
import { makeCorrelated } from "../ml/datasets";
import { pca, project, projectedVariance } from "../ml/pca";
import { randomSeed } from "../ml/random";
import Plot from "./ui/Plot";
import { clipLine, scale } from "./ui/plotMath";
import { Checkbox, DataToolbar, Slider } from "./ui/Controls";
import { Metrics } from "./ui/Metrics";
import PageHeader from "./ui/PageHeader";
import { fmt, pct } from "./ui/format";

/** Line through point m with direction d, as ax + by + c = 0. */
const lineThrough = (m, d) => clipLine(d[1], -d[0], d[0] * m.y - d[1] * m.x);

export default function PCA() {
  const [points, setPoints] = useState(() => makeCorrelated(randomSeed()));
  const [tool, setTool] = useState("add");
  const [showProjections, setShowProjections] = useState(true);
  const [showCustom, setShowCustom] = useState(false);
  const [angle, setAngle] = useState(0);

  const enough = points.length >= 2;
  const r = enough ? pca(points) : null;
  const rad = (angle * Math.PI) / 180;
  const customDir = [Math.cos(rad), Math.sin(rad)];
  const total = r ? r.values[0] + r.values[1] : 0;
  const customVar = enough ? projectedVariance(points, rad) : NaN;
  const pc1Angle = r ? ((Math.atan2(r.vectors[0][1], r.vectors[0][0]) * 180) / Math.PI + 180) % 180 : NaN;

  let overlay = null;
  if (r) {
    const m = r.mean;
    const pc1 = lineThrough(m, r.vectors[0]);
    const pc2 = lineThrough(m, r.vectors[1]);
    const custom = showCustom ? lineThrough(m, customDir) : null;
    const proj = showProjections ? project(points, m, r.vectors[0]) : [];
    const arrow = (v, len) => ({
      x1: scale.sx(m.x),
      y1: scale.sy(m.y),
      x2: scale.sx(m.x + v[0] * len),
      y2: scale.sy(m.y + v[1] * len),
    });
    overlay = (
      <g aria-hidden="true">
        {proj.map((p, i) => (
          <line
            key={`c${i}`}
            className="residual"
            x1={scale.sx(points[i].x)}
            y1={scale.sy(points[i].y)}
            x2={scale.sx(p.x)}
            y2={scale.sy(p.y)}
          />
        ))}
        {pc2 ? <line className="model-line-alt" {...pc2} /> : null}
        {pc1 ? <line className="model-line" style={{ strokeWidth: 1.5 }} {...pc1} /> : null}
        {custom ? <line className="accent-line" strokeDasharray="8 4" {...custom} /> : null}
        <line className="model-line" style={{ strokeWidth: 4 }} {...arrow(r.vectors[0], 2 * Math.sqrt(r.values[0]))} />
        <line className="model-line" style={{ strokeWidth: 4 }} {...arrow(r.vectors[1], 2 * Math.sqrt(r.values[1]))} />
        {proj.map((p, i) => (
          <circle key={`p${i}`} cx={scale.sx(p.x)} cy={scale.sy(p.y)} r={2.5} fill="var(--model)" />
        ))}
        <circle cx={scale.sx(m.x)} cy={scale.sy(m.y)} r={5} fill="var(--plot-bg)" stroke="var(--model)" strokeWidth="2" />
      </g>
    );
  }

  return (
    <div className="page">
      <PageHeader eyebrow="Dimensionality reduction" title="Principal component analysis">
        Computes the sample covariance matrix of the points and its eigen-decomposition. The first
        principal component is the direction along which the projected data has the largest variance.
      </PageHeader>

      <div className="viz-grid">
        <section className="card" aria-labelledby="pca-plot">
          <h2 id="pca-plot" className="visually-hidden">
            Data and principal components
          </h2>
          <DataToolbar
            tool={tool}
            onTool={setTool}
            onRegenerate={() => setPoints(makeCorrelated(randomSeed()))}
            onClear={() => setPoints([])}
          />
          <Plot
            points={points}
            onPointsChange={setPoints}
            tool={tool}
            pointFill={() => "var(--class-a)"}
            label={`Scatter plot of ${points.length} points with their principal axes.`}
            hint="Click to add points, drag to move them. Everything updates instantly."
            over={overlay}
          />
          <div className="legend">
            <span>
              <span className="line" /> PC1 (arrow length 2√λ₁)
            </span>
            <span>
              <span className="line dashed" /> PC2
            </span>
            {showCustom ? (
              <span>
                <span className="line accent" /> Your direction
              </span>
            ) : null}
          </div>
        </section>

        <div className="stack">
          <section className="card" aria-labelledby="pca-settings">
            <h2 id="pca-settings">Explore</h2>
            <div className="controls">
              <Checkbox label="Show projections onto PC1" checked={showProjections} onChange={setShowProjections} />
              <Checkbox label="Compare with a direction of my choice" checked={showCustom} onChange={setShowCustom} />
              {showCustom ? (
                <Slider
                  label="Direction angle"
                  min={0}
                  max={179}
                  value={angle}
                  onChange={setAngle}
                  format={(v) => `${v}°`}
                  help="No angle captures more variance than PC1."
                />
              ) : null}
              {!enough ? <p className="notice">Add at least two points to compute principal components.</p> : null}
            </div>
          </section>

          <section className="card" aria-labelledby="pca-metrics">
            <h2 id="pca-metrics">Results</h2>
            <Metrics
              items={[
                { label: "λ₁ (PC1 variance)", value: r ? fmt(r.values[0]) : "-" },
                { label: "λ₂ (PC2 variance)", value: r ? fmt(r.values[1]) : "-" },
                { label: "PC1 explains", value: r ? pct(r.explained[0]) : "-" },
                { label: "PC1 angle", value: r ? `${pc1Angle.toFixed(1)}°` : "-" },
                ...(showCustom
                  ? [
                      { label: "Your direction variance", value: fmt(customVar) },
                      { label: "Your direction explains", value: total > 0 ? pct(customVar / total) : "-" },
                    ]
                  : []),
              ]}
            />
            {r ? (
              <>
                <h3 style={{ margin: "16px 0 8px" }}>Covariance matrix</h3>
                <table className="matrix">
                  <thead>
                    <tr>
                      <th scope="col">
                        <span className="visually-hidden">Variable</span>
                      </th>
                      <th scope="col">x</th>
                      <th scope="col">y</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">x</th>
                      <td>{fmt(r.cov.xx)}</td>
                      <td>{fmt(r.cov.xy)}</td>
                    </tr>
                    <tr>
                      <th scope="row">y</th>
                      <td>{fmt(r.cov.xy)}</td>
                      <td>{fmt(r.cov.yy)}</td>
                    </tr>
                  </tbody>
                </table>
              </>
            ) : null}
          </section>
        </div>
      </div>

      <section className="card explainer" aria-labelledby="pca-how">
        <h2 id="pca-how">How it works</h2>
        <p>
          For two dimensions the eigenvalues of the covariance matrix have a closed form, so no iterative
          solver is needed. Projecting every point onto PC1 reduces the data from 2-D to 1-D while
          keeping the fraction of variance shown as &ldquo;PC1 explains&rdquo;. Turn on the custom
          direction to check that every other angle keeps less.
        </p>
      </section>
    </div>
  );
}
