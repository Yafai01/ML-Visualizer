import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";

export default function Sidebar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [open, setOpen] = useState(true);

  return (
    <motion.div
      animate={{ width: open ? 230 : 70 }}
      transition={{ duration: 0.3 }}
      style={{
        height: "100vh",
        background: theme === "dark" ? "#171717" : "#ffffff",
        borderRight: theme === "dark" ? "1px solid #333" : "1px solid #ccc",
        position: "fixed",
        top: 0,
        left: 0,
        padding: "20px 10px",
        overflow: "hidden",
      }}
    >
      {/* Toggle sidebar */}
      <button style={{ marginBottom: "25px" }} onClick={() => setOpen(o => !o)}>
        {open ? "<<" : ">>"}
      </button>
{open && (
  <h3 style={{ marginTop: "10px", marginBottom: "20px" }}>
    Yafai ML Lab
  </h3>
)}

      {/* Theme toggle */}
      <button onClick={toggleTheme} style={{ width: "100%" }}>
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>

      <hr style={{ margin: "20px 0", opacity: 0.2 }} />

      {[
        ["Home", "/"],
        ["Linear Regression", "/linear-regression"],
        ["K-Means", "/kmeans"],
        ["Neural Network", "/neural"],
        ["Decision Tree", "/tree"],
        ["Logistic", "/logistic"],
        ["SVM", "/svm"],
        ["PCA", "/pca"],
        ["My Master", "/profile"],
      ].map(([label, link], i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05 }}
          style={{ marginTop: "15px" }}
        >
          <Link className="nav-link" to={link}>
            {open ? label : label[0]}
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
