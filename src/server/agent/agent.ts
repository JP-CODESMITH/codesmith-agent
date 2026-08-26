import type { AgentInput, AgentResult } from '~/features/agent/types'
import { runAgentLoop } from './loop'

export async function runAgent(input: AgentInput): Promise<AgentResult> {
  return runAgentLoop(input)
}
