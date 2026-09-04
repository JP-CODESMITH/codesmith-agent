// Import type definitions for the AI provider name and request/response types
import type { AIProviderName, AIRequest, AIResponse } from './types'

// Interface defining the contract that all AI providers must implement
export interface AIProvider {
  readonly name: AIProviderName // The provider's unique name identifier
  sendMessage(request: AIRequest): Promise<AIResponse> // Send a message and get a response
  // Optional streaming method that yields chunks of content
  streamResponse?(
    request: AIRequest,
  ): AsyncIterable<{ content: string; done?: boolean }>
}

// Configuration shape for initializing an AI provider
export interface AIProviderConfig {
  provider: AIProviderName // Which provider to use
  apiKey?: string // Optional API key for the provider
  baseUrl?: string // Optional custom base URL for the API endpoint
  model?: string // Optional specific model to use
}

// Placeholder provider that returns fixed messages instead of calling a real LLM
export class PlaceholderAIProvider implements AIProvider {
  readonly name = 'placeholder' // Identifier for this placeholder provider

  // Return a fixed message indicating no real provider is connected
  async sendMessage(_request: AIRequest): Promise<AIResponse> {
    return {
      message:
        'CodeSmith Agent core is ready. Connect an AI provider to enable real responses.',
      toolCalls: [], // No tool calls in placeholder mode
    }
  }
}

// Factory function to create an AI provider instance based on configuration
// Currently always returns the placeholder provider; real providers to be added later
export function createAIProvider(config?: Partial<AIProviderConfig>): AIProvider {
  if (!config?.provider || config.provider === 'placeholder') {
    return new PlaceholderAIProvider()
  }

  return new PlaceholderAIProvider()
}
