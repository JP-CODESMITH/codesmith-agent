import type { AIMessage } from '~/ai/types'
import { AgentStateStore } from './state'
import type { AgentCoreOptions, AgentRunInput, AgentRunResult } from './types'

export async function runAgentTurn(
  options: AgentCoreOptions,
  input: AgentRunInput,
): Promise<AgentRunResult> {
  const state = new AgentStateStore(options.session)

  try {
    state.addMessage('user', input.message)
    state.setState('thinking')

    const messages: AIMessage[] = state.current.messages.map((message) => ({
      role: message.role,
      content: message.content,
    }))

    const response = await options.aiProvider.sendMessage({
      messages,
      tools: options.tools.list().map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    })

    state.addMessage('assistant', response.message)
    state.setState('completed')

    return {
      session: state.current,
      message: response.message,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Agent turn failed.'
    state.fail(message)
    return { session: state.current, message }
  }
}
