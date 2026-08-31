import { executeCommandTool } from '../terminal'
import type { Tool } from '../tool'

async function runGit(
  command: string,
  context: Parameters<typeof executeCommandTool.execute>[1],
) {
  return executeCommandTool.execute({ command, timeoutMs: 30_000 }, context)
}

export const gitStatusTool: Tool<Record<string, never>, unknown> = {
  name: 'git.status',
  description: 'Show current git status.',
  inputSchema: { type: 'object', properties: {} },
  async execute(_input, context) {
    context.permissions.assertAllowed({ kind: 'git:status', cwd: context.cwd })
    return runGit('git status --short --branch', context)
  },
}

export const gitDiffTool: Tool<{ staged?: boolean }, unknown> = {
  name: 'git.diff',
  description: 'Show current git diff without modifying work.',
  inputSchema: {
    type: 'object',
    properties: { staged: { type: 'boolean' } },
  },
  async execute(input, context) {
    context.permissions.assertAllowed({ kind: 'git:diff', cwd: context.cwd })
    return runGit(input.staged ? 'git diff --staged' : 'git diff', context)
  },
}

export const gitLogTool: Tool<{ limit?: number }, unknown> = {
  name: 'git.log',
  description: 'Show recent git commits.',
  inputSchema: {
    type: 'object',
    properties: { limit: { type: 'number' } },
  },
  async execute(input, context) {
    context.permissions.assertAllowed({ kind: 'git:log', cwd: context.cwd })
    const limit = Math.max(1, Math.min(input.limit ?? 10, 50))
    return runGit(`git log --oneline -${limit}`, context)
  },
}

export const gitBranchTool: Tool<Record<string, never>, unknown> = {
  name: 'git.branch',
  description: 'Show local git branches.',
  inputSchema: { type: 'object', properties: {} },
  async execute(_input, context) {
    context.permissions.assertAllowed({ kind: 'git:branch', cwd: context.cwd })
    return runGit('git branch --show-current && git branch --list', context)
  },
}

export const gitTools = [gitStatusTool, gitDiffTool, gitLogTool, gitBranchTool]
