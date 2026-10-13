/**
 * k-means clustering (Lloyd's algorithm) with k-means++ initialisation.
 */

const dist2 = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

/** k-means++ seeding: each new centroid is sampled proportional to squared distance. */
export function initPlusPlus(points, k, rng) {
  if (points.length === 0) return [];
  const first = points[rng.int(points.length)];
  const centroids = [{ x: first.x, y: first.y }];
  while (centroids.length < Math.min(k, points.length)) {
    const d = points.map((p) => Math.min(...centroids.map((c) => dist2(p, c))));
    const total = d.reduce((a, b) => a + b, 0);
    if (total === 0) break; // remaining points coincide with existing centroids
    let r = rng.next() * total;
    let i = 0;
    while (i < d.length - 1 && r >= d[i]) {
      r -= d[i];
      i++;
    }
    centroids.push({ x: points[i].x, y: points[i].y });
  }
  return centroids;
}

export function assign(points, centroids) {
  return points.map((p) => {
    let best = 0;
    let bestD = Infinity;
    centroids.forEach((c, i) => {
      const d = dist2(p, c);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return best;
  });
}

/** Mean of each cluster; an empty cluster keeps its previous centroid. */
export function updateCentroids(points, labels, centroids) {
  return centroids.map((c, i) => {
    let sx = 0;
    let sy = 0;
    let n = 0;
    points.forEach((p, j) => {
      if (labels[j] === i) {
        sx += p.x;
        sy += p.y;
        n++;
      }
    });
    return n === 0 ? { x: c.x, y: c.y } : { x: sx / n, y: sy / n };
  });
}

/** Within-cluster sum of squared distances. */
export function inertia(points, labels, centroids) {
  let s = 0;
  points.forEach((p, i) => {
    s += dist2(p, centroids[labels[i]]);
  });
  return s;
}

/**
 * One Lloyd iteration: assign every point to its nearest centroid, then move
 * each centroid to the mean of its points. `converged` is true when no
 * centroid moved.
 */
export function lloydStep(points, centroids) {
  const labels = assign(points, centroids);
  const next = updateCentroids(points, labels, centroids);
  const moved = next.reduce((m, c, i) => Math.max(m, Math.sqrt(dist2(c, centroids[i]))), 0);
  return { centroids: next, labels: assign(points, next), converged: moved < 1e-9 };
}
