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

  // Rule CR-002: Primary Brand Accent Contrast
  const primaryBrand = palette.primary[5] || '#3b82f6';
  const primaryBgRatio = getContrastRatio(primaryBrand, bodyBg);

  if (primaryBgRatio < 4.5) {
    const suggestedBrand = findSafeLightness(primaryBrand, bodyBg, 4.5);
    recommendations.push({
      id: 'CR-002',
      category: 'contrast',
      title: 'Failing Accent Brand Contrast',
      description: `Primary Brand Accent (S6) contrast against background is failing (${primaryBgRatio}:1). Minimum WCAG AA compliance requires at least 4.5:1.`,
      suggestedAction: 'Shift base brand lightness in OKLCH to reach compliant contrast.',
      targetColorHex: primaryBrand,
      suggestedHex: suggestedBrand,
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
  const hoverBrand = palette.primary[5] || '#3b82f6';
  const brandOklch = hexToOklch(hoverBrand);
  const hoverL = brandOklch.l > 0.5 ? brandOklch.l - 0.08 : brandOklch.l + 0.08;
  const hoverOklch: OKLCH = { ...brandOklch, l: hoverL };

  recommendations.push({
    id: 'UI-001',
    category: 'ui',
    title: 'Button Hover State Suggestion',
    description: 'Provide an interactive hover state colors modifier for buttons.',
    suggestedAction: 'Generate a matching hover swatch automatically by shifting base lightness.',
    targetColorHex: hoverBrand,
    suggestedHex: oklchToHex(hoverOklch),
  });

  // Rule UI-002: Focus Ring Contrast
  const focusRatio = getContrastRatio(hoverBrand, bodyBg);
  if (focusRatio < 3.0) {
    const suggestedFocus = findSafeLightness(hoverBrand, bodyBg, 3.0);
    recommendations.push({
      id: 'UI-002',
      category: 'ui',
      title: 'Focus Ring Low Visibility',
      description: `Interactive focus ring state outline has insufficient contrast (${focusRatio}:1) against background. Target ratio is at least 3.0:1.`,
      suggestedAction: 'Shift outline lightness in OKLCH to reach visible focus ring.',
      targetColorHex: hoverBrand,
      suggestedHex: suggestedFocus,
    });
  }

  // Rule UI-003: Disabled Component Contrast
  const disabledText = palette.primary[1] || '#dbeafe';
  const disabledBg = palette.primary[0] || '#eff6ff';
  const disabledRatio = getContrastRatio(disabledText, disabledBg);
  if (disabledRatio < 1.3 || disabledRatio > 2.5) {
    const suggestedDisabledText = findSafeLightness(disabledText, disabledBg, 1.8);
    recommendations.push({
      id: 'UI-003',
      category: 'ui',
      title: 'Disabled State Incoherent Contrast',
      description: `Disabled text-bg ratio is ${disabledRatio}:1. Target ratio is approximately 1.8:1 for visible but inactive indicators.`,
      suggestedAction: 'Adjust disabled text lightness value to balance inactive clarity.',
      targetColorHex: disabledText,
      suggestedHex: suggestedDisabledText,
    });
  }

  // Rule BR-001: Brand Hue Drift Check
  const seedOklch = hexToOklch(palette.semantic.info);
  const generatedOklch = hexToOklch(hoverBrand);
  const hueDiff = Math.abs(seedOklch.h - generatedOklch.h);
  const shortestHueDiff = hueDiff > 180 ? 360 - hueDiff : hueDiff;
  if (shortestHueDiff > 5.0) {
    recommendations.push({
      id: 'BR-001',
      category: 'harmony',
      title: 'Brand Hue Drift Warning',
      description: `Primary brand shade S6 hue deviates by ${Math.round(shortestHueDiff)}° from seed color input. Preserving hue is key to brand consistency.`,
      suggestedAction: 'Lock S6 or align lightness curve to maintain target brand hue.',
      targetColorHex: hoverBrand,
      suggestedHex: oklchToHex({ ...generatedOklch, h: seedOklch.h }),
    });
  }

  return recommendations;
}
