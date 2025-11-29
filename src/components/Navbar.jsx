import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <nav
      style={{
        background: "#171717",
        padding: "15px 30px",
        display: "flex",
        gap: "25px",
        borderBottom: "1px solid #333",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}
    >
      {[
        ["Home", "/"],
        ["Linear", "/linear-regression"],
        ["K-Means", "/kmeans"],
        ["Neural", "/neural"],
        ["Tree", "/tree"],
        ["Logistic", "/logistic"],
        ["SVM", "/svm"],
        ["PCA", "/pca"],
      ].map(([label, link], i) => (
        <motion.div key={i} whileHover={{ scale: 1.15 }}>
          <Link className="nav-link" to={link}>{label}</Link>
        </motion.div>
      ))}
    </nav>
  );
}
