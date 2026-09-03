// Import type definitions for session operations
import type {
  AgentRuntimeState,
  CodeSmithSession,
  SessionMessageRole,
} from './types'
import type { ProjectContext } from '~/project/context'
import type { ToolResult } from '~/tools/tool'

// Helper function to get the current timestamp
function now(): number {
  return Date.now()
}

// Create a new CodeSmith session for a given project
export function createCodeSmithSession(project: ProjectContext): CodeSmithSession {
  const createdAt = now() // Record the creation timestamp
  return {
    id: crypto.randomUUID(), // Generate a unique session ID
    project, // Store the project context
    messages: [], // Start with an empty message history
    tools: [], // Start with no tool executions
    errors: [], // Start with no errors
    state: 'idle', // Initial state is idle (waiting for input)
    createdAt,
    updatedAt: createdAt, // UpdatedAt matches createdAt for a new session
  }
}

// Add a new message to the session's message history, returning an updated session
export function addSessionMessage(
  session: CodeSmithSession, // The current session
  role: SessionMessageRole, // The role of the message (user/assistant/system)
  content: string, // The message content
): CodeSmithSession {
  return {
    ...session, // Spread all existing session properties
    messages: [
      ...session.messages, // Keep all existing messages
      { id: crypto.randomUUID(), role, content, createdAt: now() }, // Add the new message
    ],
    updatedAt: now(), // Update the timestamp
  }
}

// Update the session's runtime state, returning an updated session
export function setSessionState(
  session: CodeSmithSession, // The current session
  state: AgentRuntimeState, // The new state to set
): CodeSmithSession {
  return { ...session, state, updatedAt: now() } // Spread session, update state and timestamp
}

// Record a tool execution in the session, returning an updated session
export function addToolExecution(
  session: CodeSmithSession, // The current session
  toolName: string, // The name of the tool that was executed
  input: Record<string, unknown>, // The input arguments passed to the tool
  result?: ToolResult, // The optional result of the execution
): CodeSmithSession {
  return {
    ...session, // Spread all existing session properties
    tools: [
      ...session.tools, // Keep all existing tool executions
      {
        id: crypto.randomUUID(), // Generate a unique ID for this execution
        toolName,
        input,
        result,
        createdAt: now(),
      },
    ],
    updatedAt: now(), // Update the timestamp
  }
}

// Record an error in the session and mark it as failed, returning an updated session
export function addSessionError(
  session: CodeSmithSession, // The current session
  error: string, // The error message
): CodeSmithSession {
  return {
    ...session, // Spread all existing session properties
    errors: [...session.errors, error], // Append the new error to the errors array
    state: 'failed', // Mark the session as failed
    updatedAt: now(), // Update the timestamp
  }
}
