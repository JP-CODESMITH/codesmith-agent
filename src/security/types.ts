// The possible decisions the permission system can make for a request
export type PermissionDecision = 'allow' | 'deny' | 'requires_approval'

// The categories of operations that can be requested by the agent
export type OperationKind =
  | 'filesystem:list'     // List files in a directory
  | 'filesystem:read'     // Read a file's contents
  | 'filesystem:search'   // Search for files by name
  | 'filesystem:exists'   // Check if a file or directory exists
  | 'terminal:execute'    // Execute a shell command
  | 'git:status'          // Show git status information
  | 'git:diff'            // Show git diff output
  | 'git:log'             // Show git commit history
  | 'git:branch'          // Show git branch information

// The request object sent to the permission gate to check if an operation is allowed
export interface PermissionRequest {
  kind: OperationKind // The type of operation being requested
  command?: string // Optional command string (used for terminal operations)
  path?: string // Optional file/directory path being accessed
  cwd?: string // Optional current working directory context
  reason?: string // Optional explanation for why the operation is needed
}

// The result of a permission check, indicating whether the operation is allowed
export interface PermissionResult {
  decision: PermissionDecision // Whether the operation is allowed, denied, or needs approval
  reason: string // Human-readable explanation of why that decision was made
}
