// MCP server registry: tracks known MCP servers and the tools they advertise.
// Phase 1 scaffold — registering tools into the main tool registry is not wired yet.
import type { MCPServerInfo } from './types'

// In-memory catalog of registered MCP servers.
export class MCPRegistry {
  // Registered servers keyed by server name.
  private servers = new Map<string, MCPServerInfo>()

  // Register a server and (eventually) surface its tools to the agent.
  register(_name: string, _info: MCPServerInfo): void {
    // TODO: Register MCP server tools with the main tool registry
  }

  // Retrieve a registered server's info by name.
  get(_name: string): MCPServerInfo | undefined {
    return this.servers.get(_name)
  }

  // List all registered servers.
  list(): MCPServerInfo[] {
    return Array.from(this.servers.values())
  }

  // Remove a server from the registry; returns whether it existed.
  remove(_name: string): boolean {
    return this.servers.delete(_name)
  }
}

// Shared singleton registry used across the server.
export const mcpRegistry = new MCPRegistry()
