import { createCliRenderer } from '@opentui/core'
import { createRoot } from '@opentui/react'
import { useState, useCallback } from 'react'
import { useKeyboard, useRenderer } from '@opentui/react'
import { createAIProvider } from '~/ai/provider'
import { runAgentTurn } from '~/agent/loop'
import { createDefaultToolRegistry } from '~/agent/agent'
import { detectProject } from '~/project/detector'
import { permissionGate } from '~/security/permissions'
import { createCodeSmithSession } from '~/session/session'
import type { CodeSmithSession } from '~/session/types'

export interface TuiOptions {
  projectPath: string
}

// Determine the status label from the current session state
function getStatusLabel(session: CodeSmithSession): string {
  if (session.errors.length > 0) return 'Error'
  if (session.state === 'thinking') return 'Thinking'
  if (session.state === 'executing') return 'Running'
  return 'Ready'
}

// Main TUI entry point
export async function runCodeSmithTui(options: TuiOptions): Promise<void> {
  const project = detectProject(options.projectPath)
  const session = createCodeSmithSession(project)

  // Smoke mode: run without TTY for automated testing/CI checks
  if (!process.stdin.isTTY || process.argv.includes('--smoke')) {
    process.stdout.write(`CodeSmith Agent TUI\n`)
    return
  }

  // Create the CLI renderer and React root
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
    targetFps: 30,
    backgroundColor: '#0B1020',
  })

  const root = createRoot(renderer as any)

  // Render the React app into the terminal
  root.render(<App session={session} />)
}

// Props for the main App component
interface AppProps {
  session: CodeSmithSession
}

// Root React component that manages the TUI state and layout
function App({ session }: AppProps) {
  const [currentSession, setCurrentSession] = useState(session)
  const [inputValue, setInputValue] = useState('')
  const renderer = useRenderer()

  // Handle user message submission: call the agent turn and update session
  const handleSubmit = useCallback(async () => {
    const message = inputValue.trim()
    if (!message) return

    setInputValue('')
    setCurrentSession((prev) => ({
      ...prev,
      state: 'thinking',
      updatedAt: Date.now(),
    }))

    // Call the shared agent loop directly; no HTTP server required
    const result = await runAgentTurn(
      {
        session: currentSession,
        aiProvider: createAIProvider({ provider: 'placeholder' }),
        permissions: permissionGate,
        tools: createDefaultToolRegistry(),
      },
      { message },
    )

    setCurrentSession(result.session)
  }, [inputValue, currentSession])

  // Handle 'q' key to quit the application
  useKeyboard((key) => {
    if (key.name === 'q' && !inputValue) {
      renderer.destroy()
    }
  })

  const TuiBox = 'box' as any
  const TuiText = 'text' as any
  const TuiInput = 'input' as any

  return (
    <TuiBox flexDirection="column" backgroundColor="#0B1020" padding={1} width="100%" height="100%">
      {/* Main frame with border */}
      <TuiBox
        flexDirection="column"
        border
        borderStyle="rounded"
        borderColor="#6EA8FE"
        backgroundColor="#101827"
        width="100%"
        height="100%"
      >
        {/* Header: agent name and status */}
        <TuiText fg="#E6EDF7" height={1}>
          {`CodeSmith Agent                              * ${getStatusLabel(currentSession)}`}
        </TuiText>

        {/* Body: conversation messages */}
        <TuiText fg="#D5E1F2" flexGrow={1}>
          {renderConversation(currentSession)}
        </TuiText>

        {/* Status bar: tool status and quit instructions */}
        <TuiText fg="#8FB3FF" height={1}>
          {`${renderToolStatus(currentSession)} | q or Ctrl+C exits safely`}
        </TuiText>

        {/* Input field */}
        <TuiInput
          id="codesmith-input"
          placeholder="> Type a task..."
          textColor="#FFFFFF"
          cursorColor="#8FF0A4"
          backgroundColor="#151F32"
          focusedBackgroundColor="#1D2A42"
          width="100%"
          value={inputValue}
          onChange={(e: any) => setInputValue(e.value ?? e)}
          onSubmit={handleSubmit}
        />
      </TuiBox>
    </TuiBox>
  )
}

// Render the conversation messages as a formatted string
function renderConversation(session: CodeSmithSession): string {
  const lines = session.messages.flatMap((message) => {
    const label = message.role === 'user' ? 'You' : 'CodeSmith'
    return [`${label} > ${message.content}`]
  })

  if (lines.length === 0) {
    return [
      formatProjectSummary(session),
      '',
      'You >',
      '',
      'CodeSmith > Phase 1 terminal foundation is ready.',
    ].join('\n')
  }

  // Show only the last 16 messages to keep the display manageable
  return lines.slice(-16).join('\n')
}

// Render the most recent tool execution status
function renderToolStatus(session: CodeSmithSession): string {
  if (session.tools.length === 0) return 'Tools: idle'
  const lastTool = session.tools.at(-1)
  if (!lastTool) return 'Tools: idle'
  return `Tool: ${lastTool.toolName} ${lastTool.result?.ok ? 'completed' : 'failed'}`
}

// Format a human-readable project summary string
function formatProjectSummary(session: CodeSmithSession): string {
  const types = session.project.types.length
    ? session.project.types.join(', ')
    : 'unknown'
  const entries = session.project.entryPoints.length
    ? session.project.entryPoints.join(', ')
    : 'none detected'

  return [
    `Project: ${session.project.root}`,
    `Type: ${types}`,
    `Package manager: ${session.project.packageManager ?? 'unknown'}`,
    `Git: ${session.project.hasGit ? 'yes' : 'no'}`,
    `Entry points: ${entries}`,
  ].join('\n')
}
