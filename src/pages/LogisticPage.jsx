import React from "react";
import PageWrapper from "../components/PageWrapper";
import LogisticRegression from "../components/LogisticRegression";

export default function LogisticPage() {
  return (
    <PageWrapper>
      <div className="container">
        <h2>Logistic Regression</h2>
        <div className="card">
          <LogisticRegression />
        </div>
      </div>
    </PageWrapper>
  );
}
