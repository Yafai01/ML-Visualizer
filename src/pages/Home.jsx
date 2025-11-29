import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const modules = [
  { name: "Linear Regression", link: "/linear-regression" },
  { name: "K-Means Clustering", link: "/kmeans" },
  { name: "Neural Network", link: "/neural" },
  { name: "Decision Tree", link: "/tree" },
  { name: "Logistic Regression", link: "/logistic" },
  { name: "SVM Margins", link: "/svm" },
  { name: "PCA Reduction", link: "/pca" }
];

export default function Home() {
  return (
<div className="container" style={{ marginLeft: "40px" }}>
      <h1>Yafai ML-Playground</h1>
      <p style={{ opacity: 0.7, marginTop: "-10px" }}>
        Explore ML algorithms interactively.
      </p>

      <div className="grid">
        {modules.map((m, i) => (
          <Link key={i} to={m.link}>
            <motion.div
              className="card hover"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <h3>{m.name}</h3>
              <p>Open module →</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
