import type { AgentTool } from '../types'

export const fileTool: AgentTool = {
  name: 'file',
  description: 'Read, write, or list files in the workspace',
  inputSchema: {
    type: 'object',
    properties: {
      action: { type: 'string', enum: ['read', 'write', 'list'] },
      path: { type: 'string' },
      content: { type: 'string' },
    },
    required: ['action', 'path'],
  },
  async execute(_input) {
    // TODO: Implement file operations via sandbox
    throw new Error('File tool not yet implemented')
  },
}
