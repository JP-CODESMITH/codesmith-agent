import type { AgentSession } from '~/features/agent/types'
import { getAIProvider } from '../ai/provider'
import { SYSTEM_PROMPT } from '../ai/prompts'

export async function planNextStep(
  session: AgentSession,
): Promise<{ content: string; toolCalls: Array<{ name: string; input: Record<string, unknown> }> }> {
  const provider = getAIProvider()

  const response = await provider.generateResponse({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Goal: ${session.goal}` },
    ],
  })

  return {
    content: response.message,
    toolCalls: response.toolCalls.map((tc) => ({
      name: tc.name,
      input: tc.arguments,
    })),
  }
}
