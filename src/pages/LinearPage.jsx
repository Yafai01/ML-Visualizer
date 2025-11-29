import React from "react";
import PageWrapper from "../components/PageWrapper";
import LinearRegression from "../components/LinearRegression";

export default function LinearPage() {
  return (
    <PageWrapper>
      <div className="container">
        <h2>Linear Regression</h2>
        <div className="card">
          <LinearRegression />
        </div>
      </div>
    </PageWrapper>
  );
}
