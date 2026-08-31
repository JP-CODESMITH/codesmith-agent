export type AIProviderName =
  | 'nvidia'
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'local'
  | 'placeholder'

export interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string
  toolCallId?: string
}

export interface AIToolDefinition {
  name: string
  description: string
  inputSchema: Record<string, unknown>
}

export interface AIToolCall {
  id: string
  name: string
  arguments: Record<string, unknown>
}

export interface AIRequest {
  messages: AIMessage[]
  tools?: AIToolDefinition[]
  temperature?: number
  maxTokens?: number
}

export interface AIResponse {
  message: string
  toolCalls: AIToolCall[]
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}
