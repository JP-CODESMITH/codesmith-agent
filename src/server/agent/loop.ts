// Import the types for the agent's input, result, and session objects
import type { AgentInput, AgentResult, AgentSession } from '~/features/agent/types'
// Import session state management functions (create, update status, add steps)
import { createSession, updateStatus, addStep } from './state'
// Import the planner that generates the next step plan from the AI
import { planNextStep } from './planner'
// Import the agent configuration constants (max steps, timeouts, etc.)
import { AGENT_CONFIG } from '~/features/agent/constants'

// The main agent loop that orchestrates a complete agent execution
// Creates a session, plans steps, and returns the final result
export async function runAgentLoop(input: AgentInput): Promise<AgentResult> {
  // Initialize a new session with the user's goal and set status to running
  let session = createSession(input.goal)
  session = updateStatus(session, 'running')

  // Loop up to the configured maximum number of steps
  for (let step = 0; step < AGENT_CONFIG.MAX_STEPS; step++) {
    try {
      // Set session status to thinking before requesting a plan from the AI
      session = updateStatus(session, 'thinking')

      // Ask the AI to plan the next step based on the current session state
      const plan = await planNextStep(session)

      // Record the AI's planning output as a step in the session timeline
      session = addStep(session, {
        id: crypto.randomUUID(),         // Unique ID for this step
        event: 'thinking',               // The event type
        content: plan.content,           // The AI's reasoning text
        timestamp: Date.now(),           // When this step was recorded
      })

      // TODO: If plan contains tool calls, execute them and continue loop
      // TODO: If plan is final answer, break and return result

      // Placeholder: return after first planning step (actual tool execution not yet wired)
      session = updateStatus(session, 'completed')
      return {
        status: 'completed',
        message: plan.content || 'Agent foundation is ready.',
        session,
      }
    } catch (err) {
      // If any error occurs during planning, mark the session as failed
      session = updateStatus(session, 'failed')
      return {
        status: 'failed',
        message: err instanceof Error ? err.message : 'Agent loop failed',
        session,
      }
    }
  }

  // If all MAX_STEPS are exhausted, mark as completed
  session = updateStatus(session, 'completed')
  return {
    status: 'completed',
    message: 'Agent foundation is ready.',
    session,
  }
}
