import { hexToRgb, rgbToHex, RGB } from '../color/conversions';

export type CVDType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

// Vienot et al. Simulating Color Deficiencies matrices for sRGB
const CVD_MATRICES = {
  protanopia: [
    [0.567, 0.433, 0.0],
    [0.558, 0.442, 0.0],
    [0.0, 0.242, 0.758],
  ],
  deuteranopia: [
    [0.625, 0.375, 0.0],
    [0.7, 0.3, 0.0],
    [0.0, 0.3, 0.7],
  ],
  tritanopia: [
    [0.95, 0.05, 0.0],
    [0.0, 0.433, 0.567],
    [0.0, 0.475, 0.525],
  ],
};

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function simulateCVD(hex: string, type: CVDType): string {
  const { r, g, b } = hexToRgb(hex);

  if (type === 'achromatopsia') {
    // Standard relative luminance coefficients for grayscale conversion
    const gray = clamp(0.2126 * r + 0.7152 * g + 0.0722 * b);
    return rgbToHex({ r: gray, g: gray, b: gray });
  }

  const matrix = CVD_MATRICES[type];
  if (!matrix) return hex;

  const simR = clamp(matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b);
  const simG = clamp(matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b);
  const simB = clamp(matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b);

  return rgbToHex({ r: simR, g: simG, b: simB });
}

// Batch simulate a list of colors
export function simulatePaletteCVD(colors: string[], type: CVDType): string[] {
  return colors.map((c) => simulateCVD(c, type));
}
