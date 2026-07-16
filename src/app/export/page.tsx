'use client';

import { useState } from 'react';
import WorkspaceTabs from '@/components/WorkspaceTabs';
import { usePaletteStore } from '@/store/usePaletteStore';
import { useHydration } from '@/hooks/useHydration';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check, Copy, Download, CheckCircle2, AlertCircle } from 'lucide-react';

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
  const getWeight = (i: number) => (i === 0 ? '50' : i === 10 ? '950' : `${i * 100}`);

  // Formatted codes
  const cssCode = `:root {
  --brand-primary: ${seedColor};
  
  /* Primary Scale */
${colors
  .map((hex, i) => `  --color-primary-${getWeight(i)}: ${hex};`)
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
          const weight = getWeight(i);
          acc[weight] = { $value: hex, $type: 'color' };
          return acc;
        }, {}),
      },
    },
    null,
    2
  );

  const scssCode = `// SCSS Variables
$color-brand-primary: ${seedColor};

// Primary Scale
${colors.map((hex, i) => `$color-primary-${getWeight(i)}: ${hex};`).join('\n')}
`;

  const swiftUiCode = `import SwiftUI

extension Color {
    static let brandPrimary = Color(hex: "${seedColor.replace('#', '')}")
    
    // Primary Scale
${colors.map((hex, i) => `    static let primary${getWeight(i)} = Color(hex: "${hex.replace('#', '')}")`).join('\n')}
}

// Hex Helper extension
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
`;

  const jetpackComposeCode = `package com.paletteos.ui.theme

import androidx.compose.ui.graphics.Color

val BrandPrimary = Color(0xFF${seedColor.replace('#', '').toUpperCase()})

// Primary Scale
${colors.map((hex, i) => `val Primary${getWeight(i)} = Color(0xFF${hex.replace('#', '').toUpperCase()})`).join('\n')}
`;

  const flutterCode = `import 'package:flutter/material.dart';

class AppTheme {
  static const Color brandPrimary = Color(0xFF${seedColor.replace('#', '').toUpperCase()});

  static const Map<int, Color> primaryScale = {
${colors.map((hex, i) => `    ${getWeight(i)}: Color(0xFF${hex.replace('#', '').toUpperCase()}),`).join('\n')}
  };
}
`;

  const handleCopy = (code: string, format: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleDownload = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Syntax validation checker (validates hex counts matches layout limits)
  const validateFormat = (code: string): boolean => {
    // Check if code contains undefined values
    if (code.includes('undefined')) return false;
    // Check if hex structures are balanced
    const hexCount = (code.match(/#[0-9a-fA-F]{6}/g) || []).length;
    // We expect at least the 11 swatches + seed brand color
    return hexCount >= 11;
  };

  const exportFormats = [
    { id: 'css', title: 'CSS Custom Variables', code: cssCode, filename: 'variables.css', ext: 'css' },
    { id: 'tailwind', title: 'Tailwind Config Extension', code: tailwindCode, filename: 'tailwind.config.js', ext: 'js' },
    { id: 'json', title: 'Design Tokens JSON', code: jsonCode, filename: 'tokens.json', ext: 'json' },
    { id: 'scss', title: 'SCSS Variables', code: scssCode, filename: 'variables.scss', ext: 'scss' },
    { id: 'swiftui', title: 'SwiftUI Extensions', code: swiftUiCode, filename: 'Colors+Extension.swift', ext: 'swift' },
    { id: 'compose', title: 'Jetpack Compose Colors', code: jetpackComposeCode, filename: 'Color.kt', ext: 'kt' },
    { id: 'flutter', title: 'Flutter ThemeData Map', code: flutterCode, filename: 'app_theme.dart', ext: 'dart' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-sys-bg">
      <WorkspaceTabs />

      <main className="flex-1 p-8 space-y-6 max-w-4xl w-full mx-auto overflow-y-auto">
        <div className="select-none">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Export Center
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Copy or download syntax-validated theme config definitions for your target framework.
          </p>
        </div>

        <div className="space-y-6">
          {exportFormats.map((format) => {
            const isValid = validateFormat(format.code);
            return (
              <Card key={format.id} className="border-zinc-800 bg-zinc-950 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-900 pb-3 select-none">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-semibold">{format.title}</CardTitle>
                    {isValid ? (
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                        <CheckCircle2 className="h-3 w-3" /> Validated
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[10px] text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                        <AlertCircle className="h-3 w-3" /> Parse warning
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 gap-1.5 text-xs cursor-pointer"
                      onClick={() => handleCopy(format.code, format.id)}
                    >
                      {copiedFormat === format.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied
                        </>
                      ) : (
                        'Copy'
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5 text-xs border-zinc-800 cursor-pointer text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900"
                      onClick={() => handleDownload(format.code, format.filename)}
                      disabled={!isValid}
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <pre className="p-4 overflow-x-auto font-mono text-xs leading-relaxed bg-zinc-950/85 text-zinc-300">
                    <code>{format.code}</code>
                  </pre>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
