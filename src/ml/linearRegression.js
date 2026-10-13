/**
 * Simple linear regression y = w * x + b.
 * Closed-form ordinary least squares plus batch gradient descent on MSE.
 */

export function fitOLS(points) {
  const n = points.length;
  if (n < 2) return null;
  let mx = 0;
  let my = 0;
  for (const p of points) {
    mx += p.x;
    my += p.y;
  }
  mx /= n;
  my /= n;
  let sxy = 0;
  let sxx = 0;
  for (const p of points) {
    sxy += (p.x - mx) * (p.y - my);
    sxx += (p.x - mx) ** 2;
  }
  if (sxx < 1e-12) return null; // all x identical: slope undefined
  const w = sxy / sxx;
  return { w, b: my - w * mx };
}

export const predict = (model, x) => model.w * x + model.b;

export function mse(model, points) {
  if (points.length === 0) return 0;
  let s = 0;
  for (const p of points) s += (predict(model, p.x) - p.y) ** 2;
  return s / points.length;
}

/** Coefficient of determination. Returns null when y has zero variance. */
export function rSquared(model, points) {
  if (points.length < 2) return null;
  const my = points.reduce((a, p) => a + p.y, 0) / points.length;
  let ssTot = 0;
  let ssRes = 0;
  for (const p of points) {
    ssTot += (p.y - my) ** 2;
    ssRes += (p.y - predict(model, p.x)) ** 2;
  }
  return ssTot < 1e-12 ? null : 1 - ssRes / ssTot;
}

/** One full-batch gradient descent step on mean squared error. */
export function gdStep(model, points, lr) {
  const n = points.length;
  if (n === 0) return model;
  let gw = 0;
  let gb = 0;
  for (const p of points) {
    const err = predict(model, p.x) - p.y;
    gw += err * p.x;
    gb += err;
  }
  return { w: model.w - lr * (2 / n) * gw, b: model.b - lr * (2 / n) * gb };
}
