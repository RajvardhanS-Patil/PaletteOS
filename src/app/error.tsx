'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ShieldAlert } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error internally
    console.error('System Exception:', error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 bg-sys-bg text-sys-text text-center select-none">
      <div className="max-w-md space-y-6">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
          <ShieldAlert className="h-6 w-6" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
          Something went wrong (500)
        </h1>

        <p className="text-sm text-zinc-400">
          A critical rendering exception occurred during color canvas math calculations.
        </p>

        <div className="flex justify-center gap-3">
          <Button size="sm" variant="secondary" className="cursor-pointer focus-ring" onClick={reset}>
            Reset View
          </Button>
          <Button size="sm" className="cursor-pointer focus-ring" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  );
}
