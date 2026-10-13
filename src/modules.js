import LinearRegression from "./components/LinearRegression";
import LogisticRegression from "./components/LogisticRegression";
import SVM from "./components/SVM";
import KMeans from "./components/KMeans";
import DecisionTree from "./components/DecisionTree";
import NeuralNetwork from "./components/NeuralNetwork";
import PCA from "./components/PCA";
import {
  ClusterIcon,
  LinearIcon,
  MarginIcon,
  NetworkIcon,
  PcaIcon,
  SigmoidIcon,
  TreeIcon,
} from "./components/Icons";

/** Single source of truth for routes, navigation and the home page cards. */
export const MODULES = [
  {
    path: "/linear-regression",
    title: "Linear Regression",
    summary: "Fit a line by gradient descent and compare it with the exact least-squares solution.",
    method: "Batch gradient descent on MSE",
    Icon: LinearIcon,
    Component: LinearRegression,
  },
  {
    path: "/logistic",
    title: "Logistic Regression",
    summary: "Train a probabilistic linear classifier and watch the sigmoid surface sharpen.",
    method: "Gradient descent on log loss",
    Icon: SigmoidIcon,
    Component: LogisticRegression,
  },
  {
    path: "/svm",
    title: "Support Vector Machine",
    summary: "Find the maximum-margin boundary and the support vectors that define it.",
    method: "Pegasos sub-gradient descent",
    Icon: MarginIcon,
    Component: SVM,
  },
  {
    path: "/kmeans",
    title: "K-Means Clustering",
    summary: "Step through Lloyd's algorithm and track the within-cluster sum of squares.",
    method: "Lloyd's algorithm, k-means++ init",
    Icon: ClusterIcon,
    Component: KMeans,
  },
  {
    path: "/tree",
    title: "Decision Tree",
    summary: "Grow a CART tree and see how axis-aligned splits partition the plane.",
    method: "Greedy Gini-impurity splits",
    Icon: TreeIcon,
    Component: DecisionTree,
  },
  {
    path: "/neural",
    title: "Neural Network",
    summary: "Train a small MLP with backpropagation on XOR, circles or moons.",
    method: "Backprop, full-batch gradient descent",
    Icon: NetworkIcon,
    Component: NeuralNetwork,
  },
  {
    path: "/pca",
    title: "PCA",
    summary: "Compute principal components and the variance each direction explains.",
    method: "Covariance eigen-decomposition",
    Icon: PcaIcon,
    Component: PCA,
  },
];
