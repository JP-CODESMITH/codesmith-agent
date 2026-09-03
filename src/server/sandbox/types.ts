// Type definitions for the sandbox subsystem (isolated command/file execution).

// Configuration for provisioning a sandbox (image and resource limits).
export interface SandboxOptions {
  image?: string
  memoryLimit?: string
  cpuLimit?: number
  timeout?: number
}

// Contract for an isolated environment: lifecycle, command exec, and file I/O.
export interface Sandbox {
  id: string
  create(options?: SandboxOptions): Promise<void>
  execute(command: string, options?: { cwd?: string; timeout?: number }): Promise<{
    stdout: string
    stderr: string
    exitCode: number
  }>
  readFile(path: string): Promise<string>
  writeFile(path: string, content: string): Promise<void>
  destroy(): Promise<void>
}
