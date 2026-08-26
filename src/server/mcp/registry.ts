import type { MCPServerInfo } from './types'

export class MCPRegistry {
  private servers = new Map<string, MCPServerInfo>()

  register(_name: string, _info: MCPServerInfo): void {
    // TODO: Register MCP server tools with the main tool registry
  }

  get(_name: string): MCPServerInfo | undefined {
    return this.servers.get(_name)
  }

  list(): MCPServerInfo[] {
    return Array.from(this.servers.values())
  }

  remove(_name: string): boolean {
    return this.servers.delete(_name)
  }
}

export const mcpRegistry = new MCPRegistry()
