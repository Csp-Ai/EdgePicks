import NoPrefetchLink from "@/components/NoPrefetchLink";

const tabs = [
  { href: "/", label: "Home" },
  { href: "/predictions", label: "Predictions" },
  { href: "/agents", label: "Agents" },
  { href: "/logs", label: "Logs" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/demo", label: "Demo", mobileHidden: true },
];

export default function SiteHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <NoPrefetchLink href="/" className="font-semibold">EdgePicks</NoPrefetchLink>
        <nav className="flex gap-4 text-sm">
          {tabs.map(t => {
            const hidden = t.mobileHidden ? "hidden sm:inline" : "";
            return (
              <NoPrefetchLink
                key={t.href}
                href={t.href}
                className={`${hidden} text-muted-foreground hover:text-foreground`}
              >
                {t.label}
              </NoPrefetchLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
