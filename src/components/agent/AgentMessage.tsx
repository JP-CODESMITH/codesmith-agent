interface AgentMessageProps {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export function AgentMessage({ role, content }: AgentMessageProps) {
  const roleStyles = {
    user: 'bg-gray-100 dark:bg-gray-800',
    assistant: 'bg-blue-50 dark:bg-blue-900/20',
    system: 'bg-yellow-50 dark:bg-yellow-900/20',
  }

  return (
    <div className={`rounded-lg p-4 ${roleStyles[role]}`}>
      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase">
        {role}
      </div>
      <div className="text-sm whitespace-pre-wrap">{content}</div>
    </div>
  )
}
