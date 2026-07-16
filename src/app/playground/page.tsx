'use client';

import { useState } from 'react';
import WorkspaceTabs from '@/components/WorkspaceTabs';
import { usePaletteStore } from '@/store/usePaletteStore';
import { useHydration } from '@/hooks/useHydration';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Sparkles, Moon, Sun, ArrowUpRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getContrastRatio } from '@/engines/accessibility/contrast';

export default function PlaygroundPage() {
  const hydrated = useHydration();
  const { palette, seedColor, contrastStandard } = usePaletteStore();
  const [playTheme, setPlayTheme] = useState<'dark' | 'light'>('dark');
  const [textSize, setTextSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [textWeight, setTextWeight] = useState<'normal' | 'semibold' | 'bold'>('normal');

  if (!hydrated) {
    return (
      <div className="flex-1 flex flex-col bg-sys-bg">
        <WorkspaceTabs />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-zinc-500 font-mono text-sm animate-pulse">Loading Playground...</div>
        </div>
      </div>
    );
  }

  const colors = palette.map((p) => p.hex);
  const sysBg = playTheme === 'dark' ? '#09090b' : '#f9f9fb';
  const sysSurface = playTheme === 'dark' ? '#18181b' : '#ffffff';
  const sysText = playTheme === 'dark' ? '#f4f4f5' : '#18181b';
  const sysBorder = playTheme === 'dark' ? '#27272a' : '#e4e4e7';

  // Custom scope variables matching active palette
  const customStyles = {
    '--brand-primary': seedColor,
    '--sys-bg': sysBg,
    '--sys-surface': sysSurface,
    '--sys-text': sysText,
    '--sys-border': sysBorder,
    '--color-primary-50': colors[0] || '#eff6ff',
    '--color-primary-500': seedColor,
    '--color-primary-900': colors[9] || '#1e3a8a',
  } as React.CSSProperties;

  // Real-time Contrast Auditor Checks
  const brandOnBgRatio = getContrastRatio(seedColor, sysBg);
  const brandOnSurfaceRatio = getContrastRatio(seedColor, sysSurface);
  const textOnSurfaceRatio = getContrastRatio(sysText, sysSurface);

  const getContrastBadge = (ratio: number, label: string) => {
    // Determine standard AA threshold (4.5 for normal, 3.0 for large/bold text)
    const isLarge = textSize === 'lg' || textWeight === 'bold';
    const minRatio = isLarge ? 3.0 : 4.5;
    const passes = ratio >= minRatio;

    return (
      <div className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border select-none transition-colors border-zinc-800 bg-zinc-900/50">
        {passes ? (
          <>
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span className="text-zinc-400">{label}: {ratio}:1</span>
          </>
        ) : (
          <>
            <AlertTriangle className="h-3 w-3 text-red-400" />
            <span className="text-red-400 font-bold">{label}: {ratio}:1 (Fail)</span>
          </>
        )}
      </div>
    );
  };

  const textClass = () => {
    let sizeClass = 'text-base';
    if (textSize === 'sm') sizeClass = 'text-xs';
    if (textSize === 'lg') sizeClass = 'text-lg';

    let weightClass = 'font-normal';
    if (textWeight === 'semibold') weightClass = 'font-semibold';
    if (textWeight === 'bold') weightClass = 'font-bold';

    return `${sizeClass} ${weightClass}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-sys-bg">
      <WorkspaceTabs />

      <main className="flex-1 p-8 space-y-6 max-w-5xl w-full mx-auto overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              Interactive Component Playground
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Verify your generated colors inside live mockup component scopes with real-time contrast indicators.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Text Weight Selector */}
            <select
              value={textWeight}
              onChange={(e) => setTextWeight(e.target.value as any)}
              className="h-8 rounded border border-zinc-800 bg-zinc-900 text-xs px-2 cursor-pointer focus-ring text-zinc-300"
            >
              <option value="normal">Normal Weight</option>
              <option value="semibold">Semibold Weight</option>
              <option value="bold">Bold Weight</option>
            </select>

            {/* Text Size Selector */}
            <select
              value={textSize}
              onChange={(e) => setTextSize(e.target.value as any)}
              className="h-8 rounded border border-zinc-800 bg-zinc-900 text-xs px-2 cursor-pointer focus-ring text-zinc-300"
            >
              <option value="sm">Small Text</option>
              <option value="md">Medium Text</option>
              <option value="lg">Large Text</option>
            </select>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setPlayTheme(playTheme === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-zinc-100 cursor-pointer transition-colors focus-ring"
            >
              {playTheme === 'dark' ? (
                <>
                  <Sun className="h-3.5 w-3.5" /> Light Mode
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5" /> Dark Mode
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Audits Bar */}
        <div className="flex flex-wrap gap-3 p-4 rounded-lg border border-zinc-800 bg-zinc-950">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center mr-2">
            Real-Time Audits:
          </span>
          {getContrastBadge(brandOnBgRatio, 'Brand on BG')}
          {getContrastBadge(brandOnSurfaceRatio, 'Brand on Surface')}
          {getContrastBadge(textOnSurfaceRatio, 'Body Text on Surface')}
        </div>

        {/* Playground Sandbox Wrapper */}
        <div
          style={customStyles}
          className="p-8 rounded-xl border border-zinc-800/80 bg-[var(--sys-bg)] text-[var(--sys-text)] shadow-lg space-y-8 transition-colors duration-200"
        >
          {/* Mock Header Navbar */}
          <div className="flex justify-between items-center pb-4 border-b border-[var(--sys-border)] select-none">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-[var(--brand-primary)] flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-zinc-100" />
              </div>
              <span className="font-semibold text-sm">Workspace App</span>
            </div>
            <div className="flex gap-4 text-xs font-medium text-zinc-400">
              <span>Overview</span>
              <span className="text-[var(--brand-primary)] font-semibold border-b-2 border-[var(--brand-primary)] pb-4 -mb-4">
                Analytics
              </span>
              <span>Settings</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Form Field Preview */}
            <div className="border border-[var(--sys-border)] rounded-lg p-5 bg-[var(--sys-surface)] space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Form Inputs
                </h3>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Email Address</span>
                  <Input placeholder="name@domain.com" className="bg-[var(--sys-bg)] border-[var(--sys-border)]" readOnly />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Project Token</span>
                  <Input value={seedColor} className="bg-[var(--sys-bg)] border-[var(--sys-border)] font-mono text-[var(--brand-primary)]" readOnly />
                </div>
              </div>
            </div>

            {/* Visual Action Cards */}
            <div className="border border-[var(--sys-border)] rounded-lg p-5 bg-[var(--sys-surface)] space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Interactive Buttons
                </h3>
              </div>
              <div className="flex flex-col gap-2">
                <Button className="bg-[var(--brand-primary)] text-zinc-100 hover:opacity-90 transition-opacity">
                  Primary Brand CTA
                </Button>
                <Button variant="outline" className="border-[var(--sys-border)] text-[var(--sys-text)] bg-transparent hover:bg-zinc-800/10">
                  Outline Modifier
                </Button>
              </div>
            </div>

            {/* Analytics Status card */}
            <div className="border border-[var(--sys-border)] rounded-lg p-5 bg-[var(--sys-surface)] flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  System Health status
                </h3>
                <div className="flex gap-2">
                  <Badge variant="success">Operational</Badge>
                  <Badge variant="info" className="bg-[var(--color-primary-50)] text-[var(--brand-primary)] border-[var(--brand-primary)]/20">
                    Scale Active
                  </Badge>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center text-zinc-400">
                <span className={textClass()}>Sample UI Text layout</span>
                <span className="flex items-center gap-0.5 font-bold text-[var(--brand-primary)]">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
