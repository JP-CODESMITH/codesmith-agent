// Import the AgentInput and AgentResult types from the shared feature types
import type { AgentInput, AgentResult } from '~/features/agent/types'
// Import the agent loop function that contains the core execution logic
import { runAgentLoop } from './loop'

// Public entry point that delegates to the agent loop
// Wraps the raw loop function for the server-side agent API
export async function runAgent(input: AgentInput): Promise<AgentResult> {
  return runAgentLoop(input)
}
