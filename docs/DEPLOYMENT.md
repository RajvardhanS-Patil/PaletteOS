# Deployment: PaletteOS

## Purpose
Establish a robust, automated pipeline to move code from development to production securely and reliably with zero downtime.

## Architecture

We employ a modern CI/CD pipeline integrated heavily with GitHub Actions and Vercel.

### Environments
1. **Development (Local)**: Runs via `npm run dev`. Connects to a local or staging Supabase instance.
2. **Preview (Staging)**: Every Pull Request to `main` automatically creates an ephemeral Vercel preview deployment. This URL is used for QA and visual regression testing.
3. **Production**: Merges to `main` trigger a production build on Vercel.

```mermaid
graph LR
    Dev[Developer Commits] --> PR[Pull Request]
    PR --> CI[GitHub Actions: Lint, Test, Build]
    CI --> Prev[Vercel Preview Deployment]
    Prev --> Merge[Merge to Main]
    Merge --> Prod[Vercel Production Deployment]
```

## Responsibilities
- **CI Checks**: Ensure every PR passes Type Checking, ESLint, Unit Tests (Vitest), and E2E Tests (Playwright).
- **Database Migrations**: Supabase migrations run automatically during the CI phase before the Vercel build completes.

## Best Practices
- **Environment Variables**: Use Vercel Environment Variables. Never store production secrets (API keys, Supabase Service keys) in the repository. Ensure Preview and Production have different keys.
- **Rollbacks**: Vercel allows instant rollbacks. If a production bug is found, revert via the Vercel dashboard immediately while preparing a hotfix.

## Scalability Considerations
- If moving to AWS or a custom containerized setup in the future, we will require Dockerfiles and a Kubernetes deployment plan. For Phase 1-3, Vercel Serverless is vastly superior for velocity.

## Developer Notes
- If your PR introduces a database schema change, you MUST include the generated migration file in the commit, or the Preview deployment will fail.
