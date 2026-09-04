// Agent configuration constants that control behavior limits and timeouts
export const AGENT_CONFIG = {
  MAX_STEPS: 20,              // Maximum number of planning/execution steps per session
  MAX_TOOL_CALLS_PER_STEP: 5, // Maximum tool calls allowed in a single step
  STEP_TIMEOUT_MS: 30_000,    // Time limit in milliseconds for each step execution
} as const

// Named constants mapping tool identifiers to their string names
export const TOOL_NAMES = {
  FILE: 'file',       // Tool name for file operations
  TERMINAL: 'terminal', // Tool name for shell command execution
  SEARCH: 'search',   // Tool name for web searching
  BROWSER: 'browser', // Tool name for browser automation
  GITHUB: 'github',   // Tool name for GitHub repository operations
} as const

// Named constants mapping AI provider identifiers to their string names
export const AI_PROVIDERS = {
  OLLAMA: 'ollama',     // Local Ollama provider
  NVIDIA: 'nvidia',     // NVIDIA AI provider
  OPENAI: 'openai',     // OpenAI provider
  ANTHROPIC: 'anthropic', // Anthropic provider
} as const
