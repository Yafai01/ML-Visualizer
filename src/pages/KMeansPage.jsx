import React from "react";
import PageWrapper from "../components/PageWrapper";
import KMeans from "../components/KMeans";

export default function KMeansPage() {
  return (
    <PageWrapper>
      <div className="container">
        <h2>K-Means Clustering</h2>
        <div className="card">
          <KMeans />
        </div>
      </div>
    </PageWrapper>
  );
}
