# validateEnv

Validate environment variables at startup to prevent misconfiguration.

Run `npm run validate-env` before starting the application or building to ensure the following variables are present:

- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- SUPABASE_URL
- SUPABASE_KEY
- SPORTS_API_KEY

If any key is missing, the script should exit with an error and list missing variables.

