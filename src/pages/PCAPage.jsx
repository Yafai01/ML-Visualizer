import React from "react";
import PageWrapper from "../components/PageWrapper";
import PCA from "../components/PCA";

export default function PCAPage() {
  return (
    <PageWrapper>
      <div className="container">
        <h2>PCA Dimensionality Reduction</h2>
        <div className="card">
          <PCA />
        </div>
      </div>
    </PageWrapper>
  );
}
