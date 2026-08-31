import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { ProjectContext, ProjectType } from './context'

const projectMarkers: Array<{ file: string; type: ProjectType }> = [
  { file: 'bun.lock', type: 'bun' },
  { file: 'package.json', type: 'node' },
  { file: 'tsconfig.json', type: 'typescript' },
  { file: 'vite.config.ts', type: 'vite' },
  { file: 'vite.config.js', type: 'vite' },
  { file: 'next.config.ts', type: 'next' },
  { file: 'next.config.js', type: 'next' },
  { file: 'pyproject.toml', type: 'python' },
  { file: 'requirements.txt', type: 'python' },
  { file: 'pubspec.yaml', type: 'flutter' },
  { file: 'Dockerfile', type: 'docker' },
  { file: 'docker-compose.yml', type: 'docker' },
  { file: '.git', type: 'git' },
]

const entryPointCandidates = [
  'src/index.ts',
  'src/router.tsx',
  'src/routes/index.tsx',
  'src/server/agent/agent.ts',
]

export function detectProject(projectRoot = process.cwd()): ProjectContext {
  const root = resolve(projectRoot)
  const configFiles: string[] = []
  const types = new Set<ProjectType>()

  for (const marker of projectMarkers) {
    if (existsSync(join(root, marker.file))) {
      configFiles.push(marker.file)
      types.add(marker.type)
    }
  }

  const entryPoints = entryPointCandidates.filter((candidate) =>
    existsSync(join(root, candidate)),
  )

  return {
    root,
    types: Array.from(types),
    packageManager: existsSync(join(root, 'bun.lock')) ? 'bun' : undefined,
    hasGit: existsSync(join(root, '.git')),
    entryPoints,
    configFiles,
  }
}
