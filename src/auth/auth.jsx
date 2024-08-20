import React, { useState } from "react";
import { supabase } from "../utils/supabase";

function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const manifest = chrome.runtime.getManifest();

      const url = new URL("https://accounts.google.com/o/oauth2/auth");

      url.searchParams.set("client_id", manifest.oauth2.client_id);
      url.searchParams.set("response_type", "id_token");
      url.searchParams.set("access_type", "offline");
      url.searchParams.set(
        "redirect_uri",
        `https://${chrome.runtime.id}.chromiumapp.org`
      );
      url.searchParams.set("scope", manifest.oauth2.scopes.join(" "));

      // console.log(chrome.runtime.id);
      chrome.identity.launchWebAuthFlow(
        {
          url: url.href,
          interactive: true,
        },
        async (redirectedTo) => {
          if (chrome.runtime.lastError) {
            // auth was not successful
            console.log("Auth was not successfull");
          } else {
            // auth was successful, extract the ID token from the redirectedTo URL
            const url = new URL(redirectedTo);
            const params = new URLSearchParams(url.hash);

            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: params.get("#id_token"),
            });

            if (error) throw new Error(error);

            console.log(data);
          }
        }
      );
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        disabled={loading}
        onClick={handleLogin}
      >
        {loading ? "Loading..." : "Sign In"}
      </button>
    </div>
  );
}

export default Login;
