import React, { useState, useEffect } from "react";
import Login from "./auth/auth";
import Home from "./root/Home";
import ChatWindow from "./components/ChatWindow";
import Header from "./components/Header";
import { supabase } from "./utils/supabase";
import History from "./components/History";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [session, setSession] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessionId, setChatSessionId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      console.log(navigator.onLine);
      const themeResult = await chrome.storage.local.get(["theme"]);
      if (themeResult.theme) {
        setTheme(themeResult.theme);
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setIsCheckingSession(false);

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        setUrl(tabs[0].url);
        if (tabs[0].url.startsWith("https://www.youtube.com/watch")) {
          setSource("youtube video");
        } else {
          setSource("webpage");
        }
      });

      setIsInitializing(false);
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const checkAndEvaluateSession = async (url) => {
      // Query for the most recent session
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("source", url)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error checking for existing session:", error);
        return;
      }

      if (data && data.length > 0) {
        // Check if the most recent session is from today
        const today = new Date().toISOString().split("T")[0];
        const sessionDate = new Date(data[0].created_at)
          .toISOString()
          .split("T")[0];

        if (sessionDate === today) {
          setChatSessionId(data[0].id);
          setShowChat(true);
          return; // Exit the function if a session exists for today
        }
      }
    };

    if (url && session) {
      checkAndEvaluateSession(url);
    }
  }, [session, url]);
  const reciveClick = (id, source) => {
    console.log(id, source);
    setUrl(source);
    setChatSessionId(id);
    setShowHistory(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    chrome.storage.local.set({ theme: newTheme });
  };

  const handleStartChat = async () => {
    if (!url) return null;

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();

      if (data.success) {
        // If no session exists for today, create a new one
        const newSession = {
          source: url,
          title: data.title,
          user_id: session.user.id,
        };

        const { data: insertedSession, error: insertError } = await supabase
          .from("sessions")
          .insert(newSession)
          .select();

        if (insertError) {
          console.error("Error creating new session:", insertError);
        } else {
          // Optionally, update your state with the new session
          setChatSessionId(insertedSession[0].id);
        }
        setShowChat(true);
      } else alert("Please try again an error occurred");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowChat(false);
    setChatSessionId(null);
    setSession(null);
  };

  const handleHistoryClick = () => {
    setShowHistory(true);
  };

  const handleBackToHome = () => {
    setShowHistory(false);
  };

  const handleExport = async (type, title, summary) => {
    if (!type) {
      // This is a request to generate the summary
      try {
        const response = await fetch("http://localhost:5000/api/summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId: chatSessionId }),
        });
        const data = await response.json();
        return data.summary;
      } catch (error) {
        console.log(error);
        throw new Error("Failed to generate summary");
      }
    } else {
      // This is a request to export to a specific platform
      try {
        // Implement your export logic here
        console.log(`Exporting to ${type} with title: ${title}`);
        console.log(`Summary: ${summary}`);
        // You would typically make an API call here to handle the export
        return true;
      } catch (error) {
        console.log(error);
        throw new Error(`Failed to export to ${type}`);
      }
    }
  };

  if (isInitializing) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner />
        <p className="ml-4">Initializing app...</p>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        session={session}
        handleLogout={handleLogout}
        handleHistoryClick={handleHistoryClick}
        handleExport={handleExport}
        chatSessionId={chatSessionId}
      />
      <main
        className={`${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } overflow-hidden`}
      >
        {isCheckingSession ? (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner size="h-12 w-12" />
            <p className="ml-4">Checking session...</p>
          </div>
        ) : !session ? (
          <Login />
        ) : showHistory ? (
          <div className="flex flex-col overflow-hidden w-full h-full">
            <button
              onClick={handleBackToHome}
              className={`m-4 px-4 py-2 rounded-lg ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-blue-500 hover:bg-blue-400"
              } text-white`}
            >
              Back to Home
            </button>
            <History
              theme={theme}
              session={session}
              reciveclick={reciveClick}
            />
          </div>
        ) : (
          <Home
            theme={theme}
            showChat={showChat}
            isLoading={isLoading}
            handleStartChat={handleStartChat}
          >
            {showChat && (
              <ChatWindow
                theme={theme}
                url={url}
                source={source}
                chatSessionId={chatSessionId}
              />
            )}
          </Home>
        )}
      </main>
    </div>
  );
}

export default App;
