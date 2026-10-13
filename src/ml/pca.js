/**
 * Principal component analysis for 2-D data, via the closed-form
 * eigen-decomposition of the 2x2 sample covariance matrix.
 */

export function mean(points) {
  const n = points.length || 1;
  return {
    x: points.reduce((a, p) => a + p.x, 0) / n,
    y: points.reduce((a, p) => a + p.y, 0) / n,
  };
}

/** Sample covariance (divides by n - 1). */
export function covariance(points) {
  const n = points.length;
  if (n < 2) return { xx: 0, xy: 0, yy: 0 };
  const m = mean(points);
  let xx = 0;
  let xy = 0;
  let yy = 0;
  for (const p of points) {
    const dx = p.x - m.x;
    const dy = p.y - m.y;
    xx += dx * dx;
    xy += dx * dy;
    yy += dy * dy;
  }
  return { xx: xx / (n - 1), xy: xy / (n - 1), yy: yy / (n - 1) };
}

/** Eigenvalues (descending) and unit eigenvectors of a symmetric 2x2 matrix. */
export function eigenSymmetric2({ xx, xy, yy }) {
  const tr = xx + yy;
  const det = xx * yy - xy * xy;
  const disc = Math.sqrt(Math.max(0, (tr * tr) / 4 - det));
  const l1 = tr / 2 + disc;
  const l2 = tr / 2 - disc;
  let v1;
  if (Math.abs(xy) > 1e-12) {
    v1 = [l1 - yy, xy];
  } else {
    v1 = xx >= yy ? [1, 0] : [0, 1];
  }
  const len = Math.hypot(v1[0], v1[1]);
  v1 = [v1[0] / len, v1[1] / len];
  // Canonical orientation: point into the right half-plane.
  if (v1[0] < 0 || (v1[0] === 0 && v1[1] < 0)) v1 = [-v1[0], -v1[1]];
  return { values: [l1, Math.max(0, l2)], vectors: [v1, [-v1[1], v1[0]]] };
}

export function pca(points) {
  const m = mean(points);
  const cov = covariance(points);
  const { values, vectors } = eigenSymmetric2(cov);
  const total = values[0] + values[1];
  return {
    mean: m,
    cov,
    values,
    vectors,
    explained: total > 0 ? [values[0] / total, values[1] / total] : [0, 0],
  };
}

/** Variance of the data projected onto the unit direction at `angle` (radians). */
export function projectedVariance(points, angle) {
  const { xx, xy, yy } = covariance(points);
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return c * c * xx + 2 * c * s * xy + s * s * yy;
}

/** Orthogonal projection of each point onto the line through `origin` along unit `dir`. */
export function project(points, origin, dir) {
  return points.map((p) => {
    const t = (p.x - origin.x) * dir[0] + (p.y - origin.y) * dir[1];
    return { t, x: origin.x + t * dir[0], y: origin.y + t * dir[1] };
  });
}
