'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, LayoutDashboard, Settings, Moon, Sun } from 'lucide-react';
import { usePaletteStore } from '@/store/usePaletteStore';
import { cn } from '@/utils/cn';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = usePaletteStore();

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const navItems = [
    { label: 'Sandbox', path: '/generator', icon: Sparkles },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="h-16 border-b border-zinc-800 bg-zinc-950/70 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 select-none">
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="h-8 w-8 rounded-lg bg-brand-primary flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform">
          <Sparkles className="h-4.5 w-4.5 text-zinc-100" />
        </div>
        <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
          PaletteOS
        </span>
      </Link>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.path);
            return (
              <Link key={item.path} href={item.path}>
                <span
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover:text-zinc-100 cursor-pointer',
                    isActive ? 'text-zinc-100 bg-zinc-900' : 'text-zinc-400'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="h-4 w-px bg-zinc-800" />

        <button
          onClick={toggleTheme}
          className="h-9 w-9 rounded-md flex items-center justify-center border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100 transition-colors focus-ring cursor-pointer"
          aria-label="Toggle visual theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </nav>
  );
}
