export interface MCPTool {
  name: string
  description: string
  inputSchema: Record<string, unknown>
}

export interface MCPServerInfo {
  name: string
  version: string
  tools: MCPTool[]
}

export interface MCPConnection {
  serverName: string
  url: string
  connected: boolean
}
