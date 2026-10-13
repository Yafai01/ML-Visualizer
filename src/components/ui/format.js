export const fmt = (v, digits = 3) => (Number.isFinite(v) ? v.toFixed(digits) : "-");

export const pct = (v) => (Number.isFinite(v) ? `${(v * 100).toFixed(1)}%` : "-");

export const int = (v) => (Number.isFinite(v) ? Math.round(v).toLocaleString() : "-");
