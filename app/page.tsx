"use client";
import { useState } from "react";

// Interface for the API response
interface CreatePasteResponse {
  url?: string;
  error?: string;
}

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState(3600);
  const [maxViews, setMaxViews] = useState(10);
  const [link, setLink] = useState("");

  const createPaste = async () => {
    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          ttl_seconds: ttl,
          max_views: maxViews,
        }),
      });

      const data: CreatePasteResponse = await res.json();
      if (data.url) setLink(data.url);
    } catch (err) {
      console.error("Failed to create paste", err);
    }
  };

  return (
    <main style={s.main}>
      <div style={s.glassCard}>
        <h1 style={s.gradientText}>Pastebin Pro</h1>
        <p style={s.subtitle}>
          Secure, high-performance, self-destructing pastes.
        </p>

        <textarea
          style={s.textarea}
          placeholder="// Paste your code or text here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div style={s.grid}>
          <div style={s.inputBox}>
            <label style={s.label}>Lifespan (Seconds)</label>
            <input
              type="number"
              style={s.input}
              value={ttl}
              onChange={(e) => setTtl(Number(e.target.value))}
            />
          </div>
          <div style={s.inputBox}>
            <label style={s.label}>View Limit</label>
            <input
              type="number"
              style={s.input}
              value={maxViews}
              onChange={(e) => setMaxViews(Number(e.target.value))}
            />
          </div>
        </div>

        <button onClick={createPaste} style={s.button}>
          🚀 Create Secure Link
        </button>

        {link && (
          <div style={s.result}>
            <p style={s.label}>Share this URL:</p>
            <input
              readOnly
              value={link}
              style={s.linkInput}
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
          </div>
        )}
      </div>
    </main>
  );
}

const s = {
  main: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
  },
  glassCard: {
    background: "rgba(30, 41, 59, 0.7)",
    backdropFilter: "blur(12px)",
    padding: "40px",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "700px",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
    fontFamily: "var(--font-inter), sans-serif",
  },
  gradientText: {
    fontSize: "2.5rem",
    fontWeight: "800",
    textAlign: "center",
    margin: "0 0 10px 0",
    background: "linear-gradient(to right, #818cf8, #c084fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: { textAlign: "center", color: "#94a3b8", marginBottom: "30px" },
  textarea: {
    width: "100%",
    height: "200px",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "12px",
    padding: "15px",
    color: "#e2e8f0",
    fontFamily: "var(--font-mono), monospace",
    resize: "vertical" as const,
    outline: "none",
    marginBottom: "20px",
    boxSizing: "border-box" as const,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "25px",
  },
  inputBox: { display: "flex", flexDirection: "column", gap: "8px" },
  label: {
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase" as const,
  },
  input: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "8px",
    padding: "10px",
    color: "white",
    outline: "none",
    fontFamily: "var(--font-inter)",
  },
  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "#6366f1",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "var(--font-inter)",
  },
  result: {
    marginTop: "25px",
    padding: "20px",
    background: "rgba(99, 102, 241, 0.1)",
    borderRadius: "12px",
  },
  linkInput: {
    width: "100%",
    background: "transparent",
    border: "none",
    color: "#818cf8",
    fontWeight: "bold",
    fontSize: "1rem",
    outline: "none",
    fontFamily: "var(--font-mono)",
  },
} as const;
