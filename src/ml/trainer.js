/**
 * Framework-free state machine for iterative training loops.
 * Every page that trains a model by repeated steps (gradient descent,
 * Pegasos, backprop) drives it through this reducer, so the loss history
 * and stopping rules are computed the same way everywhere.
 */

export const MAX_HISTORY = 240;

export function createTrainerState(model, running = false) {
  return {
    model,
    epoch: 0,
    runStart: 0,
    history: [],
    running,
    status: running ? "running" : "idle",
  };
}

/** Append a point, halving the resolution whenever the history gets too long. */
export function appendHistory(history, entry) {
  const next = [...history, entry];
  if (next.length <= MAX_HISTORY) return next;
  return next.filter((_, i) => i % 2 === 1 || i === next.length - 1);
}

function advance(state, action, steps, continuing) {
  const { step, loss, maxEpochs = Infinity, tol = 0 } = action;
  let model = state.model;
  for (let i = 0; i < steps; i++) model = step(model);
  const epoch = state.epoch + steps;
  const value = loss(model);
  const prev = state.history.length ? state.history[state.history.length - 1].loss : undefined;
  const history = appendHistory(state.history, { epoch, loss: value });

  if (!Number.isFinite(value)) {
    return { ...state, model, epoch, history, running: false, status: "diverged" };
  }
  if (!continuing) return { ...state, model, epoch, history, running: false, status: "paused" };

  const converged = prev !== undefined && Math.abs(prev - value) <= tol * Math.max(1, Math.abs(value));
  const exhausted = epoch - state.runStart >= maxEpochs;
  let status = "running";
  if (converged) status = "converged";
  else if (exhausted) status = "stopped";
  return { ...state, model, epoch, history, running: status === "running", status };
}

export function trainerReducer(state, action) {
  switch (action.type) {
    case "reset":
      return createTrainerState(action.model, Boolean(action.run));
    case "play":
      return { ...state, running: true, runStart: state.epoch, status: "running" };
    case "pause":
      return { ...state, running: false, status: state.epoch > 0 ? "paused" : "idle" };
    case "step":
      return advance(state, action, 1, false);
    case "tick":
      return state.running ? advance(state, action, action.steps ?? 1, true) : state;
    default:
      return state;
  }
}
