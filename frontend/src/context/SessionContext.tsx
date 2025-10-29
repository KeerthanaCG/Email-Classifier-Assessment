"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
interface User {
  name?: string;
  email?: string;
  picture?: string;
}
interface SessionContextType {
  user: User | null;
  sessionId: string | null;
  apiKey: string | null;
  setUser: (u: User | null) => void;
  setSessionId: (id: string | null) => void;
  apiKeyExists: boolean;
  saveApiKey: (key: string) => void;
  logout: () => void;
}
const SessionContext = createContext<SessionContextType>(
  {} as SessionContextType
);
export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedSession = localStorage.getItem("sessionId");
    const storedKey = localStorage.getItem("apiKey");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedSession) setSessionId(storedSession);
    if (storedKey) setApiKey(storedKey);
  }, []);
  const saveApiKey = (key: string) => {
    if (apiKey) {
      alert("API key is already saved!");
      return;
    }
    localStorage.setItem("apiKey", key);
    setApiKey(key);
    alert("API key saved successfully!");
  };
  const logout = () => {
    localStorage.clear();
    setUser(null);
    setSessionId(null);
    setApiKey(null);
    window.location.href = "/";
  };
  return (
    <SessionContext.Provider
      value={{
        user,
        sessionId,
        apiKey,
        setUser,
        setSessionId,
        apiKeyExists: !!apiKey,
        saveApiKey,
        logout,
      }}
    >
      {" "}
      {children}{" "}
    </SessionContext.Provider>
  );
};
export const useSession = () => useContext(SessionContext);
