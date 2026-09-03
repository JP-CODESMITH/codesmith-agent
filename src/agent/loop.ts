// Import the AIMessage type for structuring messages sent to the AI provider
import type { AIMessage } from '~/ai/types'
// Import the AgentStateStore for managing mutable state during an agent turn
import { AgentStateStore } from './state'
// Import type definitions for the agent's input/output and configuration options
import type { AgentCoreOptions, AgentRunInput, AgentRunResult } from './types'

// Execute a single turn of the agent: record the user's message, call the AI provider, and record the response
export async function runAgentTurn(
  options: AgentCoreOptions, // Configuration including session, AI provider, tools, and permissions
  input: AgentRunInput, // The user's input message
): Promise<AgentRunResult> {
  // Create a mutable state store wrapping the session for tracking messages and status
  const state = new AgentStateStore(options.session)

  try {
    // Phase 1 handles one turn: record user input, call the provider,
    // record the assistant output. Planning/tool execution comes later.

    // Add the user's message to the session message history
    state.addMessage('user', input.message)
    // Set the session state to 'thinking' to indicate the agent is processing
    state.setState('thinking')

    // Convert the session's immutable messages into the format expected by the AI provider
    const messages: AIMessage[] = state.current.messages.map((message) => ({
      role: message.role,
      content: message.content,
    }))

    // Send the conversation history to the AI provider and request a response
    // Tools are exposed as definitions only. The placeholder provider ignores them,
    // but real providers will use this contract later.
    const response = await options.aiProvider.sendMessage({
      messages,
      tools: options.tools.list().map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    })

    // Add the AI assistant's response to the session message history
    state.addMessage('assistant', response.message)
    // Mark the session as completed after receiving the response
    state.setState('completed')

    // Return the updated session and the agent's response message
    return {
      session: state.current,
      message: response.message,
    }
  } catch (err) {
    // If an error occurs, format the error message and mark the session as failed
    const message = err instanceof Error ? err.message : 'Agent turn failed.'
    state.fail(message)
    return { session: state.current, message }
  }
}
