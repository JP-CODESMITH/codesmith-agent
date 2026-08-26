import type { AgentTool } from '../types'

export const searchTool: AgentTool = {
  name: 'search',
  description: 'Search the web for information',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string' },
      numResults: { type: 'number' },
    },
    required: ['query'],
  },
  async execute(_input) {
    // TODO: Implement web search integration
    throw new Error('Search tool not yet implemented')
  },
}
