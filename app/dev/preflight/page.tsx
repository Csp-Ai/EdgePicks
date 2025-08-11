export const revalidate = 0;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
const DOCS_URL = 'https://github.com/EdgePicks/EdgePicks#environment-variables';

interface EnvVar {
  key: string;
  why: string;
  docs: string;
}

interface Feature {
  name: string;
  vars: EnvVar[];
}

const FEATURES: Feature[] = [
  {
    name: 'Authentication',
    vars: [
      { key: 'NEXTAUTH_URL', why: 'NextAuth callback URL for OAuth providers.', docs: DOCS_URL },
      { key: 'NEXTAUTH_SECRET', why: 'Encrypts NextAuth session tokens.', docs: DOCS_URL },
      { key: 'GOOGLE_CLIENT_ID', why: 'Google OAuth client ID.', docs: DOCS_URL },
      { key: 'GOOGLE_CLIENT_SECRET', why: 'Google OAuth client secret.', docs: DOCS_URL },
    ],
  },
  {
    name: 'Supabase',
    vars: [
      { key: 'SUPABASE_URL', why: 'Supabase project URL.', docs: DOCS_URL },
      { key: 'SUPABASE_KEY', why: 'Supabase service role key.', docs: DOCS_URL },
    ],
  },
  {
    name: 'Sports Data',
    vars: [
      { key: 'SPORTS_API_KEY', why: 'Allows fetching sports stats and schedules.', docs: DOCS_URL },
      { key: 'ODDS_API_KEY', why: 'Retrieves betting lines from the odds API.', docs: DOCS_URL },
    ],
  },
  {
    name: 'Runtime Limits',
    vars: [
      { key: 'LIVE_MODE', why: 'Toggles live vs mock mode.', docs: DOCS_URL },
      { key: 'PREDICTION_CACHE_TTL_SEC', why: 'Caches predictions for N seconds.', docs: DOCS_URL },
      { key: 'MAX_FLOW_CONCURRENCY', why: 'Limits concurrent agent flows.', docs: DOCS_URL },
    ],
  },
];

export default function PreflightPage() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Secrets &amp; Env Preflight</h1>
      <p className="text-sm text-gray-600">Read-only check of required environment variables.</p>
      {FEATURES.map((feature) => (
        <div key={feature.name} className="space-y-2">
          <h2 className="text-xl font-semibold">{feature.name}</h2>
          <ul className="space-y-1">
            {feature.vars.map((v) => {
              const missing = !process.env[v.key];
              return (
                <li key={v.key} className="flex items-center gap-2">
                  <span className="font-mono">{v.key}</span>
                  {missing ? (
                    <a
                      href={v.docs}
                      className="bg-red-200 text-red-800 text-xs px-2 py-0.5 rounded"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Missing
                    </a>
                  ) : (
                    <span className="bg-green-200 text-green-800 text-xs px-2 py-0.5 rounded">Present</span>
                  )}
                  <span className="text-sm text-gray-600">{v.why}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
