/** Grid of computed metrics. items: [{ label, value }]. */
export function Metrics({ items }) {
  return (
    <dl className="metrics">
      {items.map((m) => (
        <div className="metric" key={m.label}>
          <dt>{m.label}</dt>
          <dd>{m.value}</dd>
        </div>
      ))}
    </dl>
  );
}

const W = 320;
const H = 110;
const PAD = 6;

/** Minimal line chart of a training curve: history = [{ epoch, loss }]. */
export function LossChart({ history, label = "Loss", xLabel = "epoch", format = (v) => v.toFixed(4) }) {
  const finite = history.filter((h) => Number.isFinite(h.loss));
  if (finite.length < 2) {
    return (
      <div>
        <div className="chart-caption">
          <span>{label}</span>
        </div>
        <p className="notice">The {label.toLowerCase()} curve appears once training has run for a few steps.</p>
      </div>
    );
  }
  const xs = finite.map((h) => h.epoch);
  const ys = finite.map((h) => h.loss);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = Math.min(0, ...ys);
  const y1 = Math.max(...ys) || 1;
  const px = (x) => PAD + ((x - x0) / (x1 - x0 || 1)) * (W - 2 * PAD);
  const py = (y) => H - PAD - ((y - y0) / (y1 - y0 || 1)) * (H - 2 * PAD);
  const line = finite.map((h, i) => `${i ? "L" : "M"}${px(h.epoch).toFixed(1)},${py(h.loss).toFixed(1)}`).join("");
  const area = `${line}L${px(x1).toFixed(1)},${H - PAD}L${px(x0).toFixed(1)},${H - PAD}Z`;
  const last = finite[finite.length - 1];
  return (
    <div>
      <div className="chart-caption">
        <span>
          {label} by {xLabel}
        </span>
        <span className="mono">
          {xLabel} {last.epoch.toLocaleString()}: {format(last.loss)}
        </span>
      </div>
      <svg
        className="chart"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${label} curve from ${xLabel} ${x0} to ${x1}; latest value ${format(last.loss)}, peak ${format(Math.max(...ys))}.`}
      >
        <path className="chart-area" d={area} />
        <path className="chart-line" d={line} />
      </svg>
    </div>
  );
}
