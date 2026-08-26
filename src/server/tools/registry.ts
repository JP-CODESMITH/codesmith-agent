import type { AgentTool, ToolRegistryEntry } from './types'

export class ToolRegistry {
  private tools = new Map<string, ToolRegistryEntry>()

  register(tool: AgentTool): void {
    this.tools.set(tool.name, { tool, enabled: true })
  }

  get(name: string): AgentTool | undefined {
    const entry = this.tools.get(name)
    if (!entry?.enabled) return undefined
    return entry.tool
  }

  list(): AgentTool[] {
    return Array.from(this.tools.values())
      .filter((entry) => entry.enabled)
      .map((entry) => entry.tool)
  }

  remove(name: string): boolean {
    return this.tools.delete(name)
  }

  enable(name: string): void {
    const entry = this.tools.get(name)
    if (entry) entry.enabled = true
  }

  disable(name: string): void {
    const entry = this.tools.get(name)
    if (entry) entry.enabled = false
  }
}

export const toolRegistry = new ToolRegistry()
