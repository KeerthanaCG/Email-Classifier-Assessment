import axios from "axios";
const BASE = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:5001";

export const fetchEmails = async (sessionId: string, maxResults = 15) => {
  const res = await axios.post(`${BASE}/emails/fetch`, {
    sessionId,
    maxResults,
  });
  return res.data;
};

export const classifyEmails = async (emails: any[], openaiApiKey: string) => {
  const res = await axios.post(`${BASE}/emails/classify`, {
    emails,
    openaiApiKey,
  });
  return res.data;
};
