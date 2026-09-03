// MCP (Model Context Protocol) client: manages connections to external MCP
// servers so the agent can discover and invoke their tools.
// Phase 1 scaffold — the protocol wiring is still stubbed out.
import type { MCPConnection, MCPServerInfo } from './types'

// Holds live MCP server connections and exposes connect/discover operations.
export class MCPClient {
  // Active connections keyed by server name.
  private connections = new Map<string, MCPConnection>()

  // Open a connection to an MCP server at the given URL.
  async connect(_serverName: string, _url: string): Promise<MCPConnection> {
    // TODO: Implement MCP protocol connection
    throw new Error('MCP client not yet implemented')
  }

  // Close an existing connection to an MCP server.
  async disconnect(_serverName: string): Promise<void> {
    // TODO: Implement MCP protocol disconnection
    throw new Error('MCP client not yet implemented')
  }

  // Query a connected server for the tools it exposes.
  async listTools(_serverName: string): Promise<MCPServerInfo> {
    // TODO: Implement tool discovery via MCP
    throw new Error('MCP client not yet implemented')
  }

  // Look up a currently tracked connection by server name.
  getConnection(serverName: string): MCPConnection | undefined {
    return this.connections.get(serverName)
  }
}

// Shared singleton client used across the server.
export const mcpClient = new MCPClient()
