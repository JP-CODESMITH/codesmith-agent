// Import the AgentTool type definition for the server-side tool interface
import type { AgentTool } from '../types'

// Terminal tool for executing shell commands in a sandboxed environment
export const terminalTool: AgentTool = {
  name: 'terminal', // Unique tool identifier
  description: 'Execute shell commands in a sandboxed environment', // What the tool does
  inputSchema: {
    type: 'object',
    properties: {
      command: { type: 'string' }, // The shell command to execute
      cwd: { type: 'string' },     // Working directory for the command
      timeout: { type: 'number' }, // Maximum execution time in milliseconds
    },
    required: ['command'], // Command is required
  },
  async execute(_input) {
    // TODO: Implement via sandbox layer - never execute directly on host
    throw new Error('Terminal tool not yet implemented')
  },
}
