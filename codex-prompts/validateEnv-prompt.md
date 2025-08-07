## Codex Prompt Summary

Create a strict environment variable enforcement system:

- Only load `.env.local` in development
- Export a single ENV object with validated keys
- Use a shared REQUIRED_ENV_KEYS array for both runtime and build
- Build fails if required variables are missing
- Add a `validate-env` script to pre-check .env files before deploy
