import { useId } from "react";
import { PauseIcon, PlayIcon, ResetIcon, ShuffleIcon, StepIcon, TrashIcon } from "../Icons";

/** Labelled range input with a live value read-out. */
export function Slider({ label, value, min, max, step = 1, onChange, format = String, help, disabled }) {
  const id = useId();
  const helpId = `${id}-help`;
  const text = format(value);
  return (
    <div className="field">
      <div className="field-row">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{text}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-valuetext={text}
        aria-describedby={help ? helpId : undefined}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {help ? (
        <span className="field-help" id={helpId}>
          {help}
        </span>
      ) : null}
    </div>
  );
}

/** Radio group styled as a segmented control. options: [{ value, label, swatch? }]. */
export function Segmented({ legend, value, options, onChange }) {
  const name = useId();
  return (
    <fieldset className="segmented">
      <legend className="visually-hidden">{legend}</legend>
      {options.map((o) => (
        <label key={o.value}>
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            onChange={() => onChange(o.value)}
          />
          {o.swatch ? <span className={`swatch ${o.swatch}`} aria-hidden="true" /> : null}
          {o.label}
        </label>
      ))}
    </fieldset>
  );
}

const LABELLED_TOOLS = [
  { value: "add-0", label: "Class A", swatch: "swatch-a" },
  { value: "add-1", label: "Class B", swatch: "swatch-b" },
  { value: "erase", label: "Erase" },
];

const PLAIN_TOOLS = [
  { value: "add", label: "Add / move" },
  { value: "erase", label: "Erase" },
];

/** Point-editing tool picker plus "new dataset" and "clear" actions. */
export function DataToolbar({ tool, onTool, labelled = false, onRegenerate, onClear, extra }) {
  return (
    <div className="plot-toolbar">
      <Segmented legend="Point tool" value={tool} options={labelled ? LABELLED_TOOLS : PLAIN_TOOLS} onChange={onTool} />
      <div className="btn-row">
        {extra}
        <button type="button" className="btn" onClick={onRegenerate}>
          <ShuffleIcon size={16} /> New data
        </button>
        <button type="button" className="btn btn-icon" onClick={onClear} aria-label="Clear all points" title="Clear all points">
          <TrashIcon size={16} />
        </button>
      </div>
    </div>
  );
}

export function Checkbox({ label, checked, onChange }) {
  return (
    <label className="checkbox">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

const STATUS_TEXT = {
  idle: "Not trained yet",
  running: "Training",
  paused: "Paused",
  converged: "Converged",
  stopped: "Finished (epoch budget for this run reached)",
  diverged: "Diverged - lower the learning rate",
};

export function TrainingStatus({ status }) {
  return (
    <span className={`status status-${status}`} role="status">
      {STATUS_TEXT[status] ?? status}
    </span>
  );
}

/** Train / pause, single step and reset buttons for a useTrainer() instance. */
export function TrainControls({ trainer, disabled }) {
  return (
    <div className="btn-row">
      {trainer.running ? (
        <button type="button" className="btn btn-primary" onClick={trainer.pause}>
          <PauseIcon size={16} /> Pause
        </button>
      ) : (
        <button type="button" className="btn btn-primary" onClick={trainer.play} disabled={disabled}>
          <PlayIcon size={16} /> Train
        </button>
      )}
      <button type="button" className="btn" onClick={trainer.stepOnce} disabled={disabled || trainer.running}>
        <StepIcon size={16} /> Step
      </button>
      <button type="button" className="btn" onClick={() => trainer.reset(false)}>
        <ResetIcon size={16} /> Reset model
      </button>
    </div>
  );
}
