export const AGENT_CONFIG = {
  MAX_STEPS: 20,
  MAX_TOOL_CALLS_PER_STEP: 5,
  STEP_TIMEOUT_MS: 30_000,
} as const

export const TOOL_NAMES = {
  FILE: 'file',
  TERMINAL: 'terminal',
  SEARCH: 'search',
  BROWSER: 'browser',
  GITHUB: 'github',
} as const

export const AI_PROVIDERS = {
  OLLAMA: 'ollama',
  NVIDIA: 'nvidia',
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
} as const
