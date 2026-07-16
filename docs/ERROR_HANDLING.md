# Error Handling: PaletteOS

## Purpose
Define how PaletteOS gracefully manages failures, ranging from invalid user input to third-party API outages, ensuring the user is never left with a broken UI or silent failures.

## Responsibilities
- Catch and recover from React rendering errors.
- Handle API failures (Network, 500s, Rate Limits).
- Provide clear, actionable feedback to the user.

## Architecture

### 1. Global Error Boundaries
The Next.js App Router utilizes `error.tsx` files. We will implement granular error boundaries:
- A global `app/error.tsx` for catastrophic app-wide failures.
- Feature-specific error boundaries (e.g., wrapping the Palette Generator so that if the Color Engine throws an unexpected math error, only the generator crashes, not the entire dashboard).

### 2. API Error Handling (Client-Side)
When using fetching libraries like `SWR` or `React Query` (or custom wrappers around `fetch`):
- All API calls must be wrapped in a `try/catch`.
- On failure, dispatch a Toast notification to the UI.
  - *Format*: "Failed to save palette. Please check your connection."

### 3. API Error Handling (Server-Side)
Next.js API routes must never leak stack traces to the client.
- Catch all errors.
- Log the error internally (e.g., to Sentry, DataDog, or Axiom).
- Return a standardized JSON error response:
  ```json
  { "error": true, "message": "Rate limit exceeded. Please try again in 1 minute.", "code": 429 }
  ```

## Best Practices
- **Never Trust the User**: Hex code inputs must be validated using Regex (`/^#([0-9A-F]{3}){1,2}$/i`) before being passed to the Color Engine. If invalid, the UI should show a red border and an error message, and the Engine should *not* execute.
- **Graceful Degradation**: If the AI Provider (OpenAI/Anthropic) goes down, the "AI Fix" button should be disabled, and a tooltip should explain "AI services are temporarily unavailable. Mathematical fixes are still active."

## Risks
- Failing to catch an error in the Color Engine (e.g., dividing by zero when calculating a hue angle) will crash the entire client-side application (White Screen of Death).

## Developer Notes
- Use the `toast()` function from a library like `sonner` or `react-hot-toast` for transient error messages. Never use native `alert()`.
