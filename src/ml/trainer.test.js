import { describe, expect, it } from "vitest";
import { MAX_HISTORY, appendHistory, createTrainerState, trainerReducer } from "./trainer.js";

// Minimise f(x) = x^2 by gradient descent: x <- x - lr * 2x.
const opts = (lr) => ({
  step: (x) => x - lr * 2 * x,
  loss: (x) => x * x,
  maxEpochs: 10000,
  tol: 1e-12,
});

const runUntilStopped = (state, action, limit = 10000) => {
  let s = state;
  for (let i = 0; i < limit && s.running; i++) s = trainerReducer(s, action);
  return s;
};

describe("trainer reducer", () => {
  it("trains until the loss stops changing and reports convergence", () => {
    let s = trainerReducer(createTrainerState(5), { type: "play" });
    s = runUntilStopped(s, { type: "tick", steps: 5, ...opts(0.1) });
    expect(s.status).toBe("converged");
    expect(s.running).toBe(false);
    expect(Math.abs(s.model)).toBeLessThan(1e-4);
    expect(s.history.length).toBeGreaterThan(1);
  });

  it("stops at the epoch budget", () => {
    let s = trainerReducer(createTrainerState(5), { type: "play" });
    s = runUntilStopped(s, { type: "tick", steps: 10, ...opts(0.0001), maxEpochs: 100 });
    expect(s.status).toBe("stopped");
    expect(s.epoch).toBe(100);
  });

  it("detects divergence", () => {
    let s = trainerReducer(createTrainerState(5), { type: "play" });
    s = runUntilStopped(s, { type: "tick", steps: 50, ...opts(5) });
    expect(s.status).toBe("diverged");
    expect(s.running).toBe(false);
  });

  it("ignores ticks while paused and single-steps on request", () => {
    const idle = createTrainerState(5);
    expect(trainerReducer(idle, { type: "tick", steps: 3, ...opts(0.1) })).toBe(idle);
    const stepped = trainerReducer(idle, { type: "step", ...opts(0.1) });
    expect(stepped.epoch).toBe(1);
    expect(stepped.model).toBeCloseTo(4, 12);
    expect(stepped.status).toBe("paused");
  });

  it("reset replaces the model and clears progress", () => {
    let s = trainerReducer(createTrainerState(5), { type: "step", ...opts(0.1) });
    s = trainerReducer(s, { type: "reset", model: 9 });
    expect(s).toMatchObject({ model: 9, epoch: 0, history: [], running: false, status: "idle" });
  });

  it("keeps the loss history bounded", () => {
    let h = [];
    for (let i = 0; i < 5000; i++) h = appendHistory(h, { epoch: i, loss: 1 / (i + 1) });
    expect(h.length).toBeLessThanOrEqual(MAX_HISTORY);
    expect(h[h.length - 1].epoch).toBe(4999);
  });
});
