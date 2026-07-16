import { describe, test, expect } from 'vitest';
import {
  normalizeHex,
  hexToRgb,
  hexToOklch,
  hexToHsl,
  rgbToHex,
  oklchToHex,
  hslToHex,
  rgbToOklch,
  oklchToRgb,
  rgbToHsv,
  hsvToRgb,
  hexToLab,
  labToHex,
  hexToLch,
  lchToHex,
  hexToXyz,
  xyzToHex
} from '../conversions';
import {
  getLuminance,
  getDeltaE,
  getColorTemperature,
  generateScale,
  generateHarmony
} from '../analysis';

describe('Color Conversions', () => {
  const blueHex = '#3b82f6';
  const whiteHex = '#ffffff';
  const blackHex = '#000000';

  test('normalizeHex should return valid hex', () => {
    expect(normalizeHex('blue')).toBe('#0000ff');
    expect(normalizeHex('#3b82f6')).toBe('#3b82f6');
  });

  test('HEX <-> RGB reversibility', () => {
    const rgbVal = hexToRgb(blueHex);
    expect(rgbToHex(rgbVal)).toBe(blueHex);
  });

  test('HEX <-> OKLCH conversions', () => {
    const oklchVal = hexToOklch(blueHex);
    expect(oklchVal.l).toBeGreaterThan(0);
    expect(oklchToHex(oklchVal)).toBe(blueHex);
  });

  test('HEX <-> HSL conversions', () => {
    const hslVal = hexToHsl(blueHex);
    expect(hslToHex(hslVal)).toBe(blueHex);
  });

  test('RGB <-> HSV conversions', () => {
    const rgbVal = hexToRgb(blueHex);
    const hsvVal = rgbToHsv(rgbVal);
    const backToRgb = hsvToRgb(hsvVal);
    expect(backToRgb.r).toBeCloseTo(rgbVal.r, 3);
    expect(backToRgb.g).toBeCloseTo(rgbVal.g, 3);
    expect(backToRgb.b).toBeCloseTo(rgbVal.b, 3);
  });

  test('LAB and LCH conversions', () => {
    const labVal = hexToLab(blueHex);
    expect(labToHex(labVal)).toBe(blueHex);

    const lchVal = hexToLch(blueHex);
    expect(lchToHex(lchVal)).toBe(blueHex);
  });

  test('XYZ conversions', () => {
    const xyzVal = hexToXyz(blueHex);
    expect(xyzToHex(xyzVal)).toBe(blueHex);
  });
});

describe('Color Analysis', () => {
  const white = '#ffffff';
  const black = '#000000';
  const red = '#ef4444';
  const blue = '#3b82f6';

  test('getLuminance calculates relative luminance', () => {
    expect(getLuminance(white)).toBe(1.0);
    expect(getLuminance(black)).toBe(0.0);
    expect(getLuminance(blue)).toBeGreaterThan(0.0);
    expect(getLuminance(blue)).toBeLessThan(1.0);
  });

  test('getDeltaE checks color difference', () => {
    const diff = getDeltaE(white, black);
    expect(diff).toBeGreaterThan(50);
  });

  test('getColorTemperature checks temperature values', () => {
    expect(getColorTemperature(red)).toBe('warm');
    expect(getColorTemperature(blue)).toBe('cool');
  });

  test('generateScale outputs 11 shades', () => {
    const scale = generateScale(blue);
    expect(scale.length).toBe(11);
    expect(scale[0].weight).toBe(50);
    expect(scale[10].weight).toBe(950);
  });

  test('generateHarmony builds harmony arrays', () => {
    const comp = generateHarmony(blue, 'complementary');
    expect(comp.length).toBe(2);
    expect(comp[0]).toBe(blue);

    const tri = generateHarmony(blue, 'triadic');
    expect(tri.length).toBe(3);
  });
});
