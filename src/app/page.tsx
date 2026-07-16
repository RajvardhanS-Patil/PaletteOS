'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Eye, Code, ArrowRight, ShieldCheck, Heart, Terminal, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { usePaletteStore } from '@/store/usePaletteStore';

export default function Home() {
  const router = useRouter();
  const setSeedColor = usePaletteStore((state) => state.setSeedColor);

  const startGenerating = () => {
    setSeedColor('#3b82f6'); // default seed
    router.push('/generator');
  };

  return (
    <div className="flex-1 bg-sys-bg text-sys-text flex flex-col items-center px-4 relative overflow-y-auto select-none">
      {/* Background radial gradient overlay */}
      <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-zinc-950 to-zinc-950 -z-10" />

      {/* Hero Section */}
      <main className="max-w-5xl text-center space-y-8 py-24 z-10 w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-md text-xs text-zinc-400">
          <Sparkles className="h-3.5 w-3.5 text-brand-primary animate-pulse" />
          Introducing PaletteOS v1.5 — The Lighthouse for Colors
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent leading-[1.1]">
          Intelligent Color Systems<br />Built for Web Accessibility
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Generate perceptually uniform shade scales, audit accessibility in real-time, simulate color blindness, and export code directly to Tailwind, CSS, and mobile design systems.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button size="lg" className="gap-2 cursor-pointer" onClick={startGenerating}>
            Start Generator Canvas <ArrowRight className="h-4 w-4" />
          </Button>
          <Link href="/analyzer">
            <Button variant="outline" size="lg" className="cursor-pointer">
              Run Audit Matrix
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-24 text-left">
          <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800/80">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-2">
                <Sparkles className="h-5 w-5 text-brand-primary" />
              </div>
              <CardTitle>OKLCH Math Engine</CardTitle>
              <CardDescription>
                High-precision conversion models guaranteeing perceptual uniformity across generated shade scales.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800/80">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-2">
                <Eye className="h-5 w-5 text-emerald-400" />
              </div>
              <CardTitle>A11y Verification</CardTitle>
              <CardDescription>
                Full 11x11 contrast ratio checks matching WCAG 2.1 AA/AAA and APCA requirements alongside CVD simulation layers.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800/80">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-2">
                <Code className="h-5 w-5 text-purple-400" />
              </div>
              <CardTitle>Universal Exporters</CardTitle>
              <CardDescription>
                Dynamic code formatting outputs tailored for Tailwind CSS, root variables, Flutter, SwiftUI, and Compose tokens.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800/80">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2">
                <ShieldCheck className="h-5 w-5 text-blue-400" />
              </div>
              <CardTitle>Accessibility Auto-Fix</CardTitle>
              <CardDescription>
                Interactive lightness adjustments shifting failing swatches dynamically in OKLCH to reach WCAG contrast targets.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800/80">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-amber-400" />
              </div>
              <CardTitle>Collaboration Suite</CardTitle>
              <CardDescription>
                Track project review status, attach design comments, and manage local version checkpoints side-by-side.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800/80">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-zinc-500/10 flex items-center justify-center mb-2">
                <Terminal className="h-5 w-5 text-zinc-400" />
              </div>
              <CardTitle>Design Token Importer</CardTitle>
              <CardDescription>
                Paste CSS custom variables or raw JSON design token strings, parsing and validating colors in real-time.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="pt-28 text-left max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-zinc-200">What is the advantage of OKLCH?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Unlike HSL or RGB, OKLCH matches the human eye&apos;s perception of brightness (perceptual uniformity). This means adjusting lightness in OKLCH doesn&apos;t shift the perceived hue or saturation, resulting in highly consistent color systems.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-semibold text-zinc-200">Why use APCA instead of WCAG 2.1?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                APCA (Advanced Perceptual Contrast Algorithm) is the draft contrast algorithm for WCAG 3.0. It models contrast based on text weight, size, and background color, reflecting human legibility far better than the older WCAG 2.1 formulas.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-semibold text-zinc-200">Is PaletteOS fully open source?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Yes! PaletteOS is completely open source under the MIT license. You can deploy it locally, review its pure math engines, or contribute directly to its Github repository.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-zinc-900 pt-16 pb-8 text-xs text-zinc-600 flex items-center gap-1.5 justify-center">
          <Heart className="h-3.5 w-3.5 text-zinc-700" />
          <span>Made for designers and developers. Released under MIT license.</span>
        </footer>
      </main>
    </div>
  );
}
