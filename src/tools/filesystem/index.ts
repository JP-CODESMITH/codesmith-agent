// Import filesystem utilities for checking file existence and reading directories/files
import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
// Import path utilities for joining and resolving file paths
import { join, resolve } from 'node:path'
// Import the Tool type for defining filesystem tools
import type { Tool } from '../tool'

// Directories that should be skipped when searching or listing files
const ignoredDirectories = new Set([
  '.git', // Git metadata
  'node_modules', // Dependencies
  'dist', // Build output
  '.output', // Another build output directory
  '.tanstack', // TanStack Router cache
])

// Check if a target path is within the workspace boundary to prevent path traversal attacks
function isInsideWorkspace(workspace: string, target: string): boolean {
  const root = resolve(workspace) // Resolve the workspace root to an absolute path
  const resolved = resolve(root, target) // Resolve the target path relative to the workspace root
  // The target is inside the workspace if it equals the root or starts with root/
  return resolved === root || resolved.startsWith(`${root}/`)
}

// Tool: List all files and directories inside a given path within the project
export const listDirectoryTool: Tool<
  { path?: string }, // Optional path to list; defaults to current directory
  { path: string; entries: string[] } // Returns the path and list of entries
> = {
  name: 'filesystem.list', // Unique tool name
  description: 'List files and directories inside the current project.',
  inputSchema: {
    type: 'object',
    properties: { path: { type: 'string' } },
  },
  async execute(input, context) {
    const target = input.path ?? '.' // Default to current directory if no path provided
    // Security check: ensure the target path is within the workspace
    if (!isInsideWorkspace(context.cwd, target)) {
      return { ok: false, error: 'Path is outside the current project.' }
    }

    // Check permissions before proceeding
    context.permissions.assertAllowed({
      kind: 'filesystem:list',
      path: target,
      cwd: context.cwd,
    })

    // Read the directory entries and return them
    const entries = await readdir(resolve(context.cwd, target))
    return { ok: true, output: { path: target, entries } }
  },
}

// Tool: Read the contents of a UTF-8 file within the project
export const readFileTool: Tool<
  { path: string }, // Required path to the file to read
  { path: string; content: string } // Returns the file path and its content
> = {
  name: 'filesystem.read',
  description: 'Read a UTF-8 file inside the current project.',
  inputSchema: {
    type: 'object',
    properties: { path: { type: 'string' } },
    required: ['path'],
  },
  async execute(input, context) {
    // Security check: ensure the file is within the workspace
    if (!isInsideWorkspace(context.cwd, input.path)) {
      return { ok: false, error: 'Path is outside the current project.' }
    }

    // Check permissions before reading
    context.permissions.assertAllowed({
      kind: 'filesystem:read',
      path: input.path,
      cwd: context.cwd,
    })

    // Read the file as UTF-8 text and return its contents
    const content = await readFile(resolve(context.cwd, input.path), 'utf8')
    return { ok: true, output: { path: input.path, content } }
  },
}

// Tool: Check whether a file or directory exists at the given path
export const fileExistsTool: Tool<
  { path: string }, // Required path to check
  { path: string; exists: boolean } // Returns the path and whether it exists
> = {
  name: 'filesystem.exists',
  description: 'Check whether a file or directory exists inside the project.',
  inputSchema: {
    type: 'object',
    properties: { path: { type: 'string' } },
    required: ['path'],
  },
  async execute(input, context) {
    // Security check: ensure the path is within the workspace
    if (!isInsideWorkspace(context.cwd, input.path)) {
      return { ok: false, error: 'Path is outside the current project.' }
    }

    // Check permissions before checking existence
    context.permissions.assertAllowed({
      kind: 'filesystem:exists',
      path: input.path,
      cwd: context.cwd,
    })

    // Check if the file/directory exists and return the result
    return {
      ok: true,
      output: { path: input.path, exists: existsSync(resolve(context.cwd, input.path)) },
    }
  },
}

// Tool: Search for files by name within the project, skipping ignored directories
export const searchFilesTool: Tool<
  { query: string; path?: string }, // Search query and optional starting path
  { matches: string[] } // Returns an array of matching file paths
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
    const base = input.path ?? '.' // Default search path is current directory
    // Security check: ensure the search base is within the workspace
    if (!isInsideWorkspace(context.cwd, base)) {
      return { ok: false, error: 'Path is outside the current project.' }
    }

    // Check permissions before searching
    context.permissions.assertAllowed({
      kind: 'filesystem:search',
      path: base,
      cwd: context.cwd,
    })

    const matches: string[] = [] // Array to collect matching file paths
    const lowerQuery = input.query.toLowerCase() // Case-insensitive search

    // Recursive function to walk the directory tree
    async function walk(relativePath: string): Promise<void> {
      const entries = await readdir(resolve(context.cwd, relativePath), {
        withFileTypes: true, // Get file type info for each entry
      })

      for (const entry of entries) {
        // Skip ignored directories
        if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue

        const childPath = join(relativePath, entry.name) // Build the child path
        // If the file/directory name contains the search query, add it to matches
        if (entry.name.toLowerCase().includes(lowerQuery)) {
          matches.push(childPath)
        }

        // Recurse into subdirectories
        if (entry.isDirectory()) {
          await walk(childPath)
        }
      }
    }

    await walk(base) // Start the recursive walk from the base path
    return { ok: true, output: { matches } }
  },
}

// Bundle all filesystem tools into an array for easy registration
export const filesystemTools = [
  listDirectoryTool,
  readFileTool,
  searchFilesTool,
  fileExistsTool,
]
