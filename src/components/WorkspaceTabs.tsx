'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sliders, Activity, MonitorPlay, Download } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function WorkspaceTabs() {
  const pathname = usePathname();

  const tabs = [
    { label: 'Palette Generator', path: '/generator', icon: Sliders },
    { label: 'Accessibility Analyzer', path: '/analyzer', icon: Activity },
    { label: 'Component Playground', path: '/playground', icon: MonitorPlay },
    { label: 'Export Tokens', path: '/export', icon: Download },
  ];

  return (
    <div className="h-12 border-b border-zinc-800 bg-zinc-950 flex items-center justify-center gap-1 select-none px-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.path;
        return (
          <Link key={tab.path} href={tab.path} className="flex">
            <span
              className={cn(
                'inline-flex items-center gap-2 px-4 h-9 rounded-md text-sm font-medium transition-colors hover:text-zinc-100 cursor-pointer select-none',
                isActive
                  ? 'bg-zinc-900 text-zinc-100 shadow-sm border border-zinc-800'
                  : 'text-zinc-400 border border-transparent'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
