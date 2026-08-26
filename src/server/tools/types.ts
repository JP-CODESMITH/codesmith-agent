export interface AgentTool {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  execute(input: Record<string, unknown>): Promise<unknown>
}

export interface ToolRegistryEntry {
  tool: AgentTool
  enabled: boolean
}
