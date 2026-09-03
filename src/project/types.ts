// Type definitions describing a detected project's shape and tooling.
// Consumed by the detector and session layers to reason about the workspace.

// Recognized project categories, keyed off config-file markers in the detector.
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

// Full snapshot of a project: where it lives, how it identifies itself, and the
// tooling/entry points the detector inferred. Optional fields are undefined when
// no matching marker was found.
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