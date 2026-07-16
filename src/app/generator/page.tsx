'use client';

import { useEffect, useState } from 'react';
import WorkspaceTabs from '@/components/WorkspaceTabs';
import { usePaletteStore } from '@/store/usePaletteStore';
import { useHydration } from '@/hooks/useHydration';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock, Unlock, Eye, RefreshCw, Upload } from 'lucide-react';
import { hexToOklch } from '@/engines/color/conversions';
import { extractDominantColors } from '@/engines/image/extractor';

export default function GeneratorPage() {
  const hydrated = useHydration();
  const {
    seedColor,
    harmonyType,
    palette,
    setSeedColor,
    setHarmonyType,
    toggleLock,
    updateColor,
    runEnginePipeline,
  } = usePaletteStore();

  const [hexInput, setHexInput] = useState(seedColor);
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    if (hydrated) {
      setHexInput(seedColor);
    }
  }, [hydrated, seedColor]);

  useEffect(() => {
    runEnginePipeline();
  }, [runEnginePipeline]);

  const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHexInput(e.target.value);
    setSeedColor(e.target.value);
  };

  const randomizePalette = () => {
    // Generate a random hex color code
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setHexInput(randomHex);
    setSeedColor(randomHex);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    try {
      const colors = await extractDominantColors(file);
      setExtractedColors(colors);
      if (colors[0]) {
        setHexInput(colors[0]);
        setSeedColor(colors[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExtracting(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="flex-1 flex flex-col bg-sys-bg">
        <WorkspaceTabs />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-zinc-500 font-mono text-sm animate-pulse">Loading Workspace...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-sys-bg">
      <WorkspaceTabs />

      <div className="flex-1 grid md:grid-cols-[280px_1fr] overflow-hidden">
        {/* Left Side Controls Panel */}
        <aside className="border-r border-zinc-800 bg-zinc-950 p-6 space-y-6 flex flex-col overflow-y-auto">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Seed Brand Color
            </label>
            <div className="flex gap-2">
              <Input
                value={hexInput}
                onChange={handleSeedChange}
                placeholder="#3B82F6"
                className="font-mono text-center uppercase"
                maxLength={7}
              />
              <button
                onClick={randomizePalette}
                className="h-10 w-10 border border-zinc-800 hover:bg-zinc-900 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-100 cursor-pointer focus-ring"
                title="Randomize Seed"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Color Harmony Rule
            </label>
            <select
              value={harmonyType}
              onChange={(e) => setHarmonyType(e.target.value as any)}
              className="w-full h-10 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm text-zinc-100 focus-ring cursor-pointer"
            >
              <option value="monochromatic">Monochromatic (Tailwind)</option>
              <option value="analogous">Analogous</option>
              <option value="complementary">Complementary</option>
              <option value="triadic">Triadic</option>
              <option value="split-complementary">Split Complementary</option>
            </select>
          </div>

          {/* Image Analyzer Dropzone */}
          <div className="space-y-2 border-t border-zinc-800 pt-6">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Extract from Image
            </label>
            <div className="relative group border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-900/10 rounded-md p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors">
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={isExtracting}
              />
              <Upload className="h-5 w-5 text-zinc-500 group-hover:text-zinc-300 mb-1" />
              <span className="text-[10px] text-zinc-400">
                {isExtracting ? 'Analyzing...' : 'Drop image or click'}
              </span>
            </div>

            {extractedColors.length > 0 && (
              <div className="space-y-2 pt-4">
                <span className="text-[10px] uppercase font-bold text-zinc-500">
                  Extracted Swatches
                </span>
                <div className="flex flex-wrap gap-2">
                  {extractedColors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setHexInput(color);
                        setSeedColor(color);
                      }}
                      className="h-6 w-6 rounded-full border border-black/20 focus-ring cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={`Set seed to ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto p-4 rounded-lg border border-zinc-800 bg-zinc-900/40 text-xs text-zinc-400 leading-relaxed">
            <p className="font-semibold text-zinc-300 mb-1">Sandbox Guidance</p>
            Lock swatches to preserve them. Drag values or type hex overrides to modify shades dynamically.
          </div>
        </aside>

        {/* Main Swatch Workspace Canvas */}
        <main className="p-8 flex flex-col justify-center items-center overflow-y-auto">
          <div className="w-full max-w-4xl grid gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-zinc-100">
                Workspace Swatches
              </h2>
              <span className="text-xs text-zinc-500 font-mono">
                OKLCH Lightness scale verified
              </span>
            </div>

            <div className="grid gap-3.5">
              {palette.map((swatch, index) => {
                let oklchStr = '';
                try {
                  const oklch = hexToOklch(swatch.hex);
                  oklchStr = `L:${Math.round(oklch.l * 100)}% C:${Math.round(oklch.c * 100)} H:${Math.round(oklch.h)}`;
                } catch {
                  oklchStr = 'OKLCH: Error';
                }

                return (
                  <div
                    key={index}
                    className="group flex items-center justify-between p-4 rounded-lg border border-zinc-800/80 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all select-none"
                  >
                    <div className="flex items-center gap-4">
                      {/* Swatch Indicator Color Block */}
                      <div
                        className="h-10 w-16 rounded-md shadow-inner border border-black/10 group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <div>
                        <div className="font-mono text-zinc-100 uppercase text-sm font-semibold flex items-center gap-2">
                          {swatch.hex}
                        </div>
                        <div className="text-xs text-zinc-500 font-mono mt-0.5">
                          {oklchStr}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Swatch hex direct editing input overlay */}
                      <Input
                        value={swatch.hex}
                        onChange={(e) => updateColor(index, e.target.value)}
                        className="w-24 font-mono text-center h-8 text-xs uppercase"
                        maxLength={7}
                      />

                      <button
                        onClick={() => toggleLock(index)}
                        className="h-8 w-8 rounded-md flex items-center justify-center border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer focus-ring"
                      >
                        {swatch.isLocked ? (
                          <Lock className="h-3.5 w-3.5 text-amber-500" />
                        ) : (
                          <Unlock className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
