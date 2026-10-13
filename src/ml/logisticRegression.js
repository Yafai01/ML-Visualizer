/**
 * Binary logistic regression on 2-D points with labels 0 / 1,
 * trained by full-batch gradient descent on (optionally L2-regularised) log loss.
 */

export const sigmoid = (z) => (z >= 0 ? 1 / (1 + Math.exp(-z)) : Math.exp(z) / (1 + Math.exp(z)));

export const initialModel = () => ({ w: [0, 0], b: 0 });

export const predictProba = (model, x, y) => sigmoid(model.w[0] * x + model.w[1] * y + model.b);

export function logLoss(model, points, l2 = 0) {
  if (points.length === 0) return 0;
  const eps = 1e-12;
  let s = 0;
  for (const p of points) {
    const q = predictProba(model, p.x, p.y);
    s -= p.label === 1 ? Math.log(q + eps) : Math.log(1 - q + eps);
  }
  return s / points.length + (l2 / 2) * (model.w[0] ** 2 + model.w[1] ** 2);
}

export function accuracy(model, points) {
  if (points.length === 0) return 0;
  let ok = 0;
  for (const p of points) {
    if ((predictProba(model, p.x, p.y) >= 0.5 ? 1 : 0) === p.label) ok++;
  }
  return ok / points.length;
}

export function gdStep(model, points, lr, l2 = 0) {
  const n = points.length;
  if (n === 0) return model;
  let g0 = 0;
  let g1 = 0;
  let gb = 0;
  for (const p of points) {
    const err = predictProba(model, p.x, p.y) - p.label;
    g0 += err * p.x;
    g1 += err * p.y;
    gb += err;
  }
  return {
    w: [model.w[0] - lr * (g0 / n + l2 * model.w[0]), model.w[1] - lr * (g1 / n + l2 * model.w[1])],
    b: model.b - lr * (gb / n),
  };
}
