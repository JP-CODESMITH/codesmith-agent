// Import the AgentTool type definition for the server-side tool interface
import type { AgentTool } from '../types'

// Web search tool for querying the internet for information
export const searchTool: AgentTool = {
  name: 'search', // Unique tool identifier
  description: 'Search the web for information', // What the tool does
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string' },       // The search query string
      numResults: { type: 'number' },   // Number of results to return
    },
    required: ['query'], // Query is required
  },
  async execute(_input) {
    // TODO: Implement web search integration
    throw new Error('Search tool not yet implemented')
  },
}
