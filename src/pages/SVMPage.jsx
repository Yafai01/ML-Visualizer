import React from "react";
import PageWrapper from "../components/PageWrapper";
import SVM from "../components/SVM";

export default function SVMPage() {
  return (
    <PageWrapper>
      <div className="container">
        <h2>SVM Margins Visualization</h2>
        <div className="card">
          <SVM />
        </div>
      </div>
    </PageWrapper>
  );
}
