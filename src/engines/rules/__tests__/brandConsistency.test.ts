import { describe, test, expect } from 'vitest';
import { evaluateRules } from '../index';
import { SystemPalette } from '../../scoring';

describe('Brand Consistency Engine Rules', () => {
  test('detects hue drifts between seed brand color and S6 primary shade', () => {
    const sysPalette: SystemPalette = {
      primary: [
        '#eff6ff',
        '#dbeafe',
        '#bfdbfe',
        '#93c5fd',
        '#60a5fa',
        '#ef4444', // S6 is red (hue ~0)
        '#2563eb',
        '#1d4ed8',
        '#1e40af',
        '#1e3a8a',
        '#172554',
      ],
      neutrals: ['#09090b', '#18181b', '#f4f4f5'],
      semantic: {
        success: '#22c55e',
        warning: '#eab308',
        error: '#ef4444',
        info: '#3b82f6', // Seed is blue (hue ~220)
      },
    };

    const recs = evaluateRules(sysPalette);
    
    // We expect a BR-001 hue drift recommendation to be triggered
    const hasHueDrift = recs.some((r) => r.id === 'BR-001');
    expect(hasHueDrift).toBe(true);
  });
});
