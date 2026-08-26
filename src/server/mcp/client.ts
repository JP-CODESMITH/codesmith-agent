import type { MCPConnection, MCPServerInfo } from './types'

export class MCPClient {
  private connections = new Map<string, MCPConnection>()

  async connect(_serverName: string, _url: string): Promise<MCPConnection> {
    // TODO: Implement MCP protocol connection
    throw new Error('MCP client not yet implemented')
  }

  async disconnect(_serverName: string): Promise<void> {
    // TODO: Implement MCP protocol disconnection
    throw new Error('MCP client not yet implemented')
  }

  async listTools(_serverName: string): Promise<MCPServerInfo> {
    // TODO: Implement tool discovery via MCP
    throw new Error('MCP client not yet implemented')
  }

  getConnection(serverName: string): MCPConnection | undefined {
    return this.connections.get(serverName)
  }
}

export const mcpClient = new MCPClient()
