import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DecisionForge AI — Multi-Agent Decision Sandbox",
  description:
    "Spawn a panel of four contrasting AI personas to debate your toughest decisions, visualize risk vs. reward, and get an actionable consensus report.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-forge-bg font-sans text-slate-100 antialiased">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_0%,rgba(248,113,113,0.12),transparent_55%),radial-gradient(circle_at_85%_100%,rgba(248,113,113,0.1),transparent_55%)]" />
        {children}
      </body>
    </html>
  );
}
