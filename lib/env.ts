export const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key];
  if (!value) {
    if (fallback !== undefined) {
      console.warn(`[env] Warning: Missing ${key}, using fallback: ${fallback}`);
      return fallback;
    }
    throw new Error(`[env] Missing required environment variable: ${key}`);
  }
  return value;
};

export const ENV = {
  SUPABASE_URL: getEnv('SUPABASE_URL', 'https://fallback.supabase.co'),
  SUPABASE_ANON_KEY: getEnv('SUPABASE_ANON_KEY', 'anon-fallback'),
  NEXTAUTH_URL: getEnv('NEXTAUTH_URL', 'http://localhost:3000'),
  SPORTS_API_KEY: getEnv('SPORTS_API_KEY', 'sports-fallback-key'),
};

