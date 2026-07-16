# Wireframes: PaletteOS

## Purpose
This document provides low-fidelity ASCII wireframes for the core workspaces of PaletteOS, showing layout arrangements, sidebar constraints, and responsive shifts across devices.

---

## 1. Palette Generator Canvas (`/generator`)

### Desktop Layout (Grid: 3 Columns)
```text
+-----------------------------------------------------------------------------+
|  PaletteOS Logo  |  [Tab: Generator] [Tab: Analyzer] [Tab: Playground]      |
+-----------------------------------------------------------------------------+
|  Controls Panel  |  Main Swatch Canvas                       |  Inspector   |
|                  |                                           |  Panel       |
|  Seed Input:     |  [Lock] Swatch 1 (50)    [Edit Hue/Chr]   |              |
|  [ #3B82F6 ]     |  [Lock] Swatch 2 (100)   [Edit Hue/Chr]   |  Selected    |
|                  |  [Lock] Swatch 3 (200)   [Edit Hue/Chr]   |  Swatch      |
|  Harmony Rule:   |  [Lock] Swatch 4 (300)   [Edit Hue/Chr]   |  Metadata:   |
|  [ Monochromatic]|  [Lock] Swatch 5 (400)   [Edit Hue/Chr]   |  Hex: #3b82f6|
|                  |  [Lock] Swatch 6 (500)   [Edit Hue/Chr]   |  L:  0.55    |
|  Steps:          |  [Lock] Swatch 7 (600)   [Edit Hue/Chr]   |  C:  0.22    |
|  [ - ] 9 [ + ]   |  [Lock] Swatch 8 (700)   [Edit Hue/Chr]   |  H:  250.0   |
|                  |  [Lock] Swatch 9 (800)   [Edit Hue/Chr]   |              |
|  +--------------+|                                           |  [Contrast:  |
|  | Generate CTA ||                                           |   7.2:1 AAA] |
|  +--------------+|                                           |              |
+-----------------------------------------------------------------------------+
```

### Mobile Layout (Stacked vertical viewport)
```text
+-----------------------+
| Logo           [Menu] |
+-----------------------+
| [Gen] [Audit] [Play]  |
+-----------------------+
|  Seed: [ #3B82F6 ]    |
|  Rule: [ Monochrom ]  |
+-----------------------+
| Swatch 1 (50)   [Lck] |
| Swatch 2 (100)  [Lck] |
| Swatch 3 (200)  [Lck] |
| Swatch 4 (300)  [Lck] |
| Swatch 5 (400)  [Lck] |
| Swatch 6 (500)  [Lck] |
+-----------------------+
| [Tapped: Swatch 5]    |
| bottom sheet details: |
| Hex: #3b82f6 | L: 0.55|
| Contrast: 7.2:1 AAA   |
+-----------------------+
```

---

## 2. Palette Analyzer Screen (`/analyzer`)

### Desktop Layout (Overall audit grid)
```text
+-----------------------------------------------------------------------------+
|  PaletteOS Logo  |  [Tab: Generator] [Tab: Analyzer] [Tab: Playground]      |
+-----------------------------------------------------------------------------+
|  Overall Score Card             |  WCAG 2.1 Contrast Matrix                 |
|  +---------------------------+  |          S1   S2   S3   S4   S5   S6       |
|  |      94 / 100             |  |     S1  [ - ] 4.5  7.1  1.2  9.0  3.4      |
|  |      Grade: Excellent     |  |     S2  4.5  [ - ] 3.1  2.2  8.0  4.1      |
|  |                           |  |     S3  7.1  3.1  [ - ] 4.5  1.8  5.0      |
|  |   [Pass WCAG AAA Compliance] |  |     S4  1.2  2.2  4.5  [ - ] 9.2  2.1      |
|  +---------------------------+  |     S5  9.0  8.0  1.8  9.2  [ - ] 4.5      |
|                                 |     S6  3.4  4.1  5.0  2.1  4.5  [ - ]      |
|  Color Blindness Simulation:    |                                           |
|  [Protan] [Deutan] [Tritan]     |  *Numbers represent ratio. Red overlays   |
|  (Applies simulated CVD filter) |   indicate failures (e.g. 1.2, 2.1).      |
+-----------------------------------------------------------------------------+
```

---

## 3. User Dashboard Screen (`/dashboard`)

### Desktop Layout (Sidebar and Project folders)
```text
+-----------------------------------------------------------------------------+
|  Logo | [Search Projects...]                                  | [User Icon] |
+-----------------------------------------------------------------------------+
|  [Sidebar]       |  Projects Workspace                                      |
|                  |                                                          |
|  [x] Dashboard   |  +-------------------+  +-------------------+            |
|  [ ] Brand Kits  |  | Project Alpha     |  | Project Beta      |            |
|  [ ] Settings    |  | Shared Brand Kit  |  | Marketing Assets  |            |
|                  |  | Palettes: 5       |  | Palettes: 2       |            |
|                  |  | Score: 96/100     |  | Score: 78/100     |            |
|                  |  +-------------------+  +-------------------+            |
|                  |  +-------------------+                                   |
|                  |  | [ + New Project ] |                                   |
|                  |  +-------------------+                                   |
+-----------------------------------------------------------------------------+
```

## Developer Notes
- Desktop grids must collapse gracefully to single column block lists on mobile sizes using CSS Flex/Grid.
- Implement layout bounds strictly mapping the [UI & UX Guidelines](file:///c:/Users/rajva/OneDrive/Documents/PROJECTS/PaletteOS/docs/UI_GUIDELINES.md).
