import React from "react";
import "../App.css";

function LoadingSpinner() {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner"></div>
    </div>
  );
}

export default LoadingSpinner;
