import { calcAPCA } from 'apca-w3';
import { getLuminance } from '../color/analysis';

export interface ContrastMatrixNode {
  foreground: string;
  background: string;
  wcagRatio: number;
  wcagGrade: 'AAA' | 'AA' | 'AA Large' | 'Fail';
  apcaLc: number;
}

// WCAG relative luminance contrast formula: (L1 + 0.05) / (L2 + 0.05)
export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);
  // Round to 2 decimal places
  return Math.round(ratio * 100) / 100;
}

// APCA contrast Lc (Lightness contrast)
export function getApcaContrast(textColorHex: string, bgColorHex: string): number {
  const apcaVal = calcAPCA(textColorHex, bgColorHex);
  // calcAPCA returns a string or number, we parse and round it to 1 decimal place
  const numVal = typeof apcaVal === 'string' ? parseFloat(apcaVal) : apcaVal;
  return Math.round(numVal * 10) / 10;
}

// Grade text contrast matching WCAG AA/AAA
export function getWcagGrade(
  ratio: number,
  isLargeText: boolean = false
): 'AAA' | 'AA' | 'AA Large' | 'Fail' {
  if (isLargeText) {
    if (ratio >= 4.5) return 'AAA';
    if (ratio >= 3.0) return 'AA Large'; // maps to AA for large text
    return 'Fail';
  } else {
    if (ratio >= 7.0) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    return 'Fail';
  }
}

// Generate full matrix
export function getContrastMatrix(colors: string[]): ContrastMatrixNode[][] {
  return colors.map((fg) => {
    return colors.map((bg) => {
      const ratio = getContrastRatio(fg, bg);
      const apca = getApcaContrast(fg, bg);
      return {
        foreground: fg,
        background: bg,
        wcagRatio: ratio,
        wcagGrade: getWcagGrade(ratio, false),
        apcaLc: apca,
      };
    });
  });
}
