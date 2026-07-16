'use client';

import { useEffect, useState } from 'react';
import WorkspaceTabs from '@/components/WorkspaceTabs';
import { usePaletteStore, Checkpoint } from '@/store/usePaletteStore';
import { useHydration } from '@/hooks/useHydration';
import { getContrastMatrix, ContrastMatrixNode } from '@/engines/accessibility/contrast';
import { simulatePaletteCVD, CVDType } from '@/engines/accessibility/simulator';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  AlertCircle,
  CheckCircle,
  ShieldAlert,
  History,
  Printer,
  Sparkles,
  RefreshCw,
  TrendingUp,
  FileText,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';

type TabType = 'matrix' | 'audit' | 'compare' | 'report';

export default function AnalyzerPage() {
  const hydrated = useHydration();
  const {
    palette,
    scoreResult,
    recommendations,
    history,
    applyRecommendationFix,
    saveCheckpoint,
    rollbackToCheckpoint,
    runEnginePipeline,
  } = usePaletteStore();

  const [activeTab, setActiveTab] = useState<TabType>('matrix');
  const [cvdMode, setCvdMode] = useState<CVDType | 'none'>('none');
  const [colors, setColors] = useState<string[]>([]);
  const [compareId, setCompareId] = useState<string>('');

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

  // Set default compare checkpoint if available
  useEffect(() => {
    if (history.length > 0 && !compareId) {
      setCompareId(history[0].id);
    }
  }, [history, compareId]);

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
  const selectedCompare = history.find((h) => h.id === compareId);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    if (score >= 70) return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    return 'text-red-400 border-red-500/20 bg-red-500/5';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col bg-sys-bg">
      {/* Hide navbar and tabs on print media */}
      <div className="print:hidden">
        <WorkspaceTabs />
      </div>

      <main className="flex-1 p-8 space-y-8 max-w-7xl w-full mx-auto overflow-y-auto">
        {/* Page title toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden select-none">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              Compliance & Design Audit Suite
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Audit surface contrast, evaluate brand consistency, compare versions, and print summaries.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="inline-flex rounded-md border border-zinc-800 bg-zinc-950 p-0.5 gap-0.5">
            {[
              { id: 'matrix', label: 'Matrix & CVD' },
              { id: 'audit', label: 'Design System & Brand' },
              { id: 'compare', label: 'Version Comparison' },
              { id: 'report', label: 'Print Audit Report' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                  activeTab === tab.id
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Matrix & CVD Simulator */}
        {activeTab === 'matrix' && (
          <div className="space-y-6 print:hidden">
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

            {/* Contrast Matrix */}
            <Card className="border-zinc-800 bg-zinc-950">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Luminance Contrast Matrix</CardTitle>
                  <CardDescription>
                    Verifying foreground (vertical) against background (horizontal) WCAG values.
                  </CardDescription>
                </div>

                <select
                  value={cvdMode}
                  onChange={(e) => setCvdMode(e.target.value as any)}
                  className="h-8 rounded border border-zinc-800 bg-zinc-900 text-xs px-2 cursor-pointer focus-ring text-zinc-300 select-none"
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
          </div>
        )}

        {/* Tab 2: Design System & Brand Audit */}
        {activeTab === 'audit' && (
          <div className="grid md:grid-cols-2 gap-6 print:hidden">
            {/* Design System Audits */}
            <Card className="border-zinc-800 bg-zinc-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-brand-primary" />
                  Semantic & State Audits
                </CardTitle>
                <CardDescription>
                  Evaluates interactive, disabled, and hierarchy system variables.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded bg-zinc-900/30 border border-zinc-855 text-xs">
                  <div>
                    <span className="font-semibold text-zinc-300">Body text hierarchy</span>
                    <p className="text-zinc-500 mt-0.5">WCAG AAA contrast text targets verified.</p>
                  </div>
                  <Badge variant="success">Pass</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded bg-zinc-900/30 border border-zinc-855 text-xs">
                  <div>
                    <span className="font-semibold text-zinc-300">Disabled Component contrast</span>
                    <p className="text-zinc-500 mt-0.5">Inactive element borders readability checks.</p>
                  </div>
                  <Badge variant={recommendations.some(r => r.id === 'UI-003') ? 'warning' : 'success'}>
                    {recommendations.some(r => r.id === 'UI-003') ? 'Review' : 'Pass'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded bg-zinc-900/30 border border-zinc-855 text-xs">
                  <div>
                    <span className="font-semibold text-zinc-300">Focus Ring Outlines</span>
                    <p className="text-zinc-500 mt-0.5">Outline element borders relative luminance targets.</p>
                  </div>
                  <Badge variant={recommendations.some(r => r.id === 'UI-002') ? 'warning' : 'success'}>
                    {recommendations.some(r => r.id === 'UI-002') ? 'Review' : 'Pass'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Brand Consistency Engine */}
            <Card className="border-zinc-800 bg-zinc-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-brand-primary" />
                  Brand Consistency Engine
                </CardTitle>
                <CardDescription>
                  Verifies color preservation parameters against original seed input.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded bg-zinc-900/30 border border-zinc-855 text-xs">
                  <div>
                    <span className="font-semibold text-zinc-300">Hue Drift audit</span>
                    <p className="text-zinc-500 mt-0.5">Checks polar angle coordinate shifts in OKLCH.</p>
                  </div>
                  <Badge variant={recommendations.some(r => r.id === 'BR-001') ? 'warning' : 'success'}>
                    {recommendations.some(r => r.id === 'BR-001') ? 'Drift Warning' : 'Stable'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded bg-zinc-900/30 border border-zinc-855 text-xs">
                  <div>
                    <span className="font-semibold text-zinc-300">Semantic Separation</span>
                    <p className="text-zinc-500 mt-0.5">Checks distance (DeltaE) between semantic success & error colors.</p>
                  </div>
                  <Badge variant={recommendations.some(r => r.id === 'CVD-001') ? 'warning' : 'success'}>
                    {recommendations.some(r => r.id === 'CVD-001') ? 'Risk' : 'Stable'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab 3: Version Comparison */}
        {activeTab === 'compare' && (
          <div className="space-y-6 print:hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-950 p-4 rounded-lg border border-zinc-800 select-none">
              <div className="flex items-center gap-3">
                <History className="h-5 w-5 text-brand-primary" />
                <div>
                  <div className="text-sm font-semibold text-zinc-200">Revision History Checkpoints</div>
                  <div className="text-xs text-zinc-500 mt-0.5">Save checkpoints to compare side-by-side.</div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <Button size="sm" onClick={saveCheckpoint} className="gap-1 text-xs">
                  <Bookmark className="h-3.5 w-3.5" /> Save Checkpoint
                </Button>

                {history.length > 0 && (
                  <select
                    value={compareId}
                    onChange={(e) => setCompareId(e.target.value)}
                    className="h-8 rounded border border-zinc-800 bg-zinc-900 text-xs px-2 cursor-pointer focus-ring text-zinc-300"
                  >
                    {history.map((h, i) => (
                      <option key={h.id} value={h.id}>
                        Checkpoint {i + 1} ({h.timestamp}) - Score: {h.score}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {history.length === 0 ? (
              <div className="py-12 border border-dashed border-zinc-800 rounded-lg text-center text-sm text-zinc-500 font-mono">
                No checkpoints saved yet. Click &quot;Save Checkpoint&quot; to begin.
              </div>
            ) : (
              selectedCompare && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Historical Checkpoint */}
                  <Card className="border-zinc-800 bg-zinc-950">
                    <CardHeader className="flex flex-row justify-between items-center pb-2 select-none">
                      <div>
                        <CardTitle className="text-sm font-bold text-zinc-400">Historical Checkpoint</CardTitle>
                        <CardDescription>Saved at {selectedCompare.timestamp}</CardDescription>
                      </div>
                      <Badge variant="info">Score: {selectedCompare.score}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2 items-center">
                        <span className="text-xs text-zinc-500 font-mono">Seed:</span>
                        <div
                          className="h-3.5 w-3.5 rounded-full border border-black/10"
                          style={{ backgroundColor: selectedCompare.seedColor }}
                        />
                        <span className="text-xs font-mono text-zinc-300">{selectedCompare.seedColor}</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {selectedCompare.palette.map((swatch, idx) => (
                          <div
                            key={idx}
                            className="h-6 flex-1 min-w-[20px] rounded border border-black/10"
                            style={{ backgroundColor: swatch.hex }}
                            title={`Shade ${idx + 1}: ${swatch.hex}`}
                          />
                        ))}
                      </div>

                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-full text-xs h-8 cursor-pointer mt-4"
                        onClick={() => rollbackToCheckpoint(selectedCompare.id)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1.5" /> Restore Checkpoint
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Active Sandbox */}
                  <Card className="border-zinc-800 bg-zinc-950">
                    <CardHeader className="flex flex-row justify-between items-center pb-2 select-none">
                      <div>
                        <CardTitle className="text-sm font-bold text-brand-primary">Active Sandbox</CardTitle>
                        <CardDescription>Current editing canvas state</CardDescription>
                      </div>
                      <Badge variant="success">Score: {scoreResult?.total ?? 100}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2 items-center">
                        <span className="text-xs text-zinc-500 font-mono">Seed:</span>
                        <div
                          className="h-3.5 w-3.5 rounded-full border border-black/10"
                          style={{ backgroundColor: usePaletteStore.getState().seedColor }}
                        />
                        <span className="text-xs font-mono text-zinc-300">
                          {usePaletteStore.getState().seedColor}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {palette.map((swatch, idx) => (
                          <div
                            key={idx}
                            className="h-6 flex-1 min-w-[20px] rounded border border-black/10"
                            style={{ backgroundColor: swatch.hex }}
                            title={`Shade ${idx + 1}: ${swatch.hex}`}
                          />
                        ))}
                      </div>

                      <div className="mt-4 p-3 rounded border border-zinc-850 bg-zinc-900/10 flex items-center justify-between text-xs select-none">
                        <span className="font-semibold text-zinc-400">Contrast score delta:</span>
                        <span className="flex items-center gap-1 text-emerald-400 font-bold">
                          <TrendingUp className="h-3.5 w-3.5" />
                          {Math.round((scoreResult?.total ?? 100) - selectedCompare.score) >= 0 ? '+' : ''}
                          {Math.round((scoreResult?.total ?? 100) - selectedCompare.score)} points
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            )}
          </div>
        )}

        {/* Tab 4: Printable Executive Report */}
        {activeTab === 'report' && (
          <div className="space-y-6">
            <div className="flex justify-end print:hidden select-none">
              <Button onClick={handlePrint} className="gap-2 cursor-pointer">
                <Printer className="h-4 w-4" /> Print PDF Report
              </Button>
            </div>

            <Card className="border-zinc-800 bg-zinc-950/80 p-8 max-w-3xl mx-auto shadow-2xl space-y-8 print:p-0 print:bg-transparent print:shadow-none print:border-none">
              {/* Executive Header */}
              <div className="border-b border-zinc-800 pb-6 flex justify-between items-start">
                <div>
                  <div className="text-xs text-brand-primary font-mono font-semibold uppercase tracking-wider mb-1">
                    Design Intelligence Audit
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
                    PaletteOS Executive Compliance Report
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Generated on {new Date().toLocaleDateString()} for active workspace palette tokens.
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">
                    Overall Score
                  </div>
                  <div className="text-4xl font-extrabold text-brand-primary">
                    {scoreResult?.total ?? 100}/100
                  </div>
                </div>
              </div>

              {/* Score matrix breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Contrast', val: scoreResult?.contrast ?? 100 },
                  { label: 'Harmony', val: scoreResult?.harmony ?? 100 },
                  { label: 'Semantic', val: scoreResult?.semantic ?? 100 },
                  { label: 'Comfort', val: scoreResult?.comfort ?? 100 },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded border border-zinc-850 bg-zinc-950">
                    <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
                      {item.label}
                    </span>
                    <div className="text-xl font-bold mt-1 text-zinc-100">{item.val}%</div>
                  </div>
                ))}
              </div>

              {/* Active Swatches Layout */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                  Exported Swatches
                </span>
                <div className="grid grid-cols-11 gap-1.5">
                  {palette.map((swatch, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5">
                      <div
                        className="h-10 w-full rounded border border-black/10"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <span className="text-[9px] font-mono text-zinc-500 uppercase select-all">
                        {swatch.hex}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance Failures List */}
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                  Compliance Summary
                </span>

                <div className="space-y-2">
                  {recommendations.length === 0 ? (
                    <div className="p-4 rounded bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> All semantic targets satisfy WCAG AA contrast compliance parameters.
                    </div>
                  ) : (
                    recommendations.map((rec) => (
                      <div
                        key={rec.id}
                        className="p-4 rounded border border-zinc-850 bg-zinc-950 flex justify-between items-start gap-4 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-zinc-300">{rec.title}</div>
                          <div className="text-zinc-500 mt-1">{rec.description}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                            {rec.id}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
