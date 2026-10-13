import { useReducer } from "react";
import { createTrainerState, trainerReducer } from "../ml/trainer";
import { useAnimationLoop } from "./useAnimationLoop";

/**
 * Runs an iterative training loop in the browser, `stepsPerFrame` steps per
 * animation frame, until the loss stops changing (relative `tol`), the epoch
 * budget `maxEpochs` for the current run is used up, or the loss diverges.
 *
 * `step(model) -> model` and `loss(model) -> number` should close over the
 * current data and hyper-parameters; the latest versions are always used.
 */
export function useTrainer({ createModel, step, loss, stepsPerFrame = 10, maxEpochs = 3000, tol = 1e-7 }) {
  const [state, dispatch] = useReducer(trainerReducer, undefined, () => createTrainerState(createModel()));
  const options = { step, loss, maxEpochs, tol };

  useAnimationLoop(state.running, () => dispatch({ type: "tick", steps: stepsPerFrame, ...options }));

  return {
    ...state,
    play: () => dispatch({ type: "play" }),
    pause: () => dispatch({ type: "pause" }),
    stepOnce: () => dispatch({ type: "step", ...options }),
    /** Replace the model with a fresh one; optionally start training straight away. */
    reset: (run = false, model = createModel()) => dispatch({ type: "reset", model, run }),
  };
}
