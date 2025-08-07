interface GetEnvOptions {
  required?: boolean;
  fallback?: string;
}

export const getEnv = (
  key: string,
  { required = true, fallback }: GetEnvOptions = {},
): string => {
  const value = process.env[key];
  const isProduction = process.env.NODE_ENV === 'production';
  if (!value) {
    if (fallback !== undefined && !isProduction) {
      console.warn(`[env] ${key} is missing, using fallback: ${fallback}`);
      return fallback;
    }
    if (!required) {
      console.warn(`[env] ${key} is not set`);
      return '';
    }
    throw new Error(`[env] Missing required environment variable: ${key}`);
  }
  return value;
};

export const ENV = {
  SUPABASE_URL: getEnv('SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnv('SUPABASE_ANON_KEY'),
  NEXTAUTH_URL: getEnv('NEXTAUTH_URL'),
  NEXTAUTH_SECRET: getEnv('NEXTAUTH_SECRET'),
  GOOGLE_CLIENT_ID: getEnv('GOOGLE_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: getEnv('GOOGLE_CLIENT_SECRET'),
  SPORTS_API_KEY: getEnv('SPORTS_API_KEY', {
    required: false,
    fallback: 'sports-fallback-key',
  }),
  SPORTS_DB_NFL_ID: getEnv('SPORTS_DB_NFL_ID', { required: false }),
  SPORTS_DB_MLB_ID: getEnv('SPORTS_DB_MLB_ID', { required: false }),
  SPORTS_DB_NBA_ID: getEnv('SPORTS_DB_NBA_ID', { required: false }),
  SPORTS_DB_NHL_ID: getEnv('SPORTS_DB_NHL_ID', { required: false }),
  ODDS_API_KEY: getEnv('ODDS_API_KEY', { required: false }),
} as const;
