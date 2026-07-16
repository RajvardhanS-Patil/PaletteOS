'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { User, ShieldAlert } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="flex-1 bg-sys-bg p-8 max-w-2xl w-full mx-auto space-y-8 overflow-y-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2 select-none">
          <User className="h-6 w-6 text-brand-primary" />
          Account Profile
        </h1>
        <p className="text-sm text-zinc-400 mt-1 select-none">
          Manage your subscription and local settings.
        </p>
      </div>

      <Card className="border-zinc-800 bg-zinc-950 select-none">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl font-bold text-zinc-400">
              G
            </div>
            <div>
              <CardTitle>Guest Developer</CardTitle>
              <CardDescription>Local Sandbox Mode</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 border-t border-zinc-900 mt-4 space-y-4 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500 font-medium">Subscription Level</span>
            <Badge variant="secondary">Free Sandbox Plan</Badge>
          </div>
          
          <div className="flex items-center gap-3 p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/40 text-xs text-zinc-400 leading-relaxed">
            <ShieldAlert className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span>You are currently in guest sandbox mode. Sign in to activate Postgres sync saves.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
