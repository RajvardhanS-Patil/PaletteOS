# Contributing to PaletteOS

First off, thank you for considering contributing to PaletteOS! 

We want to build the "Lighthouse for Colors," and community contributions are crucial to making this the industry standard for accessibility and design systems.

## Code of Conduct
By participating in this project, you are expected to uphold a welcoming, inclusive, and professional environment. 

## How Can I Contribute?

### 1. Reporting Bugs
- Use the GitHub Issues tab.
- Provide a clear, reproducible step-by-step guide.
- Include your OS, Browser, and the specific Color Hex codes that caused the issue.

### 2. Suggesting Enhancements
- Check the `ROADMAP.md` and `FUTURE_FEATURES.md` first to see if it's already planned.
- Open a discussion or issue detailing *why* the enhancement is necessary (focusing on how it improves accessibility or workflow).

### 3. Pull Requests
1. **Fork the repo** and create your branch from `main`.
2. **Read the Docs**: Ensure your code aligns with `SYSTEM_ARCHITECTURE.md` and `DESIGN_SYSTEM.md`.
3. **Write Tests**: If you add a new function to the Color Engine, you *must* add the corresponding Vitest unit tests.
4. **Run Quality Checks**: Ensure `npm run lint` and `npm run test` pass.
5. **Commit Standards**: Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).
6. **Open PR**: Describe your changes in detail, linking to any relevant issues.

## Development Setup

1. Clone the repo.
2. Run `npm install` (or `pnpm install` / `bun install`).
3. Copy `.env.example` to `.env.local` and add your Supabase/Clerk keys if working on authenticated features.
4. Run `npm run dev`.

## Engine Purity Rule
If you are contributing to the `/engines` directory, **do not** import React, window objects, or any browser-specific APIs. These engines must remain pure TypeScript to allow for future Node.js/CLI usage.

---
*Thank you for helping us make the web more beautiful and accessible!*
