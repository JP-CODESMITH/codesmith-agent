import type {
  AgentRuntimeState,
  CodeSmithSession,
  SessionMessageRole,
} from './types'
import type { ProjectContext } from '~/project/context'
import type { ToolResult } from '~/tools/tool'

function now(): number {
  return Date.now()
}

export function createCodeSmithSession(project: ProjectContext): CodeSmithSession {
  const createdAt = now()
  return {
    id: crypto.randomUUID(),
    project,
    messages: [],
    tools: [],
    errors: [],
    state: 'idle',
    createdAt,
    updatedAt: createdAt,
  }
}

export function addSessionMessage(
  session: CodeSmithSession,
  role: SessionMessageRole,
  content: string,
): CodeSmithSession {
  return {
    ...session,
    messages: [
      ...session.messages,
      { id: crypto.randomUUID(), role, content, createdAt: now() },
    ],
    updatedAt: now(),
  }
}

export function setSessionState(
  session: CodeSmithSession,
  state: AgentRuntimeState,
): CodeSmithSession {
  return { ...session, state, updatedAt: now() }
}

export function addToolExecution(
  session: CodeSmithSession,
  toolName: string,
  input: Record<string, unknown>,
  result?: ToolResult,
): CodeSmithSession {
  return {
    ...session,
    tools: [
      ...session.tools,
      {
        id: crypto.randomUUID(),
        toolName,
        input,
        result,
        createdAt: now(),
      },
    ],
    updatedAt: now(),
  }
}

export function addSessionError(
  session: CodeSmithSession,
  error: string,
): CodeSmithSession {
  return {
    ...session,
    errors: [...session.errors, error],
    state: 'failed',
    updatedAt: now(),
  }
}
