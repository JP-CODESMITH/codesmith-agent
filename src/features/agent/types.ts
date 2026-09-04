// Import Zod for runtime validation of agent data structures
import { z } from 'zod'

// The possible lifecycle states an agent session can be in during execution
export const AgentStatusSchema = z.enum([
  'idle',      // Session created, waiting for user input
  'thinking',  // Agent is reasoning or planning
  'planning',  // Agent is breaking down the task into steps
  'executing', // Agent is running tools or performing actions
  'waiting',   // Agent is waiting for external input or approval
  'running',   // Agent is actively processing the task
  'completed', // Agent finished successfully
  'failed',    // Agent encountered an error during execution
  'cancelled', // Agent was cancelled by the user
])
export type AgentStatus = z.infer<typeof AgentStatusSchema>

// The types of events that can occur during an agent's lifecycle
export const AgentEventTypeSchema = z.enum([
  'message',       // A new message was added to the conversation
  'thinking',      // Agent entered a thinking/reasoning phase
  'tool_call',     // The agent made a tool call
  'tool_result',   // A tool call returned a result
  'error',         // An error occurred during execution
  'complete',      // The agent completed its work
])
export type AgentEventType = z.infer<typeof AgentEventTypeSchema>

// Represents a single tool invocation within an agent's execution steps
export interface ToolCall {
  id: string // Unique identifier for this tool call
  tool: string // The name of the tool being called
  input: Record<string, unknown> // The arguments passed to the tool
  result?: unknown // The result returned by the tool, if available
  status: 'pending' | 'running' | 'completed' | 'failed' // Current execution status
}

// Represents a single step in an agent's execution timeline
export interface AgentStep {
  id: string // Unique identifier for this step
  event: AgentEventType // The type of event this step represents
  content: string // Human-readable description of what happened in this step
  toolCalls?: ToolCall[] // Optional tool calls made during this step
  timestamp: number // Unix timestamp when this step was recorded
}

// The full agent session object containing the goal, status, and execution history
export interface AgentSession {
  id: string // Unique identifier for this session
  goal: string // The user's original goal or task description
  status: AgentStatus // Current lifecycle state of the session
  steps: AgentStep[] // All recorded steps in the execution timeline
  createdAt: number // Unix timestamp when the session was created
  updatedAt: number // Unix timestamp when the session was last modified
}

// Input object passed when starting a new agent session
export interface AgentInput {
  goal: string // The user's goal or task for the agent to accomplish
}

// Result object returned after an agent session completes
export interface AgentResult {
  status: AgentStatus // The final status of the session
  message: string // Human-readable summary of the result
  session?: AgentSession // Optional reference to the completed session
}
