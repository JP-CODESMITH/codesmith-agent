// Type definitions for the MCP (Model Context Protocol) integration.

// A single tool exposed by an MCP server, with its JSON-schema input contract.
export interface MCPTool {
  name: string
  description: string
  inputSchema: Record<string, unknown>
}

// Metadata describing an MCP server and the set of tools it provides.
export interface MCPServerInfo {
  name: string
  version: string
  tools: MCPTool[]
}

// State of a connection to an MCP server.
export interface MCPConnection {
  serverName: string
  url: string
  connected: boolean
}
