import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import type { Tool } from '../tool'

const ignoredDirectories = new Set([
  '.git',
  'node_modules',
  'dist',
  '.output',
  '.tanstack',
])

function isInsideWorkspace(workspace: string, target: string): boolean {
  const root = resolve(workspace)
  const resolved = resolve(root, target)
  return resolved === root || resolved.startsWith(`${root}/`)
}

export const listDirectoryTool: Tool<
  { path?: string },
  { path: string; entries: string[] }
> = {
  name: 'filesystem.list',
  description: 'List files and directories inside the current project.',
  inputSchema: {
    type: 'object',
    properties: { path: { type: 'string' } },
  },
  async execute(input, context) {
    const target = input.path ?? '.'
    if (!isInsideWorkspace(context.cwd, target)) {
      return { ok: false, error: 'Path is outside the current project.' }
    }

    context.permissions.assertAllowed({
      kind: 'filesystem:list',
      path: target,
      cwd: context.cwd,
    })

    const entries = await readdir(resolve(context.cwd, target))
    return { ok: true, output: { path: target, entries } }
  },
}

export const readFileTool: Tool<
  { path: string },
  { path: string; content: string }
> = {
  name: 'filesystem.read',
  description: 'Read a UTF-8 file inside the current project.',
  inputSchema: {
    type: 'object',
    properties: { path: { type: 'string' } },
    required: ['path'],
  },
  async execute(input, context) {
    if (!isInsideWorkspace(context.cwd, input.path)) {
      return { ok: false, error: 'Path is outside the current project.' }
    }

    context.permissions.assertAllowed({
      kind: 'filesystem:read',
      path: input.path,
      cwd: context.cwd,
    })

    const content = await readFile(resolve(context.cwd, input.path), 'utf8')
    return { ok: true, output: { path: input.path, content } }
  },
}

export const fileExistsTool: Tool<
  { path: string },
  { path: string; exists: boolean }
> = {
  name: 'filesystem.exists',
  description: 'Check whether a file or directory exists inside the project.',
  inputSchema: {
    type: 'object',
    properties: { path: { type: 'string' } },
    required: ['path'],
  },
  async execute(input, context) {
    if (!isInsideWorkspace(context.cwd, input.path)) {
      return { ok: false, error: 'Path is outside the current project.' }
    }

    context.permissions.assertAllowed({
      kind: 'filesystem:exists',
      path: input.path,
      cwd: context.cwd,
    })

    return {
      ok: true,
      output: { path: input.path, exists: existsSync(resolve(context.cwd, input.path)) },
    }
  },
}

export const searchFilesTool: Tool<
  { query: string; path?: string },
  { matches: string[] }
> = {
  name: 'filesystem.search',
  description: 'Search project file names without scanning dependency folders.',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string' },
      path: { type: 'string' },
    },
    required: ['query'],
  },
  async execute(input, context) {
    const base = input.path ?? '.'
    if (!isInsideWorkspace(context.cwd, base)) {
      return { ok: false, error: 'Path is outside the current project.' }
    }

    context.permissions.assertAllowed({
      kind: 'filesystem:search',
      path: base,
      cwd: context.cwd,
    })

    const matches: string[] = []
    const lowerQuery = input.query.toLowerCase()

    async function walk(relativePath: string): Promise<void> {
      const entries = await readdir(resolve(context.cwd, relativePath), {
        withFileTypes: true,
      })

      for (const entry of entries) {
        if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue

        const childPath = join(relativePath, entry.name)
        if (entry.name.toLowerCase().includes(lowerQuery)) {
          matches.push(childPath)
        }

        if (entry.isDirectory()) {
          await walk(childPath)
        }
      }
    }

    await walk(base)
    return { ok: true, output: { matches } }
  },
}

export const filesystemTools = [
  listDirectoryTool,
  readFileTool,
  searchFilesTool,
  fileExistsTool,
]
