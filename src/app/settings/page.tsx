'use client';

import { useState } from 'react';
import { usePaletteStore } from '@/store/usePaletteStore';
import { useHydration } from '@/hooks/useHydration';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  ShieldCheck,
  Heart,
  Import,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  Users,
} from 'lucide-react';

interface ValidationWarning {
  type: 'warning' | 'info' | 'success';
  message: string;
}

export default function SettingsPage() {
  const hydrated = useHydration();
  const {
    contrastStandard,
    projectName,
    projectPurpose,
    reviewStatus,
    projectNotes,
    palette,
    setContrastStandard,
    setProjectName,
    setProjectPurpose,
    setReviewStatus,
    setProjectNotes,
    importPaletteColors,
  } = usePaletteStore();

  const [importText, setImportText] = useState('');
  const [warnings, setWarnings] = useState<ValidationWarning[]>([]);
  const [importStatus, setImportStatus] = useState<string>('');

  if (!hydrated) {
    return (
      <div className="flex-1 bg-sys-bg p-8 max-w-3xl w-full mx-auto flex items-center justify-center">
        <div className="text-zinc-500 font-mono text-sm animate-pulse">Loading Settings...</div>
      </div>
    );
  }

  const handleImport = () => {
    if (!importText.trim()) return;

    // Regex to locate all 6-char hex codes (e.g. #3b82f6 or 3b82f6)
    const hexPattern = /#?([0-9a-fA-F]{6})\b/g;
    const matches: string[] = [];
    let match;

    while ((match = hexPattern.exec(importText)) !== null) {
      matches.push(`#${match[1]}`);
    }

    if (matches.length === 0) {
      setImportStatus('Failed: No valid HEX color codes detected.');
      setWarnings([{ type: 'warning', message: 'Could not extract any standard 6-character color swatches.' }]);
      return;
    }

    // Run import store update
    importPaletteColors(matches);
    setImportStatus(`Success: Imported ${matches.length} colors into active sandbox.`);

    // Run token validator checks
    const activeWarnings: ValidationWarning[] = [];
    
    // Check duplicates
    const uniqueColors = new Set(matches.map((c) => c.toLowerCase()));
    const duplicatesCount = matches.length - uniqueColors.size;
    if (duplicatesCount > 0) {
      activeWarnings.push({
        type: 'warning',
        message: `Detected ${duplicatesCount} duplicate color swatch definitions. Inconsistent palettes can bloat CSS bundles.`,
      });
    }

    // Check semantic coverages
    if (matches.length < 5) {
      activeWarnings.push({
        type: 'info',
        message: 'Imported list contains under 5 swatches. Backfilled missing shades with base configurations.',
      });
    }

    if (activeWarnings.length === 0) {
      activeWarnings.push({
        type: 'success',
        message: 'Design token syntax validation passed completely.',
      });
    }

    setWarnings(activeWarnings);
  };

  return (
    <div className="flex-1 bg-sys-bg p-8 max-w-3xl w-full mx-auto space-y-8 overflow-y-auto">
      <div className="select-none">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-brand-primary" />
          Settings & Policies
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Configure default accessibility compliance targets, edit project metadata details, and import design systems.
        </p>
      </div>

      <div className="space-y-6">
        {/* Compliance Targets card */}
        <Card className="border-zinc-800 bg-zinc-950 select-none">
          <CardHeader>
            <CardTitle>Contrast Compliance Targets</CardTitle>
            <CardDescription>
              Set the target compliance scoring check parameters across all generator swatches.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {[
                {
                  id: 'aa',
                  title: 'WCAG 2.1 AA Standard (Recommended)',
                  desc: 'Requires relative contrast at least 4.5:1 for normal text and 3.0:1 for large text layouts.',
                },
                {
                  id: 'aaa',
                  title: 'WCAG 2.1 AAA Standard (Strict)',
                  desc: 'Requires relative contrast at least 7.0:1 for normal text and 4.5:1 for large text layouts.',
                },
                {
                  id: 'apca',
                  title: 'APCA Standard (WCAG 3.0 draft)',
                  desc: 'Perceptive luminance calculation checks matching variable visual sizes and text weight coefficients.',
                },
              ].map((std) => (
                <div
                  key={std.id}
                  onClick={() => setContrastStandard(std.id as any)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer flex justify-between items-start gap-4 ${
                    contrastStandard === std.id
                      ? 'border-brand-primary bg-brand-primary/5 text-zinc-100'
                      : 'border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40 text-zinc-300'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm">{std.title}</div>
                    <div className="text-xs text-zinc-500 mt-1">{std.desc}</div>
                  </div>
                  {contrastStandard === std.id && <Badge variant="info">Active</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Metadata & Collaboration */}
        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader className="select-none">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-primary" />
              Project Metadata & Collaboration
            </CardTitle>
            <CardDescription>
              Attach notes, tag category purposes, and manage the team review status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500">Project Name</span>
                <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500">Review Status</span>
                <select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value as any)}
                  className="w-full h-10 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm text-zinc-100 focus-ring cursor-pointer"
                >
                  <option value="Draft">Draft (In Sandbox)</option>
                  <option value="In Review">In Team Review</option>
                  <option value="Approved">Approved for Production</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500">Purpose Description</span>
              <Input value={projectPurpose} onChange={(e) => setProjectPurpose(e.target.value)} />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-zinc-500">Team Designer Notes</span>
              <textarea
                value={projectNotes}
                onChange={(e) => setProjectNotes(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 p-3 text-xs text-zinc-100 focus-ring placeholder-zinc-600 resize-none leading-relaxed"
                placeholder="Add comments or compliance requirements details..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Theme Token Importer & Validator */}
        <Card className="border-zinc-800 bg-zinc-950">
          <CardHeader className="select-none">
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-brand-primary" />
              Theme Token Importer & Validator
            </CardTitle>
            <CardDescription>
              Paste raw CSS Custom Variables or JSON design tokens mapping colors below to import and analyze.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-zinc-800 bg-zinc-900 p-3 font-mono text-xs text-zinc-300 focus-ring resize-none leading-relaxed"
              placeholder=":root {&#10;  --primary-500: #3b82f6;&#10;  --primary-100: #eff6ff;&#10;}"
            />

            <div className="flex justify-between items-center flex-wrap gap-3 select-none">
              <Button size="sm" onClick={handleImport} className="gap-1.5 h-8 text-xs cursor-pointer">
                <Import className="h-4 w-4" /> Import & Validate
              </Button>

              {importStatus && (
                <span className={`text-xs font-semibold ${importStatus.startsWith('Failed') ? 'text-red-400' : 'text-emerald-400'}`}>
                  {importStatus}
                </span>
              )}
            </div>

            {/* Validation logs warning checklist */}
            {warnings.length > 0 && (
              <div className="border-t border-zinc-900 pt-4 space-y-2 select-none">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block mb-1">
                  Validator Warnings Log
                </span>
                {warnings.map((w, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded border text-xs flex items-center gap-2.5 ${
                      w.type === 'warning'
                        ? 'border-amber-500/10 bg-amber-500/5 text-amber-400'
                        : w.type === 'info'
                        ? 'border-blue-500/10 bg-blue-500/5 text-blue-400'
                        : 'border-emerald-500/10 bg-emerald-500/5 text-emerald-400'
                    }`}
                  >
                    {w.type === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    )}
                    <span>{w.message}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info card */}
        <Card className="border-zinc-800 bg-zinc-950 text-xs text-zinc-500 flex items-center gap-2 p-4 select-none justify-center">
          <Heart className="h-4 w-4 text-zinc-600 flex-shrink-0" />
          <span>PaletteOS configuration and alignment parameters are stored client-side.</span>
        </Card>
      </div>
    </div>
  );
}
