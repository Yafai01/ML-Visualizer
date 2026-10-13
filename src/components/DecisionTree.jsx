import { useState } from "react";
import { DOMAIN, makeCircles, makeTwoBlobs, makeXor } from "../ml/datasets";
import { accuracy, buildTree, isLeaf, leafRegions, stats } from "../ml/decisionTree";
import { randomSeed } from "../ml/random";
import Plot from "./ui/Plot";
import { classFill, scale } from "./ui/plotMath";
import { DataToolbar, Slider } from "./ui/Controls";
import { Metrics } from "./ui/Metrics";
import PageHeader from "./ui/PageHeader";
import { fmt, int, pct } from "./ui/format";

const GENERATORS = {
  blobs: (seed) => makeTwoBlobs(seed, { spread: 1.2 }),
  xor: (seed) => makeXor(seed, { n: 60 }),
  circles: (seed) => makeCircles(seed, { n: 60 }),
};

function TreeNode({ node }) {
  const summary = `n=${node.n}, gini=${node.gini.toFixed(3)}`;
  if (isLeaf(node)) {
    return (
      <li className={node.prediction === 1 ? "leaf-b" : "leaf-a"}>
        predict {node.prediction === 1 ? "B" : "A"} ({summary})
      </li>
    );
  }
  return (
    <li>
      if {node.feature} ≤ {node.threshold.toFixed(2)} ({summary})
      <ul>
        <TreeNode node={node.left} />
        <li>else</li>
        <TreeNode node={node.right} />
      </ul>
    </li>
  );
}

export default function DecisionTree() {
  const [dataset, setDataset] = useState("xor");
  const [points, setPoints] = useState(() => GENERATORS.xor(randomSeed()));
  const [tool, setTool] = useState("add-0");
  const [maxDepth, setMaxDepth] = useState(4);
  const [minLeaf, setMinLeaf] = useState(1);

  const hasData = points.length > 0;
  const tree = hasData ? buildTree(points, { maxDepth, minLeaf }) : null;
  const regions = tree ? leafRegions(tree, { x0: -DOMAIN, x1: DOMAIN, y0: -DOMAIN, y1: DOMAIN }) : [];
  const info = tree ? stats(tree) : null;

  return (
    <div className="page">
      <PageHeader eyebrow="Classification" title="Decision tree">
        A CART classification tree grown greedily: at every node it tries every threshold on x and y and
        keeps the split with the lowest weighted Gini impurity.
      </PageHeader>

      <div className="viz-grid">
        <section className="card" aria-labelledby="tree-plot">
          <h2 id="tree-plot" className="visually-hidden">
            Data and tree partitions
          </h2>
          <DataToolbar
            tool={tool}
            onTool={setTool}
            labelled
            onRegenerate={() => setPoints(GENERATORS[dataset](randomSeed()))}
            onClear={() => setPoints([])}
          />
          <Plot
            points={points}
            onPointsChange={setPoints}
            tool={tool}
            pointFill={classFill}
            label={`Two-class scatter plot with ${points.length} points, partitioned into ${regions.length} decision regions.`}
            hint="The tree is rebuilt instantly whenever you add, move or erase a point or change a setting."
            under={
              <g aria-hidden="true">
                {regions.map((r, i) => (
                  <rect
                    key={i}
                    x={scale.sx(r.x0)}
                    y={scale.sy(r.y1)}
                    width={scale.sx(r.x1) - scale.sx(r.x0)}
                    height={scale.sy(r.y0) - scale.sy(r.y1)}
                    fill={r.node.prediction === 1 ? "var(--class-b)" : "var(--class-a)"}
                    fillOpacity={0.08 + 0.17 * (1 - 2 * r.node.gini)}
                    stroke="var(--model)"
                    strokeOpacity="0.55"
                    strokeWidth="1.25"
                  />
                ))}
              </g>
            }
          />
        </section>

        <div className="stack">
          <section className="card" aria-labelledby="tree-settings">
            <h2 id="tree-settings">Settings</h2>
            <div className="controls">
              <div className="field">
                <label htmlFor="tree-dataset" className="field-row">
                  Dataset for &ldquo;New data&rdquo;
                </label>
                <select
                  id="tree-dataset"
                  value={dataset}
                  onChange={(e) => {
                    setDataset(e.target.value);
                    setPoints(GENERATORS[e.target.value](randomSeed()));
                  }}
                >
                  <option value="xor">XOR</option>
                  <option value="blobs">Two blobs</option>
                  <option value="circles">Circles</option>
                </select>
              </div>
              <Slider label="Maximum depth" min={1} max={8} value={maxDepth} onChange={setMaxDepth} />
              <Slider
                label="Minimum samples per leaf"
                min={1}
                max={10}
                value={minLeaf}
                onChange={setMinLeaf}
                help="Higher values stop the tree from carving out tiny regions around single points."
              />
            </div>
          </section>

          <section className="card" aria-labelledby="tree-metrics">
            <h2 id="tree-metrics">Metrics</h2>
            <Metrics
              items={[
                { label: "Train accuracy", value: tree ? pct(accuracy(tree, points)) : "-" },
                { label: "Leaves", value: info ? int(info.leaves) : "-" },
                { label: "Depth", value: info ? int(info.depth) : "-" },
                { label: "Root Gini", value: tree ? fmt(tree.gini, 3) : "-" },
              ]}
            />
            <h3 style={{ margin: "16px 0 8px" }}>Learned rules</h3>
            {tree ? (
              <div className="tree-scroll" tabIndex={0} role="region" aria-label="Learned decision rules">
                <ul className="tree-list">
                  <TreeNode node={tree} />
                </ul>
              </div>
            ) : (
              <p className="notice">Add points to grow a tree.</p>
            )}
          </section>
        </div>
      </div>

      <section className="card explainer" aria-labelledby="tree-how">
        <h2 id="tree-how">How it works</h2>
        <p>
          Gini impurity is 1 − p<sub>A</sub>² − p<sub>B</sub>². A split is kept only if it lowers the
          weighted impurity of the two children. Growth stops at the maximum depth, at pure nodes, or
          when no split leaves at least the minimum number of samples on each side. Training accuracy
          near 100% with a deep tree usually means it is overfitting the noise. Because each split is
          chosen greedily, patterns such as XOR (where no single first split helps much) can need more
          depth than the ideal tree would.
        </p>
      </section>
    </div>
  );
}
