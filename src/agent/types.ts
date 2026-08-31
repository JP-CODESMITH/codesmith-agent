import type { AIProvider } from '~/ai/provider'
import type { CodeSmithSession } from '~/session/types'
import type { ToolRegistry } from '~/tools/registry'
import type { PermissionGate } from '~/security/permissions'

export interface AgentCoreOptions {
  session: CodeSmithSession
  aiProvider: AIProvider
  tools: ToolRegistry
  permissions: PermissionGate
}

export interface AgentRunInput {
  message: string
}

export interface AgentRunResult {
  session: CodeSmithSession
  message: string
}
