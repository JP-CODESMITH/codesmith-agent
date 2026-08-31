import {
  addSessionError,
  addSessionMessage,
  setSessionState,
} from '~/session/session'
import type { CodeSmithSession } from '~/session/types'

export class AgentStateStore {
  constructor(private session: CodeSmithSession) {}

  get current(): CodeSmithSession {
    return this.session
  }

  addMessage(role: 'user' | 'assistant' | 'system', content: string): void {
    this.session = addSessionMessage(this.session, role, content)
  }

  setState(state: CodeSmithSession['state']): void {
    this.session = setSessionState(this.session, state)
  }

  fail(error: string): void {
    this.session = addSessionError(this.session, error)
  }
}
