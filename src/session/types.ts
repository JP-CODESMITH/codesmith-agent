// Import type definitions for project context and tool results
import type { ProjectContext } from '~/project/context'
import type { ToolResult } from '~/tools/tool'

// The possible roles a message can have in a conversation
export type SessionMessageRole = 'user' | 'assistant' | 'system'

// Represents a single message in the conversation
export interface SessionMessage {
  id: string // Unique identifier for the message
  role: SessionMessageRole // Whether this is a user, assistant, or system message
  content: string // The actual text content of the message
  createdAt: number // Timestamp when the message was created (Date.now())
}

// Records a tool execution that happened during a session
export interface SessionToolExecution {
  id: string // Unique identifier for this tool execution
  toolName: string // The name of the tool that was called
  input: Record<string, unknown> // The input arguments passed to the tool
  result?: ToolResult // The result of the tool execution, if available
  createdAt: number // Timestamp when the tool was executed
}

// The possible runtime states of the agent during execution
export type AgentRuntimeState =
  | 'idle' // Waiting for user input
  | 'thinking' // Agent is processing/planning
  | 'executing' // Agent is running a tool
  | 'waiting' // Agent is waiting for something
  | 'completed' // Agent finished successfully
  | 'failed' // Agent encountered an error

// The main session object that holds the entire conversation state
export interface CodeSmithSession {
  id: string // Unique session identifier
  project: ProjectContext // Information about the detected project
  messages: SessionMessage[] // All messages in the conversation
  tools: SessionToolExecution[] // All tool executions performed
  errors: string[] // Any errors that occurred
  state: AgentRuntimeState // Current runtime state of the agent
  createdAt: number // When the session was created
  updatedAt: number // When the session was last updated
}
