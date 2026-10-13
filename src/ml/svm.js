/**
 * Linear soft-margin SVM trained with (full-batch) Pegasos sub-gradient descent.
 *
 * Minimises  lambda/2 * ||w||^2 + 1/n * sum max(0, 1 - y_i (w . x_i + b))
 * with labels y in {-1, +1} (mapped from 0 / 1) and step size 1 / (lambda * t).
 * The full batch is used at every step (deterministic Pegasos), so the
 * iterates are stable enough to report the latest one directly.
 * The bias is not regularised.
 */

const sign = (label) => (label === 1 ? 1 : -1);

export const initialModel = () => ({ w: [0, 0], b: 0, t: 0 });

export const decision = (m, x, y) => m.w[0] * x + m.w[1] * y + m.b;

export function pegasosStep(state, points, lambda) {
  const n = points.length;
  if (n === 0) return state;
  const t = state.t + 1;
  const eta = 1 / (lambda * t);
  let g0 = 0;
  let g1 = 0;
  let gb = 0;
  for (const p of points) {
    const y = sign(p.label);
    if (y * decision(state, p.x, p.y) < 1) {
      g0 += y * p.x;
      g1 += y * p.y;
      gb += y;
    }
  }
  const shrink = 1 - eta * lambda; // equals 1 - 1/t
  let w0 = shrink * state.w[0] + (eta / n) * g0;
  let w1 = shrink * state.w[1] + (eta / n) * g1;
  // Optional Pegasos projection onto the ball of radius 1/sqrt(lambda).
  const norm = Math.hypot(w0, w1);
  const radius = 1 / Math.sqrt(lambda);
  if (norm > radius) {
    w0 *= radius / norm;
    w1 *= radius / norm;
  }
  // Bias: plain (unregularised) sub-gradient step.
  const b = state.b + (eta / n) * gb;
  return { w: [w0, w1], b, t };
}

export function objective(model, points, lambda) {
  if (points.length === 0) return 0;
  let hinge = 0;
  for (const p of points) hinge += Math.max(0, 1 - sign(p.label) * decision(model, p.x, p.y));
  return (lambda / 2) * (model.w[0] ** 2 + model.w[1] ** 2) + hinge / points.length;
}

export function accuracy(model, points) {
  if (points.length === 0) return 0;
  let ok = 0;
  for (const p of points) if ((decision(model, p.x, p.y) >= 0 ? 1 : 0) === p.label) ok++;
  return ok / points.length;
}

/** Width of the margin band between w.x+b = -1 and w.x+b = +1. */
export function marginWidth(model) {
  const norm = Math.hypot(model.w[0], model.w[1]);
  return norm < 1e-12 ? Infinity : 2 / norm;
}

/** Indices of points on or inside the margin (y * f(x) <= 1 + tol): the support vectors. */
export function supportVectors(model, points, tol = 1e-2) {
  const idx = [];
  points.forEach((p, i) => {
    if (sign(p.label) * decision(model, p.x, p.y) <= 1 + tol) idx.push(i);
  });
  return idx;
}
