// Import the helper function from the terminal tool to run git commands
import { executeCommandTool } from '../terminal'
// Import the Tool type for defining git tools
import type { Tool } from '../tool'

// Helper function to run a git command with a 30-second timeout
async function runGit(
  command: string, // The git command to run
  context: Parameters<typeof executeCommandTool.execute>[1], // The tool execution context
) {
  return executeCommandTool.execute({ command, timeoutMs: 30_000 }, context)
}

// Tool: Show the current git status (short format with branch info)
export const gitStatusTool: Tool<Record<string, never>, unknown> = {
  name: 'git.status', // Unique tool name
  description: 'Show current git status.',
  inputSchema: { type: 'object', properties: {} }, // No input parameters needed
  async execute(_input, context) {
    // Check if the user has permission to view git status
    context.permissions.assertAllowed({ kind: 'git:status', cwd: context.cwd })
    // Run the git status command
    return runGit('git status --short --branch', context)
  },
}

// Tool: Show the current git diff (staged or unstaged)
export const gitDiffTool: Tool<{ staged?: boolean }, unknown> = {
  name: 'git.diff',
  description: 'Show current git diff without modifying work.',
  inputSchema: {
    type: 'object',
    properties: { staged: { type: 'boolean' } }, // Optional: show staged diff instead of unstaged
  },
  async execute(input, context) {
    // Check permissions
    context.permissions.assertAllowed({ kind: 'git:diff', cwd: context.cwd })
    // Run the appropriate diff command based on the staged flag
    return runGit(input.staged ? 'git diff --staged' : 'git diff', context)
  },
}

// Tool: Show recent git commit history
export const gitLogTool: Tool<{ limit?: number }, unknown> = {
  name: 'git.log',
  description: 'Show recent git commits.',
  inputSchema: {
    type: 'object',
    properties: { limit: { type: 'number' } }, // Optional: number of commits to show
  },
  async execute(input, context) {
    // Check permissions
    context.permissions.assertAllowed({ kind: 'git:log', cwd: context.cwd })
    // Clamp the limit between 1 and 50 for safety
    const limit = Math.max(1, Math.min(input.limit ?? 10, 50))
    // Run the git log command
    return runGit(`git log --oneline -${limit}`, context)
  },
}

// Tool: Show all local git branches
export const gitBranchTool: Tool<Record<string, never>, unknown> = {
  name: 'git.branch',
  description: 'Show local git branches.',
  inputSchema: { type: 'object', properties: {} }, // No input parameters needed
  async execute(_input, context) {
    // Check permissions
    context.permissions.assertAllowed({ kind: 'git:branch', cwd: context.cwd })
    // Run the git branch command to show current branch and all branches
    return runGit('git branch --show-current && git branch --list', context)
  },
}

// Bundle all git tools into an array for easy registration
export const gitTools = [gitStatusTool, gitDiffTool, gitLogTool, gitBranchTool]
