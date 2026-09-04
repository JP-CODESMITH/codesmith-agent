// Import Zod for runtime validation of user input
import { z } from 'zod'

// Schema for validating agent input: goal must be a non-empty string (1-10000 chars)
export const AgentInputSchema = z.object({
  goal: z.string().min(1, 'Goal is required').max(10000, 'Goal is too long'),
})

// Inferred TypeScript type from the Zod schema for type-safe input handling
export type AgentInputValidated = z.infer<typeof AgentInputSchema>
