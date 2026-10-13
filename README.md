# Yafai ML Lab — Machine Learning Visualizer

Interactive visualizations of classic machine learning algorithms, trained live in your browser.

Each page has a small, editable 2-D dataset and a model that is genuinely fitted to it in plain
JavaScript. Add, drag and erase points or generate new data, then watch the decision boundary, loss
curve and metrics update as they are computed. Nothing is pre-computed and nothing is sent to a server.

## Features

| Page | What is computed |
| --- | --- |
| **Linear regression** | Batch gradient descent on mean squared error, compared with the closed-form least-squares fit. Shows residuals, MSE, R² and the loss curve. Adjustable learning rate (high values visibly diverge). |
| **Logistic regression** | Gradient descent on (optionally L2-regularised) log loss. Sigmoid probability surface, p = 0.5 boundary and 0.25 / 0.75 contours, accuracy and loss curve. |
| **Support vector machine** | Linear soft-margin SVM trained with full-batch Pegasos sub-gradient descent. Decision boundary, ±1 margins, margin width 2/‖w‖, support vectors, objective and hinge loss. Adjustable λ. |
| **k-means** | Lloyd's algorithm with k-means++ initialisation. Step or run, nearest-centroid regions, inertia per iteration, convergence detection. k from 2 to 6. |
| **Decision tree** | Greedy CART tree with Gini impurity. Leaf regions on the plot, the learned rules as text, accuracy, leaves and depth. Adjustable max depth and minimum samples per leaf. |
| **Neural network** | 2 → H → 1 MLP (tanh hidden layer, sigmoid output) trained with hand-written backpropagation. XOR, circles, moons or blobs; probability surface, weight diagram and loss curve. |
| **PCA** | Covariance matrix and its closed-form eigen-decomposition. Principal axes, projections onto PC1, explained variance, and a custom direction to compare against PC1. |

Other details:

- Light theme by default with a dark theme toggle (remembered in `localStorage`).
- Responsive layout: the sidebar becomes a slide-out menu on small screens and the plots scale to the viewport.
- Labelled sliders and controls, visible focus states, a skip link and colour-blind-safe data colours
  (points of the two classes also use different shapes).

## Current limitations

- The implementations are written for clarity on small 2-D toy datasets (tens to a few hundred points).
  They are not optimised and are not a replacement for a real ML library.
- Adding, moving and erasing points requires a pointer (mouse, pen or touch). Keyboard users can still
  generate new datasets and use every training control, but cannot place individual points.
- Pegasos and gradient descent are approximate iterative methods: support vectors are identified within a
  small tolerance, and training stops when the loss stops changing or after a fixed epoch budget per run.
- The decision tree is greedy, so on patterns like XOR it can need more depth than an optimal tree.

## Tech stack

- React 18 and React Router 7
- Vite 7
- Vitest for unit tests, ESLint 9 (flat config) for linting
- No charting or ML libraries: plots are SVG plus a small `<canvas>` for probability surfaces, and all
  algorithms live in `src/ml/`.

## Project structure

```
src/
  ml/                    Framework-free algorithms (unit tested)
    random.js            Seeded PRNG (mulberry32) and Gaussian sampling
    datasets.js          Synthetic 2-D dataset generators
    linearRegression.js  OLS and gradient descent
    logisticRegression.js
    svm.js               Pegasos linear SVM
    kmeans.js            Lloyd's algorithm, k-means++
    decisionTree.js      CART with Gini impurity
    neuralNetwork.js     MLP forward pass and backpropagation
    pca.js               2x2 covariance eigen-decomposition
    trainer.js           Training-loop state machine (convergence, epoch budget, divergence)
    *.test.js            Vitest suites
  hooks/                 useTrainer (animation-frame training loop), useAnimationLoop
  components/
    ui/                  Plot, sliders, segmented controls, metrics, loss chart
    *.jsx                One visualizer per algorithm
    Sidebar.jsx, Icons.jsx
  context/               Theme context and provider
  pages/                 Home, About, NotFound
  modules.js             Route / navigation / home-card registry
  App.jsx, main.jsx, index.css
```

## Prerequisites

- Node.js 20.19 or newer (Vite 7 requirement)
- npm

## Setup and commands

```bash
git clone https://github.com/Yafai01/ML-Visualizer.git
cd ML-Visualizer
npm ci

npm run dev       # start the dev server (http://localhost:5173)
npm run lint      # ESLint
npm test          # Vitest unit tests (run once)
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

No environment variables are needed.

## Tests

`npm test` runs the Vitest suites in `src/ml/`. They check, among other things, that:

- gradient descent converges to the closed-form least-squares solution;
- logistic regression reaches 100% accuracy on separable data and predicts the correct side of a known boundary;
- Pegasos finds the analytic maximum-margin solution for a symmetric two-point problem and fully
  separates separable blobs with a small set of support vectors; larger λ gives a wider margin;
- k-means never increases inertia, converges and recovers well-separated clusters;
- the first principal component maximises projected variance;
- the decision tree finds the obvious split and its leaf regions tile the plane;
- backpropagation gradients match finite differences, and the MLP learns XOR and circles;
- the training-loop state machine detects convergence, the epoch budget and divergence.

## Deployment

The app is a static single-page app: build with `npm run build` and serve the `dist/` folder.
`vercel.json` rewrites all paths to `index.html` so deep links such as `/svm` work on Vercel. On other
static hosts, configure an equivalent fallback to `index.html`.

The existing Vercel deployment is at <https://ml-visualizer-nine.vercel.app/>.

## Author

Yafai — AI/ML Engineering Student. GitHub: [@Yafai01](https://github.com/Yafai01)

## License

No license file is included yet, so the code is not currently offered under an open-source license.
