import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";

function MessageList({ messages, theme }) {
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const scrollToBottom = () => {
    if (shouldAutoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isScrolledToBottom = scrollHeight - scrollTop - clientHeight < 1;
      setShouldAutoScroll(isScrolledToBottom);
    };

    // scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className={`flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-rounded ${
        theme === "dark"
          ? "scrollbar-thumb-gray-600 scrollbar-track-gray-800"
          : "scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      }`}
    >
      {messages.length === 0 && (
        <span className="w-full h-full text-2xl flex items-center justify-center">
          Start Chatting now
        </span>
      )}
      {messages.map((message, index) => (
        <Message key={index} message={message} theme={theme} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
