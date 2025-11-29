import React from "react";
import PageWrapper from "../components/PageWrapper";
import NeuralNetwork from "../components/NeuralNetwork";

export default function NeuralPage() {
  return (
    <PageWrapper>
      <div className="container">
        <h2>Neural Network Forward Pass</h2>
        <div className="card">
          <NeuralNetwork />
        </div>
      </div>
    </PageWrapper>
  );
}
