// Props interface for the AgentMessage component
interface AgentMessageProps {
  role: 'user' | 'assistant' | 'system' // The role determines the message styling
  content: string // The text content to display
}

// Display a single message bubble with role-based styling and formatting
export function AgentMessage({ role, content }: AgentMessageProps) {
  // Map each role to a distinct background color (light/dark mode)
  const roleStyles = {
    user: 'bg-gray-100 dark:bg-gray-800',       // User messages: gray
    assistant: 'bg-blue-50 dark:bg-blue-900/20', // Assistant messages: blue tint
    system: 'bg-yellow-50 dark:bg-yellow-900/20', // System messages: yellow tint
  }

  return (
    <div className={`rounded-lg p-4 ${roleStyles[role]}`}>
      {/* Role label shown in uppercase as a header */}
      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase">
        {role}
      </div>
      {/* The actual message content, preserving whitespace formatting */}
      <div className="text-sm whitespace-pre-wrap">{content}</div>
    </div>
  )
}
