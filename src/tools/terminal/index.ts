import { spawn } from 'node:child_process'
import type { Tool } from '../tool'

export const executeCommandTool: Tool<
  { command: string; cwd?: string; timeoutMs?: number; approved?: boolean },
  { stdout: string; stderr: string; exitCode: number }
> = {
  name: 'terminal.execute',
  description: 'Execute a local command after policy classification.',
  inputSchema: {
    type: 'object',
    properties: {
      command: { type: 'string' },
      cwd: { type: 'string' },
      timeoutMs: { type: 'number' },
      approved: { type: 'boolean' },
    },
    required: ['command'],
  },
  async execute(input, context) {
    const permission = context.permissions.check({
      kind: 'terminal:execute',
      command: input.command,
      cwd: input.cwd ?? context.cwd,
    })

    if (permission.decision === 'deny') {
      return { ok: false, error: permission.reason }
    }

    if (permission.decision === 'requires_approval' && !input.approved) {
      return { ok: false, error: `User approval required: ${permission.reason}` }
    }

    // Commands only reach this point after policy classification.
    // This is still local execution, not the future production sandbox.
    return new Promise((resolve) => {
      const proc = spawn('bash', ['-lc', input.command], {
        cwd: input.cwd ?? context.cwd,
        stdio: ['ignore', 'pipe', 'pipe'],
      })

      let stdout = ''
      let stderr = ''

      proc.stdout.setEncoding('utf8')
      proc.stderr.setEncoding('utf8')
      proc.stdout.on('data', (chunk: string) => {
        stdout += chunk
      })
      proc.stderr.on('data', (chunk: string) => {
        stderr += chunk
      })

      const timeout = input.timeoutMs ?? 30_000
      const timeoutHandle = setTimeout(() => {
        proc.kill()
      }, timeout)

      proc.on('error', (error) => {
        clearTimeout(timeoutHandle)
        resolve({ ok: false, error: error.message })
      })

      proc.on('close', (exitCode) => {
        clearTimeout(timeoutHandle)
        const code = exitCode ?? 1
        resolve({
          ok: code === 0,
          output: { stdout, stderr, exitCode: code },
          error: code === 0 ? undefined : stderr || `Command exited ${code}`,
        })
      })
    })
  },
}

export const terminalTools = [executeCommandTool]
