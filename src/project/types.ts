export type ProjectType =
  | 'bun'
  | 'node'
  | 'typescript'
  | 'vite'
  | 'next'
  | 'python'
  | 'flutter'
  | 'docker'
  | 'git'

export interface ProjectContext {
  root: string;
  name: string;
  runtime?: string;
  language?: string;
  framework?: string;
  buildTool?: string;
  packageManager?: string;
  files: string[];

  types: ProjectType[];
  hasGit: boolean;
  entryPoints: string[];
  configFiles: string[];
}