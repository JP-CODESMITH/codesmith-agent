import type { AIProviderName, AIRequest, AIResponse } from './types'

export interface AIProvider {
  readonly name: AIProviderName
  sendMessage(request: AIRequest): Promise<AIResponse>
  streamResponse?(
    request: AIRequest,
  ): AsyncIterable<{ content: string; done?: boolean }>
}

export interface AIProviderConfig {
  provider: AIProviderName
  apiKey?: string
  baseUrl?: string
  model?: string
}

export class PlaceholderAIProvider implements AIProvider {
  readonly name = 'placeholder'

  async sendMessage(_request: AIRequest): Promise<AIResponse> {
    return {
      message:
        'CodeSmith Agent core is ready. Connect an AI provider to enable real responses.',
      toolCalls: [],
    }
  }
}

export function createAIProvider(config?: Partial<AIProviderConfig>): AIProvider {
  if (!config?.provider || config.provider === 'placeholder') {
    return new PlaceholderAIProvider()
  }

  return new PlaceholderAIProvider()
}
