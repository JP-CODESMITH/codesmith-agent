// Import the agent-specific type definitions for session and step management
import type { AgentStatus, AgentStep, AgentSession } from '~/features/agent/types'

// Create a new agent session initialized with the user's goal and default state
export function createSession(goal: string): AgentSession {
  return {
    id: crypto.randomUUID(),           // Generate a unique session identifier
    goal,                             // Store the user's goal for this session
    status: 'idle',                   // Start in idle state, waiting for execution
    steps: [],                        // No steps recorded yet
    createdAt: Date.now(),            // Record creation timestamp
    updatedAt: Date.now(),            // Creation time doubles as last update time
  }
}

// Add a new step to the session's execution timeline and return an updated session
export function addStep(session: AgentSession, step: AgentStep): AgentSession {
  return {
    ...session,                      // Preserve all existing session properties
    steps: [...session.steps, step], // Append the new step to the timeline
    updatedAt: Date.now(),           // Update the timestamp to reflect the change
  }
}

// Update the session's status and return an updated session
export function updateStatus(
  session: AgentSession,          // The session to update
  status: AgentStatus,            // The new status to set
): AgentSession {
  return {
    ...session,                   // Preserve all existing session properties
    status,                       // Set the new status
    updatedAt: Date.now(),        // Update the timestamp to reflect the change
  }
}
