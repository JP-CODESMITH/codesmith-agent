import type { PermissionRequest, PermissionResult } from './types'

const deniedCommandPatterns = [
  /\bmkfs(\.\w+)?\b/i,
  /\bdd\b/i,
  /\bshutdown\b/i,
  /\breboot\b/i,
]

const approvalCommandPatterns = [
  /\bsudo\b/i,
  /\brm\b/i,
  /\brm\s+-[^\n]*r/i,
  /\bchmod\b/i,
  /\bchown\b/i,
  /\bcurl\b[^\n|]*\|\s*(sh|bash)\b/i,
  /\bwget\b[^\n|]*\|\s*(sh|bash)\b/i,
  /\bdocker\s+(rm|rmi|system\s+prune)\b/i,
  /\bgit\s+(reset|checkout|switch|clean|push)\b/i,
]

export function classifyCommand(command: string): PermissionResult {
  if (deniedCommandPatterns.some((pattern) => pattern.test(command))) {
    return {
      decision: 'deny',
      reason: 'Command matches a denied system or disk operation.',
    }
  }

  if (approvalCommandPatterns.some((pattern) => pattern.test(command))) {
    return {
      decision: 'requires_approval',
      reason: 'Command can modify system state or destroy user work.',
    }
  }

  return {
    decision: 'allow',
    reason: 'Command does not match the Phase 1 dangerous-command policy.',
  }
}

export function evaluatePermission(request: PermissionRequest): PermissionResult {
  if (request.kind === 'terminal:execute') {
    if (!request.command?.trim()) {
      return { decision: 'deny', reason: 'No terminal command was provided.' }
    }
    return classifyCommand(request.command)
  }

  return {
    decision: 'allow',
    reason: 'Read-only Phase 1 operation.',
  }
}
