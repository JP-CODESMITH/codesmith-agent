// Type definitions for the server-side AI subsystem

// A single message in the conversation with the AI provider
export interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool' // The sender role in the conversation
  content: string // The text content of the message
  toolCallId?: string // Optional ID linking to a tool call result
}

// The request payload sent to an AI provider with the full conversation context
export interface AIRequest {
  messages: AIMessage[] // All conversation messages to send as context
  tools?: AIToolDefinition[] // Optional tool definitions the AI can use
  temperature?: number // Controls randomness in the AI's responses
  maxTokens?: number // Maximum tokens the AI can generate
}

// Represents a specific tool invocation made by the AI during a response
export interface AIToolCall {
  id: string // Unique identifier for this specific tool call
  name: string // The name of the tool being called
  arguments: Record<string, unknown> // The arguments passed to the tool
}

// The response received back from an AI provider
export interface AIResponse {
  message: string // The AI's generated text response
  toolCalls: AIToolCall[] // Any tool calls the AI requested to execute
  usage?: { // Optional token usage statistics
    promptTokens: number // Tokens in the input prompt
    completionTokens: number // Tokens in the AI's response
    totalTokens: number // Total tokens consumed
  }
}

// Describes a tool that the AI can use, including its input contract
export interface AIToolDefinition {
  name: string // Unique identifier for the tool
  description: string // Human-readable description of what the tool does
  inputSchema: Record<string, unknown> // JSON schema defining expected input structure
}

// Interface that all AI providers must implement to be used by the agent
export interface AIProvider {
  readonly name: string // The provider's name identifier
  generateResponse(request: AIRequest): Promise<AIResponse> // Generate a text response
}
