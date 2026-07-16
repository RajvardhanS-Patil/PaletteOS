'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 bg-sys-bg text-sys-text text-center select-none">
      <div className="max-w-md space-y-6">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
          <AlertCircle className="h-6 w-6" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
          Page Not Found (404)
        </h1>
        
        <p className="text-sm text-zinc-400">
          The canvas or folder you are looking for has been moved, renamed, or does not exist.
        </p>

        <Link href="/">
          <Button size="sm" className="cursor-pointer focus-ring">
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
