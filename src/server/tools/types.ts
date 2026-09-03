// Type definitions for agent tools and their registry entries.

// A callable tool the agent can invoke, with its JSON-schema input contract.
export interface AgentTool {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  execute(input: Record<string, unknown>): Promise<unknown>
}

// Registry wrapper pairing a tool with its enabled/disabled state.
export interface ToolRegistryEntry {
  tool: AgentTool
  enabled: boolean
}
