import { describe, test, expect } from 'vitest';
import { usePaletteStore } from '../usePaletteStore';

describe('Collaboration Metadata & Importer Actions', () => {
  test('sets project collaboration metadata properties correctly', () => {
    const store = usePaletteStore.getState();
    
    store.setProjectName('New System V2');
    store.setProjectPurpose('Testing imports');
    store.setReviewStatus('In Review');
    store.setProjectNotes('Comments detailed');

    expect(usePaletteStore.getState().projectName).toBe('New System V2');
    expect(usePaletteStore.getState().projectPurpose).toBe('Testing imports');
    expect(usePaletteStore.getState().reviewStatus).toBe('In Review');
    expect(usePaletteStore.getState().projectNotes).toBe('Comments detailed');
  });

  test('importPaletteColors updates palette swatches correctly', () => {
    const store = usePaletteStore.getState();
    const importedHexes = [
      '#ff0000',
      '#00ff00',
      '#0000ff',
      '#ffffff',
      '#000000',
      '#888888',
      '#aaaaaa',
      '#bbbbbb',
      '#cccccc',
      '#dddddd',
      '#eeeeee',
    ];

    store.importPaletteColors(importedHexes);

    const activePalette = usePaletteStore.getState().palette.map((p) => p.hex.toLowerCase());
    expect(activePalette[0]).toBe('#ff0000');
    expect(activePalette[1]).toBe('#00ff00');
    expect(activePalette[10]).toBe('#eeeeee');
  });
});
