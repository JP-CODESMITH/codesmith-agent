// Import the AgentTool type definition for the server-side tool interface
import type { AgentTool } from '../types'

// File operations tool for reading, writing, and listing files in the workspace
export const fileTool: AgentTool = {
  name: 'file', // Unique tool identifier
  description: 'Read, write, or list files in the workspace', // What the tool does
  inputSchema: {
    type: 'object',
    properties: {
      action: { type: 'string', enum: ['read', 'write', 'list'] }, // Supported file actions
      path: { type: 'string' },     // The file or directory path
      content: { type: 'string' },   // Content to write (used with 'write' action)
    },
    required: ['action', 'path'], // Both action and path are required
  },
  async execute(_input) {
    // TODO: Implement file operations via sandbox
    throw new Error('File tool not yet implemented')
  },
}
