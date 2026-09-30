import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Social Work AI Lab · 伦理困境模拟器",
  description: "AI does not decide. AI helps social workers think.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
