// Sandbox factory: public entry point for creating an isolated execution
// environment (currently Docker-backed) for running agent code safely.
import { DockerSandbox } from './docker'
import type { Sandbox, SandboxOptions } from './types'

// Re-export sandbox types so callers can import them from this module.
export type { Sandbox, SandboxOptions }

// Create and provision a ready-to-use sandbox instance.
export async function createSandbox(
  options?: SandboxOptions,
): Promise<Sandbox> {
  const sandbox = new DockerSandbox()
  await sandbox.create(options)
  return sandbox
}
