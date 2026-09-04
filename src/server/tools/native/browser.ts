// Import the AgentTool type definition for the server-side tool interface
import type { AgentTool } from '../types'

// Browser automation tool for navigating and interacting with web pages
export const browserTool: AgentTool = {
  name: 'browser', // Unique tool identifier
  description: 'Automate browser interactions to navigate and extract data', // What the tool does
  inputSchema: {
    type: 'object',
    properties: {
      action: { type: 'string', enum: ['navigate', 'click', 'extract', 'screenshot'] }, // Supported browser actions
      url: { type: 'string' }, // The URL to navigate to
      selector: { type: 'string' }, // CSS selector for targeting elements
    },
    required: ['action'], // Action is required
  },
  async execute(_input) {
    // TODO: Implement via Playwright in sandbox
    throw new Error('Browser tool not yet implemented')
  },
}
