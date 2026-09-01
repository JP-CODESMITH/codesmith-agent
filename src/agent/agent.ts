import { createAIProvider } from '~/ai/provider'
import { permissionGate } from '~/security/permissions'
import { createCodeSmithSession } from '~/session/session'
import { createToolRegistry } from '~/tools/registry'
import { filesystemTools } from '~/tools/filesystem'
import { gitTools } from '~/tools/git'
import { terminalTools } from '~/tools/terminal'
import { detectProject } from '~/project/detector'
import { runAgentTurn } from './loop'
import type { AgentRunResult } from './types'

// This registry is the default Phase 1 tool surface.
// The agent receives tool definitions, but it does not invoke them autonomously yet.
export function createDefaultToolRegistry() {
  return createToolRegistry([
    ...filesystemTools,
    ...terminalTools,
    ...gitTools,
  ])
}

export async function runCodeSmithAgentTurn(
  message: string,
  projectRoot = process.cwd(),
): Promise<AgentRunResult> {
  // A fresh in-memory session is created for each Phase 1 turn.
  // Persistence and multi-turn recovery are intentionally deferred.
  const project = detectProject(projectRoot)
  const session = createCodeSmithSession(project)

  return runAgentTurn(
    {
      session,
      aiProvider: createAIProvider({ provider: 'placeholder' }),
      permissions: permissionGate,
      tools: createDefaultToolRegistry(),
    },
    { message },
  )
}
