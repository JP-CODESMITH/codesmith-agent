import type { AgentStatus, AgentStep, AgentSession } from '~/features/agent/types'

export function createSession(goal: string): AgentSession {
  return {
    id: crypto.randomUUID(),
    goal,
    status: 'idle',
    steps: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

export function addStep(session: AgentSession, step: AgentStep): AgentSession {
  return {
    ...session,
    steps: [...session.steps, step],
    updatedAt: Date.now(),
  }
}

export function updateStatus(
  session: AgentSession,
  status: AgentStatus,
): AgentSession {
  return {
    ...session,
    status,
    updatedAt: Date.now(),
  }
}
