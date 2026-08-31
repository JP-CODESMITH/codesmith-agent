import type { ProjectContext } from '~/project/context'
import type { ToolResult } from '~/tools/tool'

export type SessionMessageRole = 'user' | 'assistant' | 'system'

export interface SessionMessage {
  id: string
  role: SessionMessageRole
  content: string
  createdAt: number
}

export interface SessionToolExecution {
  id: string
  toolName: string
  input: Record<string, unknown>
  result?: ToolResult
  createdAt: number
}

export type AgentRuntimeState =
  | 'idle'
  | 'thinking'
  | 'executing'
  | 'waiting'
  | 'completed'
  | 'failed'

export interface CodeSmithSession {
  id: string
  project: ProjectContext
  messages: SessionMessage[]
  tools: SessionToolExecution[]
  errors: string[]
  state: AgentRuntimeState
  createdAt: number
  updatedAt: number
}
