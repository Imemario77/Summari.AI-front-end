import React from "react";
import LoadingSpinner from "../components/LoadingSpinner";

function Home({ theme, showChat, isLoading, handleStartChat, children }) {
  return (
    <>
      {showChat ? (
        <>{children}</>
      ) : (
        <div className="h-full flex flex-col items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <LoadingSpinner />
              <p className={`text-lg mt-4 ${theme === "dark" && "text-white"}`}>
                Setting up chat...
              </p>
            </div>
          ) : (
            <button
              onClick={handleStartChat}
              className={`px-6 py-3 rounded-lg text-white font-semibold ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Start Chat
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default Home;
