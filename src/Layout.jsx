import React from "react";
import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#121212" }}>
      
      {/* SIDEBAR */}
      <div style={{
        width: "240px",
        background: "#1e1e1e",
        padding: "20px",
        color: "white",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}>
        <h2 style={{ marginBottom: "20px", color: "#a020f0", fontSize: "24px" }}>
          ML Dashboard
        </h2>

        <Link to="/" style={linkStyle}>🏠 Home</Link>
        <Link to="/linear-regression" style={linkStyle}>📈 Linear Regression</Link>
        <Link to="/kmeans" style={linkStyle}>🧮 K-Means</Link>
        <Link to="/neural" style={linkStyle}>🧠 Neural Network</Link>
        <Link to="/tree" style={linkStyle}>🌳 Decision Tree</Link>
        <Link to="/logistic" style={linkStyle}>📘 Logistic Regression</Link>
        <Link to="/svm" style={linkStyle}>⚔️ SVM</Link>
        <Link to="/pca" style={linkStyle}>📉 PCA</Link>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, padding: "30px", overflowY: "auto", color: "white" }}>
        {children}
      </div>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "18px"
};
