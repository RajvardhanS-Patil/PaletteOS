'use client';

import { usePaletteStore } from '@/store/usePaletteStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, Eye, ShieldCheck, Heart } from 'lucide-react';

export default function SettingsPage() {
  const { contrastStandard, setContrastStandard } = usePaletteStore();

  return (
    <div className="flex-1 bg-sys-bg p-8 max-w-3xl w-full mx-auto space-y-8 overflow-y-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2 select-none">
          <ShieldCheck className="h-6 w-6 text-brand-primary" />
          Settings & Policies
        </h1>
        <p className="text-sm text-zinc-400 mt-1 select-none">
          Configure default accessibility compliance targets and team standard parameters.
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

        {/* Info card */}
        <Card className="border-zinc-800 bg-zinc-950 text-xs text-zinc-500 flex items-center gap-2 p-4 select-none justify-center">
          <Heart className="h-4 w-4 text-zinc-600 flex-shrink-0" />
          <span>Accessibility standards are synchronized client-side.</span>
        </Card>
      </div>
    </div>
  );
}
