// components/History.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

function History({ theme, session, reciveclick }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching history:", error);
      } else {
        setHistory(data);
      }
      setLoading(false);
    }

    if (session) {
      fetchHistory();
    }
  }, [session]);

  const handleOnclick = (id, source) => {
    reciveclick(id, source);
  };

  return (
    <div
      className={`p-4 ${theme === "dark" ? "text-white" : "text-gray-800"} 
                    h-[calc(100vh-64px)] overflow-y-auto 
                    scrollbar-thin scrollbar-thumb-rounded 
                    ${
                      theme === "dark"
                        ? "scrollbar-thumb-gray-600"
                        : "scrollbar-thumb-gray-300"
                    }`}
    >
      <h2 className="text-2xl font-bold mb-4">Your History</h2>
      <ul className="space-y-4">
        {loading && <span>Loading</span>}
        {history.map((item) => (
          <li
            key={item.id}
            className={`p-3 rounded-lg ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <button
              onClick={() => handleOnclick(item.id, item.source)}
              className=" flex flex-col gap-3 "
            >
              <h3 className="font-semibold">{item.title || "Untitled"}</h3>
              <p className="text-xs text-gray-500">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default History;
