import { evaluatePermission } from './policy'
import type { PermissionRequest, PermissionResult } from './types'

export class PermissionGate {
  check(request: PermissionRequest): PermissionResult {
    return evaluatePermission(request)
  }

  assertAllowed(request: PermissionRequest): PermissionResult {
    const result = this.check(request)
    if (result.decision !== 'allow') {
      throw new Error(`Permission ${result.decision}: ${result.reason}`)
    }
    return result
  }
}

export const permissionGate = new PermissionGate()
