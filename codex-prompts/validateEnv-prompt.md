# validateEnv

Validate environment variables at startup to prevent misconfiguration.

Run `npm run validate-env` before starting the application or building to ensure the following variables are present in `.env.local`, `.env.development`, and `.env.production`:

- SUPABASE_URL
- SUPABASE_ANON_KEY
- NEXTAUTH_URL
- NEXTAUTH_SECRET
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- SPORTS_API_KEY

If any key is missing, the script should exit with an error and list missing variables.

