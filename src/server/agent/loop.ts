import type { AgentInput, AgentResult, AgentSession } from '~/features/agent/types'
import { createSession, updateStatus, addStep } from './state'
import { planNextStep } from './planner'
import { AGENT_CONFIG } from '~/features/agent/constants'

export async function runAgentLoop(input: AgentInput): Promise<AgentResult> {
  let session = createSession(input.goal)
  session = updateStatus(session, 'running')

  for (let step = 0; step < AGENT_CONFIG.MAX_STEPS; step++) {
    try {
      session = updateStatus(session, 'thinking')

      const plan = await planNextStep(session)

      session = addStep(session, {
        id: crypto.randomUUID(),
        event: 'thinking',
        content: plan.content,
        timestamp: Date.now(),
      })

      // TODO: If plan contains tool calls, execute them and continue loop
      // TODO: If plan is final answer, break and return result

      // Placeholder: return after first planning step
      session = updateStatus(session, 'completed')
      return {
        status: 'completed',
        message: plan.content || 'Agent foundation is ready.',
        session,
      }
    } catch (err) {
      session = updateStatus(session, 'failed')
      return {
        status: 'failed',
        message: err instanceof Error ? err.message : 'Agent loop failed',
        session,
      }
    }
  }

  session = updateStatus(session, 'completed')
  return {
    status: 'completed',
    message: 'Agent foundation is ready.',
    session,
  }
}
