import type { AgentTool } from '../types'

export const browserTool: AgentTool = {
  name: 'browser',
  description: 'Automate browser interactions to navigate and extract data',
  inputSchema: {
    type: 'object',
    properties: {
      action: { type: 'string', enum: ['navigate', 'click', 'extract', 'screenshot'] },
      url: { type: 'string' },
      selector: { type: 'string' },
    },
    required: ['action'],
  },
  async execute(_input) {
    // TODO: Implement via Playwright in sandbox
    throw new Error('Browser tool not yet implemented')
  },
}
