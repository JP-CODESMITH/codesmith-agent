import { existsSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
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

function detectRuntime(files: string[]): string | undefined {
  if (files.includes('bun.lock')) return 'bun'
  if (files.includes('package.json')) return 'node'
  return undefined
}

function detectLanguage(files: string[]): string | undefined {
  if (files.includes('tsconfig.json')) return 'typescript'
  if (files.includes('package.json')) return 'javascript'
  if (files.includes('pyproject.toml') || files.includes('requirements.txt')) {
    return 'python'
  }
  if (files.includes('pubspec.yaml')) return 'dart'
  return undefined
}

function detectFramework(files: string[]): string | undefined {
  if (files.some((file) => file.startsWith('vite.config.'))) return 'vite'
  if (files.some((file) => file.startsWith('next.config.'))) return 'next'
  if (files.includes('pubspec.yaml')) return 'flutter'
  return undefined
}

function detectBuildTool(files: string[]): string | undefined {
  if (files.some((file) => file.startsWith('vite.config.'))) return 'vite'
  if (files.includes('Dockerfile') || files.includes('docker-compose.yml')) {
    return 'docker'
  }
  return undefined
}

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
    name: basename(root),
    runtime: detectRuntime(configFiles),
    language: detectLanguage(configFiles),
    framework: detectFramework(configFiles),
    buildTool: detectBuildTool(configFiles),
    files: configFiles,
    types: Array.from(types),
    packageManager: existsSync(join(root, 'bun.lock')) ? 'bun' : undefined,
    hasGit: existsSync(join(root, '.git')),
    entryPoints,
    configFiles,
  }
}
