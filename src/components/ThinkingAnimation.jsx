import React from "react";

function ThinkingAnimation() {
  return (
    <div className="flex items-center space-x-2 p-2">
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
      <div
        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></div>
      <div
        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
        style={{ animationDelay: "0.4s" }}
      ></div>
    </div>
  );
}

export default ThinkingAnimation;
