import { Inter, JetBrains_Mono } from "next/font/google";

// Configure the Inter font for UI text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Configure JetBrains Mono for the code content
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Pastebin-lite",
  description: "Self-destructing code sharing for developers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body
        style={{
          margin: 0,
          backgroundColor: "#0f172a",
          backgroundImage:
            "radial-gradient(circle at 2px 2px, #1e293b 1px, transparent 0)",
          backgroundSize: "32px 32px",
          fontFamily: "var(--font-inter), sans-serif",
          color: "#f1f5f9",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
