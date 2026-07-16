'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LayoutGrid, FolderPlus, Compass, History, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const projects = [
    {
      id: 'proj-alpha',
      name: 'Project Alpha (B2B SaaS Portal)',
      colorsCount: 11,
      healthScore: 94,
      lastUpdated: '2 hours ago',
      color: '#3b82f6',
    },
    {
      id: 'proj-beta',
      name: 'Project Beta (Marketing Campaign)',
      colorsCount: 5,
      healthScore: 86,
      lastUpdated: '1 day ago',
      color: '#ec4899',
    },
  ];

  return (
    <div className="flex-1 bg-sys-bg p-8 max-w-5xl w-full mx-auto space-y-8 overflow-y-auto">
      <div className="flex justify-between items-center select-none">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-brand-primary" />
            Your Workspaces Dashboard
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage projects, review contrast matrices, and sync color tokens.
          </p>
        </div>

        <Link href="/generator">
          <Button className="gap-2 focus-ring cursor-pointer">
            <FolderPlus className="h-4 w-4" /> New Project
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Projects List Grid */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
            Active Projects ({projects.length})
          </h2>

          <div className="grid gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="border-zinc-800 bg-zinc-950 hover:bg-zinc-900/40 transition-all select-none">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-4 w-4 rounded-full border border-black/10 flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                    <CardTitle className="text-sm font-semibold">{project.name}</CardTitle>
                  </div>
                  <Badge variant={project.healthScore >= 90 ? 'success' : 'warning'}>
                    Score: {project.healthScore}
                  </Badge>
                </CardHeader>
                <CardContent className="flex justify-between items-center text-xs text-zinc-400">
                  <div>
                    Shades count: {project.colorsCount} • Updated {project.lastUpdated}
                  </div>
                  <Link href="/generator">
                    <span className="text-brand-primary font-medium hover:underline cursor-pointer flex items-center gap-0.5">
                      Open in Canvas →
                    </span>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar panels */}
        <div className="space-y-6">
          {/* Quick Sandbox panel */}
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-brand-primary" />
                Color Sandbox
              </CardTitle>
              <CardDescription>
                Test modifications on a temporary workspace without saving.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/generator">
                <Button variant="outline" className="w-full text-xs h-8 border-zinc-800 text-zinc-300 hover:text-zinc-100">
                  Open Sandboxed Canvas
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Activity log */}
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <History className="h-4 w-4 text-brand-primary" />
                Revision Activity
              </CardTitle>
              <CardDescription>
                Track recent saves and updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs text-zinc-400">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-zinc-300">Scale generated</div>
                  <div>Base seed #3B82F6 mapped</div>
                </div>
                <span className="text-[10px] text-zinc-500">2h ago</span>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-zinc-300">Project created</div>
                  <div>Alpha brand kit initialized</div>
                </div>
                <span className="text-[10px] text-zinc-500">1d ago</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
