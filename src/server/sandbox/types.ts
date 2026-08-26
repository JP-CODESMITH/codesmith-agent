export interface SandboxOptions {
  image?: string
  memoryLimit?: string
  cpuLimit?: number
  timeout?: number
}

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
