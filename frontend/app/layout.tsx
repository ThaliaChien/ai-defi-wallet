import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI DeFi Wallet",
  description: "A scalable MVP scaffold for an AI-powered DeFi wallet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
