import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateScale, generateHarmony } from '@/engines/color/analysis';
import { calculateOverallScore, SystemPalette, ScoreResult } from '@/engines/scoring';
import { evaluateRules, Recommendation } from '@/engines/rules';
import { normalizeHex } from '@/engines/color/conversions';

export interface Checkpoint {
  id: string;
  timestamp: string;
  seedColor: string;
  palette: Array<{ hex: string; isLocked: boolean }>;
  score: number;
}

export interface PaletteStore {
  // State
  seedColor: string;
  harmonyType: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'split-complementary';
  steps: number;
  palette: Array<{ hex: string; isLocked: boolean }>;
  theme: 'dark' | 'light';
  contrastStandard: 'aa' | 'aaa' | 'apca';
  history: Checkpoint[];
  projectName: string;
  projectPurpose: string;
  reviewStatus: 'Draft' | 'In Review' | 'Approved';
  projectNotes: string;
  
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
  applyRecommendationFix: (rec: Recommendation) => void;
  saveCheckpoint: () => void;
  rollbackToCheckpoint: (id: string) => void;
  setProjectName: (name: string) => void;
  setProjectPurpose: (purpose: string) => void;
  setReviewStatus: (status: 'Draft' | 'In Review' | 'Approved') => void;
  setProjectNotes: (notes: string) => void;
  importPaletteColors: (colors: string[]) => void;
  loadDemoPalette: () => void;
  runEnginePipeline: () => void;
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
      history: [],
      projectName: 'Default Workspace Project',
      projectPurpose: 'Design System palette definitions and compliance checker.',
      reviewStatus: 'Draft',
      projectNotes: 'Initial sandbox palette loaded.',
      scoreResult: null,
      recommendations: [],

      runEnginePipeline: () => {
        const { palette, harmonyType, seedColor, theme } = get();
        const colorsList = palette.map((p) => p.hex);

        // Map system palette keys dynamically based on active theme
        const sysPalette: SystemPalette = {
          primary: colorsList,
          neutrals:
            theme === 'dark'
              ? ['#09090b', '#18181b', '#f4f4f5'] // bg, surface, text
              : ['#f9f9fb', '#ffffff', '#18181b'],
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

      setTheme: (theme) => {
        set({ theme });
        get().runEnginePipeline();
      },

      setContrastStandard: (standard) => {
        set({ contrastStandard: standard });
        get().runEnginePipeline();
      },

      applyRecommendationFix: (rec) => {
        const { palette, updateColor } = get();
        const colorsList = palette.map((p) => p.hex.toLowerCase());
        const targetHex = rec.targetColorHex.toLowerCase();
        
        // Find if target color matches any swatch in palette
        const index = colorsList.indexOf(targetHex);
        if (index >= 0) {
          updateColor(index, rec.suggestedHex);
        }
      },

      saveCheckpoint: () => {
        const { palette, seedColor, scoreResult, history } = get();
        const newCheckpoint: Checkpoint = {
          id: `chk-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          seedColor,
          palette: JSON.parse(JSON.stringify(palette)),
          score: scoreResult?.total ?? 100,
        };
        set({ history: [newCheckpoint, ...history] });
      },

      rollbackToCheckpoint: (id) => {
        const checkpoint = get().history.find((h) => h.id === id);
        if (checkpoint) {
          set({
            seedColor: checkpoint.seedColor,
            palette: JSON.parse(JSON.stringify(checkpoint.palette)),
          });
          get().runEnginePipeline();
        }
      },

      setProjectName: (projectName) => set({ projectName }),
      setProjectPurpose: (projectPurpose) => set({ projectPurpose }),
      setReviewStatus: (reviewStatus) => set({ reviewStatus }),
      setProjectNotes: (projectNotes) => set({ projectNotes }),
      
      importPaletteColors: (colors) => {
        const newPalette = colors.map((hex, i) => {
          const isLocked = get().palette[i]?.isLocked ?? false;
          return { hex: normalizeHex(hex), isLocked };
        });
        
        while (newPalette.length < 11) {
          const backfillIdx = newPalette.length;
          newPalette.push(get().palette[backfillIdx] || { hex: '#3b82f6', isLocked: false });
        }

        const finalPalette = newPalette.slice(0, 11);
        set({ palette: finalPalette, seedColor: finalPalette[5]?.hex || finalPalette[0].hex });
        get().runEnginePipeline();
      },

      loadDemoPalette: () => {
        const demoSeed = '#8cd3ff'; // low-contrast light blue seed color
        const newPalette = generatePaletteColors(demoSeed, 'monochromatic', []);
        set({
          seedColor: demoSeed,
          harmonyType: 'monochromatic',
          palette: newPalette,
          projectName: 'Demo Color system',
          projectPurpose: 'Demonstrate WCAG AA contrast failures and auto-fix rules.',
          reviewStatus: 'Draft',
        });
        get().runEnginePipeline();
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
        history: state.history,
        projectName: state.projectName,
        projectPurpose: state.projectPurpose,
        reviewStatus: state.reviewStatus,
        projectNotes: state.projectNotes,
      }),
    }
  )
);
