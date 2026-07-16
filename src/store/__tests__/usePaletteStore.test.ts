import { describe, test, expect, beforeEach } from 'vitest';
import { usePaletteStore } from '../usePaletteStore';

describe('Zustand Palette Store', () => {
  beforeEach(() => {
    // Reset state before tests
    usePaletteStore.setState({
      seedColor: '#3b82f6',
      harmonyType: 'monochromatic',
      palette: [
        { hex: '#eff6ff', isLocked: false },
        { hex: '#dbeafe', isLocked: false },
        { hex: '#bfdbfe', isLocked: false },
        { hex: '#93c5fd', isLocked: false },
        { hex: '#60a5fa', isLocked: false },
        { hex: '#3b82f6', isLocked: false },
        { hex: '#2563eb', isLocked: false },
        { hex: '#1d4ed8', isLocked: false },
        { hex: '#1e40af', isLocked: false },
        { hex: '#1e3a8a', isLocked: false },
        { hex: '#172554', isLocked: false },
      ],
      scoreResult: null,
      recommendations: [],
    });
  });

  test('setSeedColor generates new palette and runs engines', () => {
    const store = usePaletteStore.getState();
    store.setSeedColor('#ef4444');
    
    const updatedState = usePaletteStore.getState();
    expect(updatedState.seedColor).toBe('#ef4444');
    expect(updatedState.scoreResult).not.toBeNull();
    expect(updatedState.scoreResult?.total).toBeGreaterThanOrEqual(0);
  });

  test('toggleLock prevents swatch modifications', () => {
    const store = usePaletteStore.getState();
    
    // Lock first element
    store.toggleLock(0);
    expect(usePaletteStore.getState().palette[0].isLocked).toBe(true);

    // Modify seed color, locked element should remain unchanged
    const lockedColorBefore = usePaletteStore.getState().palette[0].hex;
    store.setSeedColor('#ef4444');
    
    expect(usePaletteStore.getState().palette[0].hex).toBe(lockedColorBefore);
  });

  test('setHarmonyType shifts layout outputs', () => {
    const store = usePaletteStore.getState();
    store.setHarmonyType('complementary');
    
    const updatedState = usePaletteStore.getState();
    expect(updatedState.harmonyType).toBe('complementary');
    // Complementary rules return 2 colors
    expect(updatedState.palette.length).toBe(2);
  });
});
