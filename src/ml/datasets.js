import { createRng } from "./random.js";

/** All 2-D datasets live in the square [-DOMAIN, DOMAIN]^2. */
export const DOMAIN = 5;

const clamp = (v, lim = DOMAIN * 0.95) => Math.max(-lim, Math.min(lim, v));

/** Noisy points around y = slope * x + intercept. */
export function makeLinear(seed, { n = 24, slope = 0.7, intercept = 0.5, noise = 0.8 } = {}) {
  const rng = createRng(seed);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const x = rng.uniform(-4.5, 4.5);
    pts.push({ x, y: clamp(slope * x + intercept + rng.normal(0, noise)) });
  }
  return pts;
}

/** Two Gaussian blobs with labels 0 / 1. Larger `spread` means more overlap. */
export function makeTwoBlobs(seed, { n = 40, spread = 0.9, distance = 2.2 } = {}) {
  const rng = createRng(seed);
  const angle = rng.uniform(0, Math.PI * 2);
  const cx = Math.cos(angle) * distance;
  const cy = Math.sin(angle) * distance;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const label = i % 2;
    const s = label === 1 ? 1 : -1;
    pts.push({
      x: clamp(s * cx + rng.normal(0, spread)),
      y: clamp(s * cy + rng.normal(0, spread)),
      label,
    });
  }
  return pts;
}

/** `k` unlabeled Gaussian clusters, for k-means. */
export function makeClusters(seed, { n = 60, k = 3, spread = 0.7 } = {}) {
  const rng = createRng(seed);
  const centers = [];
  for (let c = 0; c < k; c++) {
    centers.push({ x: rng.uniform(-3.2, 3.2), y: rng.uniform(-3.2, 3.2) });
  }
  const pts = [];
  for (let i = 0; i < n; i++) {
    const c = centers[i % k];
    pts.push({ x: clamp(c.x + rng.normal(0, spread)), y: clamp(c.y + rng.normal(0, spread)) });
  }
  return pts;
}

/** Elongated, correlated cloud for PCA. */
export function makeCorrelated(seed, { n = 50, angle, major = 2, minor = 0.6 } = {}) {
  const rng = createRng(seed);
  const theta = angle ?? rng.uniform(0, Math.PI);
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = rng.normal(0, major);
    const b = rng.normal(0, minor);
    pts.push({ x: clamp(a * c - b * s + 0.5), y: clamp(a * s + b * c - 0.3) });
  }
  return pts;
}

/** XOR pattern: label 1 in quadrants where x*y > 0. */
export function makeXor(seed, { n = 80, noise = 0.35 } = {}) {
  const rng = createRng(seed);
  const pts = [];
  for (let i = 0; i < n; i++) {
    // Cycle through the four quadrants so the classes stay balanced.
    const sx = i % 2 === 0 ? -1 : 1;
    const sy = i % 4 < 2 ? -1 : 1;
    const x = clamp(sx * rng.uniform(0.6, 4) + rng.normal(0, noise));
    const y = clamp(sy * rng.uniform(0.6, 4) + rng.normal(0, noise));
    pts.push({ x, y, label: sx * sy > 0 ? 1 : 0 });
  }
  return pts;
}

/** Inner disc (label 1) surrounded by a ring (label 0). */
export function makeCircles(seed, { n = 80, noise = 0.3 } = {}) {
  const rng = createRng(seed);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const label = i % 2;
    const r = label === 1 ? rng.uniform(0, 1.6) : rng.uniform(3, 4.3);
    const t = rng.uniform(0, Math.PI * 2);
    pts.push({
      x: clamp(r * Math.cos(t) + rng.normal(0, noise)),
      y: clamp(r * Math.sin(t) + rng.normal(0, noise)),
      label,
    });
  }
  return pts;
}

/** Two interleaving half-moons. */
export function makeMoons(seed, { n = 80, noise = 0.3 } = {}) {
  const rng = createRng(seed);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const label = i % 2;
    const t = rng.uniform(0, Math.PI);
    const x = label === 0 ? Math.cos(t) : 1 - Math.cos(t);
    const y = label === 0 ? Math.sin(t) : 0.5 - Math.sin(t);
    pts.push({
      x: clamp((x - 0.5) * 3.2 + rng.normal(0, noise)),
      y: clamp((y - 0.25) * 3.2 + rng.normal(0, noise)),
      label,
    });
  }
  return pts;
}
