# envKeys Dashboard

Visualize required environment variables in the UI dashboard.

## Purpose
Provide admins with a quick overview of which required environment keys are configured at runtime.

## Implementation Details
- Import `REQUIRED_ENV_KEYS` and `ENV` from `lib/env`.
- Create a dashboard component that lists each key with a checkmark when present and an alert icon when missing.
- Display this component on an admin-only settings page so missing keys are immediately visible.
- Fail gracefully if a key is missing even though the app booted (e.g., in client-side code where ENV isn't available).

## Files to Update
- `components/EnvKeyStatus.tsx` (new)
- `pages/admin/settings.tsx` to render the component.
