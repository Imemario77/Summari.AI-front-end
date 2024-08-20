import React from "react";

function LoadingSpinner({ size = "h-16 w-16", color = "border-blue-500" }) {
  return (
    <div
      className={`animate-spin rounded-full ${size} border-t-2 border-b-2 ${color}`}
    ></div>
  );
}

export default LoadingSpinner;
