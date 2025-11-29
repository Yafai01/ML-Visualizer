import React from "react";
import PageWrapper from "../components/PageWrapper";
import DecisionTree from "../components/DecisionTree";

export default function TreePage() {
  return (
    <PageWrapper>
      <div className="container">
        <h2>Decision Tree Split</h2>
        <div className="card">
          <DecisionTree />
        </div>
      </div>
    </PageWrapper>
  );
}
