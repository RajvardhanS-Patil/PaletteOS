import { getContrastRatio, getWcagGrade } from '../accessibility/contrast';
import { hexToOklch, oklchToHex, OKLCH } from '../color/conversions';
import { getLuminance, getDeltaE } from '../color/analysis';
import { simulateCVD } from '../accessibility/simulator';
import { SystemPalette } from '../scoring';

export interface Recommendation {
  id: string;
  category: 'contrast' | 'harmony' | 'cvd' | 'ui';
  title: string;
  description: string;
  suggestedAction: string;
  targetColorHex: string;
  suggestedHex: string;
}

// Adjust oklch lightness in step increments to meet contrast
function findSafeLightness(
  textHex: string,
  bgHex: string,
  targetRatio: number = 4.5
): string {
  const textOklch = hexToOklch(textHex);
  const bgL = getLuminance(bgHex);
  const textL = getLuminance(textHex);
  const isLightBg = bgL > textL;

  let currentOklch: OKLCH = { ...textOklch };
  let currentHex = textHex;
  let ratio = getContrastRatio(currentHex, bgHex);
  let iterations = 0;

  // Max 20 steps to prevent infinite loop
  while (ratio < targetRatio && iterations < 20) {
    if (isLightBg) {
      // Light background, make text darker
      currentOklch.l = Math.max(0.05, currentOklch.l - 0.05);
    } else {
      // Dark background, make text lighter
      currentOklch.l = Math.min(0.98, currentOklch.l + 0.05);
    }
    currentHex = oklchToHex(currentOklch);
    ratio = getContrastRatio(currentHex, bgHex);
    iterations++;
  }

  return currentHex;
}

export function evaluateRules(palette: SystemPalette): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Rule CR-001: Body text contrast
  const bodyText = palette.neutrals[2] || '#f4f4f5';
  const bodyBg = palette.neutrals[0] || '#09090b';
  const bodyRatio = getContrastRatio(bodyText, bodyBg);

  if (bodyRatio < 4.5) {
    const suggestedText = findSafeLightness(bodyText, bodyBg, 4.5);
    recommendations.push({
      id: 'CR-001',
      category: 'contrast',
      title: 'Failing Text Contrast',
      description: `Body text contrast ratio is failing (${bodyRatio}:1). Standard WCAG AA requires at least 4.5:1.`,
      suggestedAction: 'Shift body text lightness in OKLCH to reach compliant contrast.',
      targetColorHex: bodyText,
      suggestedHex: suggestedText,
    });
  }

  // Rule CVD-001: Red/Green confusion under Deuteranopia
  const redSim = simulateCVD(palette.semantic.error, 'deuteranopia');
  const greenSim = simulateCVD(palette.semantic.success, 'deuteranopia');
  const cvdDiff = getDeltaE(redSim, greenSim);

  if (cvdDiff < 12.0) {
    // Shift green toward cyan and red toward orange
    const greenOklch = hexToOklch(palette.semantic.success);
    const redOklch = hexToOklch(palette.semantic.error);
    
    // Shift green hue towards bluish cyan (increase hue towards 150)
    const suggestedGreenOklch: OKLCH = {
      ...greenOklch,
      h: (greenOklch.h + 20) % 360,
    };
    
    recommendations.push({
      id: 'CVD-001',
      category: 'cvd',
      title: 'Red/Green Confusion Risk',
      description: `Red and green elements render too similarly under Deuteranopia (${Math.round(cvdDiff)} DeltaE).`,
      suggestedAction: 'Shift the green hue toward cyan/blue-green to increase visual separation for colorblind users.',
      targetColorHex: palette.semantic.success,
      suggestedHex: oklchToHex(suggestedGreenOklch),
    });
  }

  // Rule UI-001: Primary Button Hover Generator
  const primaryBrand = palette.primary[5] || '#3b82f6';
  const brandOklch = hexToOklch(primaryBrand);
  const hoverL = brandOklch.l > 0.5 ? brandOklch.l - 0.08 : brandOklch.l + 0.08;
  const hoverOklch: OKLCH = { ...brandOklch, l: hoverL };

  recommendations.push({
    id: 'UI-001',
    category: 'ui',
    title: 'Button Hover State Suggestion',
    description: 'Provide an interactive hover state colors modifier for buttons.',
    suggestedAction: 'Generate a matching hover swatch automatically by shifting base lightness.',
    targetColorHex: primaryBrand,
    suggestedHex: oklchToHex(hoverOklch),
  });

  return recommendations;
}
