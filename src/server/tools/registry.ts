// Tool registry: central catalog of agent tools with per-tool enable/disable
// state, used to look up and expose the tools available to the agent.
import type { AgentTool, ToolRegistryEntry } from './types'

// In-memory store of registered tools keyed by tool name.
export class ToolRegistry {
  private tools = new Map<string, ToolRegistryEntry>()

  // Add a tool to the registry, enabled by default.
  register(tool: AgentTool): void {
    this.tools.set(tool.name, { tool, enabled: true })
  }

  // Fetch a tool by name, treating disabled tools as absent.
  get(name: string): AgentTool | undefined {
    const entry = this.tools.get(name)
    if (!entry?.enabled) return undefined
    return entry.tool
  }

  // List all currently enabled tools.
  list(): AgentTool[] {
    return Array.from(this.tools.values())
      .filter((entry) => entry.enabled)
      .map((entry) => entry.tool)
  }

  // Remove a tool from the registry entirely; returns whether it existed.
  remove(name: string): boolean {
    return this.tools.delete(name)
  }

  // Re-enable a previously disabled tool.
  enable(name: string): void {
    const entry = this.tools.get(name)
    if (entry) entry.enabled = true
  }

  // Disable a tool without removing it (hidden from get/list).
  disable(name: string): void {
    const entry = this.tools.get(name)
    if (entry) entry.enabled = false
  }
}

// Shared singleton registry used across the server.
export const toolRegistry = new ToolRegistry()
