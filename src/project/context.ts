// Public entry point for the project-context module.
// Re-exports the project types so consumers can import from '~/project/context'
// without reaching into the internal './types' file.
export type { ProjectContext, ProjectType } from './types'
