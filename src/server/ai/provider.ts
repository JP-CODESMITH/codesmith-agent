// Import the provider and request/response types for the AI provider system
import type { AIProvider, AIRequest, AIResponse } from './types'

// Placeholder provider that returns a fixed response instead of calling a real LLM
// Used during development and as a fallback when no real provider is configured
export class PlaceholderProvider implements AIProvider {
  readonly name = 'placeholder' // Identifier for this provider type

  // Generate a placeholder response (no real AI call is made)
  async generateResponse(_request: AIRequest): Promise<AIResponse> {
    // TODO: Implement real LLM integration
    return {
      message: 'Placeholder response. LLM not yet connected.', // Fixed response text
      toolCalls: [], // No tool calls in placeholder mode
    }
  }
}

// Module-level variable holding the current active AI provider instance
let currentProvider: AIProvider = new PlaceholderProvider()

// Get the currently configured AI provider
export function getAIProvider(): AIProvider {
  return currentProvider
}

// Replace the current AI provider with a new one (for switching providers)
export function setAIProvider(provider: AIProvider): void {
  currentProvider = provider
}
