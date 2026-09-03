// Import helper functions for modifying session state (messages, errors, state)
import {
  addSessionError,
  addSessionMessage,
  setSessionState,
} from '~/session/session'
// Import the CodeSmithSession type for type safety
import type { CodeSmithSession } from '~/session/types'

// AgentStateStore provides a mutable wrapper around an immutable CodeSmithSession,
// making it easier to update state during an agent turn
export class AgentStateStore {
  // Store the session internally; the class provides methods to update it
  constructor(private session: CodeSmithSession) {}

  // Expose the current session for reading
  get current(): CodeSmithSession {
    return this.session
  }

  // Add a message (user, assistant, or system) to the session's message history
  addMessage(role: 'user' | 'assistant' | 'system', content: string): void {
    this.session = addSessionMessage(this.session, role, content)
  }

  // Update the session's runtime state (e.g., 'thinking', 'completed', 'failed')
  setState(state: CodeSmithSession['state']): void {
    this.session = setSessionState(this.session, state)
  }

  // Record an error and mark the session as failed
  fail(error: string): void {
    this.session = addSessionError(this.session, error)
  }
}
