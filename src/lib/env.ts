// Import Zod for runtime environment variable validation
import { z } from 'zod'

// Define the schema for all valid environment variables, including their types and defaults
const envSchema = z.object({
  // The AI provider to use (defaults to 'ollama' for local models)
  AI_PROVIDER: z.enum(['ollama', 'nvidia', 'openai', 'anthropic']).default('ollama'),
  // API key for NVIDIA AI provider (optional if using other providers)
  NVIDIA_API_KEY: z.string().optional(),
  // Base URL for the Ollama server (defaults to local Ollama instance)
  OLLAMA_BASE_URL: z.string().url().default('http://localhost:11434'),
  // API key for OpenAI (optional if using other providers)
  OPENAI_API_KEY: z.string().optional(),
  // Custom base URL for OpenAI API (optional)
  OPENAI_BASE_URL: z.string().url().optional(),
  // API key for Anthropic (optional if using other providers)
  ANTHROPIC_API_KEY: z.string().optional(),
  // Logging verbosity level (defaults to 'info')
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
})

// Infer the TypeScript type from the Zod schema for type-safe env access
export type Env = z.infer<typeof envSchema>

// Parse and validate the process.env against the defined schema
// Falls back to defaults if validation fails and logs a warning
function getEnv(): Env {
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    // Log which environment variables failed validation
    console.warn('Invalid environment variables:', parsed.error.flatten().fieldErrors)
    // Return parsed defaults when validation fails
    return envSchema.parse({})
  }
  return parsed.data
}

// Export the singleton validated environment configuration for the entire app
export const env = getEnv()
