import React from "react";

function ESPNLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 20" {...props}>
      <text x="0" y="15" fontSize="14" fontFamily="inherit" fontWeight="700">
        ESPN
      </text>
    </svg>
  );
}

function AthleticLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 20" {...props}>
      <text x="0" y="15" fontSize="14" fontFamily="serif" fontWeight="600">
        The Athletic
      </text>
    </svg>
  );
}

function FiveThirtyEightLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 140 20" {...props}>
      <text x="0" y="15" fontSize="14" fontFamily="monospace" fontWeight="700">
        538
      </text>
    </svg>
  );
}

function CoversLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 20" {...props}>
      <text x="0" y="15" fontSize="14" fontFamily="inherit" fontWeight="600">
        Covers
      </text>
    </svg>
  );
}

const logos = [ESPNLogo, AthleticLogo, FiveThirtyEightLogo, CoversLogo];

export default function TrustBar() {
  return (
    <section className="py-8">
      <p className="mb-4 text-center text-sm text-muted-foreground">As seen in</p>
      <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
        {logos.map((Logo, i) => (
          <Logo key={i} className="h-6 text-foreground" aria-hidden="true" />
        ))}
      </div>
    </section>
  );
}

