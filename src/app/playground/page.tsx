'use client';

import { useState } from 'react';
import WorkspaceTabs from '@/components/WorkspaceTabs';
import { usePaletteStore } from '@/store/usePaletteStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Sparkles, Moon, Sun, ArrowUpRight } from 'lucide-react';

export default function PlaygroundPage() {
  const { palette, seedColor } = usePaletteStore();
  const [playTheme, setPlayTheme] = useState<'dark' | 'light'>('dark');

  const colors = palette.map((p) => p.hex);
  
  // Custom scope variables matching active palette
  const customStyles = {
    '--brand-primary': seedColor,
    '--sys-bg': playTheme === 'dark' ? '#09090b' : '#f9f9fb',
    '--sys-surface': playTheme === 'dark' ? '#18181b' : '#ffffff',
    '--sys-text': playTheme === 'dark' ? '#f4f4f5' : '#18181b',
    '--sys-border': playTheme === 'dark' ? '#27272a' : '#e4e4e7',
    
    // Map shades dynamically
    '--color-primary-50': colors[0] || '#eff6ff',
    '--color-primary-500': seedColor,
    '--color-primary-900': colors[9] || '#1e3a8a',
  } as React.CSSProperties;

  return (
    <div className="flex-1 flex flex-col bg-sys-bg">
      <WorkspaceTabs />

      <main className="flex-1 p-8 space-y-6 max-w-5xl w-full mx-auto overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              Interactive Component Playground
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Test your generated colors inside live mockup component scopes.
            </p>
          </div>

          <button
            onClick={() => setPlayTheme(playTheme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-zinc-100 cursor-pointer transition-colors focus-ring"
          >
            {playTheme === 'dark' ? (
              <>
                <Sun className="h-3.5 w-3.5" /> Force Light Preview
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5" /> Force Dark Preview
              </>
            )}
          </button>
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
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Form Inputs
              </h3>
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
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Interactive Buttons
              </h3>
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

              <div className="pt-4 flex justify-between items-center text-xs text-zinc-400">
                <span>Verification score</span>
                <span className="flex items-center gap-0.5 font-bold text-[var(--brand-primary)]">
                  AA Pass <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
