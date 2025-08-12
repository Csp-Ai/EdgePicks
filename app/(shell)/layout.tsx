import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import SiteHeader from "@/components/layout/SiteHeader";
import "@/app/globals.css";
export const revalidate = 0 as const;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata: Metadata = {
  title: "EdgePicks",
  description: "AI-powered sports research assistant",
};

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="container mx-auto px-4 py-6">{children}</main>
      <Toaster />
    </div>
  );
}
