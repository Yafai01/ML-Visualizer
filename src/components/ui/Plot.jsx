import { useEffect, useId, useRef } from "react";
import { DOMAIN } from "../../ml/datasets";
import { useTheme } from "../../context/theme";
import { scale } from "./plotMath";

const FIELD_RES = 96;
const SIZE = scale.size;

function parseColor(value) {
  const hex = value.trim().replace("#", "");
  if (hex.length === 6) {
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
  }
  return [128, 128, 128];
}

/**
 * Background raster: `field(x, y)` returns [cssVariableName, alpha] or null.
 * It is evaluated on a coarse grid and smoothly upscaled by the browser.
 */
function FieldCanvas({ field }) {
  const ref = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const style = getComputedStyle(canvas);
    const cache = new Map();
    const rgb = (name) => {
      if (!cache.has(name)) cache.set(name, parseColor(style.getPropertyValue(name)));
      return cache.get(name);
    };
    const img = ctx.createImageData(FIELD_RES, FIELD_RES);
    for (let row = 0; row < FIELD_RES; row++) {
      for (let col = 0; col < FIELD_RES; col++) {
        const x = ((col + 0.5) / FIELD_RES) * 2 * DOMAIN - DOMAIN;
        const y = DOMAIN - ((row + 0.5) / FIELD_RES) * 2 * DOMAIN;
        const out = field(x, y);
        const k = (row * FIELD_RES + col) * 4;
        if (!out) continue;
        const [r, g, b] = rgb(out[0]);
        img.data[k] = r;
        img.data[k + 1] = g;
        img.data[k + 2] = b;
        img.data[k + 3] = Math.round(Math.max(0, Math.min(1, out[1])) * 255);
      }
    }
    ctx.putImageData(img, 0, 0);
  }, [field, theme]);

  return <canvas ref={ref} width={FIELD_RES} height={FIELD_RES} aria-hidden="true" />;
}

function Axes() {
  const ticks = [];
  for (let v = -DOMAIN + 1; v < DOMAIN; v++) ticks.push(v);
  return (
    <g aria-hidden="true">
      {ticks.map((v) => (
        <g key={v}>
          <line className={v === 0 ? "axis-line" : "grid-line"} x1={scale.sx(v)} x2={scale.sx(v)} y1={0} y2={SIZE} />
          <line className={v === 0 ? "axis-line" : "grid-line"} y1={scale.sy(v)} y2={scale.sy(v)} x1={0} x2={SIZE} />
        </g>
      ))}
      {[-4, -2, 2, 4].map((v) => (
        <g key={`t${v}`}>
          <text className="tick-label" x={scale.sx(v)} y={scale.sy(0) + 13} textAnchor="middle">
            {v}
          </text>
          <text className="tick-label" x={scale.sx(0) + 5} y={scale.sy(v) + 3.5}>
            {v}
          </text>
        </g>
      ))}
    </g>
  );
}

function Marker({ p, fill }) {
  const cx = scale.sx(p.x);
  const cy = scale.sy(p.y);
  if (p.label === 1) {
    return <rect className="pt" x={cx - 5} y={cy - 5} width={10} height={10} rx={1.5} style={{ fill }} />;
  }
  return <circle className="pt" cx={cx} cy={cy} r={5.5} style={{ fill }} />;
}

/**
 * Interactive square scatter plot over [-5, 5]^2.
 *
 * tool: "add" (unlabelled), "add-0" / "add-1" (labelled), "erase", or null (read-only).
 * Clicking empty space adds a point, dragging a point moves it, and in erase
 * mode clicking a point removes it. `under` / `over` render extra SVG layers.
 */
export default function Plot({ points, onPointsChange, tool = null, pointFill, field, under, over, label, hint }) {
  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const hintId = useId();
  const editable = Boolean(onPointsChange) && tool !== null;

  const toData = (evt) => {
    const svg = svgRef.current;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    const p = pt.matrixTransform(ctm.inverse());
    const lim = DOMAIN * 0.98;
    return {
      x: Math.max(-lim, Math.min(lim, scale.ix(p.x))),
      y: Math.max(-lim, Math.min(lim, scale.iy(p.y))),
    };
  };

  const onBackgroundDown = (evt) => {
    if (!editable || evt.button !== 0 || !tool.startsWith("add")) return;
    const pos = toData(evt);
    if (!pos) return;
    const pt = tool === "add" ? pos : { ...pos, label: tool === "add-1" ? 1 : 0 };
    onPointsChange([...points, pt]);
  };

  const onPointDown = (evt, index) => {
    if (!editable || evt.button !== 0) return;
    evt.stopPropagation();
    if (tool === "erase") {
      onPointsChange(points.filter((_, i) => i !== index));
      return;
    }
    dragRef.current = index;
    svgRef.current.setPointerCapture?.(evt.pointerId);
  };

  const onMove = (evt) => {
    const index = dragRef.current;
    if (index === null || index === undefined) return;
    const pos = toData(evt);
    if (!pos) return;
    onPointsChange(points.map((p, i) => (i === index ? { ...p, ...pos } : p)));
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const toolClass = !editable ? "" : tool === "erase" ? "tool-erase" : "tool-add";

  return (
    <div>
      <div className={`plot ${toolClass}`}>
        {field ? <FieldCanvas field={field} /> : null}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label={label}
          aria-describedby={hint ? hintId : undefined}
          onPointerDown={onBackgroundDown}
          onPointerMove={onMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <Axes />
          {under}
          {points.map((p, i) => (
            <g key={i}>
              <Marker p={p} fill={pointFill(p, i)} />
              {editable ? (
                <circle
                  className="pt-hit"
                  cx={scale.sx(p.x)}
                  cy={scale.sy(p.y)}
                  r={12}
                  onPointerDown={(e) => onPointDown(e, i)}
                />
              ) : null}
            </g>
          ))}
          {over}
        </svg>
      </div>
      {hint ? (
        <p className="hint" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
