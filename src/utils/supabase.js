import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const addMessageToSupabase = async (content, isUser, sessionId) => {
  const { data, error } = await supabase
    .from("messages")
    .insert([{ content, isUser, session_id: sessionId }]);

  if (error) throw error;
  return data;
};

export const getMessagesFromSupabase = async (sessionId) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};
