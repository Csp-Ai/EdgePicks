import "./globals.css";
import { Providers } from "./providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "EdgePicks",
  description: "Sports predictions and agent interface"
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
