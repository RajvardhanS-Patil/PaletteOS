# Export System: PaletteOS

## Purpose
Define the mechanism for translating the internal state of a generated color palette into production-ready code snippets across multiple frameworks and design languages.

## Responsibilities
- Convert internal color arrays into structured formats (Tailwind, CSS Variables, JSON, SCSS).
- Ensure output code is perfectly formatted and easy to copy-paste.
- Maintain a scalable architecture to add new export targets (e.g., React Native, Flutter, Swift).

## Architecture

The Export System utilizes a **Strategy Pattern**. Based on the requested format, a specific formatter function processes the internal palette state.

### Internal Data Structure
A palette in memory looks like:
```json
{
  "primary": { "50": "#eff6ff", "500": "#3b82f6", "900": "#1e3a8a" },
  "background": "#ffffff"
}
```

### Supported Formatters

#### 1. Tailwind CSS (`tailwind.config.js`)
Generates the `theme.extend.colors` object.
```javascript
// Generated Output
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ...
        }
      }
    }
  }
}
```

#### 2. CSS Variables (`:root`)
Generates standard CSS custom properties.
```css
/* Generated Output */
:root {
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  /* ... */
}
```

#### 3. Design Tokens (W3C Standard JSON)
Generates structured JSON adhering to the W3C Design Tokens Community Group specification.

## Best Practices
- **Immutability**: Formatters must take the internal state as a read-only parameter and return a pure string.
- **Syntax Highlighting**: Use a lightweight library (like `prismjs` or `shiki`) to syntax highlight the generated code snippet in the UI.

## Scalability Considerations
- The architecture must allow a developer to add a new exporter (e.g., `exportToChakraUI()`) by simply adding a new pure function and registering it in a configuration array, without touching the core UI components.

## Risks
- Framework configurations (like Tailwind) change across major versions.
  - *Mitigation*: Ensure the export UI explicitly states which version the configuration targets (e.g., "Tailwind CSS v3/v4").

## Developer Notes
- Add a "Copy to Clipboard" button to every export block. Use the `navigator.clipboard.writeText` API, and ensure it provides a visual "Copied!" success state.
