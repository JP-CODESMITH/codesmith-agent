import { z } from 'zod'

export const AgentStatusSchema = z.enum([
  'idle',
  'thinking',
  'planning',
  'executing',
  'waiting',
  'running',
  'completed',
  'failed',
  'cancelled',
])

export type AgentStatus = z.infer<typeof AgentStatusSchema>

export const AgentEventTypeSchema = z.enum([
  'message',
  'thinking',
  'tool_call',
  'tool_result',
  'error',
  'complete',
])

export type AgentEventType = z.infer<typeof AgentEventTypeSchema>

export interface ToolCall {
  id: string
  tool: string
  input: Record<string, unknown>
  result?: unknown
  status: 'pending' | 'running' | 'completed' | 'failed'
}

export interface AgentStep {
  id: string
  event: AgentEventType
  content: string
  toolCalls?: ToolCall[]
  timestamp: number
}

export interface AgentSession {
  id: string
  goal: string
  status: AgentStatus
  steps: AgentStep[]
  createdAt: number
  updatedAt: number
}

export interface AgentInput {
  goal: string
}

export interface AgentResult {
  status: AgentStatus
  message: string
  session?: AgentSession
}
