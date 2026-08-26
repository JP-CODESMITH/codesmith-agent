import type { Sandbox, SandboxOptions } from './types'

export class DockerSandbox implements Sandbox {
  id: string
  private created = false

  constructor(id?: string) {
    this.id = id ?? `sandbox-${Date.now()}`
  }

  async create(_options?: SandboxOptions): Promise<void> {
    // TODO: Implement Docker container creation
    this.created = true
  }

  async execute(
    _command: string,
    _options?: { cwd?: string; timeout?: number },
  ): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    if (!this.created) throw new Error('Sandbox not created')
    // TODO: Implement Docker exec
    throw new Error('Docker sandbox not yet implemented')
  }

  async readFile(_path: string): Promise<string> {
    if (!this.created) throw new Error('Sandbox not created')
    // TODO: Implement Docker cp from container
    throw new Error('Docker sandbox not yet implemented')
  }

  async writeFile(_path: string, _content: string): Promise<void> {
    if (!this.created) throw new Error('Sandbox not created')
    // TODO: Implement Docker cp to container
    throw new Error('Docker sandbox not yet implemented')
  }

  async destroy(): Promise<void> {
    this.created = false
    // TODO: Implement Docker container removal
  }
}
