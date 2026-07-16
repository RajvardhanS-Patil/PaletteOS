import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ArrowLeft, BookOpen, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface PageProps {
  searchParams: Promise<{ file?: string }>;
}

export default async function DocsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const docsDirectory = path.join(process.cwd(), 'docs');
  
  // Read all markdown files inside /docs
  let docFiles: string[] = [];
  try {
    docFiles = fs
      .readdirSync(docsDirectory)
      .filter((file) => file.endsWith('.md'))
      .sort();
  } catch (err) {
    console.error('Failed to read docs folder:', err);
  }

  // Determine active document
  const activeFile = resolvedParams.file || 'PROJECT_OVERVIEW.md';
  let fileContent = 'Select a document to review the platform specifications.';

  // Security Verification: Prevent Path Traversal
  const safeFilename = path.basename(activeFile);
  const targetFilePath = path.join(docsDirectory, safeFilename);

  if (docFiles.includes(safeFilename) && fs.existsSync(targetFilePath)) {
    try {
      fileContent = fs.readFileSync(targetFilePath, 'utf-8');
    } catch {
      fileContent = 'Failed to load document content.';
    }
  } else if (resolvedParams.file) {
    fileContent = 'Access Denied: Invalid document path.';
  }

  return (
    <div className="flex-1 flex flex-col bg-sys-bg text-sys-text">
      {/* Sub header nav */}
      <div className="h-12 border-b border-zinc-800 bg-zinc-950 flex items-center px-6 select-none shrink-0 gap-3">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer font-medium">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
        </Link>
        <div className="h-4 w-px bg-zinc-800" />
        <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-brand-primary" /> Platform Constitutional Docs
        </span>
      </div>

      <div className="flex-1 grid md:grid-cols-[260px_1fr] overflow-hidden">
        {/* Sidebar doc selector */}
        <aside className="border-r border-zinc-800 bg-zinc-950 p-4 space-y-4 flex flex-col overflow-y-auto shrink-0 select-none">
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            Specification Files
          </span>
          <div className="space-y-1">
            {docFiles.map((file) => {
              const isActive = activeFile === file;
              const cleanName = file.replace('.md', '').replace(/_/g, ' ');
              return (
                <Link key={file} href={`/docs?file=${file}`}>
                  <span
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-zinc-900 text-zinc-100 border border-zinc-850'
                        : 'text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200'
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span className="truncate capitalize">{cleanName.toLowerCase()}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Content Viewer Canvas */}
        <main className="p-8 overflow-y-auto bg-zinc-900/10">
          <Card className="border-zinc-800 bg-zinc-950/80 p-8 max-w-3xl mx-auto shadow-2xl">
            <CardHeader className="border-b border-zinc-900 pb-4 select-none mb-6">
              <div className="text-xs text-brand-primary font-mono font-semibold uppercase tracking-wider mb-1">
                Active Specification File
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-zinc-100 uppercase">
                {activeFile.replace('.md', '').replace(/_/g, ' ')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="prose prose-invert prose-xs max-w-none text-zinc-300 font-sans leading-relaxed whitespace-pre-wrap">
                {fileContent}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
