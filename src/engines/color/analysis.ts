import {
  hexToOklch,
  oklchToHex,
  hexToRgb,
  OKLCH,
  RGB
} from './conversions';
import { differenceCie76 } from 'culori';

// Relative Luminance calculation (WCAG Standard)
export function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  
  // Transform to linear RGB values
  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  
  // Calculate relative luminance formula
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Delta E Calculation (Color Difference)
export function getDeltaE(hex1: string, hex2: string): number {
  const dE = differenceCie76();
  return dE(hex1, hex2);
}

// Color Temperature (0 = Neutral/Cool, 1 = Warm)
export function getColorTemperature(hex: string): 'warm' | 'cool' | 'neutral' {
  const oklchVal = hexToOklch(hex);
  const hue = oklchVal.h;
  
  // Hues between 20 and 200 are generally warm (red, orange, yellow, yellowish-green)
  // Hues between 200 and 340 are cool (blue, violet)
  if (hue >= 20 && hue <= 180) {
    return 'warm';
  } else if (hue >= 200 && hue <= 340) {
    return 'cool';
  }
  return 'neutral';
}

// Generate Scale (Tailwind standard weights)
export interface ScaleNode {
  weight: number;
  hex: string;
  oklch: OKLCH;
}

export function generateScale(baseHex: string): ScaleNode[] {
  const baseOklch = hexToOklch(baseHex);
  const weights = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  
  // Target lightness scale from 50 (lightest) to 950 (darkest)
  const lightnessMap: Record<number, number> = {
    50: 0.97,
    100: 0.92,
    200: 0.85,
    300: 0.75,
    400: 0.65,
    500: 0.55,
    600: 0.45,
    700: 0.35,
    800: 0.25,
    900: 0.15,
    950: 0.10,
  };

  return weights.map((weight) => {
    // Lightness target for this weight
    const targetL = lightnessMap[weight];
    
    // Scale chroma so it peaks in the middle and decreases at extreme values to prevent clipping
    const chromaFactor = Math.sin(Math.PI * targetL);
    const targetC = Math.min(baseOklch.c * (chromaFactor + 0.1), 0.3);
    
    const nodeOklch: OKLCH = {
      l: targetL,
      c: targetC,
      h: baseOklch.h,
    };

    const hex = oklchToHex(nodeOklch);
    return {
      weight,
      hex,
      oklch: nodeOklch,
    };
  });
}

// Generate Harmonies based on standard rules
export function generateHarmony(
  baseHex: string,
  type: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'split-complementary'
): string[] {
  const baseOklch = hexToOklch(baseHex);
  const h = baseOklch.h;
  const c = baseOklch.c;
  const l = baseOklch.l;

  const normalizeHue = (angle: number) => (angle + 360) % 360;

  switch (type) {
    case 'monochromatic':
      // Vary lightness and chroma, keep hue identical
      return [
        oklchToHex({ l: Math.min(l + 0.2, 0.95), c: Math.max(c - 0.05, 0.02), h }),
        oklchToHex({ l: Math.min(l + 0.1, 0.85), c, h }),
        baseHex,
        oklchToHex({ l: Math.max(l - 0.1, 0.25), c, h }),
        oklchToHex({ l: Math.max(l - 0.2, 0.12), c: Math.max(c - 0.05, 0.02), h }),
      ];

    case 'analogous':
      // Hue offsets of -30 and +30 degrees
      return [
        oklchToHex({ l, c, h: normalizeHue(h - 30) }),
        oklchToHex({ l, c, h: normalizeHue(h - 15) }),
        baseHex,
        oklchToHex({ l, c, h: normalizeHue(h + 15) }),
        oklchToHex({ l, c, h: normalizeHue(h + 30) }),
      ];

    case 'complementary':
      // Direct opposite color on the color wheel (180 degrees)
      return [
        baseHex,
        oklchToHex({ l, c, h: normalizeHue(h + 180) }),
      ];

    case 'triadic':
      // Hues at 120 and 240 degrees offsets
      return [
        baseHex,
        oklchToHex({ l, c, h: normalizeHue(h + 120) }),
        oklchToHex({ l, c, h: normalizeHue(h + 240) }),
      ];

    case 'split-complementary':
      // Base color plus offsets at 150 and 210 degrees
      return [
        baseHex,
        oklchToHex({ l, c, h: normalizeHue(h + 150) }),
        oklchToHex({ l, c, h: normalizeHue(h + 210) }),
      ];
      
    default:
      return [baseHex];
  }
}
