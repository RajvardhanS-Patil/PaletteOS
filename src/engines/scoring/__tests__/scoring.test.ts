import { describe, test, expect } from 'vitest';
import { calculateOverallScore, SystemPalette } from '../index';
import { generateScale } from '../../color/analysis';

describe('Scoring Engine', () => {
  const purePrimaryScale = Array(11).fill('#3b82f6');

  const mockPalette: SystemPalette = {
    primary: purePrimaryScale,
    neutrals: [
      '#09090b', // dark bg
      '#18181b', // surface
      '#f4f4f5', // text
    ],
    semantic: {
      success: '#22c55e',
      warning: '#eab308',
      error: '#ef4444',
      info: '#3b82f6',
    },
    harmonyType: 'monochromatic',
  };

  test('calculateOverallScore returns a structured result', () => {
    const result = calculateOverallScore(mockPalette);
    expect(result.total).toBeGreaterThanOrEqual(0);
    expect(result.total).toBeLessThanOrEqual(100);
    expect(result.contrast).toBeGreaterThanOrEqual(0);
    expect(result.harmony).toBe(100); // monochromatic blue should pass
  });

  test('calculateOverallScore applies penalties on low contrast', () => {
    const poorPalette: SystemPalette = {
      ...mockPalette,
      neutrals: [
        '#000000', // black bg
        '#111111',
        '#111111', // black text (contrast 1:1)
      ],
    };
    const result = calculateOverallScore(poorPalette);
    expect(result.contrast).toBeLessThan(50);
    expect(result.deductions.length).toBeGreaterThan(0);
  });
});
