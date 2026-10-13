import { DOMAIN } from "../../ml/datasets";

const SIZE = 400;

/** Maps data coordinates in [-DOMAIN, DOMAIN] to SVG user units and back. */
export const scale = {
  size: SIZE,
  sx: (x) => ((x + DOMAIN) / (2 * DOMAIN)) * SIZE,
  sy: (y) => SIZE - ((y + DOMAIN) / (2 * DOMAIN)) * SIZE,
  ix: (px) => (px / SIZE) * 2 * DOMAIN - DOMAIN,
  iy: (py) => ((SIZE - py) / SIZE) * 2 * DOMAIN - DOMAIN,
};

/**
 * Clip the line a*x + b*y + c = 0 to the plot square.
 * Returns SVG coordinates {x1, y1, x2, y2} or null when it misses the square.
 */
export function clipLine(a, b, c) {
  const D = DOMAIN;
  const pts = [];
  if (Math.abs(b) > 1e-12) {
    for (const x of [-D, D]) {
      const y = -(a * x + c) / b;
      if (y >= -D && y <= D) pts.push([x, y]);
    }
  }
  if (Math.abs(a) > 1e-12) {
    for (const y of [-D, D]) {
      const x = -(b * y + c) / a;
      if (x >= -D && x <= D) pts.push([x, y]);
    }
  }
  if (pts.length < 2) return null;
  // Pick the two most distant intersections (handles corner duplicates).
  let best = [pts[0], pts[1]];
  let bestD = -1;
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = (pts[i][0] - pts[j][0]) ** 2 + (pts[i][1] - pts[j][1]) ** 2;
      if (d > bestD) {
        bestD = d;
        best = [pts[i], pts[j]];
      }
    }
  }
  return { x1: scale.sx(best[0][0]), y1: scale.sy(best[0][1]), x2: scale.sx(best[1][0]), y2: scale.sy(best[1][1]) };
}

/** Fill colour for a labelled point (class A = 0, class B = 1). */
export const classFill = (p) => (p.label === 1 ? "var(--class-b)" : "var(--class-a)");
