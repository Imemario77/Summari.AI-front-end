import React, { useState } from "react";

function InputArea({ onSendMessage, theme, isThinking }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isThinking) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-4 ${
        theme === "dark" ? "border-t border-gray-700" : "border-t"
      }`}
    >
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className={`flex-1 p-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            theme === "dark"
              ? "bg-gray-700 text-white"
              : "bg-white text-gray-800"
          }`}
          disabled={isThinking}
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            theme === "dark"
              ? isThinking
                ? "bg-blue-400 text-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
              : isThinking
              ? "bg-blue-300 text-gray-100 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          } transition-colors duration-200`}
          disabled={isThinking}
        >
          Send
        </button>
      </div>
    </form>
  );
}

export default InputArea;
