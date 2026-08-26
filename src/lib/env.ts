import { z } from 'zod'

const envSchema = z.object({
  AI_PROVIDER: z.enum(['ollama', 'nvidia', 'openai', 'anthropic']).default('ollama'),
  NVIDIA_API_KEY: z.string().optional(),
  OLLAMA_BASE_URL: z.string().url().default('http://localhost:11434'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_BASE_URL: z.string().url().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
})

export type Env = z.infer<typeof envSchema>

function getEnv(): Env {
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    console.warn('Invalid environment variables:', parsed.error.flatten().fieldErrors)
    return envSchema.parse({})
  }
  return parsed.data
}

export const env = getEnv()
