// Defines the set of supported AI provider names for the agent to use
export type AIProviderName =
  | 'nvidia'    // NVIDIA AI provider
  | 'openai'    // OpenAI provider
  | 'anthropic' // Anthropic provider
  | 'google'    // Google AI provider
  | 'local'     // Local/self-hosted model provider
  | 'placeholder' // Placeholder for development/testing before a real provider is connected

// Represents a single message in a conversation with the AI
export interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool' // The role of the message sender in the conversation
  content: string // The actual text content of the message
  toolCallId?: string // Optional ID linking this message to a tool call result
}

// Describes a tool that the AI can use, including its name and input contract
export interface AIToolDefinition {
  name: string // Unique identifier for the tool
  description: string // Human-readable description of what the tool does
  inputSchema: Record<string, unknown> // JSON schema defining the expected input structure for the tool
}

// Represents a specific tool invocation made by the AI during a response
export interface AIToolCall {
  id: string // Unique identifier for this specific tool call
  name: string // The name of the tool being called
  arguments: Record<string, unknown> // The arguments/parameters passed to the tool
}

// The request payload sent to an AI provider with the full conversation context
export interface AIRequest {
  messages: AIMessage[] // All conversation messages to send as context
  tools?: AIToolDefinition[] // Optional tool definitions the AI can use
  temperature?: number // Controls randomness in the AI's responses (lower = more deterministic)
  maxTokens?: number // Maximum number of tokens the AI can generate in its response
}

// The response received back from an AI provider
export interface AIResponse {
  message: string // The AI's generated text response
  toolCalls: AIToolCall[] // Any tool calls the AI requested to execute
  usage?: { // Optional token usage information
    promptTokens: number // Number of tokens in the input prompt
    completionTokens: number // Number of tokens in the AI's response
    totalTokens: number // Total tokens used for this request
  }
}
