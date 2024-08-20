import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

function Header({
  theme,
  toggleTheme,
  session,
  handleLogout,
  handleHistoryClick,
  handleExport,
  chatSessionId,
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTitle, setExportTitle] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [summary, setSummary] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const popupRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowExportModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleExportClick = () => {
    if (isExporting) return;
    setShowExportModal(true);
  };

  const generateSummary = async () => {
    setIsExporting(true);
    try {
      const summaryText = await handleExport(null, null);
      setSummary(summaryText);
      setShowSummary(true);
    } catch (error) {
      console.error("Summary generation failed:", error);
      alert("Failed to generate summary. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const performExport = async (type) => {
    setIsExporting(true);
    try {
      await handleExport(type, exportTitle, summary);
      alert(`Successfully exported to ${type}`);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
      setShowExportModal(false);
      setShowSummary(false);
      setExportTitle("");
      setSummary("");
    }
  };

  return (
    <header
      className={`${
        theme === "dark" ? "bg-gray-800" : "bg-blue-600"
      } text-white p-4 flex justify-between items-center`}
    >
      <h1 className="text-xl font-bold flex items-center gap-2">
        <img src="/favicon-32x32.png" width={20} alt="" /> Summari AI
      </h1>
      <div className="flex items-center space-x-4">
        <button
          title="view history"
          onClick={handleHistoryClick}
          className={`px-3 py-1 rounded-lg flex items-center ${
            theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-blue-500 hover:bg-blue-400"
          }`}
        >
          <HistoryIcon />
        </button>
        {chatSessionId && (
          <button
            title={isExporting ? "Exporting..." : "export chat"}
            onClick={handleExportClick}
            disabled={isExporting}
            className={`px-3 py-1 rounded-lg flex items-center ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-blue-500 hover:bg-blue-400"
            } ${isExporting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isExporting ? <LoadingIcon /> : <ExportIcon />}
          </button>
        )}
        <button
          title="switch mode"
          onClick={toggleTheme}
          className={`px-3 py-1 rounded-lg ${
            theme === "dark"
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-blue-500 hover:bg-blue-400"
          }`}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        {session && (
          <div className="relative">
            <button
              title="user profile"
              onClick={() => setShowPopup(!showPopup)}
              className={`w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700`}
            >
              {session.user.email[0].toUpperCase()}
            </button>
            {showPopup && (
              <div
                ref={popupRef}
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 ${
                  theme === "dark" ? "bg-gray-700" : "bg-white"
                }`}
              >
                <div
                  className={`px-4 py-2 text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <p className="font-semibold">{session.user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    theme === "dark"
                      ? "text-gray-300 hover:bg-gray-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className={`${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } p-6 rounded-lg shadow-xl w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto`}
          >
            <h2
              className={`text-xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              {showSummary ? "Review Summary" : "Generate Summary"}
            </h2>

            {!showSummary ? (
              <button
                onClick={generateSummary}
                disabled={isExporting}
                className={`w-full px-4 py-2 rounded ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white ${
                  isExporting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isExporting ? "Generating..." : "Generate Summary"}
              </button>
            ) : (
              <>
                <div
                  className={`w-full p-4 mb-4 rounded border ${
                    theme === "dark"
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-800 border-gray-300"
                  } max-h-60 overflow-y-auto`}
                >
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => (
                        <p className="mb-2" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc ml-4 mb-2" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal ml-4 mb-2" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="mb-1" {...props} />
                      ),
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
                    {summary}
                  </ReactMarkdown>
                </div>
                <input
                  type="text"
                  placeholder="Enter export title"
                  value={exportTitle}
                  onChange={(e) => setExportTitle(e.target.value)}
                  className={`w-full p-2 mb-4 rounded ${
                    theme === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                />
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => performExport("google-docs")}
                    className={`px-4 py-2 rounded ${
                      theme === "dark"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                  >
                    Export to Google Docs
                  </button>
                  <button
                    onClick={() => performExport("notion")}
                    className={`px-4 py-2 rounded ${
                      theme === "dark"
                        ? "bg-gray-600 hover:bg-gray-700"
                        : "bg-gray-300 hover:bg-gray-400"
                    } text-white`}
                  >
                    Export to Notion
                  </button>
                  <button
                    onClick={() => performExport("evernote")}
                    className={`px-4 py-2 rounded ${
                      theme === "dark"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white`}
                  >
                    Export to Evernote
                  </button>
                </div>
              </>
            )}
            <button
              onClick={() => {
                setShowExportModal(false);
                setShowSummary(false);
                setSummary("");
                setExportTitle("");
              }}
              className={`mt-4 px-4 py-2 rounded ${
                theme === "dark"
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-gray-300 hover:bg-gray-400"
              } text-white`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

const HistoryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3v5h5" />
    <path d="M3.05 13A9 9 0 106 5.3L3 8" />
    <path d="M12 7v5l4 2" />
  </svg>
);

const ExportIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const LoadingIcon = () => (
  <svg
    className="animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
);

export default Header;
