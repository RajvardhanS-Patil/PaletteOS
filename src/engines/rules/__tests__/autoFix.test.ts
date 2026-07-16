import { describe, test, expect, vi } from 'vitest';
import { usePaletteStore } from '@/store/usePaletteStore';

describe('Auto-Fix Engine Store Integration', () => {
  test('applyRecommendationFix updates target swatch color in store state', () => {
    const store = usePaletteStore.getState();
    
    // Set seed and run setup pipeline to initialize standard swatches
    store.setSeedColor('#3b82f6');
    const originalSwatch = usePaletteStore.getState().palette[5].hex; // Brand S6

    // Create a mock recommendation targeting that color swatch
    const mockRec = {
      id: 'CR-002',
      category: 'contrast' as const,
      title: 'Failing Accent Brand Contrast',
      description: 'Primary Accent contrast is failing.',
      suggestedAction: 'Shift base brand lightness.',
      targetColorHex: originalSwatch,
      suggestedHex: '#1e40af', // darker blue
    };

    // Apply auto-fix
    usePaletteStore.getState().applyRecommendationFix(mockRec);

    // Verify swatch updated to suggestedHex
    const updatedSwatch = usePaletteStore.getState().palette[5].hex;
    expect(updatedSwatch.toLowerCase()).toBe('#1e40af');
  });
});
