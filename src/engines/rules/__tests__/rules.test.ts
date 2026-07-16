import { describe, test, expect } from 'vitest';
import { evaluateRules } from '../index';
import { SystemPalette } from '../../scoring';

describe('Rules Engine', () => {
  const mockPalette: SystemPalette = {
    primary: [
      '#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa',
      '#3b82f6', // 500 base
      '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a', '#172554'
    ],
    neutrals: [
      '#09090b', // dark bg
      '#18181b', // surface
      '#f4f4f5'  // text
    ],
    semantic: {
      success: '#22c55e', // green
      warning: '#eab308',
      error: '#ef4444',   // red
      info: '#3b82f6'
    }
  };

  test('evaluateRules checks contrast, cvd, and ui rules', () => {
    const recommendations = evaluateRules(mockPalette);
    expect(recommendations.length).toBeGreaterThan(0);
    
    // Hover rule (UI-001) should always be evaluated
    const hoverRec = recommendations.find(r => r.id === 'UI-001');
    expect(hoverRec).toBeDefined();
    expect(hoverRec?.category).toBe('ui');
  });

  test('evaluateRules catches poor contrast and recommends a fix', () => {
    const poorPalette: SystemPalette = {
      ...mockPalette,
      neutrals: [
        '#000000',
        '#111111',
        '#222222' // very dark text on dark bg (contrast < 4.5)
      ]
    };

    const recommendations = evaluateRules(poorPalette);
    const contrastRec = recommendations.find(r => r.id === 'CR-001');
    expect(contrastRec).toBeDefined();
    // Suggested color should be lighter (since bg is dark #000000)
    expect(contrastRec?.suggestedHex).not.toBe('#222222');
  });
});
