import { describe, test, expect } from 'vitest';
import {
  getContrastRatio,
  getApcaContrast,
  getWcagGrade,
  getContrastMatrix
} from '../contrast';
import { simulateCVD, simulatePaletteCVD } from '../simulator';

describe('Contrast Calculations', () => {
  const white = '#ffffff';
  const black = '#000000';
  const blue = '#3b82f6';

  test('getContrastRatio outputs relative WCAG contrast ratio', () => {
    expect(getContrastRatio(white, black)).toBe(21);
    expect(getContrastRatio(white, white)).toBe(1);
    expect(getContrastRatio(blue, white)).toBeCloseTo(3.68, 1);
  });

  test('getApcaContrast outputs Lc values', () => {
    const contrast = getApcaContrast(white, black);
    // Light text on dark bg results in absolute value ~107.8
    expect(Math.abs(contrast)).toBeGreaterThan(100);
  });

  test('getWcagGrade grades ratios correctly', () => {
    expect(getWcagGrade(21, false)).toBe('AAA');
    expect(getWcagGrade(4.5, false)).toBe('AA');
    expect(getWcagGrade(2.0, false)).toBe('Fail');

    // Large text overrides
    expect(getWcagGrade(3.0, true)).toBe('AA Large');
    expect(getWcagGrade(4.5, true)).toBe('AAA');
  });

  test('getContrastMatrix builds full grids', () => {
    const colors = [white, black, blue];
    const matrix = getContrastMatrix(colors);
    expect(matrix.length).toBe(3);
    expect(matrix[0][0].wcagRatio).toBe(1);
    expect(matrix[0][1].wcagRatio).toBe(21);
  });
});

describe('Color Blindness Simulation', () => {
  const red = '#ef4444';
  const green = '#22c55e';
  const blue = '#3b82f6';

  test('simulateCVD transforms colors under Protanopia', () => {
    const simulated = simulateCVD(red, 'protanopia');
    expect(simulated).not.toBe(red);
  });

  test('simulateCVD converts to grayscale under Achromatopsia', () => {
    const grayRed = simulateCVD(red, 'achromatopsia');
    const rgb = hexToRgb(grayRed);
    // All RGB values must be identical in grayscale
    expect(rgb.r).toBeCloseTo(rgb.g, 2);
    expect(rgb.g).toBeCloseTo(rgb.b, 2);
  });

  test('simulatePaletteCVD batch processes palettes', () => {
    const colors = [red, green, blue];
    const simulated = simulatePaletteCVD(colors, 'deuteranopia');
    expect(simulated.length).toBe(3);
    expect(simulated[0]).not.toBe(red);
  });
});

// Helper for Achromatopsia test verification
import { hexToRgb } from '../../color/conversions';
