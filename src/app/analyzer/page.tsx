'use client';

import { useEffect, useState } from 'react';
import WorkspaceTabs from '@/components/WorkspaceTabs';
import { usePaletteStore } from '@/store/usePaletteStore';
import { useHydration } from '@/hooks/useHydration';
import { getContrastMatrix, ContrastMatrixNode } from '@/engines/accessibility/contrast';
import { simulatePaletteCVD, CVDType } from '@/engines/accessibility/simulator';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';

export default function AnalyzerPage() {
  const hydrated = useHydration();
  const { palette, scoreResult, recommendations, applyRecommendationFix, runEnginePipeline } = usePaletteStore();
  const [cvdMode, setCvdMode] = useState<CVDType | 'none'>('none');
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    if (hydrated) {
      setColors(palette.map((p) => p.hex));
    }
  }, [hydrated, palette]);

  useEffect(() => {
    runEnginePipeline();
  }, [runEnginePipeline]);

  useEffect(() => {
    if (!hydrated) return;
    const rawColors = palette.map((p) => p.hex);
    if (cvdMode === 'none') {
      setColors(rawColors);
    } else {
      setColors(simulatePaletteCVD(rawColors, cvdMode));
    }
  }, [hydrated, palette, cvdMode]);

  if (!hydrated) {
    return (
      <div className="flex-1 flex flex-col bg-sys-bg">
        <WorkspaceTabs />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-zinc-500 font-mono text-sm animate-pulse">Loading Analyzer...</div>
        </div>
      </div>
    );
  }

  const matrix = getContrastMatrix(colors);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 70) return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    return 'text-red-400 border-red-500/20 bg-red-500/5';
  };

  return (
    <div className="flex-1 flex flex-col bg-sys-bg">
      <WorkspaceTabs />

      <main className="flex-1 p-8 space-y-8 max-w-7xl w-full mx-auto overflow-y-auto">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 select-none">
          Accessibility Compliance Dashboard
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Global Score Card */}
          <Card className="border-zinc-800 bg-zinc-950 flex flex-col justify-between select-none">
            <CardHeader>
              <CardTitle>Palette Health Score</CardTitle>
              <CardDescription>
                Algorithmic evaluation scoring contrast, CVD safety, and harmonies.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-6">
              <div
                className={`h-32 w-32 rounded-full border-4 flex items-center justify-center text-4xl font-bold ${getScoreColor(
                  scoreResult?.total ?? 0
                )}`}
              >
                {scoreResult?.total ?? 0}
              </div>
              <div className="mt-4 flex gap-1.5 items-center text-sm font-semibold">
                {scoreResult && scoreResult.total >= 90 ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400">Excellent AA/AAA Grade</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-amber-500 animate-pulse" />
                    <span className="text-amber-500 font-bold">Remediation Suggested</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations / Deductions */}
          <Card className="md:col-span-2 border-zinc-800 bg-zinc-950">
            <CardHeader className="select-none">
              <CardTitle>Intelligent Recommendations</CardTitle>
              <CardDescription>
                Deterministic rule engine auditing checks and suggesting fixes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[220px] overflow-y-auto pr-2">
              {recommendations.length === 0 ? (
                <div className="flex items-center gap-3 text-sm text-zinc-400 py-6 select-none">
                  <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  Your color palette is mathematically robust under all evaluation parameters.
                </div>
              ) : (
                recommendations.map((rec) => {
                  const canFix = palette.some(
                    (p) => p.hex.toLowerCase() === rec.targetColorHex.toLowerCase()
                  );
                  return (
                    <div
                      key={rec.id}
                      className="p-3.5 rounded-md border border-zinc-800 bg-zinc-900/40 text-xs flex justify-between items-center gap-4"
                    >
                      <div>
                        <div className="font-semibold text-zinc-300 flex items-center gap-1.5 select-none">
                          <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                          {rec.title}
                        </div>
                        <div className="text-zinc-500 mt-1 select-none">{rec.description}</div>
                      </div>
                      
                      {rec.suggestedHex && (
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex flex-col items-center gap-1 bg-zinc-950 p-2 rounded border border-zinc-800">
                            <span className="text-[9px] text-zinc-500 uppercase font-mono">Shift Fix</span>
                            <div className="flex items-center gap-1.5">
                              <div
                                className="h-3.5 w-3.5 rounded-full border border-black/20"
                                style={{ backgroundColor: rec.targetColorHex }}
                                title={`Original: ${rec.targetColorHex}`}
                              />
                              <span className="text-zinc-500">→</span>
                              <div
                                className="h-3.5 w-3.5 rounded-full border border-black/20"
                                style={{ backgroundColor: rec.suggestedHex }}
                                title={`Suggested: ${rec.suggestedHex}`}
                              />
                            </div>
                            {canFix && (
                              <button
                                onClick={() => applyRecommendationFix(rec)}
                                className="mt-1 text-[9px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded cursor-pointer font-bold transition-colors"
                              >
                                Apply Fix
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contrast Grid Section */}
        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Luminance Contrast Matrix</CardTitle>
              <CardDescription>
                Verifying foreground (vertical) against background (horizontal) WCAG values.
              </CardDescription>
            </div>

            {/* CVD Toggle Selector */}
            <select
              value={cvdMode}
              onChange={(e) => setCvdMode(e.target.value as any)}
              className="h-8 rounded border border-zinc-800 bg-zinc-900 text-xs px-2 cursor-pointer focus-ring text-zinc-300"
            >
              <option value="none">Standard sRGB Vision</option>
              <option value="protanopia">Protanopia (Red-Blind)</option>
              <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
              <option value="tritanopia">Tritanopia (Blue-Blind)</option>
              <option value="achromatopsia">Achromatopsia (Total-Blind)</option>
            </select>
          </CardHeader>

          <CardContent className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border border-zinc-800 text-zinc-500 text-xs font-mono">
                    FG \ BG
                  </th>
                  {colors.map((c, i) => (
                    <th
                      key={i}
                      className="p-2 border border-zinc-800 text-xs font-mono font-semibold"
                      style={{ color: c }}
                    >
                      S{i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td
                      className="p-2 border border-zinc-800 text-xs font-mono font-semibold text-left"
                      style={{ color: colors[rIdx] }}
                    >
                      S{rIdx + 1}
                    </td>
                    {row.map((cell, cIdx) => {
                      const isFail = cell.wcagRatio < 3.0;
                      return (
                        <td
                          key={cIdx}
                          className={`p-2.5 border border-zinc-800 text-xs font-mono transition-colors ${
                            isFail ? 'bg-red-950/20 text-red-400 font-semibold' : 'text-zinc-300'
                          }`}
                          title={`${cell.foreground} on ${cell.background}`}
                        >
                          {cell.wcagRatio}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
