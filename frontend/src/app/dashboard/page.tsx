"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "../../hooks/useSession";
import Navbar from "../../components/molecules/Navbar";
import CategoryChip from "../../components/atoms/CategoryChip";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function DashboardPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, apiKey, setSessionId, sessionId, logout } = useSession();

  const [emails, setEmails] = useState<any[]>([]);
  const [classified, setClassified] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [count, setCount] = useState<number>(15);
  const [filter, setFilter] = useState<string>("All");

  const backend = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:5001";

  useEffect(() => {
    const sid = params.get("sessionId");
    if (sid) {
      localStorage.setItem("sessionId", sid);
      setSessionId(sid);
      router.replace("/dashboard");
    }
  }, [params, router, setSessionId]);

  useEffect(() => {
    const sid =
      sessionId ||
      (typeof window !== "undefined"
        ? localStorage.getItem("sessionId")
        : null);

    if (!sid) {
      console.warn("No session ID found, redirecting...");
      router.replace("/");
      return;
    }

    fetchEmails(sid, count);
  }, [sessionId]);

  const fetchEmails = async (sid: string | null, maxResults = 15) => {
    if (!sid) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${backend}/emails/fetch`,
        { sessionId: sid, maxResults },
        { withCredentials: true }
      );

      if (res.data?.success) {
        setEmails(res.data.emails || []);
        setClassified([]);
        setSelected(null);
      } else {
        console.error("Fetch failed:", res.data.error);
        alert(res.data.error || "Failed to fetch emails");
      }
    } catch (err: any) {
      console.error("Fetch error:", err.response?.status, err.message);
      if (err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        logout();
        router.replace("/");
      } else {
        alert(err?.message || "Fetch error");
      }
    } finally {
      setLoading(false);
    }
  };

  const classifyAll = async () => {
    const sid = sessionId || localStorage.getItem("sessionId");
    const key = apiKey || localStorage.getItem("apiKey");
    if (!sid || !key) return alert("Missing session or API key");

    setLoading(true);
    try {
      const res = await axios.post(`${backend}/emails/classify`, {
        emails,
        openaiApiKey: key,
      });
      if (res.data?.success) {
        setClassified(res.data.classifications || []);
        setSelected(null);
      } else {
        alert(res.data.error || "Classification failed");
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Classification error");
    } finally {
      setLoading(false);
    }
  };

  const listToShow = (classified.length ? classified : emails).filter((e) =>
    filter === "All" ? true : e.category === filter
  );

  const categoryCounts: Record<string, number> = (
    classified.length ? classified : emails
  ).reduce((acc: Record<string, number>, e: any) => {
    const cat = e.category || "General";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar
        user={
          user ??
          (typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("user") || "null")
            : null)
        }
        onLogout={handleLogout}
      />

      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Your Emails</h2>
            <p className="text-sm text-slate-400">
              Fetched: {emails.length} · Classified: {classified.length}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-300">Emails to fetch:</label>
            <select
              value={count}
              onChange={(e) => {
                const newCount = Number(e.target.value);
                setCount(newCount);
                const sid = sessionId || localStorage.getItem("sessionId");
                fetchEmails(sid, newCount);
              }}
              className="bg-slate-800 text-white px-3 py-2 rounded"
            >
              {[5, 10, 15, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                const sid = sessionId || localStorage.getItem("sessionId");
                fetchEmails(sid, count);
              }}
              className="px-3 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Fetch
            </button>
            <button
              onClick={classifyAll}
              className="px-3 py-2 bg-green-600 rounded hover:bg-green-700"
            >
              Classify
            </button>
          </div>
        </div>

        <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700">
          <div className={`flex gap-4 transition-all duration-300`}>
            <div
              className={`${
                selected ? "w-1/3" : "w-full"
              } transition-all duration-300 pr-2 border-r border-slate-700 max-h-[70vh] overflow-y-auto`}
            >
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={() => setFilter("All")}
                  className={`px-3 py-1 rounded ${
                    filter === "All"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700/40 text-slate-200"
                  }`}
                >
                  All ({classified.length ? classified.length : emails.length})
                </button>
                {Object.entries(categoryCounts).map(([cat, count]) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-3 py-1 rounded ${
                      filter === cat
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-700/40 text-slate-200"
                    }`}
                  >
                    {cat} ({count})
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="text-slate-300 p-4">Loading...</div>
              ) : listToShow.length === 0 ? (
                <div className="text-slate-400 p-4">No emails to display</div>
              ) : (
                listToShow.map((email, idx) => (
                  <div
                    key={email.id || idx}
                    onClick={() => setSelected(email)}
                    className="p-3 cursor-pointer hover:bg-slate-700/30 rounded mb-2"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white">
                          {email.subject || "No Subject"}
                        </div>
                        <div className="text-xs text-slate-400">
                          {email.from}
                        </div>
                        {email.snippet && (
                          <div className="text-xs text-slate-300 mt-1 line-clamp-2">
                            {email.snippet}
                          </div>
                        )}
                      </div>
                      <div className="ml-2">
                        <CategoryChip category={email.category} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selected && (
              <div className="flex-1 pl-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold">
                      {selected.subject || "No Subject"}
                    </h3>
                    <div className="text-sm text-slate-400">
                      {selected.from} •{" "}
                      {selected.date
                        ? new Date(selected.date).toLocaleString()
                        : ""}
                    </div>
                    <div className="mt-3">
                      <CategoryChip category={selected.category} />
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => setSelected(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="mt-4 bg-slate-900 p-4 rounded text-slate-200 max-h-[60vh] overflow-auto">
                  {selected.isHtml ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(selected.body || ""),
                      }}
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap">
                      {selected.body || selected.snippet || "No content"}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function sanitizeHtml(html: string) {
  if (!html) return "";
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/on\w+="[^"]*"/g, "");
}
