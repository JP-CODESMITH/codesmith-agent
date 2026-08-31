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
