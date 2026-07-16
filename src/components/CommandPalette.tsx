'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Search, Sparkles, Settings, Eye, Moon, Sun, ArrowRight, ShieldCheck } from 'lucide-react';
import { usePaletteStore } from '@/store/usePaletteStore';
import { cn } from '@/utils/cn';

interface CommandItem {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  icon: any;
  action: () => void;
}

export default function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    seedColor,
    harmonyType,
    contrastStandard,
    theme,
    setSeedColor,
    setHarmonyType,
    setContrastStandard,
    setTheme,
  } = usePaletteStore();

  // Keyboard listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Global keybindings shortcuts when dialog is closed
  useEffect(() => {
    if (isOpen) return;

    const handleShortcuts = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'SELECT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'g':
          e.preventDefault();
          router.push('/generator');
          break;
        case 'a':
          e.preventDefault();
          router.push('/analyzer');
          break;
        case 'p':
          e.preventDefault();
          router.push('/playground');
          break;
        case 'e':
          e.preventDefault();
          router.push('/export');
          break;
        case 'r':
          e.preventDefault();
          const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
          setSeedColor(randomHex);
          break;
      }
    };

    window.addEventListener('keydown', handleShortcuts);
    return () => window.removeEventListener('keydown', handleShortcuts);
  }, [isOpen, router, setSeedColor]);

  // Command menu options list
  const getCommands = (): CommandItem[] => {
    const commands: CommandItem[] = [
      {
        id: 'nav-gen',
        category: 'Navigation',
        title: 'Go to Sandbox Generator',
        subtitle: 'Edit seed colors, locking rules, and shade outputs',
        icon: Sparkles,
        action: () => {
          router.push('/generator');
          setIsOpen(false);
        },
      },
      {
        id: 'nav-ana',
        category: 'Navigation',
        title: 'Go to Accessibility Analyzer',
        subtitle: 'Review luminance grids and CVD colorblindness simulations',
        icon: Eye,
        action: () => {
          router.push('/analyzer');
          setIsOpen(false);
        },
      },
      {
        id: 'nav-play',
        category: 'Navigation',
        title: 'Go to Component Playground',
        subtitle: 'Test palette variables in responsive dashboards',
        icon: Layout,
        action: () => {
          router.push('/playground');
          setIsOpen(false);
        },
      },
      {
        id: 'nav-exp',
        category: 'Navigation',
        title: 'Go to Exporter Center',
        subtitle: 'Download CSS, Tailwind, SCSS, and SwiftUI tokens',
        icon: ArrowRight,
        action: () => {
          router.push('/export');
          setIsOpen(false);
        },
      },
      {
        id: 'nav-set',
        category: 'Navigation',
        title: 'Go to Settings',
        subtitle: 'Toggle contrast checking targets',
        icon: Settings,
        action: () => {
          router.push('/settings');
          setIsOpen(false);
        },
      },
      {
        id: 'action-theme',
        category: 'Preferences',
        title: `Switch Theme to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
        subtitle: 'Toggle dark or light system wrapper variables',
        icon: theme === 'dark' ? Sun : Moon,
        action: () => {
          const next = theme === 'dark' ? 'light' : 'dark';
          setTheme(next);
          document.documentElement.setAttribute('data-theme', next);
          setIsOpen(false);
        },
      },
      {
        id: 'action-std-aa',
        category: 'Compliance',
        title: 'Set Contrast Standard: WCAG AA (4.5:1)',
        subtitle: 'Target AA relative threshold grading parameters',
        icon: ShieldCheck,
        action: () => {
          setContrastStandard('aa');
          setIsOpen(false);
        },
      },
      {
        id: 'action-std-aaa',
        category: 'Compliance',
        title: 'Set Contrast Standard: WCAG AAA (7.0:1)',
        subtitle: 'Target strict AAA relative threshold parameters',
        icon: ShieldCheck,
        action: () => {
          setContrastStandard('aaa');
          setIsOpen(false);
        },
      },
      {
        id: 'action-std-apca',
        category: 'Compliance',
        title: 'Set Contrast Standard: APCA Lc',
        subtitle: 'Target dynamic luminance calculations',
        icon: ShieldCheck,
        action: () => {
          setContrastStandard('apca');
          setIsOpen(false);
        },
      },
    ];

    // Check if query is a valid 6-char hex code (optionally starting with #)
    const hexPattern = /^#?([0-9a-fA-F]{6})$/;
    const match = query.match(hexPattern);
    if (match) {
      const hex = `#${match[1]}`;
      commands.unshift({
        id: 'custom-seed',
        category: 'Actions',
        title: `Set Seed Brand Color to ${hex.toUpperCase()}`,
        subtitle: 'Instantly generate new monochromatic/analogous swatches',
        icon: Sparkles,
        action: () => {
          setSeedColor(hex);
          setIsOpen(false);
        },
      });
    }

    return commands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(query.toLowerCase()) ||
        cmd.category.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filteredCommands = getCommands();

  // Handle arrow key select cycles
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      filteredCommands[selectedIndex]?.action();
    }
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[30%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-30%] rounded-lg border border-zinc-800 bg-zinc-950 shadow-2xl duration-150 flex flex-col focus:outline-none">
          {/* Search Input block */}
          <div className="flex items-center border-b border-zinc-850 px-4 shrink-0">
            <Search className="h-4 w-4 text-zinc-500 mr-3" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search actions or type a HEX value (e.g. #3b82f6)..."
              className="h-12 w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
              autoFocus
            />
            <kbd className="h-5 select-none items-center gap-0.5 rounded border border-zinc-800 bg-zinc-900 px-1.5 font-mono text-[10px] font-medium text-zinc-400 flex">
              ESC
            </kbd>
          </div>

          {/* Matches List */}
          <div className="max-h-[300px] overflow-y-auto p-2 space-y-0.5">
            {filteredCommands.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-500 font-mono">
                No matching workspace triggers found.
              </div>
            ) : (
              filteredCommands.map((cmd, idx) => {
                const Icon = cmd.icon;
                const isSelected = selectedIndex === idx;
                return (
                  <div
                    key={cmd.id}
                    onClick={cmd.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      'flex items-center gap-3.5 px-3 py-2.5 rounded-md cursor-pointer select-none transition-colors text-left',
                      isSelected ? 'bg-zinc-900 text-zinc-100' : 'text-zinc-400 hover:text-zinc-300'
                    )}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold">{cmd.title}</div>
                      {cmd.subtitle && (
                        <div className="text-[10px] text-zinc-500 mt-0.5">{cmd.subtitle}</div>
                      )}
                    </div>
                    {isSelected && (
                      <kbd className="ml-auto text-[9px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 border border-zinc-700">
                        ENTER
                      </kbd>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-zinc-850 p-2.5 flex items-center justify-between text-[10px] text-zinc-500 select-none">
            <span>Use ↑↓ arrows to navigate, Enter to select</span>
            <kbd className="font-mono text-[9px]">Cmd+K to close</kbd>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// Add Layout mock element definition
const Layout = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>
);
