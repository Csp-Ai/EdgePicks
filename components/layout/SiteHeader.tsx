"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home" },
  { href: "/predictions", label: "Predictions" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/demo-0to1", label: "Demo", mobileHidden: true },
];

export default function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">EdgePicks</Link>
        <nav className="flex gap-4 text-sm">
          {tabs.map(t => {
            const active = pathname === t.href;
            const base = active
              ? "text-primary underline underline-offset-4"
              : "text-muted-foreground hover:text-foreground";
            const hidden = t.mobileHidden ? "hidden sm:inline" : "";
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={active ? 'page' : undefined}
                className={`${base} ${hidden}`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
