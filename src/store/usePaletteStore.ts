import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateScale, generateHarmony } from '@/engines/color/analysis';
import { calculateOverallScore, SystemPalette, ScoreResult } from '@/engines/scoring';
import { evaluateRules, Recommendation } from '@/engines/rules';
import { normalizeHex } from '@/engines/color/conversions';

export interface PaletteStore {
  // State
  seedColor: string;
  harmonyType: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'split-complementary';
  steps: number;
  palette: Array<{ hex: string; isLocked: boolean }>;
  theme: 'dark' | 'light';
  contrastStandard: 'aa' | 'aaa' | 'apca';
  
  // Processed engine outputs
  scoreResult: ScoreResult | null;
  recommendations: Recommendation[];
  
  // Actions
  setSeedColor: (color: string) => void;
  setHarmonyType: (type: PaletteStore['harmonyType']) => void;
  setSteps: (steps: number) => void;
  toggleLock: (index: number) => void;
  updateColor: (index: number, newHex: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setContrastStandard: (standard: 'aa' | 'aaa' | 'apca') => void;
  runEnginePipeline: () => void;
  applyRecommendation: (rec: Recommendation) => void;
}

function generatePaletteColors(
  seed: string,
  type: PaletteStore['harmonyType'],
  existingPalette: Array<{ hex: string; isLocked: boolean }>
): Array<{ hex: string; isLocked: boolean }> {
  let hexes: string[] = [];
  if (type === 'monochromatic') {
    hexes = generateScale(seed).map((n) => n.hex);
  } else {
    hexes = generateHarmony(seed, type);
  }

  return hexes.map((hex, i) => {
    if (existingPalette[i] && existingPalette[i].isLocked) {
      return existingPalette[i];
    }
    return { hex, isLocked: false };
  });
}

export const usePaletteStore = create<PaletteStore>()(
  persist(
    (set, get) => ({
      seedColor: '#3b82f6',
      harmonyType: 'monochromatic',
      steps: 11,
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
      theme: 'dark',
      contrastStandard: 'aa',
      scoreResult: null,
      recommendations: [],

      runEnginePipeline: () => {
        const { palette, harmonyType, seedColor } = get();
        const colorsList = palette.map((p) => p.hex);

        // Map system palette keys for scoring calculations
        const sysPalette: SystemPalette = {
          primary: colorsList,
          neutrals: [
            '#09090b', // fallback dark bg
            '#18181b', // surface
            '#f4f4f5', // body text
          ],
          semantic: {
            success: colorsList[2] || '#22c55e',
            warning: colorsList[4] || '#eab308',
            error: colorsList[8] || '#ef4444',
            info: seedColor,
          },
          harmonyType,
        };

        const scoreResult = calculateOverallScore(sysPalette);
        const recommendations = evaluateRules(sysPalette);

        set({ scoreResult, recommendations });
      },

      setSeedColor: (color) => {
        try {
          const cleanHex = normalizeHex(color);
          const newPalette = generatePaletteColors(cleanHex, get().harmonyType, get().palette);
          set({ seedColor: cleanHex, palette: newPalette });
          get().runEnginePipeline();
        } catch {
          // Invalid hex input - don't crash store, let validator catch it in form input
        }
      },

      setHarmonyType: (type) => {
        const newPalette = generatePaletteColors(get().seedColor, type, get().palette);
        set({ harmonyType: type, palette: newPalette });
        get().runEnginePipeline();
      },

      setSteps: (steps) => set({ steps }),

      toggleLock: (index) => {
        const newPalette = [...get().palette];
        if (newPalette[index]) {
          newPalette[index].isLocked = !newPalette[index].isLocked;
          set({ palette: newPalette });
        }
      },

      updateColor: (index, newHex) => {
        try {
          const cleanHex = normalizeHex(newHex);
          const newPalette = [...get().palette];
          if (newPalette[index]) {
            newPalette[index].hex = cleanHex;
            set({ palette: newPalette });
            get().runEnginePipeline();
          }
        } catch {
          // Ignore intermediate typing transitions
        }
      },

      setTheme: (theme) => set({ theme }),
      setContrastStandard: (standard) => set({ contrastStandard: standard }),

      applyRecommendation: (rec) => {
        // 1. If target matches seedColor
        if (get().seedColor.toLowerCase() === rec.targetColorHex.toLowerCase()) {
          get().setSeedColor(rec.suggestedHex);
          return;
        }

        // 2. Or search inside palette
        const index = get().palette.findIndex(
          (p) => p.hex.toLowerCase() === rec.targetColorHex.toLowerCase()
        );
        if (index !== -1) {
          get().updateColor(index, rec.suggestedHex);
        }
      },
    }),
    {
      name: 'paletteos-store-v1',
      partialize: (state) => ({
        seedColor: state.seedColor,
        harmonyType: state.harmonyType,
        steps: state.steps,
        palette: state.palette,
        theme: state.theme,
        contrastStandard: state.contrastStandard,
      }),
    }
  )
);
