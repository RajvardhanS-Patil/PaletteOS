'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useHydration } from '@/hooks/useHydration';
import {
  LayoutGrid,
  FolderPlus,
  Folder,
  Plus,
  Trash2,
  Compass,
  History,
  FileSpreadsheet,
} from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  seedColor: string;
  healthScore: number;
  updatedAt: string;
}

interface WorkspaceFolder {
  id: string;
  name: string;
  projects: Project[];
}

const DEFAULT_FOLDERS: WorkspaceFolder[] = [
  {
    id: 'fld-saas',
    name: 'B2B SaaS Portals',
    projects: [
      {
        id: 'proj-alpha',
        name: 'Project Alpha Design System',
        seedColor: '#3b82f6',
        healthScore: 94,
        updatedAt: '2 hours ago',
      },
    ],
  },
  {
    id: 'fld-marketing',
    name: 'Marketing Campaigns',
    projects: [
      {
        id: 'proj-beta',
        name: 'Summer Campaign Splash',
        seedColor: '#ec4899',
        healthScore: 86,
        updatedAt: '1 day ago',
      },
    ],
  },
];

export default function DashboardPage() {
  const hydrated = useHydration();
  const [folders, setFolders] = useState<WorkspaceFolder[]>([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newProjectNames, setNewProjectNames] = useState<Record<string, string>>({});

  // Load from local storage
  useEffect(() => {
    if (!hydrated) return;
    const stored = localStorage.getItem('paletteos-folders');
    if (stored) {
      try {
        setFolders(JSON.parse(stored));
      } catch {
        setFolders(DEFAULT_FOLDERS);
      }
    } else {
      setFolders(DEFAULT_FOLDERS);
      localStorage.setItem('paletteos-folders', JSON.stringify(DEFAULT_FOLDERS));
    }
  }, [hydrated]);

  const saveFolders = (updated: WorkspaceFolder[]) => {
    setFolders(updated);
    localStorage.setItem('paletteos-folders', JSON.stringify(updated));
  };

  const addFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: WorkspaceFolder = {
      id: `fld-${Date.now()}`,
      name: newFolderName.trim(),
      projects: [],
    };
    const updated = [...folders, newFolder];
    saveFolders(updated);
    setNewFolderName('');
    setShowAddFolder(false);
  };

  const deleteFolder = (folderId: string) => {
    const updated = folders.filter((f) => f.id !== folderId);
    saveFolders(updated);
  };

  const addProject = (folderId: string) => {
    const projName = newProjectNames[folderId];
    if (!projName || !projName.trim()) return;

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: projName.trim(),
      seedColor: '#3b82f6',
      healthScore: 100,
      updatedAt: 'Just now',
    };

    const updated = folders.map((f) => {
      if (f.id === folderId) {
        return { ...f, projects: [...f.projects, newProj] };
      }
      return f;
    });

    saveFolders(updated);
    setNewProjectNames({ ...newProjectNames, [folderId]: '' });
  };

  const deleteProject = (folderId: string, projectId: string) => {
    const updated = folders.map((f) => {
      if (f.id === folderId) {
        return { ...f, projects: f.projects.filter((p) => p.id !== projectId) };
      }
      return f;
    });
    saveFolders(updated);
  };

  if (!hydrated) {
    return (
      <div className="flex-1 bg-sys-bg p-8 max-w-5xl w-full mx-auto flex items-center justify-center">
        <div className="text-zinc-500 font-mono text-sm animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-sys-bg p-8 max-w-5xl w-full mx-auto space-y-8 overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-brand-primary" />
            Your Workspaces Dashboard
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Group scales into project directories and review contrast standards.
          </p>
        </div>

        <Button className="gap-2 focus-ring cursor-pointer" onClick={() => setShowAddFolder(!showAddFolder)}>
          <FolderPlus className="h-4 w-4" /> Add Category Folder
        </Button>
      </div>

      {showAddFolder && (
        <Card className="border-zinc-800 bg-zinc-950 max-w-md p-4 space-y-3">
          <CardTitle className="text-sm">Create Workspace Folder</CardTitle>
          <div className="flex gap-2">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="e.g. Mobile Apps"
              className="h-9"
            />
            <Button size="sm" onClick={addFolder}>Create</Button>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Workspace folders list */}
        <div className="md:col-span-2 space-y-8">
          {folders.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-800 rounded-lg text-zinc-500 text-sm">
              Create a category folder to begin organizing palettes.
            </div>
          ) : (
            folders.map((folder) => (
              <div key={folder.id} className="space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
                  <h2 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                    <Folder className="h-4 w-4 text-brand-primary" />
                    {folder.name}
                    <span className="text-xs text-zinc-500 font-mono">({folder.projects.length})</span>
                  </h2>
                  <button
                    onClick={() => deleteFolder(folder.id)}
                    className="text-zinc-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                    title="Delete Folder"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid gap-3">
                  {folder.projects.map((project) => (
                    <Card
                      key={project.id}
                      className="border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40 p-4 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-3.5 w-3.5 rounded-full border border-black/10 flex-shrink-0"
                            style={{ backgroundColor: project.seedColor }}
                          />
                          <div>
                            <span className="font-semibold text-sm text-zinc-100">{project.name}</span>
                            <div className="text-xs text-zinc-500 mt-0.5">Updated {project.updatedAt}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge variant={project.healthScore >= 90 ? 'success' : 'warning'}>
                            Score: {project.healthScore}
                          </Badge>
                          <button
                            onClick={() => deleteProject(folder.id, project.id)}
                            className="text-zinc-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end pt-3 border-t border-zinc-850/50 mt-3">
                        <Link href="/generator">
                          <span className="text-xs text-brand-primary hover:underline font-semibold cursor-pointer">
                            Load in Sandbox →
                          </span>
                        </Link>
                      </div>
                    </Card>
                  ))}

                  {/* Add Project Inline Form */}
                  <div className="flex gap-2 p-2 border border-dashed border-zinc-800 rounded-lg bg-zinc-950/20">
                    <Input
                      placeholder="Add palette project name..."
                      value={newProjectNames[folder.id] || ''}
                      onChange={(e) =>
                        setNewProjectNames({ ...newProjectNames, [folder.id]: e.target.value })
                      }
                      className="h-8 text-xs bg-zinc-900/20"
                    />
                    <Button
                      size="sm"
                      className="h-8 gap-1 text-xs"
                      onClick={() => addProject(folder.id)}
                    >
                      <Plus className="h-3 w-3" /> Add Project
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
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
