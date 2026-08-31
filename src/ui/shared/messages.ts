import type { CodeSmithSession } from '~/session/types'

export function formatProjectSummary(session: CodeSmithSession): string {
  const types = session.project.types.length
    ? session.project.types.join(', ')
    : 'unknown'
  const entries = session.project.entryPoints.length
    ? session.project.entryPoints.join(', ')
    : 'none detected'

  return [
    `Project: ${session.project.root}`,
    `Type: ${types}`,
    `Package manager: ${session.project.packageManager ?? 'unknown'}`,
    `Git: ${session.project.hasGit ? 'yes' : 'no'}`,
    `Entry points: ${entries}`,
  ].join('\n')
}
