export type PermissionDecision = 'allow' | 'deny' | 'requires_approval'

export type OperationKind =
  | 'filesystem:list'
  | 'filesystem:read'
  | 'filesystem:search'
  | 'filesystem:exists'
  | 'terminal:execute'
  | 'git:status'
  | 'git:diff'
  | 'git:log'
  | 'git:branch'

export interface PermissionRequest {
  kind: OperationKind
  command?: string
  path?: string
  cwd?: string
  reason?: string
}

export interface PermissionResult {
  decision: PermissionDecision
  reason: string
}
