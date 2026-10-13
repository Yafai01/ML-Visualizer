import { describe, expect, it } from "vitest";
import { createRng } from "./random.js";
import * as data from "./datasets.js";
import * as lin from "./linearRegression.js";
import * as logit from "./logisticRegression.js";
import * as svm from "./svm.js";
import * as km from "./kmeans.js";
import * as pcaLib from "./pca.js";
import * as tree from "./decisionTree.js";
import * as nn from "./neuralNetwork.js";

const repeat = (n, fn, init) => {
  let s = init;
  for (let i = 0; i < n; i++) s = fn(s, i);
  return s;
};

describe("random", () => {
  it("is deterministic for a given seed", () => {
    const a = createRng(42);
    const b = createRng(42);
    for (let i = 0; i < 5; i++) expect(a.next()).toBe(b.next());
  });

  it("produces values in [0, 1)", () => {
    const r = createRng(7);
    for (let i = 0; i < 1000; i++) {
      const v = r.next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("linear regression", () => {
  it("OLS recovers an exact line", () => {
    const pts = [-2, -1, 0, 1, 3].map((x) => ({ x, y: 1.5 * x - 0.5 }));
    const m = lin.fitOLS(pts);
    expect(m.w).toBeCloseTo(1.5, 10);
    expect(m.b).toBeCloseTo(-0.5, 10);
    expect(lin.mse(m, pts)).toBeCloseTo(0, 10);
    expect(lin.rSquared(m, pts)).toBeCloseTo(1, 10);
  });

  it("OLS is undefined when every x is identical", () => {
    expect(lin.fitOLS([{ x: 1, y: 1 }, { x: 1, y: 2 }])).toBeNull();
  });

  it("gradient descent converges to the OLS solution", () => {
    const pts = data.makeLinear(3);
    const ols = lin.fitOLS(pts);
    const gd = repeat(3000, (m) => lin.gdStep(m, pts, 0.02), { w: 0, b: 0 });
    expect(gd.w).toBeCloseTo(ols.w, 4);
    expect(gd.b).toBeCloseTo(ols.b, 4);
  });

  it("gradient descent decreases the loss monotonically for a small learning rate", () => {
    const pts = data.makeLinear(5);
    let m = { w: 0, b: 0 };
    let prev = lin.mse(m, pts);
    for (let i = 0; i < 200; i++) {
      m = lin.gdStep(m, pts, 0.02);
      const cur = lin.mse(m, pts);
      expect(cur).toBeLessThanOrEqual(prev + 1e-12);
      prev = cur;
    }
  });
});

describe("logistic regression", () => {
  it("sigmoid is numerically stable and symmetric", () => {
    expect(logit.sigmoid(0)).toBe(0.5);
    expect(logit.sigmoid(1000)).toBe(1);
    expect(logit.sigmoid(-1000)).toBe(0);
    expect(logit.sigmoid(2) + logit.sigmoid(-2)).toBeCloseTo(1, 12);
  });

  it("separates linearly separable data and reduces log loss", () => {
    const pts = data.makeTwoBlobs(11, { spread: 0.5 });
    const start = logit.initialModel();
    const m = repeat(1500, (s) => logit.gdStep(s, pts, 0.3), start);
    expect(logit.accuracy(m, pts)).toBe(1);
    expect(logit.logLoss(m, pts)).toBeLessThan(0.1 * logit.logLoss(start, pts));
  });

  it("predicts the right side of a known boundary", () => {
    const pts = [
      { x: -3, y: 0, label: 0 },
      { x: -2, y: 1, label: 0 },
      { x: 2, y: -1, label: 1 },
      { x: 3, y: 0, label: 1 },
    ];
    const m = repeat(2000, (s) => logit.gdStep(s, pts, 0.5), logit.initialModel());
    expect(logit.predictProba(m, -4, 0)).toBeLessThan(0.05);
    expect(logit.predictProba(m, 4, 0)).toBeGreaterThan(0.95);
  });

  it("L2 regularisation shrinks the weights", () => {
    const pts = data.makeTwoBlobs(4, { spread: 0.5 });
    const free = repeat(1000, (s) => logit.gdStep(s, pts, 0.3, 0), logit.initialModel());
    const reg = repeat(1000, (s) => logit.gdStep(s, pts, 0.3, 0.1), logit.initialModel());
    expect(Math.hypot(...reg.w)).toBeLessThan(Math.hypot(...free.w));
  });
});

describe("linear SVM (Pegasos)", () => {
  it("finds the maximum-margin boundary for two symmetric points", () => {
    const pts = [
      { x: -1, y: 0, label: 0 },
      { x: 1, y: 0, label: 1 },
    ];
    const m = repeat(20000, (s) => svm.pegasosStep(s, pts, 0.01), svm.initialModel());
    expect(m.w[0]).toBeCloseTo(1, 1);
    expect(Math.abs(m.w[1])).toBeLessThan(1e-6);
    expect(Math.abs(m.b)).toBeLessThan(0.05);
    expect(svm.marginWidth(m)).toBeCloseTo(2, 1);
  });

  it("converges on separable data: full accuracy, near-zero hinge loss, decreasing objective", () => {
    for (const seed of [1, 2, 3]) {
      const pts = data.makeTwoBlobs(seed, { spread: 0.6 });
      const lambda = 0.01;
      const early = repeat(20, (s) => svm.pegasosStep(s, pts, lambda), svm.initialModel());
      const m = repeat(3000, (s) => svm.pegasosStep(s, pts, lambda), svm.initialModel());
      expect(svm.accuracy(m, pts)).toBe(1);
      expect(svm.objective(m, pts, lambda)).toBeLessThan(svm.objective(early, pts, lambda));
      // Nearly every point sits on or outside its margin.
      const violations = pts.filter((p) => (p.label ? 1 : -1) * svm.decision(m, p.x, p.y) < 0.9);
      expect(violations.length).toBe(0);
      // Support vectors exist and are a minority of the data.
      const sv = svm.supportVectors(m, pts, 0.1);
      expect(sv.length).toBeGreaterThan(0);
      expect(sv.length).toBeLessThan(pts.length / 2);
    }
  });

  it("larger lambda gives a wider margin", () => {
    const pts = data.makeTwoBlobs(8, { spread: 0.8 });
    const narrow = repeat(2000, (s) => svm.pegasosStep(s, pts, 0.01), svm.initialModel());
    const wide = repeat(2000, (s) => svm.pegasosStep(s, pts, 1), svm.initialModel());
    expect(svm.marginWidth(wide)).toBeGreaterThan(svm.marginWidth(narrow));
  });
});

describe("k-means", () => {
  it("recovers well-separated clusters and never increases inertia", () => {
    const pts = [
      ...[0, 1, 2, 3].map((i) => ({ x: -4 + 0.1 * i, y: -4 })),
      ...[0, 1, 2, 3].map((i) => ({ x: 4 + 0.1 * i, y: 4 })),
      ...[0, 1, 2, 3].map((i) => ({ x: 4, y: -4 + 0.1 * i })),
    ];
    let centroids = km.initPlusPlus(pts, 3, createRng(1));
    let labels = km.assign(pts, centroids);
    let prev = km.inertia(pts, labels, centroids);
    let converged = false;
    for (let i = 0; i < 50 && !converged; i++) {
      ({ centroids, labels, converged } = km.lloydStep(pts, centroids));
      const cur = km.inertia(pts, labels, centroids);
      expect(cur).toBeLessThanOrEqual(prev + 1e-9);
      prev = cur;
    }
    expect(converged).toBe(true);
    // Each group of four shares one label and the three groups differ.
    const groups = [labels.slice(0, 4), labels.slice(4, 8), labels.slice(8)];
    groups.forEach((g) => expect(new Set(g).size).toBe(1));
    expect(new Set(groups.map((g) => g[0])).size).toBe(3);
  });

  it("keeps an empty cluster's centroid in place", () => {
    const pts = [{ x: 0, y: 0 }];
    const c = km.updateCentroids(pts, [0], [{ x: 1, y: 1 }, { x: 9, y: 9 }]);
    expect(c[1]).toEqual({ x: 9, y: 9 });
    expect(c[0]).toEqual({ x: 0, y: 0 });
  });
});

describe("PCA", () => {
  it("finds the direction of a perfectly correlated line", () => {
    const pts = [-2, -1, 0, 1, 2].map((t) => ({ x: t, y: t }));
    const r = pcaLib.pca(pts);
    expect(r.vectors[0][0]).toBeCloseTo(Math.SQRT1_2, 10);
    expect(r.vectors[0][1]).toBeCloseTo(Math.SQRT1_2, 10);
    expect(r.explained[0]).toBeCloseTo(1, 10);
    expect(r.values[1]).toBeCloseTo(0, 10);
  });

  it("first component maximises projected variance", () => {
    const pts = data.makeCorrelated(9);
    const r = pcaLib.pca(pts);
    const a1 = Math.atan2(r.vectors[0][1], r.vectors[0][0]);
    expect(pcaLib.projectedVariance(pts, a1)).toBeCloseTo(r.values[0], 8);
    for (let deg = 0; deg < 180; deg += 5) {
      expect(pcaLib.projectedVariance(pts, (deg * Math.PI) / 180)).toBeLessThanOrEqual(r.values[0] + 1e-9);
    }
  });

  it("components are orthonormal and eigenvalues sum to total variance", () => {
    const pts = data.makeCorrelated(2);
    const r = pcaLib.pca(pts);
    const [v1, v2] = r.vectors;
    expect(Math.hypot(...v1)).toBeCloseTo(1, 12);
    expect(v1[0] * v2[0] + v1[1] * v2[1]).toBeCloseTo(0, 12);
    expect(r.values[0] + r.values[1]).toBeCloseTo(r.cov.xx + r.cov.yy, 10);
  });
});

describe("decision tree", () => {
  it("computes Gini impurity", () => {
    expect(tree.gini([5, 0])).toBe(0);
    expect(tree.gini([5, 5])).toBe(0.5);
  });

  it("finds the obvious split", () => {
    const pts = [1, 2, 3, 6, 7, 8].map((x, i) => ({ x, y: 0, label: i < 3 ? 0 : 1 }));
    const s = tree.bestSplit(pts);
    expect(s.feature).toBe("x");
    expect(s.threshold).toBe(4.5);
    expect(s.impurity).toBe(0);
  });

  it("fits XOR given enough depth and respects max depth", () => {
    const pts = data.makeXor(5, { noise: 0 });
    const t2 = tree.buildTree(pts, { maxDepth: 8 });
    expect(tree.accuracy(t2, pts)).toBe(1);
    const t1 = tree.buildTree(pts, { maxDepth: 1 });
    expect(tree.stats(t1).depth).toBeLessThanOrEqual(1);
    expect(tree.stats(t1).leaves).toBeLessThanOrEqual(2);
  });

  it("leaf regions tile the domain", () => {
    const pts = data.makeTwoBlobs(3);
    const t = tree.buildTree(pts, { maxDepth: 3 });
    const regions = tree.leafRegions(t, { x0: -5, x1: 5, y0: -5, y1: 5 });
    const area = regions.reduce((a, r) => a + (r.x1 - r.x0) * (r.y1 - r.y0), 0);
    expect(area).toBeCloseTo(100, 8);
    expect(regions.length).toBe(tree.stats(t).leaves);
  });
});

describe("neural network", () => {
  it("backprop gradients match finite differences", () => {
    const net = nn.createNetwork(3, createRng(4));
    const pts = data.makeXor(1, { n: 12 });
    const lr = 1e-3;
    const stepped = nn.trainStep(net, pts, lr);
    const h = 1e-6;
    const numeric = (mutate) => {
      const plus = structuredClone(net);
      const minus = structuredClone(net);
      mutate(plus, h);
      mutate(minus, -h);
      return (nn.loss(plus, pts) - nn.loss(minus, pts)) / (2 * h);
    };
    const gW1 = numeric((n, d) => (n.W1[1][0] += d));
    expect((net.W1[1][0] - stepped.W1[1][0]) / lr).toBeCloseTo(gW1, 5);
    const gW2 = numeric((n, d) => (n.W2[2] += d));
    expect((net.W2[2] - stepped.W2[2]) / lr).toBeCloseTo(gW2, 5);
    const gb1 = numeric((n, d) => (n.b1[0] += d));
    expect((net.b1[0] - stepped.b1[0]) / lr).toBeCloseTo(gb1, 5);
  });

  it("learns XOR, which a linear model cannot", () => {
    const pts = data.makeXor(2, { noise: 0.2 });
    const net = repeat(3000, (s) => nn.trainStep(s, pts, 1), nn.createNetwork(6, createRng(3)));
    expect(nn.accuracy(net, pts)).toBeGreaterThanOrEqual(0.95);
    const linear = repeat(1500, (s) => logit.gdStep(s, pts, 0.3), logit.initialModel());
    expect(logit.accuracy(linear, pts)).toBeLessThan(0.8);
  });

  it("learns concentric circles", () => {
    const pts = data.makeCircles(6, { noise: 0.2 });
    const net = repeat(3000, (s) => nn.trainStep(s, pts, 1), nn.createNetwork(6, createRng(1)));
    expect(nn.accuracy(net, pts)).toBeGreaterThanOrEqual(0.95);
  });
});
