import type { AIMessage } from '~/ai/types'
import { AgentStateStore } from './state'
import type { AgentCoreOptions, AgentRunInput, AgentRunResult } from './types'

export async function runAgentTurn(
  options: AgentCoreOptions,
  input: AgentRunInput,
): Promise<AgentRunResult> {
  const state = new AgentStateStore(options.session)

  try {
    // Phase 1 handles one turn: record user input, call the provider,
    // record the assistant output. Planning/tool execution comes later.
    state.addMessage('user', input.message)
    state.setState('thinking')

    const messages: AIMessage[] = state.current.messages.map((message) => ({
      role: message.role,
      content: message.content,
    }))

    const response = await options.aiProvider.sendMessage({
      messages,
      // Tools are exposed as definitions only. The placeholder provider ignores them,
      // but real providers will use this contract later.
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
