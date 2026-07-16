# Error Catalog: PaletteOS

## Purpose
This document logs error codes, triggers, error payloads, user-facing error messages, and developer mitigation logs for the PaletteOS platform.

---

## 1. Client-Side Error Catalog

### Code: `ERR_INVALID_HEX`
- **Cause**: User manually types an invalid string value (e.g. `#ffff`) into a hex color input.
- **Severity**: Low
- **User Message**: "Please check the Hex format (e.g., #3B82F6)."
- **Developer Action**: Flag input border with state variant `error`, disable target submit button.

### Code: `ERR_GAMUT_LIMIT`
- **Cause**: OKLCH input values scale outside displayable sRGB space bounds.
- **Severity**: Medium
- **User Message**: "This color is shifted slightly to match your monitor's display limits."
- **Developer Action**: Run gamut mapping algorithm to translate coordinate bounds, log coordinate shift parameters in console.

---

## 2. API & Serverless Error Catalog

### Code: `ERR_RATE_LIMIT`
- **Cause**: User exceeds rate limit rules on AI generator endpoints.
- **Severity**: Medium
- **Http Status**: 429
- **User Message**: "Too many requests. Please wait a moment before trying again."
- **Developer Action**: Return JSON payload detailing cooldown seconds. Cache requests in Upstash Redis.

### Code: `ERR_AI_PARSING_FAIL`
- **Cause**: Large Language Model outputs invalid JSON or color strings.
- **Severity**: High
- **Http Status**: 502
- **User Message**: "AI Generation failed to parse colors. Please try again."
- **Developer Action**: Validate AI JSON using `Zod`. Catch parser exceptions, trigger log to Sentry.

### Code: `ERR_DB_SYNC_TIMEOUT`
- **Cause**: Database fails to respond during user project saves.
- **Severity**: High
- **Http Status**: 504
- **User Message**: "Cloud save failed. Your changes are saved locally."
- **Developer Action**: Fallback state to `localStorage` immediately. Mark project as "unsynced" on dashboard.

## Developer Notes
- Add standard error mapping middleware on the server side to format all database errors to matches these target codes.
