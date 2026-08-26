import type { AIProvider, AIRequest, AIResponse } from './types'

export class PlaceholderProvider implements AIProvider {
  readonly name = 'placeholder'

  async generateResponse(_request: AIRequest): Promise<AIResponse> {
    // TODO: Implement real LLM integration
    return {
      message: 'Placeholder response. LLM not yet connected.',
      toolCalls: [],
    }
  }
}

let currentProvider: AIProvider = new PlaceholderProvider()

export function getAIProvider(): AIProvider {
  return currentProvider
}

export function setAIProvider(provider: AIProvider): void {
  currentProvider = provider
}
