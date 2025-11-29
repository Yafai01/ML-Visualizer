import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import LinearPage from "./pages/LinearPage";
import KMeansPage from "./pages/KMeansPage";
import NeuralPage from "./pages/NeuralPage";
import TreePage from "./pages/TreePage";
import LogisticPage from "./pages/LogisticPage";
import SVMPage from "./pages/SVMPage";
import PCAPage from "./pages/PCAPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ marginLeft: "250px", width: "100%" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/linear-regression" element={<LinearPage />} />
          <Route path="/kmeans" element={<KMeansPage />} />
          <Route path="/neural" element={<NeuralPage />} />
          <Route path="/tree" element={<TreePage />} />
          <Route path="/logistic" element={<LogisticPage />} />
          <Route path="/svm" element={<SVMPage />} />
          <Route path="/pca" element={<PCAPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </div>
  );
}
