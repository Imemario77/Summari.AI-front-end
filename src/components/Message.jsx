import React, { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";

function Message({ message, theme }) {
  const { content, isUser, fromDb } = message;
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const finishTyping = useCallback(() => {
    setIsTypingDone(true);
    setDisplayedContent(content);
  }, [content]);

  useEffect(() => {
    if (fromDb) {
      finishTyping();
    } else if (!isUser && !isTypingDone) {
      let index = 0;
      const timer = setInterval(() => {
        setDisplayedContent((prevContent) => {
          const newContent = content.slice(0, index + 1);
          index++;
          if (index >= content.length) {
            clearInterval(timer);
            finishTyping();
          }
          return newContent;
        });
      }, 20);

      return () => clearInterval(timer);
    }
  }, [content, isUser, isTypingDone, finishTyping]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg relative group ${
          isUser
            ? theme === "dark"
              ? "bg-blue-600 text-white"
              : "bg-blue-500 text-white"
            : theme === "dark"
            ? "bg-gray-700 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {isUser ? (
          <>
            {content}
            <button
              onClick={handleCopy}
              className={`
                  absolute top-2 right-2 p-1 rounded 
                  ${
                    theme === "dark"
                      ? "bg-gray-600 hover:bg-gray-500"
                      : "bg-gray-300 hover:bg-gray-400"
                  } 
                  transition-colors duration-200 
                  opacity-0 group-hover:opacity-100 
                  pointer-events-none group-hover:pointer-events-auto
                `}
              title="Copy message"
            >
              {isCopied ? (
                <CheckIcon className="w-3 h-3" />
              ) : (
                <CopyIcon className="w-3 h-3" />
              )}
            </button>
          </>
        ) : (
          <>
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                ul: ({ node, ...props }) => (
                  <ul className="list-disc ml-4 mb-2" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal ml-4 mb-2" {...props} />
                ),
                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                h1: ({ node, ...props }) => (
                  <h1 className="text-xl font-bold mb-2" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-lg font-bold mb-2" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-md font-bold mb-2" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a className="text-md mb-2 underline" {...props} />
                ),
                code: ({ node, inline, ...props }) =>
                  inline ? (
                    <code
                      style={{ color: "white" }}
                      className="bg-gray-200 dark:bg-gray-600 px-1 rounded"
                      {...props}
                    />
                  ) : (
                    <pre
                      style={{ color: "white" }}
                      className="bg-gray-200 dark:bg-gray-600 p-2 rounded mb-2 overflow-x-auto"
                    >
                      <code {...props} />
                    </pre>
                  ),
              }}
            >
              {displayedContent}
            </ReactMarkdown>
            {isTypingDone && (
              <button
                onClick={handleCopy}
                className={`
                  absolute top-2 right-2 p-1 rounded 
                  ${
                    theme === "dark"
                      ? "bg-gray-600 hover:bg-gray-500"
                      : "bg-gray-300 hover:bg-gray-400"
                  } 
                  transition-colors duration-200 
                  opacity-0 group-hover:opacity-100 
                  pointer-events-none group-hover:pointer-events-auto
                `}
                title="Copy message"
              >
                {isCopied ? (
                  <CheckIcon className="w-3 h-3" />
                ) : (
                  <CopyIcon className="w-3 h-3" />
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Simple icon components
const CopyIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

export default Message;
