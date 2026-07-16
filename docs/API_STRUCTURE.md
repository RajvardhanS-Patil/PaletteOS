# API Structure: PaletteOS

## Purpose
Define the communication contracts between the Client (Browser) and the Server (Serverless API), ensuring secure, predictable, and performant data exchange.

## Architecture

We are utilizing a RESTful architecture built on Next.js App Router Route Handlers (`app/api/...`), leveraging Edge runtimes where possible.

### Base URL
`/api/v1/`

### Endpoints Overview

#### 1. Projects
- `GET /api/v1/projects` - Retrieve all projects for the authenticated user.
- `POST /api/v1/projects` - Create a new project.
- `GET /api/v1/projects/:id` - Retrieve a specific project and its palettes.
- `DELETE /api/v1/projects/:id` - Delete a project.

#### 2. Palettes
- `POST /api/v1/palettes` - Save a new palette to a project.
- `PUT /api/v1/palettes/:id` - Update an existing palette (colors, name, rules).
- `DELETE /api/v1/palettes/:id` - Delete a palette.

#### 3. AI & Analysis (The "Lighthouse" Endpoints)
- `POST /api/v1/analyze/image` 
  - **Payload:** Base64 image or Image URL.
  - **Response:** Extracted dominant colors and preliminary accessibility audit.
- `POST /api/v1/ai/explain`
  - **Payload:** `{ palette: [...], failures: [...] }`
  - **Response:** Natural language explanation of why the palette fails accessibility and how to fix it.
- `POST /api/v1/ai/generate`
  - **Payload:** `{ prompt: "A cyberpunk neon theme" }`
  - **Response:** Generated color array.

## Best Practices
- **Never expose AI API keys on the client.** All requests to OpenAI/Anthropic must go through our `/api/v1/ai/*` routes.
- **Payload Validation**: Use `Zod` on both the client (for form validation) and the server (to validate incoming API payloads) to ensure strict type safety.

## Scalability Considerations
- AI endpoints (`/api/v1/ai/*`) must implement strict Rate Limiting (e.g., using Upstash Redis) to prevent abuse and API cost overruns.
- Use `SWR` or `React Query` on the frontend to cache `GET` requests heavily, minimizing database reads.

## Developer Notes
- Next.js Route Handlers allow us to use `edge` runtime. Use it for endpoints that don't require Node.js specific APIs to ensure the lowest latency globally.
