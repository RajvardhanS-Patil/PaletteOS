import {
  oklch,
  rgb,
  hsl,
  lab,
  lch,
  oklab,
  xyz65,
  formatHex,
  formatRgb,
  formatHsl,
  parse,
  formatCss
} from 'culori';

export interface RGB {
  r: number; // 0-1
  g: number; // 0-1
  b: number; // 0-1
}

export interface HSL {
  h: number; // 0-360 (degrees)
  s: number; // 0-1
  l: number; // 0-1
}

export interface HSV {
  h: number; // 0-360
  s: number; // 0-1
  v: number; // 0-1
}

export interface LAB {
  l: number; // 0-100
  a: number; // -128 to 127
  b: number; // -128 to 127
}

export interface LCH {
  l: number; // 0-100
  c: number; // 0-150
  h: number; // 0-360
}

export interface OKLAB {
  l: number; // 0-1
  a: number; // -0.4 to 0.4
  b: number; // -0.4 to 0.4
}

export interface OKLCH {
  l: number; // 0-1
  c: number; // 0-0.4
  h: number; // 0-360
}

export interface XYZ {
  x: number; // 0-1
  y: number; // 0-1
  z: number; // 0-1
}

// Helper to normalize hex
export function normalizeHex(color: string): string {
  const parsed = parse(color);
  if (!parsed) throw new Error(`Invalid color string: ${color}`);
  const hex = formatHex(parsed);
  if (!hex) throw new Error(`Could not convert to hex: ${color}`);
  return hex;
}

// HEX to others
export function hexToRgb(hex: string): RGB {
  const parsed = rgb(hex);
  if (!parsed) throw new Error(`Invalid hex: ${hex}`);
  return { r: parsed.r, g: parsed.g, b: parsed.b };
}

export function hexToOklch(hex: string): OKLCH {
  const parsed = oklch(hex);
  if (!parsed) throw new Error(`Invalid hex: ${hex}`);
  return {
    l: parsed.l,
    c: parsed.c ?? 0,
    h: parsed.h ?? 0,
  };
}

export function hexToHsl(hex: string): HSL {
  const parsed = hsl(hex);
  if (!parsed) throw new Error(`Invalid hex: ${hex}`);
  return {
    h: parsed.h ?? 0,
    s: parsed.s ?? 0,
    l: parsed.l ?? 0,
  };
}

// Others to HEX
export function rgbToHex(rgbVal: RGB): string {
  const hex = formatHex({ mode: 'rgb', r: rgbVal.r, g: rgbVal.g, b: rgbVal.b });
  if (!hex) throw new Error('Invalid RGB input');
  return hex;
}

export function oklchToHex(oklchVal: OKLCH): string {
  // Gamut mapping is done automatically by formatHex in culori to fit sRGB
  const hex = formatHex({
    mode: 'oklch',
    l: oklchVal.l,
    c: oklchVal.c,
    h: oklchVal.h,
  });
  if (!hex) throw new Error('Invalid OKLCH input');
  return hex;
}

export function hslToHex(hslVal: HSL): string {
  const hex = formatHex({
    mode: 'hsl',
    h: hslVal.h,
    s: hslVal.s,
    l: hslVal.l,
  });
  if (!hex) throw new Error('Invalid HSL input');
  return hex;
}

// Conversion Matrix
export function rgbToOklch(rgbVal: RGB): OKLCH {
  const parsed = oklch({ mode: 'rgb', ...rgbVal });
  if (!parsed) throw new Error('RGB to OKLCH conversion failed');
  return { l: parsed.l, c: parsed.c ?? 0, h: parsed.h ?? 0 };
}

export function oklchToRgb(oklchVal: OKLCH): RGB {
  const parsed = rgb({ mode: 'oklch', ...oklchVal });
  if (!parsed) throw new Error('OKLCH to RGB conversion failed');
  return { r: parsed.r, g: parsed.g, b: parsed.b };
}

export function oklchToOklab(oklchVal: OKLCH): OKLAB {
  const parsed = oklab({ mode: 'oklch', ...oklchVal });
  if (!parsed) throw new Error('OKLCH to OKLAB conversion failed');
  return { l: parsed.l, a: parsed.a ?? 0, b: parsed.b ?? 0 };
}

export function oklabToOklch(oklabVal: OKLAB): OKLCH {
  const parsed = oklch({ mode: 'oklab', ...oklabVal });
  if (!parsed) throw new Error('OKLAB to OKLCH conversion failed');
  return { l: parsed.l, c: parsed.c ?? 0, h: parsed.h ?? 0 };
}

export function rgbToHsv(rgbVal: RGB): HSV {
  // Standard math conversion since culori doesn't export HSV directly
  const r = rgbVal.r;
  const g = rgbVal.g;
  const b = rgbVal.b;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s, v };
}

export function hsvToRgb(hsvVal: HSV): RGB {
  const h = hsvVal.h / 360;
  const s = hsvVal.s;
  const v = hsvVal.v;
  let r = 0;
  let g = 0;
  let b = 0;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }

  return { r, g, b };
}

export function hexToLab(hex: string): LAB {
  const parsed = lab(hex);
  if (!parsed) throw new Error(`Invalid hex: ${hex}`);
  return { l: parsed.l, a: parsed.a ?? 0, b: parsed.b ?? 0 };
}

export function labToHex(labVal: LAB): string {
  const hex = formatHex({ mode: 'lab', ...labVal });
  if (!hex) throw new Error('Invalid LAB input');
  return hex;
}

export function hexToLch(hex: string): LCH {
  const parsed = lch(hex);
  if (!parsed) throw new Error(`Invalid hex: ${hex}`);
  return { l: parsed.l, c: parsed.c ?? 0, h: parsed.h ?? 0 };
}

export function lchToHex(lchVal: LCH): string {
  const hex = formatHex({ mode: 'lch', ...lchVal });
  if (!hex) throw new Error('Invalid LCH input');
  return hex;
}

export function hexToXyz(hex: string): XYZ {
  const parsed = xyz65(hex);
  if (!parsed) throw new Error(`Invalid hex: ${hex}`);
  return { x: parsed.x, y: parsed.y, z: parsed.z };
}

export function xyzToHex(xyzVal: XYZ): string {
  const hex = formatHex({ mode: 'xyz65', ...xyzVal });
  if (!hex) throw new Error('Invalid XYZ input');
  return hex;
}
