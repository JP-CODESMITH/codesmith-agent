import type { PermissionGate } from '~/security/permissions'

export interface ToolExecutionContext {
  cwd: string
  permissions: PermissionGate
}

export interface ToolResult<TOutput = unknown> {
  ok: boolean
  output?: TOutput
  error?: string
}

export interface Tool<TInput = Record<string, unknown>, TOutput = unknown> {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  execute(input: TInput, context: ToolExecutionContext): Promise<ToolResult<TOutput>>
}
