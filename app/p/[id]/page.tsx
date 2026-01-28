"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface PasteData {
  content: string;
  remaining_views: number;
  expires_at: number;
}

export default function PastePage() {
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<PasteData | null>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/pastes/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((jsonData: PasteData) => setData(jsonData))
      .catch(() => setError("Paste expired or not found"));
  }, [id]);

  useEffect(() => {
    if (!data?.expires_at) return;
    const interval = setInterval(() => {
      const diff = data.expires_at - Date.now();
      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
      } else {
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${m}m ${s}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [data]);

  const copy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error)
    return (
      <div style={v.msg}>
        ❌ {error} <br />
        <Link href="/" style={v.linkPrimary}>
          Create New
        </Link>
      </div>
    );

  if (!data) return <div style={v.msg}>Loading Secure Content...</div>;

  return (
    <div style={v.container}>
      <div style={v.header}>
        <h2 style={v.title}>📄 Content</h2>
        <div style={v.badgeGroup}>
          <span style={v.badgeT}>⏱️ {timeLeft}</span>
          <span style={v.badgeV}>👀 {data.remaining_views} left</span>
          <button onClick={copy} style={copied ? v.btnS : v.btn}>
            {copied ? "Done!" : "Copy"}
          </button>
        </div>
      </div>
      <pre style={v.pre}>{data.content}</pre>
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <Link href="/" style={v.backLink}>
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

const v = {
  container: {
    maxWidth: "900px",
    margin: "clamp(20px, 8vw, 60px) auto",
    padding: "0 20px",
    boxSizing: "border-box" as const,
    width: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap" as const,
    gap: "15px",
  },
  title: {
    margin: 0,
    fontFamily: "var(--font-inter)",
    fontSize: "clamp(1.2rem, 4vw, 1.5rem)",
  },
  badgeGroup: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap" as const,
  },
  badgeT: {
    background: "rgba(251,191,36,0.1)",
    color: "#fbbf24",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    fontFamily: "var(--font-inter)",
    whiteSpace: "nowrap" as const,
  },
  badgeV: {
    background: "rgba(244,63,94,0.1)",
    color: "#fb7185",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "bold",
    fontFamily: "var(--font-inter)",
    whiteSpace: "nowrap" as const,
  },
  btn: {
    background: "#6366f1",
    color: "white",
    border: "none",
    padding: "6px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontFamily: "var(--font-inter)",
  },
  btnS: {
    background: "#10b981",
    color: "white",
    border: "none",
    padding: "6px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontFamily: "var(--font-inter)",
  },
  pre: {
    background: "#1e293b",
    padding: "clamp(15px, 4vw, 30px)",
    borderRadius: "16px",
    border: "1px solid #334155",
    color: "#e2e8f0",
    fontFamily: "var(--font-mono), monospace",
    lineHeight: "1.6",
    overflowX: "auto" as const,
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-all" as const,
    fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
  },
  msg: {
    textAlign: "center" as const,
    marginTop: "100px",
    padding: "0 20px",
    fontSize: "1.2rem",
    fontFamily: "var(--font-inter)",
  },
  linkPrimary: {
    color: "#6366f1",
    marginTop: "1rem",
    display: "inline-block",
    textDecoration: "none",
    fontWeight: "bold",
  },
  backLink: {
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: "0.9rem",
  },
} as const;
