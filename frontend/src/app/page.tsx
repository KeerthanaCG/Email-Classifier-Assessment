"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../hooks/useSession";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";

export default function Home() {
  const router = useRouter();
  const { apiKey, saveApiKey, user } = useSession();

  const [key, setKey] = useState(apiKey || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const handleSave = () => {
    setError("");
    if (!key.trim()) {
      setError("Please enter API key");
      return;
    }

    if (
      !key.startsWith("sk-") &&
      !confirm("Key doesn't start with sk-. Save anyway?")
    )
      return;
    saveApiKey(key.trim());
    alert("API key saved locally. Now sign in with Google.");
  };

  const handleGoogleSignIn = () => {
    if (!localStorage.getItem("apiKey")) {
      setError("Save your OpenAI API key before Google sign-in.");
      return;
    }
    const backend = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:5001";
    window.location.href = `${backend}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-800/60 backdrop-blur rounded-2xl p-8 border border-slate-700">
        <h1 className="text-2xl font-bold mb-4">Email Classifier</h1>
        <p className="text-sm text-slate-300 mb-4">
          Enter your OpenAI API key and then sign in with Google (Gmail).
        </p>

        {error && (
          <div className="bg-red-600/20 text-red-300 p-2 rounded mb-3">
            {error}
          </div>
        )}

        <Input
          type="password"
          placeholder="sk-..."
          value={key}
          onChange={setKey}
        />
        <div className="flex gap-3 mb-4 mt-4">
          <Button label="Save API Key" onClick={handleSave} />
          <button
            onClick={handleGoogleSignIn}
            className="px-4 py-2 rounded bg-white text-black font-semibold"
          >
            Sign in with Google
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-4">
          Your API key is stored only in your browser (localStorage).
        </p>
      </div>
    </div>
  );
}
