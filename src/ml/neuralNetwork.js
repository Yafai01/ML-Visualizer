/**
 * A 2 -> H -> 1 multilayer perceptron for binary classification:
 * tanh hidden layer, sigmoid output, binary cross-entropy loss,
 * trained by full-batch gradient descent with hand-written backpropagation.
 */

import { sigmoid } from "./logisticRegression.js";

/** Inputs live in [-5, 5]; scale them to roughly [-1, 1] inside the network. */
export const INPUT_SCALE = 1 / 5;

export function createNetwork(hidden, rng) {
  const W1 = [];
  const b1 = [];
  const W2 = [];
  for (let j = 0; j < hidden; j++) {
    W1.push([rng.normal(0, 1.5), rng.normal(0, 1.5)]);
    b1.push(rng.normal(0, 0.5));
    W2.push(rng.normal(0, 1 / Math.sqrt(hidden)));
  }
  return { W1, b1, W2, b2: 0 };
}

export function forward(net, x, y) {
  const u = x * INPUT_SCALE;
  const v = y * INPUT_SCALE;
  const h = net.W1.map((w, j) => Math.tanh(w[0] * u + w[1] * v + net.b1[j]));
  const z = h.reduce((a, hj, j) => a + hj * net.W2[j], net.b2);
  return { h, out: sigmoid(z) };
}

export const predictProba = (net, x, y) => forward(net, x, y).out;

export function loss(net, points) {
  if (points.length === 0) return 0;
  const eps = 1e-12;
  let s = 0;
  for (const p of points) {
    const q = predictProba(net, p.x, p.y);
    s -= p.label === 1 ? Math.log(q + eps) : Math.log(1 - q + eps);
  }
  return s / points.length;
}

export function accuracy(net, points) {
  if (points.length === 0) return 0;
  let ok = 0;
  for (const p of points) if ((predictProba(net, p.x, p.y) >= 0.5 ? 1 : 0) === p.label) ok++;
  return ok / points.length;
}

/** One full-batch backpropagation + gradient descent step. */
export function trainStep(net, points, lr) {
  const n = points.length;
  if (n === 0) return net;
  const H = net.W2.length;
  const gW1 = net.W1.map(() => [0, 0]);
  const gb1 = new Array(H).fill(0);
  const gW2 = new Array(H).fill(0);
  let gb2 = 0;
  for (const p of points) {
    const u = p.x * INPUT_SCALE;
    const v = p.y * INPUT_SCALE;
    const { h, out } = forward(net, p.x, p.y);
    const dz = out - p.label; // dL/dz for sigmoid + cross-entropy
    gb2 += dz;
    for (let j = 0; j < H; j++) {
      gW2[j] += dz * h[j];
      const da = dz * net.W2[j] * (1 - h[j] * h[j]); // back through tanh
      gW1[j][0] += da * u;
      gW1[j][1] += da * v;
      gb1[j] += da;
    }
  }
  return {
    W1: net.W1.map((w, j) => [w[0] - (lr * gW1[j][0]) / n, w[1] - (lr * gW1[j][1]) / n]),
    b1: net.b1.map((b, j) => b - (lr * gb1[j]) / n),
    W2: net.W2.map((w, j) => w - (lr * gW2[j]) / n),
    b2: net.b2 - (lr * gb2) / n,
  };
}
