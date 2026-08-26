import type { AgentTool } from '../types'

export const terminalTool: AgentTool = {
  name: 'terminal',
  description: 'Execute shell commands in a sandboxed environment',
  inputSchema: {
    type: 'object',
    properties: {
      command: { type: 'string' },
      cwd: { type: 'string' },
      timeout: { type: 'number' },
    },
    required: ['command'],
  },
  async execute(_input) {
    // TODO: Implement via sandbox layer - never execute directly on host
    throw new Error('Terminal tool not yet implemented')
  },
}
