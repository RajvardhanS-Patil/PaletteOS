'use client';

import { useState } from 'react';
import WorkspaceTabs from '@/components/WorkspaceTabs';
import { usePaletteStore } from '@/store/usePaletteStore';
import { useHydration } from '@/hooks/useHydration';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  Sparkles,
  Moon,
  Sun,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Laptop,
  Tablet,
  Smartphone,
  Layout,
  Menu,
  Bell,
  LineChart,
  Grid,
  Info,
} from 'lucide-react';
import { getContrastRatio } from '@/engines/accessibility/contrast';

type ViewportType = 'desktop' | 'tablet' | 'mobile';

export default function PlaygroundPage() {
  const hydrated = useHydration();
  const { palette, seedColor } = usePaletteStore();
  const [playTheme, setPlayTheme] = useState<'dark' | 'light'>('dark');
  const [viewport, setViewport] = useState<ViewportType>('desktop');
  const [textSize, setTextSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [textWeight, setTextWeight] = useState<'normal' | 'semibold' | 'bold'>('normal');
  const [showToast, setShowToast] = useState(true);

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

  // Scope CSS variables dynamically
  const customStyles = {
    '--brand-primary': seedColor,
    '--sys-bg': sysBg,
    '--sys-surface': sysSurface,
    '--sys-text': sysText,
    '--sys-border': sysBorder,
    '--color-primary-50': colors[0] || '#eff6ff',
    '--color-primary-100': colors[1] || '#dbeafe',
    '--color-primary-500': seedColor,
    '--color-primary-900': colors[9] || '#1e3a8a',
  } as React.CSSProperties;

  // Real-time audits
  const brandOnBgRatio = getContrastRatio(seedColor, sysBg);
  const brandOnSurfaceRatio = getContrastRatio(seedColor, sysSurface);
  const textOnSurfaceRatio = getContrastRatio(sysText, sysSurface);

  const getContrastBadge = (ratio: number, label: string) => {
    const isLarge = textSize === 'lg' || textWeight === 'bold';
    const minRatio = isLarge ? 3.0 : 4.5;
    const passes = ratio >= minRatio;

    return (
      <div className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/50">
        {passes ? (
          <>
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span className="text-zinc-400">{label}: {ratio}:1</span>
          </>
        ) : (
          <>
            <AlertTriangle className="h-3 w-3 text-red-400 animate-bounce" />
            <span className="text-red-400 font-bold">{label}: {ratio}:1 (Fail)</span>
          </>
        )}
      </div>
    );
  };

  const textClass = () => {
    let size = 'text-base';
    if (textSize === 'sm') size = 'text-xs';
    if (textSize === 'lg') size = 'text-lg';

    let weight = 'font-normal';
    if (textWeight === 'semibold') weight = 'font-semibold';
    if (textWeight === 'bold') weight = 'font-bold';

    return `${size} ${weight}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-sys-bg">
      <WorkspaceTabs />

      <main className="flex-1 p-8 space-y-6 max-w-6xl w-full mx-auto overflow-y-auto">
        {/* Header toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2 select-none">
              <Layout className="h-6 w-6 text-brand-primary" />
              Sized Preview Workspace
            </h1>
            <p className="text-sm text-zinc-400 mt-1 select-none">
              Observe contrast shifts across viewports and typography settings instantly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Viewport Toggles */}
            <div className="inline-flex rounded-md border border-zinc-800 bg-zinc-950 p-0.5 gap-0.5 select-none">
              {[
                { id: 'desktop', icon: Laptop, tooltip: 'Desktop layout' },
                { id: 'tablet', icon: Tablet, tooltip: 'Tablet layout (768px)' },
                { id: 'mobile', icon: Smartphone, tooltip: 'Mobile layout (375px)' },
              ].map((vp) => {
                const Icon = vp.icon;
                return (
                  <button
                    key={vp.id}
                    onClick={() => setViewport(vp.id as ViewportType)}
                    className={`h-7 w-8 rounded flex items-center justify-center cursor-pointer transition-colors ${
                      viewport === vp.id ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-100'
                    }`}
                    title={vp.tooltip}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>

            {/* Typography Selectors */}
            <select
              value={textWeight}
              onChange={(e) => setTextWeight(e.target.value as any)}
              className="h-8 rounded border border-zinc-800 bg-zinc-900 text-xs px-2 cursor-pointer focus-ring text-zinc-300 select-none"
            >
              <option value="normal">Normal Weight</option>
              <option value="semibold">Semibold Weight</option>
              <option value="bold">Bold Weight</option>
            </select>

            <select
              value={textSize}
              onChange={(e) => setTextSize(e.target.value as any)}
              className="h-8 rounded border border-zinc-800 bg-zinc-900 text-xs px-2 cursor-pointer focus-ring text-zinc-300 select-none"
            >
              <option value="sm">Small Text</option>
              <option value="md">Medium Text</option>
              <option value="lg">Large Text</option>
            </select>

            {/* Light/Dark Toggle */}
            <button
              onClick={() => setPlayTheme(playTheme === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-zinc-100 cursor-pointer transition-colors focus-ring select-none"
            >
              {playTheme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              {playTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>

        {/* Audits Bar */}
        <div className="flex flex-wrap gap-3 p-4 rounded-lg border border-zinc-800 bg-zinc-950 select-none">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center mr-2">
            Real-Time Audits:
          </span>
          {getContrastBadge(brandOnBgRatio, 'Brand on BG')}
          {getContrastBadge(brandOnSurfaceRatio, 'Brand on Surface')}
          {getContrastBadge(textOnSurfaceRatio, 'Body Text on Surface')}
        </div>

        {/* Viewport Frame Resizer Wrapper */}
        <div className="w-full flex justify-center py-6 border border-zinc-850 bg-zinc-950/20 rounded-xl overflow-hidden min-h-[500px]">
          <div
            style={customStyles}
            className={`transition-all duration-300 ease-in-out border border-[var(--sys-border)] bg-[var(--sys-bg)] text-[var(--sys-text)] shadow-2xl relative flex flex-col ${
              viewport === 'desktop' ? 'w-full rounded-lg' : viewport === 'tablet' ? 'w-[768px] rounded-2xl h-[640px]' : 'w-[375px] rounded-3xl h-[600px]'
            }`}
          >
            {/* Viewport Frame Top Bar (Mobile / Tablet bezel) */}
            {viewport !== 'desktop' && (
              <div className="h-8 border-b border-[var(--sys-border)] bg-[var(--sys-surface)] flex items-center justify-center gap-1.5 rounded-t-xl select-none">
                <div className="h-2 w-2 rounded-full bg-zinc-500" />
                <div className="h-2 w-12 rounded-full bg-zinc-550" />
              </div>
            )}

            {/* Layout Header */}
            <header className="h-14 border-b border-[var(--sys-border)] bg-[var(--sys-surface)] flex items-center justify-between px-6 select-none shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-[var(--brand-primary)] flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5 text-zinc-100" />
                </div>
                <span className="font-bold text-sm">DashboardOS</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
                {viewport === 'desktop' && (
                  <>
                    <span className="text-[var(--brand-primary)] font-semibold">Overview</span>
                    <span>Systems</span>
                    <span>Analytics</span>
                  </>
                )}
                <Bell className="h-4 w-4" />
              </div>
            </header>

            {/* Main Application Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Sidebar (Desktop/Tablet only) */}
              {viewport !== 'mobile' && (
                <aside className="w-48 border-r border-[var(--sys-border)] bg-[var(--sys-surface)] p-4 space-y-4 select-none shrink-0">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Navigation</span>
                    {['Explorer', 'Health check', 'Audits', 'Sync logs'].map((item, idx) => (
                      <span
                        key={idx}
                        className={`block px-2.5 py-1.5 rounded text-xs font-medium cursor-pointer ${
                          idx === 0 ? 'bg-[var(--color-primary-50)] text-[var(--brand-primary)]' : 'text-zinc-400 hover:bg-zinc-800/10'
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </aside>
              )}

              {/* Central Contents Canvas */}
              <main className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold tracking-tight">System Performance Summary</h2>
                  <p className="text-xs text-zinc-400">Review real-time diagnostic checks across active nodes.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Interactive Buttons form block */}
                  <div className="border border-[var(--sys-border)] bg-[var(--sys-surface)] p-4 rounded-lg space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Actions Node</h3>
                    <div className="space-y-2">
                      <Button className="w-full bg-[var(--brand-primary)] text-zinc-100 hover:opacity-90 transition-opacity text-xs h-8">
                        Execute Primary Action
                      </Button>
                      <Button variant="outline" className="w-full border-[var(--sys-border)] text-[var(--sys-text)] bg-transparent hover:bg-zinc-800/10 text-xs h-8">
                        Secondary Cancel
                      </Button>
                    </div>
                  </div>

                  {/* Diagnostic Mini Chart Block */}
                  <div className="border border-[var(--sys-border)] bg-[var(--sys-surface)] p-4 rounded-lg space-y-3 select-none">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                      Node Load
                      <LineChart className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
                    </h3>
                    <div className="h-16 flex items-end gap-2.5 pt-2">
                      {[30, 60, 45, 90, 75, 50].map((val, idx) => (
                        <div
                          key={idx}
                          className="flex-1 bg-[var(--brand-primary)] rounded-t hover:opacity-90 transition-opacity"
                          style={{ height: `${val}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Data Logs Mock Table */}
                <div className="border border-[var(--sys-border)] bg-[var(--sys-surface)] rounded-lg overflow-hidden select-none">
                  <div className="p-3 border-b border-[var(--sys-border)] text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-950/10">
                    System Check Logs
                  </div>
                  <div className="p-4 space-y-2 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-[var(--sys-border)]/50">
                      <span className="font-mono text-zinc-400">Node_Alpha_AA</span>
                      <Badge variant="success">Pass</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-zinc-400">Node_Beta_Contrast</span>
                      <Badge variant="info">Verified</Badge>
                    </div>
                  </div>
                </div>

                <div className={textClass()}>
                  Typography Check: Standard size and weight scale renders here.
                </div>
              </main>
            </div>

            {/* Interactive Toast Notification */}
            {showToast && (
              <div className="absolute bottom-4 right-4 max-w-[280px] p-3 rounded-lg border border-[var(--sys-border)] bg-[var(--sys-surface)] shadow-xl flex items-start gap-2.5 z-20 animate-bounce">
                <Info className="h-4 w-4 text-[var(--brand-primary)] flex-shrink-0 mt-0.5" />
                <div className="text-[10px]">
                  <div className="font-bold text-[var(--sys-text)]">Theme updated successfully!</div>
                  <div className="text-zinc-500 mt-0.5">Scoring engines evaluated node parameters.</div>
                </div>
                <button
                  onClick={() => setShowToast(false)}
                  className="text-xs text-zinc-400 hover:text-[var(--sys-text)] ml-auto cursor-pointer"
                >
                  ×
                </button>
              </div>
            )}

            {/* Footer */}
            <footer className="h-10 border-t border-[var(--sys-border)] bg-[var(--sys-surface)] flex items-center justify-between px-6 text-[9px] text-zinc-500 shrink-0 select-none">
              <span>© 2026 Workspace DashboardOS</span>
              <span>All nodes operational</span>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
