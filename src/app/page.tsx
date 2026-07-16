'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Eye, Code, ArrowRight } from 'lucide-react';
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
    <div className="flex-1 bg-sys-bg text-sys-text flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background radial gradient overlay */}
      <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-zinc-950 to-zinc-950 -z-10" />

      <main className="max-w-4xl text-center space-y-8 py-20 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-md text-xs text-zinc-400 select-none">
          <Sparkles className="h-3.5 w-3.5 text-brand-primary" />
          Introducing PaletteOS v1.0 — The Lighthouse for Colors
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          Intelligent Color Systems<br />Built for Accessibility
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Generate harmonious palettes, audit compliance in real-time, simulate color blindness, and export code directly to Tailwind, CSS variables, and design tokens.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="gap-2" onClick={startGenerating}>
            Start Generating <ArrowRight className="h-4 w-4" />
          </Button>
          <Link href="/generator">
            <Button variant="outline" size="lg">
              Sandbox Canvas
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 pt-16">
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
                Full 10x10 contrast ratio check matching WCAG 2.1 and APCA requirements alongside CVD simulators.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800/80">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-2">
                <Code className="h-5 w-5 text-purple-400" />
              </div>
              <CardTitle>Token Exporter</CardTitle>
              <CardDescription>
                Dynamic code formatting outputs tailored for immediate Tailwind CSS extensions, custom root variables, and JSON design tokens.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}
