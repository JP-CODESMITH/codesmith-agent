import { DockerSandbox } from './docker'
import type { Sandbox, SandboxOptions } from './types'

export type { Sandbox, SandboxOptions }

export async function createSandbox(
  options?: SandboxOptions,
): Promise<Sandbox> {
  const sandbox = new DockerSandbox()
  await sandbox.create(options)
  return sandbox
}
