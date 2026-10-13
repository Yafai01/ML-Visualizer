/**
 * CART classification tree on 2-D points (features "x" and "y"),
 * using Gini impurity and axis-aligned threshold splits.
 */

export const FEATURES = ["x", "y"];

function counts(points) {
  const c = [0, 0];
  for (const p of points) c[p.label]++;
  return c;
}

export function gini(c) {
  const n = c[0] + c[1];
  if (n === 0) return 0;
  const p0 = c[0] / n;
  const p1 = c[1] / n;
  return 1 - p0 * p0 - p1 * p1;
}

/** Best split over both features, or null if no split reduces impurity. */
export function bestSplit(points, minLeaf = 1) {
  const n = points.length;
  const parent = gini(counts(points));
  let best = null;
  for (const feature of FEATURES) {
    const sorted = [...points].sort((a, b) => a[feature] - b[feature]);
    const left = [0, 0];
    const right = counts(points);
    for (let i = 0; i < n - 1; i++) {
      left[sorted[i].label]++;
      right[sorted[i].label]--;
      const a = sorted[i][feature];
      const b = sorted[i + 1][feature];
      if (a === b) continue;
      const nl = i + 1;
      const nr = n - nl;
      if (nl < minLeaf || nr < minLeaf) continue;
      const impurity = (nl / n) * gini(left) + (nr / n) * gini(right);
      if (impurity < parent - 1e-12 && (!best || impurity < best.impurity - 1e-12)) {
        best = { feature, threshold: (a + b) / 2, impurity, gain: parent - impurity };
      }
    }
  }
  return best;
}

export function buildTree(points, { maxDepth = 3, minLeaf = 1 } = {}, depth = 0) {
  const c = counts(points);
  const node = {
    n: points.length,
    counts: c,
    gini: gini(c),
    prediction: c[1] > c[0] ? 1 : 0,
    depth,
  };
  if (depth >= maxDepth || node.gini === 0 || points.length < 2 * minLeaf) return node;
  const split = bestSplit(points, minLeaf);
  if (!split) return node;
  const leftPts = points.filter((p) => p[split.feature] <= split.threshold);
  const rightPts = points.filter((p) => p[split.feature] > split.threshold);
  return {
    ...node,
    feature: split.feature,
    threshold: split.threshold,
    gain: split.gain,
    left: buildTree(leftPts, { maxDepth, minLeaf }, depth + 1),
    right: buildTree(rightPts, { maxDepth, minLeaf }, depth + 1),
  };
}

export const isLeaf = (node) => !node.left;

export function predict(tree, p) {
  let node = tree;
  while (!isLeaf(node)) node = p[node.feature] <= node.threshold ? node.left : node.right;
  return node.prediction;
}

export function accuracy(tree, points) {
  if (points.length === 0) return 0;
  return points.filter((p) => predict(tree, p) === p.label).length / points.length;
}

/** Axis-aligned rectangles of every leaf, clipped to `bounds` ({x0, x1, y0, y1}). */
export function leafRegions(tree, bounds) {
  if (isLeaf(tree)) return [{ ...bounds, node: tree }];
  const { feature, threshold } = tree;
  const lo = feature === "x" ? { ...bounds, x1: threshold } : { ...bounds, y1: threshold };
  const hi = feature === "x" ? { ...bounds, x0: threshold } : { ...bounds, y0: threshold };
  return [...leafRegions(tree.left, lo), ...leafRegions(tree.right, hi)];
}

export function stats(tree) {
  if (isLeaf(tree)) return { leaves: 1, depth: tree.depth };
  const l = stats(tree.left);
  const r = stats(tree.right);
  return { leaves: l.leaves + r.leaves, depth: Math.max(l.depth, r.depth) };
}
