// Import the policy evaluation function that contains the actual permission logic
import { evaluatePermission } from './policy'
// Import the type definitions for permission requests and results
import type { PermissionRequest, PermissionResult } from './types'

// Central permission gate that the agent calls before any tool execution
export class PermissionGate {
  // Check if a permission request is allowed (returns decision without throwing)
  check(request: PermissionRequest): PermissionResult {
    return evaluatePermission(request)
  }

  // Assert that a request is allowed, throwing an error if it's denied or requires approval
  assertAllowed(request: PermissionRequest): PermissionResult {
    const result = this.check(request)
    // If the decision isn't 'allow', throw an error with the decision and reason
    if (result.decision !== 'allow') {
      throw new Error(`Permission ${result.decision}: ${result.reason}`)
    }
    return result
  }
}

// Shared singleton permission gate instance used throughout the application
export const permissionGate = new PermissionGate()
