// Docker-backed sandbox: runs agent commands and performs file I/O inside an
// isolated Docker container. Phase 1 scaffold — container operations are stubbed.
import type { Sandbox, SandboxOptions } from './types'

// Sandbox implementation that targets a Docker container.
export class DockerSandbox implements Sandbox {
  id: string
  // Tracks whether the container has been created, guarding operations below.
  private created = false

  // Assign a stable id, defaulting to a timestamp-based unique name.
  constructor(id?: string) {
    this.id = id ?? `sandbox-${Date.now()}`
  }

  // Provision the container (image, resource limits, etc.).
  async create(_options?: SandboxOptions): Promise<void> {
    // TODO: Implement Docker container creation
    this.created = true
  }

  // Run a command inside the container and capture stdout/stderr/exit code.
  async execute(
    _command: string,
    _options?: { cwd?: string; timeout?: number },
  ): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    if (!this.created) throw new Error('Sandbox not created')
    // TODO: Implement Docker exec
    throw new Error('Docker sandbox not yet implemented')
  }

  // Read a file's contents out of the container.
  async readFile(_path: string): Promise<string> {
    if (!this.created) throw new Error('Sandbox not created')
    // TODO: Implement Docker cp from container
    throw new Error('Docker sandbox not yet implemented')
  }

  // Write content to a file inside the container.
  async writeFile(_path: string, _content: string): Promise<void> {
    if (!this.created) throw new Error('Sandbox not created')
    // TODO: Implement Docker cp to container
    throw new Error('Docker sandbox not yet implemented')
  }

  // Tear down the container and mark the sandbox unusable.
  async destroy(): Promise<void> {
    this.created = false
    // TODO: Implement Docker container removal
  }
}
