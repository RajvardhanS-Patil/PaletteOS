# Security: PaletteOS

## Purpose
Establish the security protocols and defensive programming standards required to protect user data, prevent abuse of our AI services, and maintain application integrity.

## Responsibilities
- Protect API keys from being exposed to the client.
- Prevent Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF).
- Secure user data via strict database access policies.

## Architecture & Layers of Defense

### 1. Edge & Network Security
- **DDoS Protection**: Handled automatically by Vercel / Cloudflare.
- **Rate Limiting**: Implement Redis-based rate limiting on all API routes, specifically targeting `/api/v1/ai/*` to prevent financial draining via AI API abuse.

### 2. Application Security (Next.js)
- **Input Validation**: ALL incoming API payloads must be validated using `Zod`. Never trust client data.
- **XSS Prevention**: React automatically escapes rendering, but we must be extremely careful if we ever use `dangerouslySetInnerHTML` (e.g., when rendering Markdown from an AI explanation).

### 3. Database Security (Supabase)
- **Row Level Security (RLS)**: The database is accessed via a service role on the backend, but if we ever allow direct client queries (Supabase JS Client), RLS must be strictly enforced:
  - `CREATE POLICY "Users can only view their own projects" ON projects FOR SELECT USING (auth.uid() = user_id);`

## Best Practices
- **Secret Management**: Use `.env.local` for local development. Never commit `.env` files. Use the hosting provider's Secret Manager for production variables.
- **Least Privilege**: The database user used by the API should only have the permissions necessary to perform its functions.

## Risks
- **Prompt Injection**: Users might try to pass malicious prompts into the `generatePalette` AI feature to bypass filters or extract system instructions.
  - *Mitigation*: Strictly format the prompt on the server-side, wrapping user input in clear delimiters, and validate the output before returning it.

## Developer Notes
- When reviewing PRs, utilize skills like `api-security-best-practices` and `backend-security-coder` to ensure no vulnerabilities are introduced.
