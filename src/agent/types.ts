// Import type definitions for the AI provider, session, tool registry, and permission gate
import type { AIProvider } from '~/ai/provider'
import type { CodeSmithSession } from '~/session/types'
import type { ToolRegistry } from '~/tools/registry'
import type { PermissionGate } from '~/security/permissions'

// Options required to initialize and run the agent core
export interface AgentCoreOptions {
  session: CodeSmithSession // The current conversation session
  aiProvider: AIProvider // The AI model provider to call
  tools: ToolRegistry // Registry of available tools the agent can use
  permissions: PermissionGate // Permission gate to check if operations are allowed
}

// Input passed when requesting a single agent turn
export interface AgentRunInput {
  message: string // The user's message/goal for the agent
}

// Result returned after a single agent turn completes
export interface AgentRunResult {
  session: CodeSmithSession // The updated session after the turn
  message: string // The agent's final response message
}
