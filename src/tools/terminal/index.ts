// Import the spawn function from Node.js child_process to run shell commands
import { spawn } from 'node:child_process'
// Import the Tool type for defining the terminal tool
import type { Tool } from '../tool'

// Tool: Execute a shell command locally with permission checks and timeout support
export const executeCommandTool: Tool<
  { command: string; cwd?: string; timeoutMs?: number; approved?: boolean }, // Input: command to run, optional cwd, timeout, and approval flag
  { stdout: string; stderr: string; exitCode: number } // Output: captured stdout, stderr, and exit code
> = {
  name: 'terminal.execute', // Unique tool name
  description: 'Execute a local command after policy classification.',
  inputSchema: {
    type: 'object',
    properties: {
      command: { type: 'string' }, // The shell command to execute
      cwd: { type: 'string' }, // Optional working directory
      timeoutMs: { type: 'number' }, // Optional timeout in milliseconds
      approved: { type: 'boolean' }, // Whether the user has approved this command
    },
    required: ['command'],
  },
  async execute(input, context) {
    // Check the command against the security policy
    const permission = context.permissions.check({
      kind: 'terminal:execute',
      command: input.command,
      cwd: input.cwd ?? context.cwd,
    })

    // If the command is denied by policy, return an error immediately
    if (permission.decision === 'deny') {
      return { ok: false, error: permission.reason }
    }

    // If the command requires approval and hasn't been approved yet, return an error
    if (permission.decision === 'requires_approval' && !input.approved) {
      return { ok: false, error: `User approval required: ${permission.reason}` }
    }

    // Commands only reach this point after policy classification.
    // This is still local execution, not the future production sandbox.

    // Return a Promise that wraps the child process execution
    return new Promise((resolve) => {
      // Spawn a bash process to run the command
      const proc = spawn('bash', ['-lc', input.command], {
        cwd: input.cwd ?? context.cwd, // Set the working directory
        stdio: ['ignore', 'pipe', 'pipe'], // Ignore stdin, pipe stdout and stderr
      })

      let stdout = '' // Accumulator for stdout
      let stderr = '' // Accumulator for stderr

      // Set encoding for the output streams
      proc.stdout.setEncoding('utf8')
      proc.stderr.setEncoding('utf8')

      // Collect stdout data chunks
      proc.stdout.on('data', (chunk: string) => {
        stdout += chunk
      })
      // Collect stderr data chunks
      proc.stderr.on('data', (chunk: string) => {
        stderr += chunk
      })

      // Set up a timeout to kill the process if it runs too long
      const timeout = input.timeoutMs ?? 30_000 // Default timeout is 30 seconds
      const timeoutHandle = setTimeout(() => {
        proc.kill() // Kill the process on timeout
      }, timeout)

      // Handle process errors (e.g., spawn failure)
      proc.on('error', (error) => {
        clearTimeout(timeoutHandle) // Clean up the timeout
        resolve({ ok: false, error: error.message })
      })

      // Handle process exit
      proc.on('close', (exitCode) => {
        clearTimeout(timeoutHandle) // Clean up the timeout
        const code = exitCode ?? 1 // Default exit code to 1 if undefined
        resolve({
          ok: code === 0, // Success if exit code is 0
          output: { stdout, stderr, exitCode: code },
          error: code === 0 ? undefined : stderr || `Command exited ${code}`, // Include stderr as error if command failed
        })
      })
    })
  },
}

// Bundle all terminal tools into an array for easy registration
export const terminalTools = [executeCommandTool]
