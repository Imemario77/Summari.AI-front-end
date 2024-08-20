import React, { useEffect, useState } from "react";
import MessageList from "./MessageList";
import InputArea from "./InputArea";
import ThinkingAnimation from "./ThinkingAnimation";
import LoadingSpinner from "./LoadingSpinner";
import {
  addMessageToSupabase,
  getMessagesFromSupabase,
  supabase,
} from "../utils/supabase";

function ChatWindow({ theme, url, source, chatSessionId }) {
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  const handleFetchUserDetails = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);
    setUserId(user);
  };

  useEffect(() => {
    const initChat = async () => {
      console.log(chatSessionId);
      if (chatSessionId) {
        setIsLoadingMessages(true);
        const storedMessages = await getMessagesFromSupabase(chatSessionId);
        const initMessage = storedMessages.map((m) => {
          return { ...m, fromDb: true };
        });
        setMessages(initMessage);
        setIsLoadingMessages(false);
      }
    };

    initChat();
  }, [chatSessionId]);

  const addMessage = (content, isUser = true) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { content, isUser, timestamp: new Date() },
    ]);
  };

  const handleSendMessage = async (message) => {
    if (!url) return null;
    if (!chatSessionId) return null;
    addMessage(message, true);
    addMessageToSupabase(message, true, chatSessionId);
    setIsThinking(true);

    try {
      console.log(messages);
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          url,
          source,
          userId,
          sessionId: chatSessionId,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (data.message) {
        addMessage(data.message, false);
      } else {
        addMessage("Sorry an Error occured", false);
      }
    } catch (error) {
      console.error("Error:", error);
      addMessage(`Sorry an error occurred`, false);
    } finally {
      setIsThinking(false);
    }
  };

  const defaultActions = [
    {
      label: "Summarize content",
      message: `Please summarize the content of this ${source}.`,
    },
    {
      label: "Extract key points",
      message: `What are the main points of this content on this ${source}?`,
    },
    {
      label: "Specfic Topics",
      message: `What specific topics are covered on the ${source}?`,
    },
    {
      label: "Explain like I'm 5",
      message: "Explain the main idea of this content as if I'm 5 years old.",
    },
  ];

  const handleDefaultAction = (message) => {
    handleSendMessage(message);
  };

  return (
    <div
      className={`flex flex-col h-full ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      {isLoadingMessages ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <LoadingSpinner size="h-12 w-12" />
          <p className="mt-4">Loading previous messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-4">
          <h2 className="text-xl font-semibold mb-2">
            Get started with these actions:
          </h2>
          {defaultActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleDefaultAction(action.message)}
              className={`px-4 py-2 rounded-lg ${
                theme === "dark"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              } transition-colors duration-200`}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : (
        <MessageList messages={messages} theme={theme} />
      )}
      {isThinking && <ThinkingAnimation />}
      <InputArea
        onSendMessage={handleSendMessage}
        theme={theme}
        isThinking={isThinking}
      />
    </div>
  );
}

export default ChatWindow;
