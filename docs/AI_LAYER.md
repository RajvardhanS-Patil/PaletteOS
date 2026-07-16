# AI Layer: PaletteOS

## Purpose
Define the integration of Large Language Models (LLMs) to power the analytical, generative, and educational features of PaletteOS.

## Responsibilities
- **Explainability**: Translate raw mathematical contrast failures into human-readable advice ("Why does this fail?").
- **Generation**: Convert natural language prompts into complete, harmonious color systems.
- **Auto-Fixing**: Intelligently adjust a failing palette to pass accessibility while maintaining the original design intent.

## Architecture

The AI Layer sits on the Backend (Next.js Edge API Routes) to securely handle API keys and perform prompt engineering before hitting the external provider.

### Chosen Provider
- **Primary**: OpenAI (gpt-4o-mini for speed/cost, gpt-4o for complex reasoning).
- *Alternative*: Anthropic (Claude 3.5 Sonnet) is highly capable of coding and design tasks. 
- *Implementation*: Use `ai` (Vercel AI SDK) to easily swap between providers if needed.

### System Prompts Architecture

#### 1. The "Explainer" Prompt
- **Input**: `{ palette: Array, failures: Array<ContrastMatrix> }`
- **System Instructions**: "You are an expert accessibility designer. Explain to a junior developer why the contrast between primary and background fails WCAG AA. Be concise. Provide the exact HSL/OKLCH tweak needed to fix it."

#### 2. The "Generator" Prompt
- **Input**: User prompt (e.g., "A calm healthcare dashboard")
- **System Instructions**: "Output a JSON array of 5 hex codes. The palette must have a primary, secondary, and 3 neutrals. Ensure high contrast."
- *Note*: Force the LLM to output Structured JSON using OpenAI's JSON mode or function calling.

## Best Practices
- **Strict Parsing**: Use `Zod` to parse and validate the JSON returned by the LLM. If the LLM returns invalid hex codes, catch the error and fallback gracefully.
- **Stateless Prompts**: Send the exact context needed. Do not rely on conversational memory for palette generation.

## Scalability Considerations
- **Cost Control**: AI calls are expensive. Implement strict rate limiting (e.g., 10 AI generations per user per day on the free tier).
- **Caching**: If a user asks the AI to "Auto-fix" a specific palette array, cache the result (Redis) based on a hash of the palette. If another user requests a fix for the exact same palette, return the cached result.

## Risks
- **Hallucinations**: The LLM might suggest an "accessible" color tweak that mathematically still fails.
  - *Mitigation*: The Backend MUST run the AI's suggested palette through our own `Accessibility Engine`. If the AI's suggestion still fails, we silently fallback to our mathematical `shiftLuminance` algorithm.

## Developer Notes
- AI is an assistant, not the source of truth. Trust our Core Engines for math; trust the AI for natural language explanations.
