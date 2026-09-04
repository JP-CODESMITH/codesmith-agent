// Import the AgentSession type for type-safe session handling
import type { AgentSession } from '~/features/agent/types'
// Import the AI provider getter to access the configured LLM provider
import { getAIProvider } from '../ai/provider'
// Import the system prompt that guides the AI's behavior
import { SYSTEM_PROMPT } from '../ai/prompts'

// Plan the next step of the agent's task by sending the current goal to the AI
// Returns the AI's reasoning text and any tool calls it wants to make
export async function planNextStep(
  session: AgentSession, // The current session containing the goal and history
): Promise<{ content: string; toolCalls: Array<{ name: string; input: Record<string, unknown> }> }> {
  // Get the configured AI provider (placeholder or real LLM)
  const provider = getAIProvider()

  // Send a structured request to the AI with the system prompt and user goal
  const response = await provider.generateResponse({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT }, // System instructions for the AI
      { role: 'user', content: `Goal: ${session.goal}` }, // The user's specific goal
    ],
  })

  // Transform the AI response into the expected plan format with tool calls
  return {
    content: response.message, // The AI's reasoning/explanation text
    toolCalls: response.toolCalls.map((tc) => ({
      name: tc.name,       // The name of each tool the AI wants to call
      input: tc.arguments, // The arguments for each tool call
    })),
  }
}
