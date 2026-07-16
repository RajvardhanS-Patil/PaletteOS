import { getContrastRatio } from '../accessibility/contrast';
import { hexToOklch } from '../color/conversions';
import { simulateCVD } from '../accessibility/simulator';
import { getDeltaE } from '../color/analysis';

export interface SystemPalette {
  primary: string[]; // array of hex (e.g. shades 50 to 950)
  neutrals: string[]; // backgrounds, surface, text [bg, surface, text]
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  harmonyType?: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'split-complementary';
}

export interface ScoreDeduction {
  reason: string;
  penalty: number;
}

export interface ScoreResult {
  total: number;
  contrast: number;
  harmony: number;
  semantic: number;
  comfort: number;
  deductions: ScoreDeduction[];
}

export function calculateContrastScore(
  palette: SystemPalette,
  deductions: ScoreDeduction[]
): number {
  const textBgPairs = [
    // [Text, Background] pairs
    [palette.neutrals[2] || '#f4f4f5', palette.neutrals[0] || '#09090b'], // body on background
    [palette.neutrals[2] || '#f4f4f5', palette.neutrals[1] || '#18181b'], // body on surface
    [palette.primary[5] || '#3b82f6', palette.neutrals[0] || '#09090b'],   // primary accent on background
  ];

  let totalPenalties = 0;
  textBgPairs.forEach(([text, bg], idx) => {
    const ratio = getContrastRatio(text, bg);
    if (ratio < 3.0) {
      totalPenalties += 1.0;
      deductions.push({
        reason: `Critical contrast pair ${idx + 1} has failing contrast (${ratio}:1).`,
        penalty: 15,
      });
    } else if (ratio < 4.5) {
      totalPenalties += 0.5;
      deductions.push({
        reason: `Critical contrast pair ${idx + 1} is sub-optimal (${ratio}:1).`,
        penalty: 7.5,
      });
    }
  });

  const penaltyFactor = textBgPairs.length > 0 ? totalPenalties / textBgPairs.length : 0;
  return Math.round(100 * (1 - penaltyFactor));
}

export function calculateHarmonyScore(
  palette: SystemPalette,
  deductions: ScoreDeduction[]
): number {
  const type = palette.harmonyType || 'monochromatic';
  
  if (type === 'monochromatic') {
    // Check if hue standard deviation is small in OKLCH
    const hues = palette.primary.map((hex) => hexToOklch(hex).h);
    if (hues.length === 0) return 100;
    
    const mean = hues.reduce((acc, h) => acc + h, 0) / hues.length;
    const variance = hues.reduce((acc, h) => acc + Math.pow(h - mean, 2), 0) / hues.length;
    
    if (variance > 25) {
      deductions.push({
        reason: 'Monochromatic palette hues are not perfectly aligned.',
        penalty: 10,
      });
      return Math.round(100 * Math.exp(-0.005 * variance));
    }
  }
  return 100;
}

export function calculateSemanticScore(
  palette: SystemPalette,
  deductions: ScoreDeduction[]
): number {
  const requiredRoles = [
    palette.semantic.success,
    palette.semantic.warning,
    palette.semantic.error,
    palette.semantic.info,
  ];

  let validRoles = 0;
  requiredRoles.forEach((color, idx) => {
    const ratioOnBg = getContrastRatio(color, palette.neutrals[0] || '#09090b');
    if (ratioOnBg >= 3.0) {
      validRoles++;
    } else {
      deductions.push({
        reason: `Semantic color role ${idx + 1} has poor contrast on background (${ratioOnBg}:1).`,
        penalty: 5,
      });
    }
  });

  return Math.round((validRoles / requiredRoles.length) * 100);
}

export function calculateComfortScore(
  palette: SystemPalette,
  deductions: ScoreDeduction[]
): number {
  // Test CVD safety (Euclidean distance deltaE under Deuteranopia)
  const redSim = simulateCVD(palette.semantic.error, 'deuteranopia');
  const greenSim = simulateCVD(palette.semantic.success, 'deuteranopia');
  const diff = getDeltaE(redSim, greenSim);

  if (diff < 12.0) {
    deductions.push({
      reason: 'Red and Green semantic colors confuse under Deuteranopia simulation.',
      penalty: 10,
    });
    return Math.max(0, Math.round(100 - (12.0 - diff) * 8));
  }
  return 100;
}

export function calculateOverallScore(palette: SystemPalette): ScoreResult {
  const deductions: ScoreDeduction[] = [];
  
  const contrast = calculateContrastScore(palette, deductions);
  const harmony = calculateHarmonyScore(palette, deductions);
  const semantic = calculateSemanticScore(palette, deductions);
  const comfort = calculateComfortScore(palette, deductions);

  // Overall Health Score formula weighted
  const totalRaw =
    contrast * 0.50 +
    harmony * 0.30 +
    semantic * 0.10 +
    comfort * 0.10;

  const total = Math.max(0, Math.min(100, Math.round(totalRaw)));

  return {
    total,
    contrast,
    harmony,
    semantic,
    comfort,
    deductions,
  };
}
