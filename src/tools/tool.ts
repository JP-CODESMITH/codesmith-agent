// Import the PermissionGate type for use in tool execution context
import type { PermissionGate } from '~/security/permissions'

// Context provided to a tool when it is executed, containing the working directory and permission checker
export interface ToolExecutionContext {
  cwd: string // Current working directory where the tool should operate
  permissions: PermissionGate // Permission gate to check if the operation is allowed
}

// Represents the result of a tool execution
export interface ToolResult<TOutput = unknown> {
  ok: boolean // Whether the execution succeeded
  output?: TOutput // Optional output data if the execution succeeded
  error?: string // Optional error message if the execution failed
}

// Defines the interface that all tools must implement
export interface Tool<TInput = Record<string, unknown>, TOutput = unknown> {
  name: string // Unique identifier for the tool
  description: string // Human-readable description of what the tool does
  inputSchema: Record<string, unknown> // JSON schema defining the expected input structure
  execute(input: TInput, context: ToolExecutionContext): Promise<ToolResult<TOutput>> // Execute the tool with given input and context
}
