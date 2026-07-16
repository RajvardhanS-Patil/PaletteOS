'use client';

import { useState } from 'react';
import WorkspaceTabs from '@/components/WorkspaceTabs';
import { usePaletteStore } from '@/store/usePaletteStore';
import { useHydration } from '@/hooks/useHydration';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check, Copy } from 'lucide-react';

export default function ExportPage() {
  const hydrated = useHydration();
  const { palette, seedColor } = usePaletteStore();
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  if (!hydrated) {
    return (
      <div className="flex-1 flex flex-col bg-sys-bg">
        <WorkspaceTabs />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-zinc-500 font-mono text-sm animate-pulse">Loading Exporter...</div>
        </div>
      </div>
    );
  }

  const colors = palette.map((p) => p.hex);

  // Formatted codes
  const cssCode = `:root {
  --brand-primary: ${seedColor};
  
  /* Primary Scale */
${colors
  .map((hex, i) => `  --color-primary-${i === 0 ? '50' : i === 10 ? '950' : i * 100}: ${hex};`)
  .join('\n')}
}`;

  const tailwindCode = `module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '${colors[0] || '#eff6ff'}',
          100: '${colors[1] || '#dbeafe'}',
          200: '${colors[2] || '#bfdbfe'}',
          300: '${colors[3] || '#93c5fd'}',
          400: '${colors[4] || '#60a5fa'}',
          500: '${seedColor}',
          600: '${colors[6] || '#2563eb'}',
          700: '${colors[7] || '#1d4ed8'}',
          800: '${colors[8] || '#1e40af'}',
          900: '${colors[9] || '#1e3a8a'}',
          950: '${colors[10] || '#172554'}',
        }
      }
    }
  }
}`;

  const jsonCode = JSON.stringify(
    {
      color: {
        primary: colors.reduce((acc: any, hex, i) => {
          const weight = i === 0 ? 50 : i === 10 ? 950 : i * 100;
          acc[weight] = { $value: hex, $type: 'color' };
          return acc;
        }, {}),
      },
    },
    null,
    2
  );

  const handleCopy = (code: string, format: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const exportFormats = [
    { id: 'css', title: 'CSS Root Custom Variables', code: cssCode, language: 'css' },
    { id: 'tailwind', title: 'Tailwind Extension Object', code: tailwindCode, language: 'javascript' },
    { id: 'json', title: 'W3C Design Tokens JSON', code: jsonCode, language: 'json' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-sys-bg">
      <WorkspaceTabs />

      <main className="flex-1 p-8 space-y-6 max-w-4xl w-full mx-auto overflow-y-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Export Configurations
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Copy styled configurations matching your active design framework.
          </p>
        </div>

        <div className="space-y-6">
          {exportFormats.map((format) => (
            <Card key={format.id} className="border-zinc-800 bg-zinc-950 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-900 pb-3">
                <div>
                  <CardTitle className="text-sm font-semibold">{format.title}</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 gap-1.5 text-xs focus-ring cursor-pointer"
                  onClick={() => handleCopy(format.code, format.id)}
                >
                  {copiedFormat === format.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy Code
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <pre className="p-4 overflow-x-auto font-mono text-xs leading-relaxed bg-zinc-950/80 text-zinc-300">
                  <code>{format.code}</code>
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
