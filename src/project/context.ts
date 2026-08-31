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
  root: string
  types: ProjectType[]
  packageManager?: 'bun' | 'npm' | 'pnpm' | 'yarn'
  hasGit: boolean
  entryPoints: string[]
  configFiles: string[]
}
